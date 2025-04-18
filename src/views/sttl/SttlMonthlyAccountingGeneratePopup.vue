<template>
    <button v-if="!props.cancelOnly" type="button" class="btn btn-ss" @click="open(true)">전표생성</button>
    <button type="button" class="btn btn-ss" @click="open(false)">전표생성 취소</button>
    <DefaultModal :isShow="modalIsShow" :modalName="createModalKind" :modalTitle="createModalKind=='create'?'전표생성':'전표생성 취소'" :buttonConfirm="'확인'" :buttonCancel="'닫기'" @modalclose="confirmModalclose" >
        <template #modalcontent>
            <div class="ui-grid-top-guide">
                <p>· 전표일자를 입력 후 확인을 클릭하면 {{createModalKind=='create'?'전표생성':'전표생성취소'}}됩니다.</p>
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 100px;">
                        
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row" colspan="2">전표일자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <DatePicker
                                            locale="ko" cancelText="취소" selectText="선택"
                                            v-model="sttlYmd"
                                            :format="'yyyy-MM-dd'"
                                            :teleport="true"
                                            :clearable="false"
                                            hide-input-icon
                                            :enable-time-picker="false"
                                            placeholder="날짜선택"
                                            text-input
                                            :text-input-options="{format:'yyyyMMdd'}"
                                            auto-apply
                                        />
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
import { inject, onMounted, ref } from 'vue';
import { _createInstlAcctSlip, _deleteInstlAcctSlip } from '@/api/sttl.js';
const props = defineProps({
    cancelOnly: Boolean
});
const $Modal = inject('$Modal');
const dayJS = inject('dayJS');

//전월 말일
const sttlYmd = ref(dayJS().add(0, 'month').date(0));
const modalIsShow = ref(false);
const createModalKind = ref('');
const sttlCyclCd = 'M';

const open = (type) => {
    if (type) {
        createModalKind.value = 'create';
    } else {
        createModalKind.value = '';
    }
    modalIsShow.value = true;
};

const emit = defineEmits(['create']);
const confirmModalclose = async (btn, name) => {

    if (btn === 'modalconfirm') {

        let params = {
            sttlCyclCd: sttlCyclCd,
            slipDate: dayJS(sttlYmd.value).format('YYYYMMDD')
        };
        try {
            const res = createModalKind.value == 'create' ? await _createInstlAcctSlip(params) : await _deleteInstlAcctSlip(params);
            if (res.data.code == 'OK') {
                await $Modal.alert({ message: res.data.message, buttonText: { ok: '확인' } });
                emit('create');
                modalIsShow.value = false;
            } else {
                await $Modal.alert({ message: res.data.message, buttonText: { ok: '확인' } });
                modalIsShow.value = false;
            }
            modalIsShow.value = false;
        } catch (error) {
            await $Modal.alert({ message: error.data.message, buttonText: { ok: '확인' } });
            modalIsShow.value = false;
        }
    } else {
        modalIsShow.value = false;
    }
};

</script>
<style>
/* .ui-confirm-modal{
    width: 350px !important;
    height: 620px !important;
} */
</style>