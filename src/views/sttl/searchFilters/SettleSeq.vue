<template>
    <div class="item">
        <label><slot>정산회차</slot></label>
        <span class="input">
            <span class="dv">
                <input type="number" class="form-control" min="1" max="9" step="1" @focus="onFocus"
                                                v-model="model" required @input="onInput"/>
            </span>
        </span>
    </div>
</template>
<script setup>
const model = defineModel({required: true, default: 1});
const onInput = () => {
    if (model.value && model.value.toString().length > 1) {
        model.value = Number(model.value.toString().slice(0, 1));
    }
};
</script>
