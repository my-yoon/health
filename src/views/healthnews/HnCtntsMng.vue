<template>
<div class="ui-data-filter">
    <div class="form-item">
        <div class="form-item">
            <div class="item">
                <label>검색조건</label>
                <span class="input">
                    <span class="dv">
                        <select class="custom-select sm" v-model="state.searchParams.majorCode" @change="changeMjcsCd">
                            <option v-for="(item, index) in state.mjcsOptionsList" :value="item.classificationCode" :key="`option-${item.classificationCode}-${index}`">
                                {{ item.classificationCodeName }}
                            </option>
                        </select>
                    </span>
                    <span class="dv">
                        <select class="custom-select sm" v-model="state.searchParams.mediumCode" :disabled="state.isMdcsDisabled" @change="changeMdcsCd">
                            <option v-for="(item, index) in state.mdcsOptionsList" :value="item.classificationCode" :key="`option-${item.classificationCode}-${index}`">
                                {{ item.classificationCodeName }}
                            </option>
                        </select>
                    </span>
                    <span class="dv">
                        <select class="custom-select sm" v-model="state.searchParams.minorCode" :disabled="state.isMncsDisabled">
                            <option v-for="(item, index) in state.mncsOptionsList" :value="item.classificationCode" :key="`option-${item.classificationCode}-${index}`">
                                {{ item.classificationCodeName }}
                            </option>
                        </select>
                    </span>
                </span>
            </div>
            <div class="item">
                <label>게시 구분</label>
                <span class="input">
                    <span class="dv">
                        <span class="radio" v-for="(item, index) in pstOptionsList" :key="`pst-option-${index}`">
                            <input :id="`noticeType${index}`" name="noticeTypeGroup" type="radio" v-model="state.searchParams.postUpAlternative" :value="item.code">
                            <label :for="`noticeType${index}`">{{ item.name }}</label>
                        </span>
                    </span>
                </span>
            </div>
            <div class="item">
                <label>키워드</label>
                <span class="input">
                    <span class="dv">
                        <select class="custom-select sm" v-model="state.searchParams.keywordType">
                            <option v-for="(item, index) in keywordOptionsList" :value="item.code" :key="`option-${item.code}-${index}`">
                                {{ item.name }}
                            </option>
                        </select>
                    </span>
                    <span class="dv">
                        <input type="text" class="form-control sm" v-model="state.searchParams.keyword" @keyup="enterToSearch">
                    </span>
                </span>
            </div>
        </div>
        <div class="btn-filter-set">
            <button type="button" class="btn btn-sm" @click="getHealthNewsContentList">
                <span class="ico-search"></span>조회 </button>
            <button type="button" class="btn btn-sm" @click="initSearchParameter">
                <span class="ico-reload sg"></span>
                <span class="offscreen">리로드</span>
            </button>
            <button type="button" class="btn btn-sm" @click="toggleSearch()">
                <span class="txt">{{ state.searchMoreBtnTxt }}</span>
            </button>
        </div>
    </div>
    <div class="ui-data-filter-more" v-show="state.isShowSearchMore">
        <div class="form-item">
            <div class="item">
                <dateSerch
                    ref="dateSerchRef"
                    :dateTitle="'등록일'"
                    :setDay="state.dayType"
                    @onChangeDate="onSelectPicker" />
            </div>
            <div class="item">
                <label>범위 검색</label>
                <span class="input">
                    <span class="dv">
                        <select class="custom-select sm" v-model="state.searchParams.rangeType">
                            <option v-for="(item, index) in rangeSearchOptionsList" :value="item.code" :key="`option-${item.code}-${index}`">
                                {{ item.name }}
                            </option>
                        </select>
                    </span>
                    <span class="dv">
                        <input type="number" class="form-control sm w-100" min="0" v-model="state.searchParams.rangeStart" @keyup="enterToSearch">
                    </span>
                    <span class="dv">~</span>
                    <span class="dv">
                        <input type="number" class="form-control sm w-100" min="0" v-model="state.searchParams.rangeEnd" @keyup="enterToSearch">
                    </span>
                </span>
            </div>
        </div>
    </div>
</div>
<div class="tbl-wrap mt-20">
    <div class="table-util flex space-between">
        <div class="btn-set-m flex">
            <button type="button" class="btn btn-ss" @click="updateCtntsNotShow">미노출</button>
            <button type="button" class="btn btn-ss" @click="goToCms">CMS 바로가기</button>
        </div>
        <div class="btn-set-m flex align-end">
            <span class="table-total">조회결과 총 <strong>{{ state.pager.totalCnt }}</strong>건</span>
            <select class="custom-select sm" v-model="state.pager.size" @change="getHealthNewsContentList">
                <option v-for="(item, index) in pageSizeOptionsList" :value="item.code" :key="`option-${item.code}-${index}`">
                    {{ item.name }}개씩 보기
                </option>
            </select>
            <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit">
                <span class="offscreen">컬럼 리사이징</span>
            </button>
            <button type="button" class="btn btn-opt-ico filter" @click="resetTable">
                <span class="offscreen">컬럼 셋팅</span>
            </button>
        </div>
    </div>

    <columlist :columlists="tablelist_hnCtntsMng_label" @checkColum="checkOptions" />
    <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="grid.rowData.length === 0"></NoData>
    <template v-else>
        <AgGridVue
            class="ag-theme-alpine ctnts-mng-grid"
            :domLayout="'autoHeight'"
            :rowSelection="'multiple'"
            :defaultColDef="grid.defaultColDef"
            :columnDefs="grid.tableColum_c"
            :rowData="grid.rowData"
            :suppressRowClickSelection="true"
            :suppressRowTransform="true"
            @grid-ready="onGridReady"
            @cell-clicked="cellClicked"
            @selection-changed="onRowSelect"
            @first-data-rendered="onFirstDataRendered">
        </AgGridVue>
        <PageNavigation :cntPerPage='state.pager.size' :itemCount='state.pager.totalCnt' :currentPage="state.pager.current" @changedPage="onChangedPage" />
    </template>
</div>
</template>
<script>
import { reactive, onMounted, computed, ref, onUnmounted, inject, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { tablelist_hnCtntsMng_label } from '@/data/table/healthnewsTable.js';
import { clsfState, _getClassificationList, _setClassificationList, _getContentList, _setContent } from '@/api/healthnews.js';
import DateSerch from './components/DateSerch.vue';

export default {
    components: {
        DateSerch
    },
    setup() {
        const router = useRouter();
        const store = useStore();
        const modal = inject('$Modal');
        const dateSerchRef = ref(null);
        const ctntsMngStateStore = computed(() => store.state.healthnews.ctntsMngState);

        const pageSizeOptionsList = [
            { code: 10, name: '10' },
            { code: 20, name: '20' },
            { code: 30, name: '30' },
            { code: 40, name: '40' }
        ];
        const pstOptionsList = [
            { code: 'all', name: '전체' },
            { code: 'Y', name: '게시' },
            { code: 'N', name: '비게시' }
        ];
        const keywordOptionsList = [
            { code: 'contentsTitle', name: '콘텐츠제목' },
            { code: 'hashTag', name: '해시태그' }
        ];
        const rangeSearchOptionsList = [
            { code: 'quiz', name: '퀴즈 참여 수' },
            { code: 'correct', name: '정답률' },
            { code: 'share', name: '공유수' },
            { code: 'interest', name: '관심 뉴스' }
        ];
        const firstClassificationObject = (() => {
            const object = _.cloneDeep(clsfState.object);
            object.classificationCode = 'all';
            return object;
        })();

        const state = reactive({
            isMounted: false,
            searchParams: {
                majorCode: '',
                mediumCode: '',
                minorCode: '',
                postUpAlternative: null,
                keywordType: null,
                keyword: '',
                firstRegistrationStartDate: null,
                firstRegistrationEndDate: null,
                rangeType: null,
                rangeStart: null,
                rangeEnd: null
            },
            isMdcsDisabled: true,
            isMncsDisabled: true,
            mjcsOptionsList: [],
            mdcsOptionsList: [],
            mncsOptionsList: [],
            isShowSearchMore: false,
            isGridColumnSizeToFit: true,
            searchMoreBtnTxt: computed(() => state.isShowSearchMore ? '상세검색 닫기' : '상세검색 열기'),
            dayType: '1month',
            pager: {
                current: 1,
                currentPageSize: 1,
                size: 10,
                offset: computed(() => (state.pager.current - 1) * state.pager.size),
                totalCnt: 0,
                selectList: []
            }
        });

        const grid = reactive({
            rowData: [],
            tableColum_c: _.clone(tablelist_hnCtntsMng_label),
            defaultColDef: {
                filter: false,
                sortable: true,
                resizable: true,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            filterCoulm: [],
            gridApi: null,
            gridColumApi: null
        });

        const simpleModal = (message) => {
            if (!state.isMounted) return;
            modal.simple({ title: '안내', message, className: 'warning', buttonText: { ok: '확인' }});
        };

        const getClassificationFirstObject = (name) => {
            const object = _.cloneDeep(firstClassificationObject);
            object.classificationCodeName = `${name} 전체`;
            return object;
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = async (params) => {
            grid.gridApi = params.api;
            grid.gridColumApi = params.columnApi;
            await nextTick();
            if (state.isGridColumnSizeToFit) grid.gridApi.sizeColumnsToFit(params);
        };
        // 체크 박스 선택시 
        const onRowSelect = (e) => {
            console.log(grid.gridApi.getSelectedRows());
            const rowList = grid.gridApi.getSelectedRows();
            state.selectList = rowList;
        };
        const cellClicked = (e) => {
            if (grid.gridApi.getFocusedCell().column.colId === 'title') {
                router.push({ path: '/service/health_news/contents/detail', state: { type: 'hnCtntsDetail', ...e.data } });
            }
        };
         // 삭제할 컬럼 선택
        const checkOptions = async (value) => {
            grid.filterCoulm = value;
            grid.tableColum_c = _.clone(tablelist_hnCtntsMng_label).filter(item => !grid.filterCoulm.includes(item.headerName));
            if (state.isGridColumnSizeToFit) {
                await nextTick();
                grid.gridApi.sizeColumnsToFit();
            }
        };
        // 컬럼 변경
        const resetTable = () => {
            state.isGridColumnSizeToFit = false;
            store.commit('healthnews/setIsGridColumnSizeToFit', _.cloneDeep(false));
            grid.tableColum_c = _.clone(tablelist_hnCtntsMng_label).filter(item => !grid.filterCoulm.includes(item.headerName));
        };
        // 테이블 현재창에 맞춤
        const sizeToFit = () => {
            state.isGridColumnSizeToFit = true;
            store.commit('healthnews/setIsGridColumnSizeToFit', _.cloneDeep(true));
            grid.gridApi.sizeColumnsToFit();
        };
        // 테이블 컬럼 초기값 설정 ==> 지정한 대로 나오도록 
        const onFirstDataRendered = () => {
            if (state.isGridColumnSizeToFit) {
                grid.gridApi.sizeColumnsToFit();
                return;
            }
            grid.gridColumApi.autoSizeColumns(grid.gridColumApi.getColumns().map((column) => column.getId()));
        };

        //상세 검색 하단 검색 목록 토글
        const toggleSearch = () => {
            state.isShowSearchMore = !state.isShowSearchMore;
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value) => {
            state.searchParams.firstRegistrationStartDate = value['from'] ?? state.searchParams.firstRegistrationStartDate;
            state.searchParams.firstRegistrationEndDate = value['to'] ?? state.searchParams.firstRegistrationEndDate;
            state.dayType = type;
        };

        const initSearchParameter = async () => {
            state.isMdcsDisabled = true;
            state.isMncsDisabled = true;

            let mjcsOptionsList = [];
            try {
                mjcsOptionsList = await _getClassificationList({
                    classificationSectionCode: clsfState.codeGroup.mjcs.code,
                    classificationCode: ''
                });
            } catch (e) {
                simpleModal(e.message);
            }
            state.mjcsOptionsList = [getClassificationFirstObject(clsfState.codeGroup.mjcs.name), ...mjcsOptionsList];
            state.mdcsOptionsList = [getClassificationFirstObject(clsfState.codeGroup.mdcs.name)];
            state.mncsOptionsList = [getClassificationFirstObject(clsfState.codeGroup.mncs.name)];

            state.searchParams = {
                majorCode: state.mjcsOptionsList[0].classificationCode,
                mediumCode: state.mdcsOptionsList[0].classificationCode,
                minorCode: state.mncsOptionsList[0].classificationCode,
                postUpAlternative: pstOptionsList[0].code,
                keywordType: keywordOptionsList[0].code,
                keyword: '',
                firstRegistrationStartDate: null,
                firstRegistrationEndDate: null,
                rangeType: rangeSearchOptionsList[0].code,
                rangeStart: null,
                rangeEnd: null
            };

            if (dateSerchRef.value) {
                state.dayType = dateSerchRef.value.selectDayValue[2].value;
                dateSerchRef.value.state.dayType = state.dayType;
                dateSerchRef.value.onChangeDate(state.dayType);
            }
            getHealthNewsContentList();
        };

        const initStoreState = () => {
            state.searchParams = ctntsMngStateStore.value.searchParams;
            state.searchParams = ctntsMngStateStore.value.searchParams;
            state.isMdcsDisabled = ctntsMngStateStore.value.isMdcsDisabled;
            state.isMncsDisabled = ctntsMngStateStore.value.isMncsDisabled;
            state.mjcsOptionsList = ctntsMngStateStore.value.mjcsOptionsList;
            state.mdcsOptionsList = ctntsMngStateStore.value.mdcsOptionsList;
            state.mncsOptionsList = ctntsMngStateStore.value.mncsOptionsList;
            state.pager.size = ctntsMngStateStore.value.pageSize;
            state.isShowSearchMore = ctntsMngStateStore.value.isShowSearchMore;
            state.dayType = ctntsMngStateStore.value.dayType;
            state.pager = ctntsMngStateStore.value.pager;
            state.isGridColumnSizeToFit = ctntsMngStateStore.value.isGridColumnSizeToFit;
            dateSerchRef.value.updateDate({
                dayType: ctntsMngStateStore.value.dayType,
                fromDate: ctntsMngStateStore.value.searchParams.firstRegistrationStartDate,
                toDate: ctntsMngStateStore.value.searchParams.firstRegistrationEndDate
            });
            grid.tableColum_c[1].valueGetter = 'node.rowIndex + ' + Number(state.pager.size * (state.pager.current - 1) + 1);
            getHealthNewsContentList();
        };

        // 페이징 처리
        const onChangedPage = (num, type) => {
            state.pager.current = num;
            grid.tableColum_c[1].valueGetter = 'node.rowIndex + ' + Number(state.pager.size * (state.pager.current - 1) + 1);
            getHealthNewsContentList();
        };

        const changeMjcsCd = async () => {
            if (state.searchParams.majorCode === state.mjcsOptionsList[0].classificationCode) {
                state.isMdcsDisabled = true;
                state.isMncsDisabled = true;
                state.searchParams.majorCode = state.mjcsOptionsList[0].classificationCode;
                state.searchParams.mediumCode = state.mdcsOptionsList[0].classificationCode;
                state.searchParams.minorCode = state.mncsOptionsList[0].classificationCode;
                return;
            }

            let mdcsListByMjcs = [];
            try {
                mdcsListByMjcs = await _getClassificationList({
                    classificationSectionCode: clsfState.codeGroup.mdcs.code,
                    upperRankClassificationCode: state.searchParams.majorCode
                });
            } catch (e) {
                simpleModal(e.message);
            }

            state.mdcsOptionsList = [
                getClassificationFirstObject(clsfState.codeGroup.mdcs.name),
                ...mdcsListByMjcs
            ];

            state.searchParams.mediumCode = state.mdcsOptionsList[0].classificationCode;
            state.searchParams.minorCode = state.mncsOptionsList[0].classificationCode;
            state.isMncsDisabled = true;
            state.isMdcsDisabled = false;
        };

        const changeMdcsCd = async () => {
            if (state.searchParams.mediumCode === state.mdcsOptionsList[0].classificationCode) {
                state.isMncsDisabled = true;
                state.searchParams.minorCode = state.mncsOptionsList[0].classificationCode;
                return;
            }

            let mncsListByMdcs = [];
            try {
                mncsListByMdcs = await _getClassificationList({
                    classificationSectionCode: clsfState.codeGroup.mncs.code,
                    upperRankClassificationCode: state.searchParams.mediumCode
                });
            } catch (e) {
                simpleModal(e.message);
            }
            
            state.mncsOptionsList = [
                getClassificationFirstObject(clsfState.codeGroup.mncs.name),
                ...mncsListByMdcs
            ];
            state.isMncsDisabled = false;
            state.searchParams.minorCode = state.mncsOptionsList[0].classificationCode;
        };

        const updateCtntsNotShow = async () => {
            const selectedRows = (grid.gridApi.getSelectedRows()).map(item => {
                item.postUpAlternative = 'N';
                return item;
            });
            
            try {
                const result = await _setContent(selectedRows);
                if (result?.data?.code === 'FAIL') {
                    simpleModal(result.data.message);
                    return;
                }
                getHealthNewsContentList();
            } catch (e) {
                simpleModal(e.message);
            }
        };

        const enterToSearch = (e) => {
            if (e.keyCode === 13) getHealthNewsContentList();
        };

        const validate = () => {
            let isValid = true;

            const openModal = (message) => {
                modal.simple({ title: '안내', message, className: 'warning', buttonText: { ok: '확인' }});
                isValid = false;
            };

            const rangeTypeName = rangeSearchOptionsList.filter(item => {
                return item.code === state.searchParams.rangeType;
            })[0].name;

            if ((state.searchParams.rangeStart && state.searchParams.rangeEnd
                && state.searchParams.rangeStart > state.searchParams.rangeEnd)
                || (state.searchParams.rangeStart && state.searchParams.rangeEnd === 0)) {
                openModal(`[${rangeTypeName}]의 시작하는 수가 끝나는 수보다 클수 없습니다.`);
            }

            if ((state.searchParams.rangeStart && !state.searchParams.rangeEnd && state.searchParams.rangeEnd !== 0)
                || (!state.searchParams.rangeStart && state.searchParams.rangeEnd && state.searchParams.rangeStart !== 0)) {
                openModal(`[${rangeTypeName}]의 시작하는 숫자와 끝나는 숫자 둘 중 하나만 입력할 수 없습니다.`);
            }

            if (state.searchParams.firstRegistrationStartDate && state.searchParams.firstRegistrationEndDate
                && new Date(state.searchParams.firstRegistrationStartDate) > new Date(state.searchParams.firstRegistrationEndDate)) {
                openModal(`등록일의 시작 날짜가 끝나는 날짜보다 미래일 수 없습니다.`);
            }

            if (state.searchParams.keywordType === 'contentsTitle' && state.searchParams.keyword.length > 300) {
                openModal('콘텐츠제목 키워드를 300자 이내로 입력해주세요.');
                state.searchParams.keyword = '';
            }
            
            if (state.searchParams.keywordType === 'hashTag' && state.searchParams.keyword.length > 500) {
                openModal('해시태그 키워드를 500자 이내로 입력해주세요.');
                state.searchParams.keyword = '';
            }

            return isValid;
        };

        const getHealthNewsContentList = async () => {
            if (!validate()) return;
            const reqParameter = { ...state.searchParams, ...(state.isShowSearchMore ? state.searchParams : null) };
            if (!reqParameter.rangeStart) reqParameter.rangeStart = 0;
            if (!reqParameter.rangeEnd) reqParameter.rangeEnd = 0;

            const rangeWithUnderbar = () => {
                if (!state.searchParams.rangeStart && !state.searchParams.rangeEnd
                    && state.searchParams.rangeStart !== 0 && state.searchParams.rangeEnd !== 0) return '';
                return `${state.searchParams.rangeStart}_${state.searchParams.rangeEnd}`;
            };
            let response = null;
            try {
                response = await _getContentList({
                    currentPage: state.pager.current,
                    cntPerPage: Number(state.pager.size),
                    pageSize: 10,
                    majorCode: state.searchParams.majorCode === 'all' ? '' : state.searchParams.majorCode,
                    mediumCode: state.searchParams.mediumCode === 'all' ? '' : state.searchParams.mediumCode,
                    minorCode: state.searchParams.minorCode === 'all' ? '' : state.searchParams.minorCode,
                    postUpAlternative: state.searchParams.postUpAlternative === 'all' ? '' : state.searchParams.postUpAlternative,
                    title: state.searchParams.keywordType === 'contentsTitle' ? state.searchParams.keyword : '',
                    hashTagName: state.searchParams.keywordType === 'hashTag' ? state.searchParams.keyword : '',
                    quizCount: state.searchParams.rangeType === 'quiz' ? rangeWithUnderbar() : '',
                    quizCorrectAnswerRate: state.searchParams.rangeType === 'correct' ? rangeWithUnderbar() : '',
                    shareCount: state.searchParams.rangeType === 'share' ? rangeWithUnderbar() : '',
                    interestNewsAggregateCount: state.searchParams.rangeType === 'interest' ? rangeWithUnderbar() : '',
                    firstRegistrationStartDate: state.searchParams.firstRegistrationStartDate.replace(/-/gi, ''),
                    firstRegistrationEndDate: state.searchParams.firstRegistrationEndDate.replace(/-/gi, '')
                });
            } catch (e) {
                simpleModal(e.message);
            }

            if (!response) return;

            grid.rowData = [];
            state.pager.totalCnt = response.totalCnt;

            const rowData = [];
            for await (const item of response.list) {
                let itemClone = null;
                const subItemLength = item.subHealthNewsDetailList.length;
                let clsfCodeName = null;
                item.subHealthNewsDetailList.forEach((subItem, index) => {
                    itemClone = _.cloneDeep(item);
                    clsfCodeName += '<option value="' + subItem.majorCodeName + ' > ' + subItem.mediumCodeName + ' > ' + subItem.minorCodeName + '">' + subItem.majorCodeName + ' > ' + subItem.mediumCodeName + ' > ' + subItem.minorCodeName + '</option>';
                  
                });
                itemClone.clsfCodeName = clsfCodeName;
                rowData.push(itemClone);
            }
            grid.rowData = rowData;

            store.commit('healthnews/setCtntsMngState', _.cloneDeep(state));
        };

        const goToCms = () => {
            window.open('http://cms-adm.kb-ocare.co.kr:8080/ics7/sub/login.do');
        };

        onMounted(() => {
            state.isMounted = true;
            ctntsMngStateStore.value ? initStoreState() : initSearchParameter();
        });
        
        onUnmounted(() => {
            state.isMounted = false;
            if (history.state.current !== '/service/health_news/contents/detail') {
                store.commit('healthnews/setCtntsMngState', null);
            }
        });

        return {
            state,
            grid,
            ctntsMngStateStore,
            tablelist_hnCtntsMng_label,
            onGridReady,
            onRowSelect,
            cellClicked,
            checkOptions,
            resetTable,
            sizeToFit,
            onFirstDataRendered,
            toggleSearch,
            onSelectPicker,
            getHealthNewsContentList,
            initSearchParameter,
            onChangedPage,
            dateSerchRef,
            changeMjcsCd,
            changeMdcsCd,
            updateCtntsNotShow,
            pageSizeOptionsList,
            pstOptionsList,
            keywordOptionsList,
            rangeSearchOptionsList,
            goToCms,
            enterToSearch
        };
    }
};
</script>
<style>
.ctnts-mng-grid .cell-span {
    background-color: #ffffff;
    display: flex;
    text-align: left;
    justify-content: flex-start;
    align-items: center;
    min-width: 0;
    border-bottom: 1px solid #ebebeb;
}
.ctnts-mng-grid .cell-span > span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>