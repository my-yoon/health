<template>
    <section class="temp-section">
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>약관그룹</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.termsGroupSn">
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
                            <select class="custom-select sm" v-model="formData.termsTypeCd">
                                <option value="">전체</option>
                                <option v-for="(item, index) in state.termsTypeCd" :key="index" :value="item.value">
                                    {{ item.cmnCdNm }}
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
                    <!-- <button type="button" class="btn btn-ss" @click="removeTermsGroup">삭제</button> -->
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

            <NoData v-if="state.termsType.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else ref="agGrid">
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                    :domLayout="state.domLayout" :rowData="state.termsType" @cell-clicked="onRowSelect"
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
import { computed, reactive, onMounted, inject, ref, onUnmounted, watch } from 'vue';
// import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { _getAdminMember, _updateAdminMenuRole } from '@/api/permission';
import { _getTermsGroup, _getTermsType } from '@/api/terms';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { commoCode } from '@/data/commcode';
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');

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

        const DownModalConRef = ref(null);
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
        const initColum = ref([
            // { headerName: '선택', field: 'select', maxWidth: 50, checkboxSelection: true, headerCheckboxSelection: true },
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '약관그룹', field: 'clusGrpNm', flex: 1 },
            { headerName: '약관유형', field: 'clusTyCdNm', flex: 1 },
            { headerName: '약관명', field: 'tlusClusNm', flex: 1 },
            { headerName: '관리형태', field: 'tlusShpCdNm', flex: 1 },
            { headerName: '등록일시', field: 'fstRgsDt', flex: 1 },
            { headerName: '수정일시', field: 'lastUpdDt', flex: 1 }
        ]);

        // const isTermsGroupShow = ref(false);

        const state = reactive({
            pagesize: 10,
            termsType: [], // 약관유형목록
            termsGroup: [], // 약관그룹목록
            // selectTermsGroup: [], // 약관그룹 선택목록 (삭제용)
            termsTypeCd: commoCode.termsCode.clusTyCd,
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
            menuCode: '1012002', // 약관유형관리 로그메뉴코드
            download: { pass: '', reason: '' }
        });

        // 검색 조건
        const formData = reactive({
            termsGroupSn: '', // 약관그룹
            termsTypeCd: '' // 약관유형
            // checkTermsGroupName: '' // 중복확인 약관그룹명
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                menuCode: computed(() => menuInfo.value.menuCode),
                clusGrpSn: computed(() => formData.termsGroupSn),
                clusTyCd: computed(() => formData.termsTypeCd)
            },
            url: '/common/api/v1/clauseType/excel'

        });

        watch(formData, () => {
            // console.log('change check terms name');
            resetState();
        });

        onMounted(() => {
            getTermsGroup();
            getTermsType();

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
            goToPage('/policy/type/register');
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
            getTermsType();

        };

        /**
         * 약관그룹조회
         */
        const getTermsGroup = async () => {
            try {
                const params = {
                    size: 10000,
                    offset: 0,
                    clusGrpNm: ''
                };
                const response = await _getTermsGroup(params);
                console.log('>> get', response);
                state.termsGroup = response.data.data.list;
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
                    clusGrpSn: formData.termsGroupSn, // 약관그룹순번
                    clusTyCd: formData.termsTypeCd, // 약관유형코드
                    size: pager.size,
                    offset: pager.offset
                };
                const response = await _getTermsType(params);
                console.log('response', response);
                state.termsType = response.data.data.list;
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
            formData.termsTypeCd = ''; // 약관유형

            onChangedPage(num);
        };

        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);

            state.admnSn = null;
        };

        /**
         * 약관그룹 삭제
         * @onRowSelect
         */
        const onRowSelect = (e) => {
            console.log(e);
            goToPage(`/policy/type/register?tlusSn=${e.data.tlusSn}&clusGrpSn=${e.data.clusGrpSn}&clusTyCd=${e.data.clusTyCd}`);
        };

        return {
            $Modal,
            dayJS,
            state,
            pager,
            initColum,
            formData,
            DownModalConRef,
            // fileDown,
            isDownShow,
            openModal,
            onGridReady,
            onChangedPage,
            onInitDate,
            reloadList,
            selectedOptions,
            tableResize,
            // goToPage,
            resetTable,
            onRowSelect,
            // exelConfirm,

            menuInfo,
            exelParams,
            onChangeDownRol,
            checkRegist
        };
    }
};

</script>