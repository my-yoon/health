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
                                               name="channelType"
                                               type="radio" @input="channelChange(item.label)">
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
                                        <textarea id="textarea" v-model="formData.cts" :class="validationForm.cts?.class" class="form-control"
                                                  style="height: 200px" @input="validationForm.cts=null"></textarea>
                                        <div class="txt-counter">
                                            <strong>{{ state.contentsMaxSize.count }}</strong> / <span>{{
                                                state.contentsMaxSize[state.channelName].size
                                            }} {{ state.contentsMaxSize[state.channelName].unit }}</span>
                                        </div>
                                    </div>
                                    <span v-if="validationForm.cts?.value"
                                          :class="validationForm.cts?.class" class="input-guide">{{ validationForm.cts?.message }}</span>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">등록 계정</th>
                    <td> {{ formData.rgsAcNm }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button class="btn btn-sl nega" type="button" @click="goToPageReplace('/alarm/message/template/list')">목록</button>
            <button class="btn btn-sl posi" type="button" @click="checkDel">삭제</button>
            <button class="btn btn-sl posi" type="button" @click="checkEdit">저장</button>
        </div>
    </section>
</template>
<script>
import {computed, inject, onMounted, onUnmounted, reactive, ref} from 'vue';
import {useCommFunc} from '@/core/helper/common.js';
import {authCommFunc} from '@/core/helper/authComm.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import codeList from '@/data/commcode/codeList.js';
import {useRoute, useRouter} from 'vue-router';
import {_deleteCustomerAlarmTemp, _editCustomerAlarmTempUpdate, _getCustomerAlarmTempDetail} from '@/api/operate.js';
import {useStore} from "vuex";

export default {
    components: {DefaultModal},
    setup() {
        const store = useStore();
        const $Modal = inject('$Modal');
        const router = useRouter();
        const {goToPage, openModal} = useCommFunc();
        const route = useRoute();
        const validationForm = ref({});

        /**
         * 권한은 스토어에서 가져옴 (권한여부는 메뉴리스트에서 가져온다)
         * store.state.getMenuItem.menuInfo
         * "auth1RegistYn": "Y/N",  등록
         * "auth2UpdateYn": "Y/N",  수정
         * "auth3DeleteYn": "Y/N",  삭제
         * "auth4ApproveYn": "Y/N", 승인
         * "auth5DownloadYn": "Y/N", 다운
         * "auth6MaskingYn": "Y/N" 마스킹
         */
        const {onChangeEditRol, onChangeDelRol} = authCommFunc();
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
            });

            // 발송대상
            codeList.get('sendTarget').then((result) => {
                state.sendTargetList = result;
            });

            // 발송목적
            codeList.get('sendPurpose').then((result) => {
                state.sendPurposeList = result;
            });

            state.cstNcTmplSn = route.query.cstNcTmplSn;

            getTemplateDetail();

            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });

        /**
         * 마스킹 해제 이벤트 버스 해제
         */
        onUnmounted(() => {
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });

        /**
         * 수정 권한 체크
         */
        const checkEdit = async () => {
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            saveTemplate('update');
        };

        /**
         * 삭제 권한 체크
         */
        const checkDel = async () => {
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            saveTemplate('delete');
        };


        const formData = ref({
            cstNcTmplSn: null, // 탬플릿 순번
            chnCd: null,  //채널코드
            sndnPuCd: null,  //발송목적코드
            ttl: null,  //메세지제목
            cts: null,  //내용
            rgsAcNm: null, // 등록계정
            menuCode: state.menuCode
        });

        // 채널변경시 발송내용 양식 변경
        const channelChange = (item) => {
            state.channelName = item;
        };

        const getTemplateDetail = async () => {
            try {
                const response = await _getCustomerAlarmTempDetail(state.cstNcTmplSn);

                formData.value = response.data.data;
            } catch (error) {
                console.log(error);
            }
        };

        const saveTemplate = (type) => {
            let valiation = true;
            let message = '삭제 하시겠습니까?';
            let apiFn = deleteTemplate;

            if (type === 'update') {
                valiation = formValidation();
                message = '저장 하시겠습니까?';
                apiFn = updateTemplate;
            }

            if (valiation) {
                $Modal.confirm({
                    title: '',
                    message: message,
                    buttonText: {
                        confirm: '예',
                        cancel: '아니요'
                    }
                }).then(async (success) => {
                    // API 호출
                    await apiFn();
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
        const updateTemplate = async () => {
            try {
                let params = {
                    cstNcTmplSn: formData.value.cstNcTmplSn,
                    chnCd: formData.value.chnCd,
                    sndnPuCd: formData.value.sndnPuCd,
                    ttl: formData.value.ttl,
                    cts: formData.value.cts,
                    lastUpdrSn: 1, // 최종수정자 순번 todo 하드코딩
                    menuCode: state.menuCode
                };

                await _editCustomerAlarmTempUpdate(params).then(result => {
                    if (result.data.code === 'OK') {
                        goToPageReplace('/alarm/message/template/list');
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        //템플릿 삭제
        const deleteTemplate = async () => {
            try {
                await _deleteCustomerAlarmTemp({cstNcTmplSn: formData.value.cstNcTmplSn}).then(result => {
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
            saveTemplate,

            checkEdit,
            checkDel
        };
    }
};

</script>