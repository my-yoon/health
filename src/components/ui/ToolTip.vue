<template>
    <div class="ui-tooltip"  ref="toolTip" style="">
        <button type="button" class="ui-tooltip-ico" @click="getPosition" :id="state.tooltipName">
            <span class="offscreen">{{ state.tooltipName }}</span>
        </button>
        <div class="ui-tooltip-info" :style="`top: ${state.topPo}px; left: ${state.leftPo}px; position:absolute`"
            v-if="state.toolTipShow">
            <p v-html="state.tooltipCon"></p>
        </div>
    </div>
</template>
<script>
import { reactive, computed, ref } from 'vue';
export default {
    props: ['tooltipName', 'tooltipCon', 'leftPo', 'topPo'],
    setup(props) {
        const toolTip = ref(null);
        const state = reactive({
            tooltipName: computed(() => props.tooltipName),
            tooltipCon: computed(() => props.tooltipCon),
            // leftPo: computed(() => props.leftPo),
            // topPo: computed(() => props.topPo),
            leftPo: null,
            topPo: null,
            toolTipShow: false
        });
        const getPosition = () => {
            state.leftPo = document.getElementById(state.tooltipName).offsetLeft + 10;
            state.topPo = document.getElementById(state.tooltipName).offsetTop + 12;
            state.toolTipShow = !state.toolTipShow;
        };
        return {
            state,
            toolTip,
            getPosition
        };
    }
};
</script>