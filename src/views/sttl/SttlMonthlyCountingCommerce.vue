<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <SettlePeriodMonth v-model:bgnYm="formData.sttlBgnYm" v-model:endYm="formData.sttlEndYm" ref="fromToDateRef"/>
                <SettleSeq v-model="formData.sttlEps" />
                <Channel v-model="formData.chnSeCd" v-model:cdList="chnSeCdList" />
                <Progress v-model="formData.odrStCd" />
                <SelectYn v-model="formData.dataVrfcErrYn">데이터검증오류여부</SelectYn>
                
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
            <!-- 상세검색 -->
            <div class="ui-data-filter-more" v-show="state.openMore">
                <div class="form-item">
                    <DateSearch v-model:dateSearchType="formData.dateSearchType" v-model:searchDate="formData.searchDate"  ref="dateRef" />
                    <TaxSe v-model="formData.txtnSeCd"  v-model:cdList="txtnSeCdList"/>
                    <BizSearch v-model:bizSearchType="formData.bizSearchType" v-model:searchBiz="formData.searchBiz"/>
                    <UserSearch v-model:mbrId="formData.mbrId" />
                </div>
                <div class="form-item">
                    <PrdSearch v-model:prdId="formData.prdId" v-model:prdNm="formData.prdNm" />
                    <TextBox v-model="formData.odrId">주문번호</TextBox>
                    <SelectYn v-model="formData.tbiPlYn">세금계산서발행여부</SelectYn>
                    <SelectYn v-model="formData.dcnYn">확정여부</SelectYn>
                    <PymtSe v-model="formData.pymtSeCd" />
                </div>
            </div>
        </div>
        <!-- 테이블 -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn()"
                        :disabled="!state.mskgnRlsYn || state.mskgnTried">
                        마스킹해제
                    </button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
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
                    :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked" :getRowClass="getRowClass"
                    @cell-double-clicked="onCellDoubleClicked" :suppressRowClickSelection="true" @selection-changed="onRowSelect" rowSelection="multiple"
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
    display: none
}
.row-data-warning {
    background-color: #db5c2166;
}
</style>
<script setup>
import { computed, reactive, inject, onMounted, onUnmounted, ref, toRaw  } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply, _getInstlCmrcMonthlyListPaging } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';
import Channel from './searchFilters/Channel.vue';
import Progress from './searchFilters/Progress.vue';
import SelectYn from './searchFilters/SelectYn.vue';
import SettleSeq from './searchFilters/SettleSeq.vue';
import DateSearch from './searchFilters/DateSearch.vue';
import BizSearch from './searchFilters/BizSearch.vue';
import PrdSearch from './searchFilters/PrdSearch.vue';
import UserSearch from './searchFilters/UserSearch.vue';
import SettlePeriodMonth from './searchFilters/SettlePeriodMonth.vue';
import TextBox from './searchFilters/TextBox.vue';
import TaxSe from './searchFilters/TaxSe.vue';
import { sttlLib } from './module/sttlLib.js';
import PymtSe from './searchFilters/PymtSe.vue';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

const pymtSeCdList = ref([]);
const odrStCdList = ref([]);
const txtnSeCdList = ref([]);
const tbiPlTyCdList = ref([]);
const pyrSttlSeCdList = ref([]);

const fromToDateRef = ref(null);
const dateRef = ref(null);

const initCodeList = () => {
    let promiseTemp = [];
    // promiseTemp.push(_getCodeApply('CHN_SE_CD', chnSeCdList));
    promiseTemp.push(_getCodeApply('PYMT_SE_CD', pymtSeCdList));
    promiseTemp.push(_getCodeApply('ODR_ST_CD', odrStCdList));
    promiseTemp.push(_getCodeApply('TBI_PL_TY_CD', tbiPlTyCdList));
    promiseTemp.push(_getCodeApply('PYR_STTL_SE_CD', pyrSttlSeCdList));
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
    { headerName: '기본정보',
        marryChildren: true,
        children: [
            { headerName: '주문번호',           field: 'odrId',          width: 160 },
            { headerName: '주문상세번호',         field: 'odrDtlId',       width: 100, headerClass: 'centered', cellClass: 'centered'  },
            { headerName: '채널',               field: 'chnSeCd',        width: 60 },
            { headerName: '진행상태',           field: 'odrStCd',        width: 120, valueFormatter: (params) => sttlLib.formatCdNm(params, odrStCdList) },
            { headerName: '회원ID',             field: 'mbrId',          width: 100 },
            { headerName: '이름',               field: 'mbrNm',           width: 120},
            { headerName: '사번',               field: 'none',           width: 120, valueFormatter: (params) => '준비중..' }
        ]},
    { headerName: '페이어정보',
        marryChildren: true,
        children: [
            { headerName: '구분',          field: 'pyrSttlSeCd',          width: 120, valueFormatter: (params) => sttlLib.formatCdNm(params, pyrSttlSeCdList)  },
            { headerName: 'Payer코드',          field: 'pyrId',          width: 120 },
            { headerName: 'Payer상호',          field: 'pyrNm',           width: 120},
            { headerName: 'Payer사업자번호',    field: 'pyrBrn',           width: 130, valueFormatter: (params) => sttlLib.formatBrm(params.value)}
        ]},
    { headerName: '결제정보',
        marryChildren: true,
        children: [
            { headerName: '결제구분',           field: 'pymtSeCd',         width: 100, valueFormatter: (params) => sttlLib.formatCdNm(params, pymtSeCdList)  },
            { headerName: '결제일',           field: 'pymtDt',         width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYY-MM-DD').format('YYYY-MM-DD') },
            { headerName: '완료일',           field: 'cmplDt',         width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYY-MM-DD').format('YYYY-MM-DD') },
            { headerName: '취소일',           field: 'cnclDt',         width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYY-MM-DD').format('YYYY-MM-DD') },
            { headerName: '상품코드',           field: 'prdId',          width: 120 },
            { headerName: '상품명',             field: 'prdNm',          width: 120 },
            { headerName: '과/면세',            field: 'txtnSeCd',       width: 120, valueFormatter: (params) => sttlLib.formatCdNm(params, txtnSeCdList) },
            { headerName: '스타사용액',         field: 'starAmt',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '선스타금액(PA)',         field: 'paStarAmt',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '후스타금액(PL)',         field: 'plStarAmt',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '포인트사용액',       field: 'pntAmt',         width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '쿠폰사용액',         field: 'cpnAmt',         width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '쿠폰입점사부담액',   field: 'encmpBdnCpnAmt', width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '쿠폰유통사부담액',   field: 'dstbrBdnCpnAmt', width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '고객결제금액',       field: 'cstPymtAmt',     width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '고객결제공급가액',   field: 'cstPymtSpvl',    width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '고객결제부가세액',       field: 'cstPymtVat',     width: 120, cellClass: 'align-right', valueFormatter: formatMoney }
        ]},
    { headerName: '판매정보',
        marryChildren: true,
        children: [
            { headerName: '판매액',             field: 'saleAmt',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '판매공급가액',       field: 'saleSpvl',       width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '판매세액',           field: 'saleVat',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney }
        ]},
    { headerName: '셀러정보',
        marryChildren: true,
        children: [
            { headerName: 'Seller코드',         field: 'selrId',         width: 120 },
            { headerName: 'Seller상호',         field: 'selrNm',           width: 120 },
            { headerName: 'Seller사업자번호',   field: 'selrBrn', width: 160, valueFormatter: (params) => sttlLib.formatBrm(params.value)},
            { headerName: '상품수수료율',       field: 'encmpFeeRt',     width: 120, cellClass: 'align-right', valueFormatter: formatMoney }
        ]},
    { headerName: '정산정보',
        marryChildren: true,
        children: [
            { headerName: '정산액',             field: 'purSttlAmt',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '정산공급가액',       field: 'purSttlSpvl',       width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '정산세액',           field: 'purSttlVat',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney }
        ]},
    { headerName: '검증정보',
        marryChildren: true,
        children: [
            { headerName: '데이터검증오류여부', field: 'dataVrfcErrYn',  width: 120 },
            { headerName: '데이터검증오류내용', field: 'dataVrfcErrCts',  width: 700, wrapText: true, autoHeight: true,  cellRenderer: (param) => _.replace(param.value, /\r\n/g, '<br/>') }
        ]},
    { headerName: '확정정보',
        marryChildren: true,
        children: [
            { headerName: '확정여부',           field: 'dcnYn',          width: 120 },
            { headerName: '확정일시',           field: 'dcnDt',          width: 120 },
            { headerName: '확정자ID',           field: 'dcnMnId',        width: 120 },
            { headerName: '확정자명', field: 'dcnMnNm',  width: 120 }
        ]},
    { headerName: '계산서정보',
        marryChildren: true,
        children: [
            { headerName: '발행여부',           field: 'tbiPlYn',          width: 120 },
            { headerName: '발행유형',           field: 'tbiPlTyCd',          width: 120, valueFormatter: (params) => sttlLib.formatCdNm(params, tbiPlTyCdList) },
            { headerName: '발행일',           field: 'tbiPlDate',        width: 120 },
            { headerName: '발행금액', field: 'tbiPlAmt',  width: 120 },
            { headerName: '공급가액',           field: 'tbiPlSpvl',    width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '부가가치세',           field: 'tbiPlVat',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '국세청세금계산서번호',       field: 'ntsTbiNo',       width: 120}
        ]
    }
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
    tableColum_c: [...initColum.value],
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
    pymtSeCd:'',
    chnSeCd: '',
    odrStCd: '',
    dataVrfcErrYn: '',
    searchDateType: '',
    searchDate: '',
    bizSearchType: '',
    searchBiz: '',
    txtnSeCd: '',
    pyrId: '',
    selrId: '',
    mbrId: '',
    prdId: '',
    prdNm: '',
    odrId: '',
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
        chnSeCd: computed(() => formData.chnSeCd),
        prdId: computed(() => formData.prdId),
        prdNm: computed(() => formData.prdNm),
        txtnSeCd: computed(() => formData.txtnSeCd),
        odrStCd: computed(() => formData.odrStCd),
        dcnYn: computed(() => formData.dcnYn),
        pymtSeCd: computed(() => formData.pymtSeCd),
        pymtDate: computed(() => formData.dateSearchType == 'pymtDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        cmplDate: computed(() => formData.dateSearchType == 'cmplDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        cnclDate: computed(() => formData.dateSearchType == 'cnclDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        dcnDate: computed(() => formData.dateSearchType == 'dcnDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        pyrId: computed(() => (formData.bizSearchType == 'pyrId' && (!_.isEmpty(formData.searchBiz) || _.isNumber(formData.searchBiz)) ? formData.searchBiz : '')),
        selrId: computed(() => (formData.bizSearchType == 'selrId' && (!_.isEmpty(formData.searchBiz) || _.isNumber(formData.searchBiz)) ? formData.searchBiz : '')),
        odrId: computed(() => formData.odrId),
        mbrId: computed(() => formData.mbrId),
        tbiPlYn: computed(() => formData.tbiPlYn),
        dataVrfcErrYn: computed(() => formData.dataVrfcErrYn),
        mskgnRlsYn: computed(() => formData.mskgnRlsYn)
    },
    url: '/common/api/v1/instl/cmrc/mtly/listExcel'
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
    formData.dateSearchType = '';
    formData.searchDate = '';
    formData.sttlEps = 1;
    formData.chnSeCd = '';
    formData.pymtSeCd = '';
    formData.bizSearchType = '';
    formData.searchBiz = '';
    formData.searchBizNm = '';
    formData.pyrId = '';
    formData.selrId = '';
    formData.mbrId = '';
    formData.prdId = '';
    formData.prdNm = '';
    formData.txtnSeCd = '';
    formData.odrStCd = '';
    formData.tbiPlYn = '';
    formData.dcnYn = '';
    formData.odrId = '';
    formData.dataVrfcErrYn = '';

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
            chnSeCd: formData.chnSeCd,
            pymtSeCd: formData.pymtSeCd,
            prdId: formData.prdId,
            prdNm: formData.prdNm,
            txtnSeCd: formData.txtnSeCd,
            odrStCd: formData.odrStCd,
            dcnYn: formData.dcnYn,
            mbrId: formData.mbrId,
            odrId: formData.odrId,
            tbiPlYn: formData.tbiPlYn,
            dataVrfcErrYn: formData.dataVrfcErrYn,
            mskgnRlsYn: formData.mskgnRlsYn
        };
        if (!_.isEmpty(formData.dateSearchType)) {
            if (_.isDate(formData.searchDate)) {
                params[formData.dateSearchType] = dayJS(formData.searchDate).format('YYYYMMDD');
            }
        }

        if (!_.isEmpty(formData.bizSearchType)) {
            if (!_.isEmpty(formData.searchBiz) || _.isNumber(formData.searchBiz)) {
                params[formData.bizSearchType] = formData.searchBiz;
            }
        }

        if (formData.searchBiz && _.isEmpty(formData.bizSearchType)) {
            params['pyrId'] = formData.searchBiz;
            params['selrId'] = formData.searchBiz;
        }
        
        const response = await _getInstlCmrcMonthlyListPaging(params);

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
    state.tableColum_c = _.union(initColum.value.filter(item => !state.filterCoulm.includes(item.headerName)));
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
