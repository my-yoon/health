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
    &lt;div class="reg-group"&gt;
        &lt;div class="reg-item"&gt;
            //input =text작성
            &lt;input type="text" class="form-control"&gt;
            //select 클래스 필수 적용
            &lt;select class="custom-select"&gt;
                &lt;option value="사용"&gt;사용 &lt;/option&gt;
                &lt;option value="미사용"&gt;미사용 &lt;/option&gt;
            &lt;/select&gt;
            //체크박스 사용시 필수 태그
            &lt;span class="checkbox"&gt;
                &lt;input id="columChk2" name="columChkGroup" type="checkbox" value="코드"&gt;
                &lt;label for="columChk2"&gt;코드&lt;/label&gt;
            &lt;/span&gt;
            //라디오버튼 사용 시 필수 태그 
            &lt;span class="radiobox"&gt;
                &lt;input id="columChk1" name="columChkGroup" type="radio" value="코드"&gt;
                &lt;label for="columChk1"&gt;코드&lt;/label&gt;
            &lt;/span&gt;
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
