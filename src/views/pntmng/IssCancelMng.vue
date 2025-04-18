<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :setDay="state.setDay"
                    ref="dateSearch" :selectOptions="optionInfo.dateStatus"
                    :pickerOnly="false" :selectButtonOptions="state.selectButtonOptions" />
                </div>

                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="onChangedPage(1, 'search')">
                        <span class="ico-search"></span>조회</button>
                    <button type="button" class="btn btn-sm" @click="initSearch">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button type="button" class="btn btn-sm" @click="toggleSearch">
                        <span class="txt">{{ searchShow ? '상세검색 닫기' :'상세검색 열기' }}</span>
                    </button>
                </div>
            </div>
            <div v-if="searchShow" class="ui-data-filter-more">
                <div class="form-item">
                    <div class="item">
                        <label>조회조건</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :val="searchData.searchPntKey" :type="'searchPntKey'"
                                    @changedValue="(value) => searchData.searchPntKey = value" :className="'custom-select sm'" />
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="searchData.searchPntValue" @keyup="enterToSearch" :disabled="!searchData.searchPntKey">
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>포인트유형</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'선택'" :grCdId="'207000'" :val="searchData.pntIssTyCd"
                                    @changedValue="(value) => searchData.pntIssTyCd = value" :className="'custom-select sm'" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>발급구분</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'선택'" :grCdId="'214000'" :val="searchData.pntIssSeCd" :delOption="['214002']"
                                    @changedValue="(value) => searchData.pntIssSeCd = value" :className="'custom-select sm'" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>발급대상</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :val="searchData.searchCustKey" :type="'searchCustKey'"
                                    @changedValue="(value) => searchData.searchCustKey = value" :className="'custom-select sm'" />
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="searchData.searchCustValue" @keyup="enterToSearch" :disabled="!searchData.searchCustKey">
                            </span>
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item">
                        <label>지급상태</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'선택'" :grCdId="'215000'" :val="searchData.pntStCd"
                                :delOption="['215001', '215002', '215003', '215008', '215009', '215007']"
                                    @changedValue="(value) => searchData.pntStCd = value" :className="'custom-select sm'" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>카테고리</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'선택'" :grCdId="'290000'" :val="searchData.pntCtgrMjcsCd"
                                    @changedValue="changePntCtgrMjcsCd" :className="'custom-select'" />
                            </span>
                            <span class="dv">
                                <CommonBtn ref="pntCtgrMdcsCdRef" v-if="searchData.pntCtgrMjcsCd" :init="'선택'" :grCdId="searchData.pntCtgrMjcsCd" :val="searchData.pntCtgrMdcsCd"
                                    @changedValue="(value) => searchData.pntCtgrMdcsCd = value" :className="'custom-select'" />
                            </span>
                        </span>
                    </div>
                    <!-- <div class="item">
                        <label>고객사</label>
                        <span class="input">
                            <span class="dv">
                                <input type="text" class="form-control sm" @keyup="enterToSearch">
                            </span>
                            <span class="dv">
                                <button type="button" class="btn btn-opt">찾기</button>
                            </span>
                        </span>
                    </div> -->
                </div>
            </div>
        </div>

        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="reqStatusCheck('reject');">반려</button>
                    <button type="button" class="btn btn-ss" @click="reqStatusCheck('aprv');">승인</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{pager.totalCnt.toLocaleString('ko')}}</strong>건</span>
                    <button type="button" class="btn btn-ss" :disabled="!state.mskgnRlsYn"
                        @click="changeMskgnRlsYn(!state.mskgnRlsYn)">
                        <template v-if="state.mskgnRlsYn">마스킹해제</template>
                        <template v-else>마스킹</template>
                    </button>
                    <button type="button" class="btn btn-opt"
                    @click="onChangeDownRol(menuInfo.auth5DownloadYn, searchData.maskingReleaseYn, exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />
                    <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit" ><span class="offscreen">컬럼 리사이징</span></button>
                    <button type="button" class="btn btn-opt-ico filter"  @click="resetTable"><span class="offscreen">컬럼 셋팅</span></button> <!-- 클래스 : close -->
                </div>
            </div>

            <columlist :columlists="tablelist_issCancelMng_label" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
            <template v-else>
                <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                    :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked"
                    :suppressRowClickSelection="true" @selection-changed="onRowSelect" :rowSelection="'multiple'"
                    class="ag-theme-alpine" :domLayout="'autoHeight'"
                    v-if="state.rowData.length > 0">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                @changedPage="onChangedPage" />
            </template>
        </div>

        <DefaultModal :isShow="isShow && popInfo.modalType == 'aprv'" :modalTitle="popInfo.modalTitle" :buttonConfirm="popInfo.confirmNm" :buttonCancel="popInfo.cancelNm"
            @modalclose="closeModal">
            <template #modalcontent>
                <div>{{ popInfo.modalMessage }}</div>
            </template>
        </DefaultModal>
        <AthrRsnPop v-if="isShow && popInfo.modalType == 'reject'" :baseData="popInfo" @rsnData="closeModal"/>
        <IssHistMngDetailPop v-if="isShow && popInfo.modalType == 'detail'" :pntNoSn="state.data.pntNoSn" :type="'Res'" @modalPlcyclose="closeModal"/>
    </section>
</template>
<script>
import { computed, reactive, onMounted, inject, ref, onUnmounted } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { _getIssHistList, _setAthrAprvRes } from '@/api/pntmng.js';
import IssHistMngDetailPop from '@/views/pntmng/component/IssHistMngDetailPop.vue';
import AthrRsnPop from '@/views/pntmng/component/AthrRsnPop.vue';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { tablelist_issCancelMng_label } from '@/data/table/pntmngtable.js';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { useRouter} from 'vue-router';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: {DefaultModal, DateSerch, IssHistMngDetailPop, AthrRsnPop, CommonBtn },
    setup() {
        const router = useRouter();
        const dateSearch = ref(null);
        const pntCtgrMdcsCdRef  = ref(null);
        const { goToPage } = useCommFunc();
        const { toggleSearch, searchShow, modal, popInfo, isShow } = dmCommFunc();
        const dayJS = inject('dayJS');
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
        const optionInfo = {
            dateStatus: [
                { label: '선택', value: '선택' },
                { label: '발급일', value: 'pntIssDt' },
                { label: '할당일', value: 'pntAsgnDt' },
                { label: '유효기간시작일', value: 'pntVldBgnDate' },
                { label: '유효기간종료일', value: 'pntVldEndDate' }
            ]
        };

        const state = reactive({
            setDay: '1month',
            tableColum_c: _.clone(tablelist_issCancelMng_label),
            rowData: [],
            defaultColDef: {
                sortable: true,
                resizable: true,
                width: 50,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            gridApi: null,
            gridColumApi: null,
            selectButtonOptions: [
                { label: '1년', value: 'year' },
                { label: '6개월', value: '6month' },
                { label: '1개월', value: '1month' },
                { label: '일주일', value: 'week' },
                { label: '당일', value: 'today' }
            ],
            data: {
                pntNoSn: '',
                athrNoSn: ''
            },
            selectList: [],
            athrTypCd: '212006',
            menuCode: menuInfo.value.menuCode,
            mskgnRlsYn: true
        });

        const searchData = reactive({
            searchDateKey: '',
            rgsDtFr: new Date().getTime() - 3600 * 1000 * 24 * 30, //시작일
            rgsDtTo: new Date(), //종료일
            searchPntKey: '', //조회조건 select
            searchPntValue: '', //조회조건Value
            searchCustKey: '',  // 발급대상 select
            searchCustValue: '', // 발급대상 value
            pntIssTyCd: '', //포인트유형
            pntIssSeCd: '', //발급구분
            pntStCd: '', //발급상태
            pntCtgrMjcsCd: '',
            pntCtgrMdcsCd: '',
            listType: '20',
            maskingReleaseYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N'),
            currentPage: computed(() => pager.current),
            pageSize: computed(() => pager.size)
        });

        const exelParams = reactive({
            params: {
                searchDateKey: computed(() => searchData.searchDateKey),
                rgsDtFr: computed(() => dayJS(searchData.rgsDtFr).format('YYYYMMDD')),
                rgsDtTo: computed(() => dayJS(searchData.rgsDtTo).format('YYYYMMDD')),
                searchPntKey: computed(() => searchData.searchPntKey),
                searchPntValue: computed(() => searchData.searchPntValue),
                searchCustKey: computed(() => searchData.searchCustKey),
                searchCustValue: computed(() => searchData.searchCustValue),
                pntIssTyCd: computed(() => searchData.pntIssTyCd),
                pntIssSeCd: computed(() => searchData.pntIssSeCd),
                pntStCd: computed(() => searchData.pntStCd),
                pntCtgrMjcsCd: computed(() => searchData.pntCtgrMjcsCd),
                pntCtgrMdcsCd: computed(() => searchData.pntCtgrMdcsCd),
                listType: computed(() => searchData.listType),
                maskingReleaseYn: computed(() => searchData.maskingReleaseYn),
                pageSize: 0,
                currentPage: 0,
                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: '/common/api/v1/iss/hst/list/excel'
        });

        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: 10,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => {
            emitter.$on('onChangeMskgn', onChangeMskgn);
            onChangedPage(1);
        });

        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
        });
        
        //리스트 파라미터 처리
        const reqData = () => {
            let check = false;
            let params = {
                ...searchData,
                rgsDtFr: dayJS(searchData.rgsDtFr).format('YYYYMMDD'),
                rgsDtTo: dayJS(searchData.rgsDtTo).format('YYYYMMDD')
            };

            if (params.rgsDtFr > params.rgsDtTo) {
                modal('종료일이 시작일보다 이전일 수 없습니다. 다시 입력하세요.');
                check = true;
            }

            return {params, check};
        };

        // 리스트 호출 함수
        const getIssCancelList = async () => {
            try {
                let {params, check} = await reqData();
                if (check) return;
                const response = await _getIssHistList(params);
                if (response.code == 'OK') {
                    state.rowData = response.data.list;
                    pager.totalCnt = parseInt(response.data.totalCount);
                } else {
                    modal(response.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        //검색 초기화
        const initSearch = () => {
            dateSearch.value.initDate();
            searchData.rgsDtFr = new Date().getTime() - 3600 * 1000 * 24 * 30;
            searchData.rgsDtTo = new Date();
            searchData.pntStCd = '';
            searchData.pntPlcyNm = '';
            searchData.pntIssTyCd = '';
            searchData.pntCtgrMjcsCd = '';
            searchData.pntCtgrMdcsCd = '';

            onChangedPage(1);
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            if (type === 'day') {
                searchData.rgsDtFr = value[0];
                searchData.rgsDtTo = value[1];
            } else if (type === 'self_start') {
                searchData.rgsDtFr = value;
            } else if (type === 'self_end') {
                searchData.rgsDtTo = value;
            } else if (type === 'select') {
                searchData.searchDateKey = status == '선택' ? '' : status;
            }
        };

        const showModal = (type) => {
            popInfo.modalType = type;
            popInfo.confirmNm = '확인';
            popInfo.cancelNm = '취소';
            switch (type) {
                case 'reject' :
                    popInfo.modalTitle = '발급 취소 반려';
                    popInfo.modalMessage = '취소 요청 반려사유를 등록해주세요.';
                    break;
                case 'aprv' :
                    popInfo.modalTitle = '발급 취소 승인';
                    popInfo.modalMessage = '선택하신 항목의 발급취소 요청을 승인하시겠습니까?';
                    break;
            }
            isShow.value = true;
        };

        const closeModal = async (type, val) => {
            let status = popInfo.modalType;
            isShow.value = false;
            if (type == 'modalconfirm') {
                if (status == 'reject' || status == 'aprv') {
                    let data = await cancelResData(status, val);
                    setAthrAprvRes(data, status);
                } else if (status == 'detail') {
                    if (!checkAuth()) return;
                    showModal(val);
                }
            } else if (type == 'modaldelete') {
                if (status == 'detail') {
                    if (!checkAuth()) return;
                    showModal(val);
                }
            } else {
                state.data.pntNoSn = '';
                state.data.athrNoSn = '';
            }
        };

        const checkAuth = () => {
            if (menuInfo.value.auth4ApproveYn != 'Y') {
                modal('승인/반려 권한이 없습니다.');
                return false;
            } else {
                return true;
            }
        };

        const cancelResData = async (status, val) => {
            let athrInfArr = [];
            if (state.data.pntNoSn) { // 상세 페이지에서 요청한경우
                athrInfArr = [{
                    athrRqstMngCd: state.data.pntNoSn,
                    athrNoSn: state.data.athrNoSn
                }];
            } else { // 목록에서 요청한 경우
                state.selectList.forEach(item => {
                    let athrInfoData = {
                        athrRqstMngCd: item.pntNoSn,
                        athrNoSn: item.athrNoSn
                    };
                    athrInfArr.push(athrInfoData);
                });
            }

            return {
                athrInfArr: athrInfArr,
                athrTypCd: state.athrTypCd,
                athrStCd: status == 'aprv' ? '215005' : '215006',
                athrRsnCd: status == 'reject' ? val.athrRsnCd : '',
                athrRsnCts: status == 'reject' ? val.athrRsnCts : ''
            };
        };

        const setAthrAprvRes = async (data, status) => {
            let message = status == 'reject' ? '반려가' : '승인이';
            try {
                let response = await _setAthrAprvRes(data);
                if (response.data.code == 'OK') {
                    onChangedPage(pager.current);
                } else {
                    modal(response.data.message ?? message + ' 정상적으로 수행되지 않았습니다.');
                }
            } catch (err) {
                modal(err);
            }
        };

        const reqStatusCheck = (type) => {
            state.data.pntNoSn = '';
            state.data.athrNoSn = '';
            state.memberAprv = '';
            var showValue = true;
            let pntStCd = ['215004'];

            if (!checkAuth()) return;

            if (_.isEmpty(state.selectList) || state.selectList.length <= 0) {
                modal('선택하신 행이 없습니다.');
                return ;
            }

            const nonMatch = [];           // 허용된 값이 아닌경우
            const uniqueValue = new Set(); //현재 선택한 status 값 표현
            state.selectList.forEach((data) => {
                uniqueValue.add(data.pntStCd);
                if (!pntStCd.includes(data.pntStCd)) {
                    nonMatch.push(data.pntStCd);
                    return;
                }
            });

            if (nonMatch.length > 0 || uniqueValue.size > 1) showValue = false;

            if (showValue) {
                showModal(type);
            }
            else {
                if (nonMatch.length > 0) {
                    let etype = type == 'reject' ? '반려' : '승인';
                    let message = state.selectList[0].pntStCdNm + ' 상태는 ' + etype + ' 요청이 불가합니다.';
                    modal(message);
                } else {
                    modal('동일한 상태만 요청이 가능합니다.');
                }
            }
        };

        //페이지수 변경 셀렉트 박스 처리
        const selectedOptions = (value) => {
            pager.size = value;
            onChangedPage(1);
        };

        //테이블 셀클릭 처리
        const cellClicked = (e) => {
            const code = state.gridApi.getFocusedCell().column.colId;
            if (code == 'pntNoSn') {
                state.data.pntNoSn = e.data.pntNoSn;
                state.data.athrNoSn = e.data.athrNoSn;
                showModal('detail');
            }
        };

        // 페이징 처리
        const onChangedPage = (num, type) => {
            state.selectList = [];
            pager.current = num;
            if (type == 'search') state.mskgnRlsYn = true;
            getIssCancelList();
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        // 체크 박스 선택시 
        const onRowSelect = (e) => {
            const rowList = state.gridApi.getSelectedRows();
            state.selectList = rowList;
        };

        //상세 검색 하단 검색 목록 토글 
        // 해제 토글
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            onChangedPage(pager.current);
        };

        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };

        // 테이블 현재창에 맞춤
        const sizeToFit = () => {
            state.gridApi.sizeColumnsToFit();
        };

        // 컬럼 변경
        const resetTable = () => {
            const initColum = _.clone(tablelist_issCancelMng_label);
            state.tableColum_c = initColum.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        const enterToSearch = (e) => {
            if (e.keyCode === 13) onChangedPage(1);
        };

        const changePntCtgrMjcsCd = async (val) => {
            if (searchData.pntCtgrMjcsCd) pntCtgrMdcsCdRef.value.setGrCdId(val);
            searchData.pntCtgrMjcsCd = val;
            searchData.pntCtgrMdcsCd = '';
        };

        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
        };
        
        return {
            tablelist_issCancelMng_label,
            toggleSearch,
            searchShow,
            state,
            popInfo,
            optionInfo,
            dateSearch,
            searchData,
            isShow,
            pager,
            showModal,
            closeModal,
            onChangedPage,
            onSelectPicker,
            selectedOptions,
            goToPage,
            getIssCancelList,
            initSearch,
            cellClicked,
            onGridReady,
            onRowSelect,
            reqStatusCheck,
            checkOptions,
            onChangeMskgn,
            sizeToFit,
            resetTable,
            enterToSearch,
            changePntCtgrMjcsCd,
            pntCtgrMdcsCdRef,
            exelParams,
            onChangeDownRol,
            menuInfo,
            changeMskgnRlsYn
        };
    }
};
</script>
