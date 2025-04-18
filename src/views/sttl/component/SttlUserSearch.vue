<template>
    <div class="ui-title-3">
        <h3>회원 목록</h3>
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
                <selectBox selectType="page" @changedValue="selectedOptions"/>
            </div>
        </div>
    </div>
    <div class="tbl-wrap mt-10">
        <NoData v-if="state.list.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
        <div v-else ref="agGrid">
            <AgGridVue ref="o" :columnDefs="state.tableColum_c"
                       :defaultColDef="state.defaultColDef"
                       :domLayout="state.domLayout" :rowData="state.list" class="ag-theme-alpine"
                       style="width:100%"
                       @cell-clicked="onCellClicked" @grid-ready="onGridReady">
            </AgGridVue>
            <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                            @changedPage="onChangedPage"/>
        </div>
    </div>
</template>
<script>
import {getCurrentInstance, reactive, computed, ref, onMounted} from 'vue';
import {_getUserListPaging} from '@/api/sttl';

export default {
    props:['params'],
    emits: ['selectUser'],
    setup(props) {
        const {emit} = getCurrentInstance();
        const searchType = props.params.searchType;
        const searchText = props.params.searchText;
        console.log('searchType:', searchType, 'searchText:', searchText)
        onMounted(() => {
            console.log(props.params.searchText);
            getList();
        });

        const initColum = ref([
            {headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 70},
            {headerName: '회원번호', field: 'mbrSn', flex: 1},
            {headerName: '회원명', field: 'mbrNm', flex: 1},
            {headerName: 'ID', field: 'mbrJnMthAcsId', flex: 1},
            {
                headerName: '선택',
                field: 'select',
                maxWidth: 90,
                cellRenderer: param => {
                    return '<button type="button" class="btn btn-ss" >선택</button>'
                }
            }
        ]);

        const state = reactive({
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
            list: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            searchText: searchText,
            searchType: searchType,
            domLayout: 'autoHeight',
            // 검색조건
            searchTypeList: [
                {label: '선택', value: ''},
                {label: '회원명', value: 'mbrNm'},
                {label: '회원번호', value: 'mbrSn'},
                {label: '회원ID', value: 'mbrJnMthAcsId'},
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
            getList();
        };
        const cellUserSelect = (e) => {
            //console.log(e);
            emit('selectUser', e.data);
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
            getList();
        };

        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        const getList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    menuCode: '1002001',
                    mskgnRlsYn: 'N',
                };

                // 검색조건은 따로 입력
                if (state.searchType !== '') {
                    params.cnSercSe = state.searchType;
                    params.cnSercCts = state.searchText;
                }

                const response = await _getUserListPaging(params);
                
                state.list = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };

        //테이블 셀 선택
        const onCellClicked = (e) => {
            //삭제
            if (e.colDef.field === 'select') cellUserSelect(e)
        };

        return {
            state,
            pager,
            onChangedPage,
            selectedOptions,
            reloadList,
            onGridReady,
            onCellClicked,
        };
    }

};

</script>