<template>
    <DefaultModal :isShow="true" :modalTitle="state.params.modalTitle" :buttonConfirm="state.params.confirmNm" :buttonCancel="'취소'"
        @modalclose="closeModal">
        <template #modalcontent>
            <div class="ui-title-3">
                <h3>{{ state.params.modalMessage }}</h3>
            </div>
            <div class="ui-grid-top-guide mt-10 t-right">
                <span class="ess"></span> 표시는 필수항목입니다.
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 120px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">사유선택<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <CommonBtn :init="'선택'" :grCdId="state.grCdId" :val="state.data.athrRsnCd"
                                            @changedValue="(value) => {state.data.athrRsnCd = value; state.validState.errState=false}" :className="'custom-select'" />
                                    </div>
                                </div>
                                <div v-if="checkValidState('athrRsnCd')">
                                    <p class="input-guide error">
                                        {{ state.validState.message }}
                                    </p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">추가입력<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <textarea v-model="state.data.athrRsnCts" id="textarea" class="form-control" maxlength="180" placeholder="추가 전달 내용이 있을 경우, 최대 180자 까지 입력"
                                            style="height: 100px" @input="()=>{state.validState.errState=false}"></textarea>
                                    </div>
                                </div>
                                <div v-if="checkValidState('athrRsnCts')">
                                    <p class="input-guide error">
                                        {{ state.validState.message }}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </DefaultModal>
</template>
<script>
import { reactive, getCurrentInstance, computed } from 'vue';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';

export default {
    components: {CommonBtn, DefaultModal},
    emits: ['rsnData'],
    props: ['baseData'],
    setup(props) {
        const { emit } = getCurrentInstance();

        const state = reactive({
            data: {
                athrRsnCts: '',
                athrRsnCd: ''
            },
            params: {
                modalType: props.baseData.modalType,
                modalTitle: props.baseData.modalTitle,
                modalMessage: props.baseData.modalMessage,
                confirmNm: computed(() => state.params.modalType == 'aprv' ? '승인' : state.params.modalType == 'cancel' ? '취소요청' : '반려')
            },
            grCdId: computed(() => state.params.modalType == 'cancel' ? '278000' : '265000'),
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            }
        });

        const closeModal = async (type, val) => {
            if (type == 'modalconfirm') {
                let flag = validCheck();
                if (!flag) return;
            }
            emit('rsnData', type, state.data);
        };

        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        const validCheck = () => {
            let target = ['athrRsnCd', 'athrRsnCts'];
            for (const item of target) {
                state.validState.target = item;
                state.validState.message = (item === 'athrRsnCd') ? '사유를 선택하세요' : '추가 사유를 입력하세요';
                if (!state.data[item]) {
                    state.validState.errState = true;
                    break;
                }
            }
            return !state.validState.errState;
        };

        return {
            state,
            closeModal,
            checkValidState
        };
    }

};

</script>