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
                    <label>기간조회</label>
                    <span class="input">
                        <span class="dv">
                            <CommonBtn :val="searchData.rgsTyCd" :type="'rgsTyCd'"
                                @changedValue="(value) => searchData.rgsTyCd = value" :className="'custom-select sm'" />
                        </span>
                    </span>
                    <span class="dv">
                        <dateSerch ref="dateSearch" :dateTitle="''" @onSelectDate="onSelectPicker" :setDay="state.setDay" :pickerOnly="true"/>
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
                        <label>발급상태</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'선택'" :grCdId="'218000'" :val="searchData.issStCd"
                                    @changedValue="(value) => searchData.issStCd = value" :className="'custom-select sm'" />
                            </span>
                            <span class="dv" v-if="searchData.issStCd == '218003'">
                                <CommonBtn :init="'전체'" :grCdId="'264000'" :val="searchData.issCmplTyCd"
                                    @changedValue="(value) => searchData.issCmplTyCd = value" :className="'custom-select sm'" />
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
                </div>
            </div>
        </div>
        <!-- 테이블 -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="checkAuth('reqDeleteAlt')">삭제요청</button>
                    <button type="button" class="btn btn-ss" @click="onChangeRegistRol(menuInfo.auth1RegistYn)" >등록</button>
                    <button type="button" class="btn btn-ss" @click="checkAuth('reqCancelAlt')">취소요청</button>
                    <button type="button" class="btn btn-ss" @click="checkAuth('reqAprvAlt')">승인요청</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{pager.totalCnt.toLocaleString('ko')}}</strong>건</span>
                    <button type="button" class="btn btn-ss" @click="fileDownload">양식다운로드</button>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />
                    <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit" ><span class="offscreen">컬럼 리사이징</span></button>
                    <button type="button" class="btn btn-opt-ico filter"  @click="resetTable"><span class="offscreen">컬럼 셋팅</span></button> <!-- 클래스 : close -->
                </div>
            </div>

            <columlist :columlists="tablelist_pntMnlIssMng_label" @checkColum="checkOptions" />
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

        <DefaultModal :isShow="isShow" :modalTitle="popInfo.modalTitle" :buttonConfirm="popInfo.confirmNm" :buttonCancel="'취소'"
            @modalclose="closeModal">
            <template #modalcontent>
                <AprvListPop v-if="popInfo.modalType=='reqAprv' || popInfo.modalType=='reqDelete' || popInfo.modalType=='reqCancel'" :menuCode="state.menuCode" @memberAprv="memberAprv"/>
                <div v-else>{{ popInfo.modalMessage }}</div>
            </template>
        </DefaultModal>
    </section>
</template>
<script>
import { computed, reactive, onMounted, onUnmounted, inject, ref } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { _getPntMnlIssList, _setAthrAprvReq, _getCmmMenu } from '@/api/pntmng.js';
import { _fileDownload } from '@/api/common.js';
import { useCommFunc } from '@/core/helper/common.js';
import { tablelist_pntMnlIssMng_label } from '@/data/table/pntmngtable.js';
import AprvListPop from '@/views/pntmng/component/AprvListPop.vue';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
import { useRouter} from 'vue-router';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import ReIssTableBtn from '@/views/pntmng/component/ReIssTableBtn.vue';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';

export default {
    components: {DefaultModal, DateSerch, AprvListPop, CommonBtn, ReIssTableBtn },
    setup() {
        const router = useRouter();
        const dateSearch = ref(null);
        const pntCtgrMdcsCdRef  = ref(null);
        const {goToPage } = useCommFunc();
        const { toggleSearch, searchShow, modal, popInfo, isShow } = dmCommFunc();
        const dayJS = inject('dayJS');
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeDownRol, onChangeRegistRol } = authCommFunc();

        const state = reactive({
            setDay: {
                from: new Date().getTime() - 3600 * 1000 * 24 * 30,
                to: new Date()
            },
            tableColum_c: _.clone(tablelist_pntMnlIssMng_label), //컬럼명 처리
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
            athrTypCd: '212005',
            selectList: [],
            memberAprv: null, //승인자정보
            fileId: null,
            menuCode: menuInfo.value.menuCode
        });

        const searchData = reactive({
            rgsTyCd: '',
            rgsDtFr: new Date().getTime() - 3600 * 1000 * 24 * 30,
            rgsDtTo: new Date(),
            pntIssSeCd: '',
            pntPlcyNm: '',
            pntIssTyCd: '',
            issStCd: '',
            listType: '10',
            issCmplTyCd: '',
            pntCtgrMjcsCd: '',
            pntCtgrMdcsCd: '',
            currentPage: computed(() => pager.current),
            pageSize: computed(() => pager.size)
        });

        const exelParams = reactive({
            params: {
                rgsTyCd: computed(() => searchData.rgsTyCd),
                rgsDtFr: computed(() => dayJS(searchData.rgsDtFr).format('YYYYMMDD')),
                rgsDtTo: computed(() => dayJS(searchData.rgsDtTo).format('YYYYMMDD')),
                pntIssSeCd: computed(() => searchData.pntIssSeCd),
                pntPlcyNm: computed(() => searchData.pntPlcyNm),
                pntIssTyCd: computed(() => searchData.pntIssTyCd),
                issStCd: computed(() => searchData.issStCd),
                listType: computed(() => searchData.listType),
                issCmplTyCd: computed(() => searchData.issCmplTyCd),
                pntCtgrMjcsCd: computed(() => searchData.pntCtgrMjcsCd),
                pntCtgrMdcsCd: computed(() => searchData.pntCtgrMdcsCd),
                pageSize: 0,
                currentPage: 0,
                menuCode: computed(() => menuInfo.value.menuCode)
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
            emitter.$on('onChangeRegist', goToReg);
            onChangedPage(1);
            getFileId();
        });

        onUnmounted(() => {
            emitter.$off('onChangeRegist');
        });
        
        const reqData = () => {
            let check = false;
            let params = {
                ...searchData,
                issCmplTyCd: searchData.issStCd != '218003' ? '' : searchData.issCmplTyCd,
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
            searchData.rgsTyCd = '',
            searchData.rgsDtFr = new Date().getTime() - 3600 * 1000 * 24 * 30,
            searchData.rgsDtTo = new Date(),
            searchData.pntIssSeCd = '',
            searchData.pntPlcyNm = '',
            searchData.pntIssTyCd = '',
            searchData.issStCd = '';
            searchData.issCmplTyCd = '';
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
            popInfo.confirmNm = '확인';

            switch (type) {
                case 'reqAprvAlt' :
                    popInfo.modalTitle = '포인트발급승인요청';
                    popInfo.modalMessage = '선택하신 항목을 승인요청하시겠습니까?';
                    break;
                case 'reqAprv' :
                    popInfo.modalTitle = '포인트발급승인요청';
                    popInfo.modalMessage = '';
                    popInfo.confirmNm = '승인요청';
                    break;
                case 'aprvReq' :
                    popInfo.modalTitle = '포인트발급승인요청';
                    popInfo.modalMessage = '선택한 승인자에게 발급 승인을 요청하시겠습니까?';
                    break;
                case 'reqDeleteAlt' :
                    popInfo.modalTitle = '포인트발급삭제요청';
                    popInfo.modalMessage = '해당 발급건을 삭제 요청하시겠습니까?';
                    break;
                case 'reqDelete' :
                    popInfo.modalTitle = '포인트발급삭제요청';
                    popInfo.modalMessage = '';
                    popInfo.confirmNm = '승인요청';
                    break;
                case 'delReq' :
                    popInfo.modalTitle = '포인트발급삭제요청';
                    popInfo.modalMessage = '선택한 승인자에게 발급 삭제 승인을 요청하시겠습니까?';
                    break;

                case 'reqCancelAlt' :
                    popInfo.modalTitle = '포인트발급취소요청';
                    popInfo.modalMessage = '선택하신 항목을 취소 승인요청하시겠습니까?';
                    break;
                case 'reqCancel' :
                    popInfo.modalTitle = '포인트발급취소요청';
                    popInfo.modalMessage = '';
                    popInfo.confirmNm = '취소요청';
                    break;
                case 'cancelReq' :
                    popInfo.modalTitle = '포인트발급취소요청';
                    popInfo.modalMessage = '선택한 승인자에게 발급 취소 승인을 요청하시겠습니까?';
                    break;
            }
            isShow.value = true;
        };

        const closeModal = async (type, value) => {
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
                } else if (status == 'aprvReq' || status == 'delReq' || status == 'cancelReq') {
                    const mnaIssArr = [];
                    state.selectList.forEach(item => {
                        let mnaIssData =
                        {
                            athrRqstMngCd: item.cstPntIssMngSn,
                            athrNoSn: item.athrNoSn
                        };
                        mnaIssArr.push(mnaIssData);
                    });
                    let data = {
                        athrInfArr: mnaIssArr,
                        athrStCd: state.selectList[0].issStCd,
                        athrPsbId: state.memberAprv.admnId,
                        athrTypCd: state.athrTypCd
                    };
                    let message = '';
            
                    if (status == 'aprvReq') {
                        message = '승인요청';
                        data.athrStCd = '218002';
                    } else if (status == 'delReq') {
                        message = '삭제요청';
                        data.athrStCd = '218005';
                    } else if (status == 'cancelReq') {
                        message = '취소요청';
                        data.athrStCd = '218008';
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
                } else if (status == 'reqCancelAlt') {
                    showModal('reqCancel');
                } else if (status == 'reqCancel') {
                    if (_.isEmpty(state.memberAprv)) {
                        modal('승인자를 선택해 주세요.');
                    } else {
                        showModal('cancelReq');
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

        const reqStatusCheck = (type) => {
            state.memberAprv = '';
            var showValue = true;
            let issStCd = null;

            if (_.isEmpty(state.selectList) || state.selectList.length <= 0) {
                modal('선택하신 행이 없습니다.');
                return ;
            }
            
            if (type == 'reqDeleteAlt') {
                issStCd = ['218001', '218004', '218007'];  //신규등록/승인반려/삭제반려
            } else if (type == 'reqAprvAlt') {
                issStCd = ['218001', '218004']; //신규등록/승인반려  
            } else if (type == 'reqCancelAlt') {
                issStCd = ['218003', '218010']; //승인완료/취소반려
            }

            const nonMatch = [];           // 허용된 값이 아닌경우
            const uniqueValue = new Set(); //현재 선택한 status 값 표현
            state.selectList.forEach((data) => {
                uniqueValue.add(data.issStCd);
                if (!issStCd.includes(data.issStCd)) {
                    nonMatch.push(data.issStCd);
                    return;
                }
            });

            if (nonMatch.length > 0 || uniqueValue.size > 1) showValue = false;

            if (showValue) {
                showModal(type);
            }
            else {
                if (nonMatch.length > 0) {
                    let etype = type == 'reqDeleteAlt' ? '삭제' : type == 'reqAprvAlt' ? '승인' : type == 'reqCancelAlt' ? '취소' : '';
                    let message = state.selectList[0].issStCdNm + ' 상태는 ' + etype + ' 요청이 불가합니다.';
                    modal(message);
                } else {
                    modal('동일한 상태만 요청이 가능합니다.');
                }
            }
        };

        const selectedOptions = (value, type) => {
            pager.size = value;
            onChangedPage(1);
        };

        const cellClicked = (e) => {
            const code = state.gridApi.getFocusedCell().column.colId;
            var url, pType = '';
            if (code == 'pntPlcyNm') {
                url = '/pntmnlissdetail';
                pType = 'pntmnlissdetail';
                router.push({path: url,
                    state: {type: pType,
                        auth6MaskingYn: menuInfo.value.auth6MaskingYn,
                        ...e.data }});
            }
        };

        const memberAprv = (val) => {
            state.memberAprv = val[0];
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
            const initColum = _.clone(tablelist_pntMnlIssMng_label);
            state.tableColum_c = initColum.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        const enterToSearch = (e) => {
            if (e.keyCode === 13) onChangedPage(1);
        };

        const fileDownload = async () => {
            try {
                const response = await _fileDownload(state.fileId);
                if (response.statusText != 'OK') { modal('양식이 등록되어 있지 않습니다. 관리자에게 요청하세요');  return; }
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                const match = /filename="(.+?)"/.exec([response.headers['content-disposition']]);
                a.href = url;
                a.download = match ? decodeURI(match[1]) : null;
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                modal('양식 다운로드중 에러가 발생하였습니다.');
                console.log(error);
            }
        };

        const changePntCtgrMjcsCd = async (val) => {
            if (searchData.pntCtgrMjcsCd) pntCtgrMdcsCdRef.value.setGrCdId(val);
            searchData.pntCtgrMjcsCd = val;
            searchData.pntCtgrMdcsCd = '';
        };

        const getFileId = async () => {
            try {
                const response = await _getCmmMenu({uprGrpCd: '302000'});
                if (response.code == 'OK') {
                    state.fileId = response.data.list[0].cmnCdNm;
                } else {
                    modal(response.message);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const goToReg = () => goToPage('/pntmnlissreg');

        return {
            tablelist_pntMnlIssMng_label,
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
            goToPage,
            initSearch,
            cellClicked,
            onGridReady,
            onRowSelect,
            memberAprv,
            dateSearch,
            checkOptions,
            sizeToFit,
            resetTable,
            enterToSearch,
            fileDownload,
            changePntCtgrMjcsCd,
            pntCtgrMdcsCdRef,
            exelParams,
            onChangeDownRol,
            onChangeRegistRol,
            menuInfo,
            router,
            checkAuth
        };
    }
};
</script>