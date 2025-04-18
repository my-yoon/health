<script setup>
import { reactive, onMounted, ref, inject, watch } from 'vue';
import DatePickerEditorYear from './DatePickerEditorYear.vue';
import DatePickerEditorMonth from './DatePickerEditorMonth.vue';
import DatePickerEditorDay from './DatePickerEditorDay.vue';
import ErrorToolTip from './ErrorToolTip.vue';
//import { _dlngTyCds, _slipTyCds, _sttlCyclCds, _slipCrtUnitCds, _drcrSeCds, _accds } from '@/api/sttl';
import _ from 'lodash';

const dayjs = inject('dayJS');
const $Modal = inject('$Modal');

const sttlStatusCdsMap = {
	'Open' : 'Open',
	'Close' : 'Close',
};

function extractKeys(map){
	return _.keys(map).sort((a, b) => a < b ? -1: 1 );
}

const lookupValue = (map, key) => {
	const keyvalue = _.isNull(key)?"":key
	let mapval = map[keyvalue];
	return _.isEmpty(mapval) ? keyvalue + " : 코드미상" : mapval;
}

const searchParamConst = {
	sttlBstdCd: 'STTL_CALENDAR',
	sttlBstdMetaNo: '8'
}

const searchParam = reactive({
	sttlBstd1Cts: '',
	sttlBstd2Cts: '',
	sttlBstd3Cts: '',
});

const gridApi = ref(null);

const onGridReady = (params) => {
	gridApi.value = params.api;
};

const serverUrl = '/common';

const rowData = reactive({});

function isRowSelectable(params){
	return params.data.rowState == 'N';
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
		{ headerName: '고정항목여부', field: 'fxnItmYn',     width: 125, editable: true, hide: true },
		{ headerName: '라인번호',     field: 'indnSqn'     , width: 100, editable: false, hide: true },
		{ headerName: '정산년도',     field: 'sttlBstd1Cts', width: 90, editable: (params) => params.data.rowState == 'N',
			cellEditor: DatePickerEditorYear,
			cellEditorPopup : true,
			cellEditorPopupPosition: 'over',
			sort : 'desc',
		},
		{ headerName: '정산년월',     field: 'sttlBstd2Cts', width: 90, editable: (params) => params.data.rowState == 'N',
			cellEditor: DatePickerEditorMonth,
			cellEditorPopup : true,
			cellEditorPopupPosition: 'over',
			sort : 'desc',
		},
		{ headerName: '정산회차',     field: 'sttlBstd3Cts', width: 90, editable: (params) => params.data.rowState == 'N',
			cellEditor: 'agNumberCellEditor',
			cellEditorParams: {
				min: 1,
				max: 1000,
				precision: 0
			},
			cellDataType:'number',
			valueFormatter: (param) => {
				return _.isNumber(param.value)?param.value:_.toNumber(param.value);
			},
			type:'numericColumn',
			sort : 'desc',
		},
		{ headerName: '시작일자',     field: 'sttlBstd4Cts', width: 90, editable: (params) => params.data.rowState == 'N',
			cellEditor: DatePickerEditorDay,
			cellEditorPopup : true,
			cellEditorPopupPosition: 'over',
		},
		{ headerName: '종료일자',     field: 'sttlBstd5Cts', width: 90, editable: (params) => params.data.rowState == 'N',
			cellEditor: DatePickerEditorDay,
			cellEditorPopup : true,
			cellEditorPopupPosition: 'over',
		},
		{ headerName: '정산상태',     field: 'sttlBstd6Cts', width: 90, editable: true,
			cellEditor: 'agSelectCellEditor',
			cellEditorParams: (params) => {
				let keyList = extractKeys(sttlStatusCdsMap);
				if(!_.includes(keyList, params.value) && !_.isNull(params.value)){
					keyList.unshift(params.value);
				}
				return {
					values : keyList,
					valueListGap : 10,
				};
			},
			valueFormatter: (params) => {
				return lookupValue(sttlStatusCdsMap, params.value);
			},
		},
		{ headerName: '적용시작일시', field: 'aplBgnDt',     width: 230, editable: false, hide:true },
		{ headerName: '적용종료일시', field: 'aplEndDt',     width: 230, editable: false, hide:true },
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
				console.log("params.newValue", params.newValue);
				params.data[params.colDef.field] = params.newValue;
				break;
		}
		if (params.data.rowState != 'N' && params.oldValue !== params.newValue) {
			params.data.rowState = 'M';
		}
		return true;
	},
	// flex: 1
};

function loadData() {
	if(!_.isEmpty(gridApi.value)){
		gridApi.value.showLoadingOverlay();
	};
	//console.log("searchParam",searchParam.sttlBstd1Cts, searchParam.sttlBstd2Cts, searchParam.sttlBstd3Cts);
	return loadDataGet(
		'/api/v1/instl/sttlBstdDtl/list',
		{
			sttlBstdCd: searchParamConst.sttlBstdCd,
			sttlBstdMetaNo: searchParamConst.sttlBstdMetaNo,
			sttlBstd1Cts: searchParam.sttlBstd1Cts,
			sttlBstd2Cts: _.isEmpty(searchParam.sttlBstd2Cts)?null:searchParam.sttlBstd2Cts.year + _.padStart(searchParam.sttlBstd2Cts.month+1, 2, '0'),
			sttlBstd3Cts: searchParam.sttlBstd3Cts,
		},
		(data) => {
			rowData.value = data.data.list;
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

	let year = '';
	let yearmonth = '';
	let eps = 1;
	let startday = '';
	let endday = '';

	let rowRecent = gridApi.value.getDisplayedRowAtIndex(0);

	console.log(rowRecent.data);

	if(!_.isEmpty(rowRecent.data.sttlBstd1Cts)){
		year = rowRecent.data.sttlBstd1Cts;
	}

	if(!_.isEmpty(rowRecent.data.sttlBstd2Cts)){
		yearmonth = rowRecent.data.sttlBstd2Cts;
	}
	
	if(!_.isEmpty(rowRecent.data.sttlBstd3Cts)){
		eps = ""+(_.toNumber(rowRecent.data.sttlBstd3Cts)+1);
	}

	const newData = {
		rowState: 'N',
		sttlBstdCd: searchParamConst.sttlBstdCd ,
		sttlBstdMetaNo: searchParamConst.sttlBstdMetaNo ,
		fxnItmYn: 'Y',
		indnSqn: 1,
		sttlBstd1Cts : year,
		sttlBstd2Cts : yearmonth,
		sttlBstd3Cts : eps,
		sttlBstd4Cts : startday,
		sttlBstd5Cts : endday,
		sttlBstd6Cts : 'Open',
		useYn: 'Y',
		aplBgnDt: '20240101000000',
		aplEndDt: '20991231235959'
	};

	if (_.isEmpty(newData.sttlBstdCd)) {
		newData.state = 'E';
		newData.stateMessage = '정산기준코드를 선택해야 합니다.';
	}

	return newData;
}

function addNewRow() {
	const added = gridApi.value.applyTransaction({
		add: [createData()],
		addIndex: 0
	});

	//gridApi.value.startEditingCell({ rowIndex: added.add[0].rowIndex, colKey: 'sttlBstd1Cts' });
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
	
	data.state = 'E';
	if(!_.isEmpty(err.detail)){
		let errDetailStr = "";
		if(_.isObject(err.detail)){
			const errKeys = Object.keys(err.detail);
			errKeys.forEach((errKey, i) => {
				
				errDetailStr += err.detail[errKey];
				if( i !== (errKeys.length -1) ){
					errDetailStr += ", ";
				}
			});
		}
		data.stateMessage = err.message + errDetailStr;
	}else if(!_.isEmpty(err) && !_.isEmpty(err.response) && !_.isEmpty(err.response.data) && !_.isEmpty(err.response.data.message)){
		data.stateMessage = err.response.data.message;
	}else{
		data.stateMessage = err.message;
	}
	gridApi.value.applyTransaction({ update: [data] });
}

function saveConfirm() {
	gridApi.value.stopEditing();
	let isThereSave = false;
	let errMsg = "";
	let isThereError = false;
	let valiTD = null;

	//에러상태초기화
	let gridErrorInit = [];
	gridApi.value.forEachNode((rowNode, index)=>{
		if(rowNode.data.state == 'E'){
			delete rowNode.data.state;
			delete rowNode.data.stateMessage;
		}
		gridErrorInit.push(rowNode.data);
	});
	gridApi.value.applyTransaction({ update: gridErrorInit });

	try{
		gridApi.value.forEachNodeAfterFilterAndSort((rowNode, index) => {
			valiTD = rowNode.data;

			if (!_.isEmpty(valiTD.rowState)) {

				isThereSave = true;
				
				if(_.isEmpty(valiTD.sttlBstd1Cts)){
					isThereError = true;
					errMsg = (index + 1 ) + "행의 정산년도를 입력 바랍니다.";
					throw new Error('종료');
				}
	
				if(_.isEmpty(valiTD.sttlBstd2Cts)){
					isThereError = true;
					errMsg = (index + 1 ) + "행의 정산년월을 입력 바랍니다.";
					throw new Error('종료');
				}
	
				if(_.isEmpty(valiTD.sttlBstd3Cts)){
					isThereError = true;
					errMsg = (index + 1 ) + "행의 정산회차를 입력 바랍니다.";
					throw new Error('종료');
				}
	
				if(_.isEmpty(valiTD.sttlBstd4Cts)){
					isThereError = true;
					errMsg = (index + 1 ) + "행의 시작일자를 입력 바랍니다.";
					throw new Error('종료');
				}
	
				if(_.isEmpty(valiTD.sttlBstd5Cts)){
					isThereError = true;
					errMsg = (index + 1 ) + "행의 종료일자를 입력 바랍니다.";
					throw new Error('종료');
				}

				if(valiTD.sttlBstd4Cts > valiTD.sttlBstd5Cts){
					isThereError = true;
					errMsg = (index + 1 ) + "행의 시작일을 종료일 이후로 입력할 수 없습니다.";
					throw new Error('종료');
				}
			}
		});

	}catch(error){
		console.log('invalid Data inputed!!');
	}

	if (!isThereSave) {
		toast('저장할 내용이 없습니다.', 2000, 'error');
		return;
	}

	if(isThereError){
		toast(errMsg, 2000, 'error');
		errorProcess({message:errMsg}, valiTD);
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

	gridApi.value.forEachNodeAfterFilterAndSort((rowNode, index) => {
		
		if (rowNode.data.rowState == 'N' || rowNode.data.rowState == 'M' || rowNode.data.rowState == 'D') {
			// targetData.push(rowNode.data);
			switch (rowNode.data.rowState) {
				case 'N':
					promise = promise.then((res) => { return $api.post(serverUrl + '/api/v1/instl/sttlBstdDtl/create', rowNode.data); }
						,(err, test) => {
							console.log(err, test);
							return err;
						}
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

onMounted(() => {
	console.warn(dayjs);
	loadData();
});

const sttlYearDatepicker = ref(null);

const sttlMonthDatepicker = ref(null);

const monthFormat = (params, one) => {
	console.log(params, one);
	return dayjs(params).format('YYYYMM');
}

</script>
<template>
	<section class="s1">
		<!-- 검색 -->
		<div class="ui-data-filter">
			<div class="form-item">
				<div class="item" @keyup.enter="enterSearch">
					<div class="form-item">
						<div class="item">
							<label>정산년도</label>
							<span class="input">
								<span class="dv">
									<div class="ui-datepicker">
										<DatePicker ref="sttlYearDatepicker" v-model="searchParam.sttlBstd1Cts" locale="ko" :clearable="true" auto-apply year-picker/>
									</div>
								</span>
								<span class="dv">
									<button type="button" class="btn btn-ss" @click="sttlYearDatepicker.clearValue">clear</button>
								</span>
							</span>
						</div>
						<div class="item">
							<label>정산년월</label>
							<span class="input">
								<span class="dv">
									<div class="ui-datepicker">
										<DatePicker ref="sttlMonthDatepicker" v-model="searchParam.sttlBstd2Cts" :format="'yyyyMM'" locale="ko" :clearable="true" auto-apply month-picker/>
									</div>
								</span>
								<span class="dv">
									<button type="button" class="btn btn-ss" @click="sttlMonthDatepicker.clearValue">clear</button>
								</span>
							</span>
						</div>
						<div class="item">
							<label>정산회차</label>
							<span class="input">
								<span class="dv">
									<input type="number" class="form-control sm" v-model="searchParam.sttlBstd3Cts" min="1">
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
					<button type="button" class="btn btn-ss" @click="cancelAdd">취소</button>
					<button type="button" class="btn btn-ss" @click="saveConfirm">저장</button>
				</div>
				<div class="btn-set-m flex align-end">
					<span class="table-total">조회결과 총 <strong>{{ _.isArray(rowData.value) ? rowData.value.length : 0
					}}</strong>건 </span>
				</div>
			</div>
			<ag-grid-vue class="ag-theme-alpine remainHeightGrid" style="width:100%" :columnDefs="columnDefs"
				:rowData="rowData.value" :defaultColDef="defaultColDef" rowSelection="multiple" animateRows="true"
				suppressRowClickSelection="true" singleClickEdit="true" 
				:isRowSelectable="isRowSelectable"
				@grid-ready="onGridReady" undoRedoCellEditing="true" undoRedoCellEditingLimit="100" :tooltipShowDelay="0"
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
	height: 60px;
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