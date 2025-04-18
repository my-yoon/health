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
{
    "code": "OK",
    "message": "요청이 성공하였습니다.",
    "data": {
        "list": [
            ...
            {
                "menuGroupCode": "1001000", //메뉴 그룹코드
                "menuCode": "1001000", //메뉴 코드
                "label": "계정정보관리", //메뉴명
                "url": "/account/manage", //URL
                "auth1RegistYn": "Y", //등록권한 여부
                "auth2UpdateYn": "Y", //수정권한 여부
                "auth3DeleteYn": "Y", //삭제권한 여부
                "auth4ApproveYn": "Y", //승인권한 여부
                "auth5DownloadYn": "Y", //다운로드권한 여부
                "auth6MaskingYn": "Y", //마스킹권한 여부
                "isActive": false,  // 클래스 활성화
                "isFav": true, // 즐겨찾기 추가 여부
                "favOrder": 1, // 즐겨찾기 순서
                "list": null // 2depth
            },
            ...
        ]
    }`
        });
        return {
            state
        };
    }
};
</script>
