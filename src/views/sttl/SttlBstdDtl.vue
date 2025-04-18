<script setup>
import { reactive, onMounted, ref, inject, watch } from 'vue';
import DatePickerEditor from './DatePickerEditor.vue';
import ErrorToolTip from './ErrorToolTip.vue';
import _ from 'lodash';
const MAX_ITEM = 30;
const dayjs = inject('dayJS');
const $Modal = inject('$Modal');

const date = ref(null);

const searchParam = reactive({
	sttlBstdCd: '',
	sttlBstdMetaNo: ''
});

const gridApi = ref(null);

const onGridReady = (params) => {
	gridApi.value = params.api;
};

const serverUrl = '/common';

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
			tooltipComponent: ErrorToolTip
		},
		{ headerName: '정산기준코드', field: 'sttlBstdCd', width: 200, editable: false, hide: false },
		{ headerName: '정산기준메타번호', field: 'sttlBstdMetaNo', width: 200, editable: false, hide: true },
		{ headerName: '정산기준상세번호', field: 'sttlBstdDtlNo', width: 200, editable: false, hide: true },
		{ headerName: '표시순서', field: 'indnSqn', width: 100, editable: true, hide: false ,
			cellEditor: 'agNumberCellEditor',
			cellEditorParams: {
				min: 0,
				max: 2147483647,
				precision: 0
			},
		},
		{
			headerName: '사용여부',
			field: 'useYn',
			cellRenderer: 'agCheckboxCellRenderer',
			cellEditor: 'agCheckboxCellEditor',
			valueGetter: (param) => { return param.data.useYn === 'Y'; },
			editable: true,
			width: 100,
			cellClass: 'align-check-center'		},
		{
			headerName: '고정항목여부',
			field: 'fxnItmYn',
			cellRenderer: 'agCheckboxCellRenderer',
			cellEditor: 'agCheckboxCellEditor',
			valueGetter: (param) => { return param.data.fxnItmYn === 'Y'; },
			editable: true,
			width: 125,
			cellClass: 'align-check-center',
		}
	]
);

for (let i = 1; i <= MAX_ITEM; i++) {
	columnDefs.push({ headerName: '정산기준' + i + '내용', field: 'sttlBstd' + i + 'Cts', width: 200, editable: true, hide: false });
}

columnDefs.push(
	{
		headerName: '적용시작일시',
		field: 'aplBgnDt',
		width: 230,
		editable: true,
		valueGetter: (param) => {
			return dayjs(param.node.data.aplBgnDt, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
		},
		cellEditor: DatePickerEditor,
		cellEditorPopup: true,
		cellEditorPopupPosition: 'over'
	}
);
columnDefs.push(
	{
		headerName: '적용종료일시',
		field: 'aplEndDt',
		width: 230,
		editable: true,
		valueGetter: (param) => {
			return dayjs(param.node.data.aplEndDt, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
		},
		cellEditor: DatePickerEditor,
		cellEditorPopup: true,
		cellEditorPopupPosition: 'over'
	}
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

	loadDataGet(
		'/api/v1/instl/sttlBstdDtl/list',
		{
			sttlBstdCd: searchParam.sttlBstdCd,
			sttlBstdMetaNo: searchParam.sttlBstdMetaNo
		},
		(data) => {
			rowData.value = data.data.list;
			//console.log(data.data.list);
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
	$api.get(loadDataUrl,
		{ params: param })
		.then((res) => {
			return res.data;
		})
		.then(thenRamda);
}

function createData() {
	const newData = {
		rowState: 'N',
		sttlBstdCd: searchParam.sttlBstdCd,
		sttlBstdMetaNo: searchParam.sttlBstdMetaNo,
		fxnItmYn: 'N',
		indnSqn: 0,
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

let searchBstdMetaNos = [];
function sttlBstdCdChange(event) {

	if (_.isEmpty(searchParam.sttlBstdCd)) {
		searchBstdMetaNos = [];
		searchParam.sttlBstdMetaNo = '';
		loadData();
	} else {
		loadDataGet(
			'/api/v1/instl/sttlBstdDtl/metaList',
			{
				sttlBstdCd: searchParam.sttlBstdCd
			},
			(data) => {
				searchBstdMetaNos = data.data.list;
				if (searchBstdMetaNos.length === 1) {
					searchParam.sttlBstdMetaNo = searchBstdMetaNos[0].sttlBstdMetaNo;
				} else if (searchBstdMetaNos.length === 0) {
					searchParam.sttlBstdMetaNo = '';
				}
				loadData();
			}
		);
	}
}

onMounted(() => {
	loadBstdData();
	loadData();
});

watch(
	() => searchParam.sttlBstdMetaNo,
	(newValue, oldValue) => {
		if (_.isEmpty(newValue)) {
			//정산기준메타번호가 없으면 기본설정으로 변경
			gridApi.value.setColumnDefs(columnDefs);
		} else {
			//정산기준메타번호가 없으면 서버에서 설정가져오기
			loadDataGet(
				'/api/v1/instl/sttlBstdMeta/list',
				{
					sort: 'sttlBstdMetaNo', text: newValue
				},
				(data) => {
					const setting = data.data.list[0];
					const colDefs = gridApi.value.getColumnDefs();
					colDefs.forEach((value, index) => {
						value.sort = null;
						value.sortIndex = 0;
						if (value.field === 'sttlBstdCd') {
							gridApi.value.destroyFilter('sttlBstdCd');
							value.hide = true;
							value.sort = null;
							value.sortIndex = null;
						}
						if (value.field === 'sttlBstdMetaNo') {
							gridApi.value.destroyFilter('sttlBstdMetaNo');
							value.hide = true;
							value.sort = null;
							value.sortIndex = null;
						}
						for (let i = 1; i <= MAX_ITEM; i++) {
							if (value.field === 'sttlBstd' + i + 'Cts') {
								if (!_.isEmpty(setting['meta' + i + 'KorNm'])) {
									value.hide = false;
									value.headerName = setting['meta' + i + 'KorNm'];
								} else {
									gridApi.value.destroyFilter('sttlBstd' + i + 'Cts');
									value.sort = null;
									value.sortIndex = null;
									value.hide = true;
								}
							}
						}
					});
					gridApi.value.setColumnDefs(colDefs);
				}
			);
		}
	}
);
</script>
<template>
	<section class="s1">
		<!-- 검색 -->
		<div class="ui-data-filter">
			<div class="form-item">
				<div class="item" @keyup.enter="enterSearch">
					<div class="form-item">
						<div class="item">
							<label>정산기준코드</label>
							<span class="input">
								<span class="dv">
									<select class="custom-select sm" v-model="searchParam.sttlBstdCd"
										@change="sttlBstdCdChange">
										<option :value="item.sttlBstdCd" v-for="(item, index) in searchBstdCds">{{
											item.sttlBstdCdNm }}{{
		_.isEmpty(item.sttlBstdCd) ? '' : '(' + item.sttlBstdCd + ')' }}</option>
									</select>
								</span>
							</span>
						</div>
						<div class="item">
							<label>정산기준메타번호</label>
							<span class="input">
								<span class="dv">
									<select class="custom-select sm" v-model="searchParam.sttlBstdMetaNo"
										@change="enterSearch">
										<option :value="item.sttlBstdMetaNo" v-for="(item, index) in searchBstdMetaNos">{{
											item.sttlBstdMetaNo
										}}</option>
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
					<button type="button" class="btn btn-ss" @click="delData" style="display: none">삭제</button>
					<button type="button" class="btn btn-ss" @click="cancelAdd">취소</button>
					<button type="button" class="btn btn-ss" @click="saveConfirm">저장</button>
				</div>
				<div class="btn-set-m flex align-end">
					<span class="table-total">조회결과 총 <strong>{{ _.isArray(rowData.value) ? rowData.value.length : 0
					}}</strong>건</span>
				</div>
			</div>
			<!-- singleClickEdit="true"  -->
			<ag-grid-vue class="ag-theme-alpine remainHeightGrid" style="width:100%" :columnDefs="columnDefs"
				:rowData="rowData.value" :defaultColDef="defaultColDef" rowSelection="multiple" animateRows="true"
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