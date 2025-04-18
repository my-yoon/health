<template>
    <tr>
        <th scope="row">마케팅 정보 PUSH <br>수신동의
            <span class="ess"><span class="offscreen">필수입력</span></span>
        </th>
        <td colspan="3">
            <div class="reg-group">
                <div class="reg-item">
                    <span class="checkbox">
                        <input id="push" name="pushGroup" type="checkbox" v-model="state.infAgrmYnCpm"
                            @change="onChagePush(state.infAgrmYnCpm)">
                        <label for="push">필수</label>
                    </span>
                    <span class="input-guide inline">"필수" 선택 시 마케팅 정보(PUSH) 수신에 동의한 회원만 이벤트 참여가
                        가능합니다.</span>
                </div>
            </div>
        </td>
    </tr>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
export default {
    props: ['agreeValue'],
    emits: ['onChagePush'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const state = reactive({
            infAgrmYnCpm: false,
            agreeValue: computed(() => props.agreeValue)
        });
        const onChagePush = (value) => {
            console.log(value);
            emit('onChagePush', 'infAgrmYnCpm', value);
        };
        watch(() => {
            if (props.agreeValue) {
                state.agreeValue === 'Y' ? state.infAgrmYnCpm = true : state.infAgrmYnCpm = false;
            }
        });
        return {
            state,
            onChagePush
        };
    }
};
</script>