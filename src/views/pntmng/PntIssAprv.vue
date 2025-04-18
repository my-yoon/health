<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>발급상태</label>
                    <span class="input">
                        <span class="dv">
                            <CommonBtn :init="'선택'" :grCdId="'218000'" :val="searchData.issStCd" :delOption="['218001']"
                                @changedValue="(value) => searchData.issStCd = value" :className="'custom-select sm'" />
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
                    <label>기간조회</label>
                    <span class="input">
                        <span class="dv">
                            <CommonBtn :val="searchData.rgsTyCd" :type="'rgsTyCd'"
                                @changedValue="(value) => searchData.rgsTyCd = value" :className="'custom-select sm'" />
                        </span>
                    </span>
                    <span class="dv">
                        <dateSerch ref="dateSearch" :dateTitle="''" @onSelectDate="onSelectPicker" :setDay="state.setDay" :pickerOnly="true" />
                    </span>
                </div>

                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="onChangedPage(1)">
                        <span class="ico-search"></span>조회 </button>
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
                        <label>정책명</label>
                        <span class="input">
                            <input type="text" class="form-control" v-model="searchData.pntPlcyNm" @keyup="enterToSearch">
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
                </div>
            </div>
        </div>
        <!-- 테이블 -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="checkAuth('reject');">반려</button>
                    <button type="button" class="btn btn-ss" @click="checkAuth('aprv');">승인</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{pager.totalCnt.toLocaleString('ko')}}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />
                    <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit" ><span class="offscreen">컬럼 리사이징</span></button>
                    <button type="button" class="btn btn-opt-ico filter"  @click="resetTable"><span class="offscreen">컬럼 셋팅</span></button> <!-- 클래스 : close -->
                </div>
            </div>

            <columlist :columlists="tablelist_pntIssAprv_label" @checkColum="checkOptions" />
            <NoData v-if="state.rowData.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <template v-else>
                <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked"
                :suppressRowClickSelection="true" @selection-changed="onRowSelect" :rowSelection="'multiple'"
                class="ag-theme-alpine" :domLayout="'autoHeight'" >
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </template>
        </div>
        <AthrRsnPop v-if="isShow && popInfo.modalType != 'aprv'" :baseData="popInfo" @rsnData="closeModal"/>
        <DefaultModal :isShow="isShow && popInfo.modalType == 'aprv'" :modalTitle="popInfo.modalTitle" :buttonConfirm="'확인'" :buttonCancel="'취소'"
            @modalclose="closeModal">
            <template #modalcontent>
                <div >{{ popInfo.modalMessage }}</div>
            </template>
        </DefaultModal>
    </section>
</template>
<script>
import { computed, reactive, onMounted, inject, ref } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { _getPntMnlIssList, _setAthrAprvRes } from '@/api/pntmng.js';
import { tablelist_pntIssAprv_label } from '@/data/table/pntmngtable.js';
import { useRouter} from 'vue-router';
import AthrRsnPop from '@/views/pntmng/component/AthrRsnPop.vue';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: {DefaultModal, DateSerch, AthrRsnPop, CommonBtn },
    setup() {
        const router = useRouter();
        const dateSearch = ref(null);
        const pntCtgrMdcsCdRef  = ref(null);
        const { toggleSearch, searchShow, modal, popInfo, isShow } = dmCommFunc();
        const dayJS = inject('dayJS');
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeDownRol } = authCommFunc();
        const state = reactive({
            setDay: {
                from: new Date().getTime() - 3600 * 1000 * 24 * 30,
                to: new Date()
            },
            tableColum_c: _.clone(tablelist_pntIssAprv_label), //컬럼명 처리
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
            selectList: [],
            athrTypCd: '212005',
            menuCode: menuInfo.value.menuCode
        });

        const searchData = reactive({
            issStCd: '',
            pntIssSeCd: '',
            rgsTyCd: '',
            rgsDtFr: new Date().getTime() - 3600 * 1000 * 24 * 30,
            rgsDtTo: new Date(),
            pntPlcyNm: '',
            pntIssTyCd: '',
            listType: '20',
            pntCtgrMjcsCd: '',
            pntCtgrMdcsCd: '',
            currentPage: computed(() => pager.current),
            pageSize: computed(() => pager.size)
        });

        const exelParams = reactive({
            params: {
                issStCd: computed(() => searchData.issStCd),
                pntIssSeCd: computed(() => searchData.pntIssSeCd),
                rgsTyCd: computed(() => searchData.rgsTyCd),
                rgsDtFr: computed(() => dayJS(searchData.rgsDtFr).format('YYYYMMDD')), //시작일
                rgsDtTo: computed(() => dayJS(searchData.rgsDtTo).format('YYYYMMDD')), //종료일
                plcyStCd: computed(() => searchData.plcyStCd),
                pntPlcyNm: computed(() => searchData.pntPlcyNm),
                pntIssTyCd: computed(() => searchData.pntIssTyCd),
                listType: computed(() => searchData.listType),
                pntCtgrMjcsCd: computed(() => searchData.pntCtgrMjcsCd),
                pntCtgrMdcsCd: computed(() => searchData.pntCtgrMdcsCd),
                currentPage: 0,
                pageSize: 0,
                menuCode: state.menuCode
            },
            url: '/common/api/v1/mna/iss/list/excel'
        });

        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: 10,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => {
            onChangedPage(1);
        });
        
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

        const getPntMnlIssList = async () => {
            try {
                let {params, check} = await reqData();
                if (check) return;
                const response = await _getPntMnlIssList(params);
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

        const initSearch = () => {
            dateSearch.value.initDate();
            searchData.rgsDtFr = new Date().getTime() - 3600 * 1000 * 24 * 30;
            searchData.rgsDtTo = new Date();
            searchData.issStCd = '';
            searchData.pntPlcyNm = '';
            searchData.pntIssTyCd = '';
            searchData.pntCtgrMjcsCd = '';
            searchData.pntCtgrMdcsCd = '';

            onChangedPage(1);
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value) => {
            if (type === 'day') {
                searchData.rgsDtFr = value[0];
                searchData.rgsDtTo = value[1];
            }
            if (type === 'self_start') {
                searchData.rgsDtFr = value;
            }
            if (type === 'self_end') {
                searchData.rgsDtTo = value;
            }
        };

        const showModal = (type) => {
            popInfo.modalType = type;
            switch (type) {
                case 'rejectIss' :
                    popInfo.modalTitle = '발급반려';
                    popInfo.modalMessage = '반려사유를 등록해주세요.';
                    break;
                case 'rejectCancel' :
                    popInfo.modalTitle = '발급취소 반려';
                    popInfo.modalMessage = '발급취소 반려사유를 등록해주세요.';
                    break;
                case 'rejectDel' :
                    popInfo.modalTitle = '발급삭제 반려';
                    popInfo.modalMessage = '발급삭제 반려사유를 등록해주세요.';
                    break;
                case 'aprv' :
                    popInfo.modalTitle = '포인트 발급 승인';
                    popInfo.modalMessage = '선택하신 항목을 승인하시겠습니까?';
                    break;
            }
            isShow.value = true;
        };

        const closeModal = async (type, val) => {
            let status = popInfo.modalType;
            isShow.value = false;
            if (type == 'modalconfirm') {
                let {data, message} = await resData(status, val);
                setAthrAprvRes(data, message);
            }
        };

        const resData = async (status, val) => {
            const mnaIssArr = [];
            state.selectList.forEach(item => {
                let mnaIssData = {
                    athrRqstMngCd: item.cstPntIssMngSn,
                    athrNoSn: item.athrNoSn
                };
                mnaIssArr.push(mnaIssData);
            });
            let data = {
                athrInfArr: mnaIssArr,
                athrTypCd: state.athrTypCd,
                athrStCd: state.selectList[0].issStCd,
                athrRsnCd: val.athrRsnCd,
                athrRsnCts: val.athrRsnCts
            };

            let message = '';
            if (status == 'rejectIss') {
                message = '승인 반려가';
                data.athrStCd = '218004';
            } else if (status == 'rejectCancel') {
                message = '취소 반려가';
                data.athrStCd = '218010';
            } else if (status == 'rejectDel') {
                message = '삭제 반려가';
                data.athrStCd = '218007';
            } else if (status == 'aprv') {
                if (data.athrStCd == '218002')      data.athrStCd = '218003';
                else if (data.athrStCd == '218005') data.athrStCd = '218006';
                else if (data.athrStCd == '218008') data.athrStCd = '218009';
            }

            return {data, message};
        };

        const setAthrAprvRes = async (data, message) => {
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

        const checkAuth = (type) => {
            if (menuInfo.value.auth4ApproveYn != 'Y') {
                modal('승인/반려 권한이 없습니다.');
            } else {
                reqStatusCheck(type);
            }
        };

        const reqStatusCheck = (type) => {
            var showValue = true;
            let issStCd = ['218002', '218005', '218008'];
            
            if (_.isEmpty(state.selectList) || state.selectList.length <= 0) {
                modal('선택하신 행이 없습니다.');
                return ;
            }

            const nonMatch = [];           // 허용된 값이 아닌경우
            const uniqueValue = new Set(); //현재 선택한 status 값 표현
            state.selectList.forEach((data) => {
                uniqueValue.add(data.issStCd);
                if (!issStCd.includes(data.issStCd)) {
                    nonMatch.push(data.issStCd);
                    return ;
                }
            });
            
            if (nonMatch.length > 0 || uniqueValue.size > 1) showValue = false;

            if (showValue) {
                let value = [...uniqueValue];
                if (type == 'reject') {
                    if (value[0] == '218002') type = 'rejectIss';
                    if (value[0] == '218005') type = 'rejectDel';
                    if (value[0] == '218008') type = 'rejectCancel';
                }
                showModal(type, value[0]);
            }
            else {
                if (nonMatch.length > 0) {
                    let etype = type == 'rejectAlt' ? '반려가' : '승인이';
                    let message = state.selectList[0].issStCdNm + '상태는' + etype + ' 불가합니다.';
                    modal(message);
                } else {
                    modal('동일한 상태만 선택이 가능합니다.');
                }
            }
        };

        const selectedOptions = (value) => {
            pager.size = value;
            onChangedPage(1);
        };

        const cellClicked = (e) => {
            const code = state.gridApi.getFocusedCell().column.colId;
            var url, pType = '';
            if (code == 'pntPlcyNm') {
                url = '/pntissaprvdetail';
                pType = 'pntissaprvdetail';
                router.push({path: url, state: {type: pType, ...e.data}});
            }
        };

        // 페이징 처리
        const onChangedPage = (num) => {
            state.selectList = [];
            pager.current = num;
            getPntMnlIssList();
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
            const initColum = _.clone(tablelist_pntIssAprv_label);
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

        return {
            tablelist_pntIssAprv_label,
            toggleSearch,
            searchShow,
            state,
            popInfo,
            searchData,
            isShow,
            pager,
            showModal,
            closeModal,
            onChangedPage,
            onSelectPicker,
            selectedOptions,
            getPntMnlIssList,
            initSearch,
            cellClicked,
            onGridReady,
            onRowSelect,
            checkAuth,
            dateSearch,
            checkOptions,
            sizeToFit,
            resetTable,
            enterToSearch,
            changePntCtgrMjcsCd,
            pntCtgrMdcsCdRef,
            exelParams,
            onChangeDownRol,
            menuInfo
        };
    }
};
</script>