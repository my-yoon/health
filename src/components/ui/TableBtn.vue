<template>
    <button class="btn btn-slm" @click="intableBtn">상세</button>
</template>
<script>
import { reactive, computed } from 'vue';
export default {
    props: ['params'],
    setup(props) {
        const state = reactive({
            params: computed(() => props.params)
        });
        const intableBtn = (e) => {
            emitter.$emit('bus_codeListDetail', state.params);
        };
        return {
            intableBtn,
            state
        };
    }
};
</script>