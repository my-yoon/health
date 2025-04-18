<template>
    <div class="ui-title-3">
        <h3>계정 목록</h3>
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
        <NoData v-if="state.accdList.length === 0" :nodatatext="state.nodatastr"></NoData>
        <div v-else ref="agGrid">
            <AgGridVue ref="o" :columnDefs="state.tableColum_c"
                       :defaultColDef="state.defaultColDef" @cell-clicked="onCellClicked"
                       :domLayout="state.domLayout" :rowData="state.accdList" class="ag-theme-alpine"
                       style="height:400px;width:100%" @grid-ready="onGridReady">
            </AgGridVue>
        </div>
    </div>
</template>
<script>
import {getCurrentInstance, reactive, computed, ref, onMounted, onUnmounted} from 'vue';
import { _getInstlErpIfAccd } from '@/api/sttl';

export default {
    props: ['params'],
    emits: ['selectAccd'],
    setup(props) {
        const {emit} = getCurrentInstance();

        onMounted(() => {

            if (_.isArray(props.params.innerList)) {
                state.innerList = props.params.innerList.map((o) => {
                    return {acctCd: o.cd, acctNm: o.nm};
                });
            } else {
                state.innerList = [];
            }
            
            if (!_.isEmpty(props.params.accd)) {
                state.searchType = 'acctCd';
                state.searchText = props.params.accd;
                getAccdList();
            }
            //emitter.$on('selectAccd', selectAccd);
        });

        onUnmounted(() => {
            //emitter.$off('selectAccd');
        });

        const initColum = ref([
            {headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 70, filter: false},
            {headerName: '계정코드', field: 'acctCd', flex: 1},
            {headerName: '계정명', field: 'acctNm', flex: 1, cellClass: ''},
            {
                headerName: '선택',
                field: 'select',
                maxWidth: 90,
                cellRenderer: param => {
                    return '<button type="button" class="btn btn-ss" >선택</button>';
                },
                filter: false
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
            accdList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            searchText: null,
            searchType: 'acctCd',
            domLayout: 'normal',
            // 검색조건
            searchTypeList: [
                {label: '계정코드', value: 'acctCd'}
            ],
            nodatastr: MustSearchStr
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
            getAccdList();
        };
        const selectAccd = (e) => {
            //console.log(e);
            emit('selectAccd', e.data);
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
            getAccdList();
        };

        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        const getAccdList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset
                };

                // 검색조건은 따로 입력
                if (state.searchType !== '' && state.searchText !== '') {
                    params[state.searchType] = state.searchText;
                }

                state.accdList = [];
                state.nodatastr = SearchingStr;
                
                if (!_.isEmpty(state.innerList)) {
                    if (!_.isEmpty(state.searchType)) {
                        if (_.isEmpty(state.searchText)) {
                            state.accdList = state.innerList;
                        } else {
                            state.accdList = state.innerList.filter(o => {
                                return o[state.searchType].match(new RegExp(state.searchText));
                            });
                        }
                    } else {
                        state.accdList = state.innerList;
                    }
                } else {
                    const response = await _getInstlErpIfAccd(params);
                    if (response.data.data) {
                        state.accdList = response.data.data;
                        //pager.totalCnt = response.data.data.totalCnt;
                    } else {
                        state.accdList = [];
                    }
                }
                if (state.accdList.length == 0) {
                    state.nodatastr = NoDataStr;
                }

            } catch (error) {
                console.log(error);
            }
        };

        //테이블 셀 선택
        const onCellClicked = (e) => {
            //삭제
            if (e.colDef.field === 'select') selectAccd(e);
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