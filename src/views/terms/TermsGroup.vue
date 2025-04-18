<template>
    <section class="temp-section">
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>약관그룹명</label>
                    <span class="input">
                        <span class="dv">
                            <input v-model="formData.searchText" type="text" class="form-control sm">
                        </span>
                    </span>
                </div>
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회</button>
                    <button type="button" class="btn btn-sm" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">초기화</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="checkDel">삭제</button>
                    <button type="button" class="btn btn-ss" @click="modalOpen">등록</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />

                    <button type="button" class="btn btn-opt-ico fit" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                </div>
            </div>
            <div id="myGrid" class="ag-theme-alpine"></div>

            <NoData v-if="state.termsGroup.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else ref="agGrid">
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                    :domLayout="state.domLayout" :rowData="state.termsGroup" @cell-clicked="onRowSelect"
                    :suppressRowClickSelection="true" @grid-ready="onGridReady" @selection-changed="onRowSelect"
                    :rowSelection="'multiple'" class="ag-theme-alpine" style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>

        <DefaultModal :buttonCancel="'취소'" :buttonConfirm="'등록'" :isShow="isTermsGroupShow" :modalName="'isTermsGroupShow'"
            modalTitle="약관그룹" @modalclose="modalClose">
            <template #modalcontent>
                <!-- <SellerSerch :admnSn="state.admnSn"/> -->
                <div class="ui-title-3">
                    <h3>약관그룹{{ state.isEdit ? '수정' : '등록' }}</h3>
                </div>
                <div class="tbl-wrap mt-10">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 120px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">약관그룹명</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <!-- <input v-model="formData.checkTermsGroupName" type="text" class="form-control"> -->
                                            <input v-model="formData.checkTermsGroupName" type="text" class="form-control"
                                                :class="state.validState.errState ? 'error' : ''">
                                        </div>
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                @click="checkTermsGroupName">중복확인</button>
                                        </div>
                                    </div>
                                    <p v-if="state.validState.message" class="input-guide"
                                        :class="{ 'error': state.validState.errState }">
                                        {{ state.validState.message }}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </DefaultModal>
    </section>
</template>
<script>
import { computed, reactive, onMounted, inject, ref, onUnmounted, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import SellerSerch from '@/components/ui/SellerSerch.vue';
import { _getAdminMember, _updateAdminMenuRole } from '@/api/permission';
import { _getTermsGroup, _checkTermsGroupName, _setTermsGroup } from '@/api/terms';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';

export default {
    components: { DefaultModal, DateSerch, SellerSerch },
    setup() {
        const store = useStore();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');

        /**
         * 권한은 스토어에서 가져옴 (권한여부는 메뉴리스트에서 가져온다)
         * store.state.getMenuItem.menuInfo
         * "auth1RegistYn": "Y/N",  등록
         * "auth2UpdateYn": "Y/N",  수정
         * "auth3DeleteYn": "Y/N",  삭제
         * "auth4ApproveYn": "Y/N", 승인
         * "auth5DownloadYn": "Y/N", 다운 
         * "auth6MaskingYn": "Y/N" 마스킹
         */
        const { onChangeRegistRol, onChangeEditRol, onChangeDelRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const { fileDown, tableResize, openModal, isDownShow } = useCommFunc();
        const initColum = ref([
            { headerName: '선택', field: 'select', maxWidth: 50, checkboxSelection: true, headerCheckboxSelection: true },
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '약관그룹', field: 'clusGrpNm', flex: 1 },
            { headerName: '등록일시', field: 'fstRgsDt', flex: 1 },
            { headerName: '수정일시', field: 'lastUpdDt', flex: 1 }
        ]);

        const isTermsGroupShow = ref(false);
        // const DownModalConRef = ref(null);
        const state = reactive({
            pagesize: 10,
            termsGroup: [], // 약관그룹목록
            selectTermsGroup: [], // 약관그룹 선택목록 (삭제용)
            isEdit: false, // 수정모드
            filterCoulm: [],
            tableColum_c: _.clone(initColum.value),
            // 테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            gridApi: null,
            gridColumApi: null,
            admnSn: null, // 선택 admin ( selected row )
            domLayout: 'autoHeight',
            isCheckTermsName: false, // 중복확인 여부
            validState: {
                errState: false, // error state
                message: '' // input message
            },
            menuCode: '1012001', // 약관그룹관리 로그메뉴코드
            download: { pass: '', reason: '' }
        });

        // 검색 조건
        const formData = reactive({
            searchText: '', // 약관그룹명
            checkTermsGroupName: '', // 중복확인 약관그룹명
            clusGrpSn: null // 수정할 item
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                menuCode: computed(() => menuInfo.value.menuCode),
                clusGrpNm: computed(() => formData.searchText)
            },
            url: '/common/api/v1/clauseGroup/excel'
        });

        watch(formData, () => {
            // console.log('change check terms name');
            resetState();
        });

        onMounted(() => {
            getTermsGroup();

            emitter.$on('onChangeRegist', onChangeRegist);
            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });

        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });

        /**
         * 등록 권한 체크
         */
        const checkRegist = async () => {
            await onChangeRegistRol(menuInfo.value.auth1RegistYn);
        };

        /**
         * 등록 권한 체크 callback
         */
        const onChangeRegist = () => {
            setTermsGroup(); // 등록(수정)
            resetState(); // validation 상태 초기화
        };

        /**
         * 수정 권한 체크
         */
        const checkEdit = () => {
            onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            setTermsGroup(); // 등록(수정)
            resetState(); // validation 상태 초기화
        };

        /**
         * 삭제 권한 체크
         */
        const checkDel = async () => {
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            removeTermsGroup();
        };

        /**
         * @validation 상태 초기화
         */
        const resetState = () => {
            state.isCheckTermsName = false; // 중복확인
            state.validState.errState = false; // validation
            state.validState.message = '';
        };

        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
            // console.log(params.columnApi);
        };

        // 페이징
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        // 페이징 처리
        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            getTermsGroup();

        };

        /**
         * 약관그룹조회
         */
        const getTermsGroup = async () => {
            try {
                const params = {
                    size: pager.size,
                    offset: pager.offset,
                    clusGrpNm: formData.searchText
                };
                const response = await _getTermsGroup(params);

                console.log('>> get', response);

                state.termsGroup = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        // 조회 초기화
        const onInitDate = () => {
            //리스트 재조회
            clearList(1);
            getTermsGroup();
        };

        // 셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };

        // 컬럼 변경
        const resetTable = () => {
            const columlist = _.clone(initColum.value);
            state.tableColum_c = columlist.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        const clearList = (num) => {
            formData.searchText = ''; //내용
            formData.page = num;

            onChangedPage(num);
        };

        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);

            state.admnSn = null;
        };

        /**
         * 약관그룹명 중복조회
         * @params {
         *      clusGrpNm: 약관그룹명
         * }
         * @return dplYn (Y: 중복된그룹있음, N: 등록가능한 그룹명)
         */
        const checkTermsGroupName = async () => {
            try {
                // isTermsGroupShow.value = false;
                // 약관그룹명 validation check()
                if (!validTermsGroupName()) return false;
                const params = {
                    clusGrpNm: formData.checkTermsGroupName
                };
                const response = await _checkTermsGroupName(params);
                console.log('약관그룹명 중복조회', response);


                if (response.data.data.dplYn === 'Y') {
                    state.validState.errState = true;
                    state.validState.message = '동일한 약관그룹명이 있습니다. 다른 약관그룹명을 사용해주세요.';
                } else {
                    state.isCheckTermsName = true; // 등록 > 중복확인 요청 flag
                    state.validState.errState = false;
                    state.validState.message = '사용할 수 있는 약관그룹명입니다.';
                }
            } catch (error) {
                console.log(error);
            }
        };
        const validTermsGroupName = () => {
            state.validState.errState = true;
            if (_.isEmpty(formData.checkTermsGroupName)) {
                state.validState.message = '사용할 약관그룹명을 입력해주세요.';
                return false;
            }
            if (formData.checkTermsGroupName.length < 4 || formData.checkTermsGroupName.length > 30) {
                state.validState.message = '약관그룹명은 4~30자로 입력해주세요.';
                return false;
            }
            state.validState.errState = false;
            return true;
        };

        /**
         * 약관그룹 등록
         */
        const setTermsGroup = async () => {
            try {
                let params = [{
                    clusGrpSn: formData.clusGrpSn || 0,
                    clusGrpNm: formData.checkTermsGroupName,
                    isDel: false
                }];
                const response = await _setTermsGroup(params);

                console.log('>> 약관그룹 등록', response);

                reloadList();
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 약관그룹 rowSelect 수정
         * @onRowSelect
         */
        const onRowSelect = (e) => {
            // 삭제 목록
            state.selectTermsGroup = state.gridApi.getSelectedRows();
            // const rowItem = state.gridApi.getFocusedCell().column;
            // state.gridApi.getFocusedCell().column.colId
            console.log('약관그룹 rowSelect 수정', e.data);
            const rowItem = e.data;
            // 수정모드
            if (rowItem) {
                state.isEdit = true;
                formData.clusGrpSn = rowItem.clusGrpSn;
                formData.checkTermsGroupName = rowItem.clusGrpNm;
                modalOpen();
            }
        };
        const removeTermsGroup = async (item) => {
            try {
                console.log('removeTermsGroup', toast());
                if (_.isEmpty(state.selectTermsGroup)) {
                    toast('삭제할 그룹을 선택해주세요.', 1000, 'error');
                    return false;
                }
                const params = state.selectTermsGroup.map(d => {
                    const item = {
                        clusGrpSn: d.clusGrpSn,
                        isDel: 1
                    };
                    return item;
                });
                const response = await _setTermsGroup(params);

                // console.log('>> 약관그룹 삭제', response);
                if (response.data.code === 200) toast('삭제 되었습니다.', 1000, 'success');

                reloadList();
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @modal
         */
        const modalOpen = () => {
            isTermsGroupShow.value = true;
        };
        const modalClose = (type, name) => {
            console.log(type, name);
            isTermsGroupShow.value = false;
            if (type === 'modalconfirm' && name === 'isTermsGroupShow') {
                // 중복확인
                if (!state.isCheckTermsName) {
                    toast('중복확인 해주세요.', 1000, 'error');
                    modalOpen();
                    return false;
                } else {
                    if (state.isEdit) checkEdit();
                    else checkRegist();
                }
            }
            if (!name) {
                // isDownShow.value = false;
            }
            state.isEdit = false;
            formData.clusGrpSn = null;
            formData.checkTermsGroupName = null;
        };

        return {
            $Modal,
            dayJS,
            state,
            pager,
            initColum,
            formData,
            openModal,
            // fileDown,
            // isDownShow,
            isTermsGroupShow,
            // DownModalConRef,
            onGridReady,
            onChangedPage,
            onInitDate,
            reloadList,
            selectedOptions,
            tableResize,
            resetTable,
            // onChangeMasking,
            onRowSelect,
            removeTermsGroup,
            checkTermsGroupName,
            modalOpen,
            modalClose,
            // exelConfirm,

            menuInfo,
            exelParams,
            onChangeDownRol,
            checkRegist,
            checkEdit,
            checkDel
        };
    }
};

</script>