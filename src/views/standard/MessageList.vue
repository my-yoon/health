<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>조건검색</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="state.messageType">
                                <option value="" selected>선택</option>
                                <option value="msgCd">코드명</option>
                                <option value="msgCts">한글명</option>
                            </select>
                        </span>
                        <span class="dv"><input type="text" class="form-control sm" v-model="state.searchWord"
                                :disabled="!state.messageType"></span>
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
                    <button type="button" class="btn btn-ss" @click="checkDel">
                        미사용
                    </button>
                    <button type="button" class="btn btn-ss" @click="checkRegist">등록</button>
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
                    <!-- 클래스 : full -->
                    <!-- 클래스 : close -->
                    <button type="button" class="btn btn-opt-ico filter full" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.messageList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                    :rowData="state.messageList" @grid-ready="onGridReady" @cell-clicked="onCellClicked"
                    :suppressRowClickSelection="true" @selection-changed="onRowSelect" :rowSelection="'multiple'"
                    class="ag-theme-alpine" :domLayout="'autoHeight'">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>
        <!-- 메세지 상세/수정 -->
        <DefaultModal :isShow="isShow" :modalName="'isShow'" :modalTitle="state.messageModalTitle" :buttonConfirm="'저장'"
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
                                <tr>
                                    <th scope="row">메세지<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td colspan="3">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input type="text" class="form-control" v-model="state.formData.msgCts"
                                                    @focus="inabaledInput" :readonly="state.editmode">
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">사용여부</th>
                                    <td colspan="3">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <select class="custom-select" v-model="state.formData.useYn"
                                                    @focus="inabaledInput" :disabled="state.editmode">
                                                    <option
                                                        :selected="!(state.formData.useYn === 'Y') && !(state.formData.useYn === 'N')">
                                                        선택</option>
                                                    <option value="Y" :selected="state.formData.useYn === 'Y'">사용</option>
                                                    <option value="N" :selected="state.formData.useYn === 'N'">미사용
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="state.messageModalType === 'detail'">
                                    <th scope="row">등록자</th>
                                    <td>{{ state.formData.fstRgtrId }}</td>
                                    <th scope="row">등록일시</th>
                                    <td>{{ state.formData.fstRgsDt }}</td>
                                </tr>
                                <tr v-if="state.messageModalType === 'detail'">
                                    <th scope="row">수정자</th>
                                    <td>{{ state.formData.lastUpdrId }}</td>
                                    <th scope="row">수정일시</th>
                                    <td>{{ state.formData.lastUpdrDt }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>
        </DefaultModal>
        <!-- 다운로드 사유 등록 -->
        <!-- <DefaultModal :isShow="isDownShow" :modalTitle="'다운로드 사유 등록'" :buttonConfirm="'저장'" :buttonCancel="''"
            :modalName="'isDownShow'" @modalclose="modalControl">
            <template #modalcontent>
                <DownModalCon @downloadFormat="downConfirm" />
            </template>
        </DefaultModal> -->

    </section>
</template>
<style></style>
<script>
import { computed, reactive, inject, onMounted, onUnmounted, ref } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getMessageList, _getMessageDetail, _upDateMessage, _registMessage, _setUnused } from '@/api/standard.js';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        // const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const isShow = ref(false);
        const { goToPage, tableResize, isPartnerShow, isDownShow, isImgShow } = useCommFunc();

        const { onChangeRegistRol, onChangeEditRol, onChangeDelRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const initColum = ref([
            {
                headerName: '선택',
                field: 'select',
                maxWidth: 50,
                checkboxSelection: true,
                headerCheckboxSelection: true
            },
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '코드', field: 'msgCd', Width: 350 },
            { headerName: '메세지', field: 'msgCts', width: 350 },
            { headerName: '사용여부', field: 'useYn', maxWidth: 120 },
            { headerName: '등록일', field: 'fstRgsDt', maxWidth: 150 },
            { headerName: '등록자', field: 'fstRgtrId', maxWidth: 100 },
            { headerName: '수정일', field: 'lastUpdrDt', maxWidth: 150 },
            { headerName: '수정자', field: 'lastUpdrId', maxWidth: 100 }

        ]);

        const state = reactive({
            tableColum_c: _.clone(initColum.value),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: true,
                filter: true,
                resizable: true,
                flex: 1
            },
            // download: { pass: '', reason: '' },
            messageList: [],
            messageType: '',
            searchWord: '',
            useYn: '',
            pagesize: 10,
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
                // inqType: computed(() => formData.inqType),
                // bgnDate: computed(() => formData.bgnDate),
                // endDate: computed(() => formData.endDate),
                // mbrStCd: computed(() => formData.mbrStCd),
                // mbrSexCd: computed(() => formData.mbrSexCd),
                // infAgrmAllYn: computed(() => formData.infAgrmAllYn),
                // infAgrmCpmYn: computed(() => formData.infAgrmCpmYn),
                // infAgrmSmsYn: computed(() => formData.infAgrmSmsYn),
                // infAgrmEmailYn: computed(() => formData.infAgrmSmsYn),
                // cnSercSe: computed(() => formData.cnSercSe),
                // cnSercCts: computed(() => formData.cnSercCts),
                // mskgnRlsYn: computed(() => formData.mskgnRlsYn)
            },
            url: '/common/api/v1/standardManagement/messageList/excel'

        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => {
            // emitter.$on('codeListDetail', tableBtnControl);
            getMessageList();

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
            openMessageModal('regist');
            // goToPage('/cs_center/notice/detail');
        };

        /**
         * 수정 권한 체크
         */
        const checkEdit = async () => {
            state.editmode = true;
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            state.editmode = false;
            registMessage();
            // saveNotice(state.pageType);
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
            checkedUnused();
            // listDel();
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
            // console.log(params.columnApi);
        };
        // 체크 박스 선택시 
        const onRowSelect = (e) => {
            console.log(state.gridApi.getSelectedRows());
            const rowlist = state.gridApi.getSelectedRows();
            state.unusedList = rowlist.map(item => item.msgSn);
            // console.log(state.unusedList);
        };
        //테이블 셀 선택
        const onCellClicked = (e) => {
            // console.log(state.gridApi.getFocusedCell().column);
            const code = state.gridApi.getFocusedCell().column.colId === 'msgCd';
            state.msgCode = e.data.msgSn;
            if (code) {
                openMessageModal('edit');
                getMessageDetail();
            }
        };
        //페이징 처리 
        const onChangedPage = (num) => {
            pager.current = num;
            //테이블 인덱스 번호 처리
            initColum.value[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getMessageList();

        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
            getMessageList();
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            state.searchWord = '';
            state.useYn = '';
            state.messageType = '';
            onChangedPage(num);
            getMessageList();
        };
        //리스트 조회
        const getMessageList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    msgCd: state.messageType === 'msgCd' ? state.searchWord : '',
                    msgCts: state.messageType === 'msgCts' ? state.searchWord : '',
                    fstRgtrId: '',
                    lastUpdrId: '',
                    useYn: state.useYn
                };
                const response = await _getMessageList(params);
                state.messageList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };
        //리스트 상세
        const getMessageDetail = async () => {
            try {
                let params = state.msgCode;
                const response = await _getMessageDetail(params);
                state.formData = {
                    msgSn: response.data.data.msgSn,
                    msgCd: response.data.data.msgCd,
                    msgCts: response.data.data.msgCts,
                    fstRgtrId: response.data.data.fstRgtrId,
                    fstRgsDt: response.data.data.fstRgsDt,
                    lastUpdrId: response.data.data.lastUpdrId,
                    lastUpdrDt: response.data.data.lastUpdrDt,
                    useYn: response.data.data.useYn
                };
            } catch (error) {
                console.log(error);
            }
        };

        //리스트 수정
        const upDateMessage = async () => {
            try {
                let params = {
                    msgSn: state.formData.msgSn,
                    msgCd: state.formData.msgCd,
                    msgCts: state.formData.msgCts,
                    fstRgtrId: state.formData.fstRgtrId,
                    fstRgsDt: state.formData.fstRgsDt,
                    lastUpdrId: 'Master',
                    lastUpdrDt: new Date(),
                    useYn: state.formData.useYn
                };
                // 수정자 임시처리
                const response = await _upDateMessage(params);
                state.editmode = true;
                clearList(pager.current);
            } catch (error) {
                console.log(error);
            }
        };
        //리스트 등록
        const registMessage = async () => {
            try {
                let params = {
                    msgCd: state.formData.msgCd,
                    msgCts: state.formData.msgCts,
                    fstRgtrId: 'Master',
                    useYn: state.formData.useYn
                };
                // 수정자 임시처리
                const response = await _registMessage(params);
                clearList(1);
            } catch (error) {
                console.log(error);
            }
        };

        //미사용 여부 체크 등록
        const setUnused = async () => {
            try {
                let params = {
                    msgSn: state.unusedList,
                    lastUpdrId: '수정자'
                };
                // 수정자 임시처리
                const response = await _setUnused(params);
                clearList(1);
            } catch (error) {
                console.log(error);
            }
        };

        //미사용 버튼 
        const checkedUnused = () => {
            if (state.unusedList.length > 0) {
                setUnused();
            }
        };



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
            } else if (modalName === 'isDownShow') {
                //사유등록되지 않았을때
                // if (type === 'modalconfirm') {
                //     if (!(state.download.pass) || !(state.download.reason)) {
                //         let message = !(state.download.pass) ? '비밀번호가 등록되지 않았습니다. ' : '사유가 등록되지 않았습니다.';
                //         $Modal.simple({
                //             title: '사유가 등록되지 않았습니다.',
                //             message: message,
                //             buttonText: {
                //                 ok: '확인'
                //             }
                //         });
                //     } else {
                //         isDownShow.value = false;
                //         // 파일 다운로드 common.js에서 처리 
                //         fileDown(state.download);
                //     }
                // } else {
                //     isDownShow.value = false;
                // }
            } else {
                isShow.value = false;
                // isDownShow.value = false;

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
        //다운로드 사유 등록 
        const downConfirm = (type, con) => {
            console.log(type, con);
            if (type === 'pass') {
                state.download.pass = con;
            } else {
                state.download.reason = con;
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            // openModal,
            pager,
            state,
            isShow,
            _getMessageList,
            _getMessageDetail,
            _upDateMessage,
            _registMessage,
            _setUnused,
            initColum,
            onGridReady,
            onCellClicked,

            reloadList,
            onChangedPage,
            selectedOptions,
            modalControl,
            checkOptions,
            resetTable,
            downConfirm,
            openMessageModal,
            inabaledInput,
            getMessageList,
            getMessageDetail,
            upDateMessage,
            registMessage,
            setUnused,
            checkedUnused,
            onRowSelect,

            onChangeDownRol,
            exelParams,
            checkRegist,
            checkDel,
            menuInfo
        };
    }
};
</script>