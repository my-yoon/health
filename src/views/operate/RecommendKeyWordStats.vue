<template>
    <section>
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>조건검색</label>
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
                <dateSerch ref="dateSearch" :pickerOnly="false" :setDay="state.setDay" dateTitle="노출기간"
                    @onSelectDate="onSelectPicker" />
                <div class="btn-filter-set">
                    <button class="btn btn-sm" type="button" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button class="btn btn-sm" type="button" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                </div>
            </div>
            <div class="form-item">
                <div class="item">
                    <label>남녀성별비</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.genderCode" class="custom-select sm">
                                <option v-for="(item, index) in state.genderList" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>인기연령대</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.popularAgeGroupCode" class="custom-select sm">
                                <option v-for="(item, index) in state.popularAgeGroupCodeList" :key="index"
                                    :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>노출화면</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.exposeScreenCode" class="custom-select sm">
                                <option v-for="(item, index) in state.exposeScreenCodeList" :key="index"
                                    :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>사용여부</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.useYn" class="custom-select sm">
                                <option v-for="(item, index) in state.useYnlist" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <!-- <FileDownLoad :api-url="state.excelDown.apiUrl" :is-reason="state.excelDown.isReason" :params="downloadFormData"></FileDownLoad> -->
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
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
            <NoData v-if="state.keywordList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                    :postSortRows="postSortRows" :rowData="state.keywordList" class="ag-theme-alpine" domLayout="autoHeight"
                    @grid-ready="onGridReady">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                    @changedPage="onChangedPage" />
            </div>
        </div>
    </section>
</template>
<script>
import { computed, reactive, inject, onMounted, ref } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import DateTimeSingle from '@/components/ui/DateTimeSingle.vue';
import { _getRecommendKeywordStats } from '@/api/operate.js';
import codeList from '@/data/commcode/codeList.js';
import DateSingle from '@/components/ui/DateSingle.vue';
// import FileDownLoad from '@/views/operate/components/FileDownLoad.vue';
import { useStore } from 'vuex';

export default {
    components: { DateSingle, DefaultModal, DateSerch, DateTimeSingle },
    setup() {
        const store = useStore();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const dateSearch = ref(null);
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
        const { onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 70,
                valueGetter: 'node.rowIndex + 1'
            },
            { headerName: '추천키워드', field: 'recommendKeywordName', flex: 1, sortable: true, unSortIcon: true },
            { headerName: '노출화면', field: 'exposeScreenName', flex: 1 },
            { headerName: '사용여부', field: 'useYnName', flex: 1 },
            {
                headerName: '노출횟수',
                field: 'exposeNum',
                flex: 1,
                sortable: true,
                unSortIcon: true,
                valueFormatter: param => {
                    // 숫자의 경우 정렬 사용시 미리 형변환이 되면 안되기 때문에
                    // 세자리 콤마
                    return param.value.toLocaleString('ko');
                }
            },
            {
                headerName: '총클릭수',
                field: 'clickNum',
                flex: 1,
                sortable: true,
                unSortIcon: true,
                valueFormatter: param => {
                    // 세자리 콤마
                    return param.value.toLocaleString('ko');
                }
            },
            { headerName: 'CTR(%)', field: 'ctr', flex: 1 },
            { headerName: '성별비(남:여)', field: 'genderRatio', flex: 1 },
            { headerName: '최다클릭연령대', field: 'mostClickAgeName', flex: 1 },
            { headerName: '노출시작일시', field: 'exposeBeginDt', flex: 1 },
            { headerName: '노출종료일시', field: 'exposeEndDt', flex: 1 }
        ]);

        const state = reactive({
            tableColum_c: _.clone(initColum.value),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            keywordList: [],
            delList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            useYnlist: [
                { label: '전체', value: '' },
                { label: '사용', value: 'Y' },
                { label: '미사용', value: 'N' }
            ],
            searchTypeList: [{ label: '추천키워드', value: '' }],
            exposeScreenCodeList: [{ label: '선택', value: '' }],
            genderList: [
                { label: '선택', value: '' },
                { label: '남성', value: 'man' },
                { label: '여성', value: 'woman' }
            ],
            popularAgeGroupCodeList: [{ label: '선택', value: '' }],
            setDay: '1month'
            // excelDown: {
            //     isReason: true,
            //     apiUrl: '/common/api/v1/operation/recommend-keyword/stats/excel'
            // },
            // menuCode: '1016008'
        });

        // 검색 조건
        const formData = reactive({
            bgnDate: computed(() => state.startday), //시작일
            endDate: computed(() => state.endday), //종료일
            searchType: '', //검색조건
            searchText: '', //내용
            exposeScreenCode: '', // 노출화면
            useYn: '', // 사용여부
            genderCode: '', //남녀성별비
            popularAgeGroupCode: '', //인기연령대
            orderType: null,
            orderSort: null,
            menuCode: computed(() => menuInfo.value.menuCode)
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                bgnDate: computed(() => state.startday),
                endDate: computed(() => state.endday),
                searchType: computed(() => formData.searchType),
                searchText: computed(() => formData.searchText),
                exposeScreenCode: computed(() => formData.exposeScreenCode),
                useYn: computed(() => formData.useYn),
                genderCode: computed(() => formData.genderCode),
                popularAgeGroupCode: computed(() => formData.popularAgeGroupCode),
                orderType: computed(() => formData.orderType),
                orderSort: computed(() => formData.orderSort),
                // menuCode: state.menuCode
                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: '/common/api/v1/operation/recommend-keyword/stats/excel'
        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(async () => {
            // 노출화면코드 조회
            await codeList.getGroupCode(281000).then(codeList => {
                state.exposeScreenCodeList = [...state.exposeScreenCodeList, ...codeList];
            });
            // 인기연령대 조회
            await codeList.getGroupCode(283000).then(codeList => {
                state.popularAgeGroupCodeList = [...state.popularAgeGroupCodeList, ...codeList];
            });
            await getRecommendKeyword();  // 리스트 호출
        });

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            if (type === 'day') {
                state.startday = value[0];
                state.endday = value[1];
            } else if (type === 'self_end' || type === 'self_start') {
                // 직접 데이터 피커 설정
                if (type === 'self_start') {
                    state.startday = value;
                } else if (type === 'self_end') {
                    state.endday = value;
                }
            }
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        //페이징 처리
        const onChangedPage = (num) => {
            pager.current = num;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getRecommendKeyword();
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            formData.bgnDate = computed(() => state.startday); //시작일
            formData.endDate = computed(() => state.endday); //종료일
            formData.searchText = ''; //내용
            formData.exposeScreenCode = ''; //
            formData.useYn = ''; //
            formData.page = 0;
            onChangedPage(num);
        };

        //리스트 조회
        const getRecommendKeyword = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate,
                    searchText: formData.searchText,
                    useYn: formData.useYn,
                    exposeScreenCode: formData.exposeScreenCode, //grpCd 281000
                    moreClickedGender: formData.genderCode, // man / woman
                    popularAgeGroupCode: formData.popularAgeGroupCode, //grpCd 283000
                    orderType: formData.orderType === 'recommendKeywordName' ? 'recommendKeyword' : formData.orderType, //recommendKeyword / exposeBeginDt / exposeEndDt / exposeNum / clickNum / CTR AG-Grid 기능 사용
                    orderSort: formData.orderSort, //desc / asc AG-Grid 기능 사용
                    menuCode: state.menuCode,
                    page: 0
                };

                const response = await _getRecommendKeywordStats(params);
                state.keywordList = response.data.data.list.map(item => {
                    item.useYnName = item.useYn === 'Y' ? '사용' : '미사용';
                    return item;
                });
                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };

        // 조회 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
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
            return state.filterCoulm;
        };


        const postSortRows = (e) => {
            let orderType = null;
            let orderSort = null;
            // 정렬
            if (state.keywordList && e.columnApi.getColumnState().filter(item => item.sort).length > 0) {
                const columnState = e.columnApi.getColumnState().filter(item => item.sort)[0];
                orderType = columnState.colId;
                orderSort = columnState.sort;
            }

            // 해당조건이 없으면 무한루프걸림 주의
            if (formData.orderType !== orderType || orderSort !== formData.orderSort) {
                formData.orderType = orderType;
                formData.orderSort = orderSort;
                //api호출
                getRecommendKeyword();
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            pager,
            state,
            formData,
            dateSearch,
            initColum,
            // downloadFormData,
            onGridReady,
            reloadList,
            onChangedPage,
            selectedOptions,
            checkOptions,
            resetTable,
            onSelectPicker,
            onInitDate,
            postSortRows,

            menuInfo,
            exelParams,
            onChangeDownRol
        };
    }
};
</script>