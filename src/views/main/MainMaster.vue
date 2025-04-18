<template>
    <div>
        <!-- {{ state.accountInfo.admnEmad }} -->
        <!-- {{ formData }} -->
        <div class="ui-section">
            <subTitleBar :subTitle="'계정 정보'" />
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
                                <th scope="row">아이디
                                    <!-- <ToolTip :tooltipName="'카테고리안내'" :tooltipCon="'카테고리안내<Br>카테고리안내'" /> -->
                                </th>
                                <td> {{ formData.admnId }}</td>
                                <th scope="row">이름</th>
                                <td>
                                    <input type="text" class="form-control" v-model="formData.admnNm"
                                        :disabled="!(state.accountInfo.admnLvlId === 'A00')" />
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">부서명</th>
                                <td colspan="3">

                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="formData.admnDepNm"
                                                :disabled="!(state.accountInfo.admnLvlId === 'A00')">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">이메일</th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: !_.isEmpty(state._accountInfo) && state.mailType1 == '' }]"
                                                v-model="state.mailType1"
                                                :disabled="state.accountInfo.admnLvlId !== 'A00' || state.mailConfirm"
                                                @change="mailChange">
                                        </div>
                                        <span class="ui-coupler">@</span>
                                        <commselect :selectType="'searchCode.mailType2'" @changedValue="selectedOptions"
                                            :initData="state.mailType2" ref="mailType"
                                            :disabled="state.accountInfo.admnLvlId !== 'A00' || state.mailConfirm" />
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm" @click="actionBtns('mailrequest')"
                                                :disabled="state.mailType1 == '' || (state._accountInfo.admnEmad?.split('@')[0] == state.mailType1)">
                                                이메일 인증
                                            </button>
                                        </div>

                                    </div>
                                    <div v-if="!_.isEmpty(state._accountInfo) && state.mailType1 == ''">
                                        <p class="input-guide error">
                                            변경할 메일 주소를 입력해 주세요
                                        </p>
                                    </div>
                                    <div class="reg-group" v-if="state.mailConfirm">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" placeholder="인증번호 입력"
                                                v-model="state.mailConfirmNum" :disabled="state.mailConfirmDone">
                                        </div>
                                        <div class="reg-item">

                                            <button type="button" class="btn btn-slm" @click="confirmEmail"
                                                :disabled="!state.mailConfirmNum.length > 0 || state.mailConfirmDone">확인</button>
                                            <span class="input-guide inline">
                                                <template v-if="state.mailConfirmDone">
                                                    인증 완료
                                                </template>
                                                <template v-else>
                                                    인증유효시간
                                                    <strong>{{ formattedTime }}</strong>
                                                </template>
                                            </span>
                                        </div>
                                    </div>
                                </td>

                            </tr>
                            <tr>
                                <th scope="row">휴대폰번호</th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input :value="formData.admnHhpnoFno"
                                                :disabled="!(state.accountInfo.admnLvlId === 'A00')" class="form-control"
                                                data-target="admnHhpnoFno" maxlength="3" type="text"
                                                @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <!-- <input type="text" class="form-control" v-model="formData.admnHhpnoMno"
                                                :disabled="!(state.accountInfo.admnLvlId === 'A00')"> -->
                                            <input :value="formData.admnHhpnoMno"
                                                :disabled="!(state.accountInfo.admnLvlId === 'A00')" class="form-control"
                                                data-target="admnHhpnoMno" maxlength="4" type="text"
                                                @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <!-- <input type="text" class="form-control" v-model="formData.admnHhpnoBno"
                                                :disabled="!(state.accountInfo.admnLvlId === 'A00')"> -->
                                            <input :value="formData.admnHhpnoBno"
                                                :disabled="!(state.accountInfo.admnLvlId === 'A00')" class="form-control"
                                                data-target="admnHhpnoBno" maxlength="4" type="text"
                                                @input="setInputNumber">
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
            <subTitleBar :subTitle="'권한 정보'" />
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
                                <th scope="row">채널</th>
                                <td>{{ state.accountInfo.admnLvlEngNm }}</td>
                                <th scope="row">권한그룹</th>
                                <td>{{ state.accountInfo.admnLvl }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section" v-if="!(state.accountInfo.admnLvlId === 'A00')">
            <subTitleBar :subTitle="'소속 정보'" />
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
                                <td colspan="3">{{ state.accountInfo.ntprNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">관리자 이름</th>
                                <td>이순신</td>
                                <th scope="row">관리자 휴대폰번호</th>
                                <td>010-2233-2233</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'이력 정보'" />
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
                                <th scope="row">최종 로그인 일시</th>
                                <td colspan="3">
                                    {{ dayJS(state.accountInfo.admnLtlyLgnDt).format('YYYY-MM-DD HH:mm:ss') }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl posi" @click="actionBtns('save')">저장</button>
        </div>
    </div>
</template>
<script>
import { reactive, inject, onMounted, ref, computed, watchEffect, onBeforeMount, watch, nextTick } from 'vue';
import { _getAccountDetail, _modifyAccountDetail, _confirmEmail, _requestEmail, _getCheckEmail } from '@/api/user.js';
import { useRouter, useRoute } from 'vue-router';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        const userInfo = computed(() => store.state.authModule);
        const route = useRoute();
        const dayJS = inject('dayJS');
        const $Modal = inject('$Modal');
        const mailType = ref(null);
        const countdownSeconds = ref(120);
        const formattedTime = computed(() => formatTime(countdownSeconds.value));
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
        const state = reactive({
            accountInfo: {},
            _accountInfo: {},
            mailType1: '',
            mailType2: '',
            mailType2Name: '', // name (email)
            mailConfirm: false,
            mailConfirmDone: false,
            mailConfirmNum: ''
        });

        const formData = ref({
            updUsrSn: '',
            admnSn: '',
            admnNm: '',
            admnDepNm: '',
            admnEmad: computed(() => state.mailType2 === '직접입력' ? `${state.mailType1}` : `${state.mailType1}@${state.mailType2Name}`), //이메일주소,
            admnHhpnoFno: '',
            admnHhpnoMno: '',
            admnHhpnoBno: '',
            ntprSn: 0,
            bcoNm: '',
            indtpNm: '',
            rprsTlnoFno: '',
            rprsTlnoMno: '',
            rprsTlnoBno: '',
            faxFno: '',
            faxMno: '',
            faxBno: '',
            zc: '',
            adr: '',
            adrCts: '',
            bkcd: '',
            acno: '',
            accountNm: '',
            tgtrHmexmUseCoSeCd: '',
            tgtrHmexmUseCoCd: ''
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
            nextTick(() => {
                // console.log(userInfo.value.userInfomation.admnSn);
                getAccountDetail(userInfo.value.userInfomation.admnSn);
            });
        });
        const selectedOptions = (valueCode, valueName, type) => {
            console.log(type);
            if (type === 'rprsTlnoFno' || type === 'mailType2') {
                if (type === 'mailType2') {
                    console.log(valueCode);
                    state.mailType1 = '';
                    state.mailType2 = valueCode;
                    state.mailType2Name = valueName;
                } else {
                    formData[type] = valueName;
                }
            } else if (type === 'mailType1') {
                console.log();
            } else {
                formData[type] = valueCode;
            }
            console.log(valueCode, valueName, type);
        };
        const mailChange = () => {
            formData.value.admnEmad = state.mailType2Name === '직접입력' ? `${state.mailType1}` : `${state.mailType1}@${state.mailType2Name}`;
        };

        const getAccountDetail = async (params) => {
            try {
                // state._accountInfo = null;
                const response = await _getAccountDetail(params);
                console.log(response.data.data);
                state.accountInfo = response.data.data;
                state._accountInfo = _.clone(response.data.data);
                formData.value = response.data.data;
                console.log(formData.value.admnEmad);
                valueCheck();
                console.log();
            } catch (error) {
                console.log(error);
            }
        };
        const modifyAccountDetail = async () => {
            try {
                let params = {
                    admnSn: formData.value.admnSn,
                    admnNm: formData.value.admnNm,
                    admnDepNm: formData.value.admnDepNm,
                    admnEmad: state.mailType2Name === '직접입력' ? `${state.mailType1}` : `${state.mailType1}@${state.mailType2Name}`,
                    admnHhpnoFno: formData.value.admnHhpnoFno,
                    admnHhpnoMno: formData.value.admnHhpnoMno,
                    admnHhpnoBno: formData.value.admnHhpnoBno
                };
                console.log(formData.value, params);
                const response = await _modifyAccountDetail(params);
                if (response.data.code === 'OK') {
                    await goToPage('/main');
                }
            } catch (error) {
                console.log(error);
            }
        };
        const startCoutdown = () => {
            const countdownInterval = setInterval(() => {
                if (countdownSeconds.value > 0) {
                    countdownSeconds.value--;
                } else {
                    clearInterval(countdownInterval);
                    if (!state.mailConfirmDone) {
                        delayOut();
                    }

                }
            }, 1000);
            onBeforeMount(() => {
                clearInterval(countdownInterval);
            });
        };
        const delayOut = () => {
            $Modal.simple({
                title: '',
                message: '이메일 주소를 다시 입력해 주세요',
                buttonText: {
                    ok: '확인'
                }
            })
                .then(success => {
                    console.log(success);
                    state.mailConfirm = false;
                    state.mailConfirmDone = false;
                    state.mailConfirmNum = '';
                })
                .catch(error => {
                    console.log(error);
                });
        };
        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        };
        //이메일 요청 kbhc.dslim
        const requestEmail = async () => {
            try {
                let params = {
                    admnEmad: formData.value.admnEmad
                };
                console.log(params);
                const response = await _requestEmail(params);
                if (response.data.code === 'OK') {
                    state.mailConfirm = true;
                    await startCoutdown();
                } else {
                    $Modal.simple({
                        title: '',
                        message: response.data.message,
                        buttonText: {
                            ok: '확인'
                        }
                    });
                }

            } catch (error) {
                console.log(error);
            }
        };
        //이메일 인증
        const confirmEmail = async () => {
            try {
                let params = {
                    crtfKeyVl: state.mailConfirmNum
                };
                const response = await _confirmEmail(params);
                if (response.data.code === 'OK') {
                    $Modal.simple({
                        title: '',
                        message: '인증번호가 확인되었습니다.',
                        buttonText: {
                            ok: '확인'
                        }
                    })
                        .then(async (success) => {
                            console.log(success);
                            console.log('이메일인증확인', response);
                            state.mailConfirmDone = true;
                            countdownSeconds.value = 0;

                        })
                        .catch(error => {
                            console.log(error);
                        });
                }

            } catch (error) {
                console.log(error);
            }
        };
        // 이메일 검증
        const getCheckEmail = async () => {
            try {
                let params = {
                    admnEmad: state.accountInfo.admnEmad
                };
                const isEqual = _.isEqual(formData.value, state._accountInfo);
                console.log(isEqual, params);
                // return false;
                const response = await _getCheckEmail(params);
                //이메일 체크 후 변경된 내용이 없으면 메인으로 이동
                if (response.data.data === 'Y') {
                    console.log('111');
                    if (!isEqual) {
                        await modifyAccountDetail();
                    } else {
                        goToPage('/main');
                    }
                }

            } catch (error) {
                console.log(error);
            }
        };
        const actionBtns = async (type) => {
            console.log(type);
            let msg = '';
            const isEqual = _.isEqual(formData.value, state._accountInfo);
            console.log(isEqual, formData.value.admnEmad, state._accountInfo);
            if (isEqual) {
                msg = '변경된 내용이 없습니다.';
            }
            if (!isEqual) {
                if ((state._accountInfo.admnEmad?.split('@')[0] !== state.mailType1) && !state.mailConfirmDone) {
                    msg = '인증이 필요합니다.';
                } else {
                    msg = '변경한 계정정보가 저장 되었습니다.';
                }
            }
            if (type === 'mailrequest') {
                msg = '등록된 이메일로 인증번호를 전송합니다.';
            }

            $Modal.confirm({
                title: '',
                message: msg,
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            })
                .then(async (success) => {
                    if (isEqual && type === 'save') {
                        //await getCheckEmail();
                        console.log('변경된 내용없음');
                        goToPage('/main');
                    }
                    if (!isEqual && type === 'save') {
                        if ((state._accountInfo.admnEmad?.split('@')[0] !== state.mailType1) && !state.mailConfirmDone) {
                            console.log('인증중');
                        } else {
                            await getCheckEmail();
                        }
                    }
                    if (type === 'mailrequest') {
                        await requestEmail();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };
        //형식에 맞게 쪼개기
        const valueCheck = () => {
            //이메일 cmnCdNm
            let mail = state.accountInfo.admnEmad.split('@')[0];
            let mailD = state.accountInfo.admnEmad.split('@')[1];
            let mailDomain = null;

            mailDomain = mailType.value.state.selectComm.filter(item => mailD === item.cmnCdNm);
            console.log(mailDomain);
            if (mailDomain.length > 0) {
                state.mailType2 = mailType.value.state.selectOption = mailDomain[0].cmnCd;
                state.mailType2Name = mailType.value.state.selectOption = mailDomain[0].cmnCdNm;
                state.mailType1 = state.accountInfo.admnEmad.split('@')[0];
            } else {
                state.mailType2 = mailType.value.state.selectOption = '103014';
                state.mailType1 = state.accountInfo.admnEmad.split('@')[0] + '@' + state.accountInfo.admnEmad.split('@')[1];
            }
            console.log(mailType.value);
        };

        /**
         * @check setInputNumber
         */
        const setInputNumber = (event) => {
            const target = event.target.getAttribute('data-target');
            formData.value[target] = event.target.value;
            console.log(event.target.getAttribute('data-target'), formData.value[target]);

        };

        return {
            _,
            dayJS,
            $Modal,
            goToPage,
            state,
            formData,
            mailType,
            userInfo,
            selectedOptions,
            actionBtns,
            mailChange,
            formattedTime,
            startCoutdown,
            confirmEmail,
            setInputNumber
        };
    }
};
</script>