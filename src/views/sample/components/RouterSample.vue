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
const 1depth메뉴명 = [
    {
        path: '/',
        name: 'layout',
        component: () => import('@/layout/index.vue'),
        children: [
            {
                path: '경로',
                name: '파일명과 동일',
                component: () => import('페이지 컴포넌트.vue'),
                meta: {
                    unauthorized: true,
                    sublocation_depth: ['1depth메뉴명', '2depth메뉴명', '3depth메뉴명'],
                    menuCode: '해당 메뉴 코드 작성'
                }
            },
        ]
    }
];
export default 1depth메뉴명;`
        });
        return {
            state
        };
    }
};
</script>
