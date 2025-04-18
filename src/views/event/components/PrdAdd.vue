<template>
    <tr v-for="(item, index) in state.addprodlist" :key="index">
        <td>
            <span class="checkbox">

                <input :id="'mainChkpdt' + (index + 1)" name="menuGrouppdt" type="checkbox"
                    @change="selectInput('checkbox', 'mainChkpdt' + (index + 1), index, item)" v-model="item.checkbox">
                <label :for="'mainChkpdt' + (index + 1)"></label>
            </span>
        </td>
        <td>


            <div class="reg-group wp-100">
                <div class="reg-item">
                    <input type="text" class="form-control" v-model="item.productNm"
                        @change="selectInput('productNm', item.productNm, index)">
                </div>
            </div>
        </td>
        <td>
            <div class="reg-group wp-100">
                <div class="reg-item">
                    <input type="number" class="form-control" v-model="item.productCnt"
                        @change="selectInput('productCnt', item.productCnt, index)">
                    <span class="unit">개</span>
                </div>
            </div>
        </td>
        <td>
            <div class="reg-group wp-100">
                <div class="reg-item">
                    <span class="checkbox">
                        <input :id="'benTarChktax' + (index + 1)" name="mbenTarChkGrouptax" type="checkbox"
                            @change="selectInput('tax', item.tax, index)" v-model="item.tax">
                        <label :for="'benTarChktax' + (index + 1)">대상</label>
                    </span>
                </div>
            </div>
        </td>
        <td>
            <div class="reg-group wp-100">
                <div class="reg-item">
                    <input type="text" class="form-control" v-model="item.text"
                        @change="selectInput('text', item.text, index)">
                </div>
            </div>
        </td>
    </tr>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted } from 'vue';
export default {
    props: ['addprodlist'],
    emits: ['onChangePdtList'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const state = reactive({
            addprodlist: computed(() => props.addprodlist),
            productTax: false
        });
        const selectInput = (caseType, value, index) => {
            emit('onChangePdtList', caseType, value, index);
        };
        return {
            state,
            selectInput
        };
    }
};
</script>