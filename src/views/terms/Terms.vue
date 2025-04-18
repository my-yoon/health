<template>
    <section class="temp-section">
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>약관그룹</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.termsGroupSn" class="custom-select sm">
                                <option value="">전체</option>
                                <option v-for="(item, index) in state.termsGroup" :key="index" :value="item.clusGrpSn">
                                    {{ item.clusGrpNm }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>약관유형</label>
                    <span class="input">
                        <span class="dv">
                            <!-- <select class="custom-select sm">
                                <option value="전체">전체</option>
                            </select> -->
                            <select v-model="formData.clusTyCd" class="custom-select sm">
                                <option value="">전체</option>
                                <option v-for="(item, index) in state.clusTyCd" :key="index" :value="item.value">
                                    {{ item.cmnCdNm }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
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
                    <label>필수여부</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.esnClusYn" class="custom-select sm">
                                <option v-for="(item, index) in state.esnClusYn" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>상태</label>
                    <span class="input">
                        <span class="dv">
                            <!-- <select class="custom-select sm">
                                <option value="전체">전체</option>
                            </select> -->
                            <select v-model="formData.clusMngStCd" class="custom-select sm">
                                <option v-for="(item, index) in state.clusMngStCd" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회</button>
                    <button type="button" class="btn btn-sm" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">초기화</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="checkRegist">등록</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />

                    <button type="button" class="btn btn-opt-ico fit" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                </div>
            </div>
            <div id="myGrid" class="ag-theme-alpine"></div>

            <NoData v-if="state.termsList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else ref="agGrid">
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                    :domLayout="state.domLayout" :rowData="state.termsList" @cell-clicked="onRowSelect"
                    :suppressRowClickSelection="true" @grid-ready="onGridReady" @selection-changed="onRowSelect"
                    :rowSelection="'multiple'" class="ag-theme-alpine" style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>
    </section>
</template>
<script>
import { computed, reactive, onMounted, onUnmounted, inject, ref, watch } from 'vue';
// import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { _getAdminMember, _updateAdminMenuRole } from '@/api/permission';
import { _getTermsGroup, _getTermsType, _getTerms } from '@/api/terms';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { commoCode } from '@/data/commcode';
import { useStore } from 'vuex';

export default {
    components: {},
    setup() {
        const store = useStore();
        // const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, tableResize, isDownShow } = useCommFunc();

        /**
         * 권한은 스토어에서 가져옴 (권한여부는 메뉴리스트에서 가져온다)
         * store.state.getMenuItem.menuInfo
         * "auth1RegistYn": "Y/N",  등록
         * "auth2UpdateYn": "Y/N",  수정
         * "auth3DeleteYn": "Y/N",  삭제
         * "auth4ApproveYn": "Y/N", 승인
         * "auth5DownloadYn": "Y/N", 다운 
         * "auth6MaskingYn": "Y/N" 마스킹
         */
        const { onChangeRegistRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        // const DownModalConRef = ref(null);
        const initColum = ref([
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '약관그룹', field: 'clusGrpNm', flex: 1 },
            { headerName: '약관유형', field: 'clusTyCdNm', flex: 1 },
            { headerName: '서비스제공자', field: 'clusMngOffrNtprSnNm', flex: 1 },
            { headerName: '서비스대상자', field: 'clusMngTgpNtprSnNm', flex: 1 },
            { headerName: '필수여부', field: 'esnClusYnNm', flex: 1 },
            { headerName: '약관명', field: 'clusNm', flex: 1 },
            { headerName: '관리형태', field: 'clusMngShpCdNm', flex: 1 },
            { headerName: '중요내용변경', field: 'impaCtsChgYn', flex: 1 },
            { headerName: '상태', field: 'clusMngStCdNm', flex: 1 },
            { headerName: '개정일자', field: 'dstrbDt', flex: 1 },
            { headerName: '수정일시', field: 'lastUpdDt', flex: 1 }
        ]);

        const state = reactive({
            pagesize: 10,
            termsType: [], // 약관유형목록
            termsGroup: [], // 약관그룹목록
            termsList: [], // 약관목록
            clusTyCd: commoCode.termsCode.clusTyCd, // 약관유형코드
            filterCoulm: [],

            tableColum_c: _.clone(initColum.value),
            // 테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            gridApi: null,
            gridColumApi: null,
            admnSn: null, // 선택 admin ( selected row )
            domLayout: 'autoHeight',
            isCheckTermsName: false, // 중복확인 여부
            validState: {
                errState: false, // error state
                message: '' // input message
            },
            // 조회조건
            searchTypeList: [
                { label: '선택', value: '' },
                { label: '서비스제공자', value: 'serviceOfferNm' },
                { label: '서비스대상자', value: 'serviceTargetNm' },
                { label: '약관명', value: 'clusNm' }
            ],
            // 필수여부
            esnClusYn: [
                { label: '전체', value: '' },
                { label: '필수', value: 'Y' },
                { label: '선택', value: 'N' }
            ],
            // 상태
            clusMngStCd: [ // (공통코드 : 251000)-251001:최초작성중/251002:적용중/251003:적용대기/251004:사용하지않음
                { label: '전체', value: '' },
                { label: '적용대기', value: '251003' },
                { label: '적용중', value: '251002' }
            ],
            menuCode: '1012003', // 약관관리 로그메뉴코드
            download: { pass: '', reason: '' }
        });

        // 검색 조건
        const formData = reactive({
            termsGroupSn: '', // 약관그룹
            clusTyCd: '', // 약관유형
            // checkTermsGroupName: '' // 중복확인 약관그룹명
            searchType: '', // 조회조건
            searchText: '', // 조회조건값
            esnClusYn: '', // 필수여부 (전체 | Y | N)
            clusMngStCd: '' // 상태
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                menuCode: computed(() => menuInfo.value.menuCode),
                clusGrpSn: computed(() => formData.clusGrpSn),
                clusTyCd: computed(() => formData.clusTyCd),
                searchType: computed(() => formData.searchType),
                searchText: computed(() => formData.searchText),
                esnClusYn: computed(() => formData.esnClusYn),
                clusMngStCdList: formData.clusMngStCd ? [formData.clusMngStCd] : ['251002', '251003'] // 약관상태코드
                // mskgnRlsYn: computed(() => formData.mskgnRlsYn)
                // downloadReason: computed(() => formData.downloadReason),
                // dwnlPwd: computed(() => formData.dwnlPwd)
            },
            url: '/common/api/v1/clause/excel'

        });

        watch(formData, () => {
            // console.log('change check terms name');
            resetState();
        });

        onMounted(async () => {
            await getTermsGroup();
            await getTermsType();
            await getTerms();

            // emitter.$on('cellMdListSelect', sellerListPopup);
            emitter.$on('onChangeRegist', onChangeRegist);
        });

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
            goToPage('/policy/register');
        };

        /**
         * @validation 상태 초기화
         */
        const resetState = () => {
            state.isCheckTermsName = false; // 중복확인
            state.validState.errState = false; // validation
            state.validState.message = '';
        };

        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
            // console.log(params.columnApi);
        };

        // 페이징
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
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            getTerms();
        };

        /**
         * 약관그룹조회
         */
        const getTermsGroup = async () => {
            try {
                const params = {
                    size: 10000,
                    offset: 0
                    // clusGrpNm: ''
                };
                const response = await _getTermsGroup(params);

                console.log('response 약관그룹조회', response);
                state.termsGroup = response.data.data.list;
                // pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 약관유형조회
         */
        const getTermsType = async () => {
            try {
                console.log(formData.termsGroupSn);
                const params = {
                    // clusGrpSn: formData.termsGroupSn, // 약관그룹순번
                    // clusTyCd: formData.clusTyCd, // 약관유형코드
                    size: 10000,
                    offset: 0
                };
                const response = await _getTermsType(params);
                console.log('response 약관유형조회', response);
                state.termsType = response.data.data.list;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 약관조회
         */
        const getTerms = async () => {
            try {
                console.log(formData.termsGroupSn);
                const params = {
                    clusGrpSn: formData.termsGroupSn, // 약관그룹순번
                    clusTyCd: formData.clusTyCd, // 약관유형코드
                    searchType: formData.searchType, // 조회조건 serviceOfferNm(서비스제공자) / serviceTargetNm(서비스대상자) / clusNm(약관명)
                    searchText: formData.searchText, // 조회조건값
                    // clusMngShpCd: formData.clusMngShpCd, // 약관관리형태코드
                    esnClusYn: formData.esnClusYn, // 필수여부
                    clusMngStCdList: formData.clusMngStCd ? [formData.clusMngStCd] : ['251002', '251003'], // 약관상태코드
                    size: pager.size,
                    offset: pager.offset
                };
                const response = await _getTerms(params);
                console.log('response 약관조회', response);
                state.termsList = response.data.data.list;
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

        // 셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };

        // 컬럼 변경
        const resetTable = () => {
            const columlist = _.clone(initColum.value);
            state.tableColum_c = columlist.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        const clearList = (num) => {
            formData.page = num;
            formData.termsGroupSn = ''; // 약관그룹
            formData.clusTyCd = ''; // 약관유형

            onChangedPage(num);
        };

        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);

            state.admnSn = null;
        };

        /**
         * @onRowSelect
         */
        const onRowSelect = (e) => {
            console.log(e);
            /**
             * 디테일타입코드-[DL: 약관관리목록에서 상세조회시,상세에서 수정버튼, DC: 상세에서 개정버전 추가]
             */
            goToPage(`/policy/register?clusMngSn=${e.data.clusMngSn}&clusMngStCd=${e.data.clusMngStCd}&detailTyCd=DL`);
        };

        /**
         * @modal
         * simple modal
         * 다운로드 사유 저장없이 파일다운로드
         *  */
        // const exelConfirm = () => {
        //     $Modal.simple({
        //         title: '',
        //         message: '다운로드 하시겠습니까?',
        //         buttonText: {
        //             ok: '확인'
        //         }
        //     })
        //         .then(async (success) => {
        //             console.log(success);
        //             await exelDown();
        //         })
        //         .catch(error => {
        //             console.log(error);
        //         });
        // };
        // const exelDown = () => {
        //     let params = {
        //         clusGrpSn: formData.termsGroupSn, // 약관그룹순번
        //         clusTyCd: formData.clusTyCd, // 약관유형코드
        //         searchType: formData.searchType, // 조회조건 serviceOfferNm(서비스제공자) / serviceTargetNm(서비스대상자) / clusNm(약관명)
        //         searchText: formData.searchText, // 조회조건값
        //         esnClusYn: formData.esnClusYn, // 필수여부
        //         clusMngStCdList: formData.clusMngStCd ? [formData.clusMngStCd] : ['251002', '251003'], // 약관상태코드
        //         menuCode: state.menuCode,
        //         mskgnRlsYn: 'N',
        //         downloadReason: state.download.reason,
        //         dwnlPwd: state.download.pass
        //     };
        //     // console.log('osb 약관관리 파일다운로드 param', params);
        //     fileDown(state.download, params, '/common/api/v1/clause/excel');
        //     state.download = {};
        //     isDownShow.value = false;
        // };


        return {
            // $Modal,
            dayJS,
            state,
            pager,
            initColum,
            isDownShow,
            fileDown,
            formData,
            // DownModalConRef,
            onGridReady,
            onChangedPage,
            onInitDate,
            reloadList,
            selectedOptions,
            tableResize,
            goToPage,
            resetTable,
            onRowSelect,
            // exelConfirm,

            menuInfo,
            exelParams,
            checkRegist,
            onChangeDownRol
        };
    }
};

</script>