<template>
    <!-- 다운로드 사유 등록 -->
    <DefaultModal :isShow="isImgDownShow" :modalTitle="'다운로드 사유 등록'" buttonCancel="" buttonConfirm="저장"
        modalName="isImgDownShow" @modalclose="modalControl" :confirmdisabled="state.agree !== true">
        <template #modalcontent>
            <div>
                <div class="ui-grid-top-guide mt-16">
                    <p>개인정보를 다운로드 하는 경우 사유 확인이 필요합니다.
                    </p>
                    <div class="ui-grid-top-guide mt-10 t-right"><span class="ess"></span> 표시는 필수항목입니다.</div>
                </div>
                <div class="tbl-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 120px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">다운로드 날짜 <span class="ess"></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            {{ dayJS().format('YYYY-MM-DD') }}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">요청자<span class="ess"></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            {{ state.adminfo.admnNm }}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">다운로드 사유 <span class="ess"></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <textarea id="textarea" class="form-control" v-model="state.downloadreason"
                                                :class="checkValidState('downloadreason') || checkValidState('length') ? 'error' : ''">
                                            </textarea>
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('downloadreason') || checkValidState('length')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                    <span class="input-guide"
                                        v-if="!checkValidState('downloadreason') && !checkValidState('length')">
                                        다운로드사유를 10자 이상 등록해 주세요
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex align-center space-between">
                    <div class="ui-grid-top-guide mt-16 flex1">
                        <p>다운로드한 개인정보를 처리목적 달성 후 파기하며, 안전하게 관리하지 않아 발생하는 책임은 담당자에게 있음을 동의합니다.</p>
                    </div>
                    <div>
                        <span class="checkbox">
                            <input id="columagree1" name="columagreeGroup" type="checkbox" value="동의" v-model="state.agree">
                            <label for="columagree1">동의</label>
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </DefaultModal>
</template>
<style scoped>
.reg-item #textarea {
    height: 100px
}
</style>
<script>


import { computed, reactive, ref, onMounted, inject, watch } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { _imgDownload } from '@/api/common.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';

export default {
    components: { DefaultModal },
    props: ['adminfo'],
    setup(props) {
        const { fileDownload, isImgDownShow } = useCommFunc();
        const dayJS = inject('dayJS');
        const state = reactive({
            adminfo: computed(() => props.adminfo),
            downloadreason: '',
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            },
            agree: false,
            imgItem: null
        });
        const formData = reactive({
            menuCode: '',
            downloadReason: computed(() => state.downloadreason),
            dataCnt: 1,
            remark: ''
        });


        const resetState = () => {
            state.validState.errState = false; // validation
            state.validState.message = '';
        };
        watch(() => state.downloadreason, () => {
            resetState();
        });
        onMounted(async () => {
            emitter.$on('onChangeImgDownForm', (menuCode, type, value) => {
                onChangeImgDownForm(menuCode, type, value);
            });
        });

        const onChangeImgDownForm = async (menuCode, type, value) => {
            console.log(type, value);
            isImgDownShow.value = true;
            formData.menuCode = menuCode;
            formData.remark = type;
            state.imgItem = value;

        };



        const modalControl = async (type, modalName) => {
            if (type === 'modalclose' || type === undefined) {
                isImgDownShow.value = false;
            }
            if (type === 'modalconfirm') {
                if (validCheck()) {
                    await imgDownload();

                    // console.log(state.downloadreason, validCheck());
                }
            }
        };
        const imgDownload = async () => {
            try {
                let params = {
                    menuCode: formData.menuCode,
                    downloadReason: formData.downloadReason,
                    dataCnt: 1,
                    remark: formData.remark
                };
                console.log(params);
                const response = await _imgDownload(params);
                if (response.data.code === 'OK') {
                    isImgDownShow.value = false;
                    await fileDownload(state.imgItem);
                }
                console.log(response);
            } catch (error) {
                console.log(error);

            }
        };
        // 에러체크
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };
        // @validate
        const validCheck = () => {
            let target = ['downloadreason', 'length'];
            for (const item of target) {
                console.log(item);
                state.validState.target = item;
                state.validState.message = item === 'downloadreason' ? '다운로드 사유를 입력하세요' : '다운로드 사유를 10자 이상 등록하세요';
                if (!state[item] && item !== 'length') {
                    state.validState.errState = true;
                    break;
                }
                if (item == 'length' && state.downloadreason.length < 10) {
                    state.validState.errState = true;
                    break;
                }
            }
            return !state.validState.errState;
        };

        return {
            state,
            modalControl,
            formData,
            fileDownload,
            isImgDownShow,
            dayJS,
            checkValidState
        };
    }
};
</script>