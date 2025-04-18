<template>
    <div class="ui-title-3">
        <h3>승인자 목록</h3>
    </div>
    <div class="ui-data-filter sm mt-10">
        <div class="form-item">
            <div class="item">
                <span class="input">
                    <span class="dv">
                        <CommonBtn :val="searchData.searchType" :type="'searchType'"
                                @changedValue="(value) => searchData.searchType = value" :className="'custom-select sm'" />
                    </span>
                    <span class="dv">
                        <input type="text" class="form-control sm w-350" v-model="searchData.searchText" @keyup="enterToSearch">
                    </span>
                </span>
            </div>
            <div class="btn-filter-set">
                <button type="button" class="btn btn-sm" @click="onChangedPage(1)">
                    <span class="ico-search"></span>검색</button>
            </div>
        </div>
    </div>
    <div class="tbl-wrap mt-10">
        <div class="table-util flex space-between">
            <div class="btn-set-m flex"></div>
            <div class="btn-set-m flex align-end">
                <span class="table-total">조회결과 총 <strong>{{pager.totalCnt.toLocaleString('ko')}}</strong>건</span>
            </div>
        </div>
        <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
        <template v-else>
            <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
            :rowData="state.rowData" @grid-ready="onGridReady"
            :suppressRowClickSelection="true" @selection-changed="onRowSelect" :rowSelection="'single'"
            class="ag-theme-alpine" :domLayout="'autoHeight'">
            </AgGridVue>
            <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
        </template>
    </div>
</template>
<script>
import { getCurrentInstance, reactive, computed, onMounted, inject  } from 'vue';
import { tablelist_aprvMemberList_label } from '@/data/table/pntmngtable.js';
import { _getAprvList } from '@/api/pntmng.js';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
export default {
    components: {CommonBtn},
    emits: ['memberAprv'],
    props: ['title', 'menuCode'],
    setup(props) {
        const { modal } = dmCommFunc();
        const { emit } = getCurrentInstance();
        const state = reactive({
            tableColum_c: _.clone(tablelist_aprvMemberList_label),
            rowData: [],
            defaultColDef: {
                sortable: true,
                resizable: true,
                width: 50,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            gridApi: null,
            gridColumApi: null,
            title: computed(() => props.title),
            menuCode: computed(() => props.menuCode)
        });

        const searchData = reactive({
            searchType: '',
            searchText: '',
            admnPtnrTyCd: '111001',
            authSeCd: '144002',
            mskgnRlsYn: 'N',
            menuCode: computed(() => state.menuCode),
            offset: computed(() => pager.offset),
            size: computed(() => pager.size)
        });

        const pager = reactive({
            current: 1,
            currentPageSize: 0,
            size: 7,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => { getAprvListPop(); });

        const reqData = async () => {
            let params = {
                admnPtnrTyCd: searchData.admnPtnrTyCd,
                authSeCd: searchData.authSeCd,
                mskgnRlsYn: searchData.mskgnRlsYn,
                menuCode: searchData.menuCode,
                offset: searchData.offset,
                size: searchData.size
            };
            if (searchData.searchType && searchData.searchText) {
                params.searchType = searchData.searchType;
                params.searchText = searchData.searchText;
            }
            return params;
        };

        const getAprvListPop = async () => {
            try {
                let params = await reqData();
                const response = await _getAprvList(params);
                if (response.code == 'OK') {
                    state.rowData = response.data.list;
                    pager.totalCnt = parseInt(response.data.totalCnt);
                } else {
                    modal(response.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            getAprvListPop();
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };
        
        // 체크 박스 선택시 
        const onRowSelect = (e) => {
            emit('memberAprv', state.gridApi.getSelectedRows());
        };

        const enterToSearch = (e) => {
            if (e.keyCode === 13) onChangedPage(1);
        };
        
        return {
            state,
            searchData,
            pager,
            onChangedPage,
            onRowSelect,
            onGridReady,
            enterToSearch
        };
    }

};

</script>