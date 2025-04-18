<template>
    <section>
        <div class="ui-section">
            <subTitleBar :subTitle="state.subTitle" />
            <div class="ui-content">
                <div class="tbl-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>

                            <tr>
                                <th scope="row">문의유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <commselect ref="faqcategory" :initData="formData.faqCategoryCode"
                                                :selectType="'searchCode.faqcategory'" @changedValue="selectedOptions" />
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('faqCategoryCode')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                                <template v-if="!(state.pageType === 'regist')">
                                    <th scope="row">조회수</th>
                                    <td>{{ formData.faqViewCnt }}</td>
                                </template>
                            </tr>
                            <tr>
                                <th scope="row">질문<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input v-model="formData.faqTitle" class="form-control" type="text">
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('faqTitle')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">답변내용<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="editor_container">
                                        <ck-editor :editor="state.ckeditor" :model-value="formData.faqContents" />
                                    </div>
                                    <div v-if="checkValidState('faqContents')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">노출여부</th>
                                <td colspan="3">
                                    <div class="reg-group inline">
                                        <template v-for="(item, index) in state.noticeStatus" :key="index">
                                            <div class="reg-item">
                                                <span class="radio">
                                                    <!-- v-model="formData.noticeTypeCd" -->
                                                    <input :id="'openRdo' + index" v-model="formData.faqIndicationTypeCode"
                                                        :value="item.value" name="openRdoGroup" type="radio">
                                                    <label :for="'openRdo' + index">{{ item.label }}</label>
                                                </span>
                                            </div>
                                        </template>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">TOP10등록</th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="checkbox">
                                                <input id="fixedNotice" v-model="state.faqTop10Yn" name="fixedNoticeGroup"
                                                    type="checkbox">
                                                <label for="fixedNotice">TOP10등록</label>
                                            </span>
                                        </div>
                                    </div>
                                    <span class="input-guide">TOP10의 노출순서는 TOP10관리 팝업에서 해주세요</span>
                                </td>
                            </tr>
                            <template v-if="!(state.pageType === 'regist')">
                                <tr>
                                    <th scope="row">등록자</th>
                                    <td>{{ formData.firstRegisterSn }}</td>
                                    <th scope="row">등록일시</th>
                                    <td>{{ formData.firstRegistDatetime }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">수정자</th>
                                    <td>누구??</td>
                                    <th scope="row">수정일시</th>
                                    <td>{{ formData.lastUpdateDatetime }}</td>
                                </tr>


                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <template v-if="!(state.pageType === 'regist')">
                <button class="btn btn-sl nega" type="button" @click="goToPage('/cs_center/faq/list')">취소</button>
                <button class="btn btn-sl posi" type="button" @click="checkEdit">수정</button>
            </template>
            <template v-else>
                <button class="btn btn-sl nega" type="button" @click="goToPage('/cs_center/faq/list')">취소</button>
                <button class="btn btn-sl posi" type="button" @click="checkRegist">저장</button>
            </template>

        </div>


    </section>
</template>
<script>
import { reactive, inject, onMounted, onUnmounted, ref, computed, watch, nextTick } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import dateTimeSingle from '@/components/ui/DateTimeSingle.vue';
import { useCommFunc, initializeEditor } from '@/core/helper/common.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { _registFaq, _getFaqDetail, _modifyFaqList, _getTop10List } from '@/api/customer.js';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: {
        DefaultModal,
        DateSerch,
        dateTimeSingle,
        'ck-editor': CKEditor.component
    },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow, isRequestShow } = useCommFunc();
        const store = useStore();
        const route = useRoute();
        let editor;

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
        const { onChangeRegistRol, onChangeEditRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);


        const state = reactive({
            imgName: '',
            setDay: new Date(),
            ckeditor: ClassicEditor,
            editorCon: '',
            // editorconfig: EditorOptions.editorConfig,
            noticeStatus: [
                { label: '노출', value: '132001' },
                { label: '비노출', value: '132003' }
            ],
            pageType: 'regist',
            subTitle: 'FAQ등록',
            faqSn: '',
            faqTop10Yn: false,

            faqtop10: [],
            checkTop10: false,

            validState: {
                type: '',
                errState: false,
                message: ''
            }
        });

        const formData = ref({
            faqSn: '',
            faqCategoryCode: '',
            faqTitle: '',
            faqContents: '',
            faqIndicationTypeCode: '132001',
            faqTop10Yn: '',
            faqViewCnt: '0',
            firstRegistDatetime: '',
            firstRegisterSn: '',
            lastUpdateDatetime: '',
            lastUpdateSn: 2,
            menuCode: computed(() => menuInfo.value.menuCode)
        });

        watch(formData.value, () => {
            resetState();
        });

        watch(() => state.faqTop10Yn, () => {
            // state.checkTop10 : state.faqTop10Yn 변경하면서 2번 호출되어 조건부 생성
            if (!state.checkTop10) checkTop10List();
        });

        onMounted(async () => {
            if (route.query.faqSn) {
                state.faqSn = route.query.faqSn;
                console.log(state.faqSn);
                await getFaqDetail(state.faqSn);
                state.pageType = 'detail';
                state.subTitle = 'FAQ 수정';

                console.log('formData mounted', formData.value.faqCategoryCode);
            } else {
                state.subTitle = 'FAQ 등록';
            }

            getTop10List();
            onchangeSingleDate();
            editor = await initializeEditor();

            editor.setData(formData.value.faqContents);
            editor.model.document.on('change', () => {
                formData.value.faqContents = editor.getData();
            });

            emitter.$on('onChangeRegist', onChangeRegist);
            emitter.$on('onChangeEdit', onChangeEdit);
        });

        /**
         * 마스킹 해제 이벤트 버스 해제
         */
        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            emitter.$off('onChangeEdit');
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
            actionBtns(state.pageType);
        };

        /**
         * 수정 권한 체크
         */
        const checkEdit = async () => {
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            actionBtns(state.pageType);
        };

        const resetState = () => {
            state.validState.errState = false; // validation
            state.validState.message = '';
        };

        const checkTop10List = () => {
            state.checkTop10 = true;
            if (state.faqtop10.length > 9) {
                console.log(state.faqTop10Yn);
                if (state.pageType === 'detail') {
                    const pageIndex = state.faqtop10.findIndex(d => String(d.faqSn) === state.faqSn);
                    if (pageIndex === -1) {
                        console.log(formData.value.faqTop10Yn);
                        if (formData.value.faqTop10Yn === 'N') {
                            toast('이미 TOP10 10건이 등록되었습니다.', 2000, 'error');
                            nextTick(() => {
                                state.faqTop10Yn = false;
                            });

                            setTimeout(() => {
                                state.checkTop10 = false;
                            }, 1000);
                        }
                    }
                } else {
                    toast('이미 TOP10 10건이 등록되었습니다.', 2000, 'error');
                    nextTick(() => {
                        state.faqTop10Yn = false;
                    });
                    setTimeout(() => {
                        state.checkTop10 = false;
                    }, 1000);
                }
            }
        };

        /**
         * faqTop10리스트 조회
         */
        const getTop10List = async () => {
            try {
                const response = await _getTop10List();
                state.faqtop10 = response.data.data.list;
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        };


        const onchangeSingleDate = (type, value, status) => {
            console.log(type, value, status);
        };


        const selectedOptions = (valueCode, valueName, type) => {
            console.log(type);
            if (type === 'faqcategory') {
                formData.value.faqCategoryCode = valueCode;
            } else {
                formData[type] = valueCode;
            }
            console.log(valueCode, valueName, type);
        };
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (modalName === 'isImgShow') {
                isImgShow.value = false;
            } else if (modalName === 'isRequestShow') {
                isRequestShow.value = false;
            } else if (!modalName) {
                isImgShow.value = false;
                isRequestShow.value = false;
            }
            console.log(type, modalName);
        };
        //사업자등록증 사본
        const imgfile = (fileName) => {
            state.imgName = fileName;
        };
        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            //선택된 기준
            if (type === 'day') {
                state.startday = value[0];
                state.endday = value[1];
            }
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status);
        };
        //버튼처리
        const actionBtns = (type) => {
            if (type === 'detail') {
                if (validFormData()) {
                    $Modal.confirm({
                        title: '',
                        message: '변경사항을 저장하시겠습니까?',

                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    })
                        .then(async (success) => {
                            console.log(success);
                            await modifyFaqList();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            } else if (type === 'regist') {
                if (validFormData()) {
                    $Modal.confirm({
                        title: '',
                        message: '등록하시겠습니까?',

                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    })
                        .then(async (success) => {
                            console.log(success);
                            await registQna();

                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            } else if (type === 'approve') {
                console.log('승인');
            } else if (type === 'decline') {
                console.log('반려');
            }
        };

        //faq등록
        const registQna = async () => {
            try {
                let params = {
                    faqCategoryCode: formData.value.faqCategoryCode,
                    faqTitle: formData.value.faqTitle,
                    faqContents: formData.value.faqContents,
                    faqIndicationTypeCode: formData.value.faqIndicationTypeCode,
                    faqTop10Yn: state.faqTop10Yn ? 'Y' : 'N',
                    faqViewCnt: formData.value.faqViewCnt,
                    menuCode: formData.value.menuCode
                };
                if (validFormData()) {
                    const response = await _registFaq(params);
                    if (response.data.code === 'OK') {
                        goToPage('/cs_center/faq/list');
                    }
                    console.log(response);
                }

            } catch (error) {
                console.log(error);
            }
        };

        //faq상세
        const getFaqDetail = async (params) => {
            try {
                const response = await _getFaqDetail(params);
                console.log(response);
                formData.value = response.data.data;
                response.data.data.faqTop10Yn === 'Y' ? state.faqTop10Yn = true : state.faqTop10Yn = false;
            } catch (error) {
                console.log(error);
            }
        };

        //faq수정
        const modifyFaqList = async () => {
            try {
                let params = {
                    faqSn: formData.value.faqSn,
                    faqCategoryCode: formData.value.faqCategoryCode,
                    faqTitle: formData.value.faqTitle,
                    faqContents: formData.value.faqContents,
                    faqIndicationTypeCode: formData.value.faqIndicationTypeCode,
                    faqTop10Yn: state.faqTop10Yn ? 'Y' : 'N',
                    lastUpdateSn: formData.value.lastUpdateSn === null ? 2 : formData.value.lastUpdateSn
                };
                console.log(params);
                const response = await _modifyFaqList(params);
                if (response.data.code === 'OK') {
                    getFaqDetail(state.faqSn);

                    toast('저장되었습니다', 2000, 'success');
                }
                console.log(response);

            } catch (error) {
                console.log(error);
            }
        };

        const validFormData = () => {
            const target = [
                'faqCategoryCode', // 문의 유형
                'faqTitle', // 제목
                'faqContents' // 내용
            ];
            for (const item of target) {
                state.validState.target = item;
                let msg = '';

                if (item === 'faqCategoryCode') msg = '문의 유형을 선택해주세요.';
                else if (item === 'faqTitle') msg = '질문을 입력해주세요.';
                else if (item === 'faqContents') msg = '내용을 입력해주세요.';

                state.validState.message = msg;

                if (!formData.value[item] || formData.value[item] === '0') {
                    state.validState.errState = true;
                    // toast(state.validState.message, 1000, 'error');
                    break;
                }
            }

            return !state.validState.errState;
        };

        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            fileDown,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            isRequestShow,
            state,
            formData,
            openModal,
            modalControl,
            onSelectPicker,
            selectedOptions,
            imgfile,
            actionBtns,
            checkValidState,

            checkRegist,
            checkEdit

        };
    }
};
</script>