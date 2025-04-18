<template>
    <!-- 검색 -->
    <div class="ui-data-filter">
        <div class="form-item">
            <div class="item">
                <SttlDateSerch :dateTitle="'정산일자'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="'yesterday'" ref="dateSearch" />
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
                    <label>거래상태</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.pgDlngStNm">
                                <option value="">전체</option>
                                <option v-for="(item) in pgDlngStNmList" :value="item.cd">{{ item.nm }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>지불수단</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.pgPayMthNm">
                                <option value="">전체</option>
                                <option v-for="(item) in pgPayMthNmList" :value="item.cd">{{ item.nm }}</option>
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
                                <option value="pgOdrNo">주문번호</option>
                                <option value="cardAprvNo">승인번호</option>
                                <option value="pcsrNm">구매자</option>
                                <option value="prdNm">상품명</option>
                                <option value="crcdAflnNm">카드계열</option>
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
            <h3>일별 승인현황</h3>
        </div>
        <div class="ui-content">
            <div class="table-list w-800">
                <table class="table list">
                    <colgroup>
                        <col style="width: 16.6666%">
                        <col style="width: 16.6666%">
                        <col style="width: 16.6666%">
                        <col style="width: 16.6666%">
                        <col style="width: 16.6666%">
                        <col style="width: 16.6666%">
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col" colspan="2" class="th-g">합계</th>
                            <th scope="col" colspan="2" class="th-g">승인</th>
                            <th scope="col" colspan="2" class="th-g">취소</th>
                        </tr>
                        <tr>
                            <th scope="col">건수</th>
                            <th scope="col">총액(원)</th>
                            <th scope="col">건수</th>
                            <th scope="col">총액(원)</th>
                            <th scope="col">건수</th>
                            <th scope="col">총액(원)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="t-right">{{ formatMoney({value : state.totalRst.totalCnt}) }}</td>
                            <td class="t-right">{{ formatMoney({value : state.totalRst.totalAmt}) }}</td>
                            <td class="t-right">{{ formatMoney({value : state.totalRst.aprvCnt}) }}</td>
                            <td class="t-right">{{ formatMoney({value : state.totalRst.aprvAmt}) }}</td>
                            <td class="t-right">{{ formatMoney({value : state.totalRst.cnclCnt}) }}</td>
                            <td class="t-right">{{ formatMoney({value : state.totalRst.cnclAmt}) }}</td>
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
                        :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked"
                        @cell-double-clicked="onCellDoubleClicked" :suppressRowClickSelection="true" @selection-changed="onRowSelect"
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
</style>
<script setup>
import { getCurrentInstance, computed, reactive, inject, onMounted, onUnmounted, ref, watchEffect, watch, toDisplayString  } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import SttlDateSerch from './component/SttlDateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply, _getInstlPgAprvListPaging } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

const pgDlngStNmList = ref([
    {cd: '승인', nm: '승인'},
    {cd: '취소', nm: '취소'}
]);

const pgPayMthNmList = ref([
    {cd: 'ISP', nm: 'ISP'},
    {cd: '신용카드', nm: '신용카드'},
    {cd: '실시간계좌이체', nm: '실시간계좌이체'}
]);

const chnSeCdList = ref([]);

const dateSearch = ref(null);

const initCodeList = () => {
    let promiseTemp = [];
    promiseTemp.push(_getCodeApply('CHN_SE_CD', chnSeCdList));
    return Promise.all(promiseTemp);
};

const dateFormat = 'yyyy-MM-dd';
const formatMoney = (params) => {
    return _.replace(params.value, /(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

const selectCol = [];
const constColum = [
    { headerName: '정산일자',             field: 'sttlDate',           width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
    { headerName: '정산순번',             field: 'sttlSn',             width: 85, cellClass: 'centered'},
    { headerName: 'PG조회일자',           field: 'pgInqDate',          valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
    { headerName: 'PG지급수단명',         field: 'pgPayMthNm'         },
    { headerName: 'PG거래ID',             field: 'pgDlngId'           },
    { headerName: 'PG주문번호',           field: 'pgOdrNo'            },
    { headerName: 'PG승인일자',           field: 'pgAprvDate',         valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
    { headerName: 'PG취소일자',           field: 'pgCnclDate',         valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
    { headerName: '거래금액',             field: 'dlngAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: 'PG거래상태명',         field: 'pgDlngStNm'         },
    { headerName: '제휴할인금액',         field: 'asocDcAmt',          cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '제휴할인명',           field: 'asocDcNm'           },
    { headerName: 'PG상점ID',             field: 'pgStreId'           },
    { headerName: '채널구분코드',         field: 'chnSeCd'            },
    { headerName: '간편결제구분명',       field: 'splPymtSeNm'        },
    { headerName: '원본PG거래ID',         field: 'orgnPgDlngId'       },
    { headerName: 'PG승인시간',           field: 'pgAprvTm',           valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS('20230101' + params.value, 'YYYYMMDDHHmmss').format('hh:mm:ss')},
    { headerName: 'PG취소시간',           field: 'pgCnclTm',           valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS('20230101' + params.value, 'YYYYMMDDHHmmss').format('hh:mm:ss')},
    { headerName: '신용카드요청금액',     field: 'crcdRqstAmt',        cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '신용카드금액',         field: 'crcdAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '부분취소잔액',         field: 'partCnclBal',        cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '과세금액',             field: 'txtnAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '면세금액',             field: 'txfrAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '부가가치세',           field: 'vat',                cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '카드승인번호',         field: 'cardAprvNo'         },
    { headerName: '취소구분명',           field: 'cnclSeNm'           },
    { headerName: '신용카드PG거래ID',     field: 'crcdPgDlngId'       },
    { headerName: 'ARSPG거래ID',          field: 'arsPgDlngId'        },
    { headerName: '구매자명',             field: 'pcsrNm'             },
    { headerName: '상품명',               field: 'prdNm'              },
    { headerName: '신용카드계열명',       field: 'crcdAflnNm'         },
    { headerName: '화폐코드',             field: 'curCd'              },
    { headerName: '환율',                 field: 'xcrt',               cellClass: 'align-right'},
    { headerName: '제휴포인트금액',       field: 'asocPntAmt',         cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '선할인금액',           field: 'preDcAmt',           cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '이니포인트금액',       field: 'inipAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '할인쿠폰금액',         field: 'dcCpnAmt',           cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '할부개월수',           field: 'istmMtcnt',          cellClass: 'align-right'},
    { headerName: '무이자할부구분명',     field: 'itrfrIstmSeNm'      },
    { headerName: 'PG가맹점ID',           field: 'pgMbsId'            },
    { headerName: '신한캠퍼스선할인금액', field: 'shcmPreDcAmt',       cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '제휴코드할인이전금액', field: 'asocCdDcBfrAmt',     cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '제휴코드할인명',       field: 'asocCdDcNm'         },
    { headerName: 'PAYPIN거래내용',       field: 'ppDlngCts'          },
    { headerName: '모바일거래명',         field: 'mblDlngNm'          },
    { headerName: 'U포인트금액',          field: 'uPntAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: 'M포인트금액',          field: 'mPntAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '기프트카드금액',       field: 'gfcdAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '수수료금액',           field: 'feeAmt',             cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '수수료율명',           field: 'feeRtNm',            cellClass: 'align-right'},
    { headerName: '삼성바우처금액',       field: 'svchAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '에스크로구분명',       field: 'escrSeNm'           },
    { headerName: '간편결제포인트구분명', field: 'splPymtPntSeNm'     },
    { headerName: '간편결제포인트금액',   field: 'splPymtPntAmt',      cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '간편결제쿠폰금액',     field: 'splPymtCpnAmt',      cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '체크구분명',           field: 'chkSeNm'            },
    { headerName: 'BCTOP포인트금액',      field: 'bctpAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '카드사포인트사용명',   field: 'cdcoPntUseNm'       },
    { headerName: '이니안심금액',         field: 'inisAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '입금금액',             field: 'dpstAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '은행명',               field: 'bankNm'             },
    { headerName: '입금자명',             field: 'rmprNm'             },
    { headerName: '요청일자',             field: 'rqstDate'           },
    { headerName: '입금예정일자',         field: 'dpstXpcDate'        },
    { headerName: '송금예정자명',         field: 'rmtcXpcMnNm'        },
    { headerName: '입금예정금액',         field: 'dpstXpcAmt',         cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '수수료입금금액',       field: 'feeDpstAmt',         cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '입금처리상태명',       field: 'dpstPrStNm'         },
    { headerName: '수표입금상점귀책금액', field: 'chckDpstStreIptnAmt'},
    { headerName: '요청PG거래ID',         field: 'rqstPgDlngId'       },
    { headerName: '가상계좌PG거래ID',     field: 'vrtlAcnPgDlngId'    },
    { headerName: '펌뱅킹구분명',         field: 'fbkSeNm'            },
    { headerName: '이체금액',             field: 'trsfAmt',            cellClass: 'align-right', valueFormatter: formatMoney},
    { headerName: '계좌예금주명',         field: 'acnDpsrNm'          },
    { headerName: '거래유형명',           field: 'dlngTyNm'           },
    { headerName: '계좌이체PG거래ID',     field: 'acnTrsfPgDlngId'    },
    // { headerName: '재처리여부',           field: 'rePrYn'             },
    // { headerName: '정산집계제외여부',     field: 'sttlAgrgXclYn'      },
    { headerName: 'PG대사ID',             field: 'pgRcncId'           }
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
    totalRst: {
        totalCnt: 0,
        totalAmt: 0,
        aprvCnt: 0,
        aprvAmt: 0,
        cnclCnt: 0,
        cnclAmt: 0
    },
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
    pgDlngStNm: '',
    pgPayMthNm: '',
    chnSeCd: '',
    searchType: '',
    searchText: '',
    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),

        sttlBgnDate: computed(() => dayJS(formData.sttlBgnDate).format('YYYYMMDD')),
        sttlEndDate: computed(() => dayJS(formData.sttlEndDate).format('YYYYMMDD')),
        pgDlngStNm: computed(() => formData.pgDlngStNm),
        pgPayMthNm: computed(() => formData.pgPayMthNm),
        chnSeCd: computed(() => formData.chnSeCd),
        pgOdrNo: computed(() => (formData.searchType == 'pgOdrNo' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        cardAprvNo: computed(() => (formData.searchType == 'cardAprvNo' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        pcsrNm: computed(() => (formData.searchType == 'pcsrNm' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        prdNm: computed(() => (formData.searchType == 'prdNm' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        crcdAflnNm: computed(() => (formData.searchType == 'crcdAflnNm' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        
        mskgnRlsYn: computed(() => formData.mskgnRlsYn)
    },
    url: '/common/api/v1/instl/pgAprv/listExcel'
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
    formData.pgDlngStNm = '';
    formData.pgPayMthNm = '';
    formData.chnSeCd = '';
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
            pgDlngStNm: formData.pgDlngStNm,
            pgPayMthNm: formData.pgPayMthNm,
            chnSeCd: formData.chnSeCd,

            mskgnRlsYn: formData.mskgnRlsYn
        };
        
        if (!_.isEmpty(formData.searchType)) {
            if (!_.isEmpty(formData.searchText)) {
                params[formData.searchType] = formData.searchText;
            }
        }

        const response = await _getInstlPgAprvListPaging(params);

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
    console.log('type:', type, 'value:', value);
    if (type === 'day') {
        formData.sttlBgnDate = dayJS(value[0], 'YYYY-MM-DD');
        formData.sttlEndDate = dayJS(value[1], 'YYYY-MM-DD');
    } else if (type === 'self_end' || type === 'self_start') {
        // 직접 데이터 피커 설정
        if (type === 'self_start') {
            formData.sttlBgnDate = dayJS(value, 'YYYY-MM-DD');
        } else if (type === 'self_end') {
            formData.sttlEndDate = dayJS(value, 'YYYY-MM-DD');
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
