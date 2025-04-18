<script setup>
    import { ref } from 'vue';

    const props = defineProps(['params']);
    const data = ref(props.params.api.getDisplayedRowAtIndex(props.params.rowIndex).data);
    const isShow = ref(data.value.state == 'E');

</script>
<template >
    <div v-show="isShow" class="custom-tooltip" style="background-color: pink;">
      <p><span>{{ data.stateMessage }}</span></p>
    </div>
</template>