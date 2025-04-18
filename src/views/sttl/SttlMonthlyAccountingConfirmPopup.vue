<template>
    <button type="button" class="btn btn-ss" @click="open(true)">확정</button>
    <button type="button" class="btn btn-ss" @click="open(false)">확정취소</button>
    <DefaultModal :isShow="modalIsShow" :modalName="confirmModalKind" :modalTitle="confirmModalKind=='confirm'?'확정':'확정취소'" :buttonConfirm="'확인'" :buttonCancel="'닫기'" @modalclose="confirmModalclose" className="ui-confirm-modal" >
        <template #modalcontent>
            <div class="ui-grid-top-guide">
                <p>· 정산일자를 입력 후 확인을 클릭하면 {{confirmModalKind=='confirm'?'확정':'확정취소'}}됩니다.</p>
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 100px;">
                        
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">정산년월<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <DatePicker
                                            locale="ko"
                                            v-model="sttlYm"
                                            :format="'yyyyMM'"
                                            position="right"
                                            placeholder="년월선택"
                                            hide-input-icon
                                            auto-apply
                                            month-picker
                                            arrow-navigation
                                        />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">정산회차<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <SettleSeq v-model="sttlEps"/>
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

const sttlYm = ref({
    month: dayJS().add(-2, 'M').format('MM'),
    year: dayJS().add(-2, 'M').format('YYYY')
});
const sttlEps = ref(1);
const modalIsShow = ref(false);
const confirmModalKind = ref('');
const sttlCyclCd = 'M';

const open = (type) => {
    if (type) {
        confirmModalKind.value = 'confirm';
    } else {
        confirmModalKind.value = '';
    }
    modalIsShow.value = true;
};

const emit = defineEmits(['confirm']);
const confirmModalclose = async (btn, name) => {
    if (btn === 'modalconfirm') {
        let params = {
            sttlCyclCd: sttlCyclCd,
            sttlYm: dayJS(sttlYm.value.year + '' + sttlYm.value.month, 'YYYYMM').add(1, 'M').format('YYYYMM'),
            sttlEps: sttlEps.value,
            dcnYn: confirmModalKind.value == 'confirm' ? 'Y' : 'N'
        };
        try {
            const res = await _getInstlAccuPrJnlzDcn(params);
            
            if (res.data.code == 'OK') {
                await $Modal.alert({ message: res.data.message, buttonText: { ok: '확인' } });
                emit('confirm');
                modalIsShow.value = false;
            } else {
                await $Modal.alert({ message: res.data.message, buttonText: { ok: '확인' } });
            }
            modalIsShow.value = false;
        } catch (error) {
            await $Modal.alert({ message: res.data.message, buttonText: { ok: '확인' } });
            modalIsShow.value = false;
        }
    } else {
        modalIsShow.value = false;
    }
};

</script>
<style>
.ui-confirm-modal{
    width: 350px !important;
    height: 620px !important;
}
</style>