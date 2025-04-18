<template>
      <div class="item">
        <label>계정</label>
        <span class="input">
            <span class="dv">
                <input type="text" class="form-control sm" :value="accdNm" readonly>
            </span>
            <span class="dv">
                <button class="btn btn-opt" @click="accdModalOpen('Inner')">찾기</button>
            </span>
            <span class="dv">
                <button class="btn btn-opt" @click="clearSearch('accd')">X</button>
            </span>
        </span>
    </div>
    <DefaultModal :isShow="accdModalIsShow" :modalName="accdModalKind" :modalTitle="'내부 계정조회'" :buttonCancel="'닫기'" :buttonDelete="'Clear'" @modalclose="accdModalclose" >
		<template #modalcontent>
			<SttlErpAccd @selectAccd="receiveAccd" :params="accdModalTargetData"/>
		</template>
	</DefaultModal>
</template>

<script setup>
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import SttlErpAccd from '../component/SttlErpAccd.vue';
import { onMounted, ref } from 'vue';
import { _getCodeApply } from '@/api/sttl.js';
const accdNm = defineModel('accdNm', {default: ''});
const accd = defineModel({default: ''});
const accdModalIsShow = ref(false);
const accdList = ref([]);

let accdModalKind = '';
let accdModalTargetData = {};

const clearSearch = () => {
    accd.value = '';
    accdNm.value = '';
};

const accdModalOpen = (option) => {
    
    accdModalKind = option;
    accdModalTargetData.innerList = accdList.value;
    accdModalTargetData.accd = accd;

    accdModalIsShow.value = true;
};

const accdModalclose = async (btn, name) => {
    if (btn === 'modalconfirm') {
        //
    } else if (btn === 'modaldelete') {
        clearSearch('accd');
    }
    
    accdModalIsShow.value = false;
};

const receiveAccd = (v) => {
    accd.value = v.acctCd;
    accdNm.value = v.acctNm;

    accdModalIsShow.value = false;
};

onMounted(async () => {
    await _getCodeApply('ACCD', accdList);
});
</script>
