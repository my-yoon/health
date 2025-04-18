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
        &lt;input type="file" id="upload-file" hidden="" @change="fileListUp()" ref="fileUploadBiz"&gt;
        &lt;button @click="uploadFile()"&gt;파일API&lt;/button&gt;
        &lt;button @click="fileDownload(파일업로드 response시 받은 fileID)"&gt;파일다운&lt;/button&gt;
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

        //파일업로드 API
        const uploadFile = async (type) => {
            const formData = new FormData();
            formData.append('file', Array.from(fileUploadBiz.value.files)[0]); //단일 파일만 업로드시
            try {
                const response = await _uploadFile(formData);
                state.fileNum = response.data.fileId  // 다운로드시 사용할 번호
            } catch (error) {
                console.log(error);
            }
        };
        //파일다운로드
        const fileDownload = async (params) => {
            try {
                const response = await _fileDownload(params); //파일업로드 response시 받은 fileID
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                const match = /filename="(.+?)"/.exec([response.headers['content-disposition']]);
                a.href = url;
                a.download = match ? match[1] : null;
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.log(error);
            }
        };

        return {
            state,
            fileUploadBiz
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