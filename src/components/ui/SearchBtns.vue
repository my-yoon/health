<template>
    <div class="btn-filter-set">
        <button type="button" class="btn btn-sm" @click="onChangeSearch('reload')">
            <span class="ico-search"></span>조회
        </button>
        <button type="button" class="btn btn-sm" @click="onChangeSearch('init')">
            <span class="ico-reload sg"></span>
            <span class="offscreen">리로드</span>
        </button>
        <button type="button" class="btn btn-sm" @click="onChangeSearch('openMore')" v-if="state.moreBtns">
            <span class="txt">상세검색 열기</span>
        </button>
    </div>
</template>
<script>
import { reactive, computed, getCurrentInstance } from 'vue';
export default {
    props: ['moreBtns'],
    emits: ['onChangeSearchBtns'],

    setup(props) {
        const { emit } = getCurrentInstance();
        const state = reactive({
            moreBtns: computed(() => props.moreBtns)
        });
        const onChangeSearch = (type) => {
            emit('onChangeSearchBtns', type);
        };
        return {
            onChangeSearch,
            state
        };
    }
};
</script>