<template>
    <section class="temp-section">
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
                                <th scope="row">아이디</th>
                                <td>{{ formData.admnId }}</td>
                                <th scope="row">이메일<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="guide-form flex-11">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input v-model="formData.admnEmad1" :class="validationForm.admnEmad1?.class"
                                                    class="form-control" type="text"
                                                    @input="validationForm.admnEmad1 = null">
                                            </div>
                                            <span class="ui-coupler">@</span>
                                            <div class="reg-item">
                                                <input v-model="formData.admnEmad2" :class="validationForm.admnEmad1?.class"
                                                    class="form-control" type="text"
                                                    @input="validationForm.admnEmad1 = null">
                                            </div>
                                        </div>
                                        <span v-if="validationForm.admnEmad1?.value" class="input-guide error">{{
                                            validationForm.admnEmad1?.message
                                        }}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">이름<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <div class="guide-form flex-11">
                                                <input v-model="formData.admnNm" :class="validationForm.admnNm?.class"
                                                    class="form-control" type="text" @input="validationForm.admnNm = null">
                                                <span v-if="validationForm.admnNm?.value" class="input-guide error">{{
                                                    validationForm.admnNm?.message
                                                }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">휴대전화번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="guide-form flex-11">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input v-model="formData.admnHhpnoFno"
                                                    :class="validationForm.admnHhpno?.class" class="form-control"
                                                    type="text" @input="validationForm.admnHhpno = null">
                                            </div>
                                            <span class="ui-coupler">-</span>
                                            <div class="reg-item">
                                                <input v-model="formData.admnHhpnoMno"
                                                    :class="validationForm.admnHhpno?.class" class="form-control"
                                                    type="text" @input="validationForm.admnHhpno = null">
                                            </div>
                                            <span class="ui-coupler">-</span>
                                            <div class="reg-item">
                                                <input v-model="formData.admnHhpnoBno"
                                                    :class="validationForm.admnHhpno?.class" class="form-control"
                                                    type="text" @input="validationForm.admnHhpno = null">
                                            </div>
                                        </div>
                                        <span v-if="validationForm.admnHhpno?.value" class="input-guide error">{{
                                            validationForm.admnHhpno?.message
                                        }}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">부서명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <div class="guide-form flex-11">
                                                <input v-model="formData.admnDepNm" :class="validationForm.admnDepNm?.class"
                                                    class="form-control" type="text"
                                                    @input="validationForm.admnDepNm = null">
                                                <span v-if="validationForm.admnDepNm?.value" class="input-guide error">{{
                                                    validationForm.admnDepNm?.message
                                                }}</span>
                                            </div>
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
            <div class="ui-title-3">
                <h3>권한 정보</h3>
            </div>
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
                                <th scope="row">파트너 어드민</th>
                                <td colspan="3">{{ formData.admnPtalSitNm }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <div class="ui-title-3">
                <h3>소속 정보</h3>
            </div>
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
                                <th scope="row">회사명</th>
                                <td colspan="3">{{ formData.ntprNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">대표 담당자 이름</th>
                                <td>{{ formData.uprAdmnNm }}</td>
                                <th scope="row">대표 담당자 휴대전화번호</th>
                                <td>{{ formData.uprAdmnHhpno }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <div class="ui-title-3">
                <h3>이력 정보</h3>
            </div>
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
                                <th scope="row">로그인잠김</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span>
                                                {{ formData.admnPwdErrCotLgnLockYn }}
                                                (실패횟수:{{ formData.admnPwdErrCot }})
                                            </span>
                                            <button v-if="formData.admnPwdErrCotLgnLockYn === 'Y'" class="btn btn-slm"
                                                type="button">
                                                로그인 잠김 해제 및 임시비밀번호 발송
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">최종로그인일시</th>
                                <td>{{ formData.admnLtlyLgnDt }}</td>
                            </tr>
                            <tr>
                                <th scope="row">휴면여부</th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span>{{ formData.admnDrmYn }}</span>
                                            <button v-if="formData.admnDrmYn === 'Y'" class="btn btn-slm" type="button">
                                                휴면해제처리
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">비밀번호 연기횟수</th>
                                <td>{{ formData.admnPwdChgPstpCot }}</td>
                                <th scope="row">비밀번호 수정일시</th>
                                <td>{{ formData.admnPwdChgDt }}</td>
                            </tr>
                            <tr>
                                <th scope="row">가입일시</th>
                                <td v-if="formData.admnFstLgnYn === 'Y'" colspan="3">{{ formData.admnJnDt }}</td>
                                <td v-else colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="label">가입전</span>
                                            <button class="btn btn-slm" type="button">가입안내 이메일 재발송</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">등록자</th>
                                <td>{{ formData.rgsUsrNm }}</td>
                                <th scope="row">등록일시</th>
                                <td>{{ formData.rgsDt }}</td>
                            </tr>
                            <tr>
                                <th scope="row">수정자</th>
                                <td>{{ formData.updUsrNm }}</td>
                                <th scope="row">수정일시</th>
                                <td>{{ formData.updDt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button class="btn btn-sl nega" type="button" @click="goToPage('/member/partner/sub_account/list')">취소</button>
            <button v-if="!authMaster" class="btn btn-sl nega" type="button" @click="savePartner('del')">삭제</button>
            <button :disabled="state.mskgnRlsYn === 'N'" class="btn btn-sl nega" type="button"
                @click="onChangeMasking">마스킹해제
            </button>
            <button class="btn btn-sl posi" type="button" @click="savePartner('edit')">저장</button>
        </div>
    </section>
</template>
<script>
import { computed, reactive, onMounted, inject, ref } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useRoute, useRouter } from 'vue-router';
import {
    _delAdmin,
    _editAdminDormancyRelease,
    _editLoginLockRelease,
    _editPartnerSubAccount,
    _getPartnerSubAccountDetail,
    _reSendJoinGuideEmail
} from '@/api/admin.js';
//셀렉트박스 선택
export default {
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage } = useCommFunc();
        const route = useRoute();
        const validationForm = ref({});

        const state = reactive({
            admnSn: '',
            subTitle: '',
            mskgnRlsYn: 'Y', // 마스킹 해제 여부
            menuCode: '1009003'
        });

        const formData = ref({
            admnSn: null,
            admnId: null, // 아이디
            admnNm: null, // 이름
            admnHhpnoFno: null, // 전화번호1
            admnHhpnoMno: null, // 전화번호2
            admnHhpnoBno: null, // 전화번호3
            admnDepNm: null,  // 부서명
            admnPtalSitCd: null,
            admnPtalSitNm: null,
            admnPtnrTyCd: null, // 파트너유형코드
            admnPtnrTyNm: null, // 파트너유형 명
            authSeNm: null, // 권한레벨명
            mdYn: null,  // MD 여부
            ntprNm: null, // 회사명
            uprAdmnNm: null,  // 상위 관리자 명
            uprAdmnHhpno: null, // 상위 관리자 전화번호
            admnPwdErrCotLgnLockYn: null, // 로그인잠김 여부
            admnPwdErrCot: null, // 로그인실패횟수
            admnLtlyLgnDt: null, // 최종로그인일시
            admnDrmYn: null, //휴면여부
            admnPwdChgPstpCot: null, // 비밀번호 연기횟수
            admnPwdChgDt: null, // 비밀번호 수정일
            admnJnDt: null, // 가입일시
            rgsDt: null, // 등록일
            rgsUsrNm: null, // 등록자명
            updDt: null, // 수정일시
            updUsrNm: null, // 수정자
            admnFstLgnYn: null, // 최초로그인여부
            admnEmad1: null, // 이메일 앞
            admnEmad2: null, // 이메일 뒤
            admnEmad: null,
            menuCode: state.menuCode
        });

        onMounted(async () => {
            state.admnSn = route.query.admnSn;
            state.subTitle = '계정 정보';
            state.mskgnRlsYn = 'Y'; // 'N' 이 해제
            await getPartnerDetail(state);
            console.log(route);
        });

        // 상세조회
        const getPartnerDetail = async () => {
            try {
                const response = await _getPartnerSubAccountDetail({ admnSn: state.admnSn, mskgnRlsYn: state.mskgnRlsYn, menuCode: state.menuCode });
                if (response.data.code === 'OK') {
                    formData.value = response.data.data;
                    const admnEmad = formData.value.admnEmad.toString().split('@');

                    if (!!admnEmad) {
                        formData.value.admnEmad1 = admnEmad[0] ?? '';
                        formData.value.admnEmad2 = admnEmad[1] ?? '';
                    }
                } else {
                    $Modal.alert({ message: response.data.message, buttonText: { ok: '확인' } }).then(v => {
                        goToPage('/member/partner/sub_account/list');
                    });
                }

            } catch (error) {
                console.log(error);
            }
        };

        const onChangeMasking = () => {
            state.mskgnRlsYn = state.mskgnRlsYn === 'Y' ? 'N' : 'Y';
            getPartnerDetail();
        };

        const authMaster = computed(() => {
            return formData.value.authSeNm === 'Master';
        });

        const formValidation = () => {
            if (state.mskgnRlsYn !== 'N') {
                $Modal.alert('마스킹 해제 후 저장 가능합니다.');
                return false;
            }

            if (!formData.value.admnEmad1 || !formData.value.admnEmad2) {
                validationForm.value.admnEmad1 = { value: true, message: '이메일을 입력해주세요.', class: 'error' };
                return false;
            }

            if (!formData.value.admnNm) {
                validationForm.value.admnNm = { value: true, message: '이름을 입력해주세요.', class: 'error' };
                return false;
            }

            if (!formData.value.admnHhpnoFno || !formData.value.admnHhpnoMno || !formData.value.admnHhpnoBno) {
                validationForm.value.admnHhpno = { value: true, message: '휴대전화번호를 입력해주세요', class: 'error' };
                return false;
            }

            if (!formData.value.admnDepNm) {
                validationForm.value.admnDepNm = { value: true, message: '부서명을 입력해주세요', class: 'error' };
                return false;
            }

            return true;
        };

        const savePartner = (type) => {
            let title = '';
            let message = '';
            let successCallFuntion = null;
            let formValidationYn = false;
            let buttonText = {
                confirm: '확인',
                cancel: '취소'
            };

            switch (type) {
                case 'edit': {
                    message = '저장 하시겠습니까?';
                    formValidationYn = true;
                    successCallFuntion = editPartner;
                    break;
                }
                // 삭제
                case 'del': {
                    message = '삭제 하시겠습니까?';
                    formValidationYn = false;
                    successCallFuntion = delPartner;
                    break;
                }
                // 휴면해제
                case 'dormancy': {
                    message = '휴면해제처리 하시겠습니까?';
                    formValidationYn = false;
                    successCallFuntion = editPartnerDormancyRelease;
                    break;
                }
                // 가입안내이메일 재발송
                case 'email': {
                    message = '가입안내이메일 재발송 하시겠습니까?';
                    formValidationYn = false;
                    successCallFuntion = reSendJoinGuideEmail;
                    break;
                }
                //로그인 잠김 해제 및 임시비밀번호발송
                case 'resetPwd': {
                    message = '로그인잠김 해제 및 임시비밀번호발송 하시겠습니까?';
                    formValidationYn = false;
                    successCallFuntion = editLoginLockRelease;
                    break;
                }
            }

            // 값검증 유무
            if (formValidationYn) {
                if (!formValidation()) {
                    return false;
                }
            }

            //이메일
            formData.value.admnEmad = formData.value.admnEmad1 + '@' + formData.value.admnEmad2;

            if (message !== '') {
                $Modal.confirm({
                    title: title,
                    message: message,
                    buttonText: buttonText
                }).then(success => {
                    if (success === 'confirm') {
                        if (typeof successCallFuntion === 'function') {
                            successCallFuntion();
                        }
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        };

        // 파트너 수정
        const editPartner = async () => {
            try {
                let params = {
                    admnSn: formData.value.admnSn,
                    admnNm: formData.value.admnNm,
                    admnEmad: formData.value.admnEmad,
                    admnHhpnoFno: formData.value.admnHhpnoFno,
                    admnHhpnoMno: formData.value.admnHhpnoMno,
                    admnHhpnoBno: formData.value.admnHhpnoBno,
                    admnDepNm: formData.value.admnDepNm,
                    menuCode: state.menuCode
                };
                await _editPartnerSubAccount(params).then(result => {
                    if (result.data.code === 'OK') {
                        $Modal.alert({ message: '수정 되었습니다.', buttonText: { ok: '확인' } }).then(v => {
                            goToPage('/member/partner/sub_account/list');
                        });
                    } else {
                        console.log(result.data);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        // 파트너 삭제
        const delPartner = async () => {
            try {
                await _delAdmin(state.admnSn).then(result => {
                    if (result.data.code === 'OK') {
                        $Modal.alert({ message: '삭제 되었습니다.', buttonText: { ok: '확인' } }).then(v => {
                            goToPage('/member/partner/sub_account/list');
                        });
                    } else {
                        console.log(result.data);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        // 파트너 휴면해제
        const editPartnerDormancyRelease = async () => {
            try {
                await _editAdminDormancyRelease(state.admnSn).then(result => {
                    if (result.data.code === 'OK') {
                        $Modal.alert({ message: '휴면해제 되었습니다.', buttonText: { ok: '확인' } }).then(v => {
                            getPartnerDetail();
                        });
                    } else {
                        console.log(result.data);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        // 로그인 잠금해제 및 임시비밀번호발송
        const editLoginLockRelease = async () => {
            try {
                await _editLoginLockRelease(state.admnSn).then(result => {
                    if (result.data.code === 'OK') {
                        $Modal.alert({ message: '잠금해제 및 임시비밀번호발송 되었습니다.', buttonText: { ok: '확인' } }).then(v => {
                            getPartnerDetail();
                        });
                    } else {
                        console.log(result.data);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        // 어드민 회원관리 가입안내 이메일 재발송
        const reSendJoinGuideEmail = async () => {
            try {
                await _reSendJoinGuideEmail(state.admnSn).then(result => {
                    $Modal.alert({ message: '가입안내 이메일 재발송 되었습니다.', buttonText: { ok: '확인' } }).then(v => {
                    });
                });
            } catch (error) {
                console.log(error);
            }
        };

        return {
            formData,
            dayJS,
            state,
            authMaster,
            validationForm,
            onChangeMasking,
            savePartner,
            goToPage
        };
    }
};

</script>