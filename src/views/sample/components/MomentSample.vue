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
import { inject } from 'vue';
&lt;template&gt;
    &lt;div&gt;{{ dayJS().format('YYYY-MM-DD') }}&lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
export default {
    setup() {
        const dayJS = inject('dayJS');
        ...
        return {
            dayJS
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
