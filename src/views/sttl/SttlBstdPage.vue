<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>정산기준코드</label>
                    <span class="input">
                        <span class="dv">
                            <input type="text" class="form-control sm" placeHolder="정산기준코드" v-model="formData.sttlBstdCd"
                                @keyup.enter="onChangedPage(1)" />
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
                <div class="item">
                    <label>정산기준코드명</label>
                    <span class="input">
                        <span class="dv">
                            <input v-model="formData.sttlBstdCdNm" type="text" class="form-control sm"
                                placeHolder="정산기준코드명" @keyup.enter="onChangedPage(1)" />
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>일자검색</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.dateSearchType">
                                <option value="">전체</option>
                                <option value="st">시작일자</option>
                                <option value="ed">종료일자</option>
                            </select>
                        </span>
                        <span class="dv">
                            <div class="ui-datepicker">
                                <DatePicker v-model="formData.searchDate" :format="'yyyy-MM-dd'" locale="ko"
                                    :clearable="true" :enable-time-picker="false" text-input :text-input-options="{format:'yyyyMMdd'}" auto-apply />
                            </div>
                        </span>
                    </span>
                </div>
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button type="button" class="btn btn-sm" @click="clearList">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                </div>
            </div>
            <!-- 상세검색 -->
        </div>
        <!-- 테이블 -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="insertPopup">추가</button>
                    <button type="button" class="btn btn-ss" @click="updatePopup">수정</button>
                    <button type="button" class="btn btn-ss" @click="updateUseYn('Y')">사용</button>
                    <button type="button" class="btn btn-ss" @click="updateUseYn('N')">미사용</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <!-- <FileDownLoad :api-url="state.excelDown.apiUrl" :is-reason="state.excelDown.isReason" :params="downloadFormData"/> -->
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
                    @cell-double-clicked="onCellDoubleClicked"
                    :suppressRowClickSelection="true" @selection-changed="onRowSelect" rowSelection="multiple"
                    class="ag-theme-alpine" domLayout="autoHeight">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </template>
        </div>
    </section>
    <DefaultModal :isShow="modalIsShow" :modalName="modalKind" :modalTitle="modalKind == 'I' ? '기준정보 추가' : '기준정보 수정'"
        :buttonConfirm="'저장'" :buttonCancel="'취소'" @modalclose="modalclose">
        <template #modalcontent>
            <div class="ui-grid-top-guide">
                <p>정산기준정보를 {{ modalKind == 'I' ? '입력' : '수정' }}합니다.</p>
            </div>
            <div class="ui-grid-top-guide t-right">
                <span class="ess"></span> 표시는 필수항목입니다.
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 125px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">정산기준코드<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" placeholder="정산기준코드를 입력해주세요."
                                            v-model="modalValue.sttlBstdCd" :readonly="modalKind == 'M'">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">정산기준코드명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" placeholder="정산기준코드의 명칭을 입력해주세요."
                                            v-model="modalValue.sttlBstdCdNm">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">설명</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <textarea id="textarea" class="form-control" placeholder="정산기준코드의 상세설명을 입력해주세요."
                                            v-model="modalValue.sttlBstdCdDscr" style="height: 100px"></textarea>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">사용여부</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <select class="custom-select sm" v-model="modalValue.useYn">
                                            <option value="Y">사용</option>
                                            <option value="N">미사용</option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">시작일시</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <DatePicker locale="ko" cancelText="취소" selectText="선택"
                                            v-model="modalValue.aplBgnDt" :format="'yyyy-MM-dd HH:mm:ss'" :teleport="true"
                                            :clearable="false" hide-input-icon enable-seconds position="left" @closed="" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">종료일시</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <DatePicker locale="ko" cancelText="취소" selectText="선택"
                                            v-model="modalValue.aplEndDt" :format="'yyyy-MM-dd HH:mm:ss'" :teleport="true"
                                            :clearable="false" hide-input-icon enable-seconds position="left" @closed="" />
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
import { _getInstlSttlBstdListPaging, _createInstlSttlBstd, _modifyInstlSttlBstd } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');

const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();

const selectCol = [{ headerCheckboxSelection: true, headerName: '', field: 'checkbox', checkboxSelection: true, maxWidth: 50, sortable:false}];
const initColum = [
    {
        headerName: '번호',
        field: '',
        valueGetter: 'node.rowIndex + 1 ',
        width: 60,
        sortable: false,
        headerClass: 'centered',
        cellClass: 'centered'
    },
    { headerName: '정산기준코드', field: 'sttlBstdCd' },
    { headerName: '정산기준코드명', field: 'sttlBstdCdNm', width: 200 },
    { headerName: '설명', field: 'sttlBstdCdDscr', width: 500, wrapText: true, autoHeight: true, cellRenderer: (param) => _.replace(param.data.sttlBstdCdDscr, /\n/g, '<br/>') },
    { headerName: '사용여부', field: 'useYn', width: 90, cellClass: 'centered', valueGetter: (param) => param.node.data.useYn == 'Y' ? '사용' : '미사용' },
    { headerName: '시작일시', field: 'aplBgnDt', valueGetter: (param) => dayJS(param.node.data.aplBgnDt, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') },
    { headerName: '종료일시', field: 'aplEndDt', valueGetter: (param) => dayJS(param.node.data.aplEndDt, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }
];

const state = reactive({
    //테이블데이터
    tableColum_c: _.union(selectCol, initColum),
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
    excelDown: {
        isReason: true,
        apiUrl: '/common/api/v1/instl/sttlBstd/listExcel'
    },
    menuCode: '1017002'
});

const formData = reactive({
    useYn: '',
    dateSearchType: '',
    searchDate: '',
    sttlBstdCd: '',
    sttlBstdCdNm: ''
});

const downloadFormData = reactive({
    useYn: computed(() => formData.useYn),
    dateSearchType: computed(() => formData.dateSearchType),
    searchDate: computed(() => _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : ''),
    sttlBstdCd: computed(() => formData.sttlBstdCd),
    sttlBstdCdNm: computed(() => formData.sttlBstdCdNm),
    pageSize: 0,
    currentPage: 0,
    menuCode: state.menuCode
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
    e.node.setSelected(true);
    updatePopup();
};

const onChangedPage = (pagenum) => {
    //console.log(pagenum);
    pager.current = pagenum;
    //테이블 인덱스 번호 처리
    let target = state.tableColum_c.filter(item => item.headerName === '번호');
    if (!_.isEmpty(target)) {
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
    formData.useYn = '';
    formData.dateSearchType = '';
    formData.searchDate = '';
    formData.sttlBstdCd = '';
    formData.sttlBstdCdNm = '';

};

//리스트 갯수 변경 후 리스트 재 조회
const clearList = () => {
    initParams();
    onChangedPage(1);
};

const getList = async () => {
    try {
        let searhDate = _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : '';
        let params = {
            size: pager.size,
            offset: pager.offset,
            useYn: formData.useYn,
            dateSearchType: formData.dateSearchType,
            searchDate: _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : '',
            sttlBstdCd: formData.sttlBstdCd,
            sttlBstdCdNm: formData.sttlBstdCdNm
            //sorted: sortedColumns,
        };

        const response = await _getInstlSttlBstdListPaging(params);

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
    state.tableColum_c = _.union(selectCol, initColum.filter(item => !state.filterCoulm.includes(item.headerName)));
    return state.filterCoulm;
};

// 삭제할 컬럼 선택
const checkOptions = (value) => {
    state.filterCoulm = value;
};

const modalIsShow = ref(false);

const modalValue = reactive({
    sttlBstdCd: null,
    sttlBstdCdNm: null,
    sttlBstdCdDscr: null,
    useYn: null,
    aplBgnDt: null,
    aplEndDt: null
});
let modalKind = '';

const modalclose = async (btn, name) => {
    if (btn === 'modalconfirm') {
        let params = {
            sttlBstdCd: modalValue.sttlBstdCd,
            sttlBstdCdNm: modalValue.sttlBstdCdNm,
            sttlBstdCdDscr: modalValue.sttlBstdCdDscr,
            useYn: modalValue.useYn,
            aplBgnDt: dayJS(modalValue.aplBgnDt).format('YYYYMMDDHHmmss'),
            aplEndDt: dayJS(modalValue.aplEndDt).format('YYYYMMDDHHmmss')
        };
        let res = {};
        if (name == 'I') {
            res = await _createInstlSttlBstd(params);
        } else if (name == 'M') {
            res = await _modifyInstlSttlBstd(params);
        }
        if (res.data.code) {
            await $Modal.alert({
                title: '확인',
                message: (name == 'I' ? '추가' : '수정') + '되었습니다.',

                buttonText: {
                    ok: '확인'
                }
            });

        } else {

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
};

const insertPopup = () => {
    modalKind = 'I';
    modalValue.sttlBstdCd = '';
    modalValue.sttlBstdCdNm = '';
    modalValue.sttlBstdCdDscr = '';
    modalValue.useYn = 'Y';
    modalValue.aplBgnDt = dayJS(dayJS().format('YYYYMMDD') + '000000', 'YYYYMMDDHHmmss');
    modalValue.aplEndDt = dayJS('20991231235959', 'YYYYMMDDHHmmss');

    modalIsShow.value = true;
};

const updatePopup = () => {

    let selectedRow = state.gridApi.getSelectedRows();
    
    if(!_.isEmpty(selectedRow)){
        if(selectedRow.length > 1){
            toast('수정할 행 1개 만 선택바랍니다.',1000, 'error');
            return false;
        }
        modalKind = "M";

        let firstRow = selectedRow[0];

        modalValue.sttlBstdCd = firstRow.sttlBstdCd;
        modalValue.sttlBstdCdNm = firstRow.sttlBstdCdNm;
        modalValue.sttlBstdCdDscr = firstRow.sttlBstdCdDscr;
        modalValue.useYn = firstRow.useYn;
        modalValue.aplBgnDt = dayJS(firstRow.aplBgnDt, 'YYYYMMDDHHmmss');
        modalValue.aplEndDt = dayJS(firstRow.aplEndDt, 'YYYYMMDDHHmmss');

        modalIsShow.value = true;
    }else{
        toast('수정할 행을 선택바랍니다.',1000, 'error');
    }
};

const updateUseYn = async (useYn) => {
    let selectedRow = state.gridApi.getSelectedRows();

    if(!_.isEmpty(selectedRow)){
        const useYnStr = useYn=='Y'?'사용':'미사용'
        $Modal.confirm({
            title: useYnStr + ' 확인',
            message: '선택한 항목을 ' + useYnStr + '하겠습니까?',

            buttonText: {
                confirm: '확인',
                cancel: '취소'
            }
        })
        .then(async success => {
            for(let i = 0 ; i < selectedRow.length ; i++){
                let v = selectedRow[i];
                let params = {
                    sttlBstdCd:v.sttlBstdCd,
                    sttlBstdCdNm:v.sttlBstdCdNm,
                    sttlBstdCdDscr:v.sttlBstdCdDscr,
                    useYn:useYn,
                    aplBgnDt:v.aplBgnDt,
                    aplEndDt:v.aplEndDt,
                };
    
                let res = await _modifyInstlSttlBstd(params);
                if(res.data.code){
                    
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
            }
            toast('저장되었습니다.', 1000, 'success');
            getList();
        })
        .catch(error => {
            console.log('error:', error);
        });

    }else{
        toast('수정할 행을 선택바랍니다.',1000, 'error');
    }

}

</script>
