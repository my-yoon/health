<template>
     <div class="item">
        <label>주문번호</label>
        <span class="input">
            <span class="dv">
                <input type="text" class="form-control sm" v-model="model" placeholder="주문번호">
            </span>
        </span>
    </div>
</template>
<script setup>
const model = defineModel({required: true, default: ''});
</script>


