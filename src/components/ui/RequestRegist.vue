<template>
    <div>
        <div class="ui-grid-top-guide mt-10 t-right"><span class="ess"></span> 표시는 필수항목입니다.</div>
        <div class="tbl-wrap">
            <table class="table reg">
                <colgroup>
                    <col style="width: 120px;">
                    <col style="width: auto;">
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row">사유 선택 <span class="ess"></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <commselect :initData="state.reJoincode" :selectType="'searchCode.reJoinCD'"
                                        @changedValue="selectedOptions" />

                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">요청사유 설명 <span class="ess"></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <textarea id="textarea"
                                        :class="['form-control', { error: checkValidState('reJointext') }]"
                                        placeholder="법인계좌 정보가 불일치 하여 가입 재신청을 요청합니다."
                                        @change="requestConfirm('text', state.reJointext)" v-model="state.reJointext">
                                    </textarea>
                                </div>
                            </div>
                            <div v-if="checkValidState('reJointext')">
                                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                    {{ state.validState.message }}
                                </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style scoped>
.reg-item #textarea {
    height: 100px;
    text-align: left;
}
</style>
<script>
import { getCurrentInstance, reactive, watch } from 'vue';
export default {
    emits: ['requestFormat'],
    props: ['validState'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const state = reactive({
            reJoincode: '160001',
            reJointext: '',
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            }
        });
        watch(() => state.reJointext, () => {
            if (state.reJointext !== '') {
                resetState();
            }
        });
        const resetState = () => {
            state.validState.errState = false; // validation
            state.validState.message = '';
        };

        const requestConfirm = (type, con) => {
            console.log(type, con);
            emit('requestFormat', type, con);
        };
        //셀렉트박스 선택
        const selectedOptions = (value) => {
            console.log(value);
            state.reJoincode = value;
            requestConfirm('code', value);
        };
        // 에러체크
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };
        // @validate
        const validCheck = () => {
            let target = ['reJointext'];
            for (const item of target) {
                state.validState.target = item;
                state.validState.message = '요청사유를 입력하세요';
                if (!state[item]) {
                    state.validState.errState = true;
                    break;
                }
            }
            return !state.validState.errState;
        };
        return {
            state,
            requestConfirm,
            selectedOptions,
            checkValidState,
            validCheck
        };
    }

};

</script>