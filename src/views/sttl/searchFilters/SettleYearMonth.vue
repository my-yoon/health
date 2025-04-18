<template>
    <div class="item">
       <label><slot>정산년월</slot></label>
       <span class="input">
            <DatePicker
                locale="ko"
                v-model="model"
                :format="'yyyyMM'"
                position="right"
                placeholder="년월선택"
                hide-input-icon
                auto-apply
                month-picker
                arrow-navigation
            />
       </span>
   </div>
</template>
<script setup>
const model = defineModel({required: true, default: ''});

</script>
<style></style>