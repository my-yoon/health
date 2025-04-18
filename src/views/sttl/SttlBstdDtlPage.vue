<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>정산기준코드</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.sttlBstdCd" @change="getMetaList">
                                <option value="">전체</option>
                                <option v-for="(item, index) in searchBstdCds" :value="item.sttlBstdCd">{{ item.sttlBstdCdNm
                                }} : {{ item.sttlBstdCd }}</option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>정산기준메타번호</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.sttlBstdMetaNo">
                                <option value="">전체</option>
                                <option v-for="(item, index) in state.metaList" :value="item.sttlBstdMetaNo">{{
                                    item.sttlBstdMetaNo }}</option>
                            </select>
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
                    <button type="button" class="btn btn-sm" @click="state.openMore = !state.openMore">
                        <span class="txt">상세검색 열기</span>
                    </button>
                </div>
            </div>
            <!-- 상세검색 -->
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
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
                        <label>고정항목여부</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.fxnItmYn">
                                    <option value="">전체</option>
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                </select>
                            </span>
                        </span>
                    </div>
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
                                    <DatePicker v-model="formData.searchDate" :format="'yyyy-MM-dd'" locale="ko"
                                        :clearable="true" :enable-time-picker="false" auto-apply text-input :text-input-options="{format:'yyyyMMdd'}"/>
                                </div>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <TextBox v-model="formData.sttlBstd1Cts">정산기준1내용</TextBox>
                    </div>
                    <div class="item">
                        <TextBox v-model="formData.sttlBstd2Cts">정산기준2내용</TextBox>
                    </div>
                </div>
                <!-- <div class="form-item">
                    <div class="item">
                        <label>{{ initColum.filter(((o)=>o.field == 'sttlBstd1Cts'))[0].headerName }}</label>
                        <span class="input">
                            <span class="dv">
                                <input type="text" class="form-control sm"  v-model="formData.sttlBstd1Cts" @keyup.enter="onChangedPage(1)"/>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>{{ initColum.filter(((o)=>o.field == 'sttlBstd2Cts'))[0].headerName }}</label>
                        <span class="input">
                            <span class="dv">
                                <input type="text" class="form-control sm"  v-model="formData.sttlBstd2Cts" @keyup.enter="onChangedPage(1)"/>
                            </span>
                        </span>
                    </div>
                </div> -->
            </div>
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
    <DefaultModal :isShow="modalIsShow" :modalName="modalKind" :modalTitle="modalKind == 'I' ? '상세정보 추가' : '상세정보 수정'"
        :buttonConfirm="'저장'" :buttonCancel="'취소'" :buttonDelete="modalKind == 'M' ? false : false" @modalclose="modalclose"
        :className="'full'">
        <template #modalcontent>
            <div class="ui-section">
                <div class="ui-title-3">
                    <h3>· 정산기준코드/메타번호선택</h3>
                </div>
                <div class="tbl-wrap mt-10">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 125px;">
                            <col style="width: auto;">
                            <col style="width: 125px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">정산기준코드</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            {{ modalValue.sttlBstdCd }}
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">정산기준메타번호</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item" v-if="modalValue.sttlBstdMetaNo != ''">
                                            {{ modalValue.sttlBstdMetaNo }}
                                        </div>
                                        <div class="reg-item" v-else>
                                            <select class="custom-select sm" v-model="modalValue.sttlBstdMetaNoSelected">
                                                <option value="">선택</option>
                                                <option v-for="(item, index) in state.metaList"
                                                    :value="item.sttlBstdMetaNo">{{ item.sttlBstdMetaNo }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">사용여부</th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item ">
                                            <select class="custom-select" v-model="modalValue.useYn">
                                                <option value="Y">사용</option>
                                                <option value="N">미사용</option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">고정항목여부</th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <select class="custom-select" v-model="modalValue.fxnItmYn">
                                                <option value="Y">Yes</option>
                                                <option value="N">No</option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">표시순서</th>
                                <td colspan="3">
                                    <div class="reg-group inline">
                                        <div class="reg-item ">
                                            <input type="number" class="form-control" min="0" max="2147483647"
                                                v-model="modalValue.indnSqn" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">적용시작일시</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item ">
                                            <DatePicker locale="ko" cancelText="취소" selectText="선택"
                                                v-model="modalValue.aplBgnDt" :format="'yyyy-MM-dd HH:mm:ss'"
                                                :teleport="true" :clearable="false" hide-input-icon enable-seconds
                                                position="left" @closed="" />
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">적용종료일시</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <DatePicker locale="ko" cancelText="취소" selectText="선택"
                                                v-model="modalValue.aplEndDt" :format="'yyyy-MM-dd HH:mm:ss'"
                                                :teleport="true" :clearable="false" hide-input-icon enable-seconds
                                                position="left" @closed="" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="ui-section">
                <div class="ui-title-3">
                    <h3>· 정산기준내용</h3>
                </div>
                <div class="tbl-wrap mt-10">
                    <table class="table list">
                        <colgroup>
                            <col style="width: 120px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">메타명</th>
                                <th scope="row">내용</th>
                            </tr>
                            <tr v-for="(item, index) in modalValue.metaList">
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            {{ item }}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control"
                                                v-model="modalValue['sttlBstd' + (index + 1) + 'Cts']" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </DefaultModal>
</template>
<style>
.align-right {
	text-align: right;
}
</style>
<script setup>
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watchEffect, watch, toDisplayString } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getInstlSttlBstdList, _getInstlSttlBstdMetaList, _getInstlSttlBstdDtlListPaging, _createInstlSttlBstdDtl, _modifyInstlSttlBstdDtl, _deleteInstlSttlBstdDtl, _getInstlSttlBstdDtlMetaList } from '@/api/sttl.js';
import SttlSelectBox from './component/SttlSelectBox.vue';
import TextBox from './searchFilters/TextBox.vue';

const adminfo = defineProps(['adminfo']); //router 공통 파라미터 일단 받아줌

const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const store = useStore();
const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

const selectCol = [{ headerCheckboxSelection: true, headerName: '', field: 'checkbox', checkboxSelection: true, maxWidth: 50, sortable: false}];
const constColum = [
    { headerName: '정산기준코드', field: 'sttlBstdCd', width: 120 },
    { headerName: '정산기준메타번호', field: 'sttlBstdMetaNo', width: 135 },
    { headerName: '정산기준상세번호', field: 'sttlBstdDtlNo', width: 135 },
    { headerName: '고정항목여부', field: 'fxnItmYn', width: 110, cellClass: 'centered'},
    { headerName: '표시순서', field: 'indnSqn', width: 85, cellClass: 'align-right'},
    { headerName: '사용여부', field: 'useYn', width: 85, cellClass: 'centered', valueGetter: (param) => param.node.data.useYn == 'Y' ? '사용' : '미사용' },
    { headerName: '적용시작일시', field: 'aplBgnDt', width: 145 },
    { headerName: '적용종료일시', field: 'aplEndDt', width: 145 }
];

const initColum = ref([]);

const MAX_ITEM = 30;
const DEFAULT_WIDTH = 130;

const initColumInitialize = () => {
    initColum.value = _.clone(constColum);
    for (let i = 1; i <= MAX_ITEM; i++) {
        initColum.value.push({ headerName: '정산기준' + i + '내용', field: 'sttlBstd' + i + 'Cts', width: DEFAULT_WIDTH });
    }
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
    metaList: [],
    mskgnRlsYn: true,
});

const formData = reactive({
    sttlBstdCd: '',
    sttlBstd1Cts: '',
    sttlBstd2Cts: '',
    sttlBstdMetaNo: '',
    useYn: '',
    fxnItmYn: '',
    dateSearchType: '',
    searchDate: '',
    mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
});

const exelParams = reactive({
    params: {
        menuCode: computed(() => menuInfo.value.menuCode),
        sttlBstdCd: computed(() => formData.sttlBstdCd),
        sttlBstd1Cts: computed(() => formData.sttlBstd1Cts),
        sttlBstd1Cts: computed(() => formData.sttlBstd1Cts),
        sttlBstdMetaNo: computed(() => formData.sttlBstdMetaNo),
        useYn: computed(() => formData.useYn),
        fxnItmYn: computed(() => formData.fxnItmYn),
        dateSearchType: computed(() => formData.dateSearchType),
        searchDate: computed(() => _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : '')
    },
    url: '/common/api/v1/instl/sttlBstdDtl/listExcel'
});

let searchBstdCds = [];

const getBstdList = () => {
    _getInstlSttlBstdList()
        .then((res) => { searchBstdCds = res.data.data.list; });
};

const getMetaList = (e) => {

    _getInstlSttlBstdDtlMetaList({ sttlBstdCd: formData.sttlBstdCd })
        .then(
            (res) => {
                state.metaList = res.data.data.list;
                if (state.metaList.length === 1) {
                    formData.sttlBstdMetaNo = state.metaList[0].sttlBstdMetaNo;
                } else {
                    formData.sttlBstdMetaNo = '';
                }
            }
        ).then(
            (res) => {
                reloadList();
            }
        );
    
};

onMounted(() => {
    getBstdList();
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
    state.gridApi.deselectAll();
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
    formData.sttlBstdCd = '';
    formData.sttlBstd1Cts = '';
    formData.sttlBstd2Cts = '';
    formData.sttlBstdMetaNo = '';
    formData.useYn = '';
    formData.fxnItmYn = '';
    formData.dateSearchType = '';
    formData.searchDate = '';
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
            useYn: formData.useYn,
            fxnItmYn: formData.fxnItmYn,
            dateSearchType: formData.dateSearchType,
            searchDate: _.isDate(formData.searchDate) ? dayJS(formData.searchDate).format('YYYYMMDD') : '',
            sttlBstd1Cts: formData.sttlBstd1Cts,
            sttlBstd2Cts: formData.sttlBstd2Cts
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
    sttlBstdMetaNo: ''
});

const modalMetaInitialize = () => {
    modalValue.metaList = [];
    for (let i = 1; i <= MAX_ITEM; i++) {
        modalValue.metaList.push('정산기준' + i + '내용');
    }
};

modalMetaInitialize();

let modalKind = '';

const modalclose = async (btn, name) => {
    if (btn === 'modalconfirm') {

        if (!_.isNumber(modalValue.sttlBstdMetaNoSelected) && _.isEmpty(modalValue.sttlBstdMetaNoSelected)) {
            toast('정산기준메타번호를 선택 바랍니다.', 1000, 'error');
            return false;
        }

        let params = {
            sttlBstdCd: modalValue.sttlBstdCd,
            sttlBstdMetaNo: modalValue.sttlBstdMetaNoSelected,
            sttlBstdDtlNo: modalValue.sttlBstdDtlNo,
            indnSqn: modalValue.indnSqn,
            fxnItmYn: modalValue.fxnItmYn,
            useYn: modalValue.useYn,
            aplBgnDt: dayJS(modalValue.aplBgnDt).format('YYYYMMDDHHmmss'),
            aplEndDt: dayJS(modalValue.aplEndDt).format('YYYYMMDDHHmmss')
        };

        for (let i = 1; i <= MAX_ITEM; i++) {
            params['sttlBstd' + i + 'Cts'] = modalValue['sttlBstd' + i + 'Cts'];
        }

        let res = {};
        if (name == 'I') {
            res = await _createInstlSttlBstdDtl(params);
        } else if (name == 'M') {
            res = await _modifyInstlSttlBstdDtl(params);
        }
        if (res.data.code == 'OK') {
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
    } else if (btn === 'modaldelete') {
        console.log('삭제');
        let params = {
            sttlBstdCd: modalValue.sttlBstdCd,
            sttlBstdMetaNo: modalValue.sttlBstdMetaNoSelected,
            sttlBstdDtlNo: modalValue.sttlBstdDtlNo
        };

        let res = await _deleteInstlSttlBstdDtl(params);
        if (res.data.code == 'OK') {
            await $Modal.alert({
                title: '확인',
                message: '삭제 되었습니다.',

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

    if (_.isEmpty(formData.sttlBstdCd)) {
        toast('정산기준코드를 선택바랍니다.', 1000, 'error');
        return;
    }

    modalValue.sttlBstdCd = formData.sttlBstdCd;
    modalValue.sttlBstdMetaNo = formData.sttlBstdMetaNo;
    modalValue.sttlBstdMetaNoSelected = formData.sttlBstdMetaNo;
    modalValue.sttlBstdDtlNo = '';
    modalValue.indnSqn = 0;
    modalValue.fxnItmYn = 'N';
    modalValue.useYn = 'Y';
    modalValue.aplBgnDt = dayJS(dayJS(new Date()).format('YYYYMMDD') + '000000', 'YYYYMMDDHHmmss');
    modalValue.aplEndDt = dayJS('20991231235959', 'YYYYMMDDHHmmss');

    for (let i = 1; i <= MAX_ITEM; i++) {
        modalValue['sttlBstd' + i + 'Cts'] = '';
    }

    modalIsShow.value = true;
};

const updatePopup = () => {

    let selectedRow = state.gridApi.getSelectedRows();
    
    if (!_.isEmpty(selectedRow)) {
        if (selectedRow.length > 1) {
            toast('수정할 행 1개 만 선택바랍니다.', 1000, 'error');
            return false;
        }
        modalKind = 'M';

        let firstRow = selectedRow[0];
        modalValue.sttlBstdCd = firstRow.sttlBstdCd;
        modalValue.sttlBstdMetaNo = firstRow.sttlBstdMetaNo;
        modalValue.sttlBstdMetaNoSelected = firstRow.sttlBstdMetaNo;
        modalValue.sttlBstdDtlNo = firstRow.sttlBstdDtlNo;
        modalValue.indnSqn = firstRow.indnSqn;
        modalValue.fxnItmYn = firstRow.fxnItmYn;
        modalValue.useYn = firstRow.useYn;
        modalValue.aplBgnDt = dayJS(firstRow.aplBgnDt, 'YYYYMMDDHHmmss');
        modalValue.aplEndDt = dayJS(firstRow.aplEndDt, 'YYYYMMDDHHmmss');

        console.log('firstRow.sttlBstdMetaNo:', firstRow.sttlBstdMetaNo, 'modalValue.sttlBstdMetaNoSelected', modalValue.sttlBstdMetaNoSelected);

        for (let i = 1; i <= MAX_ITEM; i++) {
            modalValue['sttlBstd' + i + 'Cts'] = firstRow['sttlBstd' + i + 'Cts'];
        }

        modalIsShow.value = true;
    } else {
        toast('수정할 행을 선택바랍니다.', 1000, 'error');
    }
};

const updateUseYn = async (useYn) => {
    let selectedRow = state.gridApi.getSelectedRows();

    if (!_.isEmpty(selectedRow)) {
        const useYnStr = useYn == 'Y' ? '사용' : '미사용';
        $Modal.confirm({
            title: useYnStr + ' 확인',
            message: '선택한 항목을 ' + useYnStr + '하겠습니까?',

            buttonText: {
                confirm: '확인',
                cancel: '취소'
            }
        })
            .then(async success => {
                for (let i = 0 ; i < selectedRow.length ; i++) {
                    let v = selectedRow[i];
                    v.useYn = useYn;
    
                    let res = await _modifyInstlSttlBstdDtl(v);
                    if (res.data.code == 'OK') {
                    
                    } else {
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

    } else {
        toast('수정할 행을 선택바랍니다.', 1000, 'error');
    }

};

watch(
    [() => formData.sttlBstdMetaNo, () => modalValue.sttlBstdMetaNoSelected],
    ([formNewValue, modalNewValue], [formOldValue, modalOldValue]) => {

        if (formNewValue != formOldValue) {

            if (_.isEmpty(formNewValue)) {
                initColumInitialize();
                state.tableColum_c = _.union(selectCol, initColum.value);
            } else {
                _getInstlSttlBstdMetaList({ sort: 'sttlBstdMetaNo', text: formNewValue })
                    .then(
                        (res) => {
                            const setting = res.data.data.list[0];

                            let tempColum = _.clone(constColum);
                            for (let i = 1; i <= MAX_ITEM; i++) {
                                if (!_.isEmpty(setting['meta' + i + 'KorNm'])) {
                                    tempColum.push({ headerName: setting['meta' + i + 'KorNm'], field: 'sttlBstd' + i + 'Cts', width: DEFAULT_WIDTH });
                                }
                            }

                            state.tableColum_c = _.union(selectCol, tempColum);
                            initColum.value = _.union(tempColum);

                        }
                    );
            }
            //reloadList();
        }

        if (modalNewValue != modalOldValue) {

            if (_.isEmpty(modalNewValue) && !_.isNumber(modalNewValue)) {
                modalMetaInitialize();
            } else {
                _getInstlSttlBstdMetaList({ sort: 'sttlBstdMetaNo', text: modalNewValue })
                    .then(
                        (res) => {
                            const setting = res.data.data.list[0];

                            modalValue.metaList = [];
                            for (let i = 1; i <= MAX_ITEM; i++) {
                                if (!_.isEmpty(setting['meta' + i + 'KorNm'])) {
                                    modalValue.metaList.push(setting['meta' + i + 'KorNm']);
                                }
                            }
                        }
                    );
            }
        }
    }
);


</script>
