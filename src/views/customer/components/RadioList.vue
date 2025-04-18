<template>
    <span v-for="(item, index) in $props.list" :key="index" class="radio">
        <input :id=" $props.name + index" v-model="$props.modelValue" :name="$props.name" :value="item.value"
               type="radio" @change="$emit('update:model-value',$event.target.value)">
        <label :for="$props.name + index">{{ item.label }}</label>
    </span>
</template>
<script>

export default {
    props: ['modelValue', 'list', 'name'],
    emits: ['update:model-value']
};
</script>