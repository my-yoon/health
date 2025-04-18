<template>
    <div class="item">
        <label>ERP거래처</label>
        <span class="input">
            <span class="dv">
                <input type="text" class="form-control sm" v-model="accuDlngPlcCdNm" readonly>
            </span>
            <span class="dv">
                <button type="button" class="btn btn-opt" @click="erpTrModalOpen('Erp')">찾기</button>
            </span>
            <span class="dv">
                <button class="btn btn-opt" @click="clearSearch('bizErp')">X</button>
            </span>
        </span>
    </div>
    <DefaultModal :isShow="erpTrModalIsShow" :modalName="erpTrModalKind" :modalTitle="(erpTrModalKind=='Inner'?'내부 ':'ERP ') + '거래처조회'" :buttonCancel="'닫기'" :buttonDelete="'Clear'" @modalclose="erpTrModalclose" >
		<template #modalcontent>
			<SttlErpTr @selectErpTr="receiveErpTr" :params="erpTrModalTargetData"/>
		</template>
	</DefaultModal>
</template>

<script setup>
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import SttlErpTr from '../component/SttlErpTr.vue';
import { ref } from 'vue';

const accuDlngPlcCdNm = defineModel('accuDlngPlcCdNm', {default: ''});
const accuDlngPlcCd = defineModel({default: ''});

const clearSearch = () => {
    accuDlngPlcCdNm.value = '';
    accuDlngPlcCd.value = '';
};

const erpTrModalIsShow = ref(false);
let erpTrModalKind = '';
let erpTrModalTargetData = {};

const erpTrModalOpen = (option) => {
    
    erpTrModalKind = option;
    if (option == 'Inner') {
		//notthing...
    } else if (option == 'Erp') {
        erpTrModalTargetData.searchText = accuDlngPlcCd;
    }

    erpTrModalIsShow.value = true;
};


const erpTrModalclose = async (btn, name) => {
    console.log(btn);
    erpTrModalIsShow.value = false;

};

const receiveErpTr = (v) => {
    accuDlngPlcCd.value = v.trCd;
    accuDlngPlcCdNm.value = v.trNm;
    erpTrModalIsShow.value = false;

};
</script>
