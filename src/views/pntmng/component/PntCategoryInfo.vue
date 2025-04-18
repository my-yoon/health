<template>
    <div class="ui-section">
        <div class="ui-title-3">
            <h3>카테고리정보</h3>
        </div>
        <div class="ui-content">
            <div class="tbl-wrap">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">포인트카테고리</th>
                            <template v-if="state.params.pntCtgrMjcsCdNm && state.params.pntCtgrMdcsCdNm">
                                <td colspan="3">{{ state.params.pntCtgrMjcsCdNm }} > {{ state.params.pntCtgrMdcsCdNm }}</td>
                            </template>
                            <template v-else>
                                <td colspan="3"></td>
                            </template>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, computed } from 'vue';
export default {
    props: ['params'],
    setup(props) {
        const state = reactive({
            params: computed(() => props.params)
        });
        return {
            state
        };
    }
};
</script>