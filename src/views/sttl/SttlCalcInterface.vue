<template>
    <section class="temp-section">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <SttlDateSerch :dateTitle="'IF일자'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="'today'" :ess="true" ref="dateSearch" />
                <div class="item">
                    <label>IF대상코드</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.sttlIfTrgCd">
                                <option value="">전체</option>
                                <option v-for="(item) in sttlIfTrgCdList" :value="item.cd">{{ item.cd + " : " +item.nm }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>IF구분코드</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.sttlIfSeCd">
                                <option value="">전체</option>
                                <option v-for="(item) in sttlIfSeCdFilteredList" :value="item.cd">{{ item.cd + " : " +item.nm }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>IF결과코드</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.sttlIfRsltCd">
                                <option value="">전체</option>
                                <option v-for="(item) in sttlIfRsltCdList" :value="item.cd">{{ item.cd + " : " +item.nm }}</option>
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
                </div>
            </div>
        </div>
        <!-- 테이블 -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <!-- <button type="button" class="btn btn-ss" @click="confirmRow">실행</button> -->
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
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
                    :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked"
                    :suppressRowClickSelection="true" @selection-changed="onRowSelect" rowSelection="single"
                    class="ag-theme-alpine tbl-wrap" domLayout="autoHeight">
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
</style>
<script setup>
import { getCurrentInstance, computed, reactive, inject, onMounted, onUnmounted, ref, watchEffect, watch, toDisplayString  } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import SttlDateSerch from './component/SttlDateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply, _getInstlIfLogListPaging } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';
import { sttlLib } from './module/sttlLib';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

const sttlIfTrgCdList = ref([]);
const sttlIfSeCdList = ref([]);
const sttlIfSeCdFilteredList = ref([]);
const sttlIfRsltCdList = ref([]);

const initCodeList = () => {
    let promiseTemp = [];
    promiseTemp.push(_getCodeApply('STTL_IF_TRG_CD', sttlIfTrgCdList));
    promiseTemp.push(_getCodeApply('STTL_IF_SE_CD', sttlIfSeCdList).then(
        (res) => {
            sttlIfSeCdFilteredList.value = sttlIfSeCdList.value;
        }
    ));
    promiseTemp.push(_getCodeApply('STTL_IF_RSLT_CD', sttlIfRsltCdList));
    return Promise.all(promiseTemp);
};

const dateFormat = 'yyyy-MM-dd';

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
    { headerName: 'IF일자',     field: 'sttlIfDate',    width: 90},
    { headerName: 'IF대상코드', field: 'sttlIfTrgCd',   width: 130, valueFormatter: (params) => formatCdNm(params, sttlIfTrgCdList)},
    { headerName: 'IF구분코드', field: 'sttlIfSeCd',    width: 160, valueFormatter: (params) => formatCdNm(params, sttlIfSeCdList)},
    { headerName: 'IF URL',     field: 'sttlIfUrl',     width: 330},
    { headerName: '시작일시',   field: 'sttlIfBgnDt',   width: 190},
    { headerName: '종료일시',   field: 'sttlIfEndDt',   width: 190},
    { headerName: '결과',       field: 'sttlIfRsltCd',  width: 80, valueFormatter: (params) => formatCdNm(params, sttlIfRsltCdList)},
    { headerName: '요청내용',   field: 'sttlIfRqstCts', width: 200},
    { headerName: '응답내용',   field: 'sttlIfRspCts',  width: 250}
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
    tableColum_c: _.union(selectCol, initColum.value),
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
    sttlIfBgnDate: dayJS(),
    sttlIfEndDate: dayJS(),
    sttlIfTrgCd: '',
    sttlIfSeCd: '',
    sttlIfRsltCd: ''
});

onMounted(() => {
    initCodeList();
    resetTable();
    getList();
});

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
    if (['sttlIfRqstCts', 'sttlIfRspCts', 'sttlIfUrl'].includes(e.column.colDef.field)) {
        sttlLib.copyToClipboard(e.value);
    }
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

};

const initParams = () => {
    formData.sttlIfBgnDate = dayJS();
    formData.sttlIfEndDate = dayJS();
    formData.sttlIfTrgCd   = '';
    formData.sttlIfSeCd    = '';
    formData.sttlIfRsltCd    = '';

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
            sttlIfBgnDate: dayJS(formData.sttlIfBgnDate).format('YYYYMMDD'),
            sttlIfEndDate: dayJS(formData.sttlIfEndDate).format('YYYYMMDD'),
            sttlIfTrgCd: formData.sttlIfTrgCd,
            sttlIfSeCd: formData.sttlIfSeCd,
            sttlIfRsltCd: formData.sttlIfRsltCd
        };
        
        const response = await _getInstlIfLogListPaging(params);

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

//페이지당 리스트 갯수 선택 옵션
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
        formData.sttlIfBgnDate = value[0];
        formData.sttlIfEndDate = value[1];
    } else if (type === 'self_end' || type === 'self_start') {
        // 직접 데이터 피커 설정
        if (type === 'self_start') {
            formData.sttlIfBgnDate = value;
        } else if (type === 'self_end') {
            formData.sttlIfEndDate = value;
        }
    }
};

const onRunDateBlur = (sort) => {
    //배치실행일자 삭제 못하도록..
    if (!_.isDate(formData[sort])) {
        formData[sort] = dayJS();
    }
};

watch(
    () => formData.sttlIfTrgCd,
    (n, o) => {
        if (!_.isEmpty(formData.sttlIfTrgCd)) {
            sttlIfSeCdFilteredList.value = sttlIfSeCdList.value.filter(o => o.up == formData.sttlIfTrgCd);
            if (n != 0) {
                formData.sttlIfSeCd = '';
            }
        } else {
            sttlIfSeCdFilteredList.value = sttlIfSeCdList.value;
        }
    }
);
</script>
