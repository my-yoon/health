<template>
    <div class="item">
        <label>{{ noBizOptions ? '거래처': '업체검색' }}</label>
        <span class="input">
            <span class="dv" v-if="!noBizOptions">
                <select class="custom-select sm" v-model="bizSearchType">
                    <option value="">전체</option>
                    <option value="pyrId">Payer</option>
                    <option value="selrId">Seller</option>
                </select>
            </span>
            <span class="dv">
                <input type="text" class="form-control sm" v-model="searchBizNm" readonly>
            </span>
            <span class="dv">
                <button type="button" class="btn btn-opt" @click="openModal('isPartnerShow')">찾기</button>
            </span>
            <span class="dv">
                <button type="button" class="btn btn-opt" @click="clearSearch()">X</button>
            </span>
        </span>
    </div>
    <DefaultModal :isShow="isPartnerShow" :modalTitle="selectPartnerParams.tName + ' 조회'" :buttonConfirm="'닫기'" :buttonCancel="''" :buttonDelete="'Clear'"
            :modalName="'isPartnerShow'" @modalclose="modalControl">
        <template #modalcontent>
            <SttlPartnerSerch @selectPartner="selectPartner" :params="selectPartnerParams"/>
        </template>
    </DefaultModal>
</template>

<script setup>
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import SttlPartnerSerch from '../component/SttlPartnerSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { computed, reactive } from 'vue';
const { openModal, isPartnerShow} = useCommFunc();

const bizSearchType = defineModel('bizSearchType');
const searchBizNm = defineModel('searchBizNm');
const searchBiz = defineModel('searchBiz');
const props = defineProps({
    noBizOptions: Boolean,
});

const clearSearch = () => {
    searchBiz.value = '';
    searchBizNm.value = '';
    bizSearchType.value = '';
};

const selectPartner = (data) => {
    console.log(data);
    searchBizNm.value = data.ntprNm;
    searchBiz.value = data.ntprSn;

    isPartnerShow.value = false;

};

const modalControl = (type) => {
    if (type == 'modaldelete') {
        clearSearch('biz');
    }
    isPartnerShow.value = false;
};

const selectPartnerParams = reactive({
    admnPtnrTyCd: computed(() => {
        let returnVal = '';
        switch (bizSearchType.value) {
            case 'pyrId':
                returnVal = '111002';
                break;
            case 'selrId':
                returnVal = '111003';
                break;
        }
        return returnVal;
    }),
    tName: computed(() => {
        let returnVal = props.noBizOptions ? '거래처' : '파트너';
        switch (bizSearchType.value) {
            case 'pyrId':
                returnVal = 'Payer';
                break;
            case 'selrId':
                returnVal = 'Seller';
                break;
        }
        return returnVal;
    }),
    searchText: computed(() => searchBizNm)
});
</script>
