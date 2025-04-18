<script setup>
import { reactive, onMounted, ref, inject } from 'vue';
import DatePickerEditor from './DatePickerEditor.vue';
import ErrorToolTip from './ErrorToolTip.vue';

const dayjs = inject('dayJS');

const searchParam = reactive({
    sttlBstdCdStr: '',
    sttlBstdCdNmStr: ''
});

const gridApi = ref(null); // Optional - for accessing Grid's API

const serverUrl = '/common';

// Obtain API from grid's onGridReady event
const onGridReady = (params) => {
    gridApi.value = params.api;
};

const rowData = reactive({});

const columnDefs = reactive(
    [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            showDisabledCheckboxes: true,
            width: 10,
            sortable: false,
            filter: false,
            resizable: false
        },
        {
            headerName: '상태',
            field: 'rowState',
            width: 62,
            sortable: false,
            filter: false,
            resizable: false,
            cellClassRules: {
                'rag-green': 'data.state == "S"',
                'rag-red': 'data.state == "E"'
            },
            tooltipField: 'rowState',
            tooltipComponent: ErrorToolTip
        },
        {
            headerName: '정산기준코드',
            field: 'sttlBstdCd',
            editable: (param) => param.data.rowState == 'N'
        },
        {
            headerName: '정산기준코드명',
            field: 'sttlBstdCdNm',
            editable: true
        },
        {
            headerName: '설명',
            field: 'sttlBstdCdDscr',
            editable: true
        },
        {
            headerName: '사용유무',
            field: 'useYn',
            cellRenderer: 'agCheckboxCellRenderer',
            cellEditor: 'agCheckboxCellEditor',
            valueGetter: (param) => { return param.data.useYn === 'Y'; },
            editable: true,
            width: 110,
            cellClass: 'align-check-center',
        },
        {
            headerName: '시작일',
            field: 'aplBgnDt',
            valueGetter: (param) => {
                return dayjs(param.node.data.aplBgnDt, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
            },
            editable: true,
            cellEditor: DatePickerEditor,
            width: 230
        },
        {
            headerName: '종료일',
            field: 'aplEndDt',
            valueGetter: (param) => {
                return dayjs(param.node.data.aplEndDt, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
            },
            editable: true,
            cellEditor: DatePickerEditor,
            width: 230
        }
    ]
);
const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    valueSetter: params => {

        switch (params.colDef.field) {
            case 'useYn':
                params.data[params.colDef.field] = params.newValue ? 'Y' : 'N';
                break;
            case 'sttlBstdCd':
                params.data[params.colDef.field] = !_.isEmpty(params.newValue) ? params.newValue.toUpperCase() : params.newValue;
                break;
            default:
                params.data[params.colDef.field] = params.newValue;
                break;
        }
        // console.log(params.oldValue, params.newValue);
        if (params.data.rowState != 'N' && params.oldValue !== params.newValue) {
            params.data.rowState = 'M';
        }
        return true;
    }
    // flex: 1
};

// Example load data from server
onMounted(() => {
    loadData();
});

function cellWasClicked(event) { // Example of consuming Grid Event
    console.log(event);
    return true;
}

function deselectRows() {
    gridApi.value.deselectAll();
}

function loadData() {
    let loadDataUrl = serverUrl + '/api/v1/instl/sttlBstd/list';
    $api.get(loadDataUrl,
        {
            params: {
                sttlBstdCd: searchParam.sttlBstdCdStr,
                sttlBstdCdNm: searchParam.sttlBstdCdNmStr
            }
        })
        .then((res) => {
            // console.log(res);
            return res.data;
        })
        .then((data) => {
            rowData.value = data.data.list;
        });
}
function createData() {
    const newData = {
        rowState: 'N',
        sttlBstdCd: '',
        sttlBstdCdNm: '',
        useYn: 'Y',
        aplBgnDt: dayjs(new Date()).format('YYYYMMDD') + '000000',
        aplEndDt: '20991231235959',
        sttlBstdCdDscr: ''
    };
    return newData;
}

function addNewRow() {
    const added = gridApi.value.applyTransaction({
        add: [createData()],
        addIndex: 0
    });

    gridApi.value.startEditingCell({ rowIndex: added.add[0].rowIndex, colKey: 'sttlBstdCd' });
}

function successProcess(res, data) {

    if (res.data.code == 'OK') {
        data.state = 'S';
        data.rowState = '';
        gridApi.value.applyTransaction({ update: [data] });
        return 'ok';
    } else {
        return errorProcess(res.data, data);
    }
}

function errorProcess(err, data) {
    console.log(err.code, err.message);
    data.state = 'E';
    data.stateMessage = err.message;
    gridApi.value.applyTransaction({ update: [data] });
    return Promise.reject(err);
}

function saveData() {
    
    gridApi.value.stopEditing();

    let promises = [];

    gridApi.value.forEachNode((rowNode, index) => {
        if (rowNode.data.rowState == 'N' || rowNode.data.rowState == 'M') {
            
            switch (rowNode.data.rowState) {
                case 'N':
                    let newpromise = $api.post(serverUrl + '/api/v1/instl/sttlBstd/create', rowNode.data)
                        .then(
                            (res) => { return successProcess(res, rowNode.data); }
                            , (err) => { return errorProcess(err, rowNode.data); }
                        );
                    promises.push(newpromise);
                    break;
                case 'M':
                    let modifypromise = $api.put(serverUrl + '/api/v1/instl/sttlBstd/modify', rowNode.data)
                        .then(
                            (res) => { return successProcess(res, rowNode.data); }
                            , (err) => { return errorProcess(err, rowNode.data); }
                        );
                    promises.push(modifypromise);
                    break;
            }
        }
    });

    Promise.all(promises).then((results) => {
        console.log('all', results);
        loadData();
    }).catch((err) => {
        console.log('allError', err);
    });
}

function cancelAdd() {
    let rowDatas = gridApi.value.getSelectedRows();
    let deleteTargetDatas = [];
    rowDatas.forEach((r, i) => {
        if (r.rowState === 'N') {
            deleteTargetDatas.push(r);
        }
    });
    gridApi.value.applyTransaction({ remove: deleteTargetDatas });
}

function enterSearch(event) {
    loadData();
}
</script>
<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter" @keyup.enter="enterSearch">
            <div class="form-item">
                <div class="item">
                    <label>정산기준코드</label>
                    <span class="input">
                        <span class="dv">
                            <input v-model="searchParam.sttlBstdCdStr" type="text" class="form-control sm"
                                placeHolder="정산기준코드" />
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>정산기준코드명</label>
                    <span class="input">
                        <span class="dv">
                            <input v-model="searchParam.sttlBstdCdNmStr" type="text" class="form-control sm"
                                placeHolder="정산기준코드명" />
                        </span>
                    </span>
                </div>
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="loadData"><span class="ico-search"></span>조회 </button>
                </div>
            </div>
        </div>
        <!-- 테이블 -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <!-- <button type="button" class="btn btn-ss">양식다운로드</button> -->
                    <button type="button" class="btn btn-ss" @click="addNewRow">추가</button>
                    <button type="button" class="btn btn-ss" @click="cancelAdd">추가취소</button>
                    <button type="button" class="btn btn-ss" @click="saveData">저장</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ rowData.value ? rowData.value.length : 0 }}</strong>건</span>
                    <!-- <button type="button" class="btn btn-opt">
                        <span class="ico-download"></span>파일다운로드
                    </button> -->
                    <!-- <select class="custom-select">
                        <option value="10개">10개</option>
                        <option value="20개">20개</option>
                        <option value="30개">30개</option>
                        <option value="40개">40개</option>
                    </select> -->
                </div>
            </div>
            <ag-grid-vue class="ag-theme-alpine remainHeightGrid" style="width:100%" :columnDefs="columnDefs"
                :rowData="rowData.value" :defaultColDef="defaultColDef" rowSelection="multiple" animateRows="true"
                @cell-clicked="cellWasClicked" @grid-ready="onGridReady" undoRedoCellEditing="true"
                undoRedoCellEditingLimit="100" :tooltipShowDelay="0" :tooltipHideDelay="5000">
            </ag-grid-vue>
        </div>
    </section>
</template>
<style>
.rag-red {
    background-color: lightcoral;
}

.rag-green {
    background-color: lightgreen;
}

.custom-tooltip {
    width: 200px;
    height: 30px;
    border: 1px solid cornflowerblue;
    overflow: hidden;
}

.custom-tooltip p {
    margin: 5px;
    /* white-space: nowrap; */
}

.custom-tooltip p:first-of-type {
    font-weight: bold;
}

.align-check-center {
	display: flex;
	justify-content: center;
}

.remainHeightGrid {
    height: calc( 100vh - 380px)
}
</style>