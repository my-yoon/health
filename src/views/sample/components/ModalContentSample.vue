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
        &lt;button @click="openModal"&gt;모달열기&lt;/button&gt;
        &ltDefaultModal :isShow="isShow" :modalName="'isShow'" :modalTitle="'메세지 상세/수정'" :buttonConfirm="'저장'"
                :buttonCancel="'취소'" @modalclose="modalclose"&gt;
            &lt;template #modalcontent&gt;
                &lt;div&gt;팝업내용작성&lt;/div&gt;
            &lt;/template&gt;
        &lt;/DefaultModal&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import { ref } from 'vue';
export default {
    setup() {
        const isShow = ref(false);
        const openModal = () => {
            isShow.value = true;
        };
        const modalclose = (type, modalName) => {
            console.log(modalName)
            isShow.value = false;
        };
        return {
            isShow,
            modalControl,
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
