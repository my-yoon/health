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
&lt;script&gt;
import { useStore } from 'vuex';
import { api명 } from '@/api/페이지내사용api';
export default {
    setup() {
        const store = useStore();
        const state = reactive({
            testapi: ''
        });
        onMounted(() => {
            testApi();
        });
        const testApi = async () => {
            try {
                const response = await api명();
                console.log('test api', response);
                state.testapi = response;
            } catch (error) {
                console.log(error);
            }
        };
        return {
            state,
            testApi
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
