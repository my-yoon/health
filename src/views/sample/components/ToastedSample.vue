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

import { reactive} from 'vue';
export default {
    setup() {
        const state = reactive({
            sampleCodeJS: `
템플릿 내 사용 문법
toast('메세지', 토스트팝업 지속시간, 타입(성공:success, 실패:error, 기본:default)) ==> 토스트팝업  호출
toastClearAll() ==> 토스트팝업 즉시 삭제

함수 추가 
export default {
    setup() {
        ...
        return {
            toast.,
            toastClearAll
        }
    }
}`
        });
        return {
            state
        };
    }
};
</script>
