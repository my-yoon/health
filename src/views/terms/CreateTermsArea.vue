<template>
    <section class="temp-section">
        <div class="ui-grid-top-guide t-right">
            <span class="ess"></span> 표시는 필수항목입니다.
        </div>
        <div class="tbl-wrap mt-10">
            <table class="table reg">
                <colgroup>
                    <col style="width: 160px;">
                    <col style="width: auto;">
                    <col style="width: 160px;">
                    <col style="width: auto;">
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row">약관동의 영역</th>
                        <td colspan="3">
                            <div class="reg-group inline">
                                <div class="reg-item">
                                    <select class="custom-select sm" v-model="formData.clusAgrmDomnCd" :disabled="state.pageType !== 'regist'">
                                        <option value="">전체</option>
                                        <option v-for="(item, index) in state.clusAgrmDomnCd" :key="index"
                                            :value="item.value">
                                            {{ item.cmnCdNm }}
                                        </option>
                                    </select>
                                    <span v-if="checkValidState('clusTyCd')" class="input-guide"
                                        :class="{ 'error': checkValidState('clusTyCd') }">
                                        {{ state.validState.message }}
                                    </span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">서비스제공자</th>
                        <td>
                            <div class="reg-group inline">
                                <div class="reg-item">
                                    <input v-model="formData.clusMngOffrNtprSnNm" type="text" class="form-control" :disabled="state.pageType !== 'regist'">
                                </div>
                                <div class="reg-item">
                                    <button type="button" class="btn btn-slm" :disabled="state.pageType !== 'regist'"
                                        @click="modalOpen('isShowClusMngOffr')">찾기</button>
                                </div>
                                <div class="reg-item">
                                    <span v-if="checkValidState('clusMngOffrTyCd')" class="input-guide"
                                        :class="{ 'error': checkValidState('clusMngOffrTyCd') }">
                                        {{ state.validState.message }}
                                    </span>
                                </div>
                            </div>
                        </td>
                        <th scope="row">서비스대상자</th>
                        <td>
                            <div class="reg-group inline">
                                <div class="reg-item">
                                    <input type="text" class="form-control" :disabled="true" value="전체" />
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="ui-section">
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <subTitleBar :subTitle="'필수약관'" />
            <div class="ui-content">
                <div class="tbl-wrap mt-10">
                    <div class="table-util flex space-between">
                        <div class="btn-set-m flex">
                            <button type="button" class="btn btn-ss" @click="checkDel">삭제</button>
                            <button type="button" class="btn btn-ss" @click="checkRegist('isShowAddTerms', 'Y')">추가</button>
                            <button type="button" class="btn btn-ss"
                                @click="checkEdit('isShowSortTerms', 'Y')">순서관리</button>
                        </div>
                        <div class="btn-set-m flex">
                            <button type="button" class="btn btn-opt-ico fit"><span class="offscreen">컬럼리사이징</span></button>
                            <!-- 클래스 : full -->
                            <button type="button" class="btn btn-opt-ico filter"><span
                                    class="offscreen">컬럼셋팅</span></button> <!-- 클래스 : close -->
                        </div>
                    </div>

                    <NoData v-if="state.esnClusList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
                    <div v-else ref="agGrid">
                        <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                            :domLayout="state.domLayout" :rowData="state.esnClusList" @cell-clicked="onRowSelect"
                            :suppressRowClickSelection="true" @grid-ready="onGridReadyEsn" @selection-changed="onRowSelect"
                            :rowSelection="'multiple'" class="ag-theme-alpine" style="width:100%">
                        </AgGridVue>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'선택약관'" />
            <div class="ui-content">
                <div class="tbl-wrap mt-10">
                    <div class="table-util flex space-between">
                        <div class="btn-set-m flex">
                            <button type="button" class="btn btn-ss" @click="checkDel">삭제</button>
                            <button type="button" class="btn btn-ss" @click="checkRegist('isShowAddTerms', 'N')">추가</button>
                            <button type="button" class="btn btn-ss"
                                @click="checkEdit('isShowSortTerms', 'N')">순서관리</button>
                        </div>
                        <div class="btn-set-m flex">
                            <button type="button" class="btn btn-opt-ico fit"><span class="offscreen">컬럼리사이징</span></button>
                            <!-- 클래스 : full -->
                            <button type="button" class="btn btn-opt-ico filter"><span
                                    class="offscreen">컬럼셋팅</span></button> <!-- 클래스 : close -->
                        </div>
                    </div>

                    <NoData v-if="state.chcClusList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
                    <div v-else ref="agGrid">
                        <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                            :domLayout="state.domLayout" :rowData="state.chcClusList" @cell-clicked="onRowSelect"
                            :suppressRowClickSelection="true" @grid-ready="onGridReadyChc" @selection-changed="onRowSelect"
                            :rowSelection="'multiple'" class="ag-theme-alpine" style="width:100%">
                        </AgGridVue>
                    </div>
                </div>
            </div>
        </div>

        <div class="btn-bottom-set flex justify-center">
            <!-- 등록 pageType: regist -->
            <template v-if="state.pageType === 'regist'">
                <button type="button" class="btn btn-sl nega" @click="cancelCreate">취소</button>
                <button type="button" class="btn btn-sl posi" @click="createTermsArea">저장</button>
            </template>
            <!-- 상세 pageType: detail -->
            <template v-else>
                <button type="button" class="btn btn-sl nega" @click="goToPage('/policy/domain/list')">목록</button>
                <button type="button" class="btn btn-sl posi" @click="checkEdit('', '')">저장</button>
            </template>
        </div>

    </section>

    <DefaultModal :buttonCancel="'닫기'" :isShow="isShowClusMngOffr" :modalName="'isShowClusMngOffr'" modalTitle="서비스제공자"
        @modalclose="modalClose">
        <template #modalcontent>
            <!-- <SellerSerch :admnSn="state.admnSn"/> -->
            <ServiceProvideModal @selectPartner="selectPartner" />
        </template>
    </DefaultModal>
    <DefaultModal :buttonCancel="'취소'" :buttonConfirm="'등록'" :isShow="isShowClusMngTgp" :modalName="'isShowClusMngTgp'"
        modalTitle="서비스대상자" @modalclose="modalClose">
        <template #modalcontent>
            <!-- <SellerSerch :admnSn="state.admnSn"/> -->
            <div class="ui-title-3">
                <h3>서비스대상자</h3>
            </div>
        </template>
    </DefaultModal>
    <DefaultModal :buttonCancel="'취소'" :buttonConfirm="'등록'" :isShow="isShowAddTerms" :modalName="'isShowAddTerms'"
        modalTitle="약관추가" @modalclose="modalClose">
        <template #modalcontent>
            <!-- <SellerSerch :admnSn="state.admnSn"/> -->
            <AddTermsModal @selectTerms="selectTerms" :clusMngOffrTyCd="formData.clusMngOffrTyCd"
                :clusMngTgpTyCd="formData.clusMngTgpTyCd" :esnClusYn="formData.esnClusYn"
                :clusMngOffrNtprSn="formData.clusMngOffrNtprSn" />
        </template>
    </DefaultModal>
    <!-- 순서관리 -->
    <DefaultModal :buttonConfirm="'저장'" :buttonCancel="'취소'" :isShow="isShowSortTerms" :modalName="'isShowSortTerms'"
        modalTitle="'순서관리'" @modalclose="modalClose">
        <template #modalcontent>
            <div class="ui-title-3">
                <h3>순서관리</h3>
            </div>
            <div class="ui-dragdrop-menu">
                <draggable v-model="state.sortTerms" tag="ul" item-key="mncdsSn" class="ui-dragdrop-list">
                    <template v-slot:item="{ item }">
                        <!-- 커스텀 아이템 슬롯 -->
                        <li class="ui-dragdrop-item"> {{ item.clusNm }} </li>
                    </template>
                </draggable>
            </div>
        </template>
    </DefaultModal>
</template>
<script>
import { useRoute } from 'vue-router';
import { reactive, onMounted, onUnmounted, watch, inject, ref, computed } from 'vue';
import { _getTermsGroup, _createTermsArea, _updateTermsType, _getTermsAreaDetail } from '@/api/terms';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { commoCode } from '@/data/commcode';
import { useStore } from 'vuex';

import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import ServiceProvideModal from './components/ServiceProvideModal.vue';
import AddTermsModal from './components/AddTermsModal.vue';

export default {
    components: {
        DefaultModal,
        ServiceProvideModal,
        AddTermsModal
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const $Modal = inject('$Modal');
        const { goToPage } = useCommFunc();

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
        const { onChangeRegistRol, onChangeEditRol, onChangeDelRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        
        // const commRadio = ref(null);
        const initColum = ref([
            { headerName: '선택', field: 'select', maxWidth: 50, checkboxSelection: true, headerCheckboxSelection: true },
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '약관그룹', field: 'clusGrpNm', flex: 1 },
            { headerName: '약관유형', field: 'clusTyCdNm', flex: 1 },
            { headerName: '서비스제공자', field: 'clusMngOffrNtprSnNm', flex: 1 },
            { headerName: '서비스대상자', field: 'clusMngTgpNtprSnNm', flex: 1 },
            { headerName: '약관명', field: 'clusNm', flex: 1 },
            // { headerName: '필수여부', field: 'esnClusYnNm', flex: 1 },
            { headerName: '관리형태', field: 'clusMngShpCdNm', flex: 1 },
            { headerName: '배포일자', field: 'dstrbDt', flex: 1 },
            { headerName: '중요내용변경', field: 'impaCtsChgYn', flex: 1 },
            // { headerName: '소속별개별동의', field: 'iclusYn', flex: 1 },
            {
                headerName: '소속별개별동의',
                field: 'iclusYn',
                flex: 1,
                cellRenderer: (params) => {
                    // return params.data.iclusYn;
                    console.log(params.data.iclusYn);
                    const template = `<input type="checkbox" false-value="N" true-value="Y" value="${params.data.iclusYn}" ${params.data.iclusYn === 'Y' ? 'checked' : ''} id="event-${params.node.rowIndex}" />`;

                    const target = document.createElement('div');
                    target.innerHTML = template;
                    const eventTarget = target.querySelector(`#event-${params.node.rowIndex}`);
                    eventTarget.addEventListener('change', (e) => {
                        console.log(params.data.iclusYn, eventTarget.checked);
                        params.data.iclusYn = eventTarget.checked ? 'Y' : 'N';
                        state.editTerms.push(params.data);
                    });

                    return params.data.clusMngShpCd === '248002' ? target : params.data.iclusYn;
                }
            },
            { headerName: '상태', field: 'clusMngStCdNm', flex: 1 },
            { headerName: '개정일자', field: 'dstrbDt', flex: 1 },
            { headerName: '수정일시', field: 'lastUpdDt', flex: 1 }
        ]);

        const state = reactive({
            pagesize: 10,
            tableColum_c: _.clone(initColum.value),
            filterCoulm: [],
            // 테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            gridApiEsn: null,
            gridColumApi: null,
            gridApiChc: null,
            domLayout: 'autoHeight',

            clusAgrmDomnCd: commoCode.termsCode.clusAgrmDomnCd, // 약관동의영역코드

            esnClusList: [], // 필수약관
            esnClusListOrigin: [], // 필수약관 ( 추가 할때 원본 확인용 )
            esnCount: 0, // 수정-저장 되기전 list 조회시 원본 count (수정과정중 저장하지 않고 순서변경 할때 확인 목적)
            chcClusList: [], // 선택약관
            chcClusListOrigin: [], // 선택약관 ( 추가 할때 원본 확인용 )
            chcCount: 0,
            termsClusType: '', // 필수여부
            selectedEsnTerms: [], // 선택약관 (필수)
            selectedChcTerms: [], // 선택약관 (선택)
            selectedEsnTermsPrev: [], // 선택약관 (필수) // 등록되어있는 약관 체크
            selectedChcTermsPrev: [], // 선택약관 (선택) // 등록되어있는 약관 체크
            selectedDeleteTerms: [], // 약관삭제
            sortTerms: [], // 순서관리
            editTerms: [], // 수정약관

            validState: {
                type: '', // 약관그룹(termsGroup), 약관유형(termsTypeCd), 약관명(termsName)
                errState: false, // error state
                message: '' // input message
            },

            pageType: 'regist', // 등록(regist) | 상세 (detail)

            /**
             * @type { isShowClusMngOffr: 서비스제공자, isShowClusMngTgp: 서비스대상자, isShowAddTerms: 약관추가 }
             * @addType { 약관추가 필수여부 YN }
             * 수정/추가 ... 권한 체크 용도
             */
            openModal: {
                type: '',
                addType: ''
            }
        });

        const isShowClusMngOffr = ref(false); // 서비스제공자 modal
        const isShowClusMngTgp = ref(false); // 서비스대상자 modal
        const isShowAddTerms = ref(false); // 약관추가 modal
        const isShowSortTerms = ref(false); // 약관 순서관리 modal

        /**
         * @data
         */
        const formData = reactive({
            clusAgrmDomnCd: '', // 약관동의영역
            clusMngOffrTyCd: '', // 서비스제공자
            clusMngOffrNtprSnNm: '', // 서비스제공자Nm
            clusMngTgpTyCd: '250001' // 서비스대상자 (전체)

            // esnClusList: [], // 필수약관
            // chcClusList: [] // 선택약관
        });

        watch(formData, () => {
            resetState();
        });

        onMounted(() => {
            console.log('route.query', route.query);
            if (!_.isEmpty(route.query)) {
                console.log('query not empty ? detail page');
                state.pageType = 'detail';
                getTermsAreaDetail();

                // set formData
                formData.clusAgrmDomnCd = route.query.clusAgrmDomnCd;
                formData.clusMngOffrTyCd = route.query.clusMngOffrTyCd;
                formData.clusMngOffrNtprSnNm = route.query.clusMngOffrNtprSnNm;
                formData.clusMngTgpTyCd = route.query.clusMngTgpTyCd;
            }

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
        const checkRegist = async (type, addType) => {
            console.log(state.openModal);
            state.openModal = {
                type: type || '',
                addType: addType || ''
            };
            await onChangeRegistRol(menuInfo.value.auth1RegistYn);
        };

        /**
         * 등록 권한 체크 callback
         */
        const onChangeRegist = () => {
            modalOpen(state.openModal.type, state.openModal.addType);
            state.openModal = {
                type: '',
                addType: ''
            };
        };

        /**
         * 수정 권한 체크
         */
        const checkEdit = async (type, addType) => {
            state.openModal = {
                type: type || '',
                addType: addType || ''
            };
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            console.log('test', state.openModal.type);
            if (state.openModal.type === '') editTerms();
            else modalOpen(state.openModal.type, state.openModal.addType);

            // state.openModal = {
            //     type: '',
            //     addType: ''
            // };
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
            deleteTermsArea();
        };

        const onGridReadyEsn = (params) => {
            state.gridApiEsn = params.api;
            state.gridColumApi = params.columnApi;
        };
        const onGridReadyChc = (params) => {
            state.gridApiChc = params.api;
            state.gridColumApi = params.columnApi;
        };

        /**
         * @validation 상태 초기화
         */
        const resetState = () => {
            state.validState.type = ''; // validation
            state.validState.errState = false;
            state.validState.message = '';
        };

        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            console.log(value);
            state.filterCoulm = value;
        };
        // 컬럼 변경
        const resetTable = () => {
            const columlist = _.clone(initColum.value);
            state.tableColum_c = columlist.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        /**
         * 약관유형 상세 조회
         */
        const getTermsAreaDetail = async () => {
            try {
                const params = {
                    mncdsSn: route.query.mncdsSn
                };
                const response = await _getTermsAreaDetail(params);
                console.log('getTermsAreaDetail', response.data);

                state.esnClusList = response.data.data.esnClusList; // 필수약관
                state.esnClusListOrigin = response.data.data.esnClusList; // 필수약관
                state.esnCount = state.esnClusList.length;
                state.chcClusList = response.data.data.chcClusList; // 선택약관
                state.chcClusListOrigin = response.data.data.chcClusList; // 선택약관
                state.chcCount = state.chcClusList.length;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 취소
         */
        const cancelCreate = () => {
            $Modal.confirm({
                title: '',
                message: '작성한 내용이 있을 경우 저장되지 않습니다. 작성을 취소하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            }).then(success => {
                console.log(success);
                if (success === 'confirm') {
                    goToPage('/policy/domain/list');
                }
            }).catch(error => {
                console.log(error);
            });
        };

        /**
         * 등록
         */
        const createTermsArea = async () => {
            try {
                const params = setCreateParams();
                console.log('createTermsArea', params);
                console.log(params);
                if (params.length === 0) return;
                const response = await _createTermsArea(params);
                console.log(response);
                toast('저장 되었습니다.', 2000, 'success');
                setTimeout(() => {
                    goToPage('/policy/domain/list');
                }, 1000);
                // }
            } catch (error) {
                console.log(error);
            }
        };
        /**
         * 수정 iclusYn(소속별개별동의)
         */
        const editTerms = async () => {
            console.log('수정 >> 추가 등록 이후 수정 로직');
            const createItem = setCreateParams();
            if (createItem.length > 0) await createTermsArea();
            try {
                // console.log('editTerms', state.chcClusList);
                const params = setEditParams();
                if (params.length === 0) return;
                const response = await _createTermsArea(params);
                console.log(response);
                toast('저장 되었습니다.', 2000, 'success');
                getTermsAreaDetail();

                state.openModal = {
                    type: '',
                    addType: ''
                };
            } catch (error) {
                console.log(error);
            }
        };
        /**
         * 수정 (순서관리)
         */
        const sortedTerms = async () => {
            try {
                const params = setSortParams();
                // if (validFormData()) {
                //     console.log('수정');
                const response = await _createTermsArea(params);
                console.log(response);
                toast('저장되었습니다', 2000, 'success');
                getTermsAreaDetail();
                //     goToPage('/policy/type/list');
                // }
            } catch (error) {
                console.log(error);
            }
        };
        /**
         * 등록 params 생성
         */
        const setCreateParams = () => {
            console.log('setCreateParams');
            const esnCount = state.esnClusList.filter(item => item.chcClusSqn).length > 0 ? Math.max(...state.esnClusList.filter(item => item.esnClusSqn).map(m => m.esnClusSqn)) : 0; // 마지막 순번
            const chcCount = state.chcClusList.filter(item => item.chcClusSqn).length > 0 ? Math.max(...state.chcClusList.filter(item => item.chcClusSqn).map(m => m.chcClusSqn)) : 0; // 마지막 순번
            // 필수약관(추가)
            const esnClusIds = state.esnClusListOrigin.map(item => item.clusMngSn);
            state.selectedEsnTerms = state.selectedEsnTerms.filter(item => !esnClusIds.includes(item.clusMngSn)); // 중복제거 (원본확인)
            console.log('필수약관(추가) > 중복제거', state.selectedEsnTerms, state.esnClusList);
            const esnList = state.selectedEsnTerms.map((d, i) => {
                const item = {
                    mncdsSn: 0, // 0: create, num: edit
                    clusAgrmDomnCd: formData.clusAgrmDomnCd, // 약관동의영역코드
                    clusMngSn: d.clusMngSn, // 약관관리순번
                    seEsnChcCd: '253001', // 구분필수선택코드 (공통코드 : 253000)-253001:필수/253002:선택
                    esnClusSqn: esnCount + i + 1, // 필수약관순서
                    chcClusSqn: 0, // 선택약관순서
                    iclusYn: 'N', // 소속별개별여부 YN
                    mncdsClusDelYn: 'N', // 영역별약관삭제여부 YN
                    esnClusYn: 'Y' // 필수약관여부 Y:필수/N:선택
                };
                return item;
            });
            // 선택약관(추가)
            const chcClusIds = state.chcClusListOrigin.map(item => item.clusMngSn);
            state.selectedChcTerms = state.selectedChcTerms.filter(item => !chcClusIds.includes(item.clusMngSn)); // 중복제거 (원본확인)
            const chcList = state.selectedChcTerms.map((d, i) => {
                const item = {
                    mncdsSn: 0, // 0: create, num: edit
                    clusAgrmDomnCd: formData.clusAgrmDomnCd, // 약관동의영역코드
                    clusMngSn: d.clusMngSn, // 약관관리순번
                    seEsnChcCd: '253002', // 구분필수선택코드 (공통코드 : 253000)-253001:필수/253002:선택
                    esnClusSqn: 0, // 필수약관순서
                    chcClusSqn: chcCount + i + 1, // 선택약관순서
                    iclusYn: 'N', // 소속별개별여부 YN
                    mncdsClusDelYn: 'N', // 영역별약관삭제여부 YN
                    esnClusYn: 'N' // 필수약관여부 Y:필수/N:선택
                };
                return item;
            });
            console.log('object assign', [...esnList, ...chcList]);
            return [...esnList, ...chcList];
        };
        /**
         * 수정 params 생성
         */
        const setEditParams = () => {
            console.log('수정 params 생성', state.editTerms);
            state.editTerms = state.editTerms.filter((obj, index, self) => index === self.findIndex((el) => el.mncdsSn === obj.mncdsSn)); // 중복제거
            console.log('수정 params 생성 set', state.editTerms);
            const editItem = state.editTerms.map((d, i) => {
                const item = {
                    mncdsSn: d.mncdsSn, // 0: create, num: edit
                    iclusYn: d.iclusYn, // 소속별개별여부 YN
                    mncdsClusDelYn: 'N' // 영역별약관삭제여부 YN
                };
                return item;
            });
            return editItem;
        };
        /**
         * sort params 생성
         */
        const setSortParams = () => {
            console.log('setSortParams',
                state.esnCount,
                state.chcCount,
                state.sortTerms.length,
                state.openModal
            );

            if (state.openModal.type === 'isShowSortTerms' && state.openModal.addType === 'Y') {
                // 순서변경 (필수)
                if (state.esnCount !== state.sortTerms.length) {
                    toast('수정 내용을 저장해주세요.', 2000, 'error');
                    return;
                }
            } else if (state.openModal.type === 'isShowSortTerms' && state.openModal.addType === 'N') {
                // 순서변경 (선택)
                if (state.chcCount !== state.sortTerms.length) {
                    toast('수정 내용을 저장해주세요.', 2000, 'error');
                    return;
                }
            }
            const sortedItem = state.sortTerms.map((d, i) => {
                const item = {
                    mncdsSn: d.mncdsSn, // 0: create, num: edit
                    clusMngOffrTyCd: d.clusMngOffrTyCd, // 서비스제공자?
                    clusMngTgpTyCd: d.clusMngTgpTyCd, // 서비스대상자?
                    clusAgrmDomnCd: formData.clusAgrmDomnCd, // 약관동의영역코드
                    clusMngSn: d.clusMngSn, // 약관관리순번
                    seEsnChcCd: d.seEsnChcCd, // 구분필수선택코드 (공통코드 : 253000)-253001:필수/253002:선택
                    esnClusSqn: d.seEsnChcCd === '253001' ? i + 1 : '', // 필수약관순서
                    chcClusSqn: d.seEsnChcCd === '253002' ? i + 1 : '', // 선택약관순서
                    iclusYn: d.iclusYn, // 소속별개별여부 YN
                    mncdsClusDelYn: 'N' // 영역별약관삭제여부 YN
                };
                return item;
            });
            return sortedItem;
        };
        /**
         * 약관 삭제
         */
        const deleteTermsArea = async () => {
            try {

                const esnList = state.esnClusList.length > 0 ? state.gridApiEsn.getSelectedRows() : []; // 필수
                const chcList = state.chcClusList.length > 0 ? state.gridApiChc.getSelectedRows() : []; // 선택
                state.selectedDeleteTerms = [...esnList, ...chcList];
                if (state.selectedDeleteTerms.length === 0) {
                    toast('삭제 할 항목을 선택해주세요.', 2000, 'error');
                    return;
                }
                const params = state.selectedDeleteTerms.map((d, i) => {
                    const item = {
                        mncdsSn: d.mncdsSn, // 0: create, num: edit
                        mncdsClusDelYn: 'Y' // 영역별약관삭제여부 YN
                    };
                    return item;
                });
                const response = await _createTermsArea(params);
                console.log('deleteTermsArea', params, response);
                toast('삭제 되었습니다.', 2000, 'success');
                setTimeout(() => {
                    goToPage('/policy/domain/list');
                }, 1000);
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @validate
         */
        const validFormData = () => {
            const target = ['clusAgrmDomnCd', 'clusMngOffrTyCd', 'clusMngTgpTyCd'];
            for (const item of target) {
                state.validState.target = item;
                let msg = '';

                if (item === 'clusAgrmDomnCd') msg = '약관동의영역을 선택해주세요.';
                else if (item === 'clusMngOffrTyCd') msg = '서비스제공자를 선택해주세요.';
                else if (item === 'clusMngTgpTyCd') msg = '서비스대상자를 선택해주세요.';

                state.validState.message = msg;

                if (!formData[item]) {
                    state.validState.errState = true;
                    toast(state.validState.message, 1000, 'error');
                    break;
                }
            }

            return !state.validState.errState;
        };

        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        /**
         * 서비스제공자 선택
         */
        const selectPartner = (target) => {
            console.log('서비스제공자 선택', target);

            formData.clusMngOffrNtprSnNm = target.ntprNm;
            formData.clusMngOffrNtprSn = target.ntprSn;
            formData.clusMngOffrTyCd = target.clusMngOffrTyCd;

            isShowClusMngOffr.value = false;
        };

        /**
         * 약관추가 UI
         */
        const selectTerms = (targetList) => {
            if (formData.termsClusType === '253001') { // 필수약관
                const addArray = [...state.selectedEsnTermsPrev, ...targetList];
                state.selectedEsnTerms = addArray.filter((obj, index, self) => index === self.findIndex((el) => el.clusMngSn === obj.clusMngSn));
            } else { // 선택약관
                const addArray = [...state.selectedChcTermsPrev, ...targetList];
                state.selectedChcTerms = addArray.filter((obj, index, self) => index === self.findIndex((el) => el.clusMngSn === obj.clusMngSn));
            }
            console.log('약관추가', targetList, state.selectedEsnTerms);
        };

        /**
         * @modal
         * @type { isShowClusMngOffr: 서비스제공자, isShowClusMngTgp: 서비스대상자, isShowAddTerms: 약관추가 }
         * @addType { 약관추가 필수여부 YN }
         */
        const modalOpen = (type, addType) => {
            if (type === 'isShowClusMngOffr') isShowClusMngOffr.value = true;
            else if (type === 'isShowClusMngTgp') isShowClusMngTgp.value = true;
            else if (type === 'isShowAddTerms') {
                if (validFormData()) {
                    isShowAddTerms.value = true;
                    formData.termsClusType = (addType === 'Y') ? '253001' : '253002'; // 필수/선택 약관 추가
                    formData.esnClusYn = (addType === 'Y') ? 'Y' : 'N'; // 필수/선택 약관 추가
                }
            } else if (type === 'isShowSortTerms') {
                state.sortTerms = (addType === 'Y') ? state.esnClusList : state.chcClusList;
                console.log(state.chcClusList, state.esnClusList);
                isShowSortTerms.value = true;
            }
        };
        const modalClose = (type, name) => {
            console.log(type, name);
            isShowClusMngOffr.value = false;
            isShowClusMngTgp.value = false;
            isShowAddTerms.value = false;
            isShowSortTerms.value = false;

            if (type === 'modalconfirm') {
                if (name === 'isShowAddTerms') {
                    console.log('>>> modalconfirm', state.selectedTerms, state.selectedEsnTerms);
                    if (formData.termsClusType === '253001') { // 필수약관 (modalOpen 시 선택)
                        // state.esnClusList = [...state.esnClusList, ...state.selectedEsnTerms];
                        const addArray = [...state.esnClusList, ...state.selectedEsnTerms];
                        state.selectedEsnTermsPrev = state.selectedEsnTerms;
                        state.esnClusList = addArray.filter((obj, index, self) => index === self.findIndex((el) => el.clusMngSn === obj.clusMngSn));
                    } else { // 선택약관
                        // state.chcClusList = [...state.chcClusList, ...state.selectedChcTerms];
                        const addArray = [...state.chcClusList, ...state.selectedChcTerms];
                        state.selectedChcTermsPrev = state.selectedChcTerms;
                        state.chcClusList = addArray.filter((obj, index, self) => index === self.findIndex((el) => el.clusMngSn === obj.clusMngSn));
                    }
                    console.log('>> check state.esnClusList', formData.termsClusType, state.selectedEsnTerms, state.esnClusList);
                } else if (name === 'isShowSortTerms') {
                    console.log('순서변경', state.sortTerms);
                    sortedTerms(); // 순서변경(수정) api call
                }
            }

            state.openModal = {
                type: '',
                addType: ''
            };
        };

        /**
         * 약관선택 시
         * @onRowSelect
         */
        const onRowSelect = (e) => {
            // console.log('onRowSelect', e);
            const rowItem = e.data;
            if (rowItem) {
                goToPage(`/policy/register?clusMngSn=${e.data.clusMngSn}&clusMngStCd=${e.data.clusMngStCd}&detailTyCd=DL`);
            }
        };

        return {
            state,
            formData,
            goToPage,
            initColum,
            resetTable,
            onGridReadyEsn,
            onGridReadyChc,
            isShowClusMngOffr,
            isShowClusMngTgp,
            isShowAddTerms,
            isShowSortTerms,
            cancelCreate,
            createTermsArea,
            editTerms,
            checkValidState,
            checkOptions,

            selectPartner,
            selectTerms,
            deleteTermsArea,
            modalOpen,
            modalClose,
            onRowSelect,

            checkRegist,
            checkEdit,
            checkDel
        };
    }
};

</script>