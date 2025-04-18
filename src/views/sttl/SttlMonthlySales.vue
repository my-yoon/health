<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <SettlePeriodMonth v-model:bgnYm="formData.sttlBgnYm" v-model:endYm="formData.sttlEndYm" ref="fromToDateRef" />
                <SettleSeq v-model="formData.sttlEps" />
                <Channel v-model="formData.chnSeCd" />
                <SlsSe v-model="formData.slsSeCd" />
                
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
                <!-- 상세검색 -->
               
            </div>
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <Progress v-model="formData.odrStCd" />
                    <BizSearch v-model:bizSearchType="formData.bizSearchType" v-model:searchBiz="formData.searchBiz"/>
                    <!-- <SelectYn v-model="formData.tbiPlYn">세금계산서발행여부</SelectYn>
                    <SelectYn v-model="formData.dcnYn">확정여부</SelectYn> -->
                </div>
            </div>
        </div>
        <div class="ui-section">
            <div class="ui-title-3">
                <h3>매출집계</h3>
            </div>
            <div class="ui-content">
                <div class="table-list w-900">
                    <table class="table list">
                        <colgroup>
                            <col style="width: 11.1111%">
                            <col style="width: 11.1111%">
                            <col style="width: 11.1111%">
                            <col style="width: 11.1111%">
                            <col style="width: 11.1111%">
                            <col style="width: 11.1111%">
                            <col style="width: 11.1111%">
                            <col style="width: 11.1111%">
                            <col style="width: 11.1111%">
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col" class="th-g" colspan="3">카드</th>
                                <th scope="col" class="th-g" colspan="3">스타</th>
                                <th scope="col" class="th-g" colspan="3">매출</th>
                            </tr>
                            <tr>
                                <th scope="col" class="th-g">완료</th>
                                <th scope="col" class="th-g">취소</th>
                                <th scope="col" class="th-g">합계</th>
                                <th scope="col" class="th-g">완료</th>
                                <th scope="col" class="th-g">취소</th>
                                <th scope="col" class="th-g">합계</th>
                                <th scope="col" class="th-g">완료</th>
                                <th scope="col" class="th-g">취소</th>
                                <th scope="col" class="th-g">합계</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="t-right">{{ formatMoney({value : state.totalRst.cardAprvAmt })}}</td>
                                <td class="t-right">{{ formatMoney({value : state.totalRst.cardCnclAmt })}}</td>
                                <td class="t-right">{{ formatMoney({value : state.totalRst.cardTotalAmt })}}</td>
                                <td class="t-right">{{ formatMoney({value : state.totalRst.starAprvAmt })}}</td>
                                <td class="t-right">{{ formatMoney({value : state.totalRst.starCnclAmt })}}</td>
                                <td class="t-right">{{ formatMoney({value : state.totalRst.starTotalAmt })}}</td>
                                <td class="t-right">{{ formatMoney({value : state.totalRst.aprvAmt })}}</td>
                                <td class="t-right">{{ formatMoney({value : state.totalRst.cnclAmt })}}</td>
                                <td class="t-right">{{ formatMoney({value : state.totalRst.totalAmt })}}</td>

                                
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
                        </div>
                        <!-- <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn()"
                            :disabled="!state.mskgnRlsYn || state.mskgnTried">
                            마스킹해제
                        </button> -->
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
                <!-- <columlist :columlists="initColum" @checkColum="checkOptions"/> -->
                <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData?.length === 0"></NoData>
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
import { _getCodeApply, _getInstlMonthlyStarSlslist } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';
import Channel from './searchFilters/Channel.vue';
import SettleSeq from './searchFilters/SettleSeq.vue';
import SelectYn from './searchFilters/SelectYn.vue';
import Progress from './searchFilters/Progress.vue';
import BizSearch from './searchFilters/BizSearch.vue';
import SettlePeriodMonth from './searchFilters/SettlePeriodMonth.vue';
import SlsSe from './searchFilters/SlsSe.vue';


const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

// const chnSeCdList = ref([]);
// const txtnSeCdList = ref([]);
const odrStCdList = ref([]);

const fromToDateRef = ref(null);

const initCodeList = () => {
    let promiseTemp = [];
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
    { headerName: '정산년월',             field: 'sttlYm',       width: 100 },
    { headerName: '정산회차',           field: 'sttlEps',         width: 90, headerClass: 'centered', cellClass: 'centered' },
    { headerName: '채널',               field: 'chnSeCd',        width: 60 },
    { headerName: '페이어구분',           field: 'pyrSttlSeCd',   width: 160 },
    { headerName: '페이어ID',         field: 'pyrId',       width: 100},
    { headerName: '페이어명',         field: 'mbrNm',          width: 100 },
    { headerName: '완료',           field: 'aprvAmt',    width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '취소',         field: 'cnclAmt',        width: 120, cellClass: 'align-right', valueFormatter: formatMoney },
    { headerName: '합계',       field: 'totalAmt',         width: 120, cellClass: 'align-right', valueFormatter: formatMoney }
];

const starColum = [
    { headerName: '기본정보',
        marryChildren: true,
        children: [
            { headerName: '정산년월',             field: 'sttlYm',       width: 100 },
            { headerName: '정산회차',           field: 'sttlEps',         width: 90, headerClass: 'centered', cellClass: 'centered' },
            { headerName: '채널',               field: 'chnSeCd',        width: 60 },
            { headerName: '페이어ID',         field: 'pyrId',       width: 100},
            { headerName: '페이어명',         field: 'pyrNm',          width: 100 }
        ]
    },
    { headerName: '선불스타(PA)',
        marryChildren: true,
        children: [
            { headerName: '완료',          field: 'paStarAprvAmt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '취소',          field: 'paStarCnclAmt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '합계',          field: 'paStarAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney}
        ]},
    { headerName: '후불사용형스타(PL)',
        marryChildren: true,
        children: [
            { headerName: '완료',          field: 'plStarAprvAmt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '취소',          field: 'plStarCnclAmt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '합계',          field: 'plStarAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney}
        ]},
    { headerName: '후불등록형스타(PR)',
        marryChildren: true,
        children: [
            { headerName: '완료',          field: 'prStarAprvAmt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '취소',          field: 'prStarCnclAmt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '합계',          field: 'prStarAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney}
        ]},
    { headerName: '스타매출',
        marryChildren: true,
        children: [
            { headerName: '완료',          field: 'starAprvAmt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '취소',          field: 'starCnclAmt',          width: 120, cellClass: 'align-right', valueFormatter: formatMoney},
            { headerName: '합계',          field: 'starAmt',           width: 120, cellClass: 'align-right', valueFormatter: formatMoney}
        ]}
];

const initColum = ref([]);

const MAX_ITEM = 30;
const DEFAULT_WIDTH = 130;

const initColumInitialize = column => {
    initColum.value = _.clone(column);
};

initColumInitialize(constColum);

const state = reactive({
    //테이블데이터
    tableColum_c: [...initColum.value],
    filterCoulm: [],
    totalRst: {
        cardAprvAmt: 0,
        cardCnclAmt: 0,
        cardTotalAmt: 0,
        starAprvAmt: 0,
        starCnclAmt: 0,
        starTotalAmt: 0,
        aprvAmt: 0,
        cnclAmt: 0,
        totalAmt: 0
    },
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
    slsSeCd: 'S',
    odrStCd: '',
    bizSearchType: '',
    searchBiz: '',
    // tbiPlYn: '',
    // dcnYn: '',
    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),
        sttlBgnYm: computed(() => formData.sttlBgnYm),
        sttlEndYm: computed(() => formData.sttlEndYm),
        sttlEps: computed(() => formData.sttlEps),
        chnSeCd: computed(() => formData.chnSeCd),
        slsSeCd: computed(() => formData.slsSeCd),
        odrStCd: computed(() => formData.odrStCd),
        pyrId: computed(() => (formData.bizSearchType == 'pyrId' && (!_.isEmpty(formData.searchBiz) || _.isNumber(formData.searchBiz)) ? formData.searchBiz : '')),
        selrId: computed(() => (formData.bizSearchType == 'selrId' && (!_.isEmpty(formData.searchBiz) || _.isNumber(formData.searchBiz)) ? formData.searchBiz : '')),
        // tbiPlYn: computed(() => formData.tbiPlYn),
        // dcnYn: computed(() => formData.dcnYn),
        mskgnRlsYn: computed(() => formData.mskgnRlsYn)
    },
    url: '/common/api/v1/instl/mtlyStar/slslistExcel'
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
    formData.slsSeCd = 'S';
    formData.odrStCd = '';
    formData.bizSearchType = '';
    formData.searchBiz = '';
    // formData.tbiPlYn = '';
    // formData.dcnYn = '';
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
            slsSeCd: formData.slsSeCd,
            odrStCd: formData.odrStCd,
            // tbiPlYn: formData.tbiPlYn,
            // dcnYn: formData.dcnYn,
            mskgnRlsYn: formData.mskgnRlsYn
        };

        if (!_.isEmpty(formData.bizSearchType)) {
            if (!_.isEmpty(formData.searchBiz) || _.isNumber(formData.searchBiz)) {
                params[formData.bizSearchType] = formData.searchBiz;
            }
        }

        if (formData.searchBiz && _.isEmpty(formData.bizSearchType)) {
            params['pyrId'] = formData.searchBiz;
            params['selrId'] = formData.searchBiz;
        }
        
        const response = await _getInstlMonthlyStarSlslist(params);

        state.rowData = response.data.data.list;

        if (pager.offset === 0) {
            state.totalRst = response.data.data.total;
        }

        if (formData.slsSeCd === 'S') {
            initColumInitialize(starColum);
            state.tableColum_c = [...initColum.value];
        } else {
            initColumInitialize(constColum);
            state.tableColum_c = [...initColum.value];
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

</script>
