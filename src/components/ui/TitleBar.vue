<template>
    <div class="ui-title-3">
        <h3>{{ state.subTitle }}</h3>
        <div class="abs" v-if="ess">
            <span class="ess"></span>{{ state.ess }}
        </div>
        <div class="abs">
            <slot name="btn" />
        </div>


    </div>
</template>
<script>
import { reactive, computed } from 'vue';
export default {
    props: ['subTitle', 'ess'],
    setup(props) {
        const state = reactive({
            subTitle: computed(() => props.subTitle),
            ess: computed(() => props.ess)
        });
        return {
            state
        };
    }
};
</script>