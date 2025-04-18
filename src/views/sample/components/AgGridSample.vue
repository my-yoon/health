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
        &lt;AgGridVue :columnDefs="state.tableColum_c" :rowData="state.rowData" :defaultColDef="state.defaultColDef"
            class="ag-theme-alpine" :domLayout="state.domLayout" style="width:100%" @cell-clicked="셀클릭시 이벤트 처리"&gt;
        &lt;/AgGridVue&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
export default {
    setup() {
        const store = useStore();
        const state = reactive({
            //테이블데이터
            rowData: tablelist_payermanage_const, // 실제 데이터
            tableColum_c: _.clone(tablelist_payermanage_label), //컬럼명 처리
            //테이블 옵션
            defaultColDef: {
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1
            },
            domLayout: 'autoHeight',
        });
        
        return {
            state,
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
