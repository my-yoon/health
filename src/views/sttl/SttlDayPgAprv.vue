<template>
    <!-- 검색 -->
    <div class="ui-data-filter">
        <div class="form-item">
            <div class="item">
                <SttlDateSerch :dateTitle="'대사일자'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="'yesterday'" :ess="true" ref="dateSearch" />
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
                <label>대사결과</label>
                <span class="input">
                    <span class="dv">
                        <select class="custom-select sm" v-model="formData.pgRcncRsltCd">
                            <option value="">전체</option>
                            <option v-for="(item) in pgRcncRsltCdList" :value="item.cd">{{ item.cd + ":" + item.nm }}</option>
                        </select>
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
                    <label>검색일</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.dateSearchType">
                                <option value="">선택</option>
                                <option value="dlngDate">거래일</option>
                                <option value="pgAprvDate">승인일</option>
                                <option value="pgCnclDate">취소일</option>
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
                            <select class="custom-select sm" v-model="formData.pgPayMthNm">
                                <option value="">전체</option>
                                <option v-for="(item) in pgPayMthNmList" :value="item.cd">{{ item.nm }}</option>
                            </select>
                        </span>
                    </span>
                </div>
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
                <columlist :columlists="initColum" @checkColum="checkOptions" />
                <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
                <template v-else>
                    <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                        :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked" :getRowClass="getRowClass"
                        headerHeight="24.5" @cell-double-clicked="onCellDoubleClicked" :suppressRowClickSelection="true" @selection-changed="onRowSelect"
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
import { getCurrentInstance, computed, reactive, inject, onMounted, onUnmounted, ref, watchEffect, watch, toDisplayString } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply, _getInstlPgRcncListPaging } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';
import SttlDateSerch from './component/SttlDateSerch.vue';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

const pgPayMthNmList = ref([
    { cd: 'ISP', nm: 'ISP' },
    { cd: '신용카드', nm: '신용카드' },
    { cd: '실시간계좌이체', nm: '실시간계좌이체' }
]);

const chnSeCdList = ref([]);
const pgRcncRsltCdList = ref([]);
const pymtSeCdList = ref([]);
const odrStCdList = ref([]);

const dateSearch = ref(null);

const initCodeList = () => {
    let promiseTemp = [];
    promiseTemp.push(_getCodeApply('CHN_SE_CD', chnSeCdList));
    promiseTemp.push(_getCodeApply('PYMT_SE_CD', pymtSeCdList));
    promiseTemp.push(_getCodeApply('ODR_ST_CD', odrStCdList));
    promiseTemp.push(_getCodeApply('PG_RCNC_RSLT_CD', pgRcncRsltCdList));
    return Promise.all(promiseTemp);
};

const dateFormat = 'yyyy-MM-dd';
const formatMoney = (params) => {
    return _.replace(params.value, /(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
const getRowClass = (params) => {
    if (params.node.data.bkrtDdctYn === 'Y' || params.node.data.pgRcncRsltCd != '0') {
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

const selectCol = [];
const constColum = [
    {headerName: '대사내역',
        marryChildren: true,
        children: [
            { headerName: '대사일자',     field: 'pgRcncDate',   valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
            { headerName: '대사결과코드', field: 'pgRcncRsltCd', valueFormatter: (params) => formatCdNm(params, pgRcncRsltCdList)},
            { headerName: '채널',         field: 'chnSeCd'      },
            { headerName: '주문번호',     field: 'odrId'        },
            { headerName: 'TID',          field: 'pgDlngId'     }
        ]},
    {headerName: '커머스거래내역',
        marryChildren: true,
        children: [
            { headerName: '결제금액',     field: 'cstPymtAmt',   cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '결제구분',     field: 'pymtSeCd', valueFormatter: (params) => formatCdNm(params, pymtSeCdList)   },
            { headerName: '주문상태',     field: 'odrStCd', valueFormatter: (params) => formatCdNm(params, odrStCdList)  },
            { headerName: '승인일자',     field: 'pymtDt'       },
            { headerName: '취소일자',     field: 'cnclDt'       }
        ]},
    {headerName: 'PG승인내역',
        marryChildren: true,
        children: [
            { headerName: '승인금액',     field: 'pgDlngAmt',    cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '결제수단',     field: 'pgPayMthNm'   },
            { headerName: '거래상태',     field: 'pgDlngStNm'   },
            { headerName: '승인일자',     field: 'pgAprvDate',   valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
            { headerName: '취소일자',     field: 'pgCnclDate'   }
        ]},
    {headerName: '확정',
        marryChildren: true,
        children: [
            { headerName: '확정여부',     field: 'dcnYn'        },
            { headerName: '확정자ID',     field: 'dcnMnId'      },
            { headerName: '확정일시',     field: 'dcnDt'        }
        ]}

];

const initColum = ref([]);

const MAX_ITEM = 30;
const DEFAULT_WIDTH = 130;
const initSearchType = '';
const initDayValue = null;
const pgRcncSeCd = 'A';

const initColumInitialize = () => {
    initColum.value = _.clone(constColum);
};

initColumInitialize();

const state = reactive({
    //테이블데이터
    tableColum_c: _.union(selectCol, initColum.value),
    filterCoulm: [],
    rowData: [],
    defaultColDef: {
        sortable: true,
        filter: false,
        resizable: true,
        width: 120
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
    dateSearchType: initSearchType,
    searchDate: initDayValue,
    chnSeCd: '',
    pgRcncRsltCd: '',
    dcnYn: '',
    pgPayMthNm: '',

    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),

        pgRcncSeCd: pgRcncSeCd,
        chnSeCd: computed(() => formData.chnSeCd),
        pgRcncRsltCd: computed(() => formData.pgRcncRsltCd),
        dcnYn: computed(() => formData.dcnYn),
        pgPayMthNm: computed(() => formData.pgPayMthNm),
        pgRcncBgnDate: computed(() => dayJS(formData.pgRcncBgnDate).format('YYYYMMDD')),
        pgRcncEndDate: computed(() => dayJS(formData.pgRcncEndDate).format('YYYYMMDD')),
        dlngDate: computed(() => formData.dateSearchType == 'dlngDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        pgAprvDate: computed(() => formData.dateSearchType == 'pgAprvDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        pgCnclDate: computed(() => formData.dateSearchType == 'pgCnclDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),

        mskgnRlsYn: computed(() => formData.mskgnRlsYn)
    },
    url: '/common/api/v1/instl/pgRcnc/listExcel'
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
    formData.dateSearchType = initSearchType;
    formData.dateSearchType = initDayValue;
    formData.chnSeCd = '';
    formData.pgRcncRsltCd = '';
    formData.dcnYn = '';
    formData.pgPayMthNm = '';

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
            pgRcncSeCd: pgRcncSeCd,
            pgRcncBgnDate: dayJS(formData.pgRcncBgnDate).format('YYYYMMDD'),
            pgRcncEndDate: dayJS(formData.pgRcncEndDate).format('YYYYMMDD'),
            chnSeCd: formData.chnSeCd,
            pgRcncRsltCd: formData.pgRcncRsltCd,
            dcnYn: formData.dcnYn,
            pgPayMthNm: formData.pgPayMthNm,

            mskgnRlsYn: formData.mskgnRlsYn
        };
        
        if (!_.isEmpty(formData.dateSearchType)) {
            if (_.isDate(formData.searchDate)) {
                params[formData.dateSearchType] = dayJS(formData.searchDate).format('YYYYMMDD');
            }
        }

        const response = await _getInstlPgRcncListPaging(params);

        state.rowData = response.data.data.list;
        pager.totalCnt = response.data.data.totalCnt;
        state.totalRst = response.data.data.totalRst;
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
    if (type === 'day') {
        formData.pgRcncBgnDate = value[0];
        formData.pgRcncEndDate = value[1];
    } else if (type === 'self_end' || type === 'self_start') {
        // 직접 데이터 피커 설정
        if (type === 'self_start') {
            formData.pgRcncBgnDate = value;
        } else if (type === 'self_end') {
            formData.pgRcncEndDate = value;
        }
    }
};

</script>
