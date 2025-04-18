<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <SettlePeriodMonth v-model:bgnYm="formData.sttlBgnYm" v-model:endYm="formData.sttlEndYm" ref="fromToDateRef" />
                <SettleSeq v-model="formData.sttlEps" />
                <StarRsSt v-model="formData.starRsStCd" v-model:cdList="starRsStCdList"/>
                
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
            </div>
            <div class="ui-data-filter-more" v-show="state.openMore">
                <div class="form-item">
                    <DateSearch v-model:dateSearchType="formData.dateSearchType" v-model:searchDate="formData.searchDate"  ref="dateRef" >
                        <option value="tbiPlDate">발행일자</option>
                        <option value="ntsFrwDate">국세청전송일자</option>
                    </DateSearch>
                    <StarSttlSelect v-model="formData.starSttlSeCd" sttlCyclCd="90"/>
                    <SelectYn v-model="formData.tbiPlYn">세금계산서발행여부</SelectYn>
                    <SelectYn v-model="formData.dcnYn">확정여부</SelectYn>
                </div>
                <div class="form-item">
                    <BizSearch no-biz-options v-model:searchBiz="formData.pyrId" bizSearchType="pyrId"/>
                    <TextBox v-model="formData.tbiNo" >청구서번호</TextBox>
                    <TextBox v-model="formData.ntsTbiNo" >국세청세금계산서번호</TextBox>
                    <NtsRslt v-model="formData.ntsRsltCd" />
                    
                    
                </div>
            </div>
        </div>
        <div class="ui-section">
            <!-- 테이블 -->
            <div class="tbl-wrap">
                <div class="table-util flex space-between">
                    <div class="btn-set-m flex">
                        <div class="btn-set-m flex">
                            <SttlMonthlyBillButton :selectedList="state.selectList" @publish="getList"/>
                            <SttlMonthlyBillConfirmButton :selectedList="state.selectList" @publish="getList"/>
                            <SttlMonthlyBillTaxButton :selectedList="state.selectList" @publish="getList" />
                            <SttlMonthlyBillSendPopbillButton :selectedList="state.selectList" @publish="getList"/>
                        </div>
                        <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn()"
                            :disabled="!state.mskgnRlsYn || state.mskgnTried">
                            마스킹해제
                        </button>
                    </div>
                    <div class="btn-set-m flex align-end">
                        <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                        <button type="button" class="btn btn-opt"
                            @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
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
                        :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked" :getRowClass="getRowClass"
                        @cell-double-clicked="onCellDoubleClicked" :suppressRowClickSelection="true" @selection-changed="onRowSelect" rowSelection="multiple"
                        class="ag-theme-alpine" domLayout="autoHeight">
                    </AgGridVue>
                    <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                        @changedPage="onChangedPage" />
                </template>
            </div>
        </div>
    </section>
</template>
<style>
.align-right {
	text-align: right;
}
.ag-body-horizontal-scroll-viewport {
    display: none
}
.row-data-warning {
    background-color: #db5c2166;
}
.table.list th.th-g {
    background-color: #E4EBF5;
}
.table.list th {
    padding: 13px 12px 12px;
    background-color: var(--base-bg-color);
    text-align: center;
}
.table thead th {
    position: relative;
    background-color: var(--base-bg-color);
    border-top: none;
    border-bottom: none;
    font-weight: bold;
    font-size: 12px;
    color: #222;
    vertical-align: middle;
}
</style>
<script setup>
import { getCurrentInstance, computed, reactive, inject, onMounted, onUnmounted, ref, watchEffect, watch, toDisplayString, h  } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply, _getInstlMonthlyStarRslist } from '@/api/sttl.js';
import SttlMonthlyBillDetailPopup from './SttlMonthlyBillDetailPopup.vue';
import SttlMonthlyBillTaxButton from './SttlMonthlyBillTaxButton.vue';
import SttlMonthlyBillSendPopbillButton from './SttlMonthlyBillSendPopbillButton.vue';
import SttlSelectBox from './component/SttlSelectBox.vue';
import SettleSeq from './searchFilters/SettleSeq.vue';
import StarRsSt from './searchFilters/StarRsSt.vue';
import BizSearch from './searchFilters/BizSearch.vue';
import SettlePeriodMonth from './searchFilters/SettlePeriodMonth.vue';
import DateSearch from './searchFilters/DateSearch.vue';
import TextBox from './searchFilters/TextBox.vue';
import SelectYn from './searchFilters/SelectYn.vue';
import NtsRslt from './searchFilters/NtsRslt.vue';
import { sttlLib } from './module/sttlLib';
import SttlMonthlyBillButton from './SttlMonthlyBillButton.vue';
import SttlMonthlyBillConfirmButton from './SttlMonthlyBillConfirmButton.vue';
import StarSttlSelect from './searchFilters/StarSttlSelect.vue';



const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

const starRsStCdList = ref([]);

const fromToDateRef = ref(null);
const dateRef = ref(null);

const initCodeList = () => {
    let promiseTemp = [];
    // promiseTemp.push(_getCodeApply('CHN_SE_CD', starRsStCdList));
    
    return Promise.all(promiseTemp);
};

const dateFormat = 'yyyy-MM-dd';
const formatMoney = (params) => {
    return _.replace(params.value, /(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
const getRowClass = (params) => {
    if (params.node.data.dataVrfcErrYn === 'Y') {
        return 'row-data-warning';
    }
};

const selectCol = [{ headerCheckboxSelection: true, headerName: '', field: 'checkbox', checkboxSelection: true, maxWidth: 50, sortable: false}];
const constColum = [
    { headerName: '정산년월',             field: 'sttlYm',       width: 100 },
    { headerName: '정산회차',           field: 'sttlEps',         width: 90, headerClass: 'centered', cellClass: 'centered' },
    { headerName: '페이어',
        marryChildren: true,
        children: [
            { headerName: '페이어ID',         field: 'pyrId',       width: 100, cellRenderer: SttlMonthlyBillDetailPopup, cellRendererParams: (params) => { return {...params, getList}; }},
            { headerName: '페이어명',         field: 'pyrNm',       width: 100 }
        ]
    },
    { headerName: '후불사용형스타(PL)',
        marryChildren: true,
        children: [
            { headerName: '공급가액',          field: 'plSpvl',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '부가세',          field: 'plVat',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '총액',          field: 'plDlngAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney}
        ]},
    { headerName: '후불등록형스타(PR)',
        marryChildren: true,
        children: [
            { headerName: '공급가액',          field: 'prSpvl',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '부가세',          field: 'prVat',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '총액',          field: 'prDlngAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney}
        ]},
    { headerName: '정산내역',
        marryChildren: true,
        children: [
            { headerName: '공급가액',          field: 'spvl',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '부가세',          field: 'vat',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '총액',          field: 'dlngAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney}
        ]},
    { headerName: '구매상품건수',             field: 'prdCnt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '구매임직원수',             field: 'mbrCnt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '스타청구상태',             field: 'starRsStCd',          width: 120, valueFormatter: (params) => sttlLib.formatCdNm(params, starRsStCdList) },
    { headerName: '발행일자',           field: 'tbiPlDate',         width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYY-MM-DD').format('YYYY-MM-DD') },
    { headerName: '청구서번호',             field: 'tbiNo',          width: 120, cellClass: 'align-right' },
    { headerName: '국세청세금계산서번호',     field: 'ntsTbiNo',          width: 120, cellClass: 'align-right' },
    { headerName: '국세청결과',             field: 'ntsRsltcd',          width: 120, cellClass: 'align-right' },
    { headerName: '국세청전송일시',           field: 'ntsfrwDt',         width: 120, cellClass: 'align-right' }
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
        sortable: true,
        filter: false,
        resizable: true,
        width: 150
    },
    gridApi: null,
    gridColumApi: null,
    openMore: false,
    list: [],
    pagesize: 50,
    mskgnRlsYn: true,
    mskgnTried: false // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
});

const formData = reactive({
    sttlBgnYm: '',
    sttlEndYm: '',
    sttlEps: 1,
    starRsStCd: '',
    dateSearchType: '',
    searchDate: '',
    starSttlSeCd: '',
    pyrId: '',
    tbiNo: '',
    ntsTbiNo: '',
    ntsRsltCd: '',
    tbiPlYn: '',
    dcnYn: '',
    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),
        sttlBgnYm: computed(() => formData.sttlBgnYm),
        sttlEndYm: computed(() => formData.sttlEndYm),
        sttlEps: computed(() => formData.sttlEps),
        starRsStCd: computed(() => formData.starRsStCd),
        starSttlSeCd: computed(() => formData.starSttlSeCd),
        pyrId: computed(() => formData.pyrId),
        tbiNo: computed(() => formData.tbiNo),
        ntsTbiNo: computed(() => formData.ntsTbiNo),
        ntsRsltCd: computed(() => formData.ntsRsltCd),
        tbiPlYn: computed(() => formData.tbiPlYn),
        dcnYn: computed(() => formData.dcnYn),
        tbiPlDate: computed(() => formData.dateSearchType == 'tbiPlDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        ntsFrwDate: computed(() => formData.dateSearchType == 'ntsFrwDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        mskgnRlsYn: computed(() => formData.mskgnRlsYn)
    },
    url: '/common/api/v1/instl/mtlyStar/rslistExcel'
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
    console.log(e);
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
    formData.dateSearchType = '';
    formData.sttlEps = 1;
    formData.starRsStCd = '';
    formData.starSttlSeCd = '';
    formData.pyrId = '';
    formData.tbiNo = '';
    formData.ntsTbiNo = '';
    formData.ntsRsltCd = '';
    formData.tbiPlYn = '';
    formData.dcnYn = '';
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
            sttlBgnYm: formData.sttlBgnYm,
            sttlEndYm: formData.sttlEndYm,
            sttlEps: formData.sttlEps,
            starRsStCd: formData.starRsStCd,
            starSttlSeCd: formData.starSttlSeCd,
            pyrId: formData.pyrId,
            tbiNo: formData.tbiNo,
            ntsTbiNo: formData.ntsTbiNo,
            ntsRsltCd: formData.ntsRsltCd,
            tbiPlYn: formData.tbiPlYn,
            dcnYn: formData.dcnYn,
            mskgnRlsYn: formData.mskgnRlsYn
        };
        if (!_.isEmpty(formData.dateSearchType)) {
            if (_.isDate(formData.searchDate)) {
                params[formData.dateSearchType] = dayJS(formData.searchDate).format('YYYYMMDD');
            }
        }
        
        const response = await _getInstlMonthlyStarRslist(params);

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

const confirmRow = () => {
    $Modal.alert({
        title: '확인',
        message: '구현중 입니다.',

        buttonText: {
            ok: '확인'
        }
    });
};

</script>
