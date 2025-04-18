<template>
    <!-- 리스트 페이징 처리 -->
    <select :class="$props.class ?? 'custom-select sm'" :value="modelValue" @change="$emit('update:model-value',$event.target.value)">
        <option v-for="(item, index) in $props.list" :key="index" :selected=" index === 0? true:item.selected"
                :value="item.value">
            {{ item.label }}
        </option>
    </select>
</template>
<script>

export default {
    props: ['modelValue', 'list', 'class'],
    emits: ['update:model-value']
};
</script>