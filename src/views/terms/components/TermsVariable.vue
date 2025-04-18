<template>
    <div class="ui-var-list">
        <div class="ui-var-item">
            <div class="var-name">
                <input type="text" class="form-control" placeholder="변수명" value="변수A">
            </div>
            <div class="var-guide">
                <input type="text" class="form-control" placeholder="변수명 설명" value="기업명">
            </div>
        </div>
        <div class="ui-var-item">
            <div class="var-name">
                <input type="text" class="form-control" placeholder="변수명" value="변수B">
            </div>
            <div class="var-guide">
                <input type="text" class="form-control" placeholder="변수명 설명">
            </div>
        </div>
        <div class="ui-var-item">
            <div class="var-name">
                <input type="text" class="form-control" placeholder="변수명">
            </div>
            <div class="var-guide">
                <input type="text" class="form-control" placeholder="변수명 설명">
            </div>
        </div>
        <div class="ui-var-item">
            <div class="var-name">
                <input type="text" class="form-control" placeholder="변수명">
            </div>
            <div class="var-guide">
                <input type="text" class="form-control" placeholder="변수명 설명">
            </div>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue';

export default {
    setup() {
        const state = reactive({
            // pageType: 'regist' // 등록(regist) | 상세 (detail)
        });

        return {
            state
        };
    }
};
</script>