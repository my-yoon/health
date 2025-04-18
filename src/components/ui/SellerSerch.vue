<template>
    <div class="ui-title-3">
        <h3>샐러배정 목록</h3>
    </div>
    <div class="ui-data-filter sm mt-10">
        <div class="form-item">
            <div class="item">
                <span class="input">
                    <span class="dv">
                        <select v-model="state.searchType" class="custom-select sm">
                            <option v-for="(item, index) in state.searchTypeList" :key="index" :value="item.value">
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
                <selectBox selectType="page" @changedValue="selectedOptions" />
            </div>
        </div>
    </div>
    <div class="tbl-wrap mt-10">
        <NoData v-if="state.sellerList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
        <div v-else ref="agGrid">
            <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef" :domLayout="state.domLayout"
                :rowData="state.sellerList" class="ag-theme-alpine" style="width:100%" @grid-ready="onGridReady">
            </AgGridVue>
            <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                @changedPage="onChangedPage" />
        </div>
    </div>
</template>
<script>
import { reactive, computed, ref, onMounted } from 'vue';
import { _getSellerList } from '@/api/admin';

export default {
    props: ['admnSn'],
    emits: ['selectPartner'],
    setup(props) {
        onMounted(() => {
            getSellerList();
        });

        const initColum = ref([
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 70 },
            { headerName: '셀러명', field: 'ntprNm', flex: 1 },
            { headerName: '기업코드', field: 'ntprUcd', flex: 1 },
            { headerName: '사업자 등록번호', field: 'brn', flex: 1 }
        ]);

        const state = reactive({
            admnSn: computed(() => props.admnSn),
            tableColum_c: _.clone(initColum.value),
            //테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            sellerList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            searchText: '',
            searchType: '',
            domLayout: 'autoHeight',
            // 검색조건
            searchTypeList: [
                { label: '선택', value: '' },
                { label: '셀러명', value: 'ntprNm' },
                { label: '기업코드', value: 'ntprUcd' },
                { label: '사업자등록번호', value: 'brn' }
            ]
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
            getSellerList();
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
            onChangedPage(pager.current);
            getSellerList();
        };

        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        const getSellerList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    admnSn: state.admnSn,
                    searchType: state.searchType,
                    searchText: state.searchText
                };
                const response = await _getSellerList(params);
                state.sellerList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };

        return {
            state,
            pager,
            onChangedPage,
            selectedOptions,
            reloadList,
            onGridReady
        };
    }

};

</script>