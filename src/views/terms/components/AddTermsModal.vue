<template>
    <div class="ui-title-3">
        <h3>약관추가</h3>
    </div>
    <div class="ui-data-filter sm mt-10">
        <div class="form-item">
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
            <div class="btn-filter-set">
                <button type="button" class="btn btn-sm" @click="reloadList">
                    <span class="ico-search"></span>검색</button>
            </div>
        </div>
    </div>
    <div class="tbl-wrap mt-10">
        <div class="table-util flex space-between">
            <div class="btn-set-m flex"></div>
            <div class="btn-set-m flex align-end">
                <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
            </div>
        </div>
        <div id="myGrid" class="ag-theme-alpine"></div>
        <NoData v-if="state.termsList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
        <div v-else ref="agGrid">
            <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                :domLayout="state.domLayout" :rowData="state.termsList"
                :suppressRowClickSelection="true" @grid-ready="onGridReady" @selection-changed="onRowSelect"
                :rowSelection="'multiple'" class="ag-theme-alpine" style="width:100%">
            </AgGridVue>
            <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                @changedPage="onChangedPage" />
        </div>
    </div>
</template>
<script>

import { getCurrentInstance, onMounted, onUnmounted, reactive, computed, ref } from 'vue';
import { _getTerms } from '@/api/terms';
export default {
    emits: ['selectPartner'],
    // components: {btnComp},
    props: ['clusMngOffrTyCd', 'clusMngTgpTyCd', 'esnClusYn', 'clusMngOffrNtprSn'],
    setup(props) {
        const {emit} = getCurrentInstance();
        const initColum = ref([
            { headerName: '선택', field: 'select', maxWidth: 50, checkboxSelection: true, headerCheckboxSelection: true },
            // { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '약관그룹', field: 'clusGrpNm', flex: 1 },
            { headerName: '약관유형', field: 'clusTyCdNm', flex: 1 },
            { headerName: '서비스제공자', field: 'clusMngOffrNtprSnNm', flex: 1 },
            { headerName: '서비스대상자', field: 'clusMngTgpNtprSnNm', flex: 1 },
            { headerName: '약관명', field: 'clusNm', flex: 1 }
        ]);
        const state = reactive({
            pagesize: 4,
            termsList: [], // 약관목록
            selectedList: [],

            tableColum_c: _.clone(initColum.value),
            // 테이블 옵션
            domLayout: 'autoHeight',
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

            // 조회조건
            searchTypeList: [
                { label: '선택', value: '' },
                { label: '서비스제공자', value: 'serviceOfferNm' },
                { label: '서비스대상자', value: 'serviceTargetNm' },
                { label: '약관명', value: 'clusNm' }
            ]
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
        
        // 페이징
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => {
            getTerms();
            // emitter.$on('selectTerms', selectTerms);
        });

        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
            // console.log(params.columnApi);
        };

        /**
         * 약관 목록 조회
         */
        const getTerms = async () => {
            try {
                const params = {
                    clusGrpSn: '', // formData.termsGroupSn, // 약관그룹순번
                    clusTyCd: '', // formData.clusTyCd, // 약관유형코드
                    searchType: formData.searchType, // 조회조건 serviceOfferNm(서비스제공자) / serviceTargetNm(서비스대상자) / clusNm(약관명)
                    searchText: formData.searchText, // 조회조건값
                    // clusMngShpCd: formData.clusMngShpCd, // 약관관리형태코드
                    esnClusYn: props.esnClusYn, // formData.esnClusYn, // 필수여부
                    clusMngStCdList: formData.clusMngStCd ? [formData.clusMngStCd] : ['251002', '251003'], // 약관상태코드
                    size: pager.size,
                    offset: pager.offset,
                    isPopup: true,
                    clusMngOffrTyCd: props.clusMngOffrTyCd,
                    clusMngTgpTyCd: props.clusMngTgpTyCd,
                    clusMngOffrNtprSn: props.clusMngOffrNtprSn,
                    clusMngTgpNtprSn: 0
                };
                const response = await _getTerms(params);
                console.log('약관 목록 조회', response.data.data.list);
                state.termsList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 검색
         */
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);

            state.admnSn = null;
        };

        // 페이징 처리
        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            getTerms();
        };

        const onRowSelect = () => {
            state.selectedList = state.gridApi.getSelectedRows();
            emit('selectTerms', state.selectedList);
        };


        // const selectTerms = (e) => {
        //     // const target = e.data;
        //     // emit('selectTerms', e.data);
        //     const rowlist = state.gridApi.getSelectedRows();
        //     console.log('selected', rowlist);
        // };

        return {
            state,
            formData,
            pager,
            onGridReady,
            reloadList,
            onRowSelect,
            onChangedPage
        };
    }
};
</script>
