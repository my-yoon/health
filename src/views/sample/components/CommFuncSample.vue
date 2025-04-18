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
&lt;template&gt;
    &lt;div&gt;
        &lt;button @click="goToPage('이동경로')"&gt;페이지이동&lt;/button&gt;
        &lt;button  @click="openModal('isDownShow')""&gt; 파일다운로드 사유 등록 팝업&lt;/button&gt;
        &lt;button  @click="fileDown('state.download')""&gt; 파일다운로드 &lt;/button&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import { ref } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
export default {
    setup() {
        const state = reactive({
            // 사유등록 내용
            download: { pass: '', reason: '' }
        })
        const { 
            // 페이지 이동
            goToPage, 
            //테이블 파일로 다운로드
            fileDown, 
            //공통팝업 함수 
            openModal, 
            //공통팝업 사용 데이터 
            isPartnerShow, 
            isDownShow, 
            isImgShow,
            isRequestShow 
        } = useCommFunc();
        return {
            goToPage,
            fileDown,
            isDownShow,
            isPartnerShow,
            isImgShow,
            openModal
        }
    }
}
&lt;/script&gt;`
        });
        return {
            state
        };
    }
};
</script>
