<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>카테고리</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="state.searchOptions.ctgrMngSn">
                                <option value="0">전체</option>
                                <option v-for="(item, index) in state.categoryList" :key="index" :value="item.ctgrMngSn">
                                    {{ item.ctgrNm }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>키워드</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="state.searchOptions.searchType">
                                <option v-for="(item, index) in state.searchOptions.keywordType" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                        <span class="dv">
                            <input type="text" class="form-control sm" v-model="state.searchOptions.searchText">
                        </span>

                    </span>
                </div>

                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회</button>
                    <button type="button" class="btn btn-sm" @click="clearList(1)">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />

                    <button type="button" class="btn btn-opt-ico fit" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                    <button type="button" class="btn btn-opt-ico filter full" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.tagList.length === 0"></NoData>
            <div v-else>
                <AgGridVue
                    :columnDefs="state.tableColum_c"
                    :defaultColDef="state.defaultColDef"
                    :rowData="state.tagList"
                    :domLayout="'autoHeight'"
                    class="ag-theme-alpine"
                    style="width:100%"
                    @grid-ready="onGridReady"
                    @cell-clicked="onCellClicked"
                />
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>

    </section>
</template>

<script>
import { computed, reactive, inject, onMounted, ref, watch } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCommunityRecommend, _getCommunityCategory } from '@/api/service.js';

export default {
    // components: { DefaultModal, MemberList, CategoryOrder },
    setup() {
        const $Modal = inject('$Modal');
        const store = useStore();
        
        const { goToPage, tableResize } = useCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        
        const initColum = ref([
            { headerName: '번호', field: 'no', maxWidth: 80, valueGetter: 'node.rowIndex + 1' },
            { headerName: '카테고리', field: 'ctgrNm' },
            { headerName: '인기 태그', field: 'tagPopHashTagNm' },
            { headerName: '인기 태그 사용 여부', field: 'tagPopUseYn' },
            { headerName: '추천 태그 1', field: 'tagRcmHashTagNm1' },
            { headerName: '추천 태그 2', field: 'tagRcmHashTagNm2' },
            { headerName: '추천 태그 3', field: 'tagRcmHashTagNm3' },
            { headerName: '추천 태그 4', field: 'tagRcmHashTagNm4' },
            { headerName: '추천 태그 5', field: 'tagRcmHashTagNm5' },
            { headerName: '추천 태그 6', field: 'tagRcmHashTagNm6' },
            { headerName: '추천 태그 7', field: 'tagRcmHashTagNm7' }
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
            searchOptions: {
                ctgrMngSn: 0, // 선택 카테고리 Sn
                searchType: 'tagRcmHashTagNm', // tagPopHashTagNm(인기태그명), tagRcmHashTagNm(추천태그명)
                searchText: '',
                
                keywordType: [
                    { label: '추천태그', value: 'tagRcmHashTagNm' },
                    { label: '인기태그', value: 'tagPopHashTagNm' }
                ]
            },

            pagesize: 10,
            categoryList: [],
            tagList: []

        });

        /**
         * @pager
         */
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        watch(state.formData, () => {
            resetState();
        });

        onMounted(() => {
            // getMessageList();
            getCommunityCategory();
            getCommunityRecommend();

        });

        /**
         * community - category 목록 조회
         */
        const getCommunityCategory = async () => {
            try {
                const params = {
                    rgtrOptpTyCd: '', // 등록자공개유형코드(376001:프로필공개/376002:익명)
                    imgEsnYn: '', // 이미지필수여부(Y: 필수/N: 선택)
                    pstYn: '', // 게시여부(Y: 공개/N: 비공개)
                    trgTyCd: '', // 대상유형코드(378001:모든 사용자/378002:회원 그룹 선택)
                    mbrGrpSn: '', // 회원그룹순번
                    searchType: '', // 조회조건 ctgrNm(카테고리명)/ctgrCd(카테고리코드)
                    searchText: '', // 조회조건값

                    size: 10000,
                    offset: 0
                    // page: pager.current
                };
                const response = await _getCommunityCategory(params);
                state.categoryList = response.data.data.list;
                // pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };
        /**
         * community - 추천태그 목록 조회
         */
        const getCommunityRecommend = async () => {
            try {
                const params = {
                    ctgrMngSn: state.searchOptions.ctgrMngSn,
                    searchType: state.searchOptions.searchType, // tagPopHashTagNm(인기태그명), tagRcmHashTagNm(추천태그명)
                    searchText: state.searchOptions.searchText,

                    size: pager.size,
                    offset: pager.offset
                    // page: pager.current
                };
                const response = await _getCommunityRecommend(params);
                state.tagList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
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
            getCommunityRecommend();
        };

        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        //페이징 처리 (group)
        const onChangedPageGrp = (num) => {
            grpPager.current = num;
            //테이블 인덱스 번호 처리
            initColum_member.value[0].valueGetter = 'node.rowIndex + ' + Number(grpPager.size * (grpPager.current - 1) + 1);
            getMemberGroup();
        };
        
        const clearList = (num) => {
            state.searchOptions.ctgrMngSn = 0; // 선택 카테고리 Sn
            state.searchOptions.searchType = 'tagRcmHashTagNm'; // tagPopHashTagNm(인기태그명), tagRcmHashTagNm(추천태그명)
            state.searchOptions.searchText = '';
            onChangedPage(num);
            // getTodoCategory();
        };

        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
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

        const onCellClicked = (e) => {
            console.log(e.data);
            goToPage(`/service/community/rcmdetail?ctgrMngSn=${e.data.ctgrMngSn}`);
        };

        return {
            //공통 사용
            $Modal,
            
            state,
            pager,
            initColum,
            onGridReady,
            tableResize,
            reloadList,
            onChangedPage,
            selectedOptions,
            resetTable,
            clearList,
            onCellClicked
        };
    }
};
</script>