<script setup>
import { reactive, onMounted, ref, inject, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DatePickerEditor from './DatePickerEditor.vue';
import ErrorToolTip from './ErrorToolTip.vue';
import SttlErpTr from './SttlErpTr.vue';
import { _dlngTyCds, _slipTyCds, _sttlCyclCds, _slipCrtUnitCds, _drcrSeCds, _accds } from '@/api/sttl';
import _ from 'lodash';

const btnComp = {
    template: '<button type="button" class="btn btn-ss">선택</button>',
    setup(props) {
        
    }
};

const dayjs = inject('dayJS');
const $Modal = inject('$Modal');

const codeAll = {code : "", name: "전체"        };

const sttlCyclCds = _.clone(_sttlCyclCds);
sttlCyclCds.unshift(codeAll);

const sttlCyclCdsMap = {};
_sttlCyclCds.forEach((v, i)=>{
	sttlCyclCdsMap[v.code] = v.name;
});

const slipCrtUnitCds = _.clone(_slipCrtUnitCds);
slipCrtUnitCds.unshift(codeAll);

const slipCrtUnitCdsMap = {};
_slipCrtUnitCds.forEach((v, i)=>{
	slipCrtUnitCdsMap[v.code] = v.name;
});

const dlngTyCds = _.clone(_dlngTyCds);
dlngTyCds.unshift(codeAll);

const dlngTyCdsMap = {};
_dlngTyCds.forEach((v, i)=>{
	dlngTyCdsMap[v.code] = v.name;
});

const drcrSeCds = _.clone(_drcrSeCds);
drcrSeCds.unshift(codeAll);

const drcrSeCdsMap = {};
drcrSeCdsMap[""] = "없음";
_drcrSeCds.forEach((v, i)=>{
	drcrSeCdsMap[v.code] = v.name;
});

const accds = _.clone(_accds);
accds.unshift(codeAll);

const accdsMap = {};
accdsMap[""] = "없음";
_accds.forEach((v, i)=>{
	accdsMap[v.code] = v.name;
});

const healthcareYnMap = {
	"" : "없음",
	"Y" : "대상",
	"N" : "미대상",
}

function extractKeys(map){
	return _.keys(map).sort((a, b) => a < b ? -1: 1 );
}

function cellEditorNotInRootin(keyList, params){
	if(!_.includes(keyList, params.value) && !_.isNull(params.value)){
		keyList.unshift(params.value);
	}
}

const lookupValue = (map, key) => {
	const keyvalue = _.isNull(key)?"":key
	let mapval = map[keyvalue];
	return keyvalue + " : " + (_.isEmpty(mapval) ? "코드미상" : mapval);
}

const slipTyCds = _.clone(_slipTyCds);
slipTyCds.unshift(codeAll);

const slipTyCdsMap = {};
_slipTyCds.forEach((v, i)=>{
	slipTyCdsMap[v.code] = v.name;
});

const date = ref(null);

const searchParamConst = {
	sttlBstdCd: 'JNLZ_MODEL',
	sttlBstdMetaNo: '5'
}

const searchParam = reactive({
	sttlCyclCd: "",
	slipCrtUnitCd: ""
});

const gridApi = ref(null);

const onGridReady = (params) => {
	gridApi.value = params.api;
};

const serverUrl = '/common';

const rowData = reactive({});

const filteredCnt = ref(0);

function isRowSelectable(params){
	return params.data.fxnItmYn !== 'Y';
}

const columnDefs = reactive(
	[
		{
			headerCheckboxSelection: true,
			checkboxSelection: true,
			showDisabledCheckboxes: false,
			width: 10,
			sortable: false,
			filter: false,
			resizable: false,
			pinned: 'left'
		},
		{
			headerName: '상태',
			field: 'rowState',
			width: 62,
			sortable: false,
			filter: false,
			resizable: false,
			pinned: 'left',
			cellClassRules: {
				'rag-green': 'data.state == "S"',
				'rag-red': 'data.state == "E"'
			},
			tooltipField: 'rowState',
			tooltipComponent: ErrorToolTip,
			cellClass: 'align-center',
		},
		{ headerName: '정산기준코드', field: 'sttlBstdCd', width: 200, editable: false, hide: true },
		{ headerName: '정산기준메타번호', field: 'sttlBstdMetaNo', width: 200, editable: false, hide: true },
		{ headerName: '정산기준상세번호', field: 'sttlBstdDtlNo', width: 200, editable: false, hide: true },
		{
			headerName: '사용여부',
			field: 'useYn',
			cellRenderer: 'agCheckboxCellRenderer',
			cellEditor: 'agCheckboxCellEditor',
			valueGetter: (param) => { return param.data.useYn === 'Y'; },
			editable: true,
			width: 90,
			cellClass: 'align-check-center',
		},
		{ headerName: '고정항목여부', field: 'fxnItmYn',     width: 125, editable: true, hide: true  },
		{ headerName: '정산주기',     field: 'sttlBstd1Cts', width: 130, editable: (params) => params.data.fxnItmYn !== 'Y', hide: false,
			cellEditor: 'agSelectCellEditor',
			cellEditorParams: (params) => {
				let keyList = extractKeys(sttlCyclCdsMap);
				if(!_.includes(keyList, params.value) && !_.isNull(params.value)){
					keyList.unshift(params.value);
				}
				return {
					values : keyList,
					valueListGap : 10
				};
			},
			valueFormatter: (params) => {
				return lookupValue(sttlCyclCdsMap, params.value);
			},
			sort: 'asc',
			filter: true,
		},
		{ headerName: '전표생성단위',     field: 'sttlBstd2Cts', width: 150, editable: (params) => params.data.fxnItmYn !== 'Y', hide: false,
			cellEditor: 'agSelectCellEditor',
			cellEditorParams: (params) => {
				let keyList = extractKeys(slipCrtUnitCdsMap);
				if(!_.includes(keyList, params.value) && !_.isNull(params.value)){
					keyList.unshift(params.value);
				}
				return {
					values : keyList,
					valueListGap : 10
				};
			},
			valueFormatter: (params) => {
				return lookupValue(slipCrtUnitCdsMap, params.value);
			},
			sort : 'asc',
			filter: true,
		},
		// { headerName: '헬스케어정산대상여부', field: 'sttlBstd3Cts', width: 160, editable: (params) => params.data.fxnItmYn !== 'Y', hide: false,},
		{ headerName: '헬스케어정산대상여부', field: 'sttlBstd3Cts', width: 160, editable: (params) => params.data.fxnItmYn !== 'Y', hide: false,
			cellEditor: 'agSelectCellEditor',
			cellEditorParams: (params) => {
				let keyList = extractKeys(healthcareYnMap);
				if(!_.includes(keyList, params.value) && !_.isNull(params.value)){
					keyList.unshift(params.value);
				}
				return {
					values : keyList,
					valueListGap : 10
				};
			},
			valueFormatter: (params) => {
				let result = lookupValue(healthcareYnMap, params.value);
				return result;
			},
		},
		{ headerName: '라인번호',             field: 'indnSqn'     , width: 100, editable: (params) => params.data.fxnItmYn !== 'Y', hide: false,
			cellEditor: 'agNumberCellEditor',
			cellEditorParams: {
				min: 0,
				max: 2147483647,
				precision: 0
			},
			sort : 'asc' },
		{ headerName: '차대구분',         field: 'sttlBstd4Cts', width: 150, editable: (params) => params.data.fxnItmYn !== 'Y', hide: false,
			cellEditor: 'agSelectCellEditor',
			cellEditorParams: (params) => {
				let keyList = extractKeys(drcrSeCdsMap);
				if(!_.includes(keyList, params.value) && !_.isNull(params.value)){
					keyList.unshift(params.value);
				}
				return {
					values : keyList,
					valueListGap : 10
				};
			},
			valueFormatter: (params) => {
				return lookupValue(drcrSeCdsMap, params.value);
			},
		},
		{ headerName: '계정코드',             field: 'sttlBstd5Cts', width: 160, editable: (params) => params.data.fxnItmYn !== 'Y', hide: false,
			cellEditor: 'agSelectCellEditor',
			cellEditorParams: (params) => {
				let keyList = extractKeys(accdsMap);
				if(!_.includes(keyList, params.value) && !_.isNull(params.value)){
					keyList.unshift(params.value);
				}
				return {
					values : keyList,
					valueListGap : 10,
				};
			},
			valueFormatter: (params) => {
				return lookupValue(accdsMap, params.value);
			},
		},
		{ headerName: '참조필드1',            field: 'sttlBstd6Cts', width: 120, editable: (params) => params.data.fxnItmYn !== 'Y', hide: false },
		{ headerName: '참조필드2',            field: 'sttlBstd7Cts', width: 120, editable: (params) => params.data.fxnItmYn !== 'Y', hide: false },
		{ headerName: 'ERP거래처코드',
			children:[
				{field: 'sttlBstd8Cts', headerName:'코드', width: 70, editable: (params) => params.data.fxnItmYn !== 'Y', headerClass:'centered'},
				{field: '', headerName:'선택', width: 90, editable: false, headerClass:'centered',
					cellRendererSelector:(params) => {
						if(params.data.fxnItmYn !== 'Y'){
							return {
								component: btnComp,
							}
						}
					}
					,onCellClicked : (event) => {
						if(event.data.fxnItmYn !== 'Y'){
							modalTargetData = event.data;
							isShow.value = true;
						}
					}
				},
			]
		},
		{ headerName: '적요',                 field: 'sttlBstd9Cts', width: 200, editable: (params) => params.data.fxnItmYn !== 'Y', hide: false },
		{
			headerName: '적용시작일시',
			field: 'aplBgnDt',
			width: 230,
			editable: (params) => params.data.fxnItmYn !== 'Y',
			valueGetter: (param) => {
				return dayjs(param.node.data.aplBgnDt, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
			},
			cellEditor: DatePickerEditor,
			cellEditorPopup: true,
			cellEditorPopupPosition: 'over'
		},
		{
			headerName: '적용종료일시',
			field: 'aplEndDt',
			width: 230,
			editable: (params) => params.data.fxnItmYn !== 'Y',
			valueGetter: (param) => {
				return dayjs(param.node.data.aplEndDt, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
			},
			cellEditor: DatePickerEditor,
			cellEditorPopup: true,
			cellEditorPopupPosition: 'over'
		},
	]
);

const defaultColDef = {
	sortable: false,
	filter: false,
	resizable: true,
	valueSetter: params => {

		switch (params.colDef.field) {
			case 'useYn':
				params.data[params.colDef.field] = params.newValue ? 'Y' : 'N';
				break;
			default:
				params.data[params.colDef.field] = params.newValue;
				break;
		}
		if (params.data.rowState != 'N' && params.oldValue !== params.newValue) {
			params.data.rowState = 'M';
		}
		return true;
	}
	// flex: 1
};

function loadData() {
	if(!_.isEmpty(gridApi.value)){
		gridApi.value.showLoadingOverlay();
	};
	return loadDataGet(
		'/api/v1/instl/sttlBstdDtl/list',
		{
			sttlBstdCd: searchParamConst.sttlBstdCd,
			sttlBstdMetaNo: searchParamConst.sttlBstdMetaNo
		},
		(data) => {
			rowData.value = data.data.list;
		}
	);
}
let searchBstdCds = [];

function loadBstdData() {
	loadDataGet(
		'/api/v1/instl/sttlBstd/list',
		{
			useYn: 'Y'
		},
		(data) => {
			data.data.list.unshift({ sttlBstdCd: '', sttlBstdCdNm: '선택' });
			searchBstdCds = data.data.list;
			// console.log(searchOption);
		}
	);
}

function loadDataGet(url, param, thenRamda) {
	let loadDataUrl = serverUrl + url;
	return $api.get(loadDataUrl,
		{ params: param })
		.then((res) => {
			return res.data;
		})
		.then(thenRamda);
}

function createData() {

	const sttlBstd1CtsVal = _.isEmpty(searchParam.sttlCyclCd)?"D":searchParam.sttlCyclCd;
	const sttlBstd2CtsVal = _.isEmpty(searchParam.slipCrtUnitCd)?"10":searchParam.slipCrtUnitCd;

	const newData = {
		rowState: 'N',
		sttlBstdCd: searchParamConst.sttlBstdCd ,
		sttlBstdMetaNo: searchParamConst.sttlBstdMetaNo ,
		fxnItmYn: 'N',
		indnSqn: 0,
		sttlBstd1Cts : sttlBstd1CtsVal,
		sttlBstd2Cts : sttlBstd2CtsVal,
		sttlBstd3Cts : null,
		sttlBstd4Cts : null,
		sttlBstd5Cts : null,
		useYn: 'Y',
		aplBgnDt: dayjs(new Date()).format('YYYYMMDD') + '000000',
		aplEndDt: '20991231235959'
	};

	if (_.isEmpty(newData.sttlBstdCd)) {
		newData.state = 'E';
		newData.stateMessage = '정산기준코드를 선택해야 합니다.';
		console.log(newData);
	}

	return newData;
}

function addNewRow() {
	const added = gridApi.value.applyTransaction({
		add: [createData()],
		addIndex: 0
	});

	gridApi.value.startEditingCell({ rowIndex: added.add[0].rowIndex, colKey: 'sttlBstd1Cts' });
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
	//console.log(err.code, err.message);
	data.state = 'E';
	if(!_.isEmpty(err.detail)){
		let errDetailStr = "";
		if(_.isObject(err.detail)){
			const errKeys = Object.keys(err.detail);
			errKeys.forEach((errKey, i) => {
				console.log(errKey, i);
				errDetailStr += err.detail[errKey];
				if( i !== (errKeys.length -1) ){
					errDetailStr += ", ";
				}
			});
		}
		data.stateMessage = err.message + errDetailStr;
	}else{
		data.stateMessage = err.message;
	}
	gridApi.value.applyTransaction({ update: [data] });
}

function saveConfirm() {
	gridApi.value.stopEditing();
	let isThereSave = false;
	gridApi.value.forEachNode((rowNode, index) => {
		if (!_.isEmpty(rowNode.data.rowState)) {
			isThereSave = true;
		}
	});

	if (!isThereSave) {
		toast('저장할 내용이 없습니다.', 2000, 'error');
		return;
	}

	$Modal.confirm({
		title: '저장확인',
		message: '저장 하겠습니까?',

		buttonText: {
			confirm: '확인',
			cancel: '취소'
		}
	})
	.then(success => {
		saveData();
	})
	.catch(error => {
		console.log('error:', error);
	});
}

function saveData() {
	// let targetData = [];
	gridApi.value.stopEditing();

	let promise = Promise.resolve();

	gridApi.value.forEachNode((rowNode, index) => {
		
		if (rowNode.data.rowState == 'N' || rowNode.data.rowState == 'M' || rowNode.data.rowState == 'D') {
			// targetData.push(rowNode.data);
			switch (rowNode.data.rowState) {
				case 'N':
					promise = promise.then((res) => { return $api.post(serverUrl + '/api/v1/instl/sttlBstdDtl/create', rowNode.data); }
					)
						.then(
							(res) => { return successProcess(res, rowNode.data); }
							, (err) => { return errorProcess(err, rowNode.data); }
						);
					break;
				case 'M':
					promise = promise.then((res) => { return $api.put(serverUrl + '/api/v1/instl/sttlBstdDtl/modify', rowNode.data); }
					)
						.then(
							(res) => { return successProcess(res, rowNode.data); }
							, (err) => { return errorProcess(err, rowNode.data); }
						);
					break;
				case 'D':
					console.log(rowNode.data);
					promise = promise.then((res) => { return $api.delete(serverUrl + '/api/v1/instl/sttlBstdDtl/delete', { params: rowNode.data }); }
					)
						.then(
							(res) => { return successProcess(res, rowNode.data); }
							, (err) => { return errorProcess(err, rowNode.data); }
						);
					break;
			}
		}
	});

	promise.then((res) => {
		let isAllRowSaved = true;
		gridApi.value.forEachNode((rowNode, index) => {
			if (!_.isEmpty(rowNode.data.rowState)) {
				isAllRowSaved = false;
			}
		});
		if (isAllRowSaved) {
			toast('저장되었습니다.', 1000, 'success');
			loadData();
		}
	});
}

function cancelAdd() {
	let rowDatas = gridApi.value.getSelectedRows();
	let deleteTargetDatas = [];
	let updateTargetDatas = [];
	rowDatas.forEach((r, i) => {
		if (r.rowState === 'N') {
			deleteTargetDatas.push(r);
		} else if (r.rowState === 'D') {
			r.rowState = '';
			updateTargetDatas.push(r);
		}
	});
	gridApi.value.applyTransaction({ remove: deleteTargetDatas, update: updateTargetDatas });
}

function delData() {
	let rowDatas = gridApi.value.getSelectedRows();
	let deleteTargetDatas = [];
	let updateTargetDatas = [];
	rowDatas.forEach((r, i) => {
		if (r.rowState === 'N') {
			deleteTargetDatas.push(r);
		}else{
			r.rowState = 'D';
			updateTargetDatas.push(r);
		}
	});
	gridApi.value.applyTransaction({ remove: deleteTargetDatas, update: updateTargetDatas });
}

function enterSearch(event) {
	loadData();
}

function onRowDataUpdated(event){
	filteredCnt.value = event.api.getDisplayedRowCount();
}

function onFilterChanged(event){
	filteredCnt.value = event.api.getDisplayedRowCount();
	console.log(event);
}

onMounted(() => {
	loadData();
});

watch(
	searchParam,
	(newValue, oldValue) => {
		let filterModel = {};
		if(newValue.sttlCyclCd){
			filterModel.sttlBstd1Cts = {type:'equals', filter:newValue.sttlCyclCd};
		}
		if(newValue.slipCrtUnitCd){
			filterModel.sttlBstd2Cts = {type:'equals', filter:newValue.slipCrtUnitCd};
		}
		gridApi.value.setFilterModel(filterModel);
		loadData();
	}
)

const isShow = ref(false);

const openModal = () => {
	isShow.value = true;
};
const modalclose = (type, modalName) => {
	isShow.value = false;
};

let modalTargetData = {};
function selectErpTr(v){
	if(modalTargetData.sttlBstd8Cts != v.trCd){
		modalTargetData.sttlBstd8Cts = v.trCd;
	
		if(modalTargetData.rowState != 'N'){
			modalTargetData.rowState = 'M';
		}
		
		gridApi.value.applyTransaction({ update: [modalTargetData] });
	}
	isShow.value = false;
}
</script>
<template>
	<DefaultModal :isShow="isShow" :modalName="'isShow'" :modalTitle="'ERP 거래처 조회'" :buttonConfirm="'닫기'" :buttonCancel="''" @modalclose="modalclose">
		<template #modalcontent>
			<SttlErpTr @selectErpTr="selectErpTr" :params="modalTargetData"/>
		</template>
	</DefaultModal>
	<section class="s1">
		<!-- 검색 -->
		<div class="ui-data-filter">
			<div class="form-item">
				<div class="item" @keyup.enter="enterSearch">
					<div class="form-item">
						<div class="item">
							<label>정산주기</label>
							<span class="input">
								<span class="dv">
									<select class="custom-select sm" v-model="searchParam.sttlCyclCd">
										<option :value="item.code" v-for="(item, index) in sttlCyclCds">
										{{_.isEmpty(item.code) ? item.name : item.code + ':' + item.name }}
										</option>
									</select>
								</span>
							</span>
						</div>
						<div class="item">
							<label>전표생성단위</label>
							<span class="input">
								<span class="dv">
									<select class="custom-select sm" v-model="searchParam.slipCrtUnitCd">
										<option :value="item.code" v-for="(item, index) in slipCrtUnitCds">
											{{_.isEmpty(item.code) ? item.name : item.code + ':' + item.name }}
										</option>
									</select>
								</span>
							</span>
						</div>
						<div class="btn-filter-set">
							<button type="button" class="btn btn-sm" @click="loadData"><span class="ico-search"></span>조회
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 테이블 -->
		<div class="tbl-wrap">
			<div class="table-util flex space-between">
				<div class="btn-set-m flex">
					<button type="button" class="btn btn-ss" @click="addNewRow">추가</button>
					<button type="button" class="btn btn-ss" @click="delData">삭제</button>
					<button type="button" class="btn btn-ss" @click="cancelAdd">취소</button>
					<button type="button" class="btn btn-ss" @click="saveConfirm">저장</button>
				</div>
				<div class="btn-set-m flex align-end">
					<span class="table-total">조회결과 총 <strong>{{ _.isArray(rowData.value) ? rowData.value.length : 0
					}}</strong>건 중 {{filteredCnt}}건</span>
				</div>
			</div>
			<ag-grid-vue class="ag-theme-alpine remainHeightGrid" style="width:100%" :columnDefs="columnDefs"
				:rowData="rowData.value" :defaultColDef="defaultColDef" rowSelection="multiple" animateRows="true"
				suppressRowClickSelection="true" singleClickEdit="true" 
				headerHeight="24.5"
				:isRowSelectable="isRowSelectable"
				@grid-ready="onGridReady" undoRedoCellEditing="true" undoRedoCellEditingLimit="100" :tooltipShowDelay="0"
				@row-data-updated="onRowDataUpdated"
				@filter-changed="onFilterChanged"
				:tooltipHideDelay="5000">
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
	width: 300px;
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

.ag-body-horizontal-scroll-viewport {
	display: block;
}
.align-center {
	text-align: center;
}
.align-check-center {
	display: flex;
	justify-content: center;
}

.ag-cell-inline-editing .ag-cell-edit-wrapper{
	height: 100%;
	width: 100%;
	line-height: normal;
	justify-content:center;
}
.remainHeightGrid {
    height: calc( 100vh - 380px)
}
</style>