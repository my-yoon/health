<template>
    <template v-if="state.btn=='radio'" >
        <span v-for="(option,index) in state.optionInfo" :key="index" class="radio">
            <input :id="state.name+index" :name="state.name" v-model="state.val" :value="option.value" type="radio" @change="selectValue">
            <label :for="state.name+index">{{ option.label }}</label>
        </span>
    </template>
    <template v-else>
        <select :class="state.className" v-model="state.val" @change="selectValue">
            <option :key="index" :value="option.value" v-for="(option,index) in state.optionInfo">
                {{ option.label }}
            </option>
        </select>
    </template>
</template>
<script>
import { reactive, computed, getCurrentInstance, onMounted, watch  } from 'vue';
import { _getCmmMenu } from '@/api/pntmng.js';
import { dmCommFunc } from '@/views/pntmng/common/common.js';

export default {
    props: ['grCdId', 'init', 'val', 'delOption', 'className', 'type', 'btn'],
    emits: ['changedValue'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const { modal } = dmCommFunc();
        const selectOpiton = {
            searchPntKey: [
                {value: '', label: '선택'},
                {value: 'pntNoSn', label: '포인트번호'},
                {value: 'pntPlcyCd', label: '정책번호'},
                {value: 'pntPlcyNm', label: '정책명'}
            ],
            searchCustKey: [
                {value: '', label: '선택'},
                {value: 'mbrNm', label: '이름'},
                {value: 'mbrJnMthAcsId', label: '아이디'}
            ],
            rgsTyCd: [
                {value: '', label: '선택'},
                {value: '10', label: '정책시작일'},
                {value: '20', label: '정책종료일'},
                {value: '30', label: '발급일'},
                {value: '40', label: '등록일'},
                {value: '50', label: '승인일'}
            ],
            searchType: [
                {value: '', label: '선택'},
                {value: 'admnNm', label: '이름'},
                {value: 'admnId', label: '아이디'}
            ],
            cnSercSe: [
                {value: '', label: '선택'},
                {value: 'mbrNm', label: '이름'},
                {value: 'mbrSn', label: '회원번호'}
            ],
            dplIssPsbYn: [
                {value: 'Y', label: '중복허용'},
                {value: 'N', label: '중복비허용'}
            ],
            useYn: [
                {value: 'Y', label: '사용'},
                {value: 'N', label: '미사용'}
            ]
        };
        
        const state = reactive({
            className: props.className,
            grCdId: props.grCdId,
            init: props.init,
            val: '',
            delOption: props.delOption,
            optionInfo: [],
            type: props.type,
            btn: props.btn,
            name: computed(() => state.grCdId ? state.grCdId : state.type)
        });

        watch(props, () => {
            state.val = props.val;
        });

        onMounted(() => {
            state.val = props.val ? props.val : '';
            if (state.type) {
                state.optionInfo = selectOpiton[state.type];
            } else {
                getCmmMenu();
            }
        });

        const selectValue = () => { emit('changedValue', state.val); };

        const getCmmMenu = async () => {
            try {
                if (state.init) state.optionInfo.push({value: '', label: state.init});
                if (state.grCdId == '') return;
                const response = await _getCmmMenu({uprGrpCd: state.grCdId});
                if (response.code == 'OK') {
                    response.data.list.forEach((item) => {
                        state.optionInfo.push({value: item.cmnCd, label: item.cmnCdNm});
                    });
                    if (state.delOption) delOption();
                } else {
                    modal(response.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        const delOption = () => state.optionInfo = state.optionInfo.filter(item => !state.delOption.includes(item.value));

        const setVal = (val) => { state.val = val ? val : ''; };

        const setGrCdId = (val) => {
            state.grCdId = val;
            state.optionInfo = [];
            if (state.grCdId) getCmmMenu();
        };

        return {
            state,
            selectValue,
            setVal,
            setGrCdId
        };
    }
};
</script>