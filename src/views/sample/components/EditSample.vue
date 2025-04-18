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
{ /* <div class="editor_container">
                                        <ck-editor :editor="state.ckeditor" :model-value="state.editorCon" />
                                    </div> */ }
import { reactive } from 'vue';
export default {
    setup() {
        const state = reactive({
            sampleCodeJS: `
&lt;template&gt;
    &lt;div class="editor_container"&gt;
        &lt;ck-editor :editor="state.ckeditor" :model-value="state.editorCon" :config="state.editorconfig" / &gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import { reactive, onMounted } from 'vue';
import { initializeEditor } from '@/core/helper/common.js';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
export default {
    components: {
        'ck-editor': CKEditor.component //에디터 컴포넌트 등록
    },
    setup() {
        const state = reactive({
            ckeditor: ClassicEditor, // 사용 에디터
            editorCon: '', // 에디터에 들어갈 데이터
            // editorconfig: EditorOptions.editorConfig // 에디터 옵션 설정
        });
        onMounted(() => {
            initializeEditor();
        })
        return {
            state
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
