<script setup>
import { reactive, onMounted, ref, inject, watch } from 'vue';
//import DatePickerEditor from './DatePickerEditor.vue';
//import ErrorToolTip from './ErrorToolTip.vue';
import { _getInstlSttlBstdDtlMapList, _getInstlAcctSlip, _getInstlAcctSlipFile, _sttlCyclCds, _slipCrtUnitCds } from '@/api/sttl';
import _ from 'lodash';
const MAX_ITEM = 30;
const dayjs = inject('dayJS');
const $Modal = inject('$Modal');

const codeAll = { code: '', name: '전체' };

const sttlCyclCds = _.clone(_sttlCyclCds); //정산주기
sttlCyclCds.unshift(codeAll);

const slipCrtUnitCds = _.clone(_slipCrtUnitCds); //전표생성단위
slipCrtUnitCds.unshift(codeAll);

const slipDateValue = ref(dayjs('2023-08-01', 'YYYY-MM-DD'));//2023-08-01일로 하드코딩 ref(dayjs())

const searchParam = reactive({
	slipDate: '',
	sttlCyclCd: '',
	slipCrtUnitCd: '',
	slipNoList: null
});

const gridApi = ref(null);

const onGridReady = (params) => {
	gridApi.value = params.api;
};

const serverUrl = '/common';

const rowData = reactive({});

const formatMoney = (params) => {
	return _.replace(params.value, /(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

const formatDate = (params) => {
	return _.replace(params.value, /(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
};

const getRowSpan = (params) => {
	return params.data.MENU_LN_SQ == 1 ? params.data.LN_CNT : 1;
}

const getCellClass = (params) =>{
	return params.data.MENU_LN_SQ == 1 ? 'rowSpan' : '';
}

const columnDefs = reactive(
	[
		{
			headerCheckboxSelection: true,
			checkboxSelection: true,
			showDisabledCheckboxes: true,
			width: 50,
			sortable: false,
			filter: false,
			resizable: false,
			pinned: 'left',
			rowSpan: getRowSpan,
			cellClass: getCellClass
		},
		{ headerName: '회계단위', field: 'IN_DIV_CD', width: 90 },
		{ headerName: '작성일자', field: 'MENU_DT', width: 100, valueFormatter: formatDate },
		{ headerName: '작성번호', field: 'MENU_SQ', width: 90, cellClass: 'align-center' },
		{ headerName: '라인순번', field: 'MENU_LN_SQ', width: 90, cellClass: 'align-right' },
		{ headerName: '품의내역', field: 'ISU_DOC', width: 200 },
		{ headerName: '전표유형', field: 'DOCU_TY_NM', width: 90 },
		{ headerName: '차대구분', field: 'DRCR_FG_NM', width: 90 },
		{ headerName: '계정과목', field: 'ACCT_CD_NM', width: 200 },
		{ headerName: '거래처', field: 'TR_CD', width: 90, cellClass: 'align-center' },
		{ headerName: '거래처명', field: 'TR_NM', width: 150 },
		{ headerName: '계정금액', field: 'ACCT_AM', width: 90, cellClass: 'align-right', valueFormatter: formatMoney },
		{ headerName: '증빙코드', field: 'ATTR_CD_NM', width: 180, cellClass: 'align-center', hide: true },
		{ headerName: '적요', field: 'RMK_DC', width: 200 },
		{ headerName: '부가세사업장', field: 'VAT_DIV_CD', width: 120 },
		{ headerName: '부가세신고기준일', field: 'ISS_DT', width: 150 },
		{ headerName: '세무구분', field: 'TAX_FG_NM', width: 90 },
		{ headerName: '공급가액', field: 'SUP_AM', width: 90, cellClass: 'align-right', valueFormatter: formatMoney },
		{ headerName: '전자세금계산서여부', field: 'JEONJA_YN_NM', width: 150 },
		{ headerName: '사용부서', field: 'CT_DEPT', width: 150 },
		{ headerName: '요청일', field: 'REQ_DT', width: 90 },
		{ headerName: '종료일', field: 'END_DT', width: 90 }
	]
);

const defaultColDef = {
	sortable: false,
	filter: false,
	resizable: true,
	editable: false,
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

async function initData() {
	return _getInstlSttlBstdDtlMapList({
		'sttlBstdCd': 'ERP_SLIP_XLS_IF',
		'sttlBstdMetaNo': '1'
	}).then(function (res) {
		if (res.data.data) {
			let coldata = res.data.data;
			coldata.forEach((v, i) => {
				// columnDefs.push({ headerName: '정산기준' + i + '내용', field: 'sttlBstd' + i + 'Cts', width: 200, editable: true, hide: false });
				columnDefs.push({ headerName: v.column, field: v.mappingColumn, width: _.parseInt(v.dataLen) < 31 ? _.parseInt(v.dataLen) * 10 + 50 : 360, editable: false, hide: (v.scrYn !== 'Y') });
			});
		} else {
			//nodata?
		}
	}, function (error) {
		console.log('error : ', error);
	});
}

function loadData() {

	searchParam.slipDate = dayjs(slipDateValue.value).format('YYYYMMDD');
	searchParam.slipNoList = null;
	return _getInstlAcctSlip(searchParam)
		.then(function (res) {
			if (res.data.data) {
				rowData.value = res.data.data;
			} else {
				rowData.value = [];
			}
		}, function (error) {
			console.log('error : ', error);
		});
}

function enterSearch(event) {
	loadData();
}

onMounted(() => {
	loadData();
});

function onRowSelected(event) {
	if (event.source == 'checkboxSelected' || event.source == 'spaceKey') {
		const isSelected = event.node.isSelected();
		const nodesToSelect = [];
		event.api.forEachNode((node) => {
			if (node.data.MENU_DT == event.data.MENU_DT && node.data.MENU_SQ == event.data.MENU_SQ) {
				nodesToSelect.push(node);
			}
		});
		event.api.setNodesSelected({ nodes: nodesToSelect, newValue: isSelected });
	}
}

function onExcelDown(event) {
	let selectedRows = gridApi.value.getSelectedRows();
	if (!_.isEmpty(selectedRows)) {
		console.log(selectedRows.filter((row => row.MENU_LN_SQ === 1)).map(row => row.MENU_SQ));
		searchParam.slipNoList = selectedRows.filter((row => row.MENU_LN_SQ === 1)).map(row => row.MENU_SQ);
		return _getInstlAcctSlipFile(searchParam);
	} else {
		return $Modal.alert({
			title: '확인',
			message: '다운로드할 항목을 선택바랍니다.',
			buttonText: {
				ok: '확인'
			}
		});
	}
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
							<label>전표일자</label>
							<span class="input">
								<span class="dv">
									<div class="ui-datepicker">
										<DatePicker :enable-time-picker="false" format="yyyy-MM-dd" v-model="slipDateValue"
											auto-apply locale="ko" />
									</div>
								</span>
							</span>
						</div>
						<div class="item">
							<label>정산주기</label>
							<span class="input">
								<span class="dv">
									<select class="custom-select sm" v-model="searchParam.sttlCyclCd">
										<option :value="item.code" v-for="(item, index) in sttlCyclCds">
											{{ _.isEmpty(item.code) ? item.name : item.code + ':' + item.name }}
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
											{{ _.isEmpty(item.code) ? item.name : item.code + ':' + item.name }}
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
					<button type="button" class="btn btn-ss" @click="onExcelDown">다운로드</button>
				</div>
				<div class="btn-set-m flex align-end">
					<span class="table-total">조회결과 총 <strong>{{ _.isArray(rowData.value) ? rowData.value.length : 0
					}}</strong>건</span>
				</div>
			</div>
			<ag-grid-vue class="ag-theme-alpine remainHeightGrid" style="width:100%" :columnDefs="columnDefs"
				undoRedoCellEditing="true" undoRedoCellEditingLimit="100" :rowData="rowData.value"
				:defaultColDef="defaultColDef" rowSelection="multiple" animateRows="true" suppressRowTransform="true"
				suppressRowClickSelection="true" @grid-ready="onGridReady" @row-selected="onRowSelected">
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

.rowSpan {
	background: white;
	border-top: 1px solid #ebebeb;
}

.align-right {
	text-align: right;
}

.align-center {
	text-align: center;
}

.ag-body-horizontal-scroll-viewport {
	display: block;
}

.remainHeightGrid {
	height: calc(100vh - 380px)
}
</style>