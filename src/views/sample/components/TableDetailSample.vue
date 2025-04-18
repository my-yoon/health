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
    &lt;div class="ui-content"&gt;
        &lt;div class="tbl-wrap"&gt;
            &lt;table class="table reg"&gt;
                &lt;colgroup&gt;
                    &lt;col style="width: 160px;"&gt;
                    &lt;col style="width: auto;"&gt;
                    &lt;col style="width: 160px;"&gt;
                    &lt;col style="width: auto;"&gt;
                &lt;/colgroup&gt;
                &lt;tbody&gt;
                    &lt;tr&gt;
                        &lt;th scope="row"&gt;담당부서&lt;/th&gt;
                        &lt;td&gt;인사팀&lt;/td&gt;
                        &lt;th scope="row"&gt;담당자명&lt;/th&gt;
                        &lt;td&gt;홍길동&lt;/td&gt;
                    &lt;/tr&gt;
                    ...
                &lt;/tbody&gt;
            &lt;/table&gt;
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/template&gt;`
        });
        return {
            state
        };
    }
};
</script>
