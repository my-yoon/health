<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <SettlePeriodMonth v-model:bgnYm="formData.sttlBgnYm" v-model:endYm="formData.sttlEndYm" ref="fromToDateRef" />
                <SettleSeq v-model="formData.sttlEps" />
                <Channel v-model="formData.chnSeCd" />
                <BizSearch no-biz-options v-model:searchBiz="formData.selrId" bizSearchType="selrId"/>
                <SelectYn v-model="formData.dcnYn">확정여부</SelectYn>
                
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList">
                        <span class="ico-search"></span>조회</button>
                    <button type="button" class="btn btn-sm" @click="clearList">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <!-- <button type="button" class="btn btn-sm" @click="state.openMore = !state.openMore">
                        <span class="txt">상세검색 열기</span>
                    </button> -->
                </div>
            </div>
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <BizSearch v-model:bizSearchType="formData.bizSearchType" v-model:searchBizNm="formData.searchBizNm"  v-model:searchBiz="formData.searchBiz"/>

                </div>
                
            </div>
        </div>
        <div class="ui-section">
            <div class="ui-title-3">
                <h3>매입집계</h3>
            </div>
            <div class="ui-content">
                <div class="table-list">
                    <table class="table list">
                        <colgroup>
                            <!-- <col style="width: auto"> -->
                        </colgroup>
                        <thead>
                            <tr>
                                <th colspan="3" class="th-g">총매입</th>
                                <th rowspan="2" class="th-g">매입금액</th>
                                <th rowspan="2" class="th-g">패널티매입금액</th>
                                <th rowspan="2" class="th-g">판매금액</th>
                                <th rowspan="2" class="th-g">고객결제금액</th>
                                <th colspan="2" class="th-g">스타</th>
                                <th rowspan="2" class="th-g">포인트</th>
                                <th colspan="2" class="th-g">쿠폰</th>
                                <th rowspan="2" class="th-g">마일리지부채</th>
                                <th rowspan="2" class="th-g">마일리지비용</th>
                                <th rowspan="2" class="th-g">프로모션금액</th>
                            </tr>
                            <tr>
                                <th class="th-g">정산금액</th>
                                <th class="th-g">공급가액</th>
                                <th class="th-g">부가가치세</th>
                                <th class="th-g">선불정산</th>
                                <th class="th-g">후불정산</th>
                                <th class="th-g">입점사부담</th>
                                <th class="th-g">유통사부담</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="t-right">{{formatMoney({value:state.total.totPurSttlAmt})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.totPurSttlSpvl})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.totPurSttlVat})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.purSttlAmt})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.selrPnltAmt})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.saleAmt})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.cstPymtAmt})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.paStarAmt})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.paStarAmt})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.pntAmt})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.encmpBdnCpnAmt})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.dstbrBdnCpnAmt})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.mlgLib})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.mlgCost})}}</td>
                                <td class="t-right">{{formatMoney({value:state.total.prmtnAmt})}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">

            <!-- 테이블 -->
            <div class="tbl-wrap">
                <div class="table-util flex space-between">
                    <div class="btn-set-m flex">
                        <div class="btn-set-m flex">
                            <SttlMonthlyBuyTradingPopup :params="state.selectList" />
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
                        @cell-double-clicked="onCellDoubleClicked" :suppressRowClickSelection="true" @selection-changed="onRowSelect"
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
import { getCurrentInstance, computed, reactive, inject, onMounted, onUnmounted, ref, watchEffect, watch, toDisplayString  } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply, _getInstlCmrcMtlyPurListPaging  } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';
import Channel from './searchFilters/Channel.vue';
import BizSearch from './searchFilters/BizSearch.vue';
import SettleSeq from './searchFilters/SettleSeq.vue';
import SettlePeriodMonth from './searchFilters/SettlePeriodMonth.vue';
import SelectYn from './searchFilters/SelectYn.vue';
import SttlMonthlyBuyTradingPopup from './SttlMonthlyBuyTradingPopup.vue';


const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

const chnSeCdList = ref([]);
const txtnSeCdList = ref([]);
const odrStCdList = ref([]);

const fromToDateRef = ref(null);

const initCodeList = () => {
    let promiseTemp = [];
    promiseTemp.push(_getCodeApply('CHN_SE_CD', chnSeCdList));
    promiseTemp.push(_getCodeApply('TXTN_SE_CD', txtnSeCdList));
    promiseTemp.push(_getCodeApply('ODR_ST_CD', odrStCdList));
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


const selectCol = [{ headerCheckboxSelection: false, headerName: '', field: 'checkbox', checkboxSelection: true, maxWidth: 50, sortable: false}];
const constColum = [
    { headerName: '정산년월',             field: 'sttlYm',       width: 100, valueFormatter: (params) => dayJS(params.value, 'YYYYMM').format('YYYY-MM') },
    { headerName: '정산순번',           field: 'sttlEps',         width: 90, headerClass: 'centered', cellClass: 'centered' },
    // { headerName: '채널',               field: 'chnSeCd',        width: 60 },
    { headerName: '셀러번호',           field: 'selrId',          width: 120 },
    { headerName: '셀러상호',           field: 'selrNm',          width: 120 },
    { headerName: '완료건수',         field: 'aprvCnt',       width: 100 },
    { headerName: '완료판매금액',           field: 'aprvSaleAmt',    width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '완료고객결제금액',           field: 'aprvCstPymtAmt',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '취소건수',         field: 'cnclCnt',       width: 100 },
    { headerName: '취소판매금액',           field: 'cnclSaleAmt',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '취소고객결제금액',           field: 'cnclCstPymtAmt',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '선불스타',           field: 'paStarAmt',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '후불스타',           field: 'plStarAmt',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '포인트',           field: 'pntAmt',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '입점사부담쿠폰',           field: 'encmpBdnCpnAmt',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '유통사부담쿠폰',           field: 'dstbrBdnCpnAmt',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '마일리지부재',           field: 'mlgLib',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '마일리지비용',           field: 'mlgCost',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '프로모션금액',           field: 'prmtnAmt',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '셀러페널티금액',           field: 'selrPnltAmt',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '매입정산금액',           field: 'purSttlAmt',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '매입공급가액',           field: 'purSttlSpvl',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '매입부가가치세',           field: 'purSttlVat',    width: 140, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '세금계산서발행여부',          field: 'tbiPlYn',          width: 120 },
    { headerName: '세금계산서발행일자',          field: 'tbiPlDate',          width: 120 },
    { headerName: '국세청세금계산서번호',          field: 'ntsTbiNo',          width: 120 },
    { headerName: '확정여부',          field: 'dcnYn',          width: 120 },
    { headerName: '확정일시',          field: 'dcnDt',          width: 120 },
    { headerName: '확정자',          field: 'dcnMnNm',          width: 120 }
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
    total: {
        totPurSttlAmt: 0,
        totPurSttlSpvl: 0,
        totPurSttlVat: 0,
        purSttlAmt: 0,
        purSttlSpvl: 0,
        purSttlVat: 0,
        selrPnltAmt: 0,
        pnltPurSttlAmt: 0,
        pnltPurSttlSpvl: 0,
        pnltPurSttlVat: 0,
        saleAmt: 0,
        cstPymtAmt: 0,
        paStarAmt: 0,
        plStarAmt: 0,
        encmpBdnCpnAmt: 0,
        dstbrBdnCpnAmt: 0,
        pntAmt: 0,
        mlgLib: 0,
        mlgCost: 0,
        prmtnAmt: 0
    },
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
    sttlBgnYn: '',
    sttlEndYn: '',
    sttlEps: 1,
    chnSeCd: '',
    selrId: '',
    dcnYn: '',
    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),
        sttlBgnYn: computed(() => formData.sttlBgnYn),
        sttlEndYn: computed(() => formData.sttlEndYn),
        sttlEps: computed(() => formData.sttlEps),
        chnSeCd: computed(() => formData.chnSeCd),
        selrId: computed(() => formData.selrId),
        dcnYn: computed(() => formData.dcnYn),
        mskgnRlsYn: computed(() => formData.mskgnRlsYn)
    },
    url: '/common/api/v1/instl/cmrc/mtly/purlistExcel'
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
    formData.sttlEps = 1;
    formData.chnSeCd = '';
    formData.selrId = '';
    formData.dcnYn = '';
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
            sttlEps: formData.sttlEps,
            chnSeCd: formData.chnSeCd,
            selrId: formData.selrId,
            dcnYn: formData.dcnYn,
            mskgnRlsYn: formData.mskgnRlsYn
        };
        
        const response = await _getInstlCmrcMtlyPurListPaging(params);

        state.rowData = response.data.data.list;
        if (response.data.data.total) {
            state.total = response.data.data.total;
        }
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
