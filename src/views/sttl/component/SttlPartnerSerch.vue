<template>
    <div class="ui-title-3">
        <h3>{{ tName }} 목록</h3>
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
        <NoData v-if="state.partnerList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
        <div v-else ref="agGrid">
            <AgGridVue ref="o" :columnDefs="state.tableColum_c"
                       :defaultColDef="state.defaultColDef"
                       :domLayout="state.domLayout" :rowData="state.partnerList" class="ag-theme-alpine"
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
import {_getPartnerList} from '@/api/common';
import { sttlLib } from '../module/sttlLib';

export default {
    props: ['params'],
    emits: ['selectPartner'],
    setup(props) {
        const {emit} = getCurrentInstance();
        const admnPtnrTyCd = _.isEmpty(props.params.admnPtnrTyCd) ? '' : props.params.admnPtnrTyCd;
        const tName = _.isEmpty(props.params.tName) ? '파트너' : props.params.tName;
        const searchText = props.params.searchText;
        onMounted(() => {
            console.log(props.params.searchText);
            getPartnerList();
        });

        const initColum = ref([
            {headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 70},
            {headerName: tName + '명', field: 'ntprNm', flex: 1},
            {headerName: '사업자 등록번호', field: 'brn', flex: 1, valueFormatter: (params) => sttlLib.formatBrm(params.value)},
            {
                headerName: '선택',
                field: 'select',
                maxWidth: 90,
                cellRenderer: param => {
                    return '<button type="button" class="btn btn-ss" >선택</button>';
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
            partnerList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            searchText: searchText,
            searchType: _.isEmpty(searchText) ? '' : 'ntprNm',
            domLayout: 'autoHeight',
            // 검색조건
            searchTypeList: [
                {label: '선택', value: ''},
                {label: tName + '명', value: 'ntprNm'},
                {label: '사업자등록번호', value: 'brn'}
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
            getPartnerList();
        };
        const cellPartnerSelect = (e) => {
            //console.log(e);
            emit('selectPartner', e.data);
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
            getPartnerList();
        };

        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        const getPartnerList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    admnPtnrTyCd: admnPtnrTyCd
                };

                // 검색조건은 따로 입력
                if (state.searchType !== '') {
                    params.searchType = state.searchType;
                    params.searchText = state.searchText;
                }

                const response = await _getPartnerList(params);

                state.partnerList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };

        //테이블 셀 선택
        const onCellClicked = (e) => {
            //삭제
            if (e.colDef.field === 'select') cellPartnerSelect(e);
        };

        return {
            state,
            pager,
            onChangedPage,
            selectedOptions,
            reloadList,
            onGridReady,
            onCellClicked,
            tName
        };
    }

};

</script>