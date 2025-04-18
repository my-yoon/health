<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>조건검색</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="state.searchOptions.cnSercSe">
                                <option value="" selected>선택</option>
                                <option value="mjcsCtgr">대카테고리명</option>
                                <option value="mdcsCtgr">중카테고리명</option>
                            </select>
                        </span>
                        <span class="dv"><input type="text" class="form-control sm" v-model="state.searchOptions.cnSercCts" :disabled="!state.searchOptions.cnSercSe"></span>
                    </span>
                </div>
                <div class="item">
                    <label>사용여부</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="state.searchOptions.useYn">
                                <option value="" selected>전체</option>
                                <option value="Y">사용</option>
                                <option value="N">미사용</option>
                            </select>
                        </span>
                    </span>
                </div>

                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button type="button" class="btn btn-sm">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                </div>
            </div>

        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <!-- <button type="button" class="btn btn-ss" @click="checkDel">
                        미사용
                    </button> -->
                    <button type="button" class="btn btn-ss" @click="checkRegist">등록</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <!-- <button type="button" class="btn btn-opt" @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button> -->
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />

                    <button type="button" class="btn btn-opt-ico fit" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                    <!-- 클래스 : full -->
                    <!-- 클래스 : close -->
                    <button type="button" class="btn btn-opt-ico filter full" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.categoryList.length === 0"></NoData>
            <div v-else>
                <AgGridVue
                    :columnDefs="state.tableColum_c"
                    :defaultColDef="state.defaultColDef"
                    :rowData="state.categoryList"
                    :domLayout="'autoHeight'"
                    class="ag-theme-alpine"
                    style="width:100%"
                    @grid-ready="onGridReady"
                />
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>

        <!-- 카테고리 등록 -->
        <DefaultModal :isShow="isShow" :modalName="'isShow'" :modalTitle="'카테고리 등록'" :buttonConfirm="'저장'"
            :buttonCancel="'취소'" @modalclose="modalControl">
            <template #modalcontent>
                <div>
                    <div class="ui-grid-top-guide t-right">
                        <span class="ess"></span> 표시는 필수항목입니다.
                    </div>
                    <div class="tbl-wrap mt-10">
                        <table class="table reg">
                            <colgroup>
                                <col style="width: 120px;">
                                <col style="width: auto;">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th scope="row">메세지 코드<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td colspan="3">

                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input type="text" class="form-control" v-model="state.formData.msgCd"
                                                    @focus="inabaledInput" :readonly="state.editmode">
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

    </section>
</template>

<script>
import { computed, reactive, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _upDateMessage, _registMessage, _setUnused } from '@/api/standard.js';
import { _getTodoCategory } from '@/api/service.js';

export default {
    components: { DefaultModal, DateSerch },
    setup() {
        const $Modal = inject('$Modal');
        const store = useStore();
        
        const { goToPage, tableResize } = useCommFunc();
        const { onChangeRegistRol, onChangeEditRol, onChangeDelRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        
        const isShow = ref(false);
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1'
            },
            { headerName: '코드', field: 'msgCd' },
            { headerName: '메세지', field: 'msgCts' },
            { headerName: '사용여부', field: 'useYn' }
        ]);

        const state = reactive({
            tableColum_c: _.clone(initColum.value),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            // download: { pass: '', reason: '' },
            searchOptions: {
                cnSercSe: '', // 검색옵션 [대카테고리명(mjcsCtgr), 중카테고리명(mdcsCtgr)]
                cnSercCts: '', // 검색 내용
                useYn: '' // 사용여부 [사용(Y), 미사용(N)]
            },
            pagesize: 10,
            categoryList: [],

            messageList: [],
            messageType: '',
            searchWord: '',
            useYn: '',
            msgCode: '',
            msgDetail: {},
            formData: {
                msgSn: '',
                msgCd: '',
                msgCts: '',
                fstRgtrId: '',
                fstRgsDt: '',
                lastUpdrId: 'Master',
                lastUpdrDt: new Date(),
                useYn: ''
            },
            editmode: true,
            messageModalTitle: '메세지 상세/수정',
            messageModalType: 'detail',
            unusedList: [],
            gridApi: null,
            gridColumApi: null
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: '/common/api/v1/user/userList/excel'

        });

        /**
         * @pager
         */
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        watch(() => state.searchOptions.cnSercSe, () => {
            state.searchOptions.cnSercCts = '';
        });

        onMounted(() => {
            // getMessageList();
            getTodoCategory();

            emitter.$on('onChangeRegist', onChangeRegist);
        });

        onUnmounted(() => {
            emitter.$off('onChangeRegist');
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
            openMessageModal('regist');
            // goToPage('/cs_center/notice/detail');
        };

        /**
         * todo - category 목록 조회
         */
        const getTodoCategory = async () => {
            try {
                const params = {
                    cnSercSe: state.searchOptions.cnSercSe, // 검색옵션 [대카테고리명(mjcsCtgr), 중카테고리명(mdcsCtgr)]
                    cnSercCts: state.searchOptions.cnSercCts, // 검색 내용
                    useYn: state.searchOptions.useYn, // 사용여부 [사용(Y), 미사용(N)]
                    size: pager.size,
                    offset: pager.offset
                };
                const response = await _getTodoCategory(params);
            } catch (error) {
                console.log(error);
            }
        };
        
        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        // 체크 박스 선택시 
        const onRowSelect = (e) => {
            console.log(state.gridApi.getSelectedRows());
            const rowlist = state.gridApi.getSelectedRows();
            state.unusedList = rowlist.map(item => item.msgSn);
            // console.log(state.unusedList);
        };

        //테이블 셀 선택
        // const onCellClicked = (e) => {
        //     // console.log(state.gridApi.getFocusedCell().column);
        //     const code = state.gridApi.getFocusedCell().column.colId === 'msgCd';
        //     state.msgCode = e.data.msgSn;
        //     if (code) {
        //         openMessageModal('edit');
        //         // getMessageDetail();
        //     }
        // };
        //페이징 처리 
        const onChangedPage = (num) => {
            pager.current = num;
            //테이블 인덱스 번호 처리
            initColum.value[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            // getMessageList();
            getTodoCategory();
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
            // getMessageList();
            // getTodoCategory();
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            state.searchOptions = {
                cnSercSe: '',
                cnSercCts: '',
                useYn: ''
            };
            onChangedPage(num);
            // getMessageList();
            // getTodoCategory();
        };
        //리스트 조회
        // const getMessageList = async () => {
        //     try {
        //         let params = {
        //             size: pager.size,
        //             offset: pager.offset,
        //             msgCd: state.messageType === 'msgCd' ? state.searchWord : '',
        //             msgCts: state.messageType === 'msgCts' ? state.searchWord : '',
        //             fstRgtrId: '',
        //             lastUpdrId: '',
        //             useYn: state.useYn
        //         };
        //         const response = await _getMessageList(params);
        //         state.messageList = response.data.data.list;
        //         pager.totalCnt = response.data.data.totalCnt;
        //     } catch (error) {
        //         console.log(error);
        //     }
        // };
        //리스트 상세
        // const getMessageDetail = async () => {
        //     try {
        //         let params = state.msgCode;
        //         const response = await _getMessageDetail(params);
        //         state.formData = {
        //             msgSn: response.data.data.msgSn,
        //             msgCd: response.data.data.msgCd,
        //             msgCts: response.data.data.msgCts,
        //             fstRgtrId: response.data.data.fstRgtrId,
        //             fstRgsDt: response.data.data.fstRgsDt,
        //             lastUpdrId: response.data.data.lastUpdrId,
        //             lastUpdrDt: response.data.data.lastUpdrDt,
        //             useYn: response.data.data.useYn
        //         };
        //     } catch (error) {
        //         console.log(error);
        //     }
        // };

        //리스트 수정시 인풋 활성화
        const inabaledInput = () => {
            state.editmode = false;
        };


        //메세지 상세 수정 등록 팝업 열기 
        const openMessageModal = (type) => {
            if (type === 'edit') {
                state.messageModalType = 'detail';
                isShow.value = true;
            } else {
                state.messageModalType = 'regist';
                state.messageModalTitle = '메세지 등록';
                state.formData = {
                    msgSn: '',
                    msgCd: '',
                    msgCts: '',
                    fstRgtrId: '',
                    fstRgsDt: '',
                    lastUpdrId: '',
                    lastUpdrDt: '',
                    useYn: ''
                };
                isShow.value = true;
                state.editmode = false;
            }

        };

        // 메세지 상세 수정 등록 팝업 닫기
        const modalControl = (type, modalName) => {
            console.log(type);
            if (modalName === 'isShow') {
                isShow.value = false;
                if (type === 'modalconfirm') {
                    if (state.messageModalType === 'regist') {
                        registMessage();
                    } else {
                        checkEdit();
                        // upDateMessage();
                    }
                }
            }
        };
        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };

        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };
        
        // 컬럼 변경
        const resetTable = () => {
            const columlist = _.clone(initColum.value);
            state.tableColum_c = columlist.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        return {
            //공통 사용
            $Modal,
            tableResize,
            
            state,
            pager,
            isShow,
            initColum,
            
            onGridReady,
            // onCellClicked,
            reloadList,
            onChangedPage,
            selectedOptions,
            modalControl,
            checkOptions,
            resetTable,
            inabaledInput,
            onRowSelect,

            onChangeDownRol,
            exelParams,
            checkRegist
        };
    }
};
</script>