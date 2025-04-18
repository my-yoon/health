<template>
    <section>
        <!-- 검색
            updateDateSearch: 'N', //수정or등록
            from: computed(() => state.startday), //시작일
            to: computed(() => state.endday), //종료일
            title: '', //제목
            content: '', //내용
            category: 0, //공지구분
            approvalStatus: 0, //승인상태
            type: 0, //공지유형
            corporationCode: '', //기업검색
            fixed: 'N' //공지고정
            {{ formData }}
        -->

        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch"
                    :selectOptions="[{ label: '등록일자', value: '등록일자' }, { label: '수정일자', value: '수정일자' }]" />
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button type="button" class="btn btn-sm" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button type="button" class="btn btn-sm" @click="openMoreSerch">
                        <span class="txt">상세검색 열기</span>
                    </button>
                </div>
            </div>
            <!-- 상세검색 -->
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <div class="item">
                        <label>공지구분</label>
                        <span class="input">
                            <span class="dv">

                                <commselect ref="noticeCategoryCdBC" :className="'sm'" :initData="formData.noticeCategoryCd"
                                    :selectType="'searchCode.noticeCategoryCdBC'" @changedValue="selectedOptions" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>조건검색</label>
                        <span class="input">
                            <span class="dv">
                                <selectBox :selectType="'category'" @changedValue="selectedOptions_list" />
                            </span>
                            <span class="dv"><input type="text" class="form-control sm" v-model="formData.searchText"
                                    :disabled="formData.searchType == '' || formData.searchType == 'all'"></span>
                        </span>
                    </div>
                    <div class="item">
                        <label>승인상태</label>
                        <span class="input">
                            <span class="dv">
                                <span class="radio">
                                    <!-- {{ formData.approvalStatusCd }} -->
                                    <input id="service01" name="service135000" type="radio"
                                        v-model="formData.approvalStatusCd" value="">
                                    <label for="service01">전체</label>
                                </span>
                                <commradio :selectType="'searchCode.approvalStatusCd'" :initData="formData.approvalStatusCd"
                                    @changedValue="selectedOptions" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>고정공지</label>
                        <span class="input">
                            <span class="dv">
                                <span class="checkbox">
                                    <input id="columChk1" name="columChkGroup" type="checkbox" v-model="state.noticePin">
                                    <label for="columChk1">고정</label>
                                </span>
                            </span>
                        </span>
                    </div>

                </div>

            </div>
        </div>
        <!-- {{ formData }} -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="checkDel">
                        삭제
                    </button>
                    <button type="button" class="btn btn-ss" @click="checkRegist">등록</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" ref="pageSelect" @changedValue="selectedOptions_list" />
                    <button type="button" class="btn btn-opt-ico fit" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                    <!-- 클래스 : full -->
                    <!-- 클래스 : close -->
                    <button type="button" class="btn btn-opt-ico filter full" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.noticeList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c" :rowData="state.noticeList"
                    @grid-ready="onGridReady" @cell-clicked="onCellClicked" :suppressRowClickSelection="true"
                    @selection-changed="onRowSelect" :rowSelection="'multiple'" class="ag-theme-alpine"
                    :domLayout="'autoHeight'">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>
    </section>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, onMounted, onUnmounted, ref } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { commoCode } from '@/data/commcode';
import { useStore } from 'vuex';
import { _getNoticeList, _delNoticeList } from '@/api/customer.js';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const pageSelect = ref(null);
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();

        const { onChangeRegistRol, onChangeDelRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

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
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            {
                headerName: '공지구분',
                field: 'noticeCategoryCd',
                maxWidth: 100,
                // valueGetter: (params) => commoCode.searchCode.noticeCategoryCdBC.filter(d => d.value == params.data.noticeCategoryCd)[0].cmnCdNm || ''
                valueGetter: (params) => {
                    //        
                    if (params.data.noticeCategoryCd === 227005 || params.data.noticeCategoryCd === 0 || params.data.noticeCategoryCd === '') return '전체';
                    if (params.data.noticeCategoryCd === 227006) return '일반';
                    if (params.data.noticeCategoryCd === 227007) return '서비스';
                    if (params.data.noticeCategoryCd === 227008) return '커머스';
                    if (params.data.noticeCategoryCd === 227009) return '메디컬/디벨로퍼';
                    if (params.data.noticeCategoryCd === 227010) return '루틴/커뮤니티/챌린지';
                    if (params.data.noticeCategoryCd === 227011) return '이벤트/프로모션';
                }
            },
            { headerName: '제목', field: 'title', width: 350 },
            { headerName: '작성기업', field: 'corporationName', maxWidth: 120 },
            { headerName: '승인상태', field: 'aprrovalStatusNm', maxWidth: 100 },
            { headerName: '반려사유', field: 'declineReasonNm', maxWidth: 150 },
            { headerName: '조회수', field: 'viewsCnt', maxWidth: 80 },
            { headerName: '등록일자', field: 'createAt', maxWidth: 120 },
            { headerName: '수정일자', field: 'updateAt', maxWidth: 120 },
            { headerName: '고정공지', field: 'fixed', maxWidth: 100 },
            { headerName: '노출여부', field: 'showStatus', maxWidth: 100 }

        ]);

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
            noticePin: false,
            startDay: '',
            endDay: '',
            searchKeyword: '',
            setDay: '1month',
            allStatusCd: '0',
            approvalStatusCd: ''
        });

        // 검색 조건
        const formData = reactive({
            inqType: 'regDate', //수정or등록
            fromDate: computed(() => state.startDay), //시작일
            toDate: computed(() => state.endDay), //종료일
            searchType: '', //공지검색구분
            searchText: '', //내용
            noticeCategoryCd: '', //공지구분
            approvalStatusCd: '', //승인상태 (전체, 승인요청, 승인, 반려)
            exposeTypeCd: '', //공지유형
            corporationCode: '', //기업검색
            fixed: computed(() => state.noticePin ? 'Y' : 'N') //공지고정,
        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                menuCode: computed(() => menuInfo.value.menuCode),
                inqType: computed(() => formData.inqType),
                fromDate: computed(() => formData.fromDate),
                toDate: computed(() => formData.toDate),
                searchType: computed(() => formData.searchType),
                searchText: computed(() => formData.searchText),
                noticeCategoryCd: computed(() => formData.noticeCategoryCd),
                approvalStatusCd: computed(() => formData.approvalStatusCd),
                exposeTypeCd: computed(() => formData.exposeTypeCd),
                corporationCode: computed(() => formData.corporationCode),
                fixed: computed(() => state.noticePin ? 'Y' : 'N')
            },
            url: '/common/api/v1/customerNotice/excel'
        });

        onMounted(() => {
            getNoticeList();

            emitter.$on('onChangeRegist', onChangeRegist);
            emitter.$on('onChangeDel', onChangeDel);
        });

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
            goToPage('/cs_center/notice/detail');
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
                state.startDay = value[0];
                state.endDay = value[1];
            } else if (type === 'self_end' || type === 'self_start') {
                // 직접 데이터 피커 설정
                if (type === 'self_start') {
                    state.startDay = value;
                } else if (type === 'self_end') {
                    state.endDay = value;
                }
            }
            if (status === '등록일자') {
                formData.inqType = 'regDate';
            } else if (status === '수정일자') {
                formData.inqType = 'updDate';
            }
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        // 상세 검색 열기
        const openMoreSerch = () => {
            console.log(state.openMore);
            state.openMore = !state.openMore;
        };


        const onChangeAll = () => {
            console.log('1');
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
            // console.log(params.columnApi);
        };
        // 체크 박스 선택시 
        const onRowSelect = (e) => {
            console.log(state.gridApi.getSelectedRows());
            const rowlist = state.gridApi.getSelectedRows();
            state.delList = rowlist.map(item => item.noticeSn);
        };
        //테이블 셀 선택
        const onCellClicked = (e) => {
            console.log(e.data.noticeSn, state.gridApi.getFocusedCell().column);
            goToPage('/cs_center/notice/detail?noticeSn=' + e.data.noticeSn);
        };
        //페이징 처리 
        const onChangedPage = (num) => {
            pager.current = num;
            //테이블 인덱스 번호 처리
            initColum.value[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getNoticeList();
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            formData.inqType = 'regDate';
            formData.searchType = 'all'; //공지검색구분
            formData.searchText = ''; //내용
            formData.noticeCategoryCd = ''; //공지구분
            formData.approvalStatusCd = ''; //승인상태 (전체, 승인요청, 승인, 반려)
            formData.noticeTypeCd = ''; //공지유형
            formData.corporationCode = ''; //기업검색
            state.noticePin = false;
            state.allStatusCd = '0';
            onChangedPage(num);
        };

        // 엑셀 저장 시 검색 결과와 동일한 결과가 입력되도록 조회 조건 스냅샷 저장
        let paramsSnapshot = {};
        //리스트 조회
        const getNoticeList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    inqType: formData.inqType,
                    fromDate: formData.fromDate,
                    toDate: formData.toDate,
                    searchType: formData.searchType,
                    searchText: formData.searchText,
                    noticeCategoryCd: formData.noticeCategoryCd,
                    approvalStatusCd: formData.approvalStatusCd,
                    exposeTypeCd: formData.exposeTypeCd,
                    corporationCode: formData.corporationCode,
                    fixed: state.noticePin ? 'Y' : ''
                };
                paramsSnapshot = { ...params };
                console.log(params);
                const response = await _getNoticeList(params);
                let list = [];
                list = response.data.data.list;
                console.log(list);
                pager.totalCnt = response.data.data.totalCnt;
                state.noticeList = response.data.data.list;
            } catch (error) {
                console.log(error);
            }
        };
        arr = [
            {wrname: '업무요청 포탈1', startdate: '2014-09-01', enddate: '2014-09-30', wrstate: 'inprogess'},
            {wrname: '업무요청 포탈2', startdate: '2014-09-15', enddate: '2014-09-20', wrstate: 'end'},
            {wrname: '업무요청 포탈3', startdate: '2014-09-20', enddate: '2014-09-30', wrstate: 'inprogess'},
            {wrname: '업무요청 포탈4', startdate: '2014-09-30', enddate: '2014-09-30', wrstate: 'inprogess'}
        ];
        //삭제 컨펌
        const listDel = () => {
            if (state.delList.length === 0) {
                $Modal.simple({
                    title: 'default modal title',
                    message: '삭제할 리스트가 없습니다.',
                    buttonText: {
                        ok: '확인'
                    }
                });
            } else {
                $Modal.confirm({
                    title: 'default modal title',
                    message: '공지사항을 삭제 하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(success => {
                        console.log(success);
                        delNoticeList();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };
        // 리스트 삭제
        const delNoticeList = async () => {
            try {
                const response = await _delNoticeList(state.delList);
                getNoticeList();
                state.delList = [];
            } catch (error) {
                console.log(error);
            }
        };
        // 조회 초기화
        const onInitDate = async () => {
            console.log(formData.fromDate);
            dateSearch.value.initDate();
            pageSelect.value.state.selectOption = 10;
            state.pagesize = 10;
            console.log();
            //리스트 재조회
            clearList(1);

            onChangedPage(1);
        };

        //셀렉트박스 선택
        const selectedOptions_list = (value, type) => {
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
        const selectedOptions = (valueCode, valueName, type) => {
            console.log(type);
            if (type === 'noticeCategoryCdBC') {
                formData.noticeCategoryCd = valueCode;
            } else {
                formData[type] = valueCode;
            }
            console.log(valueCode, valueName, type);
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

        const onClickFileDownload = () => {
            fileDown('', { ...paramsSnapshot, menuCode: '1014001' }, '/common/api/v1/customerNotice/excel');
        };


        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            fileDown,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            openModal,
            pager,
            state,
            initColum,
            formData,
            dateSearch,
            pageSelect,
            onGridReady,
            onCellClicked,
            openMoreSerch,
            reloadList,
            onChangedPage,
            selectedOptions,
            selectedOptions_list,
            checkOptions,
            resetTable,
            onRowSelect,
            onSelectPicker,
            onInitDate,
            listDel,
            onChangeAll,
            onClickFileDownload,

            menuInfo,
            exelParams,
            checkRegist,
            checkDel,
            onChangeDownRol
        };
    }
};
</script>