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
    &lt;div&gt;
    //셀렉트 박스로 리스트 개수 처리시 사용 컴포넌트
    &lt;selectBox :selectType="'page'" @changedValue="selectedOptions" /&gt;
    //리스트 하단  사용 컴포넌트
    &lt;PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
        @changedPage="onChangedPage" /&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import {  ref } from 'vue';
export default {
    setup() {
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1', //테이블 리스트내에 번호 작성 시 사용
                suppressSizetoFit: true
            },
            ...,
            pagesize:10 // 리스트 갯수 기본값

        ]);
        // 페이징 처리
        const pager = reactive({
            current: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });
        const onChangedPage = (num) => {
            console.log(num);
            pager.current = num;
            //리스트 내에 index가 있는경우 처리 방법
            initColum.value[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getMessageList();
        };
        //리스트 조회 api호출시 page처리 방법
        const getMessageList = async () => {
            try {
                let params = {
                    size: pager.size, // 현재 페이지
                    offset: pager.offset, //호출될 리스트 갯수
                    ...
                };
                const response = await _getMessageList(params);
                state.messageList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };
        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
            if (type === 'page') {
                state.pagesize = value;
                //api호출
                getMessageList();
            }

        };
        return {
            pager,
            onChangedPage,
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
