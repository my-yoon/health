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
                                <th scope="row">공지구분<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <!-- // 타입미정 -->
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <span v-for="(item, index) in state.noticeTypeList" :key="index" class="radio">
                                                <input :id="'systemNoticeType' + index" v-model="formData.systemNoticeType"
                                                    :value="item.value" name="systemNoticeType" type="radio">
                                                <label :for="'systemNoticeType' + index">{{ item.label }}</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">공지대상<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <span v-for="(item, index) in state.exposeGroupList" :key="index" class="radio">
                                                <input :id="'exposeGroup' + index"
                                                    v-model="formData.systemNoticeExposeGroup" :value="item.value"
                                                    name="exposeGroup" type="radio">
                                                <label :for="'exposeGroup' + index">{{ item.label }}</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">노출화면<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <select v-model="formData.exposeScreen" class="custom-select">
                                                <option v-for="(item, index) in state.exposeScreenList" :key="index"
                                                    :value="item.value">
                                                    {{ item.label }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">공지제목<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <div class="guide-form flex-11">
                                                <input v-model="formData.systemNoticeTitle"
                                                    :class="validationForm.systemNoticeTitle?.class" class="form-control"
                                                    type="text">
                                                <span v-if="validationForm.systemNoticeTitle?.value"
                                                    class="input-guide error">
                                                    {{ validationForm.systemNoticeTitle?.message }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">공지내용<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="editor_container">
                                        <div class="guide-form flex-11">
                                            <ck-editor :editor="state.ckeditor"
                                                :model-value="formData.systemNoticeContent || ''" />
                                        </div>
                                    </div>
                                    <div>
                                        <span v-if="validationForm.systemNoticeContent?.value" class="input-guide error">{{
                                            validationForm.systemNoticeContent?.message
                                        }}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">노출설정<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group inline">
                                        <template v-for="(item, index) in state.exposeTypelist" :key="index">
                                            <div class="reg-item">
                                                <span class="radio">
                                                    <input :id="'exposeType' + index" v-model="formData.exposeType"
                                                        :value="item.value" name="exposeType" type="radio">
                                                    <label :for="'exposeType' + index">{{ item.label }}</label>
                                                </span>
                                            </div>
                                            <div v-if="item.value === '132002'" class="reg-item">
                                                <dateTimeSingle v-model="formData.exposeBeginDt"
                                                    :disabled="ableReservation"></dateTimeSingle>
                                                <span class="ui-coupler">~</span>
                                                <dateTimeSingle v-model="formData.exposeEndDt" :disabled="ableReservation">
                                                </dateTimeSingle>
                                            </div>
                                        </template>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">그만보기 설정</th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span v-for="(item, index) in state.stopViewYn" :key="index" class="radio">
                                                <input :id="'stopViewYn' + index" v-model="formData.stopViewYn"
                                                    :value="item.value" name="stopViewYn" type="radio">
                                                <label :for="'stopViewYn' + index">{{ item.label }}</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="btn-bottom-set flex justify-center">
            <template v-if="true">
                <button class="btn btn-sl nega" type="button" @click="returnToPage()">취소</button>
                <button class="btn btn-sl posi" type="button" @click="saveNotice()">저장</button>
            </template>
        </div>


    </section>
</template>
<script>
import { reactive, inject, onMounted, watch, ref, computed } from 'vue';
import { _getSystemNotice, _editSystemNotice, _registSystemNotice } from '@/api/customer.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc, initializeEditor } from '@/core/helper/common.js';
import { useRoute } from 'vue-router';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import codeList from '@/data/commcode/codeList.js';
import DateTimeSingle from '@/components/ui/DateTimeSingle.vue';
import { useStore } from 'vuex';

export default {
    components: {
        DateTimeSingle,
        DefaultModal,
        DateSerch,
        'ck-editor': CKEditor.component
    },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const {
            goToPage
            // fileDown,
            // tableResize,
            // openModal,
            // isPartnerShow,
            // isDownShow,
            // isImgShow,
            // isRequestShow
        } = useCommFunc();
        const validationForm = ref({});
        let editor;

        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const route = useRoute();
        const state = reactive({
            setDay: {
                from: new Date().getTime() - 3600 * 1000 * 24,
                to: new Date()
            },
            ckeditor: ClassicEditor,
            // editorconfig: EditorOptions.editorConfig,
            systemNoticeSn: '',
            // 공지 구분
            noticeTypeList: [],
            // 공지 대상
            exposeGroupList: [],
            exposeTypelist: [],
            stopViewYn: [
                { label: '사용', value: 'Y' },
                { label: '미사용', value: 'N' }
            ],
            exposeScreenList: [
                { label: '코드 미정', value: '0' }
            ],
            pageType: 'regist',
            updateAt: null,
            subTitle: '시스템 공지사항 등록',
            menuCode: menuInfo.value.menuCode,
            editorcontent: ''
        });

        const formData = ref({
            systemNoticeSn: null,  // 공지사항 순번
            systemNoticeType: null,  // 공지사항 구분
            systemNoticeExposeGroup: null,  // 노출그룹 코드
            systemNoticeTitle: null,  // 공지사항 제목
            systemNoticeContent: null,  // 내용
            exposeType: null,  // 노출설정 코드
            exposeBeginDt: null,  // 노출예약 시작일
            exposeEndDt: null,  // 노출예약 종료일
            exposeScreen: null,  // 노출화면
            stopViewYn: null,  // 그만보기 여부
            menuCode: state.menuCode
        });

        watch(formData.value, () => {
            // reset validationForm
            validationForm.value = {};
        });

        onMounted(async () => {
            //155000 공지 구분
            await codeList.getGroupCode(155000).then(result => {
                state.noticeTypeList.push(...result);
            });
            //152000 문의유형
            await codeList.getGroupCode(156000).then(result => {
                state.exposeGroupList.push(...result);
            });
            //152000 노출유형
            await codeList.getGroupCode(132000).then(result => {
                state.exposeTypelist.push(...result);
            });

            if (route.query.systemNoticeSn) {
                state.systemNoticeSn = route.query.systemNoticeSn;
                await getSystemNoticeDetail({ systemNoticeSn: state.systemNoticeSn, menuCode: state.menuCode });
                state.pageType = 'update';
                state.subTitle = '시스템 공지사항 수정';
            } else {
                state.subTitle = '시스템 공지사항 등록';
                // 등록 초기값 설정
                formData.value.systemNoticeType = state.noticeTypeList[0].value;
                formData.value.systemNoticeExposeGroup = state.exposeGroupList[0].value;
                formData.value.exposeScreen = state.exposeScreenList[0].value;
                formData.value.exposeType = state.exposeTypelist[0].value;
                formData.value.stopViewYn = state.stopViewYn[0].value;
            }

            //에디터 초기화
            editor = await initializeEditor();

            console.log('systemNoticeContent', formData.value, formData.value.systemNoticeContent);
            editor.setData(formData.value.systemNoticeContent || '');
            editor.model.document.on('change', () => {
                formData.value.systemNoticeContent = editor.getData();
            });
        });

        // 데이터 피커 날짜 검색
        // const onSelectPicker = (type, value, status) => {
        //     //선택된 기준
        //     if (type === 'self_end' || type === 'self_start') {
        //         // 직접 데이터 피커 설정
        //         if (type === 'self_start') {
        //             state.startday = value;
        //         } else if (type === 'self_end') {
        //             state.endday = value;
        //         }
        //     }
        // };

        // 상세조회
        const getSystemNoticeDetail = async (params) => {
            try {
                const response = await _getSystemNotice(params);
                formData.value = response.data.data;
                console.log(formData.value);
            } catch (error) {
                console.log(error);
            }
        };

        const formValidation = () => {
            if (!formData.value.systemNoticeType) {
                $Modal.alert('공지구분을 선택해주세요');
                return false;
            }

            if (!formData.value.systemNoticeExposeGroup) {
                $Modal.alert('공지대상을 선택해주세요');
                return false;
            }

            if (!formData.value.exposeScreen) {
                $Modal.alert('노출화면을 선택해주세요');
                return false;
            }

            if (!formData.value.systemNoticeTitle) {
                validationForm.value.systemNoticeTitle = { value: true, message: '공지제목을 입력해주세요', class: 'error' };
                return false;
            }

            if (!formData.value.systemNoticeContent) {
                console.log('11');
                validationForm.value.systemNoticeContent = { value: true, message: '공지내용을 입력해주세요', class: 'error' };
                return false;
            }

            if (!formData.value.exposeType) {
                $Modal.alert('노출설정을 선택해주세요');
                return false;
            }

            // 예약노출 일때 임시데이터 컴포넌트 확정시 변경필요
            if (formData.value.exposeType === 132002) {
                formData.value.exposeBeginDt = dayJS(state.setDay.from).format('YYYY-MM-DD') + ' 09:00'; // 시간 컴포넌트 추가시 맵핑
                formData.value.exposeEndDt = dayJS(state.setDay.to).format('YYYY-MM-DD') + ' 09:00';  // 시간 컴포넌트 추가시 맵핑
            }

            return true;
        };

        //버튼처리
        const saveNotice = () => {
            if (formValidation()) {
                if (state.pageType === 'update') {
                    $Modal.confirm({
                        title: '',
                        message: '저장하시겠습니까?',
                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    }).then(success => {
                        if (success === 'confirm') {
                            editSystemNotice();
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else if (state.pageType === 'regist') {
                    $Modal.confirm({
                        title: '',
                        message: '저장하시겠습니까?',
                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    }).then(success => {
                        if (success === 'confirm') {
                            registSystemNotice();
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }
            }
        };
        // 상세수정
        const editSystemNotice = async () => {
            try {
                await _editSystemNotice(formData.value).then(result => {
                    if (result.data.code === 'OK') {
                        $Modal.alert({ message: '수정 되었습니다.', buttonText: { ok: '확인' } }).then(() => {
                            returnToPage();
                        });
                    } else {
                        console.log(result.data);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };
        // 신규등록
        const registSystemNotice = async () => {
            try {
                await _registSystemNotice(formData.value).then(result => {
                    if (result.data.code === 'OK') {
                        $Modal.alert({ message: '저장 되었습니다.', buttonText: { ok: '확인' } }).then(() => {
                            returnToPage();
                        });
                    } else {
                        console.log(result.data);
                    }
                });

            } catch (error) {
                console.log(error);
            }
        };

        const ableReservation = computed(() => {
            return parseInt(formData.value.exposeType) !== 132002;
        });

        const returnToPage = () => {
            if (state.pageType === 'update') {
                goToPage('/cs_center/system_notice/detail?systemNoticeSn=' + formData.value.systemNoticeSn);
            }
            if (state.pageType === 'regist') {
                goToPage('/cs_center/system_notice/list');
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            // fileDown,
            // tableResize,
            // isDownShow,
            // isPartnerShow,
            // isImgShow,
            // isRequestShow,
            state,
            formData,
            ableReservation,
            validationForm,
            // openModal,
            // onSelectPicker,
            saveNotice,
            returnToPage
        };
    }
};
</script>
<style>
.ck-editor__editable_inline {
    min-height: 200px;
}
</style>