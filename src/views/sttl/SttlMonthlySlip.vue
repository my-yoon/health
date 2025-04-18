<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <SettlePeriodForMonth dateTitle="전표일자" v-model:bgnDate="formData.slipBgnDate" v-model:endDate="formData.slipEndDate" ref="fromToDateRef" />
                <SettleSeq v-model="formData.sttlEps" />
                <SlipCrtUnit v-model="formData.slipCrtUnitCd" :sttlCyclCd="sttlCyclCd"/>
                <SelectYn v-model="formData.dwnlYn">다운로드 여부</SelectYn>
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm">
                        <span class="ico-search"></span>조회</button>
                    <button type="button" class="btn btn-sm">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button type="button" class="btn btn-sm">
                        <span class="txt">상세검색 열기</span>
                    </button>
                </div>
            </div>
            <div class="btn-filter-set">
                <button type="button" class="btn btn-sm" @click="reloadList">
                    <span class="ico-search"></span>조회</button>
                <button type="button" class="btn btn-sm" @click="clearList">
                    <span class="ico-reload sg"></span>
                    <span class="offscreen">리로드</span>
                </button>
                <button type="button" class="btn btn-sm" @click="state.openMore = !state.openMore">
                    <span class="txt">상세검색 열기</span>
                </button>
            </div>

            <!-- 상세검색 -->
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <DateSearch v-model:dateSearchType="formData.dateSearchType" v-model:searchDate="formData.searchDate"  ref="dateRef" >
                        <option value="slipCrtDate">전표생성일자</option>
                        <option value="dwnlDate">다운로드일자</option>
                    </DateSearch>
                    <UserSearch v-model:mbrId="formData.dwnlUsrId">다운로드사용자</UserSearch>
                </div>
                <div class="form-item">
                    <BizSearch no-biz-options v-model:searchBiz="formData.dlngPlcId" />
                    <ErpTrSearch v-model="accuDlngPlcCd" />
                    <TextBox v-model="formData.slipNo" >전표번호</TextBox>
                </div>
            </div>
        </div>
        <!-- 테이블 -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <SttlMonthlyAccountingGeneratePopup @create="getList" cancelOnly/>
                    <SttlMonthlySlipChangeDatePopup @change="getList" :params="state.selectList" :gridApi="state.gridApi"/>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <div class="form-item">
                        <span class="checkbox">
                            <input id="kk" name="logGroup" type="checkbox" value="true" v-model="isOneFile">
                            <label for="kk" style="white-space: nowrap;">한 파일로 받기</label>
                        </span>
                    </div>
                    <button type="button" class="btn btn-opt" @click="onExcelDown"><span class="ico-download"></span>더존양식다운로드</button>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, formData.mskgnRlsYn, exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <SttlSelectBox :selectType="'page'" @changedValue="selectedOptions" />

                    <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                    <!-- 클래스 : full -->
                    <!-- 클래스 : close -->
                    <button type="button" class="btn btn-opt-ico filter" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions"/>
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
            <template v-else>
                <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                    :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked" :isRowSelectable="isRowSelectable"
                    :suppressRowClickSelection="true" suppressRowTransform="true" @selection-changed="onRowSelect" @row-selected="onRowSelected"  rowSelection="multiple"
                    class="ag-theme-alpine" domLayout="autoHeight">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </template>
            
        </div>
    </section>


</template>
<style>
.align-right {
	text-align: right;
}
.ag-body-horizontal-scroll-viewport {
    display: none;
}
.ag-horizontal-left-spacer {
    display: none;
}
.row-data-warning {
    background-color: #db5c2166;
}
.notRowSpan {
    opacity: 0;
}
.rowSpan {
    border-top: 1px solid #ebebeb;
    border-left: 1px solid #ebebeb;
    background-color: rgba(255,255,255,0.8);
    justify-content: baseline;
    align-items: center;
    display: flex;
    margin-top: -1px;
}
</style>
<script setup>
import { getCurrentInstance, computed, reactive, inject, onMounted, onUnmounted, ref, watchEffect, watch, toDisplayString  } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply,  _getInstlAcctSlipListPaging, _deleteInstlAcctSlip, _getInstlAcctSlipFile } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';
import SettleSeq from './searchFilters/SettleSeq.vue';
import SlipCrtUnit from './searchFilters/SlipCrtUnit.vue';
import BizSearch from './searchFilters/BizSearch.vue';
import SelectYn from './searchFilters/SelectYn.vue';
import UserSearch from './searchFilters/UserSearch.vue';
import TextBox from './searchFilters/TextBox.vue';
import DateSearch from './searchFilters/DateSearch.vue';
import ErpTrSearch from './searchFilters/ErpTrSearch.vue';
import { sttlLib } from './module/sttlLib';
import SttlMonthlyAccountingGeneratePopup from './SttlMonthlyAccountingGeneratePopup.vue';
import SttlMonthlySlipChangeDatePopup from './SttlMonthlySlipChangeDatePopup.vue';
import SettlePeriodForMonth from './searchFilters/SettlePeriodForMonth.vue';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

const sttlCyclCd = 'M';

const slipCrtUnitCdList = ref([]);

const fromToDateRef = ref(null);
const dateRef = ref(null);


const initCodeList = () => {
    let promiseTemp = [];
    promiseTemp.push(_getCodeApply('SLIP_CRT_UNIT_CD', slipCrtUnitCdList, sttlCyclCd));

    return Promise.all(promiseTemp);
};

const dateFormat = 'yyyy-MM-dd';

const getRowClass = (params) => {
    if (params.node.data.bkrtDdctYn === 'Y') {
        return 'row-data-warning';
    }
};
const getRowSpan = (params) => {
    return params.data.MENU_LN_SQ == 1 ? params.data.LN_CNT : 1;
};

const getCellClass = (params) => {
    return params.data.MENU_LN_SQ == 1 ? 'rowSpan' : 'notRowSpan';
};

const getCellClassCenter = (params) => {
    return params.data.MENU_LN_SQ == 1 ? 'rowSpan centered' : 'notRowSpan';
};


const selectCol = [{
    headerCheckboxSelection: true,
    checkboxSelection: true,
    showDisabledCheckboxes: true,
    width: 50,
    sortable: false,
    pinned: 'left',
    rowSpan: getRowSpan,
    cellClass: getCellClass
}];

const constColum = [
    { headerName: '전표생성단위코드',     field: 'slipCrtUnitCd', width: 160, rowSpan: getRowSpan, cellClass: getCellClassCenter, valueFormatter: (params) => sttlLib.formatCdNm(params, slipCrtUnitCdList)},
    { headerName: '거래처ID',             field: 'dlngPlcId', width: 90, rowSpan: getRowSpan, cellClass: getCellClass},
    { headerName: '거래처명',             field: 'dlngPlcNm', width: 160, rowSpan: getRowSpan, cellClass: getCellClass},
    { headerName: '거래처사업자등록번호', field: 'dlngPlcBrn', width: 160, rowSpan: getRowSpan, cellClass: getCellClass, valueFormatter: (params) => sttlLib.formatBrm(params.value)},
    { headerName: 'ERP거래처코드',        field: 'accuDlngPlcCd', rowSpan: getRowSpan, cellClass: getCellClass},
    { headerName: '전표일자',             field: 'slipDate', width: 100, valueFormatter: sttlLib.formatDate, rowSpan: getRowSpan, cellClass: getCellClass},
    { headerName: '전표번호',             field: 'slipNo', width: 90, rowSpan: getRowSpan, cellClass: getCellClassCenter},
    { headerName: '회계단위',             field: 'IN_DIV_CD', width: 90 },
    { headerName: '작성일자',             field: 'MENU_DT', width: 100, valueFormatter: sttlLib.formatDate },
    { headerName: '작성번호',             field: 'MENU_SQ', width: 90, cellClass: 'align-center' },
    { headerName: '라인순번',             field: 'MENU_LN_SQ', width: 90, cellClass: 'align-right' },
    { headerName: '품의내역',             field: 'ISU_DOC', width: 200 },
    { headerName: '전표유형',             field: 'DOCU_TY_NM', width: 90 },
    { headerName: '차대구분',             field: 'DRCR_FG_NM', width: 90 },
    { headerName: '계정과목',             field: 'ACCT_CD_NM', width: 200 },
    { headerName: '거래처',               field: 'TR_CD', width: 90, cellClass: 'align-center' },
    { headerName: '거래처명',             field: 'TR_NM', width: 150 },
    { headerName: '계정금액',             field: 'ACCT_AM', width: 90, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '적요',                 field: 'RMK_DC', width: 200 },
    { headerName: '부가세사업장',         field: 'VAT_DIV_CD', width: 120 },
    { headerName: '부가세신고기준일',     field: 'ISS_DT', width: 150 },
    { headerName: '세무구분',             field: 'TAX_FG_NM', width: 90 },
    { headerName: '공급가액',             field: 'SUP_AM', width: 90, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '전자세금계산서여부',   field: 'JEONJA_YN_NM', width: 150 },
    { headerName: '사용부서',             field: 'CT_DEPT', width: 150 },
    { headerName: '요청일',               field: 'REQ_DT', width: 90 },
    { headerName: '종료일',               field: 'END_DT', width: 90 },

    { headerName: '파일생성일시',         field: 'slipCrtDt', rowSpan: getRowSpan, cellClass: getCellClass},
    { headerName: '파일명',               field: 'slipFlNm', rowSpan: getRowSpan, cellClass: getCellClass},
    { headerName: '다운로드여부',         field: 'dwnlYn', rowSpan: getRowSpan, cellClass: getCellClass},
    { headerName: '다운로드일시',         field: 'dwnlDt', rowSpan: getRowSpan, cellClass: getCellClass},
    { headerName: '다운로드사용자',       field: 'dwnlUsrId', rowSpan: getRowSpan, cellClass: getCellClass}
];

const initColum = ref([]);

const MAX_ITEM = 30;
const DEFAULT_WIDTH = 130;

const initColumInitialize = () => {
    initColum.value = _.clone(constColum);
};

initColumInitialize();

const state = reactive({
    //테이블데이터
    tableColum_c: [...selectCol, ...initColum.value],
    filterCoulm: [],
    rowData: [],
    defaultColDef: {
        sortable: false,
        filter: false,
        resizable: true,
        width: DEFAULT_WIDTH
    },
    gridApi: null,
    gridColumApi: null,
    openMore: false,
    list: [],
    pagesize: 50,
    isTextReadOnly: true,
    mskgnRlsYn: true,
    mskgnTried: false // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
});

const formData = reactive({
    slipBgnDate: '',
    slipEndDate: '',
    sttlEps: 1,
    slipCrtUnitCd: '',
    dwnlYn: '',
    dateSearchType: '',
    searchDate: '',
    memberSearchType: '',
    dwnlUsrId: '',
    dwnlUsrIdNm: '',
    dlngPlcId: '',
    dlngPlcIdNm: '',
    accuDlngPlcCd: '',
    accuDlngPlcCdNm: '',
    slipNo: '',

    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),
        sttlCyclCd: sttlCyclCd,
        slipBgnDate: computed(() => dayJS(formData.slipBgnDate).format('YYYYMMDD')),
        slipEndDate: computed(() => dayJS(formData.slipEndDate).format('YYYYMMDD')),
        sttlEps: computed(() => formData.sttlEps),
        slipCrtUnitCd: computed(() => formData.slipCrtUnitCd),
        dwnlYn: computed(() => formData.dwnlYn),
        slipCrtDate: computed(() => formData.dateSearchType == 'slipCrtDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        dwnlDate: computed(() => formData.dateSearchType == 'dwnlDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        dwnlUsrId: computed(() => formData.dwnlUsrId),
        dlngPlcId: computed(() => formData.dlngPlcId),
        accuDlngPlcCd: computed(() => formData.accuDlngPlcCd),
        slipNo: computed(() => formData.slipNo),
        mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
    },
    url: '/common/api/v1/instl/slip/listExcel'
});

onMounted(() => {
    initCodeList().then(
        (res) => {
            resetTable();
            getList();
        }
    );
    //마스킹 권한 확인 후 리스트조회
    emitter.$on('onChangeMskgn', onChangeMskgn);
});

// 마스킹 해제 이벤트 버스 해제
onUnmounted(() => {
    emitter.$off('onChangeMskgn');
});

// 마스킹 권한 체크
const changeMskgnRlsYn = async () => {
    if (!state.mskgnTried) {
        await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
    }
};
//마스킹 해제 처리 후 리스트 재조회 
const onChangeMskgn = async () => {
    state.mskgnRlsYn = !state.mskgnRlsYn;
    await onChangedPage(1);
    state.mskgnTried = true;
};

// 페이징 처리
const pager = reactive({
    current: 1,
    currentPageSize: 1,
    size: computed(() => state.pagesize),
    offset: computed(() => (pager.current - 1) * pager.size),
    totalCnt: 0
});

// 셀클릭 이벤트처리 함수
const cellClicked = (e) => {

};

const onCellDoubleClicked = (e) => {
    state.gridApi.deselectAll();
    e.node.setSelected(true);
};

const onChangedPage = async (pagenum) => {
    //console.log(pagenum);
    pager.current = pagenum;
    //테이블 인덱스 번호 처리
    let target = state.tableColum_c.filter(item => item.headerName === '번호');
    if (!_.isEmpty(target)) {
        target[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
    }
    //api호출
    await getList();
};

// 테이블 리사이징을 위한 참조값
const onGridReady = (params) => {
    state.gridApi = params.api;
    state.gridColumApi = params.columnApi;
};

// 체크 박스 선택시 
const onRowSelect = (e) => {
    state.selectList = state.gridApi.getSelectedRows();
};

const initParams = () => {
    fromToDateRef.value.initDate();
    dateRef.value.initDate();
    formData.slipCrtUnitCd = '';
    formData.sttlEps = 1;
    formData.dwnlYn = '';
    formData.dateSearchType = '';
    formData.searchDate = '';
    formData.memberSearchType = '';
    formData.dwnlUsrId = '';
    formData.dwnlUsrIdNm = '';
    formData.admnId = '';
    formData.dlngPlcId = '';
    formData.dlngPlcIdNm = '';
    formData.accuDlngPlcCd = '';
    formData.accuDlngPlcCdNm = '';
    formData.slipNo = '';


    state.mskgnRlsYn = true;
};

//리스트 갯수 변경 후 리스트 재 조회
const clearList = () => {
    initParams();
    onChangedPage(1);
};

const getList = async () => {
    try {
        let params = {
            size: pager.size,
            offset: pager.offset,
            sttlCyclCd: sttlCyclCd,
            sttlEps: formData.sttlEps,
            slipBgnDate: dayJS(formData.slipBgnDate).format('YYYYMMDD'),
            slipEndDate: dayJS(formData.slipEndDate).format('YYYYMMDD'),
            slipCrtUnitCd: formData.slipCrtUnitCd,
            dwnlYn: formData.dwnlYn,
            dwnlUsrId: formData.dwnlUsrId,
            dlngPlcId: formData.dlngPlcId,
            accuDlngPlcCd: formData.accuDlngPlcCd,
            slipNo: formData.slipNo,
            mskgnRlsYn: formData.mskgnRlsYn
        };
        if (!_.isEmpty(formData.dateSearchType)) {
            if (_.isDate(formData.searchDate)) {
                params[formData.dateSearchType] = dayJS(formData.searchDate).format('YYYYMMDD');
            }
        }
        
        const response = await _getInstlAcctSlipListPaging(params);

        state.rowData = response.data.data.list;
        pager.totalCnt = response.data.data.totalCnt;

        state.mskgnTried = false;
    } catch (error) {
        console.log(error);
    }
};

//검색조건에 따른 리스트 재조회
const reloadList = () => {
    state.mskgnRlsYn = true;
    onChangedPage(1);
};

//페이지당 리스트 게수 선택 옵션
const selectedOptions = (value, type) => {
    state.pagesize = value;
    onChangedPage(1);
};

// 테이블 현재창에 맞춤
const sizeToFit = () => {
    state.gridApi.sizeColumnsToFit();
};

// 컬럼 변경
const resetTable = () => {
    state.tableColum_c = _.union(selectCol, initColum.value.filter(item => !state.filterCoulm.includes(item.headerName)));
    return state.filterCoulm;
};

// 삭제할 컬럼 선택
const checkOptions = (value) => {
    state.filterCoulm = value;
};





const isOneFile = ref(false);
const onExcelDown = async (event) => {

    let selectedRows = state.gridApi.getSelectedRows();
    if (!_.isEmpty(selectedRows)) {
        //console.log(selectedRows.filter((row => row.MENU_LN_SQ === 1)).map(row => row.MENU_SQ));
        let selectedFirstRows = selectedRows.filter((row => row.MENU_LN_SQ === 1));
        let selectedDate = '';
        let searchParams = [];
        let tempSlipFlNm = '';
        let tempSearchParam = null;
        selectedFirstRows.forEach((v, i) => {
            if (selectedDate != v.slipDate || tempSlipFlNm != v.slipFlNm) {
                tempSearchParam = {
                    sttlCyclCd: sttlCyclCd,
                    slipDate: v.slipDate,
                    slipNoList: [v.MENU_SQ]
                };
                searchParams.push(tempSearchParam);
                selectedDate = v.slipDate;
                tempSlipFlNm = v.slipFlNm;
            } else {
                tempSearchParam.slipNoList.push(v.MENU_SQ);
            }
        });
        let res = null;
        if (isOneFile.value) {
            res = await _getInstlAcctSlipFile({slipMapList: searchParams});
        } else {
            for (let index = 0; index < searchParams.length; index++) {
                res = await _getInstlAcctSlipFile(searchParams[index]);
            }
        }
        if (res) {
            toast('다운로드가 완료되었습니다.', 3000, 'success');
            return getList();
        }
        
    } else {
        return messageAlert('다운로드할 항목을 선택바랍니다.');
    }
};

const messageAlert = (msg) => $Modal.alert({
    title: '안내',
    message: msg,
    buttonText: {
        ok: '확인'
    }
});

</script>
