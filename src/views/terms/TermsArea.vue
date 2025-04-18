<template>
    <section class="temp-section">
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>조회조건</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.searchType" class="custom-select sm" @change="changeSearchType">
                                <option value="">선택</option>
                                <option v-for="(item, index) in state.searchType" :key="index" :value="item.value">{{
                                    item.cmnCdNm }}</option>
                            </select>
                        </span>
                        <span class="dv">
                            <template v-if="formData.searchType === 'clusAgrmDomnCd'">
                                <select class="custom-select sm" v-model="formData.clusAgrmDomnCd">
                                    <option value="">전체</option>
                                    <option v-for="(item, index) in state.clusAgrmDomnCd" :key="index" :value="item.value">
                                        {{ item.cmnCdNm }}
                                    </option>
                                </select>
                            </template>
                            <template
                                v-if="formData.searchType === 'serviceOfferNm' || formData.searchType === 'serviceTargetNm'">
                                <input v-model="formData.clusAgrmDomnCd" class="form-control sm" type="text">
                            </template>
                        </span>
                    </span>
                </div>
                <!-- <div class="item">
                    <label>약관그룹명</label>
                    <span class="input">
                        <span class="dv">
                            <input v-model="formData.searchText" type="text" class="form-control sm">
                        </span>
                    </span>
                </div> -->
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

            <NoData v-if="state.termsAreaList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else ref="agGrid">
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                    :domLayout="state.domLayout" :rowData="state.termsAreaList" @cell-clicked="onRowSelect"
                    :suppressRowClickSelection="true" @grid-ready="onGridReady" @selection-changed="onRowSelect"
                    :rowSelection="'multiple'" class="ag-theme-alpine" style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>

        <!-- 다운로드 사유 등록 -->
        <!-- <DefaultModal :isShow="isDownShow" :modalTitle="'다운로드 사유 등록'" :buttonConfirm="'저장'" :buttonCancel="''"
            :modalName="'isDownShow'" @modalclose="modalClose">
            <template #modalcontent>
                <DownModalCon @downloadFormat="downConfirm" ref="DownModalConRef" />

            </template>
        </DefaultModal> -->
    </section>
</template>
<script>
import { computed, reactive, onMounted, inject, ref, onUnmounted } from 'vue';
import { _getAdminMember, _updateAdminMenuRole } from '@/api/permission';
import { _getTermsArea, _checkTermsGroupName, _setTermsGroup } from '@/api/terms';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { commoCode } from '@/data/commcode';
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        const dayJS = inject('dayJS');
        const { goToPage, tableResize } = useCommFunc();

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

        const initColum = ref([
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '약관동의영역', field: 'clusAgrmDomnCdNm', flex: 1 },
            { headerName: '서비스제공자', field: 'clusMngOffrNtprSnNm', flex: 1 },
            { headerName: '서비스대상자', field: 'clusMngTgpNtprSnNm', flex: 1 },
            { headerName: '등록일시', field: 'fstRgsDt', flex: 1 },
            { headerName: '수정일시', field: 'lastUpdDt', flex: 1 }
        ]);

        // const isTermsGroupShow = ref(false);
        // const DownModalConRef = ref(null);

        const state = reactive({
            pagesize: 10,
            searchType: [
                { cmnCdNm: '약관동의영역', value: 'clusAgrmDomnCd', cmnCd: 'clusAgrmDomnCd' },
                { cmnCdNm: '서비스제공자', value: 'serviceOfferNm', cmnCd: 'serviceOfferNm' },
                { cmnCdNm: '서비스대상자', value: 'serviceTargetNm', cmnCd: 'serviceTargetNm' }
            ],
            termsAreaList: [], // 약관그룹목록
            clusAgrmDomnCd: commoCode.termsCode.clusAgrmDomnCd, // 약관동의영역코드
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
            domLayout: 'autoHeight',
            isCheckTermsName: false, // 중복확인 여부
            validState: {
                errState: false, // error state
                message: '' // input message
            },
            download: { pass: '', reason: '' }
        });

        // 검색 조건
        const formData = reactive({
            searchType: '', // 약관유형타입
            clusAgrmDomnCd: '', // 검색
            checkTermsGroupName: '' // 중복확인 약관그룹명
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                menuCode: computed(() => menuInfo.value.menuCode),
                searchType: computed(() => formData.searchType),
                searchText: computed(() => formData.clusAgrmDomnCd)
            },
            url: '/common/api/v1/clause-mncds/excel'

        });

        onMounted(() => {
            getTermsArea();

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
            goToPage('/policy/domain/register');
        };

        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
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
            getTermsArea();
        };

        /**
         * 
         */
        const changeSearchType = () => {
            console.log(formData.searchType);
            formData.clusAgrmDomnCd = '';
        };

        /**
         * 영역별약관 목록 조회
         */
        const getTermsArea = async () => {
            try {
                const params = {
                    size: pager.size,
                    offset: pager.offset,
                    searchType: formData.searchType,
                    searchText: formData.clusAgrmDomnCd
                };
                const response = await _getTermsArea(params);
                // console.log('>> get', response);

                state.termsAreaList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        // 조회 초기화
        const onInitDate = () => {
            //리스트 재조회
            clearList(1);
            getTermsArea();
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
            formData.searchType = '';
            formData.clusAgrmDomnCd = '';
            formData.page = num;

            onChangedPage(num);
        };

        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        /**
         * @onRowSelect ( 상세 페이지 이동 )
         * @param {
         *  mncdsSn: 영역별약관관리 Sn
         *  clusAgrmDomnCd: 약관동의영역
         *  clusMngOffrTyCd: 서비스제공자
         *  clusMngOff: 서비스제공자 Nm
         *  clusMngTgpTyCd: 서비스대상자
         * }
         */
        const onRowSelect = (e) => {
            const target = state.gridApi.getSelectedRows();
            console.log(target);
            goToPage(`/policy/domain/register?mncdsSn=${e.data.mncdsSn}&clusAgrmDomnCd=${e.data.clusAgrmDomnCd}&clusMngOffrTyCd=${e.data.clusMngOffrTyCd}&clusMngTgpTyCd=${e.data.clusMngTgpTyCd}&clusMngOffrNtprSnNm=${e.data.clusMngOffrNtprSnNm}`);
        };

        //다운로드 사유 등록 
        // const downConfirm = (type, con) => {
        //     console.log(type, con);
        //     if (type === 'pass') {
        //         state.download.pass = con;
        //     } else {
        //         state.download.reason = con;
        //     }
        // };

        return {
            dayJS,
            state,
            goToPage,
            pager,
            initColum,
            formData,
            onGridReady,
            onChangedPage,
            onInitDate,
            reloadList,
            selectedOptions,
            tableResize,
            resetTable,
            onRowSelect,
            changeSearchType,

            menuInfo,
            exelParams,
            onChangeDownRol,
            checkRegist
        };
    }
};

</script>