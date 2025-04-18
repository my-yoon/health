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
    &lt;selectBox :selectType="'mail'" @changedValue="selectedOptions" /&gt;
&lt;/template&gt;
&lt;script&gt;
export default {
    setup() {
        const selectedOptions = (value) => {
            console.log(value);
        };
        return {
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
