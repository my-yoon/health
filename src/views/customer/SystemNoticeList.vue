<template>
    <section>
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch ref="dateSearch" :dateTitle="'기간조회'" :pickerOnly="false"
                    :selectOptions="[{ label: '등록일자', value: '등록일자' }, { label: '수정일자', value: '수정일자' }]"
                    :setDay="state.setDay" @onSelectDate="onSelectPicker" />
                <div class="btn-filter-set">
                    <button class="btn btn-sm" type="button" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button class="btn btn-sm" type="button" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button class="btn btn-sm" type="button" @click="openMoreSerch">
                        <span class="txt">상세검색 열기</span>
                    </button>
                </div>
            </div>
            <!-- 상세검색 -->
            <div v-if="state.openMore" class="ui-data-filter-more">
                <div class="form-item">
                    <div class="item">
                        <label>조건검색</label>
                        <span class="input">
                            <span class="dv">
                                <selectBox selectType="category" @changedValue="selectedOptions" />
                            </span>
                            <span class="dv"><input v-model="formData.searchText" class="form-control sm"
                                    type="text"></span>
                        </span>
                    </div>
                    <div class="item">
                        <label>공지대상</label>
                        <span class="input">
                            <span class="dv">
                                <select v-model="formData.exposeGroupType" class="custom-select sm">
                                    <option v-for="(item, index) in state.exposeGroupList" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item">
                        <label>공지구분</label>
                        <span class="input">
                            <span class="dv">
                                <span v-for="(item, index) in state.noticeTypeList" :key="index" class="radio">
                                    <input :id="'noticeType' + index" v-model="formData.noticeType" :value="item.value"
                                        name="noticeType" type="radio">
                                    <label :for="'noticeType' + index">{{ item.label }}</label>
                                </span>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>노출여부</label>
                        <span class="input">
                            <span class="dv">
                                <span v-for="(item, index) in state.exposeYnlist" :key="index" class="radio">
                                    <input :id="'exposeYn' + index" v-model="formData.exposeYn" :value="item.value"
                                        name="exposeYn" type="radio">
                                    <label :for="'exposeYn' + index">{{ item.label }}</label>
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
                    <button class="btn btn-ss" type="button" @click="checkDel">
                        삭제
                    </button>
                    <button class="btn btn-ss" type="button" @click="checkRegist">등록
                    </button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button class="btn btn-opt" type="button"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', excelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />
                    <button class="btn btn-opt-ico fit" type="button" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                    <!-- 클래스 : full -->
                    <!-- 클래스 : close -->
                    <button class="btn btn-opt-ico filter full" type="button" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData v-if="state.noticeList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef" :domLayout="'autoHeight'"
                    :rowData="state.noticeList" :rowSelection="'multiple'" :suppressRowClickSelection="true"
                    class="ag-theme-alpine" @grid-ready="onGridReady" @cell-clicked="onCellClicked"
                    @selection-changed="onRowSelect">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                    @changedPage="onChangedPage" />
            </div>
        </div>
    </section>
</template>
<script>
import { computed, reactive, inject, onMounted, onUnmounted, ref } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { _delSystemNoticeList, _getSystemNoticeList } from '@/api/customer.js';
import codeList from '@/data/commcode/codeList.js';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: { DefaultModal, DateSerch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const dateSearch = ref(null);
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();

        const initColum = ref([
            {
                headerName: '선택',
                field: 'select',
                maxWidth: 50,
                checkboxSelection: true,
                headerCheckboxSelection: true
            },
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 70,
                valueGetter: 'node.rowIndex + 1'
                //suppressSizetoFit: true
            },
            { headerName: '시스템공지구분', field: 'systemNoticeTypeName', maxWidth: 130 },
            {
                headerName: '제목',
                field: 'systemNoticeTitle',
                width: 350,
                cellClass: 't-left',
                cellRenderer: params => {
                    return '<a >' + params.value + '</a>';
                }
            },
            { headerName: '공지대상', field: 'systemNoticeExposeGroupName', maxWidth: 120 },
            { headerName: '예약노출기간', field: 'exposeDt', maxWidth: 170 },
            { headerName: '노출화면', field: 'exposeScreenName', maxWidth: 100 },
            { headerName: '조회수', field: 'inquiryNum', maxWidth: 80 },
            { headerName: '등록일자', field: 'registDt', maxWidth: 120 },
            { headerName: '수정일자', field: 'updateDt', maxWidth: 120 },
            { headerName: '노출상태', field: 'exposeYn', maxWidth: 100 }
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

            noticeList: [],
            delList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            //기간조회 버튼 옵션

            openMore: false,
            // 공지 구분
            noticeTypeList: [
                { label: '전체', value: '' }
            ],
            // 공지 대상
            exposeGroupList: [
                { label: '전체', value: '' }
            ],
            exposeYnlist: [
                { label: '전체', value: 'all' },
                { label: '노출', value: 'y' },
                { label: '비노출', value: 'n' }
            ],
            searchKeyword: '',
            setDay: '1month',
            menuCode: computed(() => menuInfo.value.menuCode)
        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => {
            //155000 공지 구분
            codeList.getGroupCode(155000).then(result => {
                state.noticeTypeList.push(...result);
            });
            //152000 문의유형
            codeList.getGroupCode(156000).then(result => {
                state.exposeGroupList.push(...result);
            });
            getSystemNoticeList();

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
            goToPage('/cs_center/system_notice/register');
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
            listDel();
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            if (type === 'day') {
                state.startday = value[0];
                state.endday = value[1];
            } else if (type === 'self_end' || type === 'self_start') {
                // 직접 데이터 피커 설정
                if (type === 'self_start') {
                    state.startday = value;
                } else if (type === 'self_end') {
                    state.endday = value;
                }
            }
            //console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
            status === '등록일자' ? formData.inqType = 'regDate' : formData.inqType = 'updDate';
        };
        // 상세 검색 열기
        const openMoreSerch = () => {
            state.openMore = !state.openMore;
        };

        // 검색 조건
        const formData = reactive({
            inqType: 'regDate', //수정or등록
            fromDate: computed(() => state.startday), //시작일
            toDate: computed(() => state.endday), //종료일
            searchType: 'all', //공지검색구분
            searchText: '', //내용
            noticeType: '', //공지  구분
            exposeGroupType: '', //공지 대상
            exposeYn: 'all',  // 노출 여부
            menuCode: state.menuCode,
            page: 0
        });

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };
        // 체크 박스 선택시
        const onRowSelect = () => {
            const rowlist = state.gridApi.getSelectedRows();
            state.delList = rowlist.map(item => item.systemNoticeSn);
        };
        //테이블 셀 선택
        const onCellClicked = (e) => {
            if (e.colDef.field === 'systemNoticeTitle') goToPage('/cs_center/system_notice/detail?systemNoticeSn=' + e.data.systemNoticeSn);
        };
        //페이징 처리
        const onChangedPage = (num) => {
            pager.current = num;
            //테이블 인덱스 번호 처리
            initColum.value[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getSystemNoticeList();
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            formData.inqType = 'te'; //수정or등록
            formData.fromDate = computed(() => state.startday); //시작일
            formData.toDate = computed(() => state.endday); //종료일
            formData.searchType = 'all'; //공지검색구분
            formData.searchText = ''; //내용
            formData.noticeType = 155000; //공지  구분
            formData.exposeGroupType = 156000; //공지 대상
            formData.exposeYn = 'all';  // 노출 여부
            formData.page = 0;
            formData.menuCode = state.menuCode;
            onChangedPage(num);
        };
        //리스트 조회
        const getSystemNoticeList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    inqType: formData.inqType,                  // 검색 날짜 유형
                    bgnDate: formData.fromDate,                 // 예약 노출 시작일시
                    endDate: formData.toDate,                   // 예약 노출 종료일시
                    searchType: formData.searchType,            // 검색 유형
                    searchText: formData.searchText,            // 검색 내용
                    exposeYn: formData.exposeYn,                // 노출 여부
                    noticeType: formData.noticeType,            // 공지 타입
                    exposeGroupPartnerYn: 'N',                  // 공지 대상 파트너 여부
                    exposeGroupType: formData.exposeGroupType,  // 노출 그룹 타입
                    menuCode: state.menuCode,                   // 메뉴코드
                    page: 0
                };
                const response = await _getSystemNoticeList(params);
                const list = response.data.data.list;

                pager.totalCnt = response.data.data.totalCnt;
                state.noticeList = list.map((item) => {
                    item.registDt = !!item.registDt ? dayJS(item.registDt).format('YYYY-MM-DD') : '';
                    item.updateDt = !!item.updateDt ? dayJS(item.updateDt).format('YYYY-MM-DD') : '';
                    item.exposeDt = !!item.exposeBeginDt ? dayJS(item.exposeBeginDt).format('YYYY-MM-DD') + ' ~ ' + dayJS(item.exposeEndDt).format('YYYY-MM-DD') : '';
                    return item;
                });
            } catch (error) {
                console.log(error);
            }
        };
        //삭제 컨펌
        const listDel = () => {
            if (state.delList.length === 0) {
                $Modal.simple({
                    message: '삭제할 리스트가 없습니다.',
                    buttonText: {
                        ok: '확인'
                    }
                });
            } else {
                $Modal.confirm({
                    message: '선택하신 등록 건을 삭제하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                }).then(success => {
                    console.log(success);
                    if (success === 'confirm') {
                        delSystemNoticeList();
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        };
        // 리스트 삭제
        const delSystemNoticeList = async () => {
            try {
                await _delSystemNoticeList({ systemNoticeSnList: Object.values(state.delList) }).then(result => {
                    if (result.data.code === 'OK') {
                        getSystemNoticeList();
                        state.delList = [];
                    } else {
                        console.log(result.data);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };
        // 조회 초기화
        const onInitDate = () => {
            console.log(formData.fromDate);
            dateSearch.value.initDate();
            //리스트 재조회
            clearList(1);
        };

        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            } else if (type === 'category') {
                if (value === 'all') {
                    formData.searchType = 'all';
                } else if (value === 'Y') {
                    formData.searchType = 'title';
                } else if (value === 'N') {
                    formData.searchType = 'content';
                }
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
            return state.filterCoulm;
        };


        const excelParams = {
            params: formData,
            url: '/common/api/v1/customer/system-notice/excel'
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            isPartnerShow,
            openModal,
            pager,
            state,
            initColum,
            formData,
            dateSearch,
            onGridReady,
            onCellClicked,
            openMoreSerch,
            reloadList,
            onChangedPage,
            selectedOptions,
            checkOptions,
            resetTable,
            onRowSelect,
            onSelectPicker,
            onInitDate,
            listDel,
            menuInfo,
            checkRegist,
            checkDel,
            excelParams,
            onChangeDownRol

        };
    }
};
</script>