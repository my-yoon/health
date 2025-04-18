<template>
    <button type="button" class="btn btn-ss" @click="open">거래명세서 확인</button>
    <DefaultModal :isShow="modalIsShow" :modalName="'sttlTaxBill'" :modalTitle="'거래명세서'" @modalclose="modalclose" className="tradingPop">
		<template #modalcontent>
            <div class="ui-modal-body">
                <div class="ui-section">
                    <div class="ui-title-3">
                        <h3>매입 집계</h3>
                        <!-- <div class="abs">
                            <button type="button" class="btn btn-ss">수정하기</button>
                        </div> -->
                    </div>
                    <div class="ui-content">
                        <div class="tbl-wrap">
                            <table class="table list">
                                <colgroup>
                                    <col style="width: auto">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th colspan="2" class="th-g">셀러</th>
                                        <th colspan="3" class="th-g">순매입</th>
                                        <th colspan="3" class="th-g">매입</th>
                                        <th colspan="3" class="th-g">페널티</th>
                                    </tr>
                                    <tr>
                                        <th class="th-g">업체코드</th>
                                        <th class="th-g">업체명</th>
                                        <th class="th-g">정산금액</th>
                                        <th class="th-g">공급가액</th>
                                        <th class="th-g">부가가치세</th>
                                        <th class="th-g">정산금액</th>
                                        <th class="th-g">공급가액</th>
                                        <th class="th-g">부가가치세</th>
                                        <th class="th-g">정산금액</th>
                                        <th class="th-g">공급가액</th>
                                        <th class="th-g">부가가치세</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="center">{{props.params[0].selrId}}</td>
                                        <td class="center">{{props.params[0].selrNm}}</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:state.total.totPurSttlAmt})}}</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:state.total.totPurSttlSpvl})}}</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:state.total.totPurSttlVat})}}</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:state.total.purSttlAmt})}}</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:state.total.purSttlSpvl})}}</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:state.total.purSttlVat})}}</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:state.total.pnltPurSttlAmt})}}</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:state.total.pnltPurSttlSpvl})}}</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:state.total.pnltPurSttlVat})}}</td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="ui-section">
                    <div class="ui-title-3">
                        <h3>거래명세서</h3>
                        <!-- <div class="abs">
                            <button type="button" class="btn btn-ss">수정하기</button>
                        </div> -->
                    </div>
                    <div class="ui-content">
                        <div class="tbl-wrap">
                            <div class="table-util flex space-between">
                                <div class="btn-set-m flex">
                                    <div class="btn-set-m flex">
                                        
                                    </div>
                                    <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn(1)"
                                        :disabled="!state.mskgnRlsYn1 || state.mskgnTried1">
                                        마스킹해제
                                    </button>
                                </div>
                                <div class="btn-set-m flex align-end">
                                    <span class="table-total">조회결과 총 <strong>{{ pager1.totalCnt }}</strong>건</span>
                                    <button type="button" class="btn btn-opt"
                                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams1)">
                                        <span class="ico-download"></span>파일다운로드
                                    </button>
                                    <SttlSelectBox :selectType="'page'" @changedValue="selectedOptions1" />
                
                                    <!-- <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit(1)">
                                        <span class="offscreen">컬럼 리사이징</span>
                                    </button> -->
                                    <!-- 클래스 : full -->
                                    <!-- 클래스 : close -->
                                    <!-- <button type="button" class="btn btn-opt-ico filter" @click="resetTable">
                                        <span class="offscreen">컬럼 셋팅</span>
                                    </button> -->
                                </div>
                            </div>
                            <!-- <columlist :columlists="initColum1" @checkColum="checkOptions1"/> -->
                            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData1.length === 0"></NoData>
                            <template v-else>
                                <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c1"
                                    :rowData="state.rowData1" @grid-ready="onGridReady1"
                                    class="ag-theme-alpine" domLayout="autoHeight">
                                </AgGridVue>
                                <PageNavigation :cntPerPage='pager1.size' :itemCount='pager1.totalCnt' :currentPage="pager1.current"
                                    @changedPage="onChangedPage1" />
                            </template>
                        </div>
                    </div>
                </div>
                <div class="ui-section">
                    <div class="ui-title-3">
                        <h3>패널티명세서</h3>
                        <!-- <div class="abs">
                            <button type="button" class="btn btn-ss">수정하기</button>
                        </div> -->
                    </div>
                    <div class="ui-content">
                        <div class="tbl-wrap">
                            <div class="table-util flex space-between">
                                <div class="btn-set-m flex">
                                    <div class="btn-set-m flex">
                                    </div>
                                    <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn(2)"
                                        :disabled="!state.mskgnRlsYn2 || state.mskgnTried2">
                                        마스킹해제
                                    </button>
                                </div>
                                <div class="btn-set-m flex align-end">
                                    <span class="table-total">조회결과 총 <strong>{{ pager2.totalCnt }}</strong>건</span>
                                    <button type="button" class="btn btn-opt"
                                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams2)">
                                        <span class="ico-download"></span>파일다운로드
                                    </button>
                                    <SttlSelectBox :selectType="'page'" @changedValue="selectedOptions2" />
                
                                    <!-- <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit(2)">
                                        <span class="offscreen">컬럼 리사이징</span>
                                    </button> -->
                                    <!-- 클래스 : full -->
                                    <!-- 클래스 : close -->
                                    <!-- <button type="button" class="btn btn-opt-ico filter" @click="resetTable">
                                        <span class="offscreen">컬럼 셋팅</span>
                                    </button> -->
                                </div>
                            </div>
                            <!-- <columlist :columlists="initColum2" @checkColum="checkOptions2"/> -->
                            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData2.length === 0"></NoData>
                            <template v-else>
                                <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c2"
                                    :rowData="state.rowData2" @grid-ready="onGridReady2"
                                    class="ag-theme-alpine" domLayout="autoHeight">
                                </AgGridVue>
                                <PageNavigation :cntPerPage='pager2.size' :itemCount='pager2.totalCnt' :currentPage="pager2.current"
                                    @changedPage="onChangedPage2" />
                            </template>
                        </div>
                    </div>
                </div>
                
                <div class=" btn-bottom-set flex justify-center">
                    <button class="btn btn-sl nega" type="button" @click="modalclose">
                        확인
                    </button>
                </div>
            </div>
		</template>
	</DefaultModal>
</template>
<script setup>
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { inject, onMounted, reactive, ref, computed } from 'vue';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
const store = useStore();
const dayJS = inject('dayJS');
import { _getCodeApply, _getInstlCmrcMtlyDlngListPaging, _getInstlCmrcMtlyPnltListPaging } from '@/api/sttl.js';
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
import { sttlLib } from './module/sttlLib';
const $Modal = inject('$Modal');
const props = defineProps({
    params: Object,
    cdList: Array
});
const modalIsShow = ref(false);
const odrStCdList = ref([]);
const txtnSeCdList = ref([]);

const emit = defineEmits(['onCloseDown']);
const modalclose = async (btn, name) => {
    console.log(btn, name);
    if (btn === 'modalconfirm') {
        // emit('onCloseDown');
    } else {
        modalIsShow.value = false;
        emit('onCloseDown');
    }
};

const initCodeList = async () => {
    let promiseTemp = [];
    promiseTemp.push(_getCodeApply('TXTN_SE_CD', txtnSeCdList));
    promiseTemp.push(_getCodeApply('ODR_ST_CD', odrStCdList));
    return Promise.all(promiseTemp);
};



const open = () => {
    if (props.params?.length > 0) {
        modalIsShow.value = true;
        getDataInfo();
    } else {
        $Modal.alert({ message: '선택된 목록이 없습니다.', buttonText: { ok: '확인' } });
    }
};

// 페이징 처리
const pager1 = reactive({
    current: 1,
    currentPageSize: 1,
    size: computed(() => state.pagesize1),
    offset: computed(() => (pager1.current - 1) * pager1.size),
    totalCnt: 0
});

// 페이징 처리
const pager2 = reactive({
    current: 1,
    currentPageSize: 1,
    size: computed(() => state.pagesize2),
    offset: computed(() => (pager2.current - 1) * pager2.size),
    totalCnt: 0
});


const getDataInfo = async () => {
    getList1();
    getList2();
};

const getList1 = async () => {
    const response = await _getInstlCmrcMtlyDlngListPaging(
        { ...props.params[0],
            size: pager1.size,
            offset: pager1.offset,
            mskgnRlsYn: state.mskgnRlsYn1
        });
    if (response.data) {
        state.rowData1 = response.data.data.list;
        if (response.data.data.total) {
            state.total = response.data.data.total;
        }
        pager1.totalCnt = response.data.data.totalCnt;
        state.mskgnTried1 = false;
    }
};

const getList2 = async () => {
    const response = await _getInstlCmrcMtlyPnltListPaging(
        { ...props.params[0],
            size: pager2.size,
            offset: pager2.offset,
            mskgnRlsYn: state.mskgnRlsYn2
        });
    if (response.data) {
        state.rowData2 = response.data.data.list;
        pager2.totalCnt = response.data.data.totalCnt;
        state.mskgnTried2 = false;
    }
};

// 마스킹 권한 체크
const changeMskgnRlsYn = async (type) => {
    if (!state['mskgnTried' + type]) {
        await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
    }
};

const onChangedPage1 = async (pagenum) => {
    //console.log(pagenum);
    pager1.current = pagenum;
    //테이블 인덱스 번호 처리
    let target = state.tableColum_c1.filter(item => item.headerName === '번호');
    if (!_.isEmpty(target)) {
        target[0].valueGetter = 'node.rowIndex + ' + Number(pager1.size * (pager1.current - 1) + 1);
    }
    //api호출
    await getList1();
};

const onChangedPage2 = async (pagenum) => {
    //console.log(pagenum);
    pager2.current = pagenum;
    //테이블 인덱스 번호 처리
    let target = state.tableColum_c2.filter(item => item.headerName === '번호');
    if (!_.isEmpty(target)) {
        target[0].valueGetter = 'node.rowIndex + ' + Number(pager2.size * (pager2.current - 1) + 1);
    }
    //api호출
    await getList2();
};

//마스킹 해제 처리 후 리스트 재조회 
const onChangeMskgn = async () => {
    state.mskgnRlsYn = !state.mskgnRlsYn;
    await onChangedPage(1);
    state.mskgnTried = true;
};

const constColum1 = [
    { headerName: '채널',               field: 'chnSeCd',        width: 60 },
    { headerName: '대분류',           field: 'prdMjcsNm',          width: 120 },
    { headerName: '중분류',           field: 'prdMdcsNm',          width: 120 },
    { headerName: '소분류',           field: 'prdMncsNm',          width: 120 },
    { headerName: '상품명',           field: 'prdNm',          width: 120 },
    { headerName: '진행상태',           field: 'odrStCd',          width: 120, valueFormatter: (params) => sttlLib.formatCdNm(params,  odrStCdList) },
    { headerName: '건수',           field: 'saleCunt',          width: 120 },
    { headerName: '판매금액',           field: 'saleAmt',    width: 120, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '판매공급가액',           field: 'saleSpvl',    width: 120, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '판매부가가치세',           field: 'saleVat',    width: 120, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '고객결제금액',           field: 'cstPymtAmt',    width: 120, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '고객결제공급가액',           field: 'cstPymtSpvl',    width: 120, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '고객결제부가가치세',           field: 'cstPymtVat',    width: 120, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '선불스타',           field: 'paStarAmt',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '후불스타',           field: 'plStarAmt',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '포인트',           field: 'pntAmt',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '입점사부담쿠폰',           field: 'encmpBdnCpnAmt',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '유통사부담쿠폰',           field: 'dstbrBdnCpnAmt',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '마일리지부채',           field: 'mlgLib',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '마일리지비용',           field: 'mlgCost',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '프로모션금액',           field: 'prmtnAmt',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '과세구분',                field: 'txtnSeCd',  valueFormatter: (params) => sttlLib.formatCdNm(params, txtnSeCdList) },
    { headerName: '수수료율',          field: 'encmpFeeRt',          width: 120, cellClass: 'align-right'},
    { headerName: '매입정산금액',           field: 'purSttlAmt',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '매입공급가액',           field: 'purSttlSpvl',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '매입부가가치세',           field: 'purSttlVat',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney }
];

const constColum2 = [
    { headerName: '채널',               field: 'chnSeCd',        width: 60 },
    { headerName: '주문번호',           field: 'odrId',          width: 120 },
    { headerName: '주문상세번호',           field: 'odrDtlId',          width: 120 },
    { headerName: '대분류',           field: 'prdMjcsNm',          width: 120 },
    { headerName: '중분류',           field: 'prdMdcsNm',          width: 120 },
    { headerName: '소분류',           field: 'prdMncsNm',          width: 120 },
    { headerName: '상품명',           field: 'prdNm',          width: 120 },
    { headerName: '패널티일시',           field: 'selrPnltDt',          width: 120 },
    { headerName: '패널티사유',           field: 'selrPnltRsn',          width: 120 },
    { headerName: '패널티금액',           field: 'selrPnltAmt',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '매입정산금액',           field: 'purSttlAmt',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '매입공급가액',           field: 'purSttlSpvl',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney },
    { headerName: '매입부가가치세',           field: 'purSttlVat',    width: 140, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney }
];

// 테이블 리사이징을 위한 참조값
const onGridReady1 = (params) => {
    state.gridApi1 = params.api;
};

const onGridReady2 = (params) => {
    state.gridApi2 = params.api;
};


const initColum1 = ref([]);
const initColum2 = ref([]);

const initColumInitialize = () => {
    initColum1.value = _.clone(constColum1);
    initColum2.value = _.clone(constColum2);
};

initColumInitialize();
const state = reactive({
    //테이블데이터
    tableColum_c1: [...initColum1.value],
    tableColum_c2: [...initColum2.value],
    filterCoulm1: [],
    filterCoulm2: [],
    rowData1: [],
    total: {
        cstPymtAmt: 0,
        dstbrBdnCpnAmt: 0,
        encmpBdnCpnAmt: 0,
        mlgCost: 0,
        mlgLib: 0,
        paStarAmt: 0,
        plStarAmt: 0,
        pnltPurSttlAmt: 0,
        pnltPurSttlSpvl: 0,
        pnltPurSttlVat: 0,
        pntAmt: 0,
        prmtnAmt: 0,
        purSttlAmt: 0,
        purSttlSpvl: 0,
        purSttlVat: 0,
        saleAmt: 0,
        selrPnltAmt: 0,
        totPurSttlAmt: 0,
        totPurSttlSpvl: 0,
        totPurSttlVat: 0
    },
    rowData2: [],
    defaultColDef: {
        sortable: true,
        filter: false,
        resizable: true,
        width: 150
    },
    gridApi1: null,
    gridApi2: null,
    list: [],
    pagesize1: 50,
    pagesize2: 50,
    mskgnRlsYn1: true,
    mskgnRlsYn2: true,
    mskgnTried1: false, // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
    mskgnTried2: false // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
});


const exelParams1 = reactive({
    params: {
        sttlYm: computed(() => props.params?.[0].sttlYm),
        sttlEps: computed(() => props.params?.[0].sttlEps),
        chnSeCd: computed(() => props.params?.[0].chnSeCd),
        selrId: computed(() => props.params?.[0].selrId),
        mskgnRlsYn: computed(() => state.mskgnRlsYn1)
    },
    url: '/common/api/v1/instl/cmrc/mtly/dlnglistExcel'
});

const exelParams2 = reactive({
    params: {
        sttlYm: computed(() => props.params?.[0].sttlYm),
        sttlEps: computed(() => props.params?.[0].sttlEps),
        chnSeCd: computed(() => props.params?.[0].chnSeCd),
        selrId: computed(() => props.params?.[0].selrId),
        mskgnRlsYn: computed(() => state.mskgnRlsYn2)
    },
    url: '/common/api/v1/instl/cmrc/mtly/pnltlistExcel'
});

// 테이블 현재창에 맞춤
const sizeToFit = (type) => {
    state['gridApi' + type].sizeColumnsToFit();

};

// 삭제할 컬럼 선택
const checkOptions1 = (value) => {
    state.filterCoulm = value;
};

const checkOptions2 = (value) => {
    state.filterCoulm = value;
};

//페이지당 리스트 게수 선택 옵션
const selectedOptions1 = (value, type) => {
    state.pagesize1 = value;
    onChangedPage(1);
};

const selectedOptions2 = (value, type) => {
    state.pagesize2 = value;
    onChangedPage(1);
};

onMounted(() => {
    odrStCdList.value = [...props.cdList];
    initCodeList();
});

</script>
<style>
.none-select{
    user-select: none;
}
.tradingPop{
    width: 1440px !important;
}
</style>