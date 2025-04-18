<template>
    <div class="ui-section">
        <subTitleBar :subTitle="'기타컨텐츠'" :ess="'표시는 필수항목입니다.'" />
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
                            <th scope="row">백그라운드 이미지<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <div class="btn-file">
                                            <input type="file" id="fileUploadBack" hidden=""
                                                @change="onChangeImg('img', 'backImgList', 'fileUploadBack')">
                                            <label class="btn-up" for="fileUploadBack">파일첨부</label>
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
                                    <div class="upload-file-list" v-if="state.backImgList.length > 0">
                                        <div class="upload-file-list-item flex space-between"
                                            v-for="(item, index) in state.backImgList" :key="index">
                                            <button type="button" class="btn del btn-secondary"
                                                @click="fileListDel('backImgList')">
                                                <span class="offscreen">파일삭제</span>
                                            </button>
                                            <span class="name">{{ item.name }}</span>
                                            <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }}
                                                MB</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <th scope="row">이미지 설명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group wp-100">
                                    <div class="reg-item">
                                        <input type="text" class="form-control"
                                            placeholder="텍스트 리더기로 읽을 수 있도록 이미지 내용을 입력하십시오"
                                            v-model="state.formData.bkgImgDesc"
                                            @change="onChangeImg('text', 'bkgImgDesc', state.formData.bkgImgDesc)">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">하단이미지 이미지</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <div class="btn-file">
                                            <input type="file" id="fileUploadBottom" hidden=""
                                                @change="onChangeImg('img', 'bottomImgList', 'fileUploadBottom')">
                                            <label class="btn-up" for="fileUploadBottom">파일첨부</label>
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
                                    <div class="upload-file-list" v-if="state.bottomImgList.length > 0">
                                        <div class="upload-file-list-item flex space-between"
                                            v-for="(item, index) in state.bottomImgList" :key="index">
                                            <button type="button" class="btn del btn-secondary"
                                                @click="fileListDel('bottomImgList')">
                                                <span class="offscreen">파일삭제</span>
                                            </button>
                                            <span class="name">{{ item.name }}</span>
                                            <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }}
                                                MB</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <th scope="row">이미지 설명</th>
                            <td>
                                <div class="reg-group wp-100">
                                    <div class="reg-item">
                                        <input type="text" class="form-control"
                                            placeholder="텍스트 리더기로 읽을 수 있도록 이미지 내용을 입력하십시오"
                                            v-model="state.formData.bottomImgDesc"
                                            @change="onChangeImg('text', 'bottomImgDesc', state.formData.bottomImgDesc)">
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="ui-table-guide">
                <span class="input-guide">백그라운드 이미지는 가로 375, 750, 1125px 기준으로 제작되어야 합니다.</span>
                <span class="input-guide">하단 컨텐츠 이미지는 가로 375, 750, 1125px 기준으로 제작되어야 하며 참여 방법, 유의 사항 등에 사용할 수 있습니다.</span>
                <span class="input-guide">이미지 설명은 시각 장애인이 텍스트 리더기를 통해 읽을 수 있도록 사용하는 목적이므로 가급적 자세한 정보를 입력하십시오.</span>
            </div>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DateSingle from '@/components/ui/DateSingle.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
export default {
    components: { DefaultModal, DateSerch, DateSingle },
    props: ['backImgList', 'formData', 'bottomImgList'],
    emits: ['changeImg', 'changeText', 'fileListDel'],
    setup(props) {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow, isRequestShow } = useCommFunc();
        const store = useStore();
        const { emit } = getCurrentInstance();
        const state = reactive({
            formData: computed(() => props.formData),
            backImgList: computed(() => props.backImgList),
            bottomImgList: computed(() => props.bottomImgList)
        });
        const onChangeImg = (inputType, caseType, value) => {
            if (inputType === 'img') {
                emit('changeImg', caseType, value);
            } else {
                emit('changeText', caseType, value);
            }
        };
        const fileListDel = (type) => {
            const target = (type === 'backImgList') ? document.getElementById('fileUploadBack') : document.getElementById('fileUploadBottom');
            target.value = '';
            emit('fileListDel', type);
        };


        return {
            state,
            onChangeImg,
            fileListDel

        };
    }
};
</script>