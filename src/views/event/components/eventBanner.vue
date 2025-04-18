<template>
    <div class="ui-section">
        <subTitleBar :subTitle="'이벤트 배너'" :ess="'표시는 필수항목입니다.'" />
        <div class="ui-content">
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">배너 이미지<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <div class="btn-file">
                                            <input type="file" id="upload-file" hidden="" ref="fileUploadBanner"
                                                @change="onChangeValue('bannerList', fileUploadBanner)">
                                            <label class="btn-up" for="upload-file">파일첨부</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="upload-file-box">
                                    <div class="upload-file-head flex space-between">
                                        <button type="button" class="btn del-all btn-secondary">
                                            <span class="offscreen">전체파일삭제</span>
                                        </button>
                                        <span class="name">파일명</span><span class="volume">용량</span>
                                    </div>
                                    <div class="upload-file-list" v-if="state.bannerList.length > 0">
                                        <div class="upload-file-list-item flex space-between"
                                            v-for="(item, index) in state.bannerList" :key="index">
                                            <button type="button" class="btn del btn-secondary"
                                                @click="fileListDel('bannerList')">
                                                <span class="offscreen">파일삭제</span>
                                            </button>
                                            <span class="name">{{ item.name }}</span>
                                            <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }}
                                                MB</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="state.bannerVal">
                                    <p class="input-guide" :class="{ 'error': state.errorStatus }">
                                        {{ state.errorMessage }}
                                    </p>
                                </div>
                            </td>
                            <th scope="row">이미지 설명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group wp-100">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" :class="state.bannerDec ? 'error' : ''"
                                            placeholder="텍스트 리더기로 읽을 수 있도록 이미지 내용을 입력하십시오"
                                            v-model="state.formData.bannerImgDesc"
                                            @change="onChangeValue('bannerImgDesc', state.formData.bannerImgDesc)">
                                        <!--  -->
                                    </div>
                                </div>
                                <div v-if="state.bannerDec">
                                    <p class="input-guide" :class="{ 'error': state.errorStatus }">
                                        {{ state.errorMessage }}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="ui-table-guide">
                <span class="input-guide">배너 이미지는 327*160, 654*320, 981*480px 기준으로 제작되어야 합니다.</span>
                <span class="input-guide">이미지 설명은 시각 장애인이 텍스트 리더기를 통해 읽을 수 있도록 사용하는 목적이므로 가급적 자세한 정보를 입력하십시오.</span>
            </div>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
export default {
    props: ['formData', 'bannerList', 'bannerVal', 'bannerDec', 'errorMessage', 'errorStatus'],
    emits: ['fileListUp', 'fileListDel', 'bannerDec'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const fileUploadBanner = ref(null);
        const route = useRoute();
        const state = reactive({
            bannerVal: computed(() => props.bannerVal),
            bannerDec: computed(() => props.bannerDec),
            errorMessage: computed(() => props.errorMessage),
            errorStatus: computed(() => props.errorStatus),
            formData: computed(() => props.formData),
            bannerList: computed(() => props.bannerList)
        });

        onMounted(() => {
            if (route.query.eventSn) {
                console.log(route.query.eventSn);
            }
        });

        const onChangeValue = (caseType, value) => {
            console.log(caseType, value);
            if (caseType === 'bannerList') {
                let inputName = fileUploadBanner;
                let inputfile = (Array.from(inputName.value.files));
                emit('fileListUp', caseType, inputfile);
            } else {
                emit('bannerDec', caseType, value);
            }

            // console.log(caseType, value);
            // if (value === 'LINK') {
            //     state.hintText = '';
            // }
            // if (value === 'TEXT') { state.hintLink = ''; }
            // emit('formDataChange', caseType, value);
        };
        const fileListDel = (type) => {
            const target = document.getElementById('upload-file');
            target.value = '';
            emit('fileListDel', type);
        };
        return {
            state,
            onChangeValue,
            fileUploadBanner,
            fileListDel

        };
    }
};
</script>