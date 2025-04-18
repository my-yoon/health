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
    &lt;subTitleBar :subTitle="'서브타이틀명'" /&gt;
&lt;/template&gt;
&lt;script&gt;
export default {
    setup() {
            ...
        return {
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
