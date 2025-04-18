<template>
    <section>
        <div class="ui-section">
            <subTitleBar subTitle="문의 일시/상태"/>
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
                            <th scope="row">문의 일자</th>
                            <td>{{ formData.firstRegistedDatetime }}
                                <template v-if="formData.firstRegistedDatetimeDiff"> (+{{
                                        formData.firstRegistedDatetimeDiff
                                    }})
                                </template>
                            </td>
                            <th scope="row">답변 상태</th>
                            <td><strong class="fc-3">{{ formData.adminAnswerStatusName }}</strong></td>
                        </tr>
                        <tr>
                            <th scope="row">문의 유형</th>
                            <td>{{ formData.questionTypeName }}</td>
                            <th scope="row">문의 담당사</th>
                            <td>{{ formData.inquiryChargeCorperationName }}</td>
                        </tr>
                        <tr>
                            <th scope="row">응대 현황</th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <SubSelectBox v-model="formData.respondStatusCode"
                                                      :list="state.responseStatusList" class="custom-select"></SubSelectBox>
                                    </div>
                                </div>
                            </td>
                            <th scope="row">해결 상태</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                            <span class="radio">
                                                <input id="clearType1" v-model="formData.solveStatusYn"
                                                       name="clearTypeGroup" type="radio" value='N'>
                                                <label for="clearType1">미해결</label>
                                            </span>
                                        <span class="radio">
                                                <input id="clearType2" v-model="formData.solveStatusYn"
                                                       name="clearTypeGroup" type="radio" value='Y'>
                                                <label for="clearType2">해결</label>
                                            </span>
                                    </div>
                                </div>
                                <span class="input-guide">해결되지 않은 시스템 또는 서비스 문제인 경우 '미해결' 상태로 체크합니다.(CS통계반영용)</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- 이관 후 상태 -->
        <div v-if="state.isTransfer" class="ui-section">
            <subTitleBar subTitle="이관 정보"/>
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
                            <th scope="row">문의 이관사</th>
                            <td>{{ formData.questionTransferCoperationName }}</td>
                            <th scope="row">이관일시</th>
                            <td>{{ formData.questionTransferDatetime }}</td>
                        </tr>
                        <tr>
                            <th scope="row">이관 사유</th>
                            <td v-html="formData.questionTransferReason"></td>
                            <th scope="row">이관처리자</th>
                            <td>{{ formData.questionTransferChargePersonName }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar subTitle="회원 정보">
                <template #btn>
                    <button class="btn btn-sm" type="button" @click="userInfoDetail">
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
                            <th scope="row">회원명</th>
                            <td>{{ formData.memberName }}</td>
                            <th scope="row">회원번호</th>
                            <td>{{ formData.memberSn }}</td>
                        </tr>
                        <tr>
                            <th scope="row">휴대폰번호</th>
                            <td>{{ formData.memberHhpnoFrontNo }} - {{ formData.memberHhpnoMiddleNo }} - {{
                                    formData.memberHhpnoBackNo
                                }}
                            </td>
                            <th scope="row">개인 이메일</th>
                            <td><a href="">{{ formData.memberEmail }}</a></td>
                        </tr>
                        <tr>
                            <th scope="row">오케어멤버십</th>
                            <td>2차 오픈</td>
                            <th scope="row">소속정보</th>
                            <td>2차 오픈</td>
                        </tr>
                        <tr>
                            <th scope="row">성별</th>
                            <td>{{ formData.memberSexName }}</td>
                            <th scope="row">연령대</th>
                            <td>{{ formData.ageGroupName }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar subTitle="문의 내용"/>
            <div class="ui-content">
                <div class="tbl-wrap mt-10">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                        <tr>
                            <th scope="row">제목</th>
                            <td>{{ formData.questionTitle }}</td>
                        </tr>
                        <tr>
                            <th scope="row">문의 내용</th>
                            <td v-html="formData.questionContents"></td>
                        </tr>
                        <tr>
                            <th scope="row">첨부파일</th>
                            <td>
                                <div v-for="(item, index) in formData.fileInfoList" :key="index"
                                     class="reg-group inline">
                                    <div class="reg-item">
                                        <a @click="imgPopup(item)">{{ item.fileOriNm }}</a>
                                    </div>
                                    <div class="reg-item">
                                        <button class="btn btn-slm" type="button" @click="fileDownload(item)">다운로드
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- 답변완료 이전 -->
        <div v-if="state.isCsSend" class="ui-section">
            <subTitleBar subTitle="답변 입력"/>
            <div class="ui-content">
                <div class="tbl-wrap mt-10">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                        <tr>
                            <th scope="row">답변 내용</th>
                            <td>
                                <div class="reg-group">
                                    <div class="guide-form flex-11">
                                        <textarea id="textarea" v-model="formData.answerContents" class="form-control"
                                                  placeholder="답변 내용을 입력하세요." style="height: 100px" @input="validationForm.answerContents = null"></textarea>
                                        <span v-if="validationForm.answerContents?.value" class="input-guide error">{{
                                                validationForm.answerContents?.message
                                            }}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">악성클레임 여부</th>
                            <td>
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- 답변 완료 아후 -->
        <div v-if="!state.isCsSend" class="ui-section">
            <subTitleBar subTitle="답변 입력"/>
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
                            <th scope="row">답변등록사</th>
                            <td>{{ formData.answerChargeCorperationName }}</td>
                            <th scope="row">접수완료일시</th>
                            <td>{{ formData.answerCompleteDatetime }}</td>
                        </tr>
                        <tr>
                            <th scope="row">답변자</th>
                            <td>{{ formData.answerChargePersonName }}</td>
                            <th scope="row">답변일시</th>
                            <td>{{ formData.answerRegisterDatetime }}</td>
                        </tr>
                        <tr>
                            <th scope="row">답변 내용</th>
                            <td colspan="3">
                                <div class="reg-group">
                                        <textarea id="textarea" v-model="formData.answerContents" class="form-control"
                                                  placeholder="답변 내용을 입력하세요." style="height: 100px"></textarea>
                                    <span v-if="validationForm.answerContents?.value" class="input-guide error">{{
                                            validationForm.answerContents?.message
                                        }}</span>
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="btn-bottom-set flex justify-center">
            <button class="btn btn-sl nega" type="button" @click="goToPage('/cs_center/qna/list')">목록</button>
            
            <!-- <button class="btn btn-sl posi" type="button" @click="changeMskgnRlsYn">마스킹해제</button> -->
            <button :disabled="!state.mskgnRlsYn" class="btn btn-sl nega" type="button" @click="changeMskgnRlsYn">
                마스킹해제
            </button>

            <button v-if="state.isAnsewrAccept" class="btn btn-sl posi" type="button" @click="qnaAnswerAceept">답변응대수락</button>
            <button v-if="state.isSave" class="btn btn-sl posi" type="button" @click="checkEdit">저장</button>
            <button v-if="state.isCsSend" class="btn btn-sl posi" type="button" @click="csSend">CS발송</button>
        </div>

    </section>

    <DefaultModal :isShow="isImgShow" buttonCancel="닫기" className="full" modal-title="이미지 상세"
                  modalName="qnaImg" @modalclose="isImgShow=false">
        <template #modalcontent>
            <div>
                <img :src="selImgUrl" style="max-width: 100%;">
            </div>
        </template>
    </DefaultModal>
</template>
<script>
import {reactive, inject, onMounted, onUnmounted, ref, computed} from 'vue';
import {_editQna, _editQnaAfter, _editQnaSendCs, _getQnaDetail, _registQnaAnswerAceept} from '@/api/customer.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import {useCommFunc} from '@/core/helper/common.js';
import {useRoute} from 'vue-router';
import codeList from '@/data/commcode/codeList.js';
import SubSelectBox from '@/views/customer/components/SelectBox.vue';
import {_fileDownload} from '@/api/common.js';
import {useStore} from 'vuex';
import {authCommFunc} from '@/core/helper/authComm.js';

export default {
    components: {
        DefaultModal,
        DateSerch,
        SubSelectBox
    },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const {
            goToPage,
            openModal
        } = useCommFunc();
        const route = useRoute();

        const store = useStore();
        const {onChangeEditRol, onChangeMaskingRol} = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);


        const state = reactive({
            qnaSn: '',
            //응답유형
            responseStatusList: [],
            isTransfer: false,
            //답변응대수락
            isAnsewrAccept: false,
            //저장
            isSave: false,
            //cs발송
            isCsSend: false,
            //마스킹해제여부
            mskgnRlsYn: true,
            menuCode: menuInfo.value.menuCode
        });

        const validationForm = ref({});
        const isImgShow = ref(false);
        const selImgUrl = ref(null);
        // 현재 시간차
        const timeDiff = (dateTime) => {
            // 1000시간 이상이면 999:59
            const diffMinute = dateTime ? dayJS().diff(dateTime, 'm') < 1000 * 60 ? dayJS().diff(dateTime, 'm') : 1000 * 60 - 1 : null;
            return diffMinute ? parseInt(diffMinute / 60) + ':' + (diffMinute % 60) : null;
        };

        const dateTimeFormat = (dateTime, format) => {
            return dateTime ? dayJS(dateTime).format(format ?? 'YYYY-MM-DD HH:mm:ss') : null;
        };

        //각종 설정
        const init = () => {

            // 검토중 158001
            if (formData.value.adminAnswerStatusCode === '158001') {
                state.isAnsewrAccept = true;
                state.isSave = true;
                state.isCsSend = true;
                //응대현황 null일때 기본값 설정
                formData.value.respondStatusCode = formData.value?.respondStatusCode ?? state.responseStatusList[0].value;
            }

            // 문의이관 158002
            if (formData.value.adminAnswerStatusCode === '158002') {
                state.isAnsewrAccept = true;
                state.isSave = true;
                state.isCsSend = true;
                //응대현황 null일때 기본값 설정
                formData.value.respondStatusCode = formData.value?.respondStatusCode ?? state.responseStatusList[0].value;
            }

            // 접수완료 158003
            if (formData.value.adminAnswerStatusCode === '158003') {
                state.isAnsewrAccept = false;
                state.isSave = true;
                state.isCsSend = true;
                //응대현황 null일때 기본값 설정
                formData.value.respondStatusCode = formData.value?.respondStatusCode ?? state.responseStatusList[0].value;
            }

            // 답변완료 158004 답변미조회 158005 답변조회 158006
            if (formData.value.adminAnswerStatusCode >= '158004') {
                state.isAnsewrAccept = false;
                //todo KB ADMIN 만 권한만 저장 가능 - 미적용
                state.isSave = true;
                state.isCsSend = false;
            }

            //이관후 상태 필요 어드민 계정정보

            // 이관 여부
            state.isTransfer = !!formData.value.qnaTransferSn;
        };

        const formData = ref({
            qnaSn: null,
            inquirySeperationCode: null, // 문의구분코드
            inquirySeperationName: null, // 문의구분명
            firstRegistedDatetime: null, // 최초등록일시(문의일시)
            adminAnswerStatusCode: null, // 관리자답변상태코드
            adminAnswerStatusName: null, // 관리자답변상태명
            questionTypeCode: null, // 질문유형코드
            questionTypeName: null, // 질문유형명
            inquiryChargeCorperationSn: null, // 문의담당회사순번
            inquiryChargeCorperationName: null, // 문의담담회사명
            respondStatusCode: null, // 대응현황코드
            respondStatusName: null, // 대응현황명
            solveStatusYn: null, // 해결여부
            qnaTransferSn: null, // Qna이관 순번
            questionTransferCoperationSn: null, // 질문이관회사순번
            questionTransferCoperationName: null, // 질문이관회사명
            questionTransferDatetime: null, // 질문이관일시
            questionTransferReason: null, // 질문이관사유
            questionTransferChargePersonSn: null, // 질문이관담당자순번
            questionTransferChargePersonName: null, // 질문이관담당자명
            memberName: null, // 회원명
            memberSn: null, // 회원번호
            memberHhpnoFrontNo: null, // 휴대폰번호 앞
            memberHhpnoMiddleNo: null, // 휴대폰번호 중
            memberHhpnoBackNo: null, // 휴대폰번호 뒤
            memberEmail: null, // 이메일
            memberSexCode: null, // 성별코드
            memberSexName: null, // 성별명
            memberBirthYy: null, // 생년
            memberBirthMm: null, // 생월
            memberBirthDd: null, // 생일
            ageGroupCode: null, // 연령대코드
            ageGroupName: null, // 연령대명
            questionTitle: null, // 질문제목
            questionContents: null, // 질문내용
            answerChargeCorperationSn: null, // 답변담당회사순번
            answerChargeCorperationName: null, // 답변담당회사명
            answerCompleteDatetime: null, // 접수완료일시(응대수락시)
            answerChargePersonSn: null, // 답변담당자순번(관리자, 관리순번)
            answerChargePersonName: null, // 답변담당자명
            answerRegisterDatetime: null, // 답변등록일시
            answerUpdateSn: null, // 답변수정자순번
            answerUpdateName: null, // 답변수정자명
            answerUpdateDatetime: null, // 답변수정일시
            answerContents: null, // 답변내용
            badClaimYn: null, // 악성클레임여부
            fileInfoList: null // 파일정보
        });


        onMounted(async () => {
            //154000 응대유형
            await codeList.getGroupCode(154000).then(result => {
                state.responseStatusList.push(...result);
            });
            state.qnaSn = route.query.qnaSn;
            await getQnaDetail(state.qnaSn);

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
            // goToPage('/cs_center/system_notice/register?systemNoticeSn=' + formData.value.systemNoticeSn);
        };

        /**
         * 마스킹 권한 체크
         */
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
        };

        /**
         * 마스킹 해제 처리 후 리스트 재조회
         */
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getQnaDetail(state.qnaSn);
        };

        // 상세조회
        const getQnaDetail = async (params) => {
            try {
                const response = await _getQnaDetail({qnaSn: params, mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N', menuCode: state.menuCode});
                Object.assign(formData.value, response.data.data);
                // 날짜 포멧
                formData.value.firstRegistedDatetime = dateTimeFormat(formData.value.firstRegistedDatetime);
                formData.value.questionTransferDatetime = dateTimeFormat(formData.value.questionTransferDatetime);
                formData.value.answerCompleteDatetime = dateTimeFormat(formData.value.answerCompleteDatetime);
                formData.value.answerRegisterDatetime = dateTimeFormat(formData.value.answerUpdateDatetime ?? formData.value.answerRegisterDatetime);
                formData.value.firstRegistedDatetimeDiff = timeDiff(formData.value.firstRegistedDatetime); // 최초등록일시(문의일시) 차이
            } catch (error) {
                console.log(error);
            }
            init();
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
                } else {
                    return false;
                }
            }).catch(error => {
                console.log(error);
                return false;
            });
        };

        //답변응대수락 확인
        const isAnswerAcceptCheck = (option) => {
            // 타입 체크
            option = typeof option === 'object' ? option : {message: option, buttonText: {ok: '확인'}};
            // 답변응대가 수락가능할때
            if (state.isAnsewrAccept) {
                $Modal.alert(option);
                return false;
                //return confirmApi(option.message ?? '답변응대를 수락하시겠습니까? 수락하시면 접수완료 상태로 전환됩니다.', registQnaAnswerAceept(option.refresh));
            } else {
                return true;
            }
        };

        // 마스킹해제
        // const maskingUnlock = () => {
        //     state.mskgnRlsYn = 'N';
        //     getQnaDetail(state.qnaSn);
        // };

        // 답변응대수락
        const qnaAnswerAceept = async () => {
            try {

                let params = {
                    qnaSn: formData.value.qnaSn,
                    reponseStatusCode: formData.value.respondStatusCode,
                    solveYn: formData.value.solveStatusYn,
                    answerChargeCompanySn: formData.value.answerChargeCorperationSn,
                    menuCode: state.menuCode
                };
                const resposne = await confirmApi('답변응대를 수락하시겠습니까? 수락하시면 접수완료 상태로 전환됩니다.', _registQnaAnswerAceept, params);

                if (resposne) {
                    getQnaDetail(formData.value.qnaSn);
                    return true;
                } else {
                    return false;
                }

            } catch (error) {
                console.log(error);
                return false;
            }

        };

        // 저장
        const qnaSave = async () => {
            if (await isAnswerAcceptCheck('답변응대 수락이 필요합니다. 수락 이후 저장 가능합니다.')) {
                if (!validation()) return false;
                const params = {
                    qnaSn: formData.value.qnaSn,
                    reponseStatusCode: formData.value.respondStatusCode,
                    solveYn: formData.value.solveStatusYn,
                    answerContents: formData.value.answerContents,
                    badClaimYn: formData.value.badClaimYn,
                    menuCode: state.menuCode
                };

                let response;
                // cs 발송 이전
                if (state.isCsSend) {
                    response = await confirmApi('답변을 임시 저장 하시겠습니까? 답변발송을 위해서는 \'CS발송\' 버튼을 클릭해주세요.', _editQna, params);
                } else {
                    // cs 발송이후 저장
                    response = await confirmApi('이미 CS발송된 답변입니다. 답변을 수정하시겠습니까?', _editQnaAfter, params);
                }

                if (response) {
                    await getQnaDetail(formData.value.qnaSn);
                    return true;
                } else {
                    console.log(response.data);
                    return false;
                }
            }
        };

        const fileDownload = async (params) => {
            try {
                const response = await _fileDownload(params.fileId);
                const blob = new Blob([response.data], {type: response.headers['content-type']});
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                const match = /filename="(.+?)"/.exec([response.headers['content-disposition']]);
                a.href = url;
                a.download = match ? match[1] : null;
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.log(error);
            }
        };

        // cs발송
        const csSend = async () => {
            if (await isAnswerAcceptCheck('답변응대 수락이 필요합니다. 수락 이후 CS발송 가능합니다.')) {
                if (!validation()) return false;
                const params = {
                    qnaSn: formData.value.qnaSn,
                    reponseStatusCode: formData.value.respondStatusCode,
                    solveYn: formData.value.solveStatusYn,
                    answerContents: formData.value.answerContents,
                    badClaimYn: formData.value.badClaimYn,
                    menuCode: state.menuCode
                };

                const response = await confirmApi('답변을 고객 대상으로 발송하시겠습니까?', _editQnaSendCs, params);

                if (response.data.code === 'OK') {
                    await getQnaDetail(formData.value.qnaSn);
                    return true;
                } else {
                    console.log(response.data);
                    return false;
                }
            }
        };

        //값검증
        const validation = (result) => {
            if (result) {
                validationForm.value[result.target] = result;
                return result.result;
            }
            if (!formData.value.answerContents) return validation({target: 'answerContents', value: true, message: '답변 내용을 입력해주세요.', class: 'error'});
            return validation({result: true});
        };

        const imgPopup = (item) => {
            selImgUrl.value = item.fileUrl;
            isImgShow.value = true;
        };

        /**
         * 회원 상세 조회
         */
        const userInfoDetail = () => {
            // formData.value.questionTypeCode // 문의유형코드
            console.log('user info >>', formData.value.questionTypeCode, formData.value.questionTypeName, formData.value);

            const qnaType = formData.value.questionTypeCode;
            const member = formData.value.memberSn;

            let _url = '';

            if (qnaType === '152001') {
                console.log('회원관련 문의');
                _url = `/member/detail?mbrSn=${member}`;
            } else if (qnaType === '152002') {
                console.log('챌린지/커뮤니티 문의');
                _url = `/member/detail?mbrSn=${member}&activeTab=service`;
            } else if (qnaType === '152003') {
                console.log('오류 문의');
                _url = `/member/detail?mbrSn=${member}`;
            } else if (qnaType === '152004') {
                console.log('리워드 포인트 문의');
                _url = `/member/detail?mbrSn=${member}&activeTab=point`;
            } else if (qnaType === '152005') {
                console.log('건강검진 문의');
                _url = `/member/health_info/detail?mbrSn=${member}`;
            } else if (qnaType === '152006') {
                console.log('건강기록 문의');
                _url = `/member/detail?mbrSn=${member}&activeTab=service`;
            } else if (qnaType === '152007') {
                console.log('건강뉴스(컨텐츠) 문의');
                _url = `/member/detail?mbrSn=${member}&activeTab=service`;
            } else if (qnaType === '152009') {
                console.log('심리검사/상담 문의');
                _url = `/member/detail?mbrSn=${member}&activeTab=service`;
            } else if (qnaType === '152021') {
                console.log('메디컬 문의');
                _url = `/member/health_info/detail?mbrSn=${member}&activeTab=service`;
            } else if (qnaType === '152022') {
                console.log('기타 문의');
                _url = `/member/detail?mbrSn=${member}`;
            } else {
                _url = `/member/detail?mbrSn=${member}`;
            }

            goToPage(_url);
            

            // [문의유형별 회원상세정보 링크정보]
            // - 회원관련 문의 ----> 회원정보관리 > 상세화면
            // - 챌린지/커뮤니티 문의 ----> 회원정보관리 > 상세화면 > 서비스
            // - 오류 문의 ----> 회원정보관리 > 상세화면
            // - 리워드포인트 문의 ----> 회원정보관리 > 상세화면 > 포인트/쿠폰
            // - 건강검진 문의 ----> 건강정보관리 > 상세화면 > 일반건강검진 결과
            // - 건강기록 문의 ----> 회원정보관리 > 상세화면 > 서비스
            // - 건강뉴스 문의 ----> 회원정보관리 > 상세화면 > 서비스
            // - 심리검사/상담 문의 ----> 회원정보관리 > 상세화면 > 서비스
            // - 메디컬 문의 ----> 건강정보관리 > 상세화면 > 메디컬서비스 이용
            // - 기타 문의 ----> 회원정보관리 > 상세화면
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            state,
            formData,
            validationForm,
            isImgShow,
            selImgUrl,
            goToPage,
            openModal,
            // maskingUnlock,
            qnaSave,
            isAnswerAcceptCheck,
            csSend,
            fileDownload,
            imgPopup,
            qnaAnswerAceept,
            userInfoDetail,

            checkEdit,
            changeMskgnRlsYn
        };
    }
};
</script>