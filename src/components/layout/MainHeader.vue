<template>
    <header id="adminHeader">
        <h1>

            <span class="s-name">
                <strong class="s-badge">KB헬스케어</strong>어드민 maf-master-admin-web
                <!-- <strong class="s-badge partner">파트너</strong>어드민 -->
            </span>

        </h1>
        <ul class="util">
            <li>
                <a href="#" class="pw" @click="showModal">비밀번호 변경</a>
            </li>
            <!-- <li>
                <a href="#" class="pw" @click="modalOpen">로그인 연장</a>
            </li> -->
            <li @click="goToPage('/account/manage')">
                <a class="user">{{ state.userInfomation.admnNm }}</a>
            </li>
            <li>
                <a href="#" class="session" @click="resetCounter">세션만료 남은시간 <span>{{ counter.hour }}:{{ counter.min }}:{{ counter.sec }}</span></a>
            </li>
            <li>
                <a href="#" class="logout" @click="signOut">로그아웃</a>
            </li>
        </ul>

        <!-- 로그인 연장 팝업 -->
        <DefaultModal :isShow="isShowlogin" :modalTitle="'오케어'" :buttonConfirm="'로그인 연장'" :buttonCancel="'로그아웃'"
            class="ui-modal login" @modalclose="modalControlLogin">
            <template #modalcontent>
                <div class="ui-modal-body">
                    <div class="ui-title-2">
                        <h2>로그인 잠김</h2>
                    </div>
                    <div class="ui-logout-time">
                        <h3>로그아웃까지 남은 시간</h3>
                        <div class="timer">
                            <strong class="fc-2"><span>{{ counter.sec }}</span>초</strong>
                        </div>
                        <p>잠시 후 자동으로 로그아웃 될 예정입니다.<br>계속 이용 하시려면 로그인 시간을 연장해 주세요.</p>
                    </div>
                </div>
            </template>
        </DefaultModal>
        <!-- 비밀번호 90일변경 -->
        <DefaultModal :isShow="ispassShow" :modalTitle="'오케어'" :buttonConfirm="state.buttonConfirm"
            :modalName="'ispassShow'" :buttonCancel="state.buttonCancel" class="ui-modal login" :btntype="'full'"
            @modalclose="modalControl">
            <template #modalcontent>
                <!-- 비밀번호 변경안내 -->
                <div>
                    <div class="ui-modal-body">
                        <div class="ui-title-2">
                            <h2>비밀번호 변경 안내</h2>
                        </div>
                        <div class="ui-login-message">
                            <p>비밀번호를 변경한 지 <strong class="fc-2">90일이</strong> 경과했습니다.<br>새로운 비밀번호를 변경하시겠습니까?</p>
                        </div>
                    </div>
                </div>
            </template>
        </DefaultModal>
        <!-- 비밀번호 변경 -->
        <DefaultModal :isShow="isShow" :modalTitle="'오케어'" :buttonConfirm="state.buttonConfirm"
            :buttonCancel="state.buttonCancel" class="ui-modal login" :btntype="'full'" @modalclose="modalControl"
            :modalName="'isShow'">
            <template #modalcontent>

                <!-- 비밀번호 변경폼 -->
                <div v-if="state.changePass">
                    <div class="ui-modal-body">
                        <div class="ui-title-2 flex-column align-start">
                            <h2>비밀번호 변경</h2>
                            <p>새로운 비밀번호를 설정해주세요.</p>
                        </div>
                        <div class="ui-login-form-content">
                            <div class="ui-login-form-item">
                                <label for="userIsPw">현재 비밀번호</label>
                                <div class="reg-group">
                                    <div class="reg-item wp-100">
                                        <input type="password" id="userIsPw" class="form-control"
                                            placeholder="현재 비밀번호를 입력하세요." v-model="formData.nowPassword">
                                    </div>
                                </div>
                            </div>
                            <div class="ui-login-form-item">
                                <label for="userNewPw">신규 비밀번호</label>
                                <div class="reg-group">
                                    <div class="reg-item wp-100">
                                        <input type="password" id="userNewPw"
                                            :class="['form-control', { 'error': !validPassword(formData.newPassword) && formData.newPassword !== '' }]"
                                            placeholder="신규 비밀번호를 입력하세요." v-model="formData.newPassword">
                                    </div>
                                </div>
                                <span v-if="!validPassword(formData.newPassword) && formData.newPassword !== ''"
                                    class="input-guide"
                                    :class="{ 'error': !validPassword(formData.newPassword) && formData.newPassword !== '' }">
                                    영문, 숫자, 특수기호가 포함된 8~16자리로 입력해주세요.
                                </span>
                            </div>
                            <div class="ui-login-form-item">
                                <label for="userNewPwChk">신규 비밀번호 확인</label>
                                <div class="reg-group">
                                    <div class="reg-item wp-100">
                                        <input type="password" id="userNewPwChk" class="form-control"
                                            placeholder="신규 비밀번호를 입력하세요." v-model="state.newPasswordConfirm">
                                    </div>
                                </div>
                                <span
                                    v-if="(formData.newPassword !== state.newPasswordConfirm) && state.newPasswordConfirm !== ''"
                                    class="input-guide"
                                    :class="{ 'error': (formData.newPassword !== state.newPasswordConfirm) && state.newPasswordConfirm !== '' }">
                                    비밀번호를 확인해주세요.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 비밀번호 변경 완료-->
                <div v-if="state.changepassDone">
                    <div class="ui-modal-body">
                        <div class="ui-title-2">
                            <h2>비밀번호 변경 안내</h2>
                        </div>
                        <div class="ui-login-message">
                            <p>비밀번호를 변경이 완료되었습니다.<br>새로운 비밀번호로 로그인하세요.</p>
                        </div>
                    </div>
                </div>
            </template>
        </DefaultModal>
    </header>
</template>

<script>
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { reactive, computed, nextTick, ref, inject, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useCommFunc } from '@/core/helper/common.js';
import { _changePassword } from '@/api/user';
export default {
    components: { DefaultModal },
    props: ['adminfo'],
    setup(props) {
        const store = useStore();
        const router = useRouter();
        const isShowlogin = ref(false);
        const ispassShow = ref(false);
        const dayJS = inject('dayJS');
        const $Modal = inject('$Modal');
        const isShow = ref(false);
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow, validPassword } = useCommFunc();
        const state = reactive({
            username: '',
            userpass: '',
            status: false,
            changePass: true,
            changepassDone: false,
            buttonConfirm: '비밀번호 변경',
            buttonCancel: '다음에 하기',
            userInfomation: computed(() => props.adminfo),
            setLoginInfo: {},
            newPasswordConfirm: ''
        });
        const formData = reactive({
            nowPassword: '',
            newPassword: ''
        });
        // const couter = ref(1800);
        const counter = reactive({
            interval: null,
            count: 1800000, // milliseconds
            hour: computed(() => String(Math.floor(counter.count / 3600000)).padStart(2, '0')),
            min: computed(() => String(Math.floor((counter.count % 3600000) / 60000)).padStart(2, '0')),
            sec: computed(() => String(Math.floor((counter.count % 60000) / 1000)).padStart(2, '0'))
        });


        onMounted(() => {

            let lastpassChDay = new Date(state.userInfomation.admnPwdChgDt);
            let changePassDay = lastpassChDay.getTime() + 3600 * 1000 * 24 * 90;
            let toDay = new Date();
            if (toDay > changePassDay) {
                console.log(dayJS(changePassDay).format('YYYY-MM-DD'));
                ispassShow.value = true;
            }

            sessionCounter();


        });
        const goSignIn = () => {
            router.push('/sign-in');
        };
        const modalOpen = () => {
            isShowlogin.value = true;
        };
        const modalControlLogin = (type) => {
            console.log(type);
            isShowlogin.value = false;
            if (type === 'modalconfirm') { // 로그인 연장 confirm
                resetCounter();
            } else {
                signOut();
            }
        };
        const showModal = () => {
            isShow.value = true;
        };

        const changePassword = async () => {
            try {
                let prams = {
                    nowPassword: formData.nowPassword,
                    newPassword: formData.newPassword
                    // menuCode: formData.menuCode
                };
                const response = await _changePassword(prams);
                console.log(response);
                if (response.data.code === 'ERROR_CODE_AC001' || response.data.code === 'ERROR_CODE_AC002' || response.data.code === 'ERROR_CODE_AC003' || response.data.code === 'ERROR_CODE_AC004') {
                    isShow.value = false;
                    $Modal.simple({
                        title: '',
                        message: response.data.message,
                        buttonText: {
                            ok: '확인'
                        }
                    })
                        .then(async (success) => {
                            formData.nowPassword = '';
                            formData.newPassword = '';
                            state.newPasswordConfirm = '';
                            state.changePass = true;
                            state.buttonConfirm = '변경하기';
                            state.buttonCancel = '';
                            isShow.value = true;
                        })
                        .catch(error => {
                            console.log(error);
                        });

                }
                if (response.data.code === 'OK') {
                    state.changePass = false;
                    state.buttonConfirm = '로그인 페이지로 이동';
                    state.buttonCancel = '사이트 이용하기';
                    state.changepassDone = true;
                }


            } catch (error) {
                console.log(error);


            }
        };
        const modalControl = (type, name) => {
            console.log(type, name);
            if (type === 'modalclose') {
                isShow.value = false;
                ispassShow.value = false;
                state.buttonConfirm = '비밀번호 변경';
                state.buttonCancel = '다음에 하기';
                state.changePass = true;
                state.changepassDone = false;
            } else if (type === 'modalconfirm') {
                if (name === 'ispassShow') {
                    state.buttonConfirm = '변경하기';
                    ispassShow.value = false;
                    isShow.value = true;
                    state.changePass = true;
                }
                if (name === 'isShow' && state.changePass) {
                    if (validPassword(formData.newPassword) && formData.newPassword !== '' && formData.newPassword === state.newPasswordConfirm) {
                        changePassword();
                    }
                }
                if (name === 'isShow' && state.changepassDone && state.buttonConfirm === '로그인 페이지로 이동') {
                    isShow.value = false;
                    state.buttonConfirm = '비밀번호 변경';
                    state.buttonCancel = '다음에 하기';
                    state.changePass = true;
                    state.changepassDone = false;
                    formData.nowPassword = '';
                    formData.newPassword = '';
                    state.newPasswordConfirm = '';
                    window.open(`${import.meta.env.VITE_APP_KBADMIN_LOGIN_URL}/login`, '_blank');
                }
            } else {
                isShow.value = false;
                ispassShow.value = false;
                state.buttonConfirm = '비밀번호 변경';
                state.buttonCancel = '다음에 하기';
                state.changePass = true;
                state.changepassDone = false;
            }
        };

        const sessionCounter = () => {
            counter.interval = setInterval(() => {
                if (counter.count < 31000) { // 30초 count 30000 // test 1795000
                    console.log('clear');
                    modalOpen();
                    if (counter.count < 1) { // 0초 count : clear // test 1793000
                        clearInterval(counter.interval);
                        isShowlogin.value = false;

                        $Modal.confirm({
                            title: '',
                            message: `로그아웃 되었습니다. 다시 로그인해주세요.`,

                            buttonText: {
                                confirm: '확인'
                            }
                        })
                            .then(async (success) => {
                                window.location.href = `${import.meta.env.VITE_APP_KBADMIN_LOGIN_URL}/login`;
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                }
                counter.count -= 1000;
            }, 1000);
        };
        const resetCounter = () => {
            isShowlogin.value = false; // 로그인 연장 팝업 close
            counter.count = 1800000;
            clearInterval(counter.interval);
            sessionCounter();
        };

        const signOut = () => {
            console.log('logout');
            store.dispatch('authModule/logoutAction', { id: '', pass: '' });
            window.location.href = `${import.meta.env.VITE_APP_KBADMIN_LOGIN_URL}/login`;
        };

        return {
            state,
            formData,
            dayJS,
            isShow,
            isShowlogin,
            goSignIn,
            signOut,
            modalControl,
            modalControlLogin,
            modalOpen,
            showModal,
            goToPage,
            ispassShow,
            
            counter,
            resetCounter,
            validPassword
        };
    }
};
</script>