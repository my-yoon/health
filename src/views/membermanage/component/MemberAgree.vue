<template>
    <section>
        <!-- 검색 -->
        <subTitleBar :subTitle="'오케어 서비스 동의 내역'" />
        <div class="tbl-wrap mt-20">
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.memberAgreeList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.memberAgreeList"
                    :defaultColDef="state.defaultColDef" class="ag-theme-alpine" :domLayout="state.domLayout"
                    style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>

        </div>

        <!-- 개인정보 사유 -->
        <DefaultModal :buttonCancel="''" :buttonConfirm="state.modalMode === 'list' ? '닫기' : '저장'" :isShow="infoChangeShow"
            :modalName="'infoChangeShow'" modalTitle="개인정보 변경 사유" @modalclose="modalControl">
            <template #modalcontent>
                <div>

                    <NoData v-if="state.modalMode === 'list' && !(state.infoHistory)" :nodatatext="'조회된 데이터가 없습니다.'">
                    </NoData>
                    <div v-else>
                        <div class="ui-grid-top-guide mt-16">
                            <p>회원 개인정보 변경이 발생할 경우 변경 요청자 정보와 사유, 녹취 파일명을 등록해주세요.</p>
                        </div>
                        <div class="ui-grid-top-guide mt-10 t-right">
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
                                        <th scope="row">요청자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                        <td>
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <input v-model="formData.rqstp"
                                                        :class="checkValidState('rqstp') ? 'error' : ''"
                                                        class="form-control" type="text">
                                                </div>
                                            </div>
                                            <div v-if="checkValidState('rqstp')">
                                                <p :class="{ 'error': checkValidState('rqstp') }" class="input-guide">
                                                    {{ state.validState.message }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">요청자 소속</th>
                                        <td>
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <input v-model="formData.rqstpBln" class="form-control" type="text">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">요청 사유<span class="ess"><span class="offscreen">필수입력</span></span>
                                        </th>
                                        <td>
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <textarea id="textarea" v-model="formData.rqstRsn"
                                                        :class="checkValidState('rqstRsn') ? 'error' : ''"
                                                        class="form-control" placeholder="개인정보 변경이 발생한 사유를 입력해주세요."
                                                        style="height: 100px"></textarea>
                                                </div>
                                            </div>
                                            <div v-if="checkValidState('rqstRsn')">
                                                <p :class="{ 'error': state.validState.errState }" class="input-guide">
                                                    {{ state.validState.message }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">녹취 파일명<span class="ess"><span class="offscreen">필수입력</span></span>
                                        </th>
                                        <td>
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <input v-model="formData.recFnm" class="form-control" type="text">
                                                </div>
                                            </div>
                                            <div v-if="checkValidState('recFnm')">
                                                <p :class="{ 'error': state.validState.errState }" class="input-guide">
                                                    {{ state.validState.message }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
        </DefaultModal>
    </section>
</template>
<script>
import { computed, reactive, inject, onMounted, watch, ref } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { _getMemberClause, _setMemberClauseCancel } from '@/api/memberinfo.js';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();

        const infoChangeShow = ref(false);
        // const isAgreeCancelShow = ref(null);
        const initColum = ref([
            {
                headerName: '약관명',
                field: 'clusAgrmDomnCdNm',
                valueGetter: (params) => {
                    return `${params.data.clusAgrmDomnCdNm} - ${params.data.clusNm}`;
                }
            },
            {
                headerName: '필수여부',
                field: 'seEsnChcCd',
                maxWidth: 130,
                valueGetter: (params) => {
                    if (params.data.seEsnChcCd === '253001') {
                        return '필수';
                    } else if (params.data.seEsnChcCd === '253002') {
                        return '선택';
                    }
                }
            },
            {
                headerName: '동의상태',
                field: 'clusAgrmSeCdYn',
                maxWidth: 130,
                // valueGetter: (params) => {
                //     if (params.data.clusAgrmSeCdYn === 'Y') {
                //         return '동의';
                //     } else if (params.data.clusAgrmSeCdYn === 'N') {
                //         return '미동의';
                //     }
                // }
                cellRenderer: (params) => {
                    /**
                     * @checkCase 동의 상태 이면서, 선택 약관인 경우
                     * params.data.clusAgrmSeCdYn === 'Y' // 동의 상태
                     * params.data.seEsnChcCd === '253002' // 선택 약관
                     */
                    const checkCase = params.data.clusAgrmSeCdYn === 'Y' && params.data.seEsnChcCd === '253002';
                    const tagString = checkCase ? `<a id="mdselect-${params.node.rowIndex}">동의</a>` : params.data.clusAgrmSeCdYn === 'Y' ? '동의' : '미동의';
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#mdselect-${params.node.rowIndex}`);
                    if (checkCase) {
                        buttonEventTarget.addEventListener('click', () => {
                            console.log(params.data);
                            // state.selectedClusMngSn = params.data.clusMngSn, // 약관관리순번(약관관리.약관관리순번)
                            // infoChangeShow.value = true; // open popup

                            const _params = {
                                clusMngSn: params.data.clusMngSn, // 약관관리순번(약관관리.약관관리순번)
                                mbrSn: formData.mbrSn, // 회원순번 (회원.회원순번)
                                clusAgrmSeCd: '252003', // 약관동의구분코드 (공통코드 : 252000) 252002:약관동의/252003:약관동의 철회

                                rqstp: '',
                                rqstpBln: '',
                                rqstRsn: '',
                                recFnm: ''
                            };
                            // setMemberClauseCancel(_params);
                            $Modal.confirm({
                                message: `${params.data.clusAgrmDomnCdNm} - ${params.data.clusNm} 동의를 철회 하시겠습니까?`,
                                className: 'confirm',
                                closeButtonHide: true,
                                buttonText: {
                                    cancel: '취소',
                                    confirm: '확인'
                                }
                            })
                                .then(async (success) => {
                                    console.log(success);
                                    // clearList(pager.current);
                                    const _params = {
                                        clusMngSn: params.data.clusMngSn, // 약관관리순번(약관관리.약관관리순번)
                                        mbrSn: formData.mbrSn, // 회원순번 (회원.회원순번)
                                        clusAgrmSeCd: '252003', // 약관동의구분코드 (공통코드 : 252000) 252002:약관동의/252003:약관동의 철회

                                        rqstp: '',
                                        rqstpBln: '',
                                        rqstRsn: '',
                                        recFnm: ''
                                    };
                                    setMemberClauseCancel(_params);
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        });
                    }
                    return buttonTarget;
                }
            },
            { headerName: '동의일자', field: 'clusAgrmDt', maxWidth: 150 },
            { headerName: '철회일자', field: 'clusAgrmWtdrDt', maxWidth: 150 }
        ]);

        const state = reactive({
            //테이블데이터
            tableColum_c: _.clone(initColum),
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
            domLayout: 'autoHeight',
            openMore: false,
            mskgnRlsYn: false,
            memberAgreeList: [],
            mbrSn: '',
            pagesize: 10,

            selectedClusMngSn: '', // 약관관리순번(약관관리.약관관리순번)
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            }
        });

        const formData = reactive({
            mbrSn: computed(() => state.mbrSn),

            rqstp: '', // 요청자
            rqstpBln: '', // 요청자소속
            rqstRsn: '', // 요청사유
            recFnm: '' // 레코드파일명
        });

        const resetState = () => {
            state.isCheckTermsName = false; // 중복확인
            state.validState.errState = false; // validation
            state.validState.message = '';
        };

        watch(formData, () => {
            resetState();
        });

        onMounted(() => {
            if (route.query.mbrSn) {
                state.mbrSn = route.query.mbrSn;
            }
            getMemberClause();

        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        //리스트 조회
        const getMemberClause = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    mbrSn: formData.mbrSn
                };
                const response = await _getMemberClause(params);
                console.log(response.data);
                state.memberAgreeList = response.data.data.kbhcList;
                pager.totalCnt = response.data.data.kbhcListTotalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        const onChangedPage = (pagenum) => {
            //console.log(pagenum);
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            // initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getMemberClause();
        };



        /**
         * 약관동의 철회
         */
        const setMemberClauseCancel = async (params) => {
            try {
                await _setMemberClauseCancel(params);

                // 재조회
                clearList(pager.current);
            } catch (error) {
                console.log(error);
            }
        };

        const clearList = (num) => {
            onChangedPage(num);
        };

        const validCheck = (type) => {
            console.log(type);
            let target = [];
            if (type === 'infoChangeShow') {
                target = ['rqstp', 'rqstRsn', 'recFnm'];
            }

            for (const item of target) {
                state.validState.target = item;
                state.validState.message = (item === 'rqstp') ? '요청자를 입력해주세요' : (item === 'rqstRsn') ? '요청자사유를 입력해 주세요' : '녹취파일명을 입력해 주세요';

                if (!formData[item]) {
                    state.validState.errState = true;
                    break;
                }
            }
            return !state.validState.errState;
        };
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        // 모달창 닫기
        const modalControl = async (type, modalName) => {
            console.log(type, modalName);
            if (modalName === 'infoChangeShow') { // 개인정보 변경 사유
                if (type === 'modalclose') {
                    infoChangeShow.value = false;
                    state.selectedClusMngSn = '';
                } else {
                    if (validCheck('infoChangeShow')) {

                        const _params = {
                            clusMngSn: state.selectedClusMngSn, // 약관관리순번(약관관리.약관관리순번)
                            mbrSn: formData.mbrSn, // 회원순번 (회원.회원순번)
                            clusAgrmSeCd: '252003', // 약관동의구분코드 (공통코드 : 252000) 252002:약관동의/252003:약관동의 철회

                            rqstp: formData.rqstp,
                            rqstpBln: formData.rqstpBln,
                            rqstRsn: formData.rqstRsn,
                            recFnm: formData.recFnm
                        };
                        setMemberClauseCancel(_params);

                        infoChangeShow.value = false;
                        state.selectedClusMngSn = '';

                        toast('약관동의가 철회되었습니다.', 2000, 'success');
                    }

                }

            } else if (!modalName) {
                infoChangeShow.value = false;
                state.selectedClusMngSn = '';
            }
        };


        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            infoChangeShow,
            fileDown,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            openModal,
            pager,
            state,
            formData,
            initColum,
            onChangedPage,
            // isAgreeCancelShow
            modalControl,
            checkValidState

        };
    }
};

</script>