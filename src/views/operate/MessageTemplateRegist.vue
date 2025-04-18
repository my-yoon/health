<template>
    <section>
        <div class="ui-grid-top-guide t-right">
            <span class="ess"></span> 표시는 필수항목입니다.
        </div>
        <div class="tbl-wrap mt-10">
            <table class="table reg">
                <colgroup>
                    <col style="width: 160px;">
                    <col style="width: auto;">
                </colgroup>
                <tbody>
                <tr>
                    <th scope="row">채널<span class="ess"><span class="offscreen">필수입력</span></span></th>
                    <td>
                        <div class="reg-group">
                            <div class="reg-item">
                                    <span v-for="(item, index) in state.channelTypeList" :key="index" class="radio">
                                        <input :id="'channelType' + index" v-model="formData.chnCd" :value="item.value"
                                               name="channelType" type="radio" @input="channelChange(item.label)">
                                        <label :for="'channelType' + index">{{ item.label }}</label>
                                    </span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">발송목적</th>
                    <td>
                        <div class="reg-group">
                            <div class="reg-item">
                                <select v-model="formData.sndnPuCd" class="custom-select">
                                    <option v-for="(item, index) in state.sendPurposeList" :key="index"
                                            :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">메세지 제목</th>
                    <td>
                        <div class="reg-group">
                            <div class="reg-item">
                                <input v-model="formData.ttl" class="form-control" type="text">
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">내용<span class="ess"><span class="offscreen">필수입력</span></span></th>
                    <td>
                        <div class="reg-group">
                            <div class="reg-item">
                                <div class="guide-form flex-11">
                                    <div class="textarea">
                                            <textarea id="textarea" v-model="formData.cts"
                                                      :class="validationForm.cts?.class" class="form-control"
                                                      style="height: 200px" @input="validationForm.cts = null"></textarea>
                                        <div class="txt-counter">
                                            <strong>{{ state.contentsMaxSize.count }}</strong> / <span>{{
                                                state.contentsMaxSize[state.channelName].size
                                            }} {{ state.contentsMaxSize[state.channelName].unit }}</span>
                                        </div>
                                    </div>
                                    <span v-if="validationForm.cts?.value" :class="validationForm.cts?.class"
                                          class="input-guide">{{ validationForm.cts?.message }}</span>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button class="btn btn-sl nega" type="button" @click="goToPage('/alarm/message/template/list')">목록</button>
            <button class="btn btn-sl posi" type="button" @click="saveTemplate">저장</button>
        </div>
    </section>
</template>

<script>
import {computed, inject, onMounted, reactive, ref} from 'vue';
import {useCommFunc} from '@/core/helper/common.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import codeList from '@/data/commcode/codeList.js';
import {useRouter} from 'vue-router';
import {_registCustomerAlarmTempCrete} from '@/api/operate.js';
import {useStore} from "vuex";

export default {
    components: {DefaultModal},
    setup() {
        const $Modal = inject('$Modal');
        const router = useRouter();
        const {goToPage, openModal} = useCommFunc();
        const validationForm = ref({});
        
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        // 입력계산
        const getCount = computed(() => {
            // 한글 2바이트 계산
            const getByte = (s, b, i, c) => {
                for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 2 : c >> 7 ? 2 : 1) ;
                return b;
            };
            return state.contentsMaxSize[state.channelName].unit === 'Byte' ? getByte(formData.value.cts ?? '') : formData.value.cts.length ?? 0;
        });

        const state = reactive({
            cstNcTmplSn: null,
            channelTypeList: [], // 채널
            sendPurposeList: [], // 발송목적
            contentsMaxSize: {
                count: getCount,
                SMS: {
                    size: 2000,
                    unit: 'Byte'
                },
                PUSH: {
                    size: 512,
                    unit: '자'
                },
                알림톡: {
                    size: 2000,
                    unit: 'Byte'
                }
            },
            channelName: 'SMS',
            menuCode: menuInfo.value.menuCode
        });

        onMounted(() => {
            // 채널
            codeList.get('channel').then((result) => {
                state.channelTypeList = result.filter(item => item.label !== '알림톡');
                state.channelName = state.channelTypeList[0].label;
                formData.value.chnCd = state.channelTypeList[0].value;
            });

            // 발송목적
            codeList.get('sendPurpose').then((result) => {
                state.sendPurposeList = result;
                formData.value.sndnPuCd = state.sendPurposeList[0].value;
            });

        });

        const formData = ref({
            cstNcTmplSn: null, // 탬플릿 순번
            chnCd: null,  //채널코드
            sndnPuCd: null,  //발송목적코드
            ttl: null,  //메세지제목
            cts: null,  //내용
            menuCode: state.menuCode
        });

        // 채널변경시 발송내용 양식 변경
        const channelChange = (item) => {
            state.channelName = item;
        };

        const saveTemplate = () => {
            if (formValidation()) {
                $Modal.confirm({
                    title: '',
                    message: '저장 하시겠습니까',
                    buttonText: {
                        confirm: '예',
                        cancel: '아니요'
                    }
                }).then(async (success) => {
                    // API 호출
                    await registTemplate();
                }).catch(async error => {
                    console.log(error);
                });
            }
        };

        const formValidation = () => {
            if (!formData.value.cts) {
                validationForm.value.cts = {value: true, message: '내용을 입력해주세요.', class: 'error'};
                return false;
            }

            if (state.contentsMaxSize[state.channelName].size < state.contentsMaxSize.count) {
                validationForm.value.cts = {value: true, message: '내용 사이즈를 초과했습니다.', class: 'error'};
                return false;
            }

            return true;
        };

        // 템플릿 수정
        const registTemplate = async () => {
            try {
                let params = {
                    chnCd: formData.value.chnCd,
                    sndnPuCd: formData.value.sndnPuCd,
                    ttl: formData.value.ttl,
                    cts: formData.value.cts,
                    fstRgtrSn: 1, // 등록자 순번 todo 하드코딩
                    menuCode: state.menuCode
                };

                await _registCustomerAlarmTempCrete(params).then(result => {
                    if (result.data.code === 'OK') {
                        goToPageReplace('/alarm/message/template/list');
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        const goToPageReplace = (param) => {
            router.replace(param);
        };

        return {
            state,
            formData,
            validationForm,
            openModal,
            goToPage,
            goToPageReplace,
            channelChange,
            saveTemplate
        };
    }
};

</script>