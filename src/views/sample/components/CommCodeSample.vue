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
    &lt;div class="editor_container"&gt;
        //사용할 공통 코드의 키값 @/data/commcode/index.js 참고
        &lt;commselect :selectType="'사용할 공통 코드의 키값'" @changedValue="selectedOptions" :initData="초기값" /&gt;

        <commradio :selectType="'사용할 공통 코드의 키값'" :initData="초기값" @changedValue="selectedOptions" />
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import { reactive } from 'vue';
import { _uploadFile, _fileDownload } from '@/api/common.js';
export default {
    setup() {
        const fileUploadBiz = ref(null);
        const state = reactive({
           fileNum : null
        });

        //셀렉트 선택 
        const selectedOptions = (valueCode, valueName, type) => {
            console.log(valueCode, valueName, type);
            // valueCode: 공통 코드 
            // valueName: 공통 코드 명칭
            // type:공통 코드 키값
        };

        return {
            state,
            selectedOptions
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