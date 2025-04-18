<template>
    <!-- <template v-if="state.params.data.issStCdNm =='발급실패'">
        발급실패<button class="btn btn-slm" @click="intableBtn">재발급</button>
    </template>
    <template v-else> -->
        <span>{{ state.params.data.issStCdNm }}</span>
    <!-- </template> -->
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
            //송신
            emitter.$emit('bus_ReIssTableBtn', state.params);
            //수신 emitter.$on('bus_codeListDetail', tableBtnControl);
            // console.log('ReIssTableBtn state.params: ', state.params);
        };
        return {
            intableBtn,
            state
        };
    }
};
</script>