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
    //기본 버튼
    &lt;button type="button" class="btn btn-ss"&gt;기본버튼&lt;/button&gt;
    //input=radio로 버튼 사용시 
    &lt;div class="radio-group btn-group"&gt;
        &lt;span class="radio"&gt;&lt;input id="dateType0" name="dategroup" type="radio" value="year"&gt;&lt;label for="dateType0"&gt;1년&lt;/label&gt;&lt;/span&gt;
        &lt;span class="radio"&gt;&lt;input id="dateType1" name="dategroup" type="radio" value="year"&gt;&lt;label for="dateType1"&gt;6개월&lt;/label&gt;&lt;/span&gt;
    &lt;/div&gt;
&lt;/template&gt;`
        });
        return {
            state
        };
    }
};
</script>
