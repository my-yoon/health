<template>
    <section>
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>조회조건</label>
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
                    <label>등록계정</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.adminType" class="custom-select sm">
                                <option v-for="(item, index) in state.adminTypeList" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                        <span class="dv">
                            <input v-model="formData.searchText2" class="form-control sm" type="text">
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
                    <button class="btn btn-sm" type="button" @click="openMoreSerch">
                        <span class="txt">상세검색 열기</span>
                    </button>
                </div>
            </div>
            <div v-if="state.openMore" class="ui-data-filter-more">
                <div class="form-item">
                    <div class="item">
                        <label>승인상태</label>
                        <span class="input">
                            <span class="dv">
                                <select v-model="formData.aprvType" class="custom-select sm">
                                    <option v-for="(item, index) in state.aprvTypeList" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
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
                        <label>발송시간</label>
                        <span class="input">
                            <span class="dv">
                                <span v-for="(item, index) in state.sndnYnList" :key="index" class="radio">
                                    <input :id="'sndnYn' + index" v-model="formData.sndnYn" :value="item.value"
                                        name="sndnYn" type="radio">
                                    <label :for="'sndnYn' + index">{{ item.label }}</label>
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
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
            <NoData v-if="state.messageList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else ref="agGrid">
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                    :domLayout="state.domLayout" :rowData="state.messageList" class="ag-theme-alpine" style="width:100%"
                    @grid-ready="onGridReady" @cell-clicked="onCellClicked">
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
import { _getCustomerAlarmList } from '@/api/operate.js';
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
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '채널', field: 'channelName', flex: 0.7 },
            { headerName: '메세지 제목', field: 'ttl', flex: 2 },
            { headerName: '발송대상', field: 'sndnTargetName', flex: 0.7 },
            { headerName: '등록계정', field: 'rgsAcNm', flex: 1 },
            { headerName: '승인상태', field: 'approveState', flex: 1 },
            { headerName: '발송(예정)시간', field: 'sndnDt', flex: 1 },
            { headerName: '등록일자', field: 'lastUpdDt', flex: 1 },
            { headerName: '등록자', field: 'fstRgtrSn', flex: 1 }
        ]);

        const store = useStore();
        const { onChangeRegistRol, onChangeDownRol } = authCommFunc();
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
            messageList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            searchKeyword: '',
            domLayout: 'autoHeight',
            // 어드민 구분
            adminTypeList: [
                { label: '전체', value: '' }
            ],
            // 검색조건
            searchTypeList: [
                { label: '메세지제목', value: 'ttl' }
            ],
            // 승인상태
            aprvTypeList: [
                { label: '전체', value: '' }
            ],
            // 채널 타입
            channelTypeList: [
                { label: '전체', value: '' }
            ],
            // 발송일시 타입
            sndnYnList: [
                { label: '전체', value: null },
                { label: '발송시간 이전', value: 'N' },
                { label: '발송시간 경과', value: 'Y' }
            ],
            sendTargetList: [],
            openMore: false,
            menuCode: menuInfo.value.menuCode
        });



        // 검색 조건
        const formData = reactive({
            searchType: 'ttl', // 검색조건
            searchText: '', // 검색내용
            page: 0,
            adminType: '',  // 관리자 구분
            aprvType: '',  // 승인상태
            channelType: '', // 채널
            sndnYn: null, // 발송시간(발송여부)
            menuCode: state.menuCode
        });

        onMounted(async () => {
            // 승인상태
            await codeList.get('approve').then((result) => {
                state.aprvTypeList = [...state.aprvTypeList, ...result];
            });

            // 채널
            await codeList.get('channel').then((result) => {
                state.channelTypeList = [...state.channelTypeList, ...result];
            });

            // 발송대상
            await codeList.get('sendTarget').then((result) => {
                state.sendTargetList = [...result];
            });

            //어드민구분 ( all,Developer 는 비노출)
            await codeList.getGroupCode(111000).then(result => {
                state.adminTypeList.push(...result.filter(item => item.label !== 'All' && item.label !== 'Developer'));
            });

            //메세지 목록
            await getMessageList();

            emitter.$on('onChangeRegist', onChangeRegist);
        });

        /**
         * 마스킹 해제 이벤트 버스 해제
         */
        onUnmounted(() => {
            emitter.$off('onChangeRegist');
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
            goToPage('/alarm/message/register');
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
            getMessageList();
        };

        //리스트 조회
        const getMessageList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    ttl: !!formData.searchText ? formData.searchText : null, // 조회조건
                    chnCd: !!formData.channelType ? formData.channelType : null, // 채널
                    sndnYn: !!formData.sndnYn ? formData.sndnYn : null, // 발송시간
                    searchText2: !!formData.searchText ? formData.searchText : null, // 등록계정
                    prStCd: !!formData.aprvType ? formData.aprvType : null,
                    menuCode: state.menuCode
                };

                const response = await _getCustomerAlarmList(params);

                state.messageList = response.data.data.list.map(item => {
                    // 날짜 format 변경, 등록일(수정일 우선)
                    item.sndnDt = item.sndnDt ? dayJS(item.sndnDt).format('YYYY-MM-DD HH:mm:ss') : '-';
                    item.lastUpdDt = dayJS(item.lastUpdDt ?? item.fstRgsDt).format('YYYY-MM-DD HH:mm:ss');
                    // 채널명 코드 맵핑
                    item.channelName = state.channelTypeList.find(code => item?.chnCd === code.value)?.label;
                    // 승인상태명 코드 맵핑
                    item.approveState = state.aprvTypeList.find(code => item?.prStCd === code.value)?.label;
                    // 발송대상 코드 맵핑
                    item.sndnTargetName = state.sendTargetList.find(code => item?.sndnTrgTypCd === code?.value)?.label;
                    return item;
                });

                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
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

        // 컬럼 변경
        const resetTable = () => {
            const columlist = _.clone(initColum.value);
            state.tableColum_c = columlist.filter(item => !state.filterCoulm.includes(item.headerName));
        };

        const clearList = (num) => {
            formData.searchType = 'ttl'; //공지검색구분
            formData.searchText = ''; //내용
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
            goToPage('/alarm/message/detail?cstNcSn=' + e.data.cstNcSn);
        };

        const excelParams = {
            params: formData,
            url: '/common/api/v1/operationManagement/CustomerAlarm/excel'
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
            resetTable,
            onInitDate,
            reloadList,
            onGridReady,
            openMoreSerch,
            onCellClicked,

            checkRegist,
            onChangeDownRol,
            excelParams,
            menuInfo
        };
    }
};

</script>