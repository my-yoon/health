<template>
    <section>
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>파트너 어드민 구분</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.adminType" class="custom-select sm">
                                <option v-for="(item, index) in state.adminTypeList" :key="index" :value="item.cmnCd">
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
                            <input v-model="formData.searchText" class="form-control sm" type="text"
                                :disabled="formData.searchType">
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
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button class="btn btn-ss" type="button" @click="onChangeRegistRol(menuInfo.auth1RegistYn)">등록</button>
                    <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn()"
                        :disabled="!state.mskgnRlsYn || state.mskgnTried">
                        마스킹해제
                    </button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, formData.mskgnRlsYn, exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox selectType="page" @changedValue="selectedOptions" />
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
            <NoData v-if="state.adminList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else ref="agGrid">
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                    :domLayout="state.domLayout" :rowData="state.adminList" class="ag-theme-alpine" style="width:100%"
                    @grid-ready="onGridReady" @cell-clicked="onCellClicked">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                    @changedPage="onChangedPage" />
            </div>
        </div>
    </section>
</template>
<script>
import { computed, reactive, onMounted, inject, ref, watch, onUnmounted } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { _getPartnerSubAccount } from '@/api/admin.js';
import codeList from '@/data/commcode/codeList.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const { goToPage, tableResize, getCommonCode } = useCommFunc();
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
        const { onChangeMaskingRol, onChangeDownRol, onChangeRegistRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const initColum = ref([
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '파트너 어드민', field: 'admnPtnrTyNm', flex: 1 },
            { headerName: '파트너명', field: 'ntprNm', flex: 1 },
            { headerName: '아이디', field: 'admnId', flex: 1 },
            { headerName: '이름', field: 'admnNm', flex: 1 },
            { headerName: '휴대폰번호', field: 'admnHhpno', flex: 1 },
            { headerName: '부서명', field: 'admnDepNm', flex: 1 },
            { headerName: '로그인일시', field: 'admnLtlyLgnDt', flex: 1 }
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
            adminList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            searchKeyword: '',
            domLayout: 'autoHeight',
            // 어드민 구분
            adminTypeList: [],
            // 검색조건
            searchTypeList: [
                { label: '선택', value: '' },
                { label: '이름', value: 'admnNm' },
                { label: '아이디', value: 'admnId' },
                { label: '부서명', value: 'admnDepNm' },
                { label: '파트너명', value: 'ntprNm' }
            ],
            menuCode: computed(() => menuInfo.value.menuCode),
            mskgnRlsYn: true,
            mskgnTried: false // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
        });

        // 검색 조건
        const formData = reactive({
            searchType: '', // admnNm(관리자명) / admnId(관리자ID) / admnDepNm(관리자부서)
            searchText: '', //내용f
            mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N'), // 마스킹 해제 여부 ('N' 해제)
            adminType: ''
        });
        //메뉴 코드 감지
        watch([menuInfo, formData], async () => {
            if (state.mskgnTried) {
                state.mskgnRlsYn = true;
            }
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                admnPtnrTyCd: computed(() => formData.adminType),
                searchType: computed(() => formData.searchType),
                searchText: computed(() => formData.searchText),
                mskgnRlsYn: computed(() => formData.mskgnRlsYn),
                menuCode: computed(() => formData.menuCode)
            },
            url: '/common/api/v1/adminMemberManagement/partnerSubAccount/excel'
        });

        onMounted(async () => {
            await getCommonCode(111000, getlistCommonCode);
            await getPartnerList();
            //등록 권한 확인 후  페이지 이동
            emitter.$on('onChangeRegist', onChangeRegist);
            //마스킹 권한 확인 후 리스트조회
            emitter.$on('onChangeMskgn', onChangeMskgn);

        });
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
            emitter.$off('onChangeRegist');
        });
        const onChangeRegist = () => {
            goToPage('/member/partner/sub_account/register');
        };
        const getlistCommonCode = (value) => {
            state.adminTypeList = value;
            state.adminTypeList = state.adminTypeList.filter(item => item.cmnCd !== '111001');
            state.adminTypeList.splice(0, 0, { cmnCd: '', cmnCdNm: '선택' });
        };
        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn, state.mskgnRlsYn);
        };
        //마스킹 해제 처리 후 리스트 재조회 
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getPartnerList();
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
            getPartnerList();
        };

        //리스트 조회
        const getPartnerList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    admnPtnrTyCd: formData.adminType,
                    mskgnRlsYn: formData.mskgnRlsYn,
                    searchType: formData.searchType,
                    searchTysearchTextpe: formData.searchText,
                    menuCode: state.menuCode
                };
                const response = await _getPartnerSubAccount(params);
                state.adminList = response.data.data.list;
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
            formData.searchType = ''; //공지검색구분
            formData.searchText = ''; //내용
            formData.mskgnRlsYn = 'Y'; // 마스킹 해제 여부
            formData.adminType = ''; // 어드민구분
            formData.page = num;
            onChangedPage(num);
        };

        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        const onChangeMasking = () => {
            pager.current = 1;
            formData.mskgnRlsYn = formData.mskgnRlsYn === 'Y' ? 'N' : 'Y';
            onChangedPage(pager.current);
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        //테이블 셀 선택
        const onCellClicked = (e) => {
            goToPage('/member/partner/sub_account/detail?admnSn=' + e.data.admnSn);
        };

        return {
            $Modal,
            dayJS,
            state,
            pager,
            initColum,
            formData,
            goToPage,
            tableResize,
            onChangedPage,
            selectedOptions,
            checkOptions,
            resetTable,
            onInitDate,
            reloadList,
            onChangeMasking,
            onGridReady,
            onCellClicked,
            exelParams,
            changeMskgnRlsYn,
            onChangeRegistRol,
            menuInfo,
            onChangeDownRol
        };
    }
};

</script>