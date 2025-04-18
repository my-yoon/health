<template>
    <button class="btn btn-opt" type="button" @click="excelFileDownLoad">
        <span class="ico-download"></span>
        <slot>파일다운로드</slot>
    </button>
    <!-- 다운로드 사유 등록 -->
    <DefaultModal :isShow="isFileDownShow" :modalTitle="state.modalTitle" buttonCancel="" buttonConfirm="저장"
                  modalName="isFileDownShow" @modalclose="modalControl">
        <template #modalcontent>
            <DownModalCon ref="DownModalConRef" @downloadFormat="downConfirm"/>
        </template>
    </DefaultModal>
</template>
<script>

import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import {computed, reactive, ref} from 'vue';
import {useCommFunc} from '@/core/helper/common.js';

export default {
    components: {DefaultModal},
    props: ['isReason', 'apiUrl', 'params', 'class', 'modalTitle', 'mnuCd'],
    emits: ['update:model-value'],
    setup(props) {
        const isFileDownShow = ref(false); //
        const DownModalConRef = ref(null);
        const {fileDown} = useCommFunc();
        const state = reactive({
            isReason: computed(() => props.isReason ?? true), // 다운로드사유 여부
            apiUrl: computed(() => props.apiUrl), // api Url
            params: computed(() => props.params), // api 파라메터
            modalTitle: computed(() => props.modalTitle ?? '다운로드 사유 등록'),
            download: {
                pass: null,
                reason: null
            }
        });

        const excelFileDownLoad = () => {
            //console.log(params);
            // 다운로드 사유
            if (state.isReason) {
                state.download = {pass: null, reason: null};
                isFileDownShow.value = true;
            } else {
                fileDown(state.download, state.params, state.apiUrl);
            }
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
            if (modalName === 'isFileDownShow') {
                if (type === 'modalconfirm') {
                    if (_.isEmpty(state.download.pass) || _.isEmpty(state.download.reason)) {
                        DownModalConRef.value.validCheck();
                    } else {
                        state.params.downloadPass = state.download.pass;
                        state.params.downloadReason = state.download.reason;

                        //사유 등록, 엑셀params, url
                        fileDown(state.download, state.params, state.apiUrl);
                        state.download = {pass: null, reason: null};
                        isFileDownShow.value = false;
                    }
                } else if (type === 'modalclose') {
                    isFileDownShow.value = false;
                }
            }
        };

        return {
            state,
            isFileDownShow,
            DownModalConRef,
            excelFileDownLoad,
            downConfirm,
            modalControl
        };
    }
};
</script>