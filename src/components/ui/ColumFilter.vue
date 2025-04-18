<template>
    <div class="colum-filter-wrap">
        <div class="colum-filter">
            <ul>
                <template v-for="(colum, index) in state.columlists" :key="index">
                    <li v-if="!(colum.headerName === '선택')">

                        <span class="checkbox">
                            <input :id="'columChk' + index" name="columChkGroup" type="checkbox"
                                @change="checkboxSelection(colum.headerName)" :value="colum.headerName">
                            <label :for="'columChk' + index">{{ colum.headerName }}</label>
                        </span>
                    </li>
                </template>
            </ul>
        </div>
    </div>
    <!-- checkColum -->
</template>
<script>
import { reactive, computed, getCurrentInstance } from 'vue';
export default {
    props: ['columlists'],
    emits: ['checkColum'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const state = reactive({
            columlists: computed(() => props.columlists),
            columCheck: []
        });
        const checkboxSelection = (value) => {
            if (state.columCheck.includes(value)) {
                state.columCheck = state.columCheck.filter(item => item !== value);
            } else {
                state.columCheck.push(value);
            }

            emit('checkColum', state.columCheck);
        };
        return {
            state,
            checkboxSelection
        };
    }
};
</script>