<template>
    <section>
        <!-- 기업정보 -->

        <div class="ui-section">
            <subTitleBar subTitle="계정 정보" />
            <div class="ui-content">
                <div class="tbl-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">아이디<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="guide-form flex-11">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input v-model="formData.admnId" :class="validationForm.admnId?.class"
                                                    class="form-control" type="text"
                                                    @input="validationForm.admnId = null; state.duplicatedId = true">
                                            </div>
                                            <div class="reg-item">
                                                <button class="btn btn-slm" type="button" @click="checkDupicationId">중복확인
                                                </button>
                                            </div>
                                        </div>
                                        <span v-if="validationForm.admnId?.value" :class="validationForm.admnId?.class"
                                            class="input-guide">{{ validationForm.admnId?.message }}</span>
                                    </div>
                                </td>
                                <th scope="row">이메일<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="guide-form flex-11">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input v-model="state.admnEmad1" :class="validationForm.admnEmad1?.class"
                                                    class="form-control" type="text"
                                                    @input="validationForm.admnEmad1 = null">
                                            </div>
                                            <span class="ui-coupler">@</span>
                                            <div class="reg-item">
                                                <commselect :initData="state.admnEmad2Code"
                                                    :selectType="'searchCode.mailType2'" @changedValue="selectedOptions" />
                                            </div>
                                        </div>
                                        <span v-if="validationForm.admnEmad1?.value" class="input-guide error">{{
                                            validationForm.admnEmad1?.message
                                        }}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">이름<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <div class="guide-form flex-11">
                                                <input v-model="formData.admnNm" :class="validationForm.admnNm?.class"
                                                    class="form-control" type="text" @input="validationForm.admnNm = null">
                                                <span v-if="validationForm.admnNm?.value" class="input-guide error">{{
                                                    validationForm.admnNm?.message
                                                }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">휴대전화번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="guide-form flex-11">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input v-model="formData.admnHhpnoFno"
                                                    :class="validationForm.admnHhpno?.class" class="form-control"
                                                    maxlength="3" type="text" @input="validationForm.admnHhpno = null">
                                            </div>
                                            <span class="ui-coupler">-</span>
                                            <div class="reg-item">
                                                <input v-model="formData.admnHhpnoMno"
                                                    :class="validationForm.admnHhpno?.class" class="form-control"
                                                    maxlength="4" type="text" @input="validationForm.admnHhpno = null">
                                            </div>
                                            <span class="ui-coupler">-</span>
                                            <div class="reg-item">
                                                <input v-model="formData.admnHhpnoBno"
                                                    :class="validationForm.admnHhpno?.class" class="form-control"
                                                    maxlength="4" type="text" @input="validationForm.admnHhpno = null">
                                            </div>
                                        </div>
                                        <span v-if="validationForm.admnHhpno?.value" class="input-guide error">{{
                                            validationForm.admnHhpno?.message
                                        }}</span>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">부서명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <div class="guide-form flex-11">
                                                <input v-model="formData.admnDepNm" :class="validationForm.admnDepNm?.class"
                                                    class="form-control" type="text"
                                                    @input="validationForm.admnDepNm = null">
                                                <span v-if="validationForm.admnDepNm?.value" class="input-guide error">{{
                                                    validationForm.admnDepNm?.message
                                                }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="ui-section">
                    <div class="ui-title-3">
                        <h3>권한 정보</h3>
                    </div>
                    <div class="ui-content">
                        <div class="tbl-wrap">
                            <table class="table reg">
                                <colgroup>
                                    <col style="width: 160px;">
                                    <col style="width: auto;">
                                    <col style="width: 160px;">
                                    <col style="width: auto;">
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th scope="row">어드민 구분<span class="ess"><span class="offscreen">필수입력</span></span>
                                        </th>
                                        <td>
                                            <div class="reg-group inline">
                                                <div class="reg-item">
                                                    <select v-model="formData.admnPtnrTyCd" class="custom-select ss">
                                                        <option v-for="(item, index) in state.adminTypeList" :key="index"
                                                            :value="item.value">
                                                            {{ item.label }}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </td>
                                        <th scope="row">권한레벨<span class="ess"><span class="offscreen">필수입력</span></span>
                                        </th>
                                        <td>
                                            <div class="reg-group inline">
                                                <div class="reg-item">
                                                    <select v-model="formData.authSeCd" class="custom-select ss">
                                                        <option v-for="(item, index) in state.authTypeList" :key="index"
                                                            :value="item.value">
                                                            {{ item.label }}
                                                        </option>
                                                    </select>
                                                </div>
                                                <div v-if="formData.admnPtnrTyCd === 111003" class="reg-item">
                                                    <span class="checkbox ml-10">
                                                        <input id="isMD" v-model="formData.mdYn" false-value="N"
                                                            name="isMDGroup" true-value="Y" type="checkbox">
                                                        <label for="isMD">MD 여부 </label>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button class="btn btn-sl nega" type="button" @click="goToPage('/member/kb_admin/list')">취소</button>
            <button class="btn btn-sl posi" type="button" @click="saveAdmin">저장</button>
        </div>

        <DefaultModal :isShow="isRegComplete" buttonCancel="취소" buttonConfirm="권한설정" modalName="regComplete"
            modalTitle="KB어드민 회원 등록완료" @modalclose="modalClose">
            <template #modalcontent>
                <div class="ui-txt-guide">
                    <div class="ui-txt-guide-head">
                        <p>KB어드민 회원 등록이 완료되었습니다.<br>해당 계정의 권한을 설정하시겠습니까?</p>
                    </div>
                    <div class="ui-txt-guide-cont">
                        <p>계정의 권한은 권한관리 메뉴에서 설정하실 수 있습니다.</p>
                    </div>
                </div>
            </template>
        </DefaultModal>
    </section>
</template>
<script>
import { computed, inject, onMounted, reactive, ref } from 'vue';
import Commselect from '@/components/ui/CommSelect.vue';
import { _getDupicationId, _registAdmin } from '@/api/admin.js';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import codeList from '@/data/commcode/codeList.js';
import { useStore } from 'vuex';
export default {
    components: { Commselect, DefaultModal },
    setup() {
        const $Modal = inject('$Modal');
        const { goToPage } = useCommFunc();
        const isRegComplete = ref(false);
        const validationForm = ref({});
        const store = useStore();
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
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        onMounted(async () => {
            //어드민구분
            await codeList.getGroupCode(111000).then(result => {
                state.adminTypeList.push(...result);
            });
            //어드민권한레벨
            await codeList.getGroupCode(144000).then(result => {
                // 마스터 권한 삭제 20231206 jyt
                state.authTypeList.push(...result.filter(item => item.label !== 'Master'));
            });
        });

        const state = reactive({
            admnEmad1: null, // 이메일 앞
            admnEmad2Code: '103014', // 이메일 뒤
            admnEmad2: null,
            // 어드민 구분
            adminTypeList: [
                { label: '선택', value: null }
            ],
            // 권한레벨
            authTypeList: [
                { label: '선택', value: null }
            ],
            duplicatedId: true,
            mdChecked: false,
            menuCode: computed(() => menuInfo.value.menuCode)
        });

        const formData = ref({
            admnId: null, // 아이디
            admnNm: null, // 이름
            admnHhpnoFno: null, // 전화번호1
            admnHhpnoMno: null, // 전화번호2
            admnHhpnoBno: null, // 전화번호3
            admnDepNm: null,  // 부서명
            admnPtnrTyCd: state.authTypeList[0].value, // 어드민구분
            authSeCd: state.adminTypeList[0].value, // 권한레벨코드
            mdYn: null,  // MD 여부
            admnEmad: computed(() => {
                return !state.admnEmad2 || state.admnEmad2 === '직접입력' ? state.admnEmad1 : state.admnEmad1 + '@' + state.admnEmad2;
            }),
            menuCode: computed(() => state.menuCode)
        });


        const selectedOptions = (valueCode, valueName, type) => {
            if (type === 'mailType2') {
                state.admnEmad1 = '';
                state.admnEmad2 = valueName;
                state.admnEmad2Code = valueCode;
            }
        };

        const registAdmin = async () => {
            try {
                await _registAdmin(formData.value).then(result => {
                    if (result.data.code === 'OK') {
                        isRegComplete.value = true;
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        const checkDupicationId = async () => {
            if (!formData.value.admnId) {
                validationForm.value.admnId = { value: true, message: '아이디를 입력해주세요.', class: 'error' };
                return false;
            }
            try {
                await _getDupicationId(formData.value.admnId).then(result => {
                    if (result.data.data === 'Y') {
                        state.duplicatedId = true;
                        validationForm.value.admnId = { value: true, message: '사용할 수 없는 아이디입니다.', class: 'error' };
                    } else {
                        state.duplicatedId = false;
                        validationForm.value.admnId = { value: true, message: '사용할 수 있는 아이디입니다.' };
                    }
                });
            } catch (error) {
                console.log(error);
            }

        };

        const formValidation = () => {
            if (!formData.value.admnId) {
                validationForm.value.admnId = { value: true, message: '아이디를 입력해주세요.', class: 'error' };
                return false;
            }

            if (state.duplicatedId) {
                validationForm.value.admnId = { value: true, message: '아이디 중복확인 해주세요.', class: 'error' };
                return false;
            }

            if (!state.admnEmad1) {
                validationForm.value.admnEmad1 = { value: true, message: '이메일을 입력해주세요.', class: 'error' };
                return false;
            }

            if (!formData.value.admnNm) {
                validationForm.value.admnNm = { value: true, message: '이름을 입력해주세요.', class: 'error' };
                return false;
            }

            if (!formData.value.admnHhpnoFno || !formData.value.admnHhpnoMno || !formData.value.admnHhpnoBno) {
                validationForm.value.admnHhpno = { value: true, message: '휴대전화번호를 입력해주세요', class: 'error' };
                return false;
            }

            if (!formData.value.admnDepNm) {
                validationForm.value.admnDepNm = { value: true, message: '부서명을 입력해주세요', class: 'error' };
                return false;
            }

            if (!formData.value.admnPtnrTyCd) {
                $Modal.alert('어드민구분을 선택해주세요');
                return false;
            }

            if (!formData.value.authSeCd) {
                $Modal.alert('권한레벨을 선택해주세요');
                return false;
            }

            return true;
        };

        const saveAdmin = () => {
            if (formValidation()) {
                $Modal.confirm({
                    title: '',
                    message: '저장하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                }).then(success => {
                    if (success === 'confirm') {
                        registAdmin();
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        };

        // 등록완료
        const modalClose = (type, name) => {
            isRegComplete.value = false;

            if (type === 'modalconfirm') {
                goToPage('/authority/kb_admin/menus');
            } else {
                goToPage('/member/kb_admin/list');
            }
        };

        return {
            state,
            formData,
            validationForm,
            isRegComplete,
            checkDupicationId,
            selectedOptions,
            saveAdmin,
            goToPage,
            modalClose,
            menuInfo
        };
    }
};

</script>