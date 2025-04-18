<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <SettlePeriodMonth v-model:bgnYm="formData.sttlBgnYm" v-model:endYm="formData.sttlEndYm" ref="fromToDateRef" />
                <SettleSeq v-model="formData.sttlEps" />
                <DateSearch v-model:dateSearchType="formData.dateSearchType" v-model:searchDate="formData.searchDate"  ref="dateRef" >
                    <option value="dlngDate">거래일자</option>
                    <option value="accuDate">회계일자</option>
                    <option value="tbiPlDate">세금계산서발행일자</option>
                    <option value="dwnlDate">전표다운로드일자</option>
                </DateSearch>
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
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <Channel v-model="formData.chnSeCd" />
                    <DlngType v-model="formData.dlngTyCd" :sttlCyclCd="sttlCyclCd"/>
                    <SlipType v-model="formData.slipTyCd" :sttlCyclCd="sttlCyclCd"/>
                    <TaxSe v-model="formData.txtnSeCd"/>
                    <DrCrSe v-model="formData.drcrSeCd"/>
                    <SlipCrtUnit v-model="formData.slipCrtUnitCd" :sttlCyclCd="sttlCyclCd"/>
                    
                </div>
                <div class="form-item">
                    <AccdSearch v-model="formData.accd"  />
                    <UserSearch v-model:mbrId="formData.mbrId"  />
                    <BizSearch no-biz-options v-model:searchBiz="formData.dlngPlcId" />
                    
                </div>
                <div class="form-item">
                    <ErpTrSearch v-model="accuDlngPlcCd" />
                    <MultiSearch v-model:searchType="formData.searchType" v-model="formData.searchText" />
                    <SelectYn v-model="formData.dcnYn">확정여부</SelectYn>
                    <SelectYn v-model="formData.dwnlYn">전표다운로드여부</SelectYn>
                </div>
            </div>
        </div>
        <!-- 테이블 -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <SttlMonthlyAccountingConfirmPopup @confirm="getList"/>
                    <SttlMonthlyAccountingGeneratePopup @create="getList"/>
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
    </section>
    <SttlMonthlyAccountingEditDatePopup />
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
import { computed, reactive, inject, onMounted, onUnmounted, ref  } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply, _getInstlAccuPrJnlzListPaging } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';
import Channel from './searchFilters/Channel.vue';
import DlngType from './searchFilters/DlngType.vue';
import SlipType from './searchFilters/SlipType.vue';
import TaxSe from './searchFilters/TaxSe.vue';
import DrCrSe from './searchFilters/DrCrSe.vue';
import SlipCrtUnit from './searchFilters/SlipCrtUnit.vue';
import SettleSeq from './searchFilters/SettleSeq.vue';
import DateSearch from './searchFilters/DateSearch.vue';
import ErpTrSearch from './searchFilters/ErpTrSearch.vue';
import AccdSearch from './searchFilters/AccdSearch.vue';
import UserSearch from './searchFilters/UserSearch.vue';
import SttlMonthlyAccountingEditDatePopup from './SttlMonthlyAccountingEditDatePopup.vue';
import SttlMonthlyAccountingConfirmPopup from './SttlMonthlyAccountingConfirmPopup.vue';
import SttlMonthlyAccountingGeneratePopup from './SttlMonthlyAccountingGeneratePopup.vue';
import SettlePeriodMonth from './searchFilters/SettlePeriodMonth.vue';
import MultiSearch from './searchFilters/MultiSearch.vue';
import SelectYn from './searchFilters/SelectYn.vue';
import BizSearch from './searchFilters/BizSearch.vue';
import { sttlLib } from './module/sttlLib';

const slipTyCdList = ref([]);
const dlngTyCdList = ref([]);
const slipCrtUnitCdList = ref([]);
const txtnSeCdList = ref([]);
const drcrSeCdList = ref([]);

const sttlCyclCd = 'M';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);



const fromToDateRef = ref(null);
const dateRef = ref(null);

const initCodeList = async () => {
    let promiseTemp = [];
    promiseTemp.push(_getCodeApply('SLIP_TY_CD', slipTyCdList));
    promiseTemp.push(_getCodeApply('DLNG_TY_CD', dlngTyCdList));
    promiseTemp.push(_getCodeApply('SLIP_CRT_UNIT_CD', slipCrtUnitCdList));
    promiseTemp.push(_getCodeApply('TXTN_SE_CD', txtnSeCdList));
    promiseTemp.push(_getCodeApply('DRCR_SE_CD', drcrSeCdList));
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

const formatCdNm = (params, codeList) => {
    let findedRow = codeList.value.filter(o => o.cd == params.value);
    if (_.isEmpty(findedRow)) {
        return params.value;
    } else {
        return findedRow[0].cd + ' : ' + findedRow[0].nm;
    }
};

const selectCol = [{ headerCheckboxSelection: true, headerName: '', field: 'checkbox', checkboxSelection: true, maxWidth: 50, sortable: false}];
const constColum = [
    {headerName: '기본정보',
        marryChildren: true,
        children: [
            { headerName: '정산년월',             field: 'sttlYm',       width: 100 },
            { headerName: '정산회차',           field: 'sttlEps',         width: 90, headerClass: 'centered', cellClass: 'centered' },
            { headerName: '거래유형코드',            field: 'dlngTyCd',       valueFormatter: (params) => formatCdNm(params, dlngTyCdList) },
            { headerName: '전표유형코드',            field: 'slipTyCd',       valueFormatter: (params) => formatCdNm(params, slipTyCdList) }
        ]},
    {headerName: '거래정보',
        marryChildren: true,
        children: [
            { headerName: '거래일자',                field: 'dlngDate',       width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
            { headerName: '회계일자',                field: 'accuDate',       width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
            { headerName: '채널',                   field: 'chnSeCd',        width: 60 },
            { headerName: '주문번호',                  field: 'odrId'          },
            { headerName: '주문상세번호',              field: 'odrDtlId'       },
            { headerName: '승인번호',                field: 'cardAprvNo'     },
            { headerName: '회원번호',                  field: 'mbrId'          },
            { headerName: '회원명',                  field: 'mbrIdNm'        },
            { headerName: '거래처번호',                field: 'dlngPlcId'      },
            { headerName: '거래처상호',                field: 'dlngPlcNm'      },
            { headerName: '거래처사업자등록번호',    field: 'dlngPlcBrn', width: 160, valueFormatter: (params) => sttlLib.formatBrm(params.value)     },
            { headerName: '과세구분',                field: 'txtnSeCd',  valueFormatter: (params) => formatCdNm(params, txtnSeCdList) }
        ]},
    {headerName: '분개정보',
        marryChildren: true,
        children: [
            { headerName: '분개라인',                field: 'accuPrJnlzSn',   width: 90, cellClass: 'align-right' },
            { headerName: '차대구분',                field: 'drcrSeCd',  valueFormatter: (params) => formatCdNm(params, drcrSeCdList) },
            { headerName: '계정코드',                field: 'accd'           },
            { headerName: '계정코드명',              field: 'accdNm'         },
            { headerName: '차변금액',                field: 'drAmt',          cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '대변금액',                field: 'crAmt',          cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '공급가액',                field: 'spvl',           cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: 'ERP거래처코드',           field: 'accuDlngPlcCd',  width: 120 },
            { headerName: 'ERP거래처명',             field: 'accuDlngPlcCdNm'},
            { headerName: '전표생성단위코드',        field: 'slipCrtUnitCd',  valueFormatter: (params) => formatCdNm(params, slipCrtUnitCdList) }
        ]},
    {headerName: '확정정보',
        marryChildren: true,
        children: [
            { headerName: '확정여부',     field: 'dcnYn'        },
            { headerName: '확정일시',     field: 'dcnDt',        width: 145 },
            { headerName: '확정자',     field: 'dcnMnNm'      }
        ]},
    {headerName: '계산서정보',
        marryChildren: true,
        children: [
            { headerName: '발행유형',                field: 'tbiPlTyCd',         width: 90 },
            { headerName: '발행일자',                field: 'tbiPlDate',         width: 90 },
            { headerName: '국세청세금계산서번호',        field: 'ntsTbiNo' }
        ]},
    {headerName: 'ERP정보',
        marryChildren: true,
        children: [
            { headerName: '전표일자',                field: 'slipDate',         width: 90 },
            { headerName: '전표번호',                field: 'slipNo',         width: 90 },
            { headerName: '전표다운로드일자',        field: 'dwnlDt',         valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
            { headerName: '전표다운로드사용자',    field: 'dwnlUsrNm'      }
        ]}

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
    dateSearchType: '',
    searchDate: '',
    chnSeCd: '',
    dlngTyCd: '',
    slipTyCd: '',
    txtnSeCd: '',
    drcrSeCd: '',
    slipCrtUnitCd: '',
    accd: '',
    mbrId: '',
    dlngPlcId: '',
    accuDlngPlcCd: '',
    searchType: '',
    searchText: '',
    dcnYn: '',
    dwnlYn: '',
    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),
        sttlCyclCd: sttlCyclCd,
        sttlBgnYm: computed(() => formData.sttlBgnYm),
        sttlEndYm: computed(() => formData.sttlEndYm),
        dlngDate: computed(() => formData.dateSearchType == 'dlngDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        accuDate: computed(() => formData.dateSearchType == 'accuDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        tbiPlDate: computed(() => formData.dateSearchType == 'tbiPlDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        dwnlDate: computed(() => formData.dateSearchType == 'dwnlDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        chnSeCd: computed(() => formData.prchnSeCddId),
        dlngTyCd: computed(() => formData.dlngTyCd),
        slipTyCd: computed(() => formData.slipTyCd),
        txtnSeCd: computed(() => formData.txtnSeCd),
        drcrSeCd: computed(() => formData.drcrSeCd),
        slipCrtUnitCd: computed(() => formData.slipCrtUnitCd),
        accd: computed(() => formData.accd),
        mbrId: computed(() => formData.mbrId),
        dlngPlcId: computed(() => formData.dlngPlcId),
        accuDlngPlcCd: computed(() => formData.accuDlngPlcCd),
        odrId: computed(() => (formData.searchType == 'odrId' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        slipNo: computed(() => (formData.searchType == 'slipNo' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        dcnYn: computed(() => formData.dcnYn),
        dwnlYn: computed(() => formData.dwnlYn),

        mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
    },
    url: '/common/api/v1/instl/accuPrJnlz/listExcel'
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
    formData.sttlEps = 1;
    formData.dateSearchType = '';
    formData.chnSeCd = '';
    formData.dlngTyCd = '';
    formData.slipTyCd = '';
    formData.txtnSeCd = '';
    formData.drcrSeCd = '';
    formData.slipCrtUnitCd = '';
    formData.accd = '';
    formData.mbrId = '';
    formData.dlngPlcId = '';
    formData.accuDlngPlcCd = '';
    formData.searchType = '';
    formData.searchText = '';
    formData.dcnYn = '';
    formData.dwnlYn = '';
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
            sttlBgnYm: formData.sttlBgnYm,
            sttlEndYm: formData.sttlEndYm,
            sttlEps: formData.sttlEps,
            chnSeCd: formData.chnSeCd,
            dlngTyCd: formData.dlngTyCd,
            slipTyCd: formData.slipTyCd,
            txtnSeCd: formData.txtnSeCd,
            drcrSeCd: formData.drcrSeCd,
            slipCrtUnitCd: formData.slipCrtUnitCd,
            accd: formData.accd,
            mbrId: formData.mbrId,
            dlngPlcId: formData.dlngPlcId,
            accuDlngPlcCd: formData.accuDlngPlcCd,
            dcnYn: formData.dcnYn,
            dwnlYn: formData.dwnlYn,
            mskgnRlsYn: formData.mskgnRlsYn
        };
        if (!_.isEmpty(formData.dateSearchType)) {
            if (_.isDate(formData.searchDate)) {
                params[formData.dateSearchType] = dayJS(formData.searchDate).format('YYYYMMDD');
            }
        }

        if (!_.isEmpty(formData.searchType)) {
            if (!_.isEmpty(formData.searchText)) {
                params[formData.searchType] = formData.searchText;
            }
        }
        
        const response = await _getInstlAccuPrJnlzListPaging(params);

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
    state.tableColum_c = _.union( initColum.value.filter(item => !state.filterCoulm.includes(item.headerName)));
    return state.filterCoulm;
};

// 삭제할 컬럼 선택
const checkOptions = (value) => {
    state.filterCoulm = value;
};





</script>
