<template>
    <section>
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>검색조건</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.searchType" class="custom-select sm">
                                <option v-for="(item, index) in state.searchTypeList" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                        <span class="dv">
                            <input v-model="formData.searchText" class="form-control sm" type="text">
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>채널</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.channelType" class="custom-select sm">
                                <option v-for="(item, index) in state.channelTypeList" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>카테고리</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.sendPurposeType" class="custom-select sm">
                                <option v-for="(item, index) in state.sendPurposeTypeList" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="btn-filter-set">
                    <button class="btn btn-sm" type="button" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button class="btn btn-sm" type="button" @click="reloadList">
                        <span class="ico-search"></span>검색
                    </button>

                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button :disabled="state.deleteList.length === 0" class="btn btn-ss" type="button"
                        @click="checkDel">삭제</button>
                    <button class="btn btn-ss" type="button" @click="checkRegist">등록</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button class="btn btn-opt" type="button"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', excelParams)">
                        <span class="ico-download"></span>
                        파일다운로드
                    </button>
                    <selectBox selectType="page" @changedValue="selectedOptions" />
                </div>
            </div>
            <NoData v-if="state.templateList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else ref="agGrid">
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                    :domLayout="state.domLayout" :rowData="state.templateList" :rowSelection="'multiple'"
                    :suppressRowClickSelection="true" class="ag-theme-alpine" style="width:100%" @grid-ready="onGridReady"
                    @cell-clicked="onCellClicked" @selection-changed="onRowSelect">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                    @changedPage="onChangedPage" />
            </div>
        </div>
    </section>
</template>
<script>
import { computed, reactive, onMounted, onUnmounted, inject, ref } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import codeList from '@/data/commcode/codeList.js';
import { _deleteCustomerAlarmTemp, _getCustomerAlarmTempList } from '@/api/operate.js';
import FileDownLoad from '@/views/operate/components/FileDownLoad.vue';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: { DefaultModal, DateSerch, FileDownLoad },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, tableResize } = useCommFunc();
        const initColum = ref([
            {
                headerName: '선택',
                field: 'select',
                maxWidth: 50,
                checkboxSelection: true,
                headerCheckboxSelection: true
            },
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 70 },
            { headerName: '채널', field: 'channelName', flex: 0.3 },
            { headerName: '템플릿 제목', field: 'ttl', flex: 1 },
            { headerName: '등록계정', field: 'rgsAcNm', flex: 0.5 },
            { headerName: '등록일자', field: 'lastUpdDt', flex: 0.5 },
            { headerName: '등록자', field: 'fstRgtrSn', flex: 0.5 }
        ]);

        const store = useStore();
        const { onChangeRegistRol, onChangeDelRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const state = reactive({
            tableColum_c: _.clone(initColum.value),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            templateList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            searchKeyword: '',
            domLayout: 'autoHeight',
            // 어드민 구분
            adminTypeList: [
                { label: '전체', value: '' },
                { label: 'Payer', value: 111002 },
                { label: 'Seller', value: 111003 },
                { label: 'Medical', value: 111004 },
                { label: 'Developer', value: 111005 }
            ],
            // 검색조건
            searchTypeList: [
                { label: '전체', value: '' },
                { label: '템플릿 제목', value: 'ttl' },
                { label: '메세지 내용', value: 'cts' }
            ],
            // 채널 타입
            channelTypeList: [
                { label: '전체', value: '' }
            ],
            // 발송목적 타입
            sendPurposeTypeList: [
                { label: '전체', value: '' }
            ],
            sendTargetList: [],
            openMore: false,
            deleteList: [],
            menuCode: menuInfo.value.menuCode
        });



        // 검색 조건
        const formData = reactive({
            searchType: '', // 검색조건
            searchText: '', // 검색내용
            channelType: '', // 채널
            sendPurposeType: '', // 발송목적
            menuCode: state.menuCode
        });

        onMounted(async () => {
            // 채널
            await codeList.get('channel').then((result) => {
                state.channelTypeList = [...state.channelTypeList, ...result];
            });

            // 발송목적
            await codeList.get('sendPurpose').then((result) => {
                state.sendPurposeTypeList = [...state.sendPurposeTypeList, ...result];
            });

            //메세지 목록
            await getTemplateList();

            emitter.$on('onChangeRegist', onChangeRegist);
            emitter.$on('onChangeDel', onChangeDel);
        });

        /**
         * 마스킹 해제 이벤트 버스 해제
         */
        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            emitter.$off('onChangeDel');
        });

        /**
         * 등록 권한 체크
         */
        const checkRegist = async () => {
            await onChangeRegistRol(menuInfo.value.auth1RegistYn);
        };

        /**
         * 등록 권한 체크 callback
         */
        const onChangeRegist = () => {
            goToPage('/alarm/message/template/register');
        };

        /**
         * 삭제 권한 체크
         */
        const checkDel = async () => {
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            deleteTemplate();
        };

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        // 페이징 처리
        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            getTemplateList();
        };

        const getTemplateList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    ttl: !!formData.searchText && formData.searchType === 'ttl' ? formData.searchText : null, // 메세지 제목
                    cts: !!formData.searchText && formData.searchType === 'cts' ? formData.searchText : null,  // 메세지 내용
                    chnCd: !!formData.channelType ? formData.channelType : null, // 채널
                    sndnPuCd: !!formData.sendPurposeType ? formData.sendPurposeType : null, // 발송목적
                    menuCode: state.menuCode
                };

                const response = await _getCustomerAlarmTempList(params);

                state.templateList = response.data.data.list.map(item => {
                    // 날짜 format 변경, 등록일(수정일 우선)
                    item.sndnDt = dayJS(item.sndnDt).format('YYYY-MM-DD HH:mm:ss');
                    item.lastUpdDt = dayJS(item.lastUpdDt ?? item.fstRgsDt).format('YYYY-MM-DD HH:mm:ss');
                    // 채널명 코드 맵핑
                    item.channelName = state.channelTypeList.find(code => item?.chnCd === code.value)?.label;
                    return item;
                });

                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };

        const deleteTemplate = () => {
            if (state.deleteList.length > 0) {

                $Modal.confirm({
                    title: '',
                    message: '선택하신 등록 건을 삭제하시겠습니까?',
                    buttonText: {
                        confirm: '예',
                        cancel: '아니요'
                    }
                }).then(async (success) => {

                    for (const item of state.deleteList) {
                        await _deleteCustomerAlarmTemp({ cstNcTmplSn: item });
                    }

                    state.deleteList = [];
                    await getTemplateList();
                }).catch(async error => {
                    console.log(error);
                });
            }
        };

        // 조회 초기화
        const onInitDate = () => {
            //리스트 재조회
            clearList(1);
        };

        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };

        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };

        const clearList = (num) => {
            formData.searchType = ''; //공지검색구분
            formData.searchText = ''; //내용
            formData.channelType = ''; //채널
            formData.sendPurposeType = ''; //채널
            formData.adminType = ''; // 어드민구분
            formData.page = num;

            onChangedPage(num);
        };

        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        // 상세 검색 열기
        const openMoreSerch = () => {
            state.openMore = !state.openMore;
        };

        //테이블 셀 선택
        const onCellClicked = (e) => {
            goToPage('/alarm/message/template/detail?cstNcTmplSn=' + e.data.cstNcTmplSn);
        };

        const onRowSelect = () => {
            const rowlist = state.gridApi.getSelectedRows();
            state.deleteList = rowlist.map(item => item.cstNcTmplSn);
        };
        //엑셀 함수
        const excelParams = {
            params: formData,
            url: '/common/api/v1/operationManagement/CustomerAlarmTemp/excel'
        };
        return {
            $Modal,
            dayJS,
            state,
            pager,
            initColum,
            formData,
            goToPage,
            fileDown,
            tableResize,
            onChangedPage,
            selectedOptions,
            checkOptions,
            onInitDate,
            reloadList,
            onGridReady,
            openMoreSerch,
            onCellClicked,
            onRowSelect,
            // deleteTemplate,

            checkRegist,
            checkDel,
            onChangeDownRol,
            excelParams,
            menuInfo
        };
    }
};

</script>