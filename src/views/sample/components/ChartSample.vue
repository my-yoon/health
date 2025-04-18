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
//차트 사용 옵션
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

&lt;template&gt;
    &lt;Modal v-if="isShow" :close="closeModal"&gt;
        &lt;div class="modalLayer"&gt;
            팝업내용작성
        &lt;/div&gt;
    &lt;/Modal&gt;
&lt;/template&gt;
&lt;script&gt;
import { ref } from 'vue';
export default {
    setup() {
        const isShow = ref(false); ==> 기본값 설정

        const showModal = () => {
            isShow.value = true;
        };
        const closeModal = () => {
            isShow.value = false;
        };
        return {
            isShow,
            showModal,
            closeModal

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
