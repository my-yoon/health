<template>
    <div class="item">
        <label><slot>회원검색</slot></label>
        <span class="input">
            <span class="dv">
                <select class="custom-select sm" v-model="memberSearchType">
                    <option value="">전체</option>
                    <option value="mbrNm">회원명</option>
                    <option value="mbrSn">회원번호</option>
                    <option value="mbrJnMthAcsId">회원ID</option>
                </select>
            </span>
            <span class="dv">
                <input type="text" class="form-control sm" v-model="memberSearchNm" readonly>
            </span>
            <span class="dv">
                <button type="button" class="btn btn-opt" @click="openModal('user')">찾기</button>
            </span>
            <span class="dv">
                <button type="button" class="btn btn-opt" @click="clearSearch('user')">X</button>
            </span>
        </span>
    </div>
    <DefaultModal :isShow="isUserPopShow" :modalTitle="'회원 조회'" :buttonConfirm="'닫기'" :buttonCancel="''" :buttonDelete="'Clear'"
            :modalName="'isUserShow'" @modalclose="modalControl">
        <template #modalcontent>
            <SttlUserSearch @selectUser="selectUser" :params="selectUserParams"/>
        </template>
    </DefaultModal>
</template>

<script setup>
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import SttlUserSearch from '../component/SttlUserSearch.vue';
import { computed, reactive, ref } from 'vue';
const isUserPopShow = ref(false);
const props = defineProps({
    
});

const memberSearchType = defineModel('memberSearchType', {default: ''});
const memberSearchNm = defineModel('memberSearchNm');
const mbrId = defineModel('mbrId');

const clearSearch = () => {
    memberSearchNm.value = '';
    memberSearchType.value = '';
    mbrId.value = '';
};

const selectUserParams = reactive({
    searchType: computed(() => {
        let returnVal = '';
        if (_.isNumber(mbrId.value)) {
            returnVal = 'mbrSn';
        } else {
            returnVal = memberSearchType.value;
        }
        return returnVal;
    }),
    searchText: computed(() => mbrId.value)
});

const selectUser = (data) => {
    memberSearchNm.value = data.mbrNm;
    mbrId.value = data.mbrSn;
    isUserPopShow.value = false;
};

const openModal = () => {
    isUserPopShow.value = true;
};

const modalControl = (type) => {
    if (type == 'modaldelete') {
        clearSearch();
    }
    isUserPopShow.value = false;
};
</script>
