<template>
    <div class="ui-no-date">
        <p>{{ state.nodatatext }}</p>
    </div>
</template>
<script>
import { reactive, computed } from 'vue';
export default {
    props: ['nodatatext'],
    setup(props) {
        const state = reactive({
            nodatatext: computed(() => props.nodatatext)
        });
        return {
            state
        };
    }
};
</script>