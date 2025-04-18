<template>
    <div class="ui-title-3">
        <h3>거래처 목록</h3>
    </div>
    <div class="ui-data-filter sm mt-10">
        <div class="form-item">
            <div class="item">
                <span class="input">
                    <span class="dv">
                        <select v-model="state.searchType" class="custom-select sm">
                            <option v-for="(item, index) in state.searchTypeList" :key="index"
                                    :value="item.value">
                                {{ item.label }}
                            </option>
                        </select>
                    </span>
                    <span class="dv">
                        <input v-model="state.searchText" class="form-control sm" type="text">
                    </span>
                </span>
            </div>
            <div class="btn-filter-set">
                <button class="btn btn-sm" type="button" @click="reloadList">
                    <span class="ico-search"></span>검색
                </button>
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
    </div>
    <div class="tbl-wrap mt-10">
        <NoData v-if="state.erpTrList.length === 0" :nodatatext="state.nodatastr"></NoData>
        <div v-else ref="agGrid">
            <AgGridVue ref="o" :columnDefs="state.tableColum_c"
                       :defaultColDef="state.defaultColDef"
                       :domLayout="state.domLayout" :rowData="state.erpTrList" class="ag-theme-alpine"
                       style="height:400px;width:100%" @cell-clicked="onCellClicked" @grid-ready="onGridReady">
            </AgGridVue>
        </div>
    </div>
</template>
<script>
import {getCurrentInstance, reactive, computed, ref, onMounted, onUnmounted} from 'vue';
import { _getInstlErpIfTr } from '@/api/sttl';

export default {
    props: ['params'],
    emits: ['selectErpTr'],
    setup(props) {
        const {emit} = getCurrentInstance();

        onMounted(() => {
            if(!_.isEmpty(props.params.searchText)){
                state.searchType = 'trCd';
                state.searchText = props.params.searchText;
                getErpTrList();
            }
            // emitter.$on('cellErpTrSelect', cellErpTrSelect);
        });

        onUnmounted(() => {
            // emitter.$off('cellErpTrSelect');
        });

        const initColum = ref([
            {headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 70, filter: false},
            {headerName: '처래처코드', field: 'trCd', flex: 1},
            {headerName: '거래처명', field: 'trNm', flex: 1, cellClass: ''},
            {
                headerName: '선택',
                field: 'select',
                maxWidth: 90,
                cellRenderer: param => {
                    return '<button type="button" class="btn btn-ss" >선택</button>'
                },
                filter:false
            }
        ]);

        const NoDataStr = '조회된 데이터가 없습니다.';
        const MustSearchStr = '검색 바랍니다.';
        const SearchingStr = '검색중입니다.';

        const state = reactive({
            tableColum_c: _.clone(initColum.value),
            //테이블 옵션
            defaultColDef: {
                sortable: true,
                filter: true,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            erpTrList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            searchText: null,
            searchType: '',
            domLayout: 'normal',
            // 검색조건
            searchTypeList: [
                {label: '선택', value: ''},
                {label: '거래처코드', value: 'trCd'},
                {label: '거래처명', value: 'trNm'},
                {label: '거래처구분', value: 'trFg'},
                {label: '사업자등록번호', value: 'regNb'},
                {label: '주민등록번호', value: 'pplNb'},
                {label: '대표자명', value: 'ceoNm'},
            ],
            nodatastr: MustSearchStr,
        });


        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            getErpTrList();
        };
        const cellErpTrSelect = (e) => {
            //console.log(e);
            emit('selectErpTr', e.data);
        };

        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };

        const clearList = (num) => {
            state.searchType = ''; //검색구분
            state.searchText = ''; //내용
            onChangedPage(num);
        };

        const reloadList = () => {
            pager.current = 1;
            //onChangedPage(pager.current);
            getErpTrList();
        };

        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        const getErpTrList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset
                };

                // 검색조건은 따로 입력
                if (state.searchType !== '' && state.searchText !== '') {
                    params[state.searchType] = state.searchText;
                }

                state.erpTrList = [];
                state.nodatastr = SearchingStr;
                
                const response = await _getInstlErpIfTr(params);
                if(response.data.data){
                    state.erpTrList = response.data.data;
                    //pager.totalCnt = response.data.data.totalCnt;
                }else{
                    state.erpTrList = [];
                }
                if(state.erpTrList.length == 0){
                    state.nodatastr = NoDataStr;
                }

            } catch (error) {
                console.log(error);
            }
        };

        //테이블 셀 선택
        const onCellClicked = (e) => {
            //삭제
            if (e.colDef.field === 'select') cellErpTrSelect(e)
        };

        return {
            state,
            pager,
            onChangedPage,
            selectedOptions,
            reloadList,
            onGridReady,
            onCellClicked
        };
    }

};

</script>