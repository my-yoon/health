<template>
    <section>
        <div class="ui-section">
            <subTitleBar ess="표시는 필수항목입니다" subTitle="문의 일시/상태" />
            <div class="ui-content">
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
                                <th scope="row">문의 일자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <dateTimeSingle v-model="formData.inquiryDatetime" :setDay="new Date()">
                                            </dateTimeSingle>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">답변 상태</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <radioList v-model="formData.adminAnswerStatusCode"
                                                :list="state.adminAnswerStatusList" name="adminAnswerStatus"></radioList>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">문의 유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <subSelectBox v-model="formData.questionTypeCode" :list="state.questionTypeList"
                                                class="custom-select" />
                                        </div>
                                        <div v-if="formData.questionTypeCode === '152010' && false" class="reg-item">
                                            <subSelectBox v-model="formData.questionTypeCode2"
                                                :list="state.questionTypeList2" class="custom-select" />
                                            2차 오픈
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="state.editYn">
                                <th scope="row">응대 현황<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <subSelectBox v-model="formData.respondStatusCode"
                                                :list="state.responseStatusList" class="custom-select" />
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">해결 상태</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio">
                                                <input id="solveStatusYn1" v-model="formData.solveStatusYn"
                                                    name="solveStatusYn" type="radio" value="N">
                                                <label for="solveStatusYn1">미해결</label>
                                            </span>
                                            <span class="radio">
                                                <input id="solveStatusYn2" v-model="formData.solveStatusYn"
                                                    name="solveStatusYn" type="radio" value="Y">
                                                <label for="solveStatusYn2">해결</label>
                                            </span>
                                        </div>
                                    </div>
                                    <span class="input-guide">근본적으로 해결되지 않은 시스템 또는 서비스 문제인 경우 '미해결'상태로 체크합니다.</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar ess="표시는 필수항목입니다" subTitle="문의자 정보">
                <template #btn>
                    <button v-if="formData.wireMbrSn" class="btn btn-sm" style="margin-right: 150px" type="button">
                        <span class="txt">회원 상세 정보</span>
                    </button>
                </template>
            </subTitleBar>
            <div class="ui-content">
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
                                <th scope="row">문의자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="guide-form flex-11">
                                        <div class="reg-group inline">
                                            <div class="reg-item">
                                                <!-- @input="validationForm.wireInquireManName.value = false" 오류 수정 값 없음-->
                                                <input v-model="formData.wireInquireManName"
                                                    :class="validationForm.wireInquireManName?.value"
                                                    :readonly="!state.isDirectUser" class="form-control"
                                                    name="wireInquireManName" type="text"
                                                    maxlength="10"
                                                    @input="validationForm.wireInquireManName = false" />
                                            </div>
                                            <div class="reg-item">
                                                <button class="btn btn-slm" type="button" @click="isUserSearch = true">조회
                                                </button>
                                            </div>
                                            <div class="reg-item">
                                                <button class="btn btn-slm" type="button" @click="directUser">직접입력</button>
                                            </div>
                                        </div>
                                        <span v-if="validationForm.wireInquireManName?.value" class="input-guide error">{{
                                            validationForm.wireInquireManName?.message
                                        }}</span>
                                    </div>
                                </td>
                                <th scope="row">기업명</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            2차 오픈
                                            <!--
                                    <input class="form-control" type="text">
                                    -->
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">휴대폰번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="guide-form flex-11">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input :value="formData.hhpnoFrontno" :readonly="!state.isDirectUser"
                                                    class="form-control" data-target="hhpnoFrontno" maxlength="3" type="text" @input="setInputNumber">
                                            </div>
                                            <span class="ui-coupler">-</span>
                                            <div class="reg-item">
                                                <input :value="formData.hhpnoMiddleno" :readonly="!state.isDirectUser"
                                                    class="form-control" data-target="hhpnoMiddleno" maxlength="4" type="text" @input="setInputNumber">
                                            </div>
                                            <span class="ui-coupler">-</span>
                                            <div class="reg-item">
                                                <input :value="formData.hhpnoBackno" :readonly="!state.isDirectUser"
                                                    class="form-control" data-target="hhpnoBackno" maxlength="4" type="text" @input="setInputNumber">
                                            </div>
                                        </div>
                                        <span v-if="validationForm.hhpno?.value" class="input-guide error">{{
                                            validationForm.hhpno?.message
                                        }}</span>
                                    </div>
                                </td>
                                <th scope="row">이메일주소</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input v-model="state.admnEmad1" :readonly="!state.isDirectUser"
                                                class="form-control" type="text">
                                        </div>
                                        <span class="ui-coupler">@</span>
                                        <div class="reg-item">
                                            <commselect :disabled="!state.isDirectUser" :initData="state.admnEmad2Code"
                                                selectType="searchCode.mailType2" @changedValue="selectedOptions" />
                                        </div>
                                    </div>
                                    <div>
                                        <span v-if="validationForm.wireInquirEmail?.value" class="input-guide error">{{
                                            validationForm.wireInquirEmail?.message
                                        }}</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar ess="표시는 필수항목입니다" subTitle="문의 입력" />
            <div class="ui-content">
                <div class="tbl-wrap mt-10">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">제목<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <div class="guide-form flex-11">
                                                <input v-model="formData.questionTitle"
                                                    :class="validationForm.questionTitle?.class" class="form-control"
                                                    type="text" @input="validationForm.questionTitle = null">
                                                <span v-if="validationForm.questionTitle?.value"
                                                    class="input-guide error">{{
                                                        validationForm.questionTitle?.message
                                                    }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">문의 내용<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="guide-form flex-11">
                                            <textarea id="textarea" v-model="formData.questionContents"
                                                :class="validationForm.questionContents?.class" class="form-control"
                                                placeholder="답변 내용을 입력하세요." style="height: 100px"
                                                @input="validationForm.questionContents = null"></textarea>
                                            <span v-if="validationForm.questionContents?.value" class="input-guide error">{{
                                                validationForm.questionContents?.message
                                            }}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar ess="표시는 필수항목입니다" subTitle="답변 입력" />
            <div class="ui-content">
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
                                <th scope="row">답변자</th>
                                <td>
                                    <template v-if="formData.answerChargePersonName">
                                        {{
                                            formData.answerChargePersonAdminLv + "(" + formData.answerChargePersonName + ")"
                                        }}
                                    </template>
                                </td>
                                <th scope="row">답변일시</th>
                                <td>{{ formData.answerRegisterDatetime }}</td>
                            </tr>
                            <tr>
                                <th scope="row">답변 내용<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="guide-form flex-11">
                                            <textarea id="textarea" v-model="formData.answerContents"
                                                :class="validationForm.answerContents?.class" class="form-control"
                                                placeholder="답변 내용을 입력하세요." style="height: 100px"
                                                @input="validationForm.answerContents = null"></textarea>
                                            <span v-if="validationForm.answerContents?.value" class="input-guide error">{{
                                                validationForm.answerContents?.message
                                            }}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">악성클레임 여부</th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="checkbox">
                                                <input id="blackCus" v-model="formData.badClaimYn" false-value="N"
                                                    name="blackCusGroup" true-value="Y" type="checkbox">
                                                <label for="blackCus">악성클레임</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">수정자</th>
                                <td>
                                    <template v-if="formData.answerUpdatePersonName">
                                        {{
                                            formData.answerUpdatePersonAdminLv + "(" + formData.answerUpdatePersonName + ")"
                                        }}
                                    </template>
                                </td>
                                <th scope="row">수정일시</th>
                                <td>{{ formData.answerUpdateDatetime }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button class="btn btn-sl nega" type="button" @click="goToPage('/cs_center/qna/list')">목록</button>
            <!-- <button v-if="state.editYn" class="btn btn-sl posi" type="button" @click="changeMskgnRlsYn">마스킹해제</button> -->
            <button :disabled="!state.mskgnRlsYn" class="btn btn-sl nega" type="button" @click="changeMskgnRlsYn">
                마스킹해제
            </button>
            <button class="btn btn-sl posi" type="button" @click="checkEdit">저장</button>
        </div>
    </section>

    <!-- 문의자 조회 -->
    <DefaultModal :isShow="isUserSearch" buttonCancel="닫기" className="full" modalName="userSearch" modalTitle="문의자 조회"
        @modalclose="modalControl">
        <template #modalcontent>
            <UserSearch @selectUser="selectUser" />
        </template>
    </DefaultModal>
</template>
<script>
import { reactive, inject, onMounted, onUnmounted, watch, ref, computed } from 'vue';
import { _editQnaWire, _getQnaWireDetail, _registQnaWire } from '@/api/customer.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useRoute } from 'vue-router';
import codeList from '@/data/commcode/codeList.js';
import SubSelectBox from '@/views/customer/components/SelectBox.vue';
import dateTimeSingle from '@/components/ui/DateTimeSingle.vue';
import RadioList from '@/views/customer/components/RadioList.vue';
import SendTargetSearch from '@/components/ui/SendTargetSearch.vue';
import UserSearch from '@/views/customer/components/UserSearch.vue';
import { split } from 'lodash/string';
import { useStore } from 'vuex';

export default {
    components: {
        UserSearch,
        SendTargetSearch,
        RadioList,
        DefaultModal,
        SubSelectBox,
        dateTimeSingle
    },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const {
            goToPage,
            openModal
        } = useCommFunc();
        const { onChangeEditRol, onChangeMaskingRol } = authCommFunc();
        const route = useRoute();

        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const isUserSearch = ref(false);

        const state = reactive({
            wireInqSn: '',
            editYn: false, // 수정여부
            responseStatusList: [], //응답유형
            questionTypeList: [], //문의유형
            questionTypeList2: [], //문의유형2
            adminAnswerStatusList: [], //답변상태
            mskgnRlsYn: true, //마스킹해제여부
            admnEmad1: null,
            admnEmad2: null,
            admnEmad2Code: 103014,
            isUserSearch: false,
            userInfo: null,
            isDirectUser: false, // 직적입력 회원여부
            menuCode: menuInfo.value.menuCode
        });
        const validationForm = ref({});

        //각종 설정
        const init = () => {
            //수정
            if (state.editYn) {
                //이메일
                state.admnEmad1 = formData.value.wireInquireManEmail;

            } else {
                formData.value.adminAnswerStatusCode = state.adminAnswerStatusList[0].value; //답변상태
                formData.value.questionTypeCode = state.questionTypeList[0].value; //문의유형1
                formData.value.questionTypeCode2 = state.questionTypeList2[0].value; //문의유형2
            }
        };

        const dateTimeFormat = (dateTime, format) => {
            return dateTime ? dayJS(dateTime).format(format ?? 'YYYY-MM-DD HH:mm') : null;
        };

        const formData = ref({
            wireInqSn: null,
            inquiryDatetime: null,
            adminAnswerStatusCode: null, // 관리자답변상태코드
            adminAnswerStatusName: null, // 관리자답변상태명
            questionTypeCode: null, // 질문유형코드
            questionTypeName: null, // 질문유형명
            respondStatusCode: null, // 대응현황코드
            respondStatusName: null, // 대응현황명
            solveStatusYn: 'N', // 해결여부
            wireInqMbrSn: null, // 문의자 순번
            wireInquireManName: null, //문의자명
            hhpnoFrontno: '010', //휴대폰번호앞
            hhpnoMiddleno: null, //휴대폰번호중
            hhpnoBackno: null, ////휴대폰번호뒤
            wireInquireManEmail: null,
            questionTitle: null, // 질문제목
            questionContents: null, // 질문내용
            answerChargePersonSn: null, // 답변담당자순번(관리자, 관리순번)
            answerChargePersonName: null, // 답변담당자명
            answerRegisterDatetime: null, // 답변등록일시
            answerChargePersonAdminLv: '헬스케어 최고관리자',
            answerContents: null, // 답변내용
            badClaimYn: 'N', // 악성클레임여부
            answerUpdateSn: null, // 답변수정자순번
            answerUpdatePersonName: null,
            answerUpdatePersonAdminLv: null,
            answerUpdateDatetime: null, // 답변수정일시
            answerStatusCode: null, // 고객답변코드
            answerStatusName: null, // 고객답변코드명
            menuCode: computed(() => state.menuCode),
            wireInquiryManEmailAddress: computed(() => state.admnEmad2 !== null ? state.admnEmad1 + '@' + state.admnEmad2 : state.admnEmad1)
        });

        /**
         * 휴대폰 번호
         */
        watch(() => formData.value.hhpnoFrontno, (value) => {
            console.log('1234', value);
            const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z]/;
            if (reg.exec(value) !== null) formData.value.hhpnoFrontno = formData.value.hhpnoFrontno.replace(/[^0-9]/g, '');
        });
        watch(() => formData.value.hhpnoMiddleno, (value) => {
            console.log('1234', value);
            const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z]/;
            if (reg.exec(value) !== null) formData.value.hhpnoMiddleno = formData.value.hhpnoMiddleno.replace(/[^0-9]/g, '');
        });
        watch(() => formData.value.hhpnoBackno, (value) => {
            console.log('1234', value);
            const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z]/;
            if (reg.exec(value) !== null) formData.value.hhpnoBackno = formData.value.hhpnoBackno.replace(/[^0-9]/g, '');
        });


        onMounted(async () => {
            //158000 답변상태
            await codeList.getGroupCode(158000).then(result => {
                state.adminAnswerStatusList.push(...result.filter(item => item.label === '검토중' || item.label === '답변완료'));
            });
            //154000 응대유형
            await codeList.getGroupCode(154000).then(result => {
                state.responseStatusList.push(...result);
            });
            //152000 문의유형1
            await codeList.getGroupCode(152000).then(result => {
                state.questionTypeList.push(...result.filter(item => item.useYn === 'Y'));
            });
            //152000 문의유형2
            await codeList.getGroupCode(152006).then(result => {
                state.questionTypeList2.push(...result);
            });

            state.wireInqSn = route.query.wireInqSn;
            if (state.wireInqSn) {
                await getQnaWireDetail(state.wireInqSn);
                state.editYn = true;
            } else {
                init();
            }
            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeMskgn', onChangeMskgn);
        });

        onUnmounted(() => {
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeMskgn');
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
            qnaSave();
        };

        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
        };
        //마스킹 해제 처리 후 리스트 재조회 
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getQnaWireDetail(state.wireInqSn);
        };

        // 상세조회
        const getQnaWireDetail = async (params) => {
            try {
                const response = await _getQnaWireDetail({ wireInqSn: params, mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N', menuCode: state.menuCode });
                Object.assign(formData.value, response.data.data);
                // 날짜 포멧
                formData.value.inquiryDatetime = dateTimeFormat(formData.value.inquiryDatetime);
                formData.value.answerRegisterDatetime = dateTimeFormat(formData.value.answerRegisterDatetime);
                formData.value.answerUpdateDatetime = dateTimeFormat(formData.value.answerUpdateDatetime);
                formData.value.respondStatusCode = formData.value.respondStatusCode ?? state.responseStatusList[0].value;
            } catch (error) {
                console.log(error);
            }
        };

        const confirmApi = (message, successFunction, successParams) => {
            return $Modal.confirm({
                title: '',
                message: message,
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            }).then(success => {
                if (success === 'confirm') {
                    return successFunction(successParams);
                }
            }).catch(error => {
                console.log(error);
                return false;
            });
        };


        // 저장
        const qnaSave = async () => {
            if (validation()) {
                const params = {
                    wireInqSn: formData.value.wireInqSn,
                    inquiryDatetime: formData.value.inquiryDatetime,
                    adminAnswerStatusCode: formData.value.adminAnswerStatusCode,
                    questionTypeCode: formData.value.questionTypeCode,
                    solveYn: formData.value.solveStatusYn,
                    wireInqMbrSn: formData.value.wireInqMbrSn,
                    wireInquiryManName: formData.value.wireInquireManName.trim(),
                    hhpnoFrontNo: formData.value.hhpnoFrontno,
                    hhpnoMiddleNo: formData.value.hhpnoMiddleno,
                    hhpnoBackNo: formData.value.hhpnoBackno,
                    wireInquiryManEmailAddress: formData.value.wireInquiryManEmailAddress,
                    questionTitle: formData.value.questionTitle,
                    questionContents: formData.value.questionContents,
                    answerContents: formData.value.answerContents,
                    badClaimYn: formData.value.badClaimYn,
                    menuCode: state.menuCode
                };

                let response;
                if (state.editYn) {
                    //수정
                    response = await confirmApi('저장하시겠습니까?', _editQnaWire, params);
                } else {
                    //등록
                    response = await confirmApi('저장하시겠습니까?', _registQnaWire, params);
                }

                if (response.data.code === 'OK') {
                    state.editYn ? await getQnaWireDetail(formData.value.wireInqSn) : goToPage('/cs_center/qna/list');
                    return true;
                } else {
                    console.log(response.data);
                    return false;
                }
            }
        };

        const maskingUnlock = () => {
            state.mskgnRlsYn = false;
            getQnaWireDetail(state.wireInqSn);
        };

        const modalControl = () => {
            isUserSearch.value = false;
        };

        const selectedOptions = (valueCode, valueName, type) => {
            if (type === 'mailType2') {
                state.admnEmad1 = null;
                state.admnEmad2Code = valueCode;
                state.admnEmad2 = valueName;
            }
        };

        /**
         * @check setInputNumber
         */
        const setInputNumber = (event) => {
            const target = event.target.getAttribute('data-target');
            formData.value[target] = event.target.value;
            console.log(event.target.getAttribute('data-target'), formData.value[target]);
        };

        // 회원선택
        const selectUser = (item) => {
            formData.value.wireInqMbrSn = item.mbrSn;
            formData.value.wireInquireManName = item.memberName;
            state.admnEmad1 = item.memberEmail;
            state.admnEmad2 = null;
            state.admnEmad2Code = 103014;
            [formData.value.hhpnoFrontno, formData.value.hhpnoMiddleno, formData.value.hhpnoBackno] = split(item.memberHhpNo, '-');
            isUserSearch.value = false;
            state.isDirectUser = false;
            // validationForm.value.wireInquireManName.value = false; 값없음 오류
            console.log(item);
        };

        // 직접입력
        const directUser = () => {
            state.isDirectUser = true;
            formData.value.wireInquireManName = null;
            state.admnEmad1 = null;
            state.admnEmad2 = null;
            state.admnEmad2Code = 103014;
            [formData.value.hhpnoFrontno, formData.value.hhpnoMiddleno, formData.value.hhpnoBackno] = ['010', null, null];
        };

        //값검증
        const validation = (result) => {
            console.log(result);
            if (result) {
                validationForm.value[result.target] = result;
                return result.result;
            }
            if (!formData.value.wireInquireManName) return validation({ target: 'wireInquireManName', value: true, message: '문의자를 입력해주세요.', class: 'error' });

            if (!formData.value.hhpnoFrontno || !formData.value.hhpnoMiddleno || !formData.value.hhpnoBackno) return validation({
                target: 'hhpno',
                value: true,
                message: '휴대폰번호를 입력해주세요.',
                class: 'error'
            });
            if (state.admnEmad2 !== null && state.admnEmad1 === null) return validation({ target: 'wireInquirEmail', value: true, message: '메일주소를 입력해주세요', class: 'error' });
            if (!formData.value.questionTitle) return validation({ target: 'questionTitle', value: true, message: '제목을 입력해주세요.', class: 'error' });
            if (!formData.value.questionContents) return validation({ target: 'questionContents', value: true, message: '문의 내용을 입력해주세요.', class: 'error' });
            if (!formData.value.answerContents) return validation({ target: 'answerContents', value: true, message: '답변 내용을 입력해주세요.', class: 'error' });
            if (state.editYn && state.mskgnRlsYn) {
                $Modal.alert({ message: '마스킹 해제 후 저장 가능합니다.', buttonText: { ok: '확인' } });
                return false;
            }
            return validation({ result: true });
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            state,
            formData,
            isUserSearch,
            modalControl,
            goToPage,
            openModal,
            selectedOptions,
            selectUser,
            directUser,
            maskingUnlock,
            validationForm,
            setInputNumber,
            
            checkEdit,
            changeMskgnRlsYn
        };
    }
};
</script>