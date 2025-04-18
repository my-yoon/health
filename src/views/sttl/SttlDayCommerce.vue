<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <SttlDateSerch :dateTitle="'정산일자'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="'yesterday'" :ess="true" ref="dateSearch" />
                </div>
                <div class="item">
                    <label>채널</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.chnSeCd">
                                <option value="">전체</option>
                                <option v-for="(item) in chnSeCdList" :value="item.cd">{{ item.nm }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>진행상태</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.odrStCd">
                                <option value="">전체</option>
                                <option v-for="(item) in odrStCdList" :value="item.cd">{{ item.cd + " : " +item.nm }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>데이터검증오류여부</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.dataVrfcErrYn">
                                <option value="">전체</option>
                                <option value="Y">Yes</option>
                                <option value="N">No</option>
                            </select>
                        </span>
                    </span>
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
            </div>
            <!-- 상세검색 -->
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <div class="item">
                        <label>일자</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.dateSearchType">
                                    <option value="">전체</option>
                                    <option value="pymtDate">결제일</option>
                                    <option value="cmplDate">완료일</option>
                                    <option value="cnclDate">취소일</option>
                                    <option value="dcnDate">확정일</option>
                                </select>
                            </span>
                            <span class="dv">
                                <div class="ui-datepicker ss">
                                    <DatePicker position="left" v-model="formData.searchDate" :enableTimePicker="false"
                                        locale="ko" :clearable="false" :format="dateFormat" autoApply text-input :text-input-options="{format:'yyyyMMdd'}"/>
                                </div>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>과/면세</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.txtnSeCd">
                                    <option value="">전체</option>
                                    <option v-for="(item) in txtnSeCdList" :value="item.cd">{{ item.cd + " : " +item.nm }}</option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>업체검색</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.bizSearchType">
                                    <option value="">전체</option>
                                    <option value="pyrId">Payer</option>
                                    <option value="selrId">Seller</option>
                                </select>
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="formData.searchBizNm" readonly>
                            </span>
                            <span class="dv">
                                <button type="button" class="btn btn-opt" @click="openModalLocal('isPartnerShow')">찾기</button>
                            </span>
                            <span class="dv">
                                <button type="button" class="btn btn-opt" @click="clearSearch('biz')">X</button>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>회원검색</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.memberSearchType">
                                    <option value="">전체</option>
                                    <option value="mbrNm">회원명</option>
                                    <option value="mbrSn">회원번호</option>
                                    <option value="mbrJnMthAcsId">회원ID</option>
                                </select>
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="formData.memberSearchNm" readonly>
                            </span>
                            <span class="dv">
                                <button type="button" class="btn btn-opt" @click="openModalLocal('user')">찾기</button>
                            </span>
                            <span class="dv">
                                <button type="button" class="btn btn-opt" @click="clearSearch('user')">X</button>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item">
                        <label>상품검색</label>
                        <span class="input">
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="formData.prdId" placeholder="상품ID">
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="formData.prdNm" placeholder="상품명">
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>주문번호</label>
                        <span class="input">
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="formData.odrId" placeholder="주문번호">
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>확정여부</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.dcnYn">
                                    <option value="">전체</option>
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                </select>
                            </span>
                        </span>
                    </div>
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
    <DefaultModal :isShow="isPartnerShow" :modalTitle="selectPartnerParams.tName + ' 조회'" :buttonConfirm="'닫기'" :buttonCancel="''" :buttonDelete="'Clear'"
            :modalName="'isPartnerShow'" @modalclose="modalControl">
        <template #modalcontent>
            <SttlPartnerSerch @selectPartner="selectPartner" :params="selectPartnerParams"/>
        </template>
    </DefaultModal>
    <DefaultModal :isShow="isUserPopShow" :modalTitle="'회원 조회'" :buttonConfirm="'닫기'" :buttonCancel="''" :buttonDelete="'Clear'"
            :modalName="'isUserShow'" @modalclose="modalControl">
        <template #modalcontent>
            <SttlUserSearch @selectUser="selectUser" :params="selectUserParams"/>
        </template>
    </DefaultModal>
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
import { getCurrentInstance, computed, reactive, inject, onMounted, onUnmounted, ref, watchEffect, watch, toDisplayString  } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import SttlDateSerch from './component/SttlDateSerch.vue';
import SttlPartnerSerch from './component/SttlPartnerSerch.vue';
import SttlUserSearch from './component/SttlUserSearch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply, _getInstlCmrcDailyListPaging, _getInstlSttlBstdList, _getInstlSttlBstdMetaList, _getInstlSttlBstdDtlListPaging, _createInstlSttlBstdDtl, _modifyInstlSttlBstdDtl, _deleteInstlSttlBstdDtl, _getInstlSttlBstdDtlMetaList } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';
import PymtSe from './searchFilters/PymtSe.vue';
import { sttlLib } from './module/sttlLib';

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
const pymtSeCdList = ref([]);

const dateSearch = ref(null);

const initCodeList = () => {
    let promiseTemp = [];
    promiseTemp.push(_getCodeApply('PYMT_SE_CD', pymtSeCdList));
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
    { headerName: '정산일',             field: 'sttlDate',       width: 100, valueFormatter: (params) => dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD') },
    { headerName: '정산순번',           field: 'sttlSn',         width: 90, headerClass: 'centered', cellClass: 'centered' },
    { headerName: '채널',               field: 'chnSeCd',        width: 60 },
    { headerName: '주문번호',           field: 'odrId',          width: 160 },
    { headerName: '주문상세ID',         field: 'odrDtlId',       width: 100, headerClass: 'centered', cellClass: 'centered'  },
    { headerName: '회원ID',             field: 'mbrId',          width: 100 },
    { headerName: '이름',               field: 'none',           width: 120, valueFormatter: (params) => '준비중..' },
    { headerName: '사번',               field: 'none',           width: 120, valueFormatter: (params) => '준비중..' },
    { headerName: 'Payer코드',          field: 'pyrId',          width: 120 },
    { headerName: 'Payer상호',          field: 'none',           width: 120, valueFormatter: (params) => '준비중..' },
    { headerName: 'Payer사업자번호',    field: 'none', width: 160, valueFormatter: (params) => sttlLib.formatBrm(params.value) },
    { headerName: '결제구분',           field: 'pymtSeCd',         width: 100, valueFormatter: (params) => formatCdNm(params, pymtSeCdList)  },
    { headerName: '결제일자',           field: 'pymtDt',         width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYY-MM-DD').format('YYYY-MM-DD') },
    { headerName: '완료일자',           field: 'cmplDt',         width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYY-MM-DD').format('YYYY-MM-DD') },
    { headerName: '취소일자',           field: 'cnclDt',         width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYY-MM-DD').format('YYYY-MM-DD') },
    { headerName: '상품코드',           field: 'prdId',          width: 120 },
    { headerName: '상품명',             field: 'prdNm',          width: 120 },
    { headerName: '상품구분명',         field: 'prdMjcsNm',      width: 120 },
    { headerName: '과/면세',            field: 'txtnSeCd',       width: 120, valueFormatter: (params) => formatCdNm(params, txtnSeCdList) },
    { headerName: '판매수량',           field: 'saleCunt',       width: 120, cellClass: 'align-right' },
    { headerName: '판매단가',           field: 'saleUnitAmt',    width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '스타사용액',         field: 'starAmt',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '포인트사용액',       field: 'pntAmt',         width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '쿠폰사용액',         field: 'cpnAmt',         width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '입점사쿠폰부담액',   field: 'encmpBdnCpnAmt', width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '유통사쿠폰부담액',   field: 'dstbrBdnCpnAmt', width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '고객결제금액',       field: 'cstPymtAmt',     width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '고객결제공급가액',   field: 'cstPymtSpvl',    width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '고객결제세액',       field: 'cstPymtVat',     width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '판매액',             field: 'saleAmt',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '판매공급가액',       field: 'saleSpvl',       width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '판매세액',           field: 'saleVat',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '진행상태',           field: 'odrStCd',        width: 120, valueFormatter: (params) => formatCdNm(params, odrStCdList) },
    { headerName: 'Seller코드',         field: 'selrId',         width: 120 },
    { headerName: 'Seller상호',         field: 'none',           width: 120, valueFormatter: (params) => '준비중..' },
    { headerName: 'Seller사업자번호',   field: 'none', width: 160, valueFormatter: (params) => sttlLib.formatBrm(params.value)},
    { headerName: '상품수수료율',       field: 'encmpFeeRt',     width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '정산금액',           field: 'sttlAmt',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '정산공급가액',       field: 'sttlSpvl',       width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '정산세액',           field: 'sttlVat',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: 'PG승인대사여부',     field: 'aprvRcncYn',     width: 120 },
    { headerName: 'PG입금대사여부',     field: 'dpstRcncYn',     width: 120 },
    { headerName: '확정여부',           field: 'dcnYn',          width: 120 },
    { headerName: '확정일시',           field: 'dcnDt',          width: 120 },
    { headerName: '확정자ID',           field: 'dcnMnId',        width: 120 },
    { headerName: '데이터검증오류여부', field: 'dataVrfcErrYn',  width: 120 },
    { headerName: '데이터검증오류내용', field: 'dataVrfcErrCts',  width: 700, wrapText: true, autoHeight: true,  cellRenderer: (param) => _.replace(param.value, /\r\n/g, '<br/>') }
    
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
    sttlBgnDate: dayJS('20230801', 'YYYYMMDD'),
    sttlEndDate: dayJS(),
    dateSearchType: '',
    searchDate: '',
    chnSeCd: '',
    pymtSeCd: '',
    bizSearchType: '',
    searchBiz: '',
    searchBizNm: '',
    memberSearchType: '',
    memberSearchNm: '',
    prdId: '',
    prdNm: '',
    txtnSeCd: '',
    odrStCd: '',
    dcnYn: '',
    odrId: '',
    dataVrfcErrYn: '',
    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),

        sttlBgnDate: computed(() => dayJS(formData.sttlBgnDate).format('YYYYMMDD')),
        sttlEndDate: computed(() => dayJS(formData.sttlEndDate).format('YYYYMMDD')),
        chnSeCd: computed(() => formData.chnSeCd),
        pymtSeCd: computed(() => formData.pymtSeCd),
        prdId: computed(() => formData.prdId),
        prdNm: computed(() => formData.prdNm),
        txtnSeCd: computed(() => formData.txtnSeCd),
        odrStCd: computed(() => formData.odrStCd),
        dcnYn: computed(() => formData.dcnYn),
        pymtDate: computed(() => formData.dateSearchType == 'pymtDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        cmplDate: computed(() => formData.dateSearchType == 'cmplDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        cnclDate: computed(() => formData.dateSearchType == 'cnclDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        dcnDate: computed(() => formData.dateSearchType == 'dcnDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        pyrId: computed(() => ((formData.bizSearchType == 'pyrId' || formData.bizSearchType == '') && (!_.isEmpty(formData.searchBiz) || _.isNumber(formData.searchBiz)) ? formData.searchBiz : '')),
        selrId: computed(() => ((formData.bizSearchType == 'selrId' || formData.bizSearchType == '') && (!_.isEmpty(formData.searchBiz) || _.isNumber(formData.searchBiz)) ? formData.searchBiz : '')),
        odrId: computed(() => formData.odrId),
        dataVrfcErrYn: computed(() => formData.dataVrfcErrYn),
        mskgnRlsYn: computed(() => formData.mskgnRlsYn)
    },
    url: '/common/api/v1/instl/cmrc/daily/listExcel'
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
    dateSearch.value.initDate();
    formData.sttlBgnDate = dayJS();
    formData.sttlEndDate = dayJS();
    formData.dateSearchType = '';
    formData.searchDate = '';
    formData.chnSeCd = '';
    formData.pymtSeCd = '';
    formData.bizSearchType = '';
    formData.searchBiz = '';
    formData.searchBizNm = '';
    formData.memberSearchType = '';
    formData.memberSearchNm = '';
    formData.mbrId = '';
    formData.prdId = '';
    formData.prdNm = '';
    formData.txtnSeCd = '';
    formData.odrStCd = '';
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
            sttlBgnDate: dayJS(formData.sttlBgnDate).format('YYYYMMDD'),
            sttlEndDate: dayJS(formData.sttlEndDate).format('YYYYMMDD'),
            chnSeCd: formData.chnSeCd,
            pymtSeCd: formData.pymtSeCd,
            prdId: formData.prdId,
            prdNm: formData.prdNm,
            txtnSeCd: formData.txtnSeCd,
            odrStCd: formData.odrStCd,
            dcnYn: formData.dcnYn,
            mbrId: formData.mbrId,
            odrId: formData.odrId,
            dataVrfcErrYn: formData.dataVrfcErrYn,
            mskgnRlsYn: formData.mskgnRlsYn
        };
        if (!_.isEmpty(formData.dateSearchType)) {
            if (_.isDate(formData.searchDate)) {
                params[formData.dateSearchType] = dayJS(formData.searchDate).format('YYYYMMDD');
            }
        }

        if (_.isEmpty(formData.bizSearchType)) {
            if (!_.isEmpty(formData.searchBiz) || _.isNumber(formData.searchBiz)) {
                params['pyrId'] = formData.searchBiz;
                params['selrId'] = formData.searchBiz;
            }
        } else {
            if (!_.isEmpty(formData.searchBiz) || _.isNumber(formData.searchBiz)) {
                params[formData.bizSearchType] = formData.searchBiz;
            }
        }
        
        const response = await _getInstlCmrcDailyListPaging(params);

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

const onSelectPicker = (type, value, status) => {
    console.log('type:', type, 'value:', value, 'status:', status);
    if (type === 'day') {
        formData.sttlBgnDate = value[0];
        formData.sttlEndDate = value[1];
    } else if (type === 'self_end' || type === 'self_start') {
        // 직접 데이터 피커 설정
        if (type === 'self_start') {
            formData.sttlBgnDate = value;
        } else if (type === 'self_end') {
            formData.sttlEndDate = value;
        }
    }
};
const clearSearch = (option) => {
    switch (option) {
        case 'user':
            formData.memberSearchNm = '';
            formData.mbrId = '';
            break;
        case 'biz':
            formData.searchBizNm = '';
            formData.searchBiz = '';
            break;
    }
};

const isUserPopShow = ref(false);

const openModalLocal = async (option) => {
    if (option == 'user') {
        isUserPopShow.value = true;
    } else {
        openModal(option);
    }
};

const selectPartnerParams = reactive({
    admnPtnrTyCd: computed(() => {
        let returnVal = '';
        switch (formData.bizSearchType) {
            case 'pyrId':
                returnVal = '111002';
                break;
            case 'selrId':
                returnVal = '111003';
                break;
        }
        return returnVal;
    }),
    tName: computed(() => {
        let returnVal = '파트너';
        switch (formData.bizSearchType) {
            case 'pyrId':
                returnVal = 'Payer';
                break;
            case 'selrId':
                returnVal = 'Seller';
                break;
        }
        return returnVal;
    }),
    searchText: computed(() => formData.searchBizNm)
});

const selectPartner = (data) => {
    console.log(data);
    formData.searchBizNm = data.ntprNm;
    formData.searchBiz = data.ntprSn;

    isPartnerShow.value = false;

};

const selectUserParams = reactive({
    searchType: computed(() => {
        let returnVal = '';
        if (_.isNumber(formData.mbrId)) {
            returnVal = 'mbrSn';
        } else {
            returnVal = formData.memberSearchType;
        }
        return returnVal;
    }),
    searchText: computed(() => formData.mbrId)
});

const selectUser = (data) => {
    console.log(data);
    formData.memberSearchNm = data.mbrNm;
    formData.mbrId = data.mbrSn;
    isUserPopShow.value = false;
};

// 모달창 닫기
const modalControl = (type, modalName) => {
    console.log(type, modalName);
    if (modalName === 'isPartnerShow') {
        if (type == 'modaldelete') {
            clearSearch('biz');
        }
        isPartnerShow.value = false;
    } else if (modalName === 'isUserShow') {
        if (type == 'modaldelete') {
            clearSearch('user');
        }
        isUserPopShow.value = false;
    }
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
