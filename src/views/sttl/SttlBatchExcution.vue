<template>
    <section class="temp-section">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <SttlDateSerch :dateTitle="'배치실행일자'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="'today'" :ess="true" ref="dateSearch" />
                <div class="item">
                    <label>실행그룹</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.runGrpCd">
                                <option value="">전체</option>
                                <option v-for="(item) in runGrpCdList" :value="item.cd">{{ item.cd + " : " +item.nm }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>실행상태</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.runStCd">
                                <option value="">전체</option>
                                <option v-for="(item) in runStCdList" :value="item.cd">{{ item.cd + " : " +item.nm }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>정산주기</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.sttlCyclCd">
                                <option value="">전체</option>
                                <option v-for="(item) in sttlCyclCdList" :value="item.cd">{{ item.cd + " : " +item.nm }}</option>
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
        </div>
        <div class="ui-section">
            <div class="ui-title-3">
                <h3>배치검색내역</h3>
            </div>
            <div class="ui-content">
                <columlist :columlists="initColum" @checkColum="checkOptions" />
                <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
                <template v-else>
                    <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                        :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked"
                        @cell-double-clicked="onCellDoubleClicked" :suppressRowClickSelection="true" @selection-changed="onRowSelect" rowSelection="single"
                        class="ag-theme-alpine tbl-wrap" domLayout="autoHeight">
                    </AgGridVue>
                    <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                        @changedPage="onChangedPage" />
                </template>
            </div>
        </div>
        <div class="ui-section">
            <div class="ui-title-3">
                <h3>프로그램실행내역</h3>
            </div>
            <div class="ui-content">
                <div class="ui-data-filter sm">
                    <div class="form-item">
                        <div class="item">
                            <span class="input">
                                <span class="dv">
                                    <div class="checkbox-group btn-group">
                                        <span class="checkbox" v-for="(item, index) in runLogSeCdList">
                                            <input :id="'log' + index" name="logGroup" type="checkbox" v-model="detailFormData" :value="item.cd">
                                            <label :for="'log' + index">{{ item.nm }}</label>
                                        </span>
                                    </div>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="tbl-wrap">
                    <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="detail.rowData.length === 0"></NoData>
                    <template v-else>
                        <AgGridVue :defaultColDef="detail.defaultColDef" :columnDefs="detail.tableColum_c"
                            :rowData="detail.rowData" @grid-ready="onGridDetailReady" :suppressRowClickSelection="true"
                            class="ag-theme-alpine" domLayout="autoHeight">
                        </AgGridVue>
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>
<style>
.align-right {
	text-align: right;
}
</style>
<script setup>
import { getCurrentInstance, computed, reactive, inject, onMounted, onUnmounted, ref, watchEffect, watch, toDisplayString  } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import SttlDateSerch from './component/SttlDateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply, _getInstlSttlBstdDtlList, _getInstlBatchListPaging, _getInstlBatchLogDetailList } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

const runGrpCdList = ref([]);
const runStCdList = ref([]);
const sttlCyclCdList = ref([]);
const batchPgmCdList = ref([]);
const runLogSeCdList = ref([]);

const initCodeList = () => {
    let promiseTemp = [];
    promiseTemp.push(_getCodeApply('RUN_GRP_CD', runGrpCdList));
    promiseTemp.push(_getCodeApply('RUN_ST_CD', runStCdList));
    promiseTemp.push(_getCodeApply('STTL_CYCL_CD', sttlCyclCdList));
    promiseTemp.push(_getCodeApply('RUN_LOG_SE_CD', runLogSeCdList));
    promiseTemp.push(_getInstlSttlBstdDtlList({
        sttlBstdCd: 'STTL_BATCH_PGM',
        sttlBstdMetaNo: 10
    }).then(
        (res) => {
            if (!_.isEmpty(res.data.data.list)) {
                batchPgmCdList.value = res.data.data.list.map((o) => {
                    return {cd: o.sttlBstd1Cts, nm: o.sttlBstd3Cts, engNm: o.sttlBstd2Cts};
                });
            }
        }
    ));
    return Promise.all(promiseTemp);
};

const dateFormat = 'yyyy-MM-dd';
const formatMoney = (params) => {
    return _.replace(params.value, /(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
const formatCdNm = (params, codeList) => {
    let findedRow = codeList.value.filter(o => o.cd == params.value);
    if (_.isEmpty(findedRow)) {
        return params.value;
    } else {
        return findedRow[0].cd + ' : ' + findedRow[0].nm;
    }
};

const formatNmOfCd = (params, codeList) => {
    let findedRow = codeList.value.filter(o => o.cd == params.value);
    if (_.isEmpty(findedRow)) {
        return params.value;
    } else {
        return findedRow[0].nm;
    }
};

const formatEngNmOfCd = (params, codeList) => {
    let findedRow = codeList.value.filter(o => o.cd == params.value);
    if (_.isEmpty(findedRow)) {
        return params.value;
    } else {
        return findedRow[0].engNm;
    }
};

const selectCol = [{ headerName: '', field: 'checkbox', checkboxSelection: true, maxWidth: 50, sortable: false}];
const constColum = [
    { headerName: '실행일자',       field: 'runDate',    width: 100, valueFormatter: (params) => dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD') },
    { headerName: '정산주기코드',   field: 'sttlCyclCd', width: 110, valueFormatter: (params) => formatCdNm(params, sttlCyclCdList)},
    { headerName: '실행그룹코드',   field: 'runGrpCd',   width: 110, valueFormatter: (params) => formatCdNm(params, runGrpCdList)},
    { headerName: '프로그램',       field: 'runPgmId',   width: 150, valueFormatter: (params) => formatEngNmOfCd(params, batchPgmCdList)},
    { headerName: '프로그램명',     field: 'runPgmId',   width: 160, valueFormatter: (params) => formatNmOfCd(params, batchPgmCdList)},
    { headerName: '실행상태코드',   field: 'runStCd',    width: 110, valueFormatter: (params) => formatCdNm(params, runStCdList)},
    { headerName: '실행요청내용',   field: 'runRqstCts', width: 250},
    { headerName: '실행시작일시',   field: 'runBgnDt',   width: 190},
    { headerName: '실행종료일시',   field: 'runEndDt',   width: 190},
    { headerName: '소요시간(초)',   field: 'runSec',     width: 105, cellClass: 'align-right', valueFormatter: formatMoney }
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
    runGrpCd: '',
    runStCd: '',
    sttlCyclCd: '',
    runBgnDate: dayJS(),
    runEndDate: dayJS()
});

onMounted(() => {
    initCodeList().then(
        (res) => {
            resetTable();
            getList();
        }
    );
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

};

const onCellDoubleClicked = (e) => {
    e.node.setSelected(!e.node.isSelected());
};

const onChangedPage = async (pagenum) => {
    //console.log(pagenum);
    pager.current = pagenum;
    //테이블 인덱스 번호 처리
    let target = state.tableColum_c.filter(item => item.headerName === '번호');
    if (!_.isEmpty(target)) {
        target[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
    }
    detail.rowData = [];
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
    let selectList = state.gridApi.getSelectedRows();
    if (detailFormData.value.length == 0 && selectList.length > 0) {
        runLogSeCdList.value.forEach((v) => {
            detailFormData.value.push(v.cd);
        });
    }
    detail.rowData = [];
    let promiseTemp = [];
    selectList.forEach((v, i) => {
        promiseTemp.push(_getInstlBatchLogDetailList({runDate: v.runDate, runSn: v.runSn}).then(
            (res) => {
                if (res.data.code == 'OK') {
                    let innerTempList = [];
                    res.data.data.forEach((iv, ii) => {
                        iv.partSn = ii + 1;
                        innerTempList.push(iv);
                    });
                    return innerTempList;
                }
            }
        ));
    });
    Promise.all(promiseTemp).then((values) => {
        let tempList = [];
        values.forEach((pv) => {
            pv.forEach((piv) => {
                tempList.push(piv);
            });
        });
        detail.rowData = tempList;
    });

};

const initParams = () => {
    formData.runGrpCd   = '';
    formData.runStCd    = '';
    formData.sttlCyclCd = '';
    formData.runBgnDate = dayJS();
    formData.runEndDate = dayJS();

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
            runBgnDate: dayJS(formData.runBgnDate).format('YYYYMMDD'),
            runEndDate: dayJS(formData.runEndDate).format('YYYYMMDD'),
            runGrpCd: formData.runGrpCd,
            runStCd: formData.runStCd,
            sttlCyclCd: formData.sttlCyclCd
        };
        
        const response = await _getInstlBatchListPaging(params);

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
        formData.runBgnDate = value[0];
        formData.runEndDate = value[1];
    } else if (type === 'self_end' || type === 'self_start') {
        // 직접 데이터 피커 설정
        if (type === 'self_start') {
            formData.runBgnDate = value;
        } else if (type === 'self_end') {
            formData.runEndDate = value;
        }
    }
};

const onRunDateBlur = (sort) => {
    //배치실행일자 삭제 못하도록..
    if (!_.isDate(formData[sort])) {
        formData[sort] = dayJS();
    }
};

const detailFormData = ref(['1', '2', '3']);

const onGridDetailReady = (params) => {
    detail.gridApi = params.api;
    detail.gridColumApi = params.columnApi;
};

const detail = reactive({
    //테이블데이터
    tableColum_c: [
        { headerName: '프로그램',       field: 'runPgmId',   width: 160, valueFormatter: (params) => formatEngNmOfCd(params, batchPgmCdList)},
        { headerName: '프로그램명',     field: 'runPgmId',   width: 160, valueFormatter: (params) => formatNmOfCd(params, batchPgmCdList)},
        { headerName: '번호',           field: 'partSn',     width: 60},
        { headerName: '실행로그일시',   field: 'runLogDt',   width: 200},
        { headerName: '상태',
            field: 'runLogSeCd',
            width: 120,
            valueFormatter: (params) => formatCdNm(params, runLogSeCdList),
            filter: true,
            filterParams: { readOnly: false }},
        { headerName: '실행로그내용',   field: 'runLogCts',  width: 700, wrapText: true, autoHeight: true, cellRenderer: (param) => _.replace(param.value, /\r\n/g, '<br/>') }
    ],
    filterCoulm: [],
    rowData: [],
    defaultColDef: {
        sortable: true,
        filter: false,
        resizable: true,
        width: 150
    },
    gridApi: null,
    gridColumApi: null
});

const applyFilter = (n) => {
    if (!_.isEmpty(detail.gridApi) && !_.isEmpty(detail.rowData)) {
        if (n.length < runLogSeCdList.value.length && n.length != 0) {
            detail.gridApi.setFilterModel({
                runLogSeCd:
                {
                    conditions: n.map(o => { return {filterType: 'text', type: 'equals', filter: o}; }),
                    filterType: 'text',
                    operator: 'OR'
                }
            });
        } else {
            detail.gridApi.destroyFilter('runLogSeCd');
        }
    }
};

watch(
    detailFormData,
    (n, o) => {
        if (n.length == 0) {
            detail.rowData = [];
        } else if (n.length == 1 && detail.rowData == 0) {
            onRowSelect();
        } else {
            applyFilter(n);
        }
    }
);
</script>
