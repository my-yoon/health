<template>
    <tr v-for="(item, index) in state.fileInputList" :key="index">

        <td>
            <span class="checkbox">
                <input :id="'atendChk' + (index + 1)" name="atendGroup" type="checkbox"
                    @change="selectInput('checkbox', 'atendChk' + (index + 1), index, item)" v-model="item.checkbox">
                <label :for="'atendChk' + (index + 1)"></label>
            </span>
        </td>
        <td>
            <!-- {{ item }} -->
            <div class="reg-group wp-100">
                <div class="reg-item">
                    <select class="custom-select" :id="'eventdayOption' + index" v-model="item.chcEps"
                        @change="selectInput('selectChange', index, 'chcEps', item.chcEps)">
                        <option :value="item" v-for="(item, index) in state.eventDayOption" :key="index">
                            {{ item }}
                        </option>
                    </select>
                </div>
            </div>
        </td>
        <td>
            <!-- caseType, index, type, value -->
            <div class="reg-group wp-100">
                <div class="reg-item">
                    <input type="number" class="form-control" v-model="item.chcEpsPayPnt"
                        @focus="selectInput('inputChange', index, 'chcEpsPayPnt', item.chcEpsPayPnt)">
                    <span class="unit">P</span>
                </div>
            </div>
        </td>
        <template v-if="!state.eventSn">
            <td>
                <!-- {{ item }} -->
                <div class="reg-group wp-100">
                    <div class="reg-item">
                        <div class="btn-file">
                            <input type="file" :id="'upload-atndfile' + (index + 1)" hidden=""
                                @change="fileListUp('fileUploadtype1', index, 'upload-atndfile' + (index + 1))" />
                            <label class="btn-up" :for="'upload-atndfile' + (index + 1)">파일첨부</label>
                        </div>
                    </div>
                </div>
                <!-- 파일 업로드 -->
                <div class="upload-file-box w-500">
                    <div class="upload-file-head flex space-between">
                        <button type="button" class="btn del-all btn-secondary">
                            <span class="offscreen">전체파일삭제</span>
                        </button>
                        <span class="name">파일명</span><span class="volume">용량</span>
                    </div>
                    <div class="upload-file-list">
                        <div class="upload-file-list-item flex space-between"
                            v-for="(item, idx) in state.chcEpsPayImg1[index].fileUploadtype1" :key="idx">
                            <button type="button" class="btn del btn-secondary"
                                @click="fileListDel(`chcEpsPayImg1_${(index + 1)}`, index, `upload-atndfile${index + 1}`)">
                                <span class="offscreen">파일삭제</span>
                            </button>
                            <span class="name">{{ item.name }}</span>
                            <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }} MB</span>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <!-- {{ item }} -->
                <div class="reg-group wp-100">
                    <div class="reg-item">
                        <div class="btn-file">
                            <input type="file" :id="'upload-atndfile2' + (index + 1)" hidden=""
                                @change="fileListUp('fileUploadtype2', index, 'upload-atndfile2' + (index + 1))" />
                            <label class="btn-up" :for="'upload-atndfile2' + (index + 1)">파일첨부</label>
                        </div>
                    </div>
                </div>
                <!-- 파일 업로드 -->
                <div class="upload-file-box w-500">
                    <div class="upload-file-head flex space-between">
                        <button type="button" class="btn del-all btn-secondary">
                            <span class="offscreen">전체파일삭제</span>
                        </button>
                        <span class="name">파일명</span><span class="volume">용량</span>
                    </div>
                    <div class="upload-file-list">
                        <div class="upload-file-list-item flex space-between"
                            v-for="(item, idx) in state.chcEpsPayImg1[index].fileUploadtype2" :key="idx">

                            <button type="button" class="btn del btn-secondary"
                                @click="fileListDel(`chcEpsPayImg2_${(index + 1)}`, index, `upload-atndfile2${index + 1}`)">
                                <span class="offscreen">파일삭제</span>
                            </button>
                            <span class="name">{{ item.name }}</span>
                            <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }} MB</span>
                        </div>
                    </div>
                </div>
            </td>
        </template>
        <template v-else>
            <td>
                <!-- {{ item }} -->
                <div class="reg-group wp-100">
                    <div class="reg-item">
                        <div class="btn-file">
                            <input type="file" :id="'upload-atndfile' + (index + 1)" hidden=""
                                @change="fileListUp('fileUploadtype1', index, 'upload-atndfile' + (index + 1))" />
                            <label class="btn-up" :for="'upload-atndfile' + (index + 1)">파일첨부</label>
                        </div>
                    </div>
                </div>
                <!-- 파일 업로드 -->
                <div class="upload-file-box w-500">
                    <div class="upload-file-head flex space-between">
                        <button type="button" class="btn del-all btn-secondary">
                            <span class="offscreen">전체파일삭제</span>
                        </button>
                        <span class="name">파일명</span><span class="volume">용량</span>
                    </div>
                    <div class="upload-file-list">
                        <div class="upload-file-list-item flex space-between">
                            <button type="button" class="btn del btn-secondary"
                                @click="fileListDel(`chcEpsPayImg1_${(index + 1)}`, index, `upload-atndfile${index + 1}`)">
                                <span class="offscreen">파일삭제</span>
                            </button>
                            <span class="name">{{ item.chcEpsPayImg1Name }}</span>
                            <span class="volume">{{ (item.chcEpsPayImg1size / (1024 * 1024)).toFixed(1) }} MB</span>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <!-- {{ item }} -->
                <div class="reg-group wp-100">
                    <div class="reg-item">
                        <div class="btn-file">
                            <input type="file" :id="'upload-atndfile2' + (index + 1)" hidden=""
                                @change="fileListUp('fileUploadtype2', index, 'upload-atndfile2' + (index + 1))" />
                            <label class="btn-up" :for="'upload-atndfile2' + (index + 1)">파일첨부</label>
                        </div>
                    </div>
                </div>
                <!-- 파일 업로드 -->
                <div class="upload-file-box w-500">
                    <div class="upload-file-head flex space-between">
                        <button type="button" class="btn del-all btn-secondary">
                            <span class="offscreen">전체파일삭제</span>
                        </button>
                        <span class="name">파일명</span><span class="volume">용량</span>
                    </div>
                    <div class="upload-file-list">
                        <div class="upload-file-list-item flex space-between">

                            <button type="button" class="btn del btn-secondary"
                                @click="fileListDel(`chcEpsPayImg2_${(index + 1)}`, index, `upload-atndfile2${index + 1}`)">
                                <span class="offscreen">파일삭제</span>
                            </button>
                            <span class="name">{{ item.chcEpsPayImg2Name }}</span>
                            <span class="volume">{{ (item.chcEpsPayImg2size / (1024 * 1024)).toFixed(1) }} MB</span>
                        </div>
                    </div>
                </div>
            </td>
        </template>
    </tr>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
export default {
    props: ['fileInputList_Atnd', 'eventDayOption', 'pointValue', 'eventSn'],
    emits: ['changefileList', 'chiocePoint', 'fileListDel'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const route = useRoute();
        const state = reactive({
            eventSn: computed(() => props.eventSn),
            fileInputList: computed(() => props.fileInputList_Atnd),
            eventDayOption: computed(() => props.eventDayOption),
            pointValue: computed(() => props.pointValue),
            chcEpsPayImg1: [
                { 'fileUploadtype1': '', 'fileUploadtype2': '' }
            ]
        });
        //누적혜택 변경감지 히여 추가 
        watch(props.fileInputList_Atnd, () => {
            if (!state.eventSn) {
                let newObj = { 'fileUploadtype1': '', 'fileUploadtype2': '' };
                for (let i = 0; i < (state.fileInputList.length - state.chcEpsPayImg1.length); i++) {
                    state.chcEpsPayImg1.push(newObj);
                }
            }
        });
        onMounted(() => {
            if (state.eventSn) {
                console.log(state.fileInputList);
            }

        });
        //파일업로드
        const fileListUp = (type, index, inputName, value) => {
            let refName = document.getElementById(inputName);
            if (!state.eventSn) {
                if (type === 'fileUploadtype1') {
                    state.chcEpsPayImg1[index].fileUploadtype1 = (Array.from(refName.files));
                } else if (type === 'fileUploadtype2') {
                    state.chcEpsPayImg1[index].fileUploadtype2 = (Array.from(refName.files));
                }
                emit('changefileList', 'inputFile', index, inputName, state.chcEpsPayImg1, (Array.from(refName.files)), type);
            } else {
                let files = Array.from(refName.files);
                emit('changefileList', 'inputFile', index, inputName, '', files, type);
            }

        };
        //누적혜택 삭제
        const fileListDel = (type, index, fileId) => {
            const target = document.getElementById(fileId);
            target.value = '';
            // console.log('<<< fileListDel >>>', type, index);
            emit('fileListDel', type, index);
        };
        //input value 처리 
        const selectInput = (caseType, index, type, value) => {
            if (type === 'chcEpsPayPnt') {
                emit('chiocePoint', 'open', type, index);
            } else {
                emit('changefileList', caseType, index, type, value);
            }
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