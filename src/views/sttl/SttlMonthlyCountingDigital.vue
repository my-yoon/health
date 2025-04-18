<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <SettlePeriodMonth dateTitle="기준년월" v-model:bgnYm="formData.bstdBgnYm" v-model:endYm="formData.bstdEndYm" ref="fromToDateRef" />
                <DigitalCurSe v-model="formData.digtlCurSeCd" v-model:cdList="digtlCurSeCdList"/>
                <BizSearch no-biz-options v-model:searchBiz="formData.pyrId" bizSearchType="pyrId"/>
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
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, formData.mskgnRlsYn , exelParams)">
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
import { getCurrentInstance, computed, reactive, inject, onMounted, onUnmounted, ref, watchEffect, watch, toDisplayString  } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply, _getInstlNptrDigtlList } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';
import BizSearch from './searchFilters/BizSearch.vue';
import SettlePeriodMonth from './searchFilters/SettlePeriodMonth.vue';
import DigitalCurSe from './searchFilters/DigitalCurSe.vue';
import { sttlLib } from './module/sttlLib';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

const digtlCurSeCdList = ref([]);

const fromToDateRef = ref(null);

const initCodeList = () => {
    let promiseTemp = [];
    // promiseTemp.push(_getCodeApply('CHN_SE_CD', chnSeCdList));
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

const commonColumn = [
    { headerName: '구분',
        marryChildren: true,
        children: [
            { headerName: '코드',          field: 'pyrId',          width: 120 },
            { headerName: '업체명',          field: 'pyrNm',           width: 120}
        ]}
];

// const selectCol = [{ headerCheckboxSelection: true, headerName: '', field: 'checkbox', checkboxSelection: true, maxWidth: 50, sortable: false}];
const constColum = [
    ...commonColumn,
    { headerName: '스타내역',
        marryChildren: true,
        children: [
            { headerName: '기초금액',          field: 'S_caryAmt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '기간별 발행금액',          field: 'S_tmmPlAmt',          width: 130, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '기간사용완료',          field: 'S_tmmUseCmplAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '기간사용진행중',    field: 'S_prgAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간사용진행중취소',    field: 'S_prgCnclAmt',           width: 150, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간사용취소',    field: 'S_cnclAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간소멸액',    field: 'S_extiAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간잔액',    field: 'S_plBal',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney }
        ]},
    { headerName: '포인트내역',
        marryChildren: true,
        children: [
            { headerName: '기초금액',          field: 'P_caryAmt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '기간별 발행금액',          field: 'P_tmmPlAmt',          width: 130, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '기간사용완료',          field: 'P_tmmUseCmplAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '기간사용진행중',    field: 'P_prgAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간사용진행중취소',    field: 'P_prgCnclAmt',           width: 150, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간사용취소',    field: 'P_cnclAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간소멸액',    field: 'P_extiAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간잔액',    field: 'P_plBal',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney }
        ]},
    { headerName: '쿠폰내역',
        marryChildren: true,
        children: [
            { headerName: '기초금액',          field: 'C_caryAmt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '기간별 발행금액',          field: 'C_tmmPlAmt',          width: 130, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '기간사용완료',          field: 'C_tmmUseCmplAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '기간사용진행중',    field: 'C_prgAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간사용진행중취소',    field: 'C_prgCnclAmt',           width: 150, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간사용취소',    field: 'C_cnclAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간소멸액',    field: 'C_extiAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간잔액',    field: 'C_plBal',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney }
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
    bstdBgnYm: '',
    bstdEndYm: '',
    pyrId: '',
    digtlCurSeCd: '',
    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),
        bstdBgnYm: computed(() => bstdBgnYm),
        bstdEndYm: computed(() => bstdEndYm),
        pyrId: computed(() => formData.pyrId),
        digtlCurSeCd: computed(() => formData.digtlCurSeCd),
        mskgnRlsYn: computed(() => formData.mskgnRlsYn)
    },
    url: '/common/api/v1/instl/cmrc/nptrDigtl/listExcel'
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
    formData.digtlCurSeCd = '';
    formData.pyrId = '';
    state.mskgnRlsYn = true;
};

//리스트 갯수 변경 후 리스트 재 조회
const clearList = () => {
    initParams();
    onChangedPage(1);
};

const currencyColumn = (i, row, digtlCurSeCd) => {
    const ym = row[`${i}_bstdYm`];
    const year = ym.substring(0, 4);
    const month = ym.substring(4, 6);
    
    return {
        headerName: `${year}년 ${month}월 ${sttlLib.formatCdNm({value: digtlCurSeCd}, digtlCurSeCdList, true)}내역`,
        marryChildren: true,
        children: [
            { headerName: '기초금액',          field: `${i}_caryAmt`,          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '기간별 발행금액',          field: `${i}_tmmPlAmt`,          width: 130, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '기간사용완료',          field: `${i}_tmmUseCmplAmt`,           width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '기간사용진행중',    field: `${i}_prgAmt`,           width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간사용진행중취소',    field: `${i}_prgCnclAmt`,           width: 150, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간사용취소',    field: `${i}_cnclAmt`,           width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간소멸액',    field: `${i}_extiAmt`,           width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '기간잔액',    field: `${i}_plBal`,           width: 120, cellClass: 'align-right', valueFormatter: formatMoney }
        ]};
};

const getList = async () => {
    try {
        let params = {
            size: pager.size,
            offset: pager.offset,
            bstdBgnYm: formData.bstdBgnYm,
            bstdEndYm: formData.bstdEndYm,
            digtlCurSeCd: formData.digtlCurSeCd,
            pyrId: formData.pyrId,
            mskgnRlsYn: formData.mskgnRlsYn
        };
       
        const response = await _getInstlNptrDigtlList(params);
        state.rowData = response.data.data;
        pager.totalCnt = response.data.data.length || 0;

        if (formData.digtlCurSeCd) {
            state.tableColum_c = getSelectedColumns(formData.digtlCurSeCd, state.rowData);
        } else {
            state.tableColum_c = [...initColum.value];
        }
        
        state.mskgnTried = false;
    } catch (error) {
        console.log(error);
    }
};

const getSelectedColumns = (digtlCurSeCd, rowData = []) => {
    const newColumn = [...commonColumn];
    if (rowData.length > 0) {
        const row = rowData[0];
        for (let i = 0; i < row.colSize; i++) {
            newColumn.push(currencyColumn(i, row, digtlCurSeCd));
        }
    }
    return newColumn;
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


</script>
