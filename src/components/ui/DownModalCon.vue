<template>
    <div>
        <div class="ui-grid-top-guide mt-16">
            <p>파일 조회시 등록한 비밀번호를 입력하여 조회할 수 있습니다.<br>개인정보를 다운로드 하는 경우 사유 확인이 필요합니다.
            </p>
        </div>
        <div class="ui-grid-top-guide mt-10 t-right"><span class="ess"></span> 표시는 필수항목입니다.</div>
        <div class="tbl-wrap">
            <table class="table reg">
                <colgroup>
                    <col style="width: 120px;">
                    <col style="width: auto;">
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row">다운로드 날짜 <span class="ess"></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    {{ dayJS().format('YYYY-MM-DD') }}
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">요청자 <span class="ess"></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    {{ state.adminfo.admnNm }}
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">비밀번호 <span class="ess"></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <input type="password" class="form-control" v-model="state.down.downPass"
                                        @change="downloadConfirm('pass', state.down.downPass)"
                                        :class="checkValidState('downPass') ? 'error' : ''">
                                </div>
                            </div>
                            <div v-if="checkValidState('downPass')">
                                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                    {{ state.validState.message }}
                                </p>
                            </div>
                            <span class="input-guide" v-if="!checkValidState('downPass')">
                                영문, 숫자, 특수문자 포함 8~16자리로 입력해 주세요.
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">다운로드 사유 <span class="ess"></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <textarea id="textarea" class="form-control" v-model="state.down.downReason"
                                        @change="downloadConfirm('downReason', state.down.downReason)"
                                        :class="checkValidState('downReason') ? 'error' : ''">
                                    </textarea>
                                </div>
                            </div>

                            <div v-if="checkValidState('downReason')">
                                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                    {{ state.validState.message }}
                                </p>
                            </div>

                            <span class="input-guide" v-if="!checkValidState('downReason')">
                                다운로드사유를 10자 이상 등록해 주세요
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="flex align-center space-between">
            <div class="ui-grid-top-guide mt-16 flex1">
                <p>다운로드한 개인정보를 처리목적 달성 후 파기하며, 안전하게 관리하지 않아 발생하는 책임은 담당자에게 있음을 동의합니다.</p>
            </div>
            <div>
                <span class="checkbox">
                    <input id="columagree1" name="columagreeGroup" type="checkbox" value="동의" v-model="state.agree"
                        @change="onChangeAgree(state.agree)">
                    <label for="columagree1">동의</label>
                </span>
            </div>
        </div>

    </div>
</template>
<style scoped>
.reg-item #textarea {
    height: 100px
}
</style>
<script>
import { getCurrentInstance, reactive, inject, watch, computed } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';

export default {
    emits: ['downloadFormat', 'onChangeAgree'],
    props: ['adminfo'],

    setup(props) {
        const { emit } = getCurrentInstance();
        const dayJS = inject('dayJS');
        const { goToPage, validPassword } = useCommFunc();
        const state = reactive({
            adminfo: computed(() => props.adminfo),
            down: {
                downPass: '',
                downReason: ''

            },
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            },
            agree: false

        });
        const resetState = () => {
            state.isCheckTermsName = false; // 중복확인
            state.validState.errState = false; // validation
            state.validState.message = '';
        };
        watch(state.down, () => {
            resetState();
        });
        const downloadConfirm = (type, con) => {
            console.log(type, con);
            emit('downloadFormat', type, con);
        };
        const onChangeAgree = (params) => {
            emit('onChangeAgree', params);
        };
        // 에러체크
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };
        // @validate
        const validCheck = () => {
            let target = ['downPass', 'downReason'];
            for (const item of target) {
                console.log(item);
                state.validState.target = item;
                state.validState.message = (item === 'downPass') ? '비밀번호를 형식에 맞게 입력하세요' : '다운로드사유를 10자 이상 등록해 주세요';
                if (item == 'downReason') {
                    state.validState.errState = true;
                    break;
                }
                if (item == 'downPass') {
                    if (!validPassword(state.down[item]) || !state.down[item]) {
                        state.validState.errState = true;
                        break;
                    }
                }
            }
            return !state.validState.errState;
        };
        return {
            dayJS,
            state,
            validPassword,
            downloadConfirm,
            checkValidState,
            validCheck,
            onChangeAgree
        };
    }

};

</script>