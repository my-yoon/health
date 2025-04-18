<template>
   <div class="item">
        <label>상품검색</label>
        <span class="input">
            <span class="dv">
                <input type="text" class="form-control sm" v-model="prdId" placeholder="상품ID">
            </span>
            <span class="dv">
                <input type="text" class="form-control sm" v-model="prdNm" placeholder="상품명">
            </span>
        </span>
    </div>
</template>

<script setup>
const props = defineProps({
    dateTitle: String
});

const prdId = defineModel('prdId');
const prdNm = defineModel('prdNm');

</script>
