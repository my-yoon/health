<template>
    <div class="guides">
        <div class="sample">
            <pre class="language-javasciprt">
                <code class="language-javasciprt"  v-html="state.sampleCodeJS"  />
            </pre>
        </div>
    </div>
</template>
<script>

import { reactive } from 'vue';
export default {
    setup() {
        const state = reactive({
            sampleCodeJS: `
const content = [
    {
        path: '/',
        name: 'Popup',
        component: () => import('@/layout/Popup.vue'),
        children: [
            {
                path: '기존페이지url_new',
                name: '기존페이지name_new',
                component: () => import('페이지템플릿')
            }
        ]
    }
];
export default content;`
        });
        return {
            state
        };
    }
};
</script>
