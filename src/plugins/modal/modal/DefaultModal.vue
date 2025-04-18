<template>
    <Modal v-if="state.isShow" :close="modalbtns">
        <div :class="['ui-modal-wrap', state.className]">
            <div class="ui-modal-head">
                <h5 class="ui-modal-title">
                    <span v-if="state.modalTitle === '오케어'" class="ocare-ci"><span class="offscreen">o'care</span></span>
                    <template v-else>
                        {{ state.modalTitle }}
                    </template>
                </h5>
                <button class="ui-modal-close" type="button" @click="modalbtns('modalclose', `${state.modalName}`)">
                    <span class="offscreen">팝업닫기</span>
                </button>
            </div>
            <div class="ui-modal-body">
                <slot name="modalcontent"></slot>
            </div>
            <div class="ui-modal-footer">
                <div class="btn-bottom-set flex justify-center">
                    <button v-if="state.buttonCancel" class="btn btn-sl nega" type="button"
                        :disabled="state.confirmdisabled" @click="modalbtns('modalcancel', `${state.modalName}`)">{{
                            state.buttonCancel }}
                    </button>
                    <button v-if="state.buttonDelete" class="btn btn-sl posi" type="button"
                        :disabled="state.confirmdisabled" @click="modalbtns('modaldelete', `${state.modalName}`)">{{
                            state.buttonDelete }}
                    </button>
                    <button v-if="state.buttonConfirm" class="btn btn-sl posi" type="button"
                        :disabled="state.confirmdisabled" @click="modalbtns('modalconfirm', `${state.modalName}`)">{{
                            state.buttonConfirm }}
                    </button>
                </div>
            </div>
        </div>
    </Modal>
</template>
<script>
import { getCurrentInstance, computed, reactive } from 'vue';

export default {
    props: ['isShow', 'modalTitle', 'buttonConfirm', 'buttonCancel', 'buttonDelete', 'modalName', 'className', 'confirmdisabled', 'canceldisabled', 'deletdisabled'],
    emits: ['modalclose'],

    setup(props) {
        const { emit } = getCurrentInstance();
        const state = reactive({
            isShow: computed(() => props.isShow),
            modalTitle: computed(() => props.modalTitle),
            buttonConfirm: computed(() => props.buttonConfirm),
            buttonDelete: computed(() => props.buttonDelete),
            buttonCancel: computed(() => props.buttonCancel),
            modalName: computed(() => props.modalName),
            className: computed(() => props.className),
            confirmdisabled: computed(() => props.confirmdisabled),
            canceldisabled: computed(() => props.canceldisabled),
            deletdisabled: computed(() => props.deletdisabled)

        });
        const modalbtns = (type, Name) => {

            if (!Name) {
                emit('modalclose', type);
            } else {
                emit('modalclose', type, Name);
            }

        };
        const closeModal = () => {
            console.log(state.isShow);
        };
        return {
            state,
            modalbtns,
            closeModal
        };
    }

};

</script>