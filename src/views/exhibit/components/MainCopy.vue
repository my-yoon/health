<template>
    <div>
        <div>
            <div class="ui-title-3">
                <h3>추가할 섹션 정보를 입력해주세요.</h3>
            </div>
            <div class="ui-section">
                <SectionAdd :sectionAdd="state.sectionAdd" :sectionList="state.addSectionList"
                    :orderCount="state.orderCount" @onChangeSelect="onChangeSelect" />
                <div class="btn-bottom-set flex justify-end mt-10">
                    <button type="button" class="btn btn-sm" @click="onAddSection"><span
                            class="ico-add"></span>섹션추가</button>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import { reactive, inject, ref, onMounted, onUnmounted, computed, nextTick, getCurrentInstance } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import SectionAdd from './SectionAdd.vue';
export default {
    props: ['addSectionList', 'orderCount'],
    emits: ['approveSn', 'onChangeAddSection', 'limitAdd'],
    components: { SectionAdd },
    setup(props) {
        const { emit } = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, openModal } = useCommFunc();
        const store = useStore();
        const route = useRoute();

        const state = reactive({
            addSectionList: computed(() => props.addSectionList),
            orderCount: computed(() => props.orderCount),
            sectionAdd: [
                { sectCd: '', sectVwYn: 'N', ttl: '', ttlVwYn: 'N' }
            ]
        });

        const onChangeSelect = (type, value) => {
            if (type === 'del') {
                state.sectionAdd.splice(value, 1);
                emit('onChangeAddSection', type, value);
            } else {
                state.sectionAdd = value;
                emit('onChangeAddSection', state.sectionAdd);
            }
        };
        //섹션추가
        const onAddSection = () => {
            if (state.sectionAdd.length < 10) {
                state.sectionAdd.push({ sectCd: '', sectVwYn: 'N', ttl: '', ttlVwYn: 'N' });
            } else {
                emit('limitAdd', 'open');
                $Modal.confirm({
                    title: '',
                    message: '섹션 추가는 최대 10까지 가능합니다.',

                    buttonText: {
                        confirm: '확인'
                    }
                })
                    .then(async (success) => {
                        console.log(success);
                        emit('limitAdd', 'close');
                    })
                    .catch(error => {
                        console.log(error);
                        emit('limitAdd', 'close');
                    });
            }

        };

        return {
            $Modal,
            dayJS,
            state,
            goToPage,
            openModal,
            onAddSection,
            onChangeSelect
        };
    }
};
</script>