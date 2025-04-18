<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
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
                    <dateSerch :dateTitle="'정책등록일'" @onSelectDate="onSelectPicker" :setDay="state.setDay" ref="dateSearch" :pickerOnly="true" />
                </div>

                <div class="item">
                    <label>정책명</label>
                    <span class="input">
                        <input type="text" class="form-control" v-model="searchData.pntPlcyNm" @keyup="enterToSearch">
                    </span>
                </div>

                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="onChangedPage(1, 'search')">
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
                        <label>포인트유형</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'전체'" :grCdId="'207000'" :val="searchData.pntIssTyCd"
                                    @changedValue="(value) => searchData.pntIssTyCd = value" :className="'custom-select sm'" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>정책상태</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'선택'" :grCdId="'206000'" :val="searchData.plcyStCd"
                                    @changedValue="(value) => searchData.plcyStCd = value" :className="'custom-select sm'" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>카테고리</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'선택'" :grCdId="'290000'" :val="searchData.pntCtgrMjcsCd"
                                    @changedValue="changePntCtgrMjcsCd" :className="'custom-select sm'" />
                            </span>
                            <span class="dv">
                                <CommonBtn ref="pntCtgrMdcsCdRef" v-if="searchData.pntCtgrMjcsCd" :init="'선택'" :grCdId="searchData.pntCtgrMjcsCd" :val="searchData.pntCtgrMdcsCd"
                                    @changedValue="(value) => searchData.pntCtgrMdcsCd = value" :className="'custom-select sm'" />
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
                    <button type="button" class="btn btn-ss" @click="checkAuth('reqDeleteAlt')">삭제</button>
                    <button type="button" class="btn btn-ss" @click="onChangeRegistRol(menuInfo.auth1RegistYn)" >등록</button>
                    <button type="button" class="btn btn-ss" @click="checkAuth('reqNonUseAlt')">미사용요청</button>
                    <button type="button" class="btn btn-ss" @click="checkAuth('reqAprvAlt')">승인요청</button>
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
                    <button type="button" class="btn btn-opt-ico filter"  @click="resetTable"><span class="offscreen">컬럼 셋팅</span></button>
                </div>
            </div>
            <columlist :columlists="tablelist_dcsPntPlcyMng_label" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
            <template v-else>
                <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                    :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked"
                    :suppressRowClickSelection="true" @selection-changed="onRowSelect" :rowSelection="'multiple'"
                    class="ag-theme-alpine" :domLayout="'autoHeight'">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </template>
        </div>

        <DefaultModal :isShow="isShow" :modalTitle="popInfo.modalTitle" :buttonConfirm="popInfo.confirmNm" :buttonCancel="'취소'"
            @modalclose="closeModal">
            <template #modalcontent>
                <AprvListPop v-if="popInfo.modalType=='reqAprv' || popInfo.modalType=='reqDelete' || popInfo.modalType=='reqNonUse'" :menuCode="state.menuCode" @memberAprv="memberAprv"/>
                <div v-else>{{ popInfo.modalMessage }}</div>
            </template>
        </DefaultModal>
    </section>
</template>
<script>
import { computed, reactive, onMounted, inject, ref, onUnmounted } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useStore } from 'vuex';
import { format } from 'date-fns';
import { _getDcsPntPlcyList, _setAthrAprvReq } from '@/api/pntmng.js';
import { useCommFunc } from '@/core/helper/common.js';
import { tablelist_dcsPntPlcyMng_label } from '@/data/table/pntmngtable.js';
import AprvListPop from '@/views/pntmng/component/AprvListPop.vue';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
import { useRouter} from 'vue-router';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: {DefaultModal, DateSerch, AprvListPop, CommonBtn},
    setup() {
        const router = useRouter();
        const dateSearch = ref(null);
        const pntCtgrMdcsCdRef  = ref(null);
        const { goToPage } = useCommFunc();
        const { toggleSearch, searchShow, modal, popInfo, isShow } = dmCommFunc();
        const dayJS = inject('dayJS');
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeDownRol, onChangeRegistRol, onChangeMaskingRol } = authCommFunc();

        const state = reactive({
            mskgnRlsYn: true,
            filterCoulm: [],
            setDay: {
                from: new Date().getTime() - 3600 * 1000 * 24 * 30,
                to: new Date()
            },
            tableColum_c: _.clone(tablelist_dcsPntPlcyMng_label),
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
            selectList: [],   //checkbox 정책 리스트
            memberAprv: null, //승인자 정보
            athrTypCd: '212001',
            menuCode: menuInfo.value.menuCode
        });

        const searchData = reactive({
            rgsDtFr: new Date().getTime() - 3600 * 1000 * 24 * 30,
            rgsDtTo: new Date(),
            pntIssSeCd: '',
            pntPlcyNm: '',
            pntIssTyCd: '',
            plcyStCd: '',
            pntCtgrMjcsCd: '',
            pntCtgrMdcsCd: '',
            listType: '10',
            currentPage: computed(() => pager.current),
            pageSize: computed(() => pager.size),
            maskingReleaseYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N')
        });

        const exelParams = reactive({
            params: {
                rgsDtFr: computed(() => dayJS(searchData.rgsDtFr).format('YYYYMMDD')),
                rgsDtTo: computed(() => dayJS(searchData.rgsDtTo).format('YYYYMMDD')),
                pntIssSeCd: computed(() => searchData.pntIssSeCd),
                pntPlcyNm: computed(() => searchData.pntPlcyNm),
                pntIssTyCd: computed(() => searchData.pntIssTyCd),
                pntCtgrMjcsCd: computed(() => searchData.pntCtgrMjcsCd),
                pntCtgrMdcsCd: computed(() => searchData.pntCtgrMdcsCd),
                listType: computed(() => searchData.listType),
                pageSize: 0,
                currentPage: 0,
                menuCode: computed(() => menuInfo.value.menuCode),
                maskingReleaseYn: computed(() => searchData.maskingReleaseYn)
            },
            url: '/common/api/v1/point/policy/list/excel'
        });

        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: 10,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => {
            emitter.$on('onChangeRegist', goToReg);
            emitter.$on('onChangeMskgn', onChangeMskgn);
            onChangedPage(1);
        });

        onUnmounted(() => {
            emitter.$off('onChangeRegist');
        });

        const  reqData = () => {
            let check = false;
            let params = {
                ...searchData,
                rgsDtFr: dayJS(searchData.rgsDtFr).format('YYYYMMDD'),
                rgsDtTo: dayJS(searchData.rgsDtTo).format('YYYYMMDD')
            };
            
            if (params.rgsDtFr > params.rgsDtTo) {
                modal('등록종료일이 등록시작일보다 이전일 수 없습니다. 다시 입력하세요.');
                check = true;
            }
            
            return {params, check};
        };

        const getDcsPntPlcyList = async () => {
            try {
                let {params, check} = await reqData();
                if (check) return;
                const response = await _getDcsPntPlcyList(params);
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
            searchData.pntIssSeCd = '';
            searchData.pntPlcyNm = '';
            searchData.pntIssTyCd = '';
            searchData.plcyStCd = '';
            searchData.pntCtgrMjcsCd = '';
            searchData.pntCtgrMdcsCd = '';

            onChangedPage(1);
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
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

        //Modal 상태별 열기 처리로직
        const showModal = (type) => {
            popInfo.modalType = type;
            popInfo.confirmNm = '확인';

            switch (type) {
                case 'reqAprvAlt' :
                    popInfo.modalTitle = '포인트정책승인요청';
                    popInfo.modalMessage = '선택하신 항목을 승인요청하시겠습니까?';
                    break;
                case 'reqAprv' :
                    popInfo.modalTitle = '포인트정책승인요청';
                    popInfo.modalMessage = '';
                    popInfo.confirmNm = '승인요청';
                    break;
                case 'aprvReq' :
                    popInfo.modalTitle = '포인트정책승인요청';
                    popInfo.modalMessage = '선택한 승인자에게 정책 승인을 요청하시겠습니까?';
                    break;
                case 'reqDeleteAlt' :
                    popInfo.modalTitle = '포인트정책삭제요청';
                    popInfo.modalMessage = '선택하신 항목을 삭제하시겠습니까?';
                    break;
                case 'reqDelete' :
                    popInfo.modalTitle = '포인트정책삭제승인요청';
                    popInfo.modalMessage = '';
                    popInfo.confirmNm = '승인요청';
                    break;
                case 'delReq' :
                    popInfo.modalTitle = '포인트정책삭제요청';
                    popInfo.modalMessage = '선택한 승인자에게 정책 삭제승인을 요청하시겠습니까?';
                    break;

                case 'reqNonUseAlt' :
                    popInfo.modalTitle = '포인트정책 미사용 승인요청';
                    popInfo.modalMessage = '선택하신 항목을 미사용 승인요청하시겠습니까?';
                    break;
                case 'reqNonUse' :
                    popInfo.modalTitle = '포인트정책 미사용 승인요청';
                    popInfo.modalMessage = '';
                    popInfo.confirmNm = '승인요청';
                    break;
                case 'nonUseReq' :
                    popInfo.modalTitle = '포인트정책 미사용 승인요청';
                    popInfo.modalMessage = '선택한 승인자에게 정책 미사용 승인을 요청하시겠습니까?';
                    break;
            }
            isShow.value = true;
        };

        //Modal 상태별 닫기 처리로직
        const closeModal = async (type, val) => {
            let status = popInfo.modalType;
            isShow.value = false;
            if (type == 'modalconfirm') {
                if (status == 'reqAprvAlt') {
                    showModal('reqAprv');
                } else if (status == 'reqAprv') {
                    if (_.isEmpty(state.memberAprv)) {
                        modal('승인자를 선택해 주세요.');
                    } else {
                        showModal('aprvReq');
                    }
                } else if (status == 'aprvReq' || status == 'delReq' || status == 'nonUseReq') {
                    const plcyCdArr = [];
                    state.selectList.forEach(item => {
                        let plcyCdData = {
                            athrRqstMngCd: item.pntPlcyCd,
                            athrNoSn: item.athrNoSn
                        };
                        plcyCdArr.push(plcyCdData);
                    });

                    let data = {
                        athrInfArr: plcyCdArr,
                        athrStCd: state.selectList[0].plcyStCd,
                        athrPsbId: state.memberAprv.admnId,
                        athrTypCd: state.athrTypCd
                    };
                    let message = '';
                    if (status == 'aprvReq') {
                        message = '승인요청';
                        data.athrStCd = '206002';
                    } else if (status == 'delReq') {
                        message = '삭제요청';
                        data.athrStCd = '206005';
                    } else if (status == 'nonUseReq') {
                        message = '미사용요청';
                        data.athrStCd = '206008';
                    }
                    
                    try {
                        let response = await _setAthrAprvReq(data);
                        if (response.data.code == 'OK') {
                            onChangedPage(pager.current);
                        } else {
                            modal(response.data.message ?? message + '이 정상적으로 수행되지 않았습니다.');
                        }
                    } catch (err) {
                        modal(err);
                    }
                } else if (status == 'reqDeleteAlt') {
                    showModal('reqDelete');
                } else if (status == 'reqDelete') {
                    if (_.isEmpty(state.memberAprv)) {
                        modal('승인자를 선택해 주세요.');
                    } else {
                        showModal('delReq');
                    }
                } else if (status == 'reqNonUseAlt') {
                    showModal('reqNonUse');
                } else if (status == 'reqNonUse') {
                    if (_.isEmpty(state.memberAprv)) {
                        modal('승인자를 선택해 주세요.');
                    } else {
                        showModal('nonUseReq');
                    }
                }
            }
        };

        const checkAuth = (type) => {
            if (menuInfo.value.auth4ApproveYn != 'Y') {
                modal('요청 권한이 없습니다.');
            } else {
                reqStatusCheck(type);
            }
        };

        // 정책상태별 요청 상태 체크 함수
        const reqStatusCheck = (type) => {
            state.memberAprv = '';
            var showValue = true;
            let plcyStCd = null;
            
            if (_.isEmpty(state.selectList) || state.selectList.length <= 0) {
                modal('선택하신 행이 없습니다.');
                return ;
            }

            if (type == 'reqDeleteAlt') {
                plcyStCd = ['206001', '206004', '206007'];
            } else if (type == 'reqAprvAlt') {
                plcyStCd = ['206001', '206004', '206007'];
            } else if (type == 'reqNonUseAlt') {
                plcyStCd = ['206003', '206010'];
            }

            const nonMatch = [];
            const uniqueValue = new Set();
            state.selectList.forEach((data) => {
                uniqueValue.add(data.plcyStCd);
                if (!plcyStCd.includes(data.plcyStCd)) {
                    nonMatch.push(data.plcyStCd);
                    return;
                }
            });

            if (nonMatch.length > 0 || uniqueValue.size > 1) showValue = false;

            if (showValue) {
                showModal(type);
            }
            else {
                if (nonMatch.length > 0) {
                    let etype = type == 'reqDeleteAlt' ? '삭제' : type == 'reqAprvAlt' ? '승인' : type == 'reqNonUseAlt' ? '미사용' : '';
                    let message = state.selectList[0].plcyStCdNm + ' 상태는 ' + etype + ' 요청이 불가합니다.';
                    modal(message);
                } else {
                    modal('동일한 상태만 요청이 가능합니다.');
                }
            }
        };

        //페이지당 리스트 게수 선택 옵션
        const selectedOptions = (value, type) => {
            pager.size = value;
            onChangedPage(1);
        };

        // 셀클릭 이벤트처리 함수
        const cellClicked = (e) => {
            const code = state.gridApi.getFocusedCell().column.colId;
            if (code == 'plcyCopy') {
                if (menuInfo.value.auth1RegistYn == 'Y') {
                    router.push({path: '/dcspntplcyreg', state: {type: 'dcsPntPlcyCopy', ...e.data}});
                } else {
                    modal('등록 권한이 없습니다.');
                }
            } else if (code == 'pntPlcyNm') {
                router.push({path: '/DcsPntPlcyDetail', state: {type: 'DcsPntPlcyDetail', ...e.data}});
            } else if (code == 'plcyMem') {
                router.push({path: '/point/publish/history', state: {type: 'isshistmng', pntPlcyCd: e.data.pntPlcyCd}});
            }
        };

        const enterToSearch = (e) => {
            if (e.keyCode === 13) onChangedPage(1);
        };

        const memberAprv = (val) => {
            state.memberAprv = val[0];
        };

        // 페이징 처리
        const onChangedPage = (num, type) => {
            state.selectList = [];
            pager.current = num;
            state.tableColum_c[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            if (type == 'search') state.mskgnRlsYn = true;
            getDcsPntPlcyList();
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };
        // 체크 박스 선택시 
        const onRowSelect = (e) => {
            state.selectList = state.gridApi.getSelectedRows();
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
            const initColum = _.clone(tablelist_dcsPntPlcyMng_label);
            state.tableColum_c = initColum.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        const changePntCtgrMjcsCd = async (val) => {
            if (searchData.pntCtgrMjcsCd) pntCtgrMdcsCdRef.value.setGrCdId(val);
            searchData.pntCtgrMjcsCd = val;
            searchData.pntCtgrMdcsCd = '';
        };

        //상세 검색 하단 검색 목록 토글 
        // 해제 토글
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            onChangedPage(pager.current);
        };

        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
        };

        const goToReg = () => goToPage('/dcspntplcyreg');

        return {
            tablelist_dcsPntPlcyMng_label,
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
            checkOptions,
            initSearch,
            cellClicked,
            onGridReady,
            onRowSelect,
            memberAprv,
            checkAuth,
            dateSearch,
            sizeToFit,
            resetTable,
            enterToSearch,
            changePntCtgrMjcsCd,
            pntCtgrMdcsCdRef,
            exelParams,
            onChangeDownRol,
            onChangeRegistRol,
            menuInfo,
            onChangeMskgn,
            changeMskgnRlsYn
        };
    }
};
</script>