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
                    <col style="width: 160px;">
                    <col style="width: auto;">
                </colgroup>
                <tbody>
                <tr>
                    <th scope="row">채널<span class="ess"><span class="offscreen">필수입력</span></span></th>
                    <td colspan="3">
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
                    <th scope="row">등록계정</th>
                    <td>KB헬스케어(KB admin)</td>
                    <th scope="row">발송목적<span class="ess"><span class="offscreen">필수입력</span></span></th>
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
                    <th scope="row">발송시간<span class="ess"><span class="offscreen">필수입력</span></span></th>
                    <td colspan="3">
                        <div class="reg-group inline">
                            <div class="reg-item">
                                <span v-for="(item, index) in state.immySndnYnList" :key="index" class="radio">
                                    <input :id="'immySndnYn' + index" v-model="formData.immySndnYn" :value="item.value"
                                           name="immySndnYn"
                                           type="radio">
                                    <label :for="'immySndnYn' + index">{{ item.label }}</label>
                                </span>
                            </div>
                            <div class="reg-item">
                                <dateTimeSingle v-model="formData.sndnDt" :disabled="formData.immySndnYn !=='N'"
                                                :minDateTime="dayJS().add(30,'minute')"></dateTimeSingle>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">메세지 제목<span class="ess"><span class="offscreen">필수입력</span></span></th>
                    <td colspan="3">
                        <div class="reg-group">
                            <div class="reg-item">
                                <input v-model="formData.ttl" :class="validationForm.ttl?.class" class="form-control" type="text"
                                       @input="validationForm.ttl=null">
                            </div>
                        </div>
                        <span :class="validationForm.ttl?.class" class="input-guide">{{ validationForm.ttl?.message ?? '문자의 제목은 사용자에게 발송되지 않습니다.' }}</span>
                    </td>
                </tr>
                <tr>
                    <th scope="row">발신번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                    <td colspan="3">
                        <div class="reg-group">
                            <div class="reg-item">
                                <input v-model="formData.sndnTlno" class="form-control" readonly type="text">
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">광고성 여부</th>
                    <td colspan="3">
                        <div class="reg-group">
                            <div class="reg-item">
                                <span class="checkbox">
                                    <input id="isAd" v-model="formData.adYn" false-value="N" name="isAdGroup" true-value="Y" type="checkbox">
                                    <label for="isAd">광고성</label>
                                </span>
                                <span class="input-guide inline">체크시 자동으로 (광고)표시가 됩니다.</span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">발송 내용<span class="ess"><span class="offscreen">필수입력</span></span></th>
                    <td colspan="3">
                        <div class="reg-group">
                            <div class="reg-item">
                                <div class="guide-form flex-11">
                                    <div class="textarea">
                                        <textarea id="textarea" v-model="formData.cts" :class="validationForm.cts?.class" class="form-control"
                                                  style="height: 100px" @input="validationForm.cts=null"></textarea>
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
                        <div class="abs rgl">
                            <button class="btn btn-slm" type="button" @click="isMessageTemplate=true">템플릿 불러오기</button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">수신거부 전화번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                    <td colspan="3">
                        <div class="reg-group">
                            <div class="reg-item">
                                <input v-model="formData.rcptDenTlno" class="form-control" readonly type="text">
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-if="state.channelName === 'PUSH'">
                    <th scope="row">부가정보</th>
                    <td colspan="3">
                        <div class="reg-group">
                            <div class="reg-item">
                                <input v-model="formData.addtInfCts" class="form-control" type="text">
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">이미지</th>
                    <td colspan="3">
                        <div class="reg-group">
                            <div class="reg-item">
                                <div class="btn-file">
                                    <input id="upload-file" ref="fileUpload" hidden="" type="file"
                                           @change="fileListUp('fileUploadList', fileUpload)">
                                    <label class="btn-up" for="upload-file">파일첨부</label>
                                </div>
                            </div>
                        </div>

                        <div class="upload-file-box">
                            <div class="upload-file-head flex space-between">
                                <button class="btn del-all btn-secondary" type="button">
                                    <span class="offscreen">전체파일삭제</span>
                                </button>
                                <span class="name">파일명</span><span class="volume">용량</span>
                            </div>
                            <div v-if="state.fileUploadList.length > 0" class="upload-file-list">
                                <div v-for="(item, index) in state.fileUploadList"
                                     :key="index" class="upload-file-list-item flex space-between">
                                    <button class="btn del btn-secondary" type="button"
                                            @click="fileListDel('fileUploadList')">
                                        <span class="offscreen">파일삭제</span>
                                    </button>
                                    <span class="name">{{ item.name }}</span>
                                    <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }}
                                                        MB</span>
                                </div>
                            </div>
                        </div>
                        <span class="input-guide">이미지 추가시 MMS로 발송됩니다.</span>
                        <span class="input-guide">이미지는 100K 이하의 JPG파일만 가능하며, 권장 사이즈는 1,500px * 1,500px 입니다.</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="ui-section">
            <subTitleBar ess="표시는 필수항목입니다." subTitle="발송대상"/>
            <div class="ui-content">
                <div class="tbl-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                        <tr>
                            <th scope="row">발송대상<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <span v-for="(item, index) in state.sendTargetList" :key="index" class="radio">
                                            <input :id="'sendTarget' + index" v-model="formData.sndnTrgTypCd" :value="item.value"
                                                   name="sendTarget"
                                                   type="radio" @input="changeSendType(item.label)">
                                            <label :for="'sendTarget' + index">{{ item.label }}
                                                <template v-if="formData.sndnTrgTypCd === item.value && targetGrid.targetList.length > 0">
                                                    (발송대상 수 : {{ targetGrid.targetList.length.toLocaleString('ko') }}명)
                                                </template>
                                            </label>
                                        </span>
                                    </div>
                                </div>
                                <div class="abs rgl">
                                    <button class="btn btn-slm" type="button" @click="openSendTarget">찾기</button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div v-if="targetGrid.targetList.length > 0" class="ui-section">
            <subTitleBar subTitle="발송대상 목록"/>
            <div class="ui-content">
                <div class="tbl-wrap">
                    <div ref="agGrid" :style="targetGrid.scrollHeight">
                        <AgGridVue :columnDefs="targetGrid.tableColum_c" :defaultColDef="targetGrid.defaultColDef"
                                   :domLayout="targetGrid.domLayout" :rowData="targetGrid.targetList" class="ag-theme-alpine"
                                   style="width:100%;height:100%"
                                   @cell-clicked="onCellClicked" @grid-ready="onGridReady">
                        </AgGridVue>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button class="btn btn-sl nega" type="button" @click="goToPageReplace('/alarm/message/list')">취소</button>
            <button class="btn btn-sl posi" type="button" @click="saveMessage">저장</button>
        </div>

        <!-- 메세지 템플릿 검색 -->
        <DefaultModal :isShow="isMessageTemplate" buttonCancel="닫기" buttonConfirm="선택" className="wide" modalName="messageTemplate"
                      modalTitle="메세지 템플릿 검색" @modalclose="modalControl">
            <template #modalcontent>
                <MessageTemplateSearch v-model="selectMessageTemplate" :channelTypeList="state.channelTypeList" :sendPurposeList="state.sendPurposeList"/>
            </template>
        </DefaultModal>

        <!-- 발송 대상 검색 -->
        <DefaultModal :isShow="isSendTarget" buttonCancel="취소" buttonConfirm="등록" className="full" modalName="sendTarget"
                      modalTitle="발송대상 검색" @modalclose="modalControl">
            <template #modalcontent>
                <SendTargetSearch v-model="targetGrid.serachTargetList" :channelName="state.channelName" :selectSndnTrgTypCd="formData.sndnTrgTypCd"
                                  :sendTargetList="state.sendTargetList"/>
            </template>
        </DefaultModal>

    </section>
</template>
<style scope>
.ag-body-vertical-scroll {
    display: none
}
</style>
<script>
//셀렉트박스 선택
import {computed, inject, onMounted, onUnmounted, reactive, ref} from 'vue';
import {useCommFunc} from '@/core/helper/common.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import dateTimeSingle from '@/components/ui/DateTimeSingle.vue';
import codeList from '@/data/commcode/codeList.js';
import MessageTemplateSearch from '@/components/ui/MessageTemplateSearch.vue';
import SendTargetSearch from '@/components/ui/SendTargetSearch.vue';
import {_uploadFile} from '@/api/common.js';
import {useRouter} from 'vue-router';
import {_getRcptDenTlno, _getSndnTlno, _registCustomerAlarmCreate, _registCustomerAlarmTempCrete} from '@/api/operate.js';
import {useStore} from "vuex";

export default {
    components: {SendTargetSearch, DefaultModal, dateTimeSingle, MessageTemplateSearch},
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const router = useRouter();
        const {goToPage, openModal} = useCommFunc();
        const isRegComplete = ref(false);
        const fileUpload = ref(null);
        const isMessageTemplate = ref(false);
        const isSendTarget = ref(false);
        const selectMessageTemplate = ref(null);
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
            channelTypeList: [], // 채널
            immySndnYnList: [
                {label: '즉시발송', value: 'Y'},
                {label: '예약발송', value: 'N'}
            ], // 발송시간
            sendTargetList: [], // 발송대상
            sendPurposeList: [], // 발송목적
            fileUploadList: [], // 파일업로드목록
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
            targetName: '회원',
            menuCode: menuInfo.value.menuCode
        });

        const targetGrid = reactive({
            tableColum_c: null,
            회원: [
                {headerName: '이름', field: 'mbrNm', flex: 1},
                {headerName: '아이디', field: 'mbrJnMthAcsId', flex: 1},
                {headerName: '휴대전화번호', field: 'mbrHhpno', flex: 1},
                {
                    headerName: '삭제',
                    flex: 0.3,
                    field: 'delete',
                    cellRenderer: param => {
                        return '<button type="button" class="btn btn-ss" >삭제</button>'
                    }
                }
            ],
            그룹: [
                {headerName: '그룹명', field: 'groupName', width: 250},
                {headerName: '그룹설명', field: 'groupDetail', flex: 1},
                {
                    headerName: '삭제',
                    width: 0.3,
                    field: 'delete',
                    cellRenderer: param => {
                        return '<button type="button" class="btn btn-ss" >삭제</button>'
                    }
                }
            ],
            //테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            gridApi: null,
            gridColumApi: null,
            targetList: [],
            serachTargetList: [],
            domLayout: computed(() => targetGrid.targetList.length < 5 ? 'autoHeight' : 'normal'),
            scrollHeight: computed(() => targetGrid.targetList.length < 5 ? '' : 'height:270px')
        });

        onMounted(() => {
            // 채널
            codeList.get('channel').then((result) => {
                state.channelTypeList = result.filter(item => item.label !== '알림톡');
                state.channelName = state.channelTypeList[0].label;
                formData.value.chnCd = state.channelTypeList[0].value;
            });

            // 발송대상
            codeList.get('sendTarget').then((result) => {
                state.sendTargetList = result;
                formData.value.sndnTrgTypCd = state.sendTargetList[0].value;
            });

            // 발송목적
            codeList.get('sendPurpose').then((result) => {
                state.sendPurposeList = result;
                formData.value.sndnPuCd = state.sendPurposeList[0].value;
            });

            //발송번호 조회
            _getSndnTlno().then(result => {
                formData.value.sndnTlno = result.data.data;
            });
            //수신거부번호 조회
            _getRcptDenTlno().then(result => {
                formData.value.rcptDenTlno = result.data.data;
            });

            targetGrid.tableColum_c = _.clone(targetGrid[state.targetName]);
        });

        const formData = ref({
            chnCd: null,  //채널코드
            sndnPuCd: null, //발송목적코드
            sndnDt: null,  //발송시간
            ttl: null,  //메세지제목
            sndnTlno: null,  //발신전화번호
            cts: null,  //내용
            adYn: 'N',  //광고성여부
            rcptDenTlno: null,  //수신거부전화번호
            sndnTrgTypCd: null,  //발송대상타입코드
            flSn: null,  //파일순번
            addtInfCts: null, // 부가정보
            sndnTgpNmArray: computed(() => targetGrid.targetList.map(item => item.mbrSn)),  //발송대상배열
            sndnTgpNm: computed(() => '[' + formData.value.sndnTgpNmArray.toString() + ']'),  //발송대상
            fstRgtrSn: '1', // 어드민 순번 todo 어드민순번 맵핑 필요
            immySndnYn: 'Y'  // 즉시발송여부
        });

        //  파일 업로드 목록
        const fileListUp = (type) => {
            state[type] = (Array.from(fileUpload.value.files));
        };

        // 파일 리스트 삭제
        const fileListDel = (type) => {
            state[type] = [];
        };

        const modalControl = (type, modalName) => {
            if (modalName === 'messageTemplate') {
                if (type === 'modalconfirm') {
                    if (!!selectMessageTemplate.value) {
                        formData.value.chnCd = selectMessageTemplate.value.chnCd; // 채널
                        formData.value.ttl = selectMessageTemplate.value.ttl; // 제목
                        formData.value.sndnPuCd = selectMessageTemplate.value.sndnPuCd; // 발송목적
                        formData.value.cts = selectMessageTemplate.value.cts; // 내용
                        selectMessageTemplate.value = null;
                    }
                }
                isMessageTemplate.value = false;
            }
            if (modalName === 'sendTarget') {
                if (type === 'modalconfirm') {
                    targetGrid.targetList = [...new Map([...targetGrid.targetList, ...targetGrid.serachTargetList].map(item => [item.mbrSn, item])).values()];
                }

                targetGrid.serachTargetList = [];
                isSendTarget.value = false;
            }
        };

        const onGridReady = (params) => {
            targetGrid.gridApi = params.api;
            targetGrid.gridColumApi = params.columnApi;
        };

        // 채널변경시 발송내용 양식 변경
        const channelChange = (item) => {
            state.channelName = item;
        };

        const openSendTarget = () => {
            isSendTarget.value = true;
        };

        // 발송대상 변경
        const changeSendType = (item) => {
            targetGrid.targetList = [];
            targetGrid.tableColum_c = _.clone(targetGrid[item]);
        };

        // 발송대상 삭제
        const delelteTarget = (e) => {
            targetGrid.targetList = targetGrid.targetList.filter(item => item.mbrSn !== e.data.mbrSn);
        };

        const saveMessage = () => {
            if (formValidation()) {
                $Modal.confirm({
                    title: '',
                    message: '작성한 메세지를 템플릿으로 등록하시겠습니까?',
                    buttonText: {
                        confirm: '예',
                        cancel: '아니요'
                    }
                }).then(async (success) => {
                    // 템플릿 저장
                    const resultTemplate = await registTemplate();
                    // 업로드 저장
                    const resultUpload = resultTemplate ? await uploadFile('fileUploadList') : false;
                    // 메세지 저장
                    const resultMessage = resultUpload ? await registMessage() : false;

                }).catch(async error => {
                    // 업로드 저장
                    const resultUpload = await uploadFile('fileUploadList');
                    // 메세지 저장
                    const resultMessage = resultUpload ? await registMessage() : false;

                });
            }
        };

        const formValidation = () => {
            ///return true;
            if (!formData.value.ttl) {
                validationForm.value.ttl = {value: true, message: '제목을 입력해주세요.', class: 'error'};
                return false;
            }

            if (!formData.value.sndnTlno) {
                $Modal.alert('발신번호를 입력해주세요');
                return false;
            }

            if (!formData.value.cts) {
                validationForm.value.cts = {value: true, message: '발송내용을 입력해주세요.', class: 'error'};
                return false;
            }

            if (state.contentsMaxSize[state.channelName].size < state.contentsMaxSize.count) {
                validationForm.value.cts = {value: true, message: '발송내용 사이즈를 초과했습니다.', class: 'error'};
                return false;
            }

            if (!formData.value.rcptDenTlno) {
                $Modal.alert('수신전화거부를 입력해주세요');
                return false;
            }

            if (formData.value.sndnTgpNmArray.length === 0) {
                $Modal.alert('발송대상을 선택해주세요');
                return false;
            }
            return true;
        };

        // 메세지 등록
        const registMessage = async () => {
            try {
                // 즉시 발송일때 날짜 null
                formData.value.sndnDt = formData.value.immySndnYn === 'Y' ? null : formData.value.sndnDt + ':00';
                await _registCustomerAlarmCreate(formData.value).then(result => {
                    if (result.data.code === 'OK') {
                        goToPageReplace('/alarm/message/list');
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        // 템플릿 등록
        const registTemplate = async () => {
            try {
                return await _registCustomerAlarmTempCrete(formData.value).then(result => {
                    return result.data.code === 'OK';
                });
            } catch (error) {
                console.log(error);
                return false;
            }
        };

        //파일업로드 API
        const uploadFile = async (type) => {
            if (state[type].length > 0) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', state[type][0]);
                try {
                    return await _uploadFile(uploadFormData).then(result => {
                        formData.value.flSn = result.data.fileId;
                        return true;
                    });
                } catch (error) {
                    $Modal.alert('파일업로드 오류');
                    console.log(error);
                    return false;
                }
            }
            return true;
        };

        const goToPageReplace = (param) => {
            router.replace(param);
        };

        //테이블 셀 선택
        const onCellClicked = (e) => {
            //삭제
            if (e.colDef.field === 'delete') delelteTarget(e)
        };

        return {
            state,
            formData,
            isRegComplete,
            fileUpload,
            isMessageTemplate,
            isSendTarget,
            targetGrid,
            selectMessageTemplate,
            validationForm,
            getCount,
            dayJS,
            onGridReady,
            fileListUp,
            openModal,
            goToPage,
            goToPageReplace,
            fileListDel,
            modalControl,
            channelChange,
            openSendTarget,
            changeSendType,
            saveMessage,
            onCellClicked
        };
    }
};

</script>