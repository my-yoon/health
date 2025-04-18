<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <SettlePeriodMonth v-model:bgnYm="formData.sttlBgnYm" v-model:endYm="formData.sttlEndYm" ref="fromToDateRef"/>
                <SettleSeq v-model="formData.sttlEps" />
                <Channel v-model="formData.chnSeCd" />
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList">
                        <span class="ico-search"></span>조회</button>
                    <button type="button" class="btn btn-sm" @click="clearList">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="ui-section">

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
                        <!-- <SttlSelectBox :selectType="'page'" @changedValue="selectedOptions" /> -->
    
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
                    <!-- <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                        @changedPage="onChangedPage" /> -->
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
import { _getCodeApply, _getInstlCmrcMonthlySumlist } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';
import Channel from './searchFilters/Channel.vue';
import SettlePeriodMonth from './searchFilters/SettlePeriodMonth.vue';
import SettleSeq from './searchFilters/SettleSeq.vue';


const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
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

const selectCol = [{ headerCheckboxSelection: true, headerName: '', field: 'checkbox', checkboxSelection: true, maxWidth: 50, sortable: false}];
const constColum = [
    { headerName: '기본정보',
        marryChildren: true,
        children: [
            { headerName: '채널',               field: 'chnSeCd',        width: 60 },
            { headerName: '정산년월',           field: 'sttlYm',         width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMM').format('YYYY-MM') },
            { headerName: '정산회차',           field: 'sttlEps',         width: 100, headerClass: 'centered', cellClass: 'centered'  }
        ]},
    { headerName: '전체',
        marryChildren: true,
        children: [
            { headerName: '공급가액',             field: 'totSpvl',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '부가가치세',       field: 'totVat',       width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '전체금액',           field: 'totAmt',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney }
        ]},
    { headerName: '완료',
        marryChildren: true,
        children: [
            { headerName: '공급가액',             field: 'aprvSpvl',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '부가가치세',       field: 'aprvVat',       width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '완료금액',           field: 'aprvAmt',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney }
        ]},
    { headerName: '취소',
        marryChildren: true,
        children: [
            { headerName: '공급가액',             field: 'cnclSpvl',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '부가가치세',       field: 'cnclVat',       width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '취소금액',           field: 'cnclAmt',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney }
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
    chnSeCd: '',
    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),
        sttlBgnYm: computed(() => formData.sttlBgnYm),
        sttlEndYm: computed(() => formData.sttlEndYm),
        chnSeCd: computed(() => formData.chnSeCd),
        prdsttlEpsId: computed(() => formData.sttlEps),
        mskgnRlsYn: computed(() => formData.mskgnRlsYn)
    },
    url: '/common/api/v1/instl/cmrc/mtly/sumlistExcel'
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
            sttlEps: formData.sttlEps,
            mskgnRlsYn: formData.mskgnRlsYn
        };

        const response = await _getInstlCmrcMonthlySumlist(params);

        state.rowData = response.data.data.list;
        pager.totalCnt = response.data.data.list.length || 0 ;
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
