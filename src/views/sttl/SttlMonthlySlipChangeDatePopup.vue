<template>
    <button type="button" class="btn btn-ss" @click="open()">요청/종료일 수정</button>
    <DefaultModal :isShow="modalIsShow" modalName="changeDate" modalTitle="요청/종료일 수정" :buttonConfirm="'확인'" :buttonCancel="'취소'" @modalclose="confirmModalclose" className="ui-change-date-modal" >
        <template #modalcontent>
            <div class="ui-title-3">
                <h3>일자수정</h3>
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg mt-10">
                    <colgroup>
                        <col style="width: 100px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">요청일</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <div class="ui-datepicker relative"> <!-- 캘린더가 나올 공간이 없어 position 속성 변경 'relative' 클래스 추가 -->
                                            <DatePicker position="left" v-model="reqDate" :enableTimePicker="false"
                                                locale="ko" :clearable="false" :format="dateFormat" autoApply text-input :text-input-options="{format:'yyyyMMdd'}" ref="date"/>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">종료일</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <div class="ui-datepicker relative"> <!-- 캘린더가 나올 공간이 없어 position 속성 변경 'relative' 클래스 추가 -->
                                            <DatePicker position="left" v-model="endDate" :enableTimePicker="false"
                                            locale="ko" :clearable="false" :format="dateFormat" autoApply text-input :text-input-options="{format:'yyyyMMdd'}" ref="date"/>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </DefaultModal>
</template>
<script setup>
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import SettleSeq from './searchFilters/SettleSeq.vue';
import { inject, onMounted, ref } from 'vue';
import { _getInstlAccuPrJnlzDcn } from '@/api/sttl.js';
const $Modal = inject('$Modal');
const dayJS = inject('dayJS');
const props = defineProps({
    params: Object,
    gridApi: Object
});

const dateFormat = 'yyyy-MM-dd';
const reqDate = ref('');
const endDate = ref('');

const modalIsShow = ref(false);
const confirmModalKind = ref('');
const sttlCyclCd = 'M';

const open = async (type) => {
    console.log(props.params);
    if (props.params?.length !== 1) {
        await $Modal.alert({ message: '선택된 목록이 1개가 아닙니다.', buttonText: { ok: '확인' } });
    } else if (props.params[0]?.dtModifyYn !== 'Y') {
        await $Modal.alert({ message: '선택된 목록은 수정이 불가능합니다.', buttonText: { ok: '확인' } });
    } else {
        reqDate.value = dayJS(props.params[0].reqDt, 'yyyymmdd') ;
        endDate.value = dayJS(props.params[0].endDt, 'yyyymmdd') ;
        modalIsShow.value = true;
    }
};

const emit = defineEmits(['confirm']);
const confirmModalclose = async (btn, name) => {
    const row = props.params[0];
    console.log(props.gridApi.getRowNode(props.params[0]));
    console.log(row);
    // if (btn === 'modalconfirm') {
    //     let params = {
    //         sttlCyclCd: sttlCyclCd,
    //         sttlYm: dayJS(sttlYm.value.year + '' + sttlYm.value.month, 'YYYYMM').add(1, 'M').format('YYYYMM'),
    //         sttlEps: sttlEps.value,
    //         dcnYn: confirmModalKind.value == 'confirm' ? 'Y' : 'N'
    //     };
    //     try {
    //         const res = await _getInstlAccuPrJnlzDcn(params);
            
    //         if (res.data.code == 'OK') {
    //             await $Modal.alert({ message: res.data.message, buttonText: { ok: '확인' } });
    //             emit('confirm');
    //             modalIsShow.value = false;
    //         } else {
    //             await $Modal.alert({ message: res.data.message, buttonText: { ok: '확인' } });
    //         }
    //         modalIsShow.value = false;
    //     } catch (error) {
    //         await $Modal.alert({ message: res.data.message, buttonText: { ok: '확인' } });
    //         modalIsShow.value = false;
    //     }
    // } else {
    modalIsShow.value = false;
    // }
};

</script>
<style>
.ui-change-date-modal{
    width: 550px !important;
    height: 640px !important;
}
</style>