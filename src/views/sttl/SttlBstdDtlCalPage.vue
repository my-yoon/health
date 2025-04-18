<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>정산년도</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.sttlBstd1Cts">
                                <option value="">전체</option>
                                <option v-for="(item) in years" :value="item.value" :selected="item.selected">{{ item.value }}{{ item.value == thisYear?" (this Year)":"" }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>정산상태</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.sttlBstd6Cts">
                                <option value="">전체</option>
                                <option v-for="(item) in sttlStatusList" :value="item">{{ item }}</option>
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
                                <option value="Y">Yes</option>
                                <option value="N">No</option>
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
                    @cell-double-clicked="onCellDoubleClicked" :suppressRowClickSelection="true" @selection-changed="onRowSelect" rowSelection="multiple"
                    class="ag-theme-alpine" domLayout="autoHeight">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </template>
        </div>
    </section>
    <DefaultModal :isShow="modalIsShow" :modalName="modalKind" :modalTitle="'캘린더 ' + (modalKind=='I'?'추가':'수정')" :buttonConfirm="'저장'" :buttonCancel="'취소'" :buttonDelete="modalKind=='M'?false:false" @modalclose="modalclose" >
		<template #modalcontent>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 90px;">
                        <col style="width: auto;">
                        <col style="width: 90px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">정산년도<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item" v-if="modalKind=='I'">
                                        <DatePicker 
                                            locale="ko"
                                            ref="datepicker" 
                                            v-model="modalValue.sttlBstd1Cts" 
                                            :format="'yyyy'" 
                                            placeholder="년도선택"
                                            :year-range="[1990,2099]"
                                            hide-input-icon 
                                            auto-apply
                                            year-picker
                                            />
                                    </div>
                                    <div class="reg-item" v-else>
                                        {{ modalValue.sttlBstd1Cts }}
                                    </div>
                                </div>
                            </td>
                            <th scope="row">정산년월<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item" v-if="modalKind=='I'">
                                        <DatePicker 
                                            locale="ko"
                                            v-model="modalValue.sttlBstd2Cts" 
                                            :format="'yyyyMM'"
                                            position="right" 
                                            placeholder="년월선택"
                                            hide-input-icon 
                                            auto-apply
                                            month-picker
                                            arrow-navigation
                                            />
                                    </div>
                                    <div class="reg-item" v-else>
                                        {{ modalValue.sttlBstd2CtsValue }}
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">정산회차<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-group inline">
                                    <div class="reg-item" v-if="modalKind=='I'">
                                        <input type="number" class="form-control" inputmode="numeric" min="1" max="99" step="1" maxlength="2"
                                                v-model="modalValue.sttlBstd3Cts" pattern="\d{2}" required/>
                                    </div>
                                    <div class="reg-item" v-else>
                                        {{ modalValue.sttlBstd3Cts }}
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">시작일자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item" v-if="modalKind=='I'">
                                        <DatePicker 
                                            locale="ko" cancelText="취소" selectText="선택"
                                            v-model="modalValue.sttlBstd4Cts" 
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
                                    <div class="reg-item" v-else>
                                        {{ dayJS(modalValue.sttlBstd4Cts).format('YYYYMMDD') }}
                                    </div>
                                </div>
                            </td>
                            <th scope="row">종료일자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item" v-if="modalKind=='I'">
                                        <DatePicker 
                                            locale="ko" cancelText="취소" selectText="선택"
                                            v-model="modalValue.sttlBstd5Cts" 
                                            :format="'yyyy-MM-dd'"
                                            :teleport="true" 
                                            :clearable="false" 
                                            hide-input-icon 
                                            position="right" 
                                            :enable-time-picker="false"
                                            placeholder="날짜선택"
                                            text-input
                                            :text-input-options="{format:'yyyyMMdd'}"
                                            auto-apply
                                        />
                                    </div>
                                    <div class="reg-item" v-else>
                                        {{ dayJS(modalValue.sttlBstd5Cts).format('YYYYMMDD') }}
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">정산상태</th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item ">
                                        <select class="custom-select sm" v-model="modalValue.sttlBstd6Cts">
                                            <option v-for="(item) in sttlStatusList" :value="item">{{ item }}</option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                            <th scope="row">사용여부</th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item ">
                                        <select class="custom-select" v-model="modalValue.useYn">
                                            <option value="Y">Yes</option>
                                            <option value="N">No</option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="ui-title-3 mt-100">
            </div>
            <div class="ui-title-3 mt-100">
            </div>
            <div class="ui-title-3 mt-50">
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
import { _getInstlSttlBstdDtlListPaging, _createInstlSttlBstdDtl, _modifyInstlSttlBstdDtl, _deleteInstlSttlBstdDtl, } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');

const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();

let years = [];
const thisYear = dayJS().format('YYYY')
const YEAR_GAP = 7;
for(let i=0; i< YEAR_GAP*2 ; i++){
    const yearStr = dayJS().add(i-YEAR_GAP,'y').format('YYYY');
    years.push({value:yearStr, selected:yearStr == thisYear});
}

const sttlStatusList = ['Open', 'Close'];

const selectCol = [{ headerCheckboxSelection: true, headerName: '', field: 'checkbox', checkboxSelection: true, maxWidth: 50, sortable:false}];
const constColum = [
    { headerName: '사용여부', field: 'useYn', width:85},
    { headerName: '정산년도', field: 'sttlBstd1Cts', width:90},
    { headerName: '정산년월', field: 'sttlBstd2Cts', width:90},
    { headerName: '정산회차', field: 'sttlBstd3Cts', width:90},
    { headerName: '시작일자', field: 'sttlBstd4Cts', width:90},
    { headerName: '종료일자', field: 'sttlBstd5Cts', width:90},
    { headerName: '정산상태', field: 'sttlBstd6Cts', width:90},
];

const initColum = ref([]);

const MAX_ITEM = 30;
const DEFAULT_WIDTH = 130;

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
        cellClass:'centered',
        headerClass:'centered',
    },
    gridApi: null,
    gridColumApi: null,
    openMore: false,
    list: [],
    pagesize: 50,
    excelDown: {
        isReason: true,
        apiUrl: '/common/api/v1/instl/sttlBstdDtl/listExcel'
    },
    metaList:[],
});

const formData = reactive({
    sttlBstd1Cts:"",
    sttlBstd6Cts:"",
    useYn:"",
    sttlBstdCd:"STTL_CALENDAR",
    sttlBstdMetaNo:"8",
});

onMounted(() => {
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
    
};

const onCellDoubleClicked = (e) => {
    state.gridApi.deselectAll();
    e.node.setSelected(true);
    updatePopup();
};

const onChangedPage = (pagenum) => {
    //console.log(pagenum);
    pager.current = pagenum;
    //테이블 인덱스 번호 처리
    let target = state.tableColum_c.filter(item => item.headerName === '번호');
    if(!_.isEmpty(target)){
        target[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
    }
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
    formData.useYn = "";
    formData.fxnItmYn = "";
    formData.dateSearchType = "";
    formData.searchDate = "";
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
            sttlBstdCd: formData.sttlBstdCd,
            sttlBstdMetaNo: formData.sttlBstdMetaNo,
            sttlBstd1Cts: formData.sttlBstd1Cts,
            sttlBstd6Cts: formData.sttlBstd6Cts,
            useYn       : formData.useYn,
        };

        const response = await _getInstlSttlBstdDtlListPaging(params);
        
        state.rowData = response.data.data.list;
        pager.totalCnt = response.data.data.totalCnt;
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

const modalValue = reactive({
    sttlBstdCd:"STTL_CALENDAR",
    sttlBstdMetaNo:"8",
    sttlBstdDtlNo:"",
    fxnItmYn: 'Y',
	indnSqn: 1,
});

let modalKind = "";

const modalclose = async (btn, name) => {
    if(btn === 'modalconfirm'){

        if(_.isEmpty(modalValue.sttlBstd2Cts)){
            toast('정산년월을 선택 바랍니다.', 1000, 'error');
            return;
        }
        
        if(_.isEmpty(modalValue.sttlBstd3Cts) && !_.isNumber(modalValue.sttlBstd3Cts)){
            toast('정산회차을 입력 바랍니다.', 1000, 'error');
            return;
        }
        
        if(_.isEmpty(modalValue.sttlBstd4Cts) && !_.isDate(modalValue.sttlBstd4Cts)){
            toast('시작일자를 입력 바랍니다.', 1000, 'error');
            return;
        }
        if(_.isEmpty(modalValue.sttlBstd5Cts) && !_.isDate(modalValue.sttlBstd5Cts)){
            toast('종료일자를 입력 바랍니다.', 1000, 'error');
            return;
        }
        

        let tempDate = dayJS();
        tempDate = tempDate.year(modalValue.sttlBstd2Cts.year);
        tempDate = tempDate.month(modalValue.sttlBstd2Cts.month);

        let params = {
            sttlBstdCd : modalValue.sttlBstdCd ,
            sttlBstdMetaNo : modalValue.sttlBstdMetaNo ,
            sttlBstdDtlNo : modalValue.sttlBstdDtlNo ,
            sttlBstd1Cts : modalValue.sttlBstd1Cts,
            sttlBstd2Cts : tempDate.format('YYYYMM'),
            sttlBstd3Cts : modalValue.sttlBstd3Cts,
            sttlBstd4Cts : dayJS(modalValue.sttlBstd4Cts).format('YYYYMMDD'),
            sttlBstd5Cts : dayJS(modalValue.sttlBstd5Cts).format('YYYYMMDD'),
            sttlBstd6Cts : modalValue.sttlBstd6Cts,

            indnSqn : modalValue.indnSqn ,
            fxnItmYn : modalValue.fxnItmYn ,
            useYn : modalValue.useYn ,
            aplBgnDt : dayJS(modalValue.aplBgnDt).format('YYYYMMDDHHmmss') ,
            aplEndDt : dayJS(modalValue.aplEndDt).format('YYYYMMDDHHmmss') ,
        }
        
        let res = {};
        if(name == 'I'){
            res = await _createInstlSttlBstdDtl(params);
        }else if(name == 'M'){
            res = await _modifyInstlSttlBstdDtl(params);
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

            return false;
        }
        getList();
    }else if(btn === 'modaldelete'){
        console.log('삭제');
        let params = {
            sttlBstdCd : modalValue.sttlBstdCd ,
            sttlBstdMetaNo : modalValue.sttlBstdMetaNoSelected ,
            sttlBstdDtlNo : modalValue.sttlBstdDtlNo ,
        }

        let res = await _deleteInstlSttlBstdDtl(params);
        if(res.data.code){
            await $Modal.alert({
                title: '확인',
                message: '삭제 되었습니다.',

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

            return false;
        }
        getList();
    }
    modalIsShow.value = false;
}

const insertPopup = async () => {

    modalKind = "I";

    if(_.isEmpty(formData.sttlBstd1Cts)){
        modalValue.sttlBstd1Cts = dayJS().format("YYYY");
    }else{
        modalValue.sttlBstd1Cts = formData.sttlBstd1Cts;
    }

    modalValue.sttlBstdCd = formData.sttlBstdCd;
    modalValue.sttlBstdMetaNo = formData.sttlBstdMetaNo;
    modalValue.sttlBstdMetaNoSelected = formData.sttlBstdMetaNo;
    modalValue.sttlBstdDtlNo = "";
    modalValue.indnSqn = 0;
    modalValue.fxnItmYn = 'N';
    modalValue.useYn = 'Y';
    modalValue.sttlBstd2Cts = "";
    modalValue.sttlBstd3Cts = "";
    modalValue.sttlBstd4Cts = "";
    modalValue.sttlBstd5Cts = "";
    modalValue.sttlBstd6Cts = "Open";
    modalValue.aplBgnDt = dayJS(dayJS(new Date()).format('YYYYMMDD') + '000000','YYYYMMDDHHmmss');
    modalValue.aplEndDt = dayJS('20991231235959','YYYYMMDDHHmmss');

    modalIsShow.value = true;
}

const updatePopup = async () => {

    let selectedRow = state.gridApi.getSelectedRows();
    
    if(!_.isEmpty(selectedRow)){
        if(selectedRow.length > 1){
            toast('수정할 행 1개 만 선택바랍니다.',1000, 'error');
            return false;
        }
        modalKind = "M";

        let firstRow = selectedRow[0];

        modalValue.sttlBstdCd = firstRow.sttlBstdCd;
        modalValue.sttlBstdMetaNo = firstRow.sttlBstdMetaNo;
        modalValue.sttlBstdMetaNoSelected = firstRow.sttlBstdMetaNo;
        modalValue.sttlBstdDtlNo = firstRow.sttlBstdDtlNo;
        modalValue.indnSqn = firstRow.indnSqn;
        modalValue.fxnItmYn = firstRow.fxnItmYn;
        modalValue.useYn = firstRow.useYn;
        modalValue.aplBgnDt = firstRow.aplBgnDt;
        modalValue.aplEndDt = firstRow.aplEndDt;
        modalValue.sttlBstd1Cts = firstRow.sttlBstd1Cts;
        let tempDate = dayJS(firstRow.sttlBstd2Cts,'YYYYMM');
        modalValue.sttlBstd2Cts = {year:tempDate.year(), month:tempDate.month()};
        modalValue.sttlBstd2CtsValue = firstRow.sttlBstd2Cts;
        modalValue.sttlBstd3Cts = firstRow.sttlBstd3Cts;
        modalValue.sttlBstd4Cts = dayJS(firstRow.sttlBstd4Cts, 'YYYYMMDD');
        modalValue.sttlBstd5Cts = dayJS(firstRow.sttlBstd5Cts, 'YYYYMMDD');
        modalValue.sttlBstd6Cts = firstRow.sttlBstd6Cts;

        modalIsShow.value = true;
    }else{
        toast('수정할 행을 선택바랍니다.',1000, 'error');
    }
}
</script>
