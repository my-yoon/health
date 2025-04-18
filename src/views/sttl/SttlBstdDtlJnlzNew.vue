<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>정산주기코드</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.sttlCyclCd" @change="getMetaList">
                                <option value="">전체</option>
								<option v-for="(item) in sttlCyclCdList" :value="item.cd">{{ item.cd + ":" + item.nm }}</option>
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
                                <option v-for="(item) in slipCrtUnitCdList" :value="item.cd">{{ item.cd + ":" + item.nm }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
					<label>사용여부</label>
					<span class="input">
						<span class="dv">
							<select class="custom-select sm" v-model="formData.useYn">
								<option value="">전체</option>
								<option value="Y">사용</option>
								<option value="N">미사용</option>
							</select>
						</span>
					</span>
				</div>
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회 </button>
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
                        <label>일자검색</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.dateSearchType">
                                    <option value="">전체</option>
                                    <option value="st">시작일</option>
                                    <option value="ed">종료일</option>
                                </select>
                            </span>
                            <span class="dv">
                                <div class="ui-datepicker">
                                    <DatePicker v-model="formData.searchDate" :format="'yyyy-MM-dd'" locale="ko" :clearable="true" :enable-time-picker="false" auto-apply text-input :text-input-options="{format:'yyyyMMdd'}"/>
                                </div>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>차대구분</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.drcrSeCd">
                                    <option value="">전체</option>
                                    <option v-for="(item) in drcrSeCdList" :value="item.cd">{{ item.cd + ":" + item.nm }}</option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>계정코드</label>
                        <span class="input">
                            <span class="dv">
                                <button class="btn btn-sm" @click="accdModalOpen('Inner')">찾기 {{ _.isEmpty(formData.accd)?"":getCodeNm(formData.accd, accdList) }}</button>
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
                    <button type="button" class="btn btn-ss" @click="insertPopup">추가</button>
                    <button type="button" class="btn btn-ss" @click="updatePopup">수정</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ state.rowData.length }}</strong>건</span>
                    <!-- <selectBox :selectType="'page'" @changedValue="selectedOptions" /> -->

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
                    @cell-double-clicked="onCellDoubleClicked" :suppressRowClickSelection="true" @selection-changed="onRowSelect" rowSelection="single"
                    class="ag-theme-alpine" domLayout="autoHeight">
                </AgGridVue>
            </template>
        </div>
    </section>
	<DefaultModal :isShow="accdModalIsShow" :modalName="accdModalKind" :modalTitle="(accdModalKind=='Inner'?'내부 ':'ERP ') + '계정조회'" :buttonCancel="'닫기'" :buttonDelete="'Clear'" @modalclose="accdModalclose" >
		<template #modalcontent>
			<SttlErpAccd @selectAccd="receiveAccd" :params="accdModalTargetData"/>
		</template>
	</DefaultModal>
	<DefaultModal :isShow="erpTrModalIsShow" :modalName="erpTrModalKind" :modalTitle="(erpTrModalKind=='Inner'?'내부 ':'ERP ') + '거래처조회'" :buttonCancel="'닫기'" :buttonDelete="'Clear'" @modalclose="erpTrModalclose" >
		<template #modalcontent>
			<SttlErpTr @selectErpTr="receiveErpTr" :params="erpTrModalTargetData"/>
		</template>
	</DefaultModal>
    <!-- delete 버튼을 활성화하려면(삭제버튼은 개발할때만 쓰려고 막아둠...) -> modalKind=='M'?'삭제':false -->
    <DefaultModal :isShow="modalIsShow" :modalName="modalKind" :modalTitle="'분개모델 ' + (modalKind=='I'?'추가':'수정')" :buttonConfirm="'저장'" :buttonCancel="'취소'" :buttonDelete="modalKind=='M'?false:false" @modalclose="modalclose" :className="'full'">
		<template #modalcontent>
            <div class="ui-grid-top-guide">
                <p>· 적용기간은 연도를 선택하시면 "선택연도-01-01" 부터 "2099-12-31" 자동입력됩니다.</p>
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 100px;">
                        <col style="width: 80px;">
                        <col style="width: auto;">
                        <col style="width: 30px;">
                        <col style="width: 105px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row" colspan="2">정산주기코드<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <select class="custom-select sm" v-model="modalValue.sttlCyclCd" ref="modalEl">
                                            <option value="">선택</option>
                                            <option v-for="(item) in sttlCyclCdList" :value="item.cd">{{ item.cd + ":" + item.nm }}</option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                            <th scope="row" colspan="2">전표생성단위코드<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <select class="custom-select sm form-control" v-model="modalValue.slipCrtUnitCd">
                                            <option value="">선택</option>
                                            <option v-for="(item) in slipCrtUnitCdList" :value="item.cd">{{ item.cd + ":" + item.nm }}</option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2">라인번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <input type="number" class="form-control" min="0" max="2147483647"
                                                v-model="modalValue.indnSqn" />
                                    </div>
                                </div>
                            </td>
                            <th scope="row" colspan="2">차대구분<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <select class="custom-select sm" v-model="modalValue.drcrSeCd">
                                            <option value="">선택</option>
                                            <option v-for="(item) in drcrSeCdList" :value="item.cd">{{ item.cd + ":" + item.nm }}</option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2">계정코드</th>
                            <td colspan="4">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <button class="btn btn-sm" @click="accdModalOpen('Erp')">찾기 {{ _.isEmpty(modalValue.accdNm)?getCodeNm(modalValue.accd, accdList):(modalValue.accd + ' : ' + modalValue.accdNm) }}</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2">ERP거래처코드</th>
                            <td colspan="4">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <button class="btn btn-sm" @click="erpTrModalOpen('Erp')">찾기 {{ _.isEmpty(modalValue.erpTrCdNm)?getCodeNm(modalValue.erpTrCd, trCdList):(modalValue.erpTrCd + ' : ' + modalValue.erpTrCdNm) }}</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2">계정코드구분유형</th>
                            <td colspan="4">
                                <div class="reg-group inline">
                                    <div class="reg-item ">
                                        <input type="text" class="form-control" v-model="modalValue.accdSeType" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2">참조필드1</th>
                            <td colspan="2">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="modalValue.refCol1" />
                                    </div>
                                </div>
                            </td>
                            <th scope="row" >참조필드2</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="modalValue.refCol2" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2">적요</th>
                            <td colspan="4">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="modalValue.desc" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" rowspan="2">적용기간선택</th>
                            <th scope="row" >연도<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="4">
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <input type="number" class="form-control" inputmode="numeric" min="1970" max="2099" step="1" maxlength="4"
                                                v-model="modalValue.year" @change="modalYearChange" pattern="\d{4}" required/>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" >시작일시</th>
                            <td colspan="2">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        {{ _.isEmpty(modalValue.aplBgnDt)?"":dayJS(modalValue.aplBgnDt, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }}
                                    </div>
                                </div>
                            </td>
                            <th scope="row" >종료일시</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        {{ _.isEmpty(modalValue.aplEndDt)?"":dayJS(modalValue.aplEndDt, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }}
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2">사용여부</th>
                            <td colspan="4">
                                <div class="reg-group inline">
                                    <div class="reg-item ">
                                        <select class="custom-select" v-model="modalValue.useYn">
                                            <option value="Y">사용</option>
                                            <option value="N">미사용</option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
		</template>
	</DefaultModal>
</template>
<style>
.ag-body-horizontal-scroll-viewport {
    display: none
}
</style>
<script setup>
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watchEffect, watch, toDisplayString } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { _getCodeApply, _getInstlSttlBstdDtlJnlzList, _getInstlSttlBstdDtlList, _createInstlSttlBstdDtlJnlz, _modifyInstlSttlBstdDtlJnlz} from '@/api/sttl.js';
import SttlErpAccd from './component/SttlErpAccd.vue';
import SttlErpTr from './component/SttlErpTr.vue';
import _ from 'lodash';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const universal = inject('VueUniversalModal');

const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();

const sttlCyclCdList = ref([]);
const slipCrtUnitCdList = ref([]);
const drcrSeCdList = ref([]);
const accdList = ref([]);
const trCdList = ref([]);

const initCodeList = () => {
    let promiseTemp = [];
	promiseTemp.push(_getCodeApply('STTL_CYCL_CD',sttlCyclCdList));
	promiseTemp.push(_getCodeApply('SLIP_CRT_UNIT_CD',slipCrtUnitCdList));
	promiseTemp.push(_getCodeApply('DRCR_SE_CD',drcrSeCdList));
	promiseTemp.push(_getCodeApply('ACCD',accdList));
	promiseTemp.push(_getCodeApply('TR_CD',trCdList));
    return Promise.all(promiseTemp);
}

const selectCol = [{ headerName: '', field: 'checkbox', checkboxSelection: true, maxWidth: 50, sortable:false}];
const constColum = [
	{ headerName: '사용여부', field: 'useYn', width:85, cellClass:'centered', headerClass:'cnetered', valueGetter: (param) => param.node.data.useYn == 'Y' ? '사용' : '미사용' },
	{ headerName: '정산주기', field: 'sttlCyclCd', width:110, valueFormatter:(params)=>{
        return getCodeNm(params.value, sttlCyclCdList.value);
	}},
    { headerName: '전표생성단위', field: 'slipCrtUnitCd', width:140, valueFormatter:(params)=>{
        return getCodeNm(params.value, slipCrtUnitCdList.value);
	}},
    { headerName: '계정코드구분유형', field: 'accdSeType', width:131, cellClass:'centered', headerClass:'cnetered'},
    { headerName: '라인번호', field: 'indnSqn', width:90, cellClass:'centered', headerClass:'cnetered'},
    { headerName: '차대구분', field: 'drcrSeCd', width:90, cellClass:'centered', headerClass:'cnetered', valueFormatter:(params)=>{
        return getCodeNm(params.value, drcrSeCdList.value);
	}},
    { headerName: '계정코드', field: 'accd', width:200, valueFormatter:(params)=>{
        return getCodeNm(params.value, accdList.value);
	}},
    { headerName: '참조필드1', field: 'refCol1', width:120},
    { headerName: '참조필드2', field: 'refCol2', width:120},
    { headerName: 'ERP거래처코드', field: 'erpTrCd', width:200, valueFormatter:(params)=>{
        return getCodeNm(params.value, trCdList.value);
	}},
    { headerName: '적요', field: 'desc', width:200},
    { headerName: '적용시작일시', field: 'aplBgnDt', width:145},
    { headerName: '적용종료일시', field: 'aplEndDt', width:145},
];

const getCodeNm = (code, codeList) => {

    if(_.isEmpty(code)){
        return '';
    }else{
        let tempList = codeList.filter((o)=>o.cd == code);
        if(_.isEmpty(tempList)){
            return code;
        }else{
            return code + " : " + tempList[0].nm;
        }
    }
}

const initColum = ref([]);

const initColumInitialize = () => {
    initColum.value = _.clone(constColum);
}

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
        width: 150,
    },
    gridApi: null,
    gridColumApi: null,
    openMore: false,
    list: [],
    pagesize: 10,
    metaList:[],
});

const formData = reactive({
    sttlCyclCd:"",
    slipCrtUnitCd:"",
    drcrSeCd:"",
    accd:"",
	useYn:"",
    dateSearchType: "",
    searchDate: "",
});

const downloadFormData = reactive({
    sttlBstdCd: computed(()=>formData.sttlBstdCd),
    sttlBstdMetaNo: computed(()=>formData.sttlBstdMetaNo),
    useYn          : computed(()=>formData.useYn),
    fxnItmYn       : computed(()=>formData.fxnItmYn),
    dateSearchType : computed(()=>formData.dateSearchType),
    searchDate     : computed(()=>_.isDate(formData.searchDate)?dayJS(formData.searchDate).format("YYYYMMDD"):""),
    menuCode: state.menuCode
});

onMounted(() => {
	initCodeList().then(
        (res) => {
            resetTable();
            getList();
        }
    );
});

// 셀클릭 이벤트처리 함수
const cellClicked = (e) => {
    
};

const onCellDoubleClicked = (e) => {
    e.node.setSelected(true);
    updatePopup();
};

const onChangedPage = (pagenum) => {
    //api호출
    getList();
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
    formData.sttlBstdCd = "";
    formData.sttlBstdMetaNo = "";
    formData.useYn = "";
    formData.fxnItmYn = "";
    formData.dateSearchType = "";
    formData.searchDate = "";
    formData.accd = "";
};

//리스트 갯수 변경 후 리스트 재 조회
const clearList = () => {
    initParams();
    onChangedPage(1);
};

const getList = async () => {
    try {
        let params = {
            sttlCyclCd     : formData.sttlCyclCd,
            slipCrtUnitCd  : formData.slipCrtUnitCd,
            drcrSeCd       : formData.drcrSeCd,
            accd           : formData.accd,
            useYn          : formData.useYn,
            dateSearchType : formData.dateSearchType,
            searchDate     : _.isDate(formData.searchDate)?dayJS(formData.searchDate).format("YYYYMMDD"):"",
        };

        const response = await _getInstlSttlBstdDtlJnlzList(params);
        console.log(response);
        state.rowData = response.data.data;
    } catch (error) {
        console.log(error);
    }
};

//검색조건에 따른 리스트 재조회
const reloadList = () => {
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

const modalIsShow = ref(false);

const modalEl = ref(null);
const modalValue = reactive({
    sttlBstdCd : 'JNLZ_MODEL',
    sttlBstdMetaNo : '5',
    sttlBstdDtlNo : "",
});

const modalMetaInitialize = () =>{
    modalValue.metaList = [];
}

modalMetaInitialize();

let modalKind = "";

const modalclose = async (btn, name) => {
    if(btn === 'modalconfirm'){

        if(_.isEmpty(modalValue.sttlCyclCd)){
            toast('정산주기코드를 선택 바랍니다.', 1000, 'error');
            return;
        }
        if(_.isEmpty(modalValue.slipCrtUnitCd)){
            toast('전표생성단위코드를 선택 바랍니다.', 1000, 'error');
            return;
        }
        console.log(_.isEmpty(modalValue.indnSqn), !_.isNumber(modalValue.indnSqn));
        if(_.isEmpty(modalValue.indnSqn) && !_.isNumber(modalValue.indnSqn)){
            toast('라인번호를 입력 바랍니다.', 1000, 'error');
            return;
        }
        if(_.isEmpty(modalValue.drcrSeCd)){
            toast('차대구분을 입력 바랍니다.', 1000, 'error');
            return;
        }
        let params = {
            sttlBstdCd : modalValue.sttlBstdCd,
            sttlBstdMetaNo : modalValue.sttlBstdMetaNo , 
            sttlBstdDtlNo : modalValue.sttlBstdDtlNo ,
            sttlCyclCd : modalValue.sttlCyclCd,
            slipCrtUnitCd : modalValue.slipCrtUnitCd,
            kbHcYn : modalValue.kbHcYn,
            drcrSeCd : modalValue.drcrSeCd,
            accd : modalValue.accd,
            accdNm : modalValue.accdNm,
            refCol1 : modalValue.refCol1,
            refCol2 : modalValue.refCol2,
            erpTrCd : modalValue.erpTrCd,
            erpTrCdNm : modalValue.erpTrCdNm,
            indnSqn : modalValue.indnSqn ,
            useYn : modalValue.useYn ,
            aplBgnDt : modalValue.aplBgnDt ,
            aplEndDt : modalValue.aplEndDt ,
            desc : modalValue.desc,
        }
        
        let res = {};
        if(name == 'I'){
            res = await _createInstlSttlBstdDtlJnlz(params);
        }else if(name == 'M'){
            res = await _modifyInstlSttlBstdDtlJnlz(params);
        }
        if(res.data.code == 'OK'){
            await $Modal.alert({
                title: '확인',
                message: (name=='I'?'추가':'수정') + '되었습니다.',

                buttonText: {
                    ok: '확인'
                }
            });
            
        }else{

            await $Modal.alert({
                title: '확인',
                message: res.data.message,
                
                buttonText: {
                    ok: '확인'
                }
            });
            
            return;
        }
        await _getCodeApply('ACCD',accdList);
	    await _getCodeApply('TR_CD',trCdList);
        getList();
    }
    modalIsShow.value = false;
}

const insertPopup = () => {
    modalKind = "I";

    modalValue.sttlCyclCd = "";
    modalValue.slipCrtUnitCd = "";
    modalValue.drcrSeCd = "";
    modalValue.indnSqn = "";
    modalValue.accd = "";
    modalValue.accdNm = "";
    modalValue.erpTrCd = "";
    modalValue.erpTrCdNm = "";
    modalValue.accdSeType = "";
    modalValue.refCol1 = "";
    modalValue.refCol2 = "";
    modalValue.desc = "";
    modalValue.aplBgnDt = dayJS().format('YYYY') + "0101000000";
    modalValue.aplEndDt = "20991231235959";
    modalValue.useYn = "Y";
    modalValue.year = dayJS().format('YYYY');
    // modalValue.years = [];
    // for(let i=0 ; i < 6 ; i++){
    //     modalValue.years.push(dayJS().add(i - 2, 'y').format('YYYY'));
    // }

    modalIsShow.value = true;
}

const updatePopup = () => {
    
    let selectedRow = state.gridApi.getSelectedRows();

    if(!_.isEmpty(selectedRow)){
        if(selectedRow.length > 1){
            toast('수정할 행 1개 만 선택바랍니다.',1000, 'error');
            return false;
        }
        modalKind = "M";

        let firstRow = selectedRow[0];

        modalValue.sttlBstdDtlNo = firstRow.sttlBstdDtlNo;
        modalValue.sttlCyclCd = firstRow.sttlCyclCd;
        modalValue.slipCrtUnitCd = firstRow.slipCrtUnitCd;
        modalValue.drcrSeCd = firstRow.drcrSeCd;
        modalValue.indnSqn = firstRow.indnSqn;
        modalValue.accd = firstRow.accd;
        modalValue.accdNm = "";
        modalValue.erpTrCd = firstRow.erpTrCd;
        modalValue.erpTrCdNm = "";
        modalValue.accdSeType = firstRow.accdSeType;
        modalValue.refCol1 = firstRow.refCol1;
        modalValue.refCol2 = firstRow.refCol2;
        modalValue.desc = firstRow.desc;
        modalValue.aplBgnDt = firstRow.aplBgnDt;
        modalValue.aplEndDt = firstRow.aplEndDt;
        modalValue.useYn = firstRow.useYn;
        modalValue.year = dayJS(firstRow.aplBgnDt,'YYYYMMDDhhmmss').format('YYYY');

        modalIsShow.value = true;
    }else{
        toast('수정할 행을 선택바랍니다.',1000, 'error');
    }
}

const modalYearChange = (e) => {
    console.log(e.target.min, e.target.max, e.target.validity.valid, e);
    if(e.target.validity.valid){
        if(_.isNumber(modalValue.year)){
            modalValue.aplBgnDt = modalValue.year + "0101000000";
            modalValue.aplEndDt = "20991231235959";
        }
    }else{
        modalValue.year = dayJS().format("YYYY");
        modalValue.aplBgnDt = modalValue.year + "0101000000";
        modalValue.aplEndDt = "20991231235959";
    }
}

const accdModalIsShow = ref(false);
let accdModalKind = '';
let accdModalTargetData = {};

const accdModalOpen = (option) => {
    
    accdModalKind = option;
    if(option == 'Inner'){
		accdModalTargetData.innerList = accdList.value;
        accdModalTargetData.accd = formData.accd;
	}else if(option == 'Erp'){
        accdModalTargetData.innerList = [];
        accdModalTargetData.accd = modalValue.accd;
        modalIsShow.value = false;
    }
	accdModalIsShow.value = true;
    
}

const accdModalclose = async (btn, name) => {
    if(btn === 'modalconfirm'){

    }else if(btn === 'modaldelete'){
        if(accdModalKind == 'Inner'){
            formData.accd = "";
        }else if(accdModalKind == 'Erp'){
            modalValue.accd = "";
            modalValue.accdNm = "";
        }
    }
    
	accdModalIsShow.value = false; 

    if(accdModalKind == 'Erp'){
        modalIsShow.value = true;
    }

}

const receiveAccd = (v) => {
	if(accdModalKind === 'Inner'){
        formData.accd = v.acctCd;
    }else if(accdModalKind === 'Erp'){
        modalValue.accd = v.acctCd;
        modalValue.accdNm = v.acctNm;
    }

    accdModalIsShow.value = false;

    if(accdModalKind == 'Erp'){
        modalIsShow.value = true;
    }
    
}

const erpTrModalIsShow = ref(false);
let erpTrModalKind = '';
let erpTrModalTargetData = {};

const erpTrModalOpen = (option) => {
    
    erpTrModalKind = option;
    if(option == 'Inner'){
		//notthing...
	}else if(option == 'Erp'){
        //모달을 두개 띄운후 하나 닫을때 dimmed 처리가 없어져서 
        //이전에 띄운것은 일시적으로 없앤 후 바깥에 띄운것이 꺼질때 다시 띄움
        erpTrModalTargetData.searchText = modalValue.erpTrCd;
        modalIsShow.value = false;
    }

	erpTrModalIsShow.value = true;
}

const erpTrModalclose = async (btn, name) => {
    if(btn === 'modalconfirm'){

    }else if(btn === 'modaldelete'){
        if(erpTrModalKind === 'Erp'){
            modalValue.erpTrCd = "";
            modalValue.erpTrCdNm = "";
        }
    }
    
	erpTrModalIsShow.value = false; 

    if(erpTrModalKind == 'Erp'){
        modalIsShow.value = true;
    }

}

const receiveErpTr = (v) => {
	if(erpTrModalKind === 'Inner'){
        formData.erpTrCd = v.acctCd;
    }else if(erpTrModalKind === 'Erp'){
        modalValue.erpTrCd = v.trCd;
        modalValue.erpTrCdNm = v.trNm;
    }

    erpTrModalIsShow.value = false;

    if(erpTrModalKind == 'Erp'){
        modalIsShow.value = true;
    }
    
}

</script>
