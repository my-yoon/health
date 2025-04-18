<template>
    <div class="head-content">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <span>홈</span>
            </li>
            <li class="breadcrumb-item" v-for="(location, index) in state.locations" :key="index">
                <span>
                    {{ location }}
                </span>
            </li>
        </ol>
        {{ }}
        <div class="ui-title-2">
            <h2>{{ state.pageTitle }}</h2>
            <button class="admin-new-window" @click="contentNew(state.routerInfo.path)">
                <span class="offscreen">새창열기</span>
            </button>
        </div>
    </div>
</template>
<script>
import { reactive, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
    props: ['pageMeta', 'routerInfo'],
    setup(props) {
        const router = useRouter();
        const route = useRoute();

        const state = reactive({
            pageTitle: computed(() => props.pageMeta[(state.locations.length - 1)]),
            locations: computed(() => props.pageMeta),
            routerInfo: computed(() => props.routerInfo)
        });
        watch(route, () => {
            console.log(route);

        });
        const contentNew = (params) => {
            let width = window.screen.availWidth + 150;
            console.log(width);
            window.open(`${params}_new`, '_blank', `width=${width}`);
        };


        return {
            state,
            contentNew
        };
    }
};

</script>