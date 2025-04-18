<template>
    <div class="custom-link" @click="open">{{props.params.data.pyrId}}</div>
    <DefaultModal :isShow="modalIsShow" :modalName="'sttlBillGenerate'" :modalTitle="'상세검색'"  @modalclose="modalclose" className="ui-modal-wrap-bill" >
		<template #modalcontent>
            <div class="ui-bill-form1">
                <!-- <div class="ui-bill-form-header">
                    <img src="/img/kbhc-logo.png" alt="kb 헬스케어" />
                </div> -->
                <div class="ui-bill-form-content">
                    <!-- <div class="ui-bill-form-title">
                        <h1>상세검색</h1>
                        <span class="date">&nbsp;</span>
                    </div> -->
                    
                    <div class="ui-bill-form-item">
                        <h2>발행정보</h2>
                        <div class="ui-bill-form-item-cont">
                            <div class="tbl-wrap">
                                <table class="table reg">
                                    <colgroup>
                                        <col style="width: 120px;">
                                        <col style="width: auto;">
                                        <col style="width: 120px;">
                                        <col style="width: auto;">
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th scope="row">등록번호</th>
                                            <td>{{detailInfo.invoiceeCorpNum}}</td>
                                            <th scope="row">종사업장</th>
                                            <td>{{detailInfo.invoiceeTaxRegId}}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">상호</th>
                                            <td>{{detailInfo.invoiceeCorpName}}</td>
                                            <th scope="row">성명</th>
                                            <td>{{detailInfo.invoiceeCeoName}}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">등록번호</th>
                                            <td colspan="3">{{detailInfo.invoiceeAddress}}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">업태</th>
                                            <td>{{detailInfo.invoiceeBizType}}</td>
                                            <th scope="row">종목</th>
                                            <td>{{detailInfo.invoiceeBizClass}}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">담당자</th>
                                            <td>{{detailInfo.invoiceeContactName}}</td>
                                            <th scope="row">연락처</th>
                                            <td>{{detailInfo.invoiceeTel}}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">이메일</th>
                                            <td colspan="3">{{detailInfo.invoiceeEmail}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="ui-bill-form-item">
                        <br/>
                        <h2>정산내역</h2>
                        <div class="ui-bill-form-item-cont">
                            <div class="tbl-wrap">
                                <table class="table reg">
                                    <colgroup>
                                        <col style="width: 120px;">
                                        <col style="width: auto;">
                                        <col style="width: 120px;">
                                        <col style="width: auto;">
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th scope="row">발행처</th>
                                            <td  colspan="3">KB헬스케어</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">상품구매임직원수</th>
                                            <td class="right">{{detailInfo.mbrCnt}}명</td>
                                            <th scope="row">구매상품건수</th>
                                            <td class="right">{{detailInfo.prdCnt}}건</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">총청구금액</th>
                                            <td colspan="3" class="right">
                                                <div class="ui-bill-taxArea">{{sttlLib.formatMoney({value:detailInfo.dlngAmt}) }}원
                                                    &nbsp;<SttlMonthlyBillTaxPopup :params="props.params" @onCloseDown="onCloseDown"/>
                                                </div>
                                            </td>
                                            
                                        </tr>
                                        <tr>
                                            <th scope="row">입금은행명(예금주)</th>
                                            <td>%DB%</td>
                                            <th scope="row">기본 입금계좌번호</th>
                                            <td>%DB%</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">*. 기본계좌 이외의 계좌가 필요할 경우, 선택하여 저장 합니다.</td>
                                            <th scope="row">선택 입금계좌번호</th>
                                            <td>%DB%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
                            :suppressRowClickSelection="true" rowSelection="multiple"
                            class="ag-theme-alpine" domLayout="autoHeight">
                        </AgGridVue>
                        <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                            @changedPage="onChangedPage" />
                    </template>
                </div>
            </div>
            <div class=" btn-bottom-set flex justify-center">
                <SttlMonthlyBillButton inDetail :params="detailInfo" @publish="publish"/>
                <!-- actionBtns('maskingFault')  -->
                <SttlMonthlyBillPopup :params="props.params" :detailInfo="detailInfo" @onCloseDown="onCloseDown" />
                <button class="btn btn-sl nega" type="button" @click="modalclose">
                    확인
                </button>
            </div>
		</template>
	</DefaultModal>
</template>
<script setup>
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { _getCodeApply, _getInstlMonthlyStarRsdetail, _getInstlMonthlyStarRsdetailListPaging } from '@/api/sttl.js';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import {sttlLib} from './module/sttlLib';
import SttlSelectBox from './component/SttlSelectBox.vue';
import SttlMonthlyBillButton from './SttlMonthlyBillButton.vue';
import SttlMonthlyBillPopup from './SttlMonthlyBillPopup.vue';
import SttlMonthlyBillTaxPopup from './SttlMonthlyBillTaxPopup.vue';
const starDlngSeCdList = ref([]);
const starSttlSeCdList = ref([]);

const $Modal = inject('$Modal');
const modalIsShow = ref(false);
const detailInfo = reactive({
    dlngAmt: '',
    invoiceeCorpNum: '',
    invoiceeAddress: '',
    invoiceeBizClass: '',
    invoiceeBizType: '',
    invoiceeCeoName: '',
    invoiceeContactName: '',
    invoiceeCorpName: '',
    invoiceeEmail: '',
    invoiceeTel: '',
    invoiceeTaxRegId: '',
    mbrCnt: '',
    prdCnt: '',
    spvl: '',
    sttlEps: '',
    sttlYm: '',
    tbiPlDate: '',
    vat: ''
});


// 페이징 처리
const pager = reactive({
    current: 1,
    currentPageSize: 1,
    size: computed(() => state.pagesize),
    offset: computed(() => (pager.current - 1) * pager.size),
    totalCnt: 0
});

// 테이블 현재창에 맞춤
const sizeToFit = () => {
    state.gridApi.sizeColumnsToFit();
};

// 컬럼 변경
const resetTable = () => {
    state.tableColum_c = _.union(selectCol, initColum.value.filter(item => !state.filterCoulm.includes(item.headerName)));
    return state.filterCoulm;
};


const props = defineProps({
    params: Object
});
const emit = defineEmits(['publish']);

const modalclose = async (btn, name) => {
    console.log(btn, name);
    if (btn === 'modalconfirm') {
        // $Modal.confirm({
        //     title: '',
        //     message: '수정을 진행합니다.',
        //     buttonText: {
        //         confirm: '확인',
        //         cancel: '취소'
        //     }
        // }).then(success => {
        //     console.log(success);
        //     $Modal.alert({ message: '일자가 변경되었습니다.', buttonText: { ok: '확인' } });
        //     modalIsShow.value = false;
        // }).catch(error => {
        //     console.log(error);
        // });
        modalIsShow.value = false;
    } else {
        modalIsShow.value = false;
    }
};

const publish = () => {
    props.params.getList();
    modalclose();
};

const onCloseDown = () => {
    modalIsShow.value = false;
    window.setTimeout(() => {
        modalIsShow.value = true;
    }, 0);
};

const open = async () => {
    console.log(props.params.data);
    modalIsShow.value = true;
    getDataInfo();
    getDataList();
    
};

const getDataInfo = async () => {
    await _getCodeApply('STAR_DLNG_SE_CD', starDlngSeCdList);
    await _getCodeApply('STAR_STTL_SE_CD', starSttlSeCdList);
    const response = await _getInstlMonthlyStarRsdetail({ ...props.params.data });
    if (response.data) {
        Object.keys(response.data.data).forEach(key => {
            detailInfo[key] = response.data.data[key];
        });
    }
};

const getDataList = async () => {
    const response = await _getInstlMonthlyStarRsdetailListPaging({
        size: pager.size,
        offset: pager.offset,
        ...props.params.data
    });
    state.rowData = response.data.data.list;
    pager.totalCnt = response.data.data.totalCnt;
};

//페이지당 리스트 게수 선택 옵션
const selectedOptions = (value, type) => {
    state.pagesize = value;
    onChangedPage(1);
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
    await getDataList();
};

const constColum = [
    { headerName: '이름',             field: 'mbrNm',       width: 100 },
    { headerName: 'ID',             field: '',       width: 100 },
    { headerName: '사번',             field: '',       width: 100 },
    { headerName: '성별',             field: 'mbrSexCdNm',       width: 100 },
    { headerName: '이메일',             field: 'mbrEmadEncrVl',       width: 100 },
    { headerName: '스타종류',       field: 'starSttlSeCd',          width: 150, valueFormatter: (params) => sttlLib.formatCdNm(params, starSttlSeCdList) },
    { headerName: '스타',          field: 'dlngAmt',          width: 120, cellClass: 'align-right', valueFormatter: sttlLib.formatMoney},
    { headerName: '일시',             field: 'dlngDt',       width: 120 },
    { headerName: '상태',             field: 'starDlngSeCd',       width: 100, valueFormatter: (params) => sttlLib.formatCdNm(params, starDlngSeCdList)  },
    { headerName: '상품코드',             field: 'prdId',       width: 100 },
    { headerName: '상품명',             field: 'prdNm',       width: 100 }
];

const initColum = ref([]);

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
    list: [],
    pagesize: 50,
    mskgnRlsYn: true,
    mskgnTried: false // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
});

// 테이블 리사이징을 위한 참조값
const onGridReady = (params) => {
    state.gridApi = params.api;
    state.gridColumApi = params.columnApi;
};

// 셀클릭 이벤트처리 함수
const cellClicked = (e) => {
    console.log(e);
};

const getRowClass = (params) => {
    if (params.node.data.dataVrfcErrYn === 'Y') {
        return 'row-data-warning';
    }
};

defineExpose({
    open
});

</script>
<style>
.ui-modal-wrap-bill {
    width: 1260px !important;
}
.ui-bill-form1 {
    width: 1180px !important;
    margin: 0 auto;
    border: 1px solid #eee;
}
.custom-link{
    color:blue !important;
    cursor: pointer;
}
.right{
    text-align: right
}
.ui-bill-taxArea {
    display: flex;
    justify-content: end;
    align-items: center;
}


</style>