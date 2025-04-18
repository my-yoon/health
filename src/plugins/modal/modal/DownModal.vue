<template>
    <!-- 다운로드 사유 등록 -->
    <DefaultModal :isShow="isFileDownShow" :modalTitle="'다운로드 사유 등록'" buttonCancel="" buttonConfirm="저장"
        modalName="isFileDownShow" @modalclose="modalControl" :confirmdisabled="state.agree !== true">
        <template #modalcontent>
            <DownModalCon ref="DownModalConRef" @downloadFormat="downConfirm" :adminfo="state.adminfo"
                @onChangeAgree="onChangeAgree" />
        </template>
    </DefaultModal>
</template>
<script>

import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { computed, reactive, ref, onMounted } from 'vue';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: { DefaultModal },
    props: ['adminfo'],
    setup(props) {
        const isFileDownShow = ref(false);
        const DownModalConRef = ref(null);
        const { exelFileDown } = authCommFunc();
        const state = reactive({
            adminfo: computed(() => props.adminfo),
            download: {
                pass: null,
                reason: null
            },
            downParams: {},
            agree: false

        });
        onMounted(async () => {
            emitter.$on('onChangeDownForm', (params) => {
                onChangeDownForm(params);
            });
        });
        const onChangeAgree = (params) => {
            console.log(params);
            state.agree = params;
        };

        const onChangeDownForm = (params) => {
            state.downParams = params.params;
            state.exelurl = params.url;
            isFileDownShow.value = true;
            console.log();
        };


        //다운로드 사유 등록
        const downConfirm = (type, con) => {
            if (type === 'pass') {
                state.download.pass = con;
            } else {
                state.download.reason = con;
            }
        };

        const modalControl = (type, modalName) => {

            if (type === 'modalconfirm') {
                if (_.isEmpty(state.download.pass) || _.isEmpty(state.download.reason) || state.download.reason.length < 10) {
                    DownModalConRef.value.validCheck();
                } else {
                    console.log('체크 완료');
                    let params = {
                        ...state.downParams,
                        downloadPass: state.download.pass,
                        downloadReason: state.download.reason
                    };
                    exelFileDown(params, state.exelurl);
                    console.log(params);
                    isFileDownShow.value = false;
                }
            } else if (type === 'modalclose') {
                isFileDownShow.value = false;
            }

        };

        return {
            state,
            isFileDownShow,
            DownModalConRef,
            downConfirm,
            modalControl,
            onChangeAgree
        };
    }
};
</script>