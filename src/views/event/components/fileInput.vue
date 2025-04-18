<template>
    <tr v-for="(item, index) in state.fileInputList" :key="index">
        <!-- {{ state.fileInputList }} -->
        <td>
            <span class="checkbox">
                <input :id="'mainChk' + (index + 1)" name="menuGroup" type="checkbox"
                    @change="selectInput('checkbox', 'mainChk' + (index + 1), index, item)" v-model="item.checkbox">
                <label :for="'mainChk' + (index + 1)"></label>
            </span>
        </td>
        <td>
            <!-- {{ item }} -->
            <div class="reg-group wp-100">
                <div class="reg-item">
                    <div class="btn-file">
                        <input type="file" :id="'upload-file' + (index + 1)" hidden=""
                            @change="fileListUp('mainImgList' + (index + 1), index, 'upload-file' + (index + 1), index)" />
                        <label class="btn-up" :for="'upload-file' + (index + 1)">파일첨부</label>
                    </div>

                </div>

            </div>

            <!-- 파일 업로드 -->
            <div class="upload-file-box">
                <div class="upload-file-head flex space-between">
                    <button type="button" class="btn del-all btn-secondary">
                        <span class="offscreen">전체파일삭제</span>
                    </button>
                    <span class="name">파일명</span><span class="volume">용량</span>
                </div>

                <div class="upload-file-list" v-if="state.fileInputList[index].fileName[0].name">
                    <div class="upload-file-list-item flex space-between">
                        <button type="button" class="btn del btn-secondary" @click="fileListDel('mainImgList1', `upload-file${index + 1}`)"> <!-- file id : upload-file${index + 1} -->
                            <span class="offscreen">파일삭제</span>
                        </button>
                        <span class="name">{{ state.fileInputList[index].fileName[0].name }}</span>
                        <span class="volume">{{ (state.fileInputList[index].fileName[0].size / (1024 * 1024)).toFixed(1) }}
                            MB</span>
                    </div>
                </div>
            </div>
            <div v-if="state.checkValidState">
                <p class="input-guide" :class="{ 'error': state.errorStatus }">
                    {{ state.errorMessage }}
                </p>
            </div>
        </td>
        <td>
            <div class="reg-group wp-100">
                <div class="reg-item">
                    <input type="text" class="form-control" placeholder="텍스트 리더기로 읽을 수 있도록 이미지 내용을 입력하십시오"
                        @change="selectInput('imgdec', 'imgdectext' + index, index, item)" :id="'imgdectext' + index"
                        v-model="item.filedec" :class="state.checkValidState_dec ? 'error' : ''">
                </div>

            </div>
            <div v-if="state.checkValidState_dec">
                <p class="input-guide" :class="{ 'error': state.errorStatus }">
                    {{ state.errorMessage }}
                </p>
            </div>
        </td>
        <td>
            <div class="reg-group inline">
                <div class="reg-item">
                    <input type="number" class="form-control w-100"
                        @input="selectInput('imgorder', 'imgorder' + index, index, item)" :id="'imgorder' + index"
                        v-model="item.order">
                </div>
            </div>

        </td>
    </tr>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
export default {
    props: ['fileInputList', 'checkValidState', 'errorMessage', 'errorStatus', 'checkValidState_dec', 'formData'],
    emits: ['changefileList', 'fileListDel'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const state = reactive({
            fileInputList: computed(() => props.fileInputList),
            formData: computed(() => props.formData),
            checkValidState: computed(() => props.checkValidState),
            checkValidState_dec: computed(() => props.checkValidState_dec),
            errorMessage: computed(() => props.errorMessage),
            errorStatus: computed(() => props.errorStatus),
            mainImgList1: [],
            mainImgList2: [],
            mainImgList3: [],
            mainImgList4: [],
            mainImgList5: [],
            orderNum: 1

        });


        //파일업로드
        const fileListUp = (type, index, inputName, value) => {
            let refName = document.getElementById(inputName);
            state[type] = (Array.from(refName.files));
            state.fileInputList[index].filedName = Array.from(refName.files);
            console.log(refName.files, state.fileInputList[0].filedName);
            console.log('fileListUp >>> ', type, index, inputName, value);
            emit('changefileList', 'inputFile', inputName, index, state[type]);

        };
        const fileListDel = (type, fileId) => {
            const target = document.getElementById(fileId);
            target.value = '';
            emit('fileListDel');
        };
        const selectInput = (caseType, index, type, value) => {
            emit('changefileList', caseType, index, type, value);
        };
        return {
            state,
            fileListUp,
            fileListDel,
            selectInput
        };
    }
};
</script>