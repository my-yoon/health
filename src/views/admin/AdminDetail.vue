<template>
    <section>
        <div class="ui-section">
            <subTitleBar :subTitle="state.subTitle" />
            <!-- {{ state.adminfo }} -->
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
                                <th scope="row">휴대폰번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="guide-form flex-11">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <!-- <input :value="formData.admnHhpnoFno"
                                                    :class="validationForm.admnHhpno?.class" class="form-control"
                                                    type="text" @input="validationForm.admnHhpno = null"> -->
                                                <input :value="formData.admnHhpnoFno" class="form-control"
                                                    data-target="admnHhpnoFno" maxlength="3" type="text"
                                                    @input="setInputNumber">
                                            </div>
                                            <span class="ui-coupler">-</span>
                                            <div class="reg-item">
                                                <!-- <input :value="formData.admnHhpnoMno"
                                                    :class="validationForm.admnHhpno?.class" class="form-control"
                                                    type="text" @input="validationForm.admnHhpno = null"> -->
                                                <input :value="formData.admnHhpnoMno" class="form-control"
                                                    data-target="admnHhpnoMno" maxlength="4" type="text"
                                                    @input="setInputNumber">
                                            </div>
                                            <span class="ui-coupler">-</span>
                                            <div class="reg-item">
                                                <!-- <input :value="formData.admnHhpnoBno"
                                                    :class="validationForm.admnHhpno?.class" class="form-control"
                                                    type="text" @input="validationForm.admnHhpno = null"> -->
                                                <input :value="formData.admnHhpnoBno" class="form-control"
                                                    data-target="admnHhpnoBno" maxlength="4" type="text"
                                                    @input="setInputNumber">
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
                                <th scope="row">어드민 구분</th>
                                <td>{{ formData.admnPtalSitNm }}</td>
                                <th scope="row">권한레벨</th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            {{ formData.authSeNm }}
                                        </div>
                                        <div v-if="formData.admnPtnrTyNm === 'Seller'" class="reg-item">
                                            <span class="checkbox ml-10">
                                                <input id="isMD" v-model="formData.mdYn" false-value="N" name="isMDGroup"
                                                    true-value="Y" type="checkbox" @change="mdYnToggle">
                                                <label for="isMD">MD 여부</label>
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
        <!-- v-if="!authMaster" -->
        <div class="ui-section" v-if="state.adminfo.admnLvlId !== 'A00'">
            <div class="ui-title-3">
                <h3>상위 관리자 정보</h3>
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
                                <th scope="row">관리자 이름</th>
                                <td>{{ formData.uprAdmnNm }}</td>
                                <th scope="row">관리자 휴대폰번호</th>
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
                                            <!---->
                                            <button class="btn btn-slm" type="button"
                                                v-if="formData.admnPwdErrCotLgnLockYn === 'Y'"
                                                @click="saveAdmin('resetPwd')">
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
                                            <button v-if="formData.admnDrmYn === 'Y'" class="btn btn-slm" type="button"
                                                @click="saveAdmin('dormancy')">
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
                                <td v-if="formData.admnJnDt" colspan="3">{{ formData.admnJnDt }}</td>
                                <td v-else colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="label">가입전</span>
                                            <button class="btn btn-slm" type="button" @click="saveAdmin('email')">가입안내 이메일
                                                재발송
                                            </button>
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
            <button class="btn btn-sl nega" type="button" @click="goToPage('/member/kb_admin/list')">취소</button>
            <button class="btn btn-sl nega" type="button" @click="onChangeAuthDel()">삭제</button>
            <button :disabled="!state.mskgnRlsYn" class="btn btn-sl nega" type="button" @click="changeMskgnRlsYn()">마스킹해제
            </button>
            <button class="btn btn-sl posi" type="button" @click="onChangeAuthEdit">저장</button>
        </div>
    </section>
</template>
<script>
import { computed, reactive, onMounted, inject, ref, onUnmounted, watch } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useRoute } from 'vue-router';
import { _editAdmin, _editAdminDormancyRelease, _editLoginLockRelease, _getAdminDetail, _reSendJoinGuideEmail, _delAdmin } from '@/api/admin.js';
import { useStore } from 'vuex';
export default {

    // props: ['adminfo'],
    setup(props) {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage } = useCommFunc();
        const validationForm = ref({});
        const route = useRoute();
        const store = useStore();
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
        const { onChangeMaskingRol, onChangeDownRol, onChangeEditRol, onChangeDelRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const state = reactive({
            admnSn: '',
            subTitle: '',
            mskgnRlsYn: true,
            menuCode: computed(() => menuInfo.value.menuCode),
            adminfo: computed(() => store.state.authModule.userInfomation)
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
            menuCode: computed(() => state.menuCode)
        });

        /**
         * 휴대폰 번호
         */
        watch(() => formData.value.admnHhpnoFno, (value) => {
            checkReg('admnHhpnoFno', value);
        });
        watch(() => formData.value.admnHhpnoMno, (value) => {
            checkReg('admnHhpnoMno', value);
        });
        watch(() => formData.value.admnHhpnoBno, (value) => {
            checkReg('admnHhpnoBno', value);
        });

        const checkReg = (type, value) => {
            const reg = /^[0-9]+$/;
            if (!reg.test(value)) formData.value[type] = formData.value[type].replace(/[^0-9]/g, '');
        };

        onMounted(() => {
            state.admnSn = route.query.admnSn;
            state.subTitle = '계정 정보';
            state.mskgnRlsYn = true;
            getAdminDetail(state);
            //마스킹 권한 확인 후 리스트조회
            emitter.$on('onChangeMskgn', onChangeMskgn);
            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });

        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });
        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn, state.mskgnRlsYn);
        };
        //마스킹 해제 처리 후 리스트 재조회 
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            // console.log(마스킹 재 조회)
            getAdminDetail();
        };
        //수정권한 처리
        const onChangeAuthEdit = async () => {
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };
        //삭제권한 처리
        const onChangeAuthDel = async () => {
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
        };
        const onChangeEdit = () => {
            saveAdmin('edit');
        };
        const onChangeDel = () => {
            saveAdmin('del');
        };
        // 상세조회
        const getAdminDetail = async () => {
            try {
                const response = await _getAdminDetail({ admnSn: state.admnSn, mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N', menuCode: formData.value.menuCode });
                formData.value = response.data.data;
                formData.value.menuCode = state.menuCode;
                const admnEmad = formData.value.admnEmad.toString().split('@');
                console.log(state.mskgnRlsYn);
                if (!!admnEmad) {
                    formData.value.admnEmad1 = admnEmad[0] ?? '';
                    formData.value.admnEmad2 = admnEmad[1] ?? '';
                }
            } catch (error) {
                console.log(error);
            }
        };




        const formValidation = () => {
            if (state.mskgnRlsYn) {
                $Modal.alert({ message: '마스킹 해제 후 저장 가능합니다.', buttonText: { ok: '확인' } });
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
                validationForm.value.admnHhpno = { value: true, message: '휴대폰번호를 입력해주세요', class: 'error' };
                return false;
            }

            if (!formData.value.admnDepNm) {
                validationForm.value.admnDepNm = { value: true, message: '부서명을 입력해주세요', class: 'error' };
                return false;
            }

            return true;
        };

        const saveAdmin = (type) => {
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
                    successCallFuntion = editAdmin;
                    break;
                }
                // 삭제
                case 'del': {
                    message = '삭제 하시겠습니까?';
                    formValidationYn = false;
                    successCallFuntion = delAdmin;
                    break;
                }
                // 휴면해제
                case 'dormancy': {
                    message = '휴면해제처리 하시겠습니까?';
                    formValidationYn = false;
                    successCallFuntion = editAdminDormancyRelease;
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

            formData.value.admnEmad = formData.value.admnEmad1 + '@' + formData.value.admnEmad2;

            console.log(formData.value.admnEmad);

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

        // 어드민 수정
        const editAdmin = async () => {
            try {
                await _editAdmin(formData.value).then(result => {
                    if (result.data.code === 'OK') {
                        $Modal.alert({ message: '수정 되었습니다.', buttonText: { ok: '확인' } }).then(v => {
                            goToPage('/member/kb_admin/list');
                        });
                    } else {
                        console.log(result.data);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        // 어드민 수정
        const delAdmin = async () => {
            try {
                const params = {
                    admnSn: state.admnSn,
                    menuCode: state.menuCode
                };
                await _delAdmin(params).then(result => {
                    if (result.data.code === 'OK') {
                        $Modal.alert({ message: '삭제 되었습니다.', buttonText: { ok: '확인' } }).then(v => {
                            goToPage('/member/kb_admin/list');
                        });
                    } else {
                        console.log(result.data);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        // 어드민 휴면해제
        const editAdminDormancyRelease = async () => {
            try {
                let params = {
                    admnSn: state.admnSn,
                    menuCode: state.menuCode
                };
                await _editAdminDormancyRelease(params.admnSn).then(result => {
                    if (result.data.code === 'OK') {
                        $Modal.alert({ message: '휴면해제 되었습니다.', buttonText: { ok: '확인' } }).then(v => {
                            getAdminDetail();
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
                let params = {
                    admnSn: state.admnSn,
                    menuCode: state.menuCode
                };
                await _editLoginLockRelease(params.admnSn, params.menuCode).then(result => {
                    if (result.data.code === 'OK') {
                        $Modal.alert({ message: '잠금해제 및 임시비밀번호발송 되었습니다.', buttonText: { ok: '확인' } }).then(v => {
                            getAdminDetail();
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

        const mdYnToggle = (e) => {
            console.log(formData.value.mdYn);
        };

        /**
         * @check setInputNumber
         */
        const setInputNumber = (event) => {
            const target = event.target.getAttribute('data-target');
            formData.value[target] = event.target.value;
            console.log(event.target.getAttribute('data-target'), formData.value[target]);

            validationForm.value.admnHhpno = null;
        };

        return {
            formData,
            dayJS,
            state,
            validationForm,
            saveAdmin,
            goToPage,
            mdYnToggle,
            changeMskgnRlsYn,
            menuInfo,
            onChangeAuthEdit,
            onChangeAuthDel,
            setInputNumber
        };
    }
};

</script>