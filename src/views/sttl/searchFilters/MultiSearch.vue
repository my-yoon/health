<template>
    <div class="item">
        <label>상세검색</label>
        <span class="input">
            <span class="dv">
                <select class="custom-select sm" v-model="searchType">
                    <option value="">전체</option>
                    <option value="odrId">주문ID</option>
                    <option value="slipNo">전표번호</option>
                </select>
            </span>
            <span class="dv">
                <input type="text" class="form-control sm" placeHolder="검색어" v-model="searchText" />
            </span>
        </span>
    </div>
</template>
<script setup>
const searchText = defineModel({required: true, default: ''});
const searchType = defineModel('searchType', {required: true, default: ''});


</script>
<style></style>