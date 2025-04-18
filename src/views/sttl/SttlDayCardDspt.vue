<template>
    <!-- 검색 -->
    <div class="ui-data-filter">
        <div class="form-item">
            <div class="item">
                <SttlDateSerch :dateTitle="'정산일자'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="'today'" ref="dateSearch" />
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
                <label>부도차감여부</label>
                <span class="input">
                    <span class="dv">
                        <select class="custom-select sm" v-model="formData.bkrtDdctYn">
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
                                <option value="">선택</option>
                                <option value="pymtDate">입금일자</option>
                                <option value="cmplDate">승인일자</option>
                                <option value="cnclDate">취소일자</option>
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
                    <label>결제수단</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.pgPayMthCd">
                                <option value="">전체</option>
                                <option v-for="(item) in pgPayMthCdList" :value="item.cd">{{ item.cd + " : " +item.nm }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>거래상태</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.pgDlngSeCd">
                                <option value="">전체</option>
                                <option v-for="(item) in pgDlngSeCdList" :value="item.cd">{{ item.cd + " : " +item.nm }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>상세검색</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.searchType">
                                <option value="">선택</option>
                                <option value="pgStreId">상점ID</option>
                                <option value="pgOdrNo">주문번호</option>
                                <option value="pgDlngId">TID</option>
                                <option value="cardAprvNo">카드승인번호</option>
                            </select>
                        </span>
                        <span class="dv">
                            <input type="text" class="form-control sm" placeHolder="검색어" v-model="formData.searchText" :readonly="state.isTextReadOnly"/>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="ui-section">
        <div class="ui-title-3">
            <h3>일별 현황</h3>
        </div>
        <div class="ui-content">
            <div class="table-list w-800">
                <table class="table list">
                    <colgroup>
                        <col style="width: 25%">
                        <col style="width: 25%">
                        <col style="width: 25%">
                        <col style="width: 25%">
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col" class="th-g">건수</th>
                            <th scope="col" class="th-g">결제금액</th>
                            <th scope="col" class="th-g">수수료금액</th>
                            <th scope="col" class="th-g">입금금액</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="t-right">{{ formatMoney({value : state.totalRst.totalCnt}) }}</td>
                            <td class="t-right">{{ formatMoney({value : state.totalRst.pymtAmt}) }}</td>
                            <td class="t-right">{{ formatMoney({value : state.totalRst.feeAmt}) }}</td>
                            <td class="t-right">{{ formatMoney({value : state.totalRst.dpstAmt}) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <!-- 테이블 -->
    <div class="ui-section">
        <div class="ui-content">
            <div class="tbl-wrap">
                <div class="table-util flex space-between">
                    <div class="btn-set-m flex">

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
        </div>
    </div>
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
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply, _getInstlPgDsptListPaging } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

const chnSeCdList = ref([]);
const pgPayMthCdList = ref([]);
const pgDlngSeCdList = ref([]);

const dateSearch = ref(null);

const initCodeList = () => {
    let promiseTemp = [];
    promiseTemp.push(_getCodeApply('CHN_SE_CD', chnSeCdList));
    promiseTemp.push(_getCodeApply('PG_PAY_MTH_CD', pgPayMthCdList));
    promiseTemp.push(_getCodeApply('PG_DLNG_SE_CD', pgDlngSeCdList));
    return Promise.all(promiseTemp);
};

const dateFormat = 'yyyy-MM-dd';
const formatMoney = (params) => {
    return _.replace(params.value, /(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
const getRowClass = (params) => {
    if (params.node.data.bkrtDdctYn === 'Y') {
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
    { headerName: '정산일자',             field: 'sttlDate',         width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
    { headerName: '정산순번',             field: 'sttlSn',           width: 85, cellClass: 'centered'},
    { headerName: 'PG조회일자',           field: 'pgInqDate',        valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
    { headerName: 'PG정산입금일자',       field: 'pgSttlDpstDate',   valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
    { headerName: 'PG주문번호',           field: 'pgOdrNo'          },
    { headerName: 'PG거래ID',             field: 'pgDlngId'         },
    { headerName: '신용카드원본PG거래ID', field: 'crcdOrgnPgDlngId' },
    { headerName: '결제수단',             field: 'pgPayMthCd',       valueFormatter: (params) => formatCdNm(params, pgPayMthCdList) },
    { headerName: '거래상태',             field: 'pgDlngSeCd',       valueFormatter: (params) => formatCdNm(params, pgDlngSeCdList) },
    { headerName: '간편결제구분명',       field: 'splPymtSeNm'      },
    { headerName: '매입회사코드',         field: 'purCoCdNm'        },
    { headerName: '승인회사코드',         field: 'aprvCoCdNm'       },
    { headerName: 'PG승인일시',           field: 'pgAprvDt',         width: 145},
    { headerName: 'PG취소일시',           field: 'pgCnclDt'         },
    { headerName: '카드승인번호',         field: 'cardAprvNo'       },
    { headerName: '화폐코드',             field: 'curCd'            },
    { headerName: 'PG정산금액',           field: 'pgSttlAmt',        cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: 'PG정산수수료금액',     field: 'pgSttlFeeAmt',     cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: 'PG정산부가가치세',     field: 'pgSttlVat',        cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: 'PG정산입금금액',       field: 'pgSttlDpstAmt',    cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '부도차감여부',         field: 'bkrtDdctYn'       },
    { headerName: 'PG상점ID',             field: 'pgStreId'         },
    { headerName: '채널구분코드',         field: 'chnSeCd'          },
    // { headerName: '재처리여부',           field: 'rePrYn'           },
    // { headerName: '정산집계제외여부',     field: 'sttlAgrgXclYn'    },
    { headerName: 'PG대사ID',             field: 'pgRcncId'         }
];

const initColum = ref([]);

const DEFAULT_WIDTH = 120;

const initColumInitialize = () => {
    initColum.value = _.clone(constColum);
};

initColumInitialize();

const state = reactive({
    //테이블데이터
    tableColum_c: _.union(selectCol, initColum.value),
    filterCoulm: [],
    rowData: [],
    totalRst: {
        dpstAmt: 0,
        pymtAmt: 0,
        feeAmt: 0,
        totalCnt: 0
    },
    defaultColDef: {
        sortable: true,
        filter: false,
        resizable: true,
        width: DEFAULT_WIDTH
    },
    gridApi: null,
    gridColumApi: null,
    isTextReadOnly: true,
    openMore: false,
    list: [],
    pagesize: 50,
    mskgnRlsYn: true,
    mskgnTried: false // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
});

const formData = reactive({
    chnSeCd: '',
    bkrtDdctYn: '',
    dateSearchType: '',
    searchDate: '',
    pgPayMthCd: '',
    pgDlngSeCd: '',
    searchType: '',
    searchText: '',

    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),

        sttlBgnDate: computed(() => dayJS(formData.sttlBgnDate).format('YYYYMMDD')),
        sttlEndDate: computed(() => dayJS(formData.sttlEndDate).format('YYYYMMDD')),
        chnSeCd: computed(() => formData.chnSeCd),
        bkrtDdctYn: computed(() => formData.bkrtDdctYn),
        pgPayMthCd: computed(() => formData.pgPayMthCd),
        pgDlngSeCd: computed(() => formData.pgDlngSeCd),
        pymtDate: computed(() => formData.dateSearchType == 'pymtDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        cmplDate: computed(() => formData.dateSearchType == 'cmplDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        cnclDate: computed(() => formData.dateSearchType == 'cnclDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        pgStreId: computed(() => (formData.searchType == 'pgStreId' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        pgOdrNo: computed(() => (formData.searchType == 'pgOdrNo' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        pgDlngId: computed(() => (formData.searchType == 'pgDlngId' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        cardAprvNo: computed(() => (formData.searchType == 'cardAprvNo' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        mskgnRlsYn: computed(() => formData.mskgnRlsYn)
    },
    url: '/common/api/v1/instl/pgDspt/listExcel'
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
    formData.chnSeCd = '';
    formData.bkrtDdctYn = '';
    formData.dateSearchType = '';
    formData.searchDate = '';
    formData.pgPayMthCd = '';
    formData.pgDlngSeCd = '';
    formData.searchType = '';
    formData.searchText = '';

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
            bkrtDdctYn: formData.bkrtDdctYn,
            pgPayMthCd: formData.pgPayMthCd,
            pgDlngSeCd: formData.pgDlngSeCd,

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

        const response = await _getInstlPgDsptListPaging(params);

        state.rowData = response.data.data.list;
        pager.totalCnt = response.data.data.totalCnt;
        if (pager.offset === 0) {
            state.totalRst = response.data.data.totalRst;
        }

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

watch(
    () => formData.searchType,
    (n, o) => {
        if (_.isEmpty(n)) {
            state.isTextReadOnly = true;
        } else {
            state.isTextReadOnly = false;
        }
    }
);
</script>
