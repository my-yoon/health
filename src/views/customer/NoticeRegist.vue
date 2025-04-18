<template>
    <section>
        <div class="ui-section">
            <subTitleBar :subTitle="state.subTitle" />
            <div class="ui-content">
                <div class="tbl-wrap">
                    <!-- 전체 {{ formData }}<br><br> -->
                    <!-- 수정 {{ formData.noticeSn }}
                    {{ formData.updater }}
                    {{ formData.title }}
                    {{ formData.content }}
                    {{ formData.noticeCategoryCd }}
                    {{ formData.reserveAt }}
                    {{ formData.fixed }}<br><br> -->
                    <!-- {{ state.pageType }}<br> -->
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr v-if="false">
                                <th scope="row">파트너사</th>
                                <td>{{ formData.corporationName }}</td>
                                <th scope="row">승인상태</th>
                                <td>{{ formData.aprrovalStatusNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">공지 구분<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <!-- {{ formData.noticeCategoryCd }} -->
                                            <!-- <commselect :selectType="'searchCode.noticeCategoryCdBC'"
                                                @changedValue="selectedOptions" :initData="formData.noticeCategoryCd"
                                                ref="noticeCategoryCd" /> -->
                                            <select v-model="formData.noticeCategoryCd" class="custom-select time">
                                                <option value="">선택</option>
                                                <option v-for="(option, index) in commoCode.searchCode.noticeCategoryCdBC"
                                                    :key="index" :value="option.value">
                                                    {{ option.cmnCdNm }}
                                                </option>
                                            </select>
                                        </div>
                                        <div v-if="checkValidState('noticeCategoryCd')">
                                            <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                                {{ state.validState.message }}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <template v-if="state.pageType !== 'regist'">
                                    <th scope="row">조회수</th>
                                    <td>{{ formData.viewsCnt }}</td>
                                </template>
                                <template v-else>
                                    <td></td>
                                    <td></td>
                                </template>


                            </tr>
                            <tr>
                                <th scope="row">공지제목<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control"
                                                :class="checkValidState('title') ? 'error' : ''" v-model="formData.title">
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('title')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">공지내용<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="editor_container">
                                        <ck-editor :editor="state.ckeditor" :model-value="formData.content" />
                                    </div>
                                    <div v-if="checkValidState('content')">
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
                                                    <input :id="'openRdo' + index" name="openRdoGroup" type="radio"
                                                        v-model="formData.exposeTypeCd" :value="item.value">
                                                    <label :for="'openRdo' + index">{{ item.label }}</label>
                                                </span>
                                            </div>
                                            <div class="reg-item" v-if="index === 1">
                                                <dateTimeSingle v-model="formData.reserveAt" :setDay="formData.reserveAt"
                                                    ref="dateTimeSingle1" :disabled="!(formData.exposeTypeCd === 132002)">
                                                </dateTimeSingle>
                                            </div>
                                        </template>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">고정 공지</th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="checkbox">
                                                <input id="fixedNotice" name="fixedNoticeGroup" type="checkbox"
                                                    v-model="state.fixed">
                                                <label for="fixedNotice">체크 시 상단에 글 고정</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <template v-if="!(state.pageType === 'regist')">
                                <tr>
                                    <th scope="row">등록자</th>
                                    <td>{{ formData.authorLv }}({{ formData.authorNm }})</td>
                                    <th scope="row">등록일시</th>
                                    <td>{{ formData.createAt }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">수정자</th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                {{ formData.updaterLv }}({{ formData.updaterNm }})

                                            </div>
                                        </div>
                                    </td>
                                    <th scope="row">수정일시</th>
                                    <td>
                                        <template v-if="formData.updateAt">
                                            {{ dayJS(formData.updateAt).format('YYYY-MM-DD HH:mm') }}
                                        </template>
                                    </td>
                                </tr>
                            </template>
                            <!-- 상세 승인 요청일 때  승인 처리 || 반려 -->
                            <!-- 승인 135001 승인요청 135002  반려 135003-->

                            <template v-if="!(state.pageType === 'regist') && !(formData.corporationSn === 1)">
                                <tr>
                                    <th scope="row">승인/반려</th>
                                    <td colspan="3">
                                        <div class="reg-group inline">
                                            <div class="reg-item">
                                                <template v-for="(item, index) in  state.aprrovalStatusCd" :key="index">
                                                    <span class="radio" v-if="!(index === 0)">
                                                        <input :id="'openRdo3' + index" name="openRdoGroup1" type="radio"
                                                            v-model="formData.aprrovalStatusCd" :value="item.value">
                                                        <label :for="'openRdo3' + index">{{ item.label }}</label>
                                                    </span>
                                                </template>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <!-- 사유선택 -->
                                <tr v-if="formData.aprrovalStatusCd === 135003">
                                    <th scope="row">사유 선택<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td colspan="3">
                                        <div class="reg-group inline">
                                            <div class="reg-item">
                                                <commselect :selectType="'searchCode.declineReasonCd'"
                                                    @changedValue="selectedOptions" :initData="formData.declineReasonCd"
                                                    ref="declineReasonCd" />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <template v-if="formData.aprrovalStatusCd === 135003">반려사유 입력</template>
                                        <template v-else>승인사유 입력</template>
                                        <span class="ess"><span class="offscreen">필수입력</span></span>
                                    </th>
                                    <td colspan="3">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <template v-if="formData.aprrovalStatusCd === 135003">
                                                    <textarea id="textarea" class="form-control"
                                                        v-model="formData.declineContent" placeholder="내용이 부족하여 반려 처리 합니다."
                                                        style="height: 100px"></textarea>
                                                </template>
                                                <template
                                                    v-if="formData.aprrovalStatusCd === 135002 || formData.aprrovalStatusCd === 135001">
                                                    <textarea id="textarea" class="form-control"
                                                        v-model="formData.aprrovalContent" placeholder="맞춤법 수정하여 승인 처리합니다."
                                                        style="height: 100px"></textarea>
                                                </template>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        <div class="btn-bottom-set flex justify-center">
            <!-- 반려 승인 상태 이면  corporationSn === 1 이면 파트너가 작성  135002 승인 135003반려-->
            <template v-if="!(formData.corporationSn === 1) && !(state.pageType === 'regist')">
                <button type="button" class="btn btn-sl posi" @click="saveNotice('approve')"
                    :disabled="!(formData.aprrovalStatusCd === 135002)">승인</button>
                <button type=" button" class="btn btn-sl posi" @click="saveNotice('decline')"
                    :disabled="!(formData.aprrovalStatusCd === 135003)"> 반려 </button>
                <button type="button" class="btn btn-sl nega" @click="goToPage('/cs_center/notice/list')">목록으로</button>
            </template>


            <template v-else>
                <button type="button" class="btn btn-sl nega" @click="goToPage('/cs_center/notice/list')">취소</button>
                <button type="button" class="btn btn-sl posi" @click="saveNotice(state.pageType)"
                    v-if="state.pageType === 'regist'">저장</button>
                <button type="button" class="btn btn-sl posi" @click="checkEdit" v-else>수정</button>
            </template>
        </div>


    </section>
</template>
<script>
import { reactive, inject, onMounted, onUnmounted, ref, computed, watch } from 'vue';
import { _getNoticeDetail, _editNotice, _registNotice, _ApproveNotice, _DeclineNotice } from '@/api/customer.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
// import DateSerch from '@/components/ui/DateSerch.vue';
import DateSingle from '@/components/ui/DateSingle.vue';
import dateTimeSingle from '@/components/ui/DateTimeSingle.vue';
import { useCommFunc, initializeEditor } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { commoCode } from '@/data/commcode';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
export default {
    components: {
        DefaultModal,
        DateSingle,
        dateTimeSingle,
        'ck-editor': CKEditor.component
    },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow, isRequestShow } = useCommFunc();

        const store = useStore();
        const { onChangeEditRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const route = useRoute();
        const dateSearch = ref(null);
        const noticeCategoryCd = ref(null);
        const dateTimeSingle1 = ref(null);
        const state = reactive({
            imgName: '',
            setDay: new Date(),
            ckeditor: ClassicEditor,
            editorCon: '',
            // editorconfig: EditorOptions.editorConfig,
            noticeSn: '',
            fixed: false,
            noticeStatus: [
                { label: '즉시노출', value: 132001 },
                { label: '예약노출', value: 132002 },
                { label: '비노출', value: 132003 }
            ],
            aprrovalStatusCd: [
                { label: '승인요청 ', value: 135001 },
                { label: '승인 ', value: 135002 },
                { label: '반려 ', value: 135003 }
            ],

            aprrovalStatusCdValue: null,

            pageType: 'regist',
            updateAt: null,
            subTitle: '공지사항 등록',

            validState: {
                type: '',
                errState: false,
                message: ''
            }
        });

        let editor;

        const formData = ref({
            noticeSn: '', // 공지사항 순번
            authorSn: '', //공지사항 등록자 순번
            authorNm: '', //공지사항 등록자 이름
            authorLv: '', //공지사항 등록자 레벨
            noticeTargetCd: '',
            noticeCategoryCd: '', //공지사항 구분 코드
            noticeCategoryNm: '', //공지사항 구분 이름
            title: '', //공지사항 제목
            content: '', //내용
            corporationSn: '', // 공지사항 등록 기업 순번 // 1이면 승인 반려
            corporationName: '', //공지사항 등록 기업 이름
            exposeTypeCd: '132001', //공지사항 등록 타입 코드 (즉시노출:132001, 예약노출:132002, 비노출:132003
            noticeTypeCdNm: '', //공지사항 등록 타입 이름(즉시노출 예약노출 비노출)
            approveAdminSn: '', //승인자
            aprrovalStatusNm: '', //공지사항 승인상태 이름(승인요청 승인 반려)
            aprrovalStatusCd: '',
            aprrovalContent: '', //승인사유
            declineAdminSn: '', //공지사항반려자
            declineReasonCd: '', //반려사유코드
            declineReasonNm: '', //반려사유이름
            declineContent: '', //반려사유내용
            viewsCnt: '', //조회수
            reserveAt: '', //예약일시
            updaterSn: '', //수정자순번
            updaterNm: '', //수정자 이름
            updaterLv: '', // 수정자레벨
            createAt: '', //등록일시
            updateAt: '', //수정일시
            fixed: '', // 고정공지여부
            showStatus: '' //노출상태,
        });
        watch(formData.value, () => {
            resetState();
        });
        onMounted(async () => {
            if (route.query.noticeSn) {
                state.noticeSn = route.query.noticeSn;
                await getNoticeDetail(state.noticeSn);
                state.pageType = 'detail';
                state.subTitle = '공지사항 수정';
            } else {
                state.subTitle = '공지사항 등록';
            }
            onchangeSingleDate();
            editor = await initializeEditor();

            editor.setData(formData.value.content);
            editor.model.document.on('change', () => {
                formData.value.content = editor.getData();
            });

            emitter.$on('onChangeEdit', onChangeEdit);
        });

        onUnmounted(() => {
            emitter.$off('onChangeEdit');
        });

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
            saveNotice(state.pageType);
        };

        const onchangeSingleDate = (type, value, status) => {
            console.log(type, value, status);
        };


        const resetState = () => {
            state.validState.errState = false; // validation
            state.validState.message = '';
        };
        // 상세조회
        const getNoticeDetail = async (params) => {
            try {
                const response = await _getNoticeDetail(params);
                formData.value = response.data.data;
                // noticeCategoryCd.value.state.selectOption = formData.value.noticeCategoryCd;
                state.fixed = formData.value.fixed === 'N' ? false : true;
            } catch (error) {
                console.log(error);
            }
        };


        const selectedOptions = (valueCode, valueName, type) => {
            console.log(type);
            if (type === 'rprsTlnoFno' || type === 'mailType2') {
                if (type === 'mailType2') {
                    state.mailType2 = valueName;
                } else {
                    formData[type] = valueName;
                }
            } else if (type === 'mailType1') {
                console.log();
            } else if (type === 'noticeCategoryCdBC') {
                formData.value.noticeCategoryCd = valueCode;
            } else {
                formData.value[type] = valueCode;
            }
            console.log(valueCode, valueName, type);
        };
        //버튼처리
        const saveNotice = (type) => {
            if (type === 'detail') {
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
                        editNotice();
                    })
                    .catch(error => {
                        console.log(error);
                    });
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
                            registNotice();

                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            } else if (type === 'approve') {
                ApproveNotice();
            } else if (type === 'decline') {
                DeclineNotice();
            }
        };
        // 상세수정
        const editNotice = async () => {
            try {
                console.log(state.fixed);
                // console.log('validate')
                let params = {
                    noticeSn: formData.value.noticeSn,
                    noticeCategoryCd: formData.value.noticeCategoryCd,
                    // noticeTargetCd: '134000', //2차 범위
                    title: formData.value.title,
                    content: formData.value.content,
                    exposeTypeCd: formData.value.exposeTypeCd,
                    reserveAt: formData.value.exposeTypeCd === 135001 ? dayJS(new Date()).format('YYYY-MM-DD HH:mm:ss') : formData.value.reserveAt,
                    fixed: state.fixed ? 'Y' : 'N'
                };
                if (validFormData()) {
                    console.log(params);
                    const response = await _editNotice(params);
                    console.log(response);
                    if (response.data.code === 'OK') {
                        toast('저장되었습니다', 2000, 'success');
                        // await getNoticeDetail(params.noticeSn);
                        setTimeout(() => {
                            goToPage('/cs_center/notice/list');
                        }, 1000);
                    }
                }

            } catch (error) {
                console.log(error);
            }
        };
        // 신규등록
        const registNotice = async () => {
            try {
                let params = {
                    noticeCategoryCd: Number(formData.value.noticeCategoryCd),
                    noticeTargetCd: '134000', //2차 범위
                    title: formData.value.title,
                    content: formData.value.content,
                    exposeTypeCd: Number(formData.value.exposeTypeCd),
                    reserveAt: formData.value.reserveAt,
                    fixed: state.fixed ? 'Y' : 'N'
                };
                if (validFormData()) {
                    const response = await _registNotice(params);
                    if (response.data.code === 'OK') {
                        goToPage('/cs_center/notice/list');
                    }
                    console.log(params);
                    console.log(response);
                }

            } catch (error) {
                console.log(error);
            }
        };

        const validFormData = () => {
            const target = [
                'noticeCategoryCd', //공지사항 구분 코드
                'title', // 공지사항 제목
                'content' //내용
            ];
            for (const item of target) {
                state.validState.target = item;
                let msg = '';

                if (item === 'noticeCategoryCd') msg = '공지 구분을 선택해주세요.';
                else if (item === 'title') msg = '공지사항 제목을 입력해주세요.';
                else if (item === 'content') msg = '내용을 입력해주세요.';

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

        // 승인
        const ApproveNotice = async () => {
            try {
                let params = {
                    noticeSn: formData.value.noticeSn,
                    approveAdminSn: formData.value.approveAdminSn,
                    aprrovalContent: state.reasontext
                };
                const response = await _ApproveNotice(params);

            } catch (error) {
                console.log(error);
            }
        };
        // 반려
        const DeclineNotice = async () => {
            try {
                let params = {
                    noticeSn: formData.value.noticeSn,
                    declineAdminSn: formData.value.declineAdminSn,
                    declineReasonCd: formData.value.declineReasonCd,
                    declineContent: state.reasontext
                };
                const response = await _DeclineNotice(params);

            } catch (error) {
                console.log(error);
            }
        };
        return {
            //공통 사용
            $Modal,
            dayJS,
            noticeCategoryCd,
            commoCode,
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
            saveNotice,
            selectedOptions,
            checkValidState,
            dateTimeSingle1,

            checkEdit
        };
    }
};
</script>