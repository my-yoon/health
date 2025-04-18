<template>
    <div>
        <!-- {{ state.sectionAdd }} -->
        <div class="tbl-wrap mt-10" v-for="(item, index) in state.sectionAdd" :key="index">
            <table class="table reg">
                <colgroup>
                    <col style="width: 120px;">
                    <col style="width: auto;">
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row">섹션선택</th>
                        <td>
                            <div class="reg-group inline space-between">
                                <div class="reg-item">
                                    <select class="custom-select" @change="onChangeValue('sectCd', index, item.sectCd)"
                                        v-model="item.sectCd">
                                        <option :value="item.mainScrnSctnCd" v-for="(item, idx) in state.sectionList"
                                            :key="idx">
                                            {{ item.mainScrnSctnNm }}
                                        </option>
                                    </select>
                                </div>
                                <button type="button" class="btn btn-slm" @click="onChangeDelete('del', index)"
                                    v-if="index !== 0">
                                    삭제
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">노출순서</th>
                        <td>
                            {{ state.orderCount + (index + 1) }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">섹션명</th>
                        <td>
                            <template v-if="state.sectionName !== ''">
                                {{ state.sectionName + (index + 1) }}
                            </template>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">섹션노출상태</th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <span class="radio">
                                        <input :id="'rdo2-1-' + index" :name="'rdoGroup2-' + index" type="radio" value="Y"
                                            @change="onChangeValue('sectVwYn', index, item.sectVwYn)"
                                            v-model="item.sectVwYn">
                                        <label :for="'rdo2-1-' + index">노출</label>
                                    </span>
                                    <span class="radio">
                                        <input :id="'rdo2-2-' + index" :name="'rdoGroup2-' + index" type="radio" value="N"
                                            @change="onChangeValue('sectVwYn', index, item.sectVwYn)"
                                            v-model="item.sectVwYn">
                                        <label :for="'rdo2-2-' + index">비노출</label>
                                    </span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">섹션타이틀</th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <span class="radio">
                                        <input :id="'rdo3-1-' + index" :name="'rdoGroup3-' + index" type="radio" value="Y"
                                            v-model="item.ttlVwYn" @change="onChangeValue('ttlVwYn', index, item.ttlVwYn)">
                                        <label :for="'rdo3-1-' + index">노출</label>
                                    </span>
                                    <span class="radio">
                                        <input :id="'rdo3-2-' + index" :name="'rdoGroup3-' + index" type="radio" value="N"
                                            v-model="item.ttlVwYn" @change="onChangeValue('ttlVwYn', index, item.ttlVwYn)">
                                        <label :for="'rdo3-2-' + index">비노출</label>
                                    </span>
                                    <input type="text" class="form-control w-300 "
                                        @change="onChangeValue('ttl', index, item.ttl)" v-model="item.ttl"
                                        v-if="item.ttlVwYn === 'Y'" :disabled="item.sectVwYn === 'N'">
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watch } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { format } from 'date-fns';
import { useStore } from 'vuex';

export default {
    props: ['sectionAdd', 'sectionList', 'orderCount'],
    setup(props) {
        const internalInstance = getCurrentInstance();
        const { emit } = getCurrentInstance();
        const $Modal = inject('$Modal');
        const store = useStore();

        const state = reactive({
            sectionAdd: computed(() => props.sectionAdd),
            sectionList: computed(() => props.sectionList),
            orderCount: computed(() => props.orderCount),
            sectionName: ''

        });
        const onChangeValue = (type, index, value) => {
            console.log(type, index, value);
            if (type === 'sectCd') {
                state.sectionList.map((v, index) => {
                    if (v.mainScrnSctnCd === value) {
                        v.mainScrnSctnNm !== '선택' ? state.sectionName = v.mainScrnSctnNm : state.sectionName = '';
                    }
                });
            }
            emit('onChangeSelect', type, state.sectionAdd);

        };
        const onChangeDelete = (type, index) => {
            emit('onChangeSelect', type, index);
        };
        return {
            state,
            onChangeValue,
            onChangeDelete

        };
    }
};

</script>