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
    &lt;button type="button" class="btn btn-opt-ico filter" @click="resetTable"/&gt;
        &lt;span class="offscreen"&gt;컬럼 셋팅&lt;/span&gt;
    &lt;/button&gt;
    &lt;columlist :columlists="tablelist_payermanage_label" @checkColum="checkOptions" /&gt;
    &lt;div&gt;
        &lt;AgGridVue :columnDefs="state.tableColum_c" :rowData="state.rowData" :defaultColDef="state.defaultColDef"
            class="ag-theme-alpine" :domLayout="state.domLayout" style="width:100%" @cell-clicked="셀클릭시 이벤트 처리"&gt;
        &lt;/AgGridVue&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import { tablelist_payermanage_const, tablelist_payermanage_label } from '@/data/table.js'; // 테이블 샘플 데이터(참고용)
export default {
    setup() {
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
            filterCoulm:[]
        });
        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };
        // 컬럼 변경
        const resetTable = () => {
            const initColum = _.clone(tablelist_payermanage_label);
            state.tableColum_c = initColum.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };
        
        return {
            state,
            checkOptions,
            resetTable
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
