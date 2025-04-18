<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>정산기준메타번호</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.sttlBstdMetaNo">
                                <option value="">전체</option>
                                <option v-for="(item, index) in metaList" :value="item.sttlBstdMetaNo">{{
                                    item.sttlBstdMetaNo }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>메타명</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.sort">
                                <option value="">전체</option>
                                <option value="eng">영문명</option>
                                <option value="kor">한글명</option>
                            </select>
                        </span>
                        <span class="dv">
                            <input type="text" class="form-control sm" placeHolder="정산기준코드" v-model="formData.text"
                                @keyup.enter="onChangedPage(1)" />
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
                    <!-- <button type="button" class="btn btn-sm" @click="state.openMore = !state.openMore">
                        <span class="txt">상세검색 열기</span>
                    </button> -->
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
                <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c" :rowData="state.rowData"
                    @grid-ready="onGridReady" @cell-clicked="cellClicked" @cell-double-clicked="onCellDoubleClicked"
                    headerHeight="24.5" :suppressRowClickSelection="true" @selection-changed="onRowSelect"
                    rowSelection="single" class="ag-theme-alpine" domLayout="autoHeight">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </template>
        </div>
    </section>
    <DefaultModal :isShow="modalIsShow" :modalName="modalKind" :modalTitle="modalKind == 'I' ? '메타값 추가' : '메타값 수정'"
        :buttonConfirm="'저장'" :buttonCancel="'취소'" @modalclose="modalclose" :className="'full'">
        <template #modalcontent>
            <div class="ui-grid-top-guide">
                <p>정산기준메타번호는 자동생성됩니다.</p>
                <p>메타명(영문), 메타명(한글), 메타설명은 직접 입력합니다.</p>
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table list">
                    <colgroup>
                        <col style="width: 92px;">
                        <col style="width: 28px;">
                        <col style="width: 184px;">
                        <col style="width: 212px;">
                        <col style="width: 212px;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row" colspan="2">정산기준메타번호</th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        {{ modalKind == 'I' ? '자동입력' : modalValue.sttlBstdMetaNo }}
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">메타항목</th>
                            <th scope="row" colspan="2">메타명(영문)</th>
                            <th scope="row">메타명(한글)</th>
                            <th scope="row">메타설명</th>
                        </tr>
                        <tr v-for="(index) in MAX_ITEM">
                            <th scope="row">메타{{ index }}</th>
                            <td colspan="2">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" placeholder="입력"
                                            v-model="modalValue['meta' + index + 'EngNm']">
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" placeholder="입력"
                                            v-model="modalValue['meta' + index + 'KorNm']">
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" placeholder="입력"
                                            v-model="modalValue['meta' + index + 'Dscr']">
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
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watchEffect, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { _getInstlSttlBstdMetaListPaging, _createInstlSttlBstdMeta, _modifyInstlSttlBstdMeta, _getInstlSttlBstdDtlMetaList } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');

const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();

const selectCol = [{ headerName: '', field: 'checkbox', checkboxSelection: true, maxWidth: 50, sortable: false }];
const initColum = [
    { headerName: '메타번호', field: 'sttlBstdMetaNo', width: 85 }
];
const MAX_ITEM = 30;
for (let i = 1; i <= MAX_ITEM; i++) {
    initColum.push({
        headerName: '메타' + i,
        marryChildren: true,
        children: [
            { headerName: '메타' + i + '영문명', field: 'meta' + i + 'EngNm', width: 140 },
            { headerName: '메타' + i + '한글명', field: 'meta' + i + 'KorNm', width: 140 },
            { headerName: '메타' + i + '설명', field: 'meta' + i + 'Dscr', width: 200 }
        ]
    });
}

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
});

const formData = reactive({
    sttlBstdMetaNo: '',
    sort: '',
    text: ''
});

let metaList = [];

const getMetaList = () => {
    _getInstlSttlBstdDtlMetaList()
        .then(
            (res) => {
                metaList = res.data.data.list;
            }
        );
};

onMounted(() => {
    getMetaList();
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
    console.log(e);
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
    formData.sttlBstdMetaNo = '';
    formData.sort = '';
    formData.text = '';
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
            sttlBstdMetaNo: formData.sttlBstdMetaNo,
            sort: formData.sort,
            text: formData.text
        };

        const response = await _getInstlSttlBstdMetaListPaging(params);

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

const modalValue = reactive({});

let modalKind = '';

const modalclose = async (btn, name) => {
    if (btn === 'modalconfirm') {
        let params = modalValue;

        let res = {};
        if (name == 'I') {
            res = await _createInstlSttlBstdMeta(params);
        } else if (name == 'M') {
            res = await _modifyInstlSttlBstdMeta(params);
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

    modalValue.sttlBstdMetaNo = '';
    for (let i = 1; i <= MAX_ITEM; i++) {
        modalValue['meta' + i + 'EngNm'] = '';
        modalValue['meta' + i + 'KorNm'] = '';
        modalValue['meta' + i + 'Dscr'] = '';
    }

    modalIsShow.value = true;
};

const updatePopup = () => {

    let selectedRow = state.gridApi.getSelectedRows();

    if (!_.isEmpty(selectedRow)) {
        modalKind = 'M';

        let firstRow = selectedRow[0];

        modalValue.sttlBstdMetaNo = firstRow.sttlBstdMetaNo;
        for (let i = 1; i <= MAX_ITEM; i++) {
            modalValue['meta' + i + 'EngNm'] = firstRow['meta' + i + 'EngNm'];
            modalValue['meta' + i + 'KorNm'] = firstRow['meta' + i + 'KorNm'];
            modalValue['meta' + i + 'Dscr'] = firstRow['meta' + i + 'Dscr'];
        }

        modalIsShow.value = true;
    }else{
        toast('수정할 행을 선택바랍니다.',1000, 'error');
    }
};

</script>
