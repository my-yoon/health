<script setup>
import { reactive, onMounted, ref, inject } from "vue";
import ErrorToolTip from './ErrorToolTip.vue'
import _ from 'lodash'
const MAX_ITEM = 30;
const dayjs = inject('dayJS');

const date = ref(null);

const searchParam = reactive({
    sort:''
  , text:''
});

const gridApi = ref(null); // Optional - for accessing Grid's API

// Obtain API from grid's onGridReady event
const onGridReady = (params) => {
  gridApi.value = params.api;
};

const serverUrl = "/common";

const rowData = reactive({}); // Set rowData to Array of Objects, one Object per Row

// Each Column Definition results in one Column.
const columnDefs = reactive(
  [
    { 
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      width: 10,
      sortable: false,
      filter: false,
      resizable:false,
      pinned: 'left',
      
    },
    {
      headerName : '상태',
      field: 'rowState',
      width: 62,
      sortable: false,
      filter: false,
      resizable:false,
      pinned: 'left',
      cellClassRules:{
        'rag-green': 'data.state == "S"',
        'rag-red': 'data.state == "E"',
      },
      tooltipField: 'rowState',
      tooltipComponent : ErrorToolTip,
    },
    { headerName : '정산기준메타번호',  field: 'sttlBstdMetaNo',  width: 156, pinned: 'left',},
  ],
);

let searchOption = [
  {code : '', name : '선택'},
  {code : 'sttlBstdMetaNo', name:'정산기준메타번호'},
];

for(let i=1; i <= MAX_ITEM; i++){
  columnDefs.push({ headerName : '메타'+i, marryChildren: true, children : [
    { headerName : '메타'+i+'영문명', field: 'meta'+i+'EngNm', editable: true, width:140 },
    { headerName : '메타'+i+'한글명', field: 'meta'+i+'KorNm', editable: true, width:140 },
    { headerName : '메타'+i+'설명',   field: 'meta'+i+'Dscr',  editable: true, width:200 },
    ]
  });
  searchOption.push({code : 'meta'+i+'EngNm', name:'메타'+i+'영문명'});
  searchOption.push({code : 'meta'+i+'KorNm', name:'메타'+i+'한글명'});
  searchOption.push({code : 'meta'+i+'Dscr', name:'메타'+i+'설명'});
}

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  sortable: true,
  filter: true,
  resizable:true,
  valueSetter : params => {
    
    switch(params.colDef.field){
      case 'useYn':
      params.data[params.colDef.field] = params.newValue?'Y':'N';
      break;
      case 'meta1EngNm':  case 'meta11EngNm':
      case 'meta2EngNm':  case 'meta12EngNm':
      case 'meta3EngNm':  case 'meta13EngNm':
      case 'meta4EngNm':  case 'meta14EngNm':
      case 'meta5EngNm':  case 'meta15EngNm':
      case 'meta6EngNm':  case 'meta16EngNm':
      case 'meta7EngNm':  case 'meta17EngNm':
      case 'meta8EngNm':  case 'meta18EngNm':
      case 'meta9EngNm':  case 'meta19EngNm':
      case 'meta10EngNm': case 'meta20EngNm':
      params.data[params.colDef.field] = !_.isEmpty(params.newValue)?params.newValue.toUpperCase():params.newValue;
      break;
      default:
      params.data[params.colDef.field] = params.newValue;
      break;
    }
    // console.log(params.oldValue, params.newValue);
    if(params.data.rowState != 'N' && params.oldValue !== params.newValue){
      params.data.rowState = 'M';
    }
    return true;
  },
  // flex: 1
};

// Example load data from server
onMounted(() => {
  loadData()
});

function cellWasClicked(event){ // Example of consuming Grid Event
  
}

function deselectRows(){
  gridApi.value.deselectAll()
}

function loadData(){
  console.log(searchParam)
  let loadDataUrl = serverUrl + "/api/v1/instl/sttlBstdMeta/list";
  $api.get(loadDataUrl,
  {
    params : {
      sort : searchParam.sort, 
      text : searchParam.text
    }
  })
  .then((res) => {
    return res.data;
  })
  .then((data) => {
    rowData.value = data.data.list
  })
}
function createData(){
  const newData = {
    rowState : 'N',
    meta1EngNm : '',
    meta1KorNm : '',
    meta1Dscr : '',
  }
  return newData;
}

function addNewRow(){
  const added = gridApi.value.applyTransaction({
    add: [createData()],
    addIndex: 0,
  });

  gridApi.value.startEditingCell({rowIndex:added.add[0].rowIndex, colKey:'meta1EngNm'});
}

function successProcess(res, data){
  
  if(res.data.code == 'OK'){
    data.state = 'S';
    data.rowState = '';
    gridApi.value.applyTransaction({update: [data]});
    return 'ok';
  }else{
    return errorProcess(res.data, data);
  }
}

function errorProcess(err, data){
  console.log(err.code, err.message);
  data.state='E';
  data.stateMessage=err.message;
  gridApi.value.applyTransaction({update: [data]});
  return Promise.reject(err);
}

function saveData(){
  // let targetData = [];
  gridApi.value.stopEditing();

  let promises = [];

  gridApi.value.forEachNode((rowNode, index) => {
    if(rowNode.data.rowState == 'N' || rowNode.data.rowState == 'M'){
      // targetData.push(rowNode.data);
      switch(rowNode.data.rowState){
        case 'N':
          let newpromise = $api.post(serverUrl + '/api/v1/instl/sttlBstdMeta/create',rowNode.data)
          .then(
              (res) => { return successProcess(res, rowNode.data); }
            , (err) => { return errorProcess(err, rowNode.data);   }
          );
          promises.push(newpromise);
          break;
        case 'M':
          let modifypromise = $api.put(serverUrl + '/api/v1/instl/sttlBstdMeta/modify',rowNode.data)
          .then(
              (res) => { return successProcess(res, rowNode.data); }
            , (err) => { return errorProcess(err, rowNode.data);   }
          );
          promises.push(modifypromise);
          break;
      }
    }
  })

  Promise.all(promises).then((results) => {
    loadData();
  }).catch((err) => {
    console.log('allError', err);
  });
}

function cancelAdd(){
  let rowDatas = gridApi.value.getSelectedRows()
  let deleteTargetDatas = []
  rowDatas.forEach((r, i) => {
    if(r.rowState === 'N'){
      deleteTargetDatas.push(r)
    }
  })
  gridApi.value.applyTransaction({remove: deleteTargetDatas})
}

function enterSearch(event){
  loadData();
}
</script>
<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
          <div class="form-item">
            <div class="item" @keyup.enter="enterSearch">
              <label>조건검색</label>
              <span class="input">
                  <span class="dv">
                    <select class="custom-select sm" v-model="searchParam.sort" @change="enterSearch">
                        <option :value="item.code" v-for="(item, index) in searchOption" >{{ item.name }}</option>
                    </select>
                  </span>
                  <span class="dv">
                    <input type="text" class="form-control sm" v-model="searchParam.text" placeHolder="검색어">
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
                    <button type="button" class="btn btn-ss" @click="addNewRow">추가</button>
                    <button type="button" class="btn btn-ss" @click="cancelAdd">추가취소</button>
                    <button type="button" class="btn btn-ss" @click="saveData">저장</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ _.isArray(rowData.value)?rowData.value.length:0 }}</strong>건</span>
                </div>
            </div>
            <ag-grid-vue 
                class="ag-theme-alpine remainHeightGrid" 
                style="width:100%"
                :columnDefs="columnDefs" 
                :rowData="rowData.value" 
                :defaultColDef="defaultColDef"
                rowSelection="multiple"
                animateRows="true"
                @cell-clicked="cellWasClicked"
                @grid-ready="onGridReady"
                undoRedoCellEditing="true"
                undoRedoCellEditingLimit="100"
                :tooltipShowDelay="0"
                :tooltipHideDelay="5000"
            >
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
.remainHeightGrid {
    height: calc( 100vh - 380px)
}
</style>