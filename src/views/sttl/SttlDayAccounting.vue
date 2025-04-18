<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <SttlDateSerch :dateTitle="'정산일자'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="'yesterday'" ref="dateSearch" />
                </div>
                <div class="item">
                    <label>일자</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.dateSearchType">
                                <option value="">선택</option>
                                <option value="dlngDate">거래일자</option>
                                <option value="accuDate">회계일자</option>
                                <option value="dwnlDate">전표다운로드일자</option>
                            </select>
                        </span>
                        <span class="dv">
                            <div class="ui-datepicker ss">
                                <DatePicker position="left" v-model="formData.searchDate" :enableTimePicker="false"
                                    locale="ko" :clearable="false" :format="dateFormat" autoApply text-input/>
                            </div>
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
                        <label>거래유형</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.dlngTyCd">
                                    <option value="">전체</option>
                                    <option v-for="(item) in dlngTyCdList" :value="item.cd">{{ item.cd + ':' + item.nm }}</option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>전표유형</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.slipTyCd">
                                    <option value="">전체</option>
                                    <option v-for="(item) in slipTyCdList" :value="item.cd">{{ item.cd + ':' + item.nm }}</option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>과세구분</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.txtnSeCd">
                                    <option value="">전체</option>
                                    <option v-for="(item) in txtnSeCdList" :value="item.cd">{{ item.cd + ':' + item.nm }}</option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>차대구분</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.drcrSeCd">
                                    <option value="">전체</option>
                                    <option v-for="(item) in drcrSeCdList" :value="item.cd">{{ item.cd + ':' + item.nm }}</option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>전표생성단위코드</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.slipCrtUnitCd">
                                    <option value="">전체</option>
                                    <option v-for="(item) in slipCrtUnitCdList" :value="item.cd">{{ item.cd + ':' + item.nm }}</option>
                                </select>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item">
                        <label>계정</label>
                        <span class="input">
                            <span class="dv">
                                <input type="text" class="form-control sm" :value="formData.accdNm" readonly>
                            </span>
                            <span class="dv">
                                <button class="btn btn-opt" @click="accdModalOpen('Inner')">찾기</button>
                            </span>
                            <span class="dv">
                                <button class="btn btn-opt" @click="clearSearch('accd')">X</button>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>회원</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.memberSearchType">
                                    <option value="">전체</option>
                                    <option value="mbrNm">회원명</option>
                                    <option value="mbrSn">회원번호</option>
                                    <option value="mbrJnMthAcsId">회원ID</option>
                                </select>
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="formData.mbrIdNm" readonly>
                            </span>
                            <span class="dv">
                                <button type="button" class="btn btn-opt" @click="openModalLocal('user')">찾기</button>
                            </span>
                            <span class="dv">
                                <button class="btn btn-opt" @click="clearSearch('user')">X</button>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>거래처</label>
                        <span class="input">
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="formData.dlngPlcIdNm" readonly>
                            </span>
                            <span class="dv">
                                <button type="button" class="btn btn-opt" @click="openModalLocal('isPartnerShow')">찾기</button>
                            </span>
                            <span class="dv">
                                <button class="btn btn-opt" @click="clearSearch('biz')">X</button>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item">
                        <label>ERP거래처</label>
                        <span class="input">
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="formData.accuDlngPlcCdNm" readonly>
                            </span>
                            <span class="dv">
                                <button type="button" class="btn btn-opt" @click="erpTrModalOpen('Erp')">찾기</button>
                            </span>
                            <span class="dv">
                                <button class="btn btn-opt" @click="clearSearch('bizErp')">X</button>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>상세검색</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.searchType">
                                    <option value="">전체</option>
                                    <option value="odrId">주문ID</option>
                                    <option value="slipNo">전표번호</option>
                                </select>
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control sm" placeHolder="검색어" v-model="formData.searchText" :readonly="state.isTextReadOnly"/>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>다운로드여부</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.dwnlYn">
                                    <option value="">전체</option>
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
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
                    <button type="button" class="btn btn-ss" @click="confirmModalOpen('confirm')">확정</button>
                    <button type="button" class="btn btn-ss" @click="confirmModalOpen('confirmCancel')">확정취소</button>
                    <button type="button" class="btn btn-ss" @click="slipCreateOpen('create')">전표생성</button>
                    <button type="button" class="btn btn-ss" @click="slipCreateOpen('delete')">전표생성취소</button>
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
                    headerHeight="24.5" :suppressRowClickSelection="true" @selection-changed="onRowSelect"
                    class="ag-theme-alpine" domLayout="autoHeight">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </template>
        </div>
    </section>
    <DefaultModal :isShow="accdModalIsShow" :modalName="accdModalKind" :modalTitle="'내부 계정조회'" :buttonCancel="'닫기'" :buttonDelete="'Clear'" @modalclose="accdModalclose" >
		<template #modalcontent>
			<SttlErpAccd @selectAccd="receiveAccd" :params="accdModalTargetData"/>
		</template>
	</DefaultModal>
    <DefaultModal :isShow="isUserPopShow" :modalTitle="'회원 조회'" :buttonConfirm="'닫기'" :buttonCancel="''" :buttonDelete="'Clear'"
            :modalName="'isUserShow'" @modalclose="modalControl">
        <template #modalcontent>
            <SttlUserSearch @selectUser="selectUser" :params="selectUserParams"/>
        </template>
    </DefaultModal>
    <DefaultModal :isShow="isPartnerShow" :modalTitle="selectPartnerParams.tName + ' 조회'" :buttonConfirm="'닫기'" :buttonCancel="''" :buttonDelete="'Clear'"
            :modalName="'isPartnerShow'" @modalclose="modalControl">
        <template #modalcontent>
            <SttlPartnerSerch @selectPartner="selectPartner" :params="selectPartnerParams"/>
        </template>
    </DefaultModal>
    <DefaultModal :isShow="erpTrModalIsShow" :modalName="erpTrModalKind" :modalTitle="(erpTrModalKind=='Inner'?'내부 ':'ERP ') + '거래처조회'" :buttonCancel="'닫기'" :buttonDelete="'Clear'" @modalclose="erpTrModalclose" >
		<template #modalcontent>
			<SttlErpTr @selectErpTr="receiveErpTr" :params="erpTrModalTargetData"/>
		</template>
	</DefaultModal>
    <DefaultModal :isShow="confirmIsShow" :modalName="confirmModalKind" :modalTitle="confirmModalKind=='confirm'?'확정':'확정취소'" :buttonConfirm="'확인'" :buttonCancel="'닫기'" @modalclose="confirmModalclose">
        <template #modalcontent>
            <div class="ui-grid-top-guide">
                <p>· 정산일자를 입력 후 확인을 클릭하면 {{confirmModalKind=='confirm'?'확정':'확정취소'}}됩니다.</p>
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 100px;">
                        <col style="width: 80px;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row" colspan="2">정산일자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <DatePicker
                                            locale="ko" cancelText="취소" selectText="선택"
                                            v-model="confirmData.sttlDate"
                                            :format="'yyyy-MM-dd'"
                                            :teleport="true"
                                            :clearable="false"
                                            hide-input-icon
                                            :enable-time-picker="false"
                                            placeholder="날짜선택"
                                            text-input
                                            :text-input-options="{format:'yyyyMMdd'}"
                                            auto-apply
                                        />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </DefaultModal>
    <DefaultModal :isShow="slipCreateIsShow" :modalName="slipCreateModalKind" :modalTitle="slipCreateModalKind=='create'?'생성':'생성취소'" :buttonConfirm="'확인'" :buttonCancel="'닫기'" @modalclose="slipCreateModalclose">
        <template #modalcontent>
            <div class="ui-grid-top-guide">
                <p>· 전표일자를 입력 후 확인을 클릭하면 {{slipCreateModalKind=='create'?'생성':'생성취소'}}됩니다.</p>
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 100px;">
                        <col style="width: 80px;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row" colspan="2">전표일자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <DatePicker
                                            locale="ko" cancelText="취소" selectText="선택"
                                            v-model="slipCreateData.slipDate"
                                            :format="'yyyy-MM-dd'"
                                            :teleport="true"
                                            :clearable="false"
                                            hide-input-icon
                                            :enable-time-picker="false"
                                            placeholder="날짜선택"
                                            text-input
                                            :text-input-options="{format:'yyyyMMdd'}"
                                            auto-apply
                                        />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </DefaultModal>
    <DefaultModal :isShow="slipResultIsShow" :modalName="'slipResult'" :modalTitle="'전표생성'" :buttonConfirm="'확인'" :buttonCancel="'다운로드'" @modalclose="slipResultModalclose" :className="'full'">
        <template #modalcontent>
            <div class="tbl-wrap mt-10">
                <AgGridVue :defaultColDef="slipCreateState.defaultColDef" :columnDefs="slipCreateState.tableColum_c"
                    :rowData="slipCreateState.rowData" class="ag-theme-alpine" domLayout="autoHeight">
                </AgGridVue>
            </div>
        </template>
    </DefaultModal>
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
import SttlErpAccd from './component/SttlErpAccd.vue';
import SttlPartnerSerch from './component/SttlPartnerSerch.vue';
import SttlUserSearch from './component/SttlUserSearch.vue';
import SttlErpTr from './component/SttlErpTr.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCodeApply, _getInstlAccuPrJnlzListPaging, _getInstlAccuPrJnlzDcn, _createInstlAcctSlip, _deleteInstlAcctSlip } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';
import { sttlLib } from './module/sttlLib';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

const sttlCyclCd = 'D';

const accdList = ref([]);
const chnSeCdList = ref([]);
const dlngTyCdList = ref([]);
const slipTyCdList = ref([]);
const txtnSeCdList = ref([]);
const drcrSeCdList = ref([]);
const slipCrtUnitCdList = ref([]);

const dateSearch = ref(null);

const initCodeList = () => {
    let promiseTemp = [];
    promiseTemp.push(_getCodeApply('ACCD', accdList));
    promiseTemp.push(_getCodeApply('CHN_SE_CD', chnSeCdList));
    promiseTemp.push(_getCodeApply('DLNG_TY_CD', dlngTyCdList, sttlCyclCd));
    promiseTemp.push(_getCodeApply('SLIP_TY_CD', slipTyCdList, sttlCyclCd));
    promiseTemp.push(_getCodeApply('TXTN_SE_CD', txtnSeCdList));
    promiseTemp.push(_getCodeApply('DRCR_SE_CD', drcrSeCdList));
    promiseTemp.push(_getCodeApply('SLIP_CRT_UNIT_CD', slipCrtUnitCdList, sttlCyclCd));

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

const selectCol = [];
const constColum = [
    {headerName: '기본정보',
        marryChildren: true,
        children: [
            { headerName: '정산일자',                field: 'sttlDate',       width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
            { headerName: '거래유형코드',            field: 'dlngTyCd',       valueFormatter: (params) => formatCdNm(params, dlngTyCdList) },
            { headerName: '전표유형코드',            field: 'slipTyCd',       valueFormatter: (params) => formatCdNm(params, slipTyCdList) }
        ]},
    {headerName: '거래정보',
        marryChildren: true,
        children: [
            { headerName: '거래일자',                field: 'dlngDate',       width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
            { headerName: '회계일자',                field: 'accuDate',       width: 100, valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
            { headerName: '주문ID',                  field: 'odrId'          },
            { headerName: '주문상세ID',              field: 'odrDtlId'       },
            { headerName: '승인번호',                field: 'cardAprvNo'     },
            { headerName: '회원ID',                  field: 'mbrId'          },
            { headerName: '회원명',                  field: 'mbrIdNm'        },
            { headerName: '거래처ID',                field: 'dlngPlcId'      },
            { headerName: '거래처명',                field: 'dlngPlcNm'      },
            { headerName: '거래처사업자등록번호',    field: 'dlngPlcBrn', width: 160, valueFormatter: (params) => sttlLib.formatBrm(params.value)   },
            { headerName: '과세구분',                field: 'txtnSeCd',       width: 100, valueFormatter: (params) => formatCdNm(params, txtnSeCdList) }
        ]},
    {headerName: '분개정보',
        marryChildren: true,
        children: [
            { headerName: '분개라인',                field: 'accuPrJnlzSn',   width: 90, cellClass: 'align-right' },
            { headerName: '차대구분',                field: 'drcrSeCd',       width: 90, valueFormatter: (params) => formatCdNm(params, drcrSeCdList) },
            { headerName: '계정코드',                field: 'accd'           },
            { headerName: '계정코드명',              field: 'accdNm'         },
            { headerName: '차변금액',                field: 'drAmt',          cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '대변금액',                field: 'crAmt',          cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: '공급가액',                field: 'spvl',           cellClass: 'align-right', valueFormatter: formatMoney },
            { headerName: 'ERP거래처코드',           field: 'accuDlngPlcCd',  width: 120 },
            { headerName: 'ERP거래처명',             field: 'accuDlngPlcCdNm'},
            { headerName: '전표생성단위코드',        field: 'slipCrtUnitCd',  valueFormatter: (params) => formatCdNm(params, slipCrtUnitCdList) },
            { headerName: '부도차감여부',            field: 'bkrtDdctYn'     }
        ]},
    {headerName: 'ERP정보',
        marryChildren: true,
        children: [
            { headerName: '전표일자',                field: 'slipDate',         width: 90 },
            { headerName: '전표번호',                field: 'slipNo',         width: 90 },
            { headerName: '전표다운로드일자',        field: 'dwnlDt',         valueFormatter: (params) => _.isEmpty(params.value) ? '' : dayJS(params.value, 'YYYYMMDD').format('YYYY-MM-DD')},
            { headerName: '전표다운로드사용자ID',    field: 'dwnlUsrId'      }
        ]},
    {headerName: '확정',
        marryChildren: true,
        children: [
            { headerName: '확정여부',     field: 'dcnYn'        },
            { headerName: '확정자ID',     field: 'dcnMnId'      },
            { headerName: '확정일시',     field: 'dcnDt',        width: 145 }
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
    tableColum_c: _.union(selectCol, initColum.value),
    filterCoulm: [],
    rowData: [],
    defaultColDef: {
        sortable: true,
        filter: false,
        resizable: true,
        width: DEFAULT_WIDTH
    },
    gridApi: null,
    gridColumApi: null,
    openMore: false,
    list: [],
    pagesize: 50,
    isTextReadOnly: true,
    mskgnRlsYn: true,
    mskgnTried: false // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
});

const formData = reactive({
    sttlBgnDate: '',
    sttlEndDate: '',
    dateSearchType: '',
    searchDate: '',
    chnSeCd: '',
    dlngTyCd: '',
    slipTyCd: '',
    txtnSeCd: '',
    drcrSeCd: '',
    slipCrtUnitCd: '',
    accd: '',
    accdNm: '',
    memberSearchType: '',
    mbrId: '',
    mbrIdNm: '',
    dlngPlcId: '',
    dlngPlcIdNm: '',
    accuDlngPlcCd: '',
    accuDlngPlcCdNm: '',
    searchType: '',
    searchText: '',
    dcnYn: '',
    dwnlYn: '',
    
    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),
        sttlCyclCd: sttlCyclCd,
        sttlBgnDate: computed(() => dayJS(formData.sttlBgnDate).format('YYYYMMDD')),
        sttlEndDate: computed(() => dayJS(formData.sttlEndDate).format('YYYYMMDD')),
        dlngDate: computed(() => formData.dateSearchType == 'dlngDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        accuDate: computed(() => formData.dateSearchType == 'accuDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        dwnlDate: computed(() => formData.dateSearchType == 'dwnlDate' && _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
        chnSeCd: computed(() => formData.prchnSeCddId),
        dlngTyCd: computed(() => formData.dlngTyCd),
        slipTyCd: computed(() => formData.slipTyCd),
        txtnSeCd: computed(() => formData.txtnSeCd),
        drcrSeCd: computed(() => formData.drcrSeCd),
        slipCrtUnitCd: computed(() => formData.slipCrtUnitCd),
        accd: computed(() => formData.accd),
        mbrId: computed(() => formData.mbrId),
        dlngPlcId: computed(() => formData.dlngPlcId),
        accuDlngPlcCd: computed(() => formData.accuDlngPlcCd),
        odrId: computed(() => (formData.searchType == 'odrId' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        slipNo: computed(() => (formData.searchType == 'slipNo' && !_.isEmpty(formData.searchText)) ? formData.searchText : ''),
        dcnYn: computed(() => formData.dcnYn),
        dwnlYn: computed(() => formData.dwnlYn),

        mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
    },
    url: '/common/api/v1/instl/accuPrJnlz/listExcel'
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

let cellClickedInfo = {
    sttlDate: '',
    slipDate: ''
};
// 셀클릭 이벤트처리 함수
const cellClicked = (e) => {
    cellClickedInfo.sttlDate = e.data.sttlDate;
    cellClickedInfo.slipDate = e.data.slipDate;
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
    formData.dateSearchType = '';
    formData.searchDate = '';
    formData.chnSeCd = '';
    formData.dlngTyCd = '';
    formData.slipTyCd = '';
    formData.txtnSeCd = '';
    formData.drcrSeCd = '';
    formData.slipCrtUnitCd = '';
    formData.accdNm = '';
    formData.accd = '';
    formData.memberSearchType = '';
    formData.mbrIdNm = '';
    formData.mbrId = '';
    formData.dlngPlcIdNm = '';
    formData.dlngPlcId = '';
    formData.accuDlngPlcCdNm = '';
    formData.accuDlngPlcCd = '';
    formData.searchType = '';
    formData.searchText = '';
    formData.dcnYn = '';
    formData.dwnlYn = '';

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
            sttlCyclCd: sttlCyclCd,
            sttlBgnDate: dayJS(formData.sttlBgnDate).format('YYYYMMDD'),
            sttlEndDate: dayJS(formData.sttlEndDate).format('YYYYMMDD'),
            chnSeCd: formData.chnSeCd,
            dlngTyCd: formData.dlngTyCd,
            slipTyCd: formData.slipTyCd,
            txtnSeCd: formData.txtnSeCd,
            drcrSeCd: formData.drcrSeCd,
            slipCrtUnitCd: formData.slipCrtUnitCd,
            accd: formData.accd,
            mbrId: formData.mbrId,
            dlngPlcId: formData.dlngPlcId,
            accuDlngPlcCd: formData.accuDlngPlcCd,
            dcnYn: formData.dcnYn,
            dwnlYn: formData.dwnlYn,

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
        
        const response = await _getInstlAccuPrJnlzListPaging(params);

        state.rowData = response.data.data.list;
        pager.totalCnt = response.data.data.totalCnt;

        state.mskgnTried = false;
        cellClickedInfo = {};
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

const clearSearch = (option) => {
    switch (option) {
        case 'accd':
            formData.accdNm = '';
            formData.accd = '';
            break;
        case 'user':
            formData.mbrIdNm = '';
            formData.mbrId = '';
            break;
        case 'biz':
            formData.dlngPlcIdNm = '';
            formData.dlngPlcId = '';
            break;
        case 'bizErp':
            formData.accuDlngPlcCdNm = '';
            formData.accuDlngPlcCd = '';
            break;
    }
};

const accdModalIsShow = ref(false);
let accdModalKind = '';
let accdModalTargetData = {};

const accdModalOpen = (option) => {
    
    accdModalKind = option;
    accdModalTargetData.innerList = accdList.value;
    accdModalTargetData.accd = formData.accd;

    accdModalIsShow.value = true;
};

const accdModalclose = async (btn, name) => {
    if (btn === 'modalconfirm') {
//
    } else if (btn === 'modaldelete') {
        clearSearch('accd');
    }
    
    accdModalIsShow.value = false;
};

const receiveAccd = (v) => {
    formData.accd = v.acctCd;
    formData.accdNm = v.acctNm;

    accdModalIsShow.value = false;
};

const isUserPopShow = ref(false);

const openModalLocal = async (option) => {
    if (option == 'user') {
        isUserPopShow.value = true;
    } else {
        openModal(option);
    }
};

const selectPartnerParams = reactive({
    tName: '거래처',
    searchText: computed(() => formData.dlngPlcIdNm)
});

const selectPartner = (data) => {
    formData.dlngPlcIdNm = data.ntprNm;
    formData.dlngPlcId = data.ntprSn;

    isPartnerShow.value = false;
};

const selectUserParams = reactive({
    searchType: computed(() => {
        let returnVal = '';
        if (_.isNumber(formData.mbrId)) {
            returnVal = 'mbrSn';
        } else {
            returnVal = formData.memberSearchType;
        }
        return returnVal;
    }),
    searchText: computed(() => formData.mbrId)
});

const selectUser = (data) => {
    formData.mbrIdNm = data.mbrNm;
    formData.mbrId = data.mbrSn;
    isUserPopShow.value = false;
};

// 모달창 닫기
const modalControl = (type, modalName) => {
    console.log(type, modalName);
    if (modalName === 'isPartnerShow') {
        if (type == 'modaldelete') {
            clearSearch('biz');
        }
        isPartnerShow.value = false;
    } else if (modalName === 'isUserShow') {
        if (type == 'modaldelete') {
            clearSearch('user');
        }
        isUserPopShow.value = false;
    }
};

const erpTrModalIsShow = ref(false);
let erpTrModalKind = '';
let erpTrModalTargetData = {};

const erpTrModalOpen = (option) => {
    
    erpTrModalKind = option;
    if (option == 'Inner') {
		//notthing...
    } else if (option == 'Erp') {
        erpTrModalTargetData.searchText = formData.accuDlngPlcCd;
    }

    erpTrModalIsShow.value = true;
};

const erpTrModalclose = async (btn, name) => {
    if (btn === 'modalconfirm') {
//
    } else if (btn === 'modaldelete') {
        if (erpTrModalKind === 'Erp') {
            clearSearch('bizErp');
        }
    }
    
    erpTrModalIsShow.value = false;

};

const receiveErpTr = (v) => {
    if (erpTrModalKind === 'Inner') {
        //
    } else if (erpTrModalKind === 'Erp') {
        formData.accuDlngPlcCd = v.trCd;
        formData.accuDlngPlcCdNm = v.trNm;
    }

    erpTrModalIsShow.value = false;

};

const confirmIsShow = ref(false);
let confirmModalKind = '';
const confirmData = reactive({});

const confirmModalOpen = (option) => {
    
    confirmModalKind = option;

    confirmData.sttlDate = dayJS();
    if (!_.isEmpty(cellClickedInfo.sttlDate)) {
        confirmData.sttlDate = dayJS(cellClickedInfo.sttlDate, 'YYYYMMDD');
    }

    confirmIsShow.value = true;
};

const confirmModalclose = async (btn, name) => {
    if (btn === 'modalconfirm') {
        let params = {
            sttlCyclCd: sttlCyclCd,
            sttlDate: dayJS(confirmData.sttlDate).format('YYYYMMDD'),
            dcnYn: confirmModalKind == 'confirm' ? 'Y' : 'N'
        };
        try {
            const res = await _getInstlAccuPrJnlzDcn(params);
            
            if (res.data.code == 'OK') {
                toast((confirmModalKind == 'confirm' ? '확정 ' : '확정 취소 ') + '처리되었습니다.', 3000, 'success');
                confirmIsShow.value = false;
                getList();
            } else {
                confirmIsShow.value = false;
                await $Modal.alert({ message: res.data.message, buttonText: { ok: '확인' } });
                confirmIsShow.value = true;
            }

        } catch (error) {
            confirmIsShow.value = false;
            await $Modal.alert({
                title: '확인',
                className: 'error',
                message: error.response.data.message,

                buttonText: {
                    ok: '확인'
                }
            });
            confirmIsShow.value = true;
        }
    } else {
        confirmIsShow.value = false;
    }
};

const slipCreateIsShow = ref(false);
let slipCreateModalKind = '';
const slipCreateData = reactive({});

const slipCreateOpen = (option) => {
    
    slipCreateModalKind = option;
    slipCreateData.slipDate = dayJS();
    if (!_.isEmpty(cellClickedInfo.slipDate)) {
        slipCreateData.slipDate = dayJS(cellClickedInfo.slipDate, 'YYYYMMDD');
    }
    slipCreateIsShow.value = true;
};


const slipCreateModalclose = async (btn, name) => {
    if (btn === 'modalconfirm') {
        let params = {
            sttlCyclCd: sttlCyclCd,
            slipDate: dayJS(slipCreateData.slipDate).format('YYYYMMDD')
        };
        if (slipCreateModalKind == 'create') {
            try {
    
                const res = await _createInstlAcctSlip(params);
                
                if (res.data.code == 'OK') {
                    toast('생성 되었습니다.', 3000, 'success');
                    slipCreateIsShow.value = false;
                    console.log('res.data:', res.data);
                    slipResultOpen(res.data.data);
                } else {
                    //그냥alert 하면 dimmed 처리가 없어져서 본 팝업 껏다가 켬
                    slipCreateIsShow.value = false;
                    await $Modal.alert({ message: res.data.message, buttonText: { ok: '확인' } });
                    slipCreateIsShow.value = true;
                }
            } catch (error) {
                //그냥alert 하면 dimmed 처리가 없어져서 본 팝업 껏다가 켬
                slipCreateIsShow.value = false;
                await $Modal.alert({
                    title: '확인',
                    className: 'error',
                    message: error.response.data.message,

                    buttonText: {
                        ok: '확인'
                    }
                });
                slipCreateIsShow.value = true;
            }
        } else if (slipCreateModalKind == 'delete') {

            try {
    
                const res = await _deleteInstlAcctSlip(params);
                
                if (res.data.code == 'OK') {
                    toast('생성 취소 되었습니다.', 3000, 'success');
                    slipCreateIsShow.value = false;
                    console.log('res.data:', res.data);
                } else {
                    //그냥alert 하면 dimmed 처리가 없어져서 본 팝업 껏다가 켬
                    slipCreateIsShow.value = false;
                    await $Modal.alert({ message: res.data.message, buttonText: { ok: '확인' } });
                    slipCreateIsShow.value = true;
                }
            } catch (error) {
                //그냥alert 하면 dimmed 처리가 없어져서 본 팝업 껏다가 켬
                slipCreateIsShow.value = false;
                await $Modal.alert({
                    title: '확인',
                    className: 'error',
                    message: error.response.data.message,

                    buttonText: {
                        ok: '확인'
                    }
                });
                slipCreateIsShow.value = true;
            }
        }
    } else {
        slipCreateIsShow.value = false;
    }
};

const slipResultIsShow = ref(false);

const slipResultOpen = (list) => {
    
    slipResultIsShow.value = true;
    slipCreateState.rowData = list;
};


const slipResultModalclose = async (btn, name) => {
    if (btn === 'modalcancel') {
        if (slipCreateState.rowData.length > 0) {
            let slipNoList = [];
            slipCreateState.rowData.forEach((v, i) => {
                slipNoList = _.union(slipNoList, [v.MENU_SQ]);
            });
            onChangeDownRol(menuInfo.value.auth5DownloadYn, 'N', {
                params: {
                    menuCode: menuInfo.value.menuCode,
                    sttlCyclCd: sttlCyclCd,
                    slipDate: slipCreateState.rowData[0].MENU_DT,
                    slipNoList: slipNoList
                },
                url: '/common/api/v1/instl/slip/listExcel'
            });
        }
    }
    getList();
    slipResultIsShow.value = false;
};

const formatDate = (params) => {
    return _.replace(params.value, /(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
};

const slipCreateState = reactive({
    tableColum_c: [
        { headerName: '회계단위', field: 'IN_DIV_CD', width: 90 },
        { headerName: '작성일자', field: 'MENU_DT', width: 100, valueFormatter: formatDate },
        { headerName: '작성번호', field: 'MENU_SQ', width: 90, cellClass: 'centered' },
        { headerName: '라인순번', field: 'MENU_LN_SQ', width: 90, cellClass: 'align-right' },
        { headerName: '품의내역', field: 'ISU_DOC', width: 200 },
        { headerName: '전표유형', field: 'DOCU_TY_NM', width: 90 },
        { headerName: '차대구분', field: 'DRCR_FG_NM', width: 90 },
        { headerName: '계정과목', field: 'ACCT_CD_NM', width: 200 },
        { headerName: '거래처', field: 'TR_CD', width: 90, cellClass: 'centered' },
        { headerName: '거래처명', field: 'TR_NM', width: 150 },
        { headerName: '계정금액', field: 'ACCT_AM', width: 90, cellClass: 'align-right', valueFormatter: formatMoney },
        { headerName: '증빙코드', field: 'ATTR_CD_NM', width: 180, cellClass: 'centered', hide: true },
        { headerName: '적요', field: 'RMK_DC', width: 200 },
        { headerName: '부가세사업장', field: 'VAT_DIV_CD', width: 120 },
        { headerName: '부가세신고기준일', field: 'ISS_DT', width: 150 },
        { headerName: '세무구분', field: 'TAX_FG_NM', width: 90 },
        { headerName: '공급가액', field: 'SUP_AM', width: 90, cellClass: 'align-right', valueFormatter: formatMoney },
        { headerName: '전자세금계산서여부', field: 'JEONJA_YN_NM', width: 150 },
        { headerName: '사용부서', field: 'CT_DEPT', width: 150 },
        { headerName: '요청일', field: 'REQ_DT', width: 90 },
        { headerName: '종료일', field: 'END_DT', width: 90 }
    ],
    defaultColDef: {
        sortable: true,
        filter: false,
        resizable: true,
        width: DEFAULT_WIDTH
    },
    rowData: []

});

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
