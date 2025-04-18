<template>
    <section>
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>권한레벨</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.authSeCd" class="custom-select sm">
                                <option v-for="(item, index) in state.authTypeList" :key="index" :value="item.value">
                                    {{ item.label }}
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
                                :disabled="formData.searchType === ''">
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
                    <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn()"
                        :disabled="!state.mskgnRlsYn || state.mskgnTried">
                        마스킹해제
                    </button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button class="btn btn-opt" type="button"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, formData.mskgnRlsYn, excelParams)">
                        <span class="ico-download"></span>
                        파일다운로드
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
            <NoData v-if="state.sellerMDList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else ref="agGrid">
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                    :domLayout="state.domLayout" :rowData="state.sellerMDList" class="ag-theme-alpine" style="width:100%"
                    @grid-ready="onGridReady">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                    @changedPage="onChangedPage" />
            </div>
        </div>

        <!-- 셀러배정 -->
        <DefaultModal :buttonCancel="''" :buttonConfirm="'닫기'" :isShow="isSellerShow" :modalName="'isSellerShow'"
            modalTitle="샐러현황" @modalclose="modalClose">
            <template #modalcontent>
                <SellerSerch :admnSn="state.admnSn" />
            </template>
        </DefaultModal>
    </section>
</template>
<script>
import { computed, reactive, onMounted, inject, ref, onUnmounted, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useStore } from 'vuex';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import SellerSerch from '@/components/ui/SellerSerch.vue';
import { _getSellerByMDList } from '@/api/admin.js';


export default {
    components: { DefaultModal, DateSerch, SellerSerch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage } = useCommFunc();
        const store = useStore();
        const isSellerShow = ref(false);
        const initColum = ref([
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '아이디', field: 'admnId', flex: 1 },
            { headerName: '이름', field: 'admnNm', flex: 1 },
            { headerName: '휴대폰번호', field: 'admnHhpno', flex: 1 },
            { headerName: '부서명', field: 'admnDepNm', flex: 1 },
            { headerName: '권한레벨', field: 'authSeNm', flex: 1 }, // MD 추가여부 확인 필요
            {
                headerName: '셀러배정',
                field: 'selrMdSq',
                flex: 1,
                cellRenderer: (params) => {
                    const tagString = `<a id="seller-${params.node.rowIndex}">${params.data.selrMdSq}</a>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#seller-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('click', () => {
                        console.log(params.data);
                        isSellerShow.value = true;
                        state.admnSn = params.data.admnSn;
                    });
                    return buttonTarget;
                }
            },
            { headerName: '로그인일시', field: 'admnLtlyLgnDt', flex: 1 }
        ]);
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
        const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
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
            sellerMDList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            admnSn: null,
            domLayout: 'autoHeight',
            // 권한레벨
            authTypeList: [
                { label: '전체', value: '' },
                { label: 'Manager', value: 144002 },
                { label: 'Associate Manager', value: 144003 }
            ],
            // 검색조건
            searchTypeList: [
                { label: '선택', value: '' },
                { label: '이름', value: 'admnNm' },
                { label: '아이디', value: 'admnId' },
                { label: '부서명', value: 'admnDepNm' },
                { label: '셀러명', value: 'ntprNm' }
            ],
            menuCode: computed(() => menuInfo.value.menuCode),
            mskgnRlsYn: true,
            mskgnTried: false // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
        });

        // 검색 조건
        const formData = reactive({
            authSeCd: '', // 권한구분코드 "144002(Manager) / 144003(Associate Manager)"
            searchType: '', //조회조건 admnNm(이름) / admnId(아이디) / admnDepNm(부서명) / ntprNm(셀러명)
            searchText: '', //내용
            mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N')  // 마스킹 해제 여부
        });
        // 엑셀용 함수
        const excelParams = reactive({
            params: {
                searchType: computed(() => formData.searchType === '' ? null : formData.searchType),
                searchText: computed(() => formData.searchText),
                mskgnRlsYn: computed(() => formData.mskgnRlsYn),
                authSeCd: computed(() => formData.authSeCd),
                menuCode: state.menuCode
            },
            url: '/common/api/v1/adminMemberManagement/sellerByMD/excel'

        });

        onMounted(() => {
            getSellerByMDList();
            // emitter.$on('cellMdListSelect', sellerListPopup);
            emitter.$on('onChangeMskgn', onChangeMskgn);
        });

        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
        });
        //마스킹 해제 처리 후 리스트 재조회 
        const onChangeMskgn = async () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            await getSellerByMDList();
            state.mskgnTried = true;
        };
        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            if (!state.mskgnTried) {
                await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
            }
        };
        //메뉴 코드 감지
        watch(menuInfo, async () => {
            if (menuInfo.value.menuCode) {
                getSellerByMDList();
            }
            console.log('change formData');
            if (state.mskgnTried) {
                state.mskgnRlsYn = true;
            }
        });
        // 페이징 처리
        const pager = reactive({
            current: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        // 페이징 처리
        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            getSellerByMDList();
        };

        //리스트 조회
        const getSellerByMDList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    authSeCd: formData.authSeCd,
                    searchType: formData.searchType,
                    searchText: formData.searchText,
                    mskgnRlsYn: formData.mskgnRlsYn
                };
                const response = await _getSellerByMDList(params);
                state.sellerMDList = response.data.data.list;
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
            formData.authType = ''; // 권한레벨
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

        const sellerListPopup = (e) => {
            state.admnSn = e.data.admnSn;
            console.log(state.admnSn);
            isSellerShow.value = true;
        };

        const modalClose = () => {
            isSellerShow.value = false;
        };

        return {
            $Modal,
            dayJS,
            state,
            pager,
            initColum,
            menuInfo,
            formData,
            isSellerShow,
            excelParams,
            goToPage,
            onChangedPage,
            selectedOptions,
            checkOptions,
            resetTable,
            onInitDate,
            reloadList,
            onChangeMasking,
            onGridReady,
            modalClose,
            onChangeDownRol,
            changeMskgnRlsYn
        };
    }
};

</script>