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
                <tr v-if="!!formData.prStCd">
                    <th scope="row">승인상태</th>
                    <td>
                        {{ state.aprvName }}
                        <button v-if="formData.tdnYn === 'Y'" class="btn btn-slm inline ml-10" type="button" @click="reasonPopup">사유보기</button>
                    </td>
                    <th scope="row">처리일자</th>
                    <td>{{ formData.lastUpdrDt }}</td>
                </tr>
                <tr v-else>
                    <th scope="row">승인상태</th>
                    <td colspan="3">승인대기</td>
                </tr>
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
                    <th scope="row">카테고리<span class="ess"><span class="offscreen">필수입력</span></span></th>
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
                                <dateTimeSingle v-model="formData.sndnDt" :disabled="formData.immySndnYn !=='N'"></dateTimeSingle>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">메세지 제목<span class="ess"><span class="offscreen">필수입력</span></span></th>
                    <td colspan="3">
                        <div class="reg-group">
                            <div class="reg-item">
                                <input v-model="formData.ttl" class="form-control" type="text">
                            </div>
                        </div>
                        <span class="input-guide">문자의 제목은 사용자에게 발송되지 않습니다.</span>
                    </td>
                </tr>
                <tr>
                    <th scope="row">발신번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                    <td colspan="3">
                        <div class="reg-group">
                            <div class="reg-item">
                                <input v-model="formData.sndnTlno" class="form-control" maxlength="11" readonly type="text">
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
                                <div class="textarea">
                                    <textarea id="textarea" v-model="formData.cts" class="form-control" style="height: 100px"></textarea>
                                    <div class="txt-counter">
                                        <strong>{{ formData.cts?.length ?? 0 }}</strong> / <span>{{
                                            state.contentsMaxSize[state.channelName].size
                                        }} {{ state.contentsMaxSize[state.channelName].unit }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">수신거부 전화번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                    <td colspan="3">
                        <div class="reg-group">
                            <div class="reg-item">
                                <input v-model="formData.rcptDenTlno" class="form-control" maxlength="11" readonly type="text">
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
                                <button class="btn del-all btn-secondary" type="button" @click="fileListDel('fileUploadList')">
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
                                    <span class="name">{{ item.name ?? item.flOrgnNm }}</span>
                                    <span class="volume">{{ (item.size ?? item.flSize / (1024 * 1024)).toFixed(1) }}
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
                                   style="width:100%;height:100%" @cell-clicked="onCellClicked" @grid-ready="onGridReady">
                        </AgGridVue>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button class="btn btn-sl nega" type="button" @click="goToPageReplace('/alarm/message/list')">목록</button>
            <button v-if="state.deleteBtnShow" class="btn btn-sl posi" type="button" @click="deleteMessage">삭제</button>
            <button v-if="state.rejectBtnShow" class="btn btn-sl posi" type="button" @click="isReject=true">반려</button>
            <button v-if="state.approveBtnShow" class="btn btn-sl posi" type="button" @click="registApprove">승인</button>
            <button v-if="state.holdBtnShow" class="btn btn-sl posi" type="button" @click="registHold('Y')">보류</button>
            <button v-if="state.holdCancelBtnShow" class="btn btn-sl posi" type="button" @click="registHold('N')">보류취소</button>


        </div>

        <!-- 발송 대상 검색 -->
        <DefaultModal :isShow="isSendTarget" buttonCancel="취소" buttonConfirm="등록" className="full" modalName="sendTarget"
                      modalTitle="발송대상 검색" @modalclose="modalControl">
            <template #modalcontent>
                <SendTargetSearch v-model="targetGrid.serachTargetList" :selectSndnTrgTypCd="formData.sndnTrgTypCd" :sendTargetList="state.sendTargetList"/>
            </template>
        </DefaultModal>

        <!-- 반려 사유  -->
        <DefaultModal :isShow="isReject" buttonCancel="취소" buttonConfirm="등록" modalName="reject"
                      modalTitle="반려 사유 등록" @modalclose="modalControl">
            <template #modalcontent>
                <RejectModalCon @rejectFormat="rejectFormat"/>
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
import {useRoute, useRouter} from 'vue-router';
import {
    _deleteCustomerAlarmDelete,
    _editCustomerAlarmUpdate, _getCustomerAlarmDetail, _getUserList, _registCustomerAlarmApprove, _registCustomerAlarmHold, _registCustomerAlarmReject
} from '@/api/operate.js';
import RejectModalCon from '@/components/ui/RejectModalCon.vue';
import {useStore} from "vuex";

export default {
    components: {RejectModalCon, SendTargetSearch, DefaultModal, dateTimeSingle, MessageTemplateSearch},
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
        const route = useRoute();
        const isReject = ref(false);
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        
        const modalInfo = reactive({
            title: '안내',
            message: '',
            buttonText: {
                ok: '확인'
            }
        });

        const state = reactive({
            cstNcSn: null,
            channelTypeList: [], // 채널
            immySndnYnList: [
                {label: '즉시발송', value: 'Y'},
                {label: '예약발송', value: 'N'}
            ], // 발송시간
            sendTargetList: [], // 발송대상
            sendPurposeList: [], // 발송목적
            fileUploadList: [], // 파일업로드목록
            aprvTypeList: [], // 결재상태
            aprvName: null, // 결재상태명
            contentsMaxSize: {
                SMS: {
                    size: 2000,
                    unit: 'Byte',
                    valitate: () => {
                    }
                },
                PUSH: {
                    size: 512,
                    unit: '자',
                    valitate: () => {
                    }
                },
                알림톡: {
                    size: 2000,
                    unit: 'Byte',
                    valitate: () => {
                    }
                }
            },
            channelName: 'SMS',
            targetName: '회원',
            originSndnDt: null,  // 기존 등록시간
            approveAbled: computed(() => dayJS().diff(state.originSndnDt) < 0), // 승인가능 상태 승인버튼 활성화 되어있어도 승인 안됨
            approveBtnShow: computed(() => {
                // 승인버튼 노출 조건
                // 승인대기 시 - 발송시간 전
                if (formData.value.aprvYn === 'N' && formData.value.whldYn === 'N' && formData.value.tdnYn === 'N') {
                    return true;
                }
                return false;
            }),
            deleteBtnShow: computed(() => {
                // 삭제버튼 노출 조건
                // 승인완료 - 발송시간 이후 비노출
                if (formData.value.aprvYn === 'Y') {
                    // 현재일기준
                    return dayJS().diff(state.originSndnDt) < 0;
                }
                return true;
            }),
            rejectBtnShow: computed(() => {
                // 반려버튼 노출 조건
                // 승인대기 시
                if (formData.value.aprvYn === 'N' && formData.value.whldYn === 'N' && formData.value.tdnYn === 'N') {
                    return true;
                }
                return false;
            }),
            holdBtnShow: computed(() => {
                // 보류버튼 노출 조건
                // 승인시
                if (!!formData.value.prStCd && formData.value.aprvYn === 'Y' && formData.value.tdnYn === 'N' && formData.value.whldYn === 'N') {
                    // 발송시간 10분 전
                    return dayJS().diff(state.originSndnDt) < 10 * 60 * 1000 * -1;
                }
                return false;
            }),
            holdCancelBtnShow: computed(() => {
                // 보류취소 노출 조건
                // 보류시
                if (!!formData.value.prStCd && formData.value.aprvYn === 'Y' && formData.value.tdnYn === 'N' && formData.value.whldYn === 'Y') {
                    // 발송시간 10분 전
                    return dayJS().diff(state.originSndnDt) < 10 * 60 * 1000 * -1;
                }
                return false;
            }),
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

        onMounted(async () => {
            // 승인상태
            await codeList.get('approve').then((result) => {
                state.aprvTypeList = result;
            });

            // 채널
            await codeList.get('channel').then((result) => {
                state.channelTypeList = result.filter(item => item.label !== '알림톡');
            });

            // 발송대상
            await codeList.get('sendTarget').then((result) => {
                state.sendTargetList = result;
            });

            // 발송목적
            await codeList.get('sendPurpose').then((result) => {
                state.sendPurposeList = result;
            });

            targetGrid.tableColum_c = _.clone(targetGrid[state.targetName]);

            emitter.$on('dellTarget', dellTarget);

            state.cstNcSn = route.query.cstNcSn;
            await getMessageDetail();
        });

        onUnmounted(() => {
            emitter.$off('dellTarget');
        });

        const formData = ref({
            cstNcSn: null,  // 메세지 순번
            rgsAcNm: null,  // 등록계정
            rgsAcCd: null,  //
            addtInfCts: null,  // 부가정보
            prStCd: null,  // 승인상태코드
            prDt: null,  //
            aprvYn: null,  // 승인여부
            aprvRsn: null,  // 승인사유
            whldYn: null,  // 보류여부
            tdnYn: null,  // 반려여부
            tdnRsn: null,  // 반려사유
            delYn: null,  // 삭제유무
            fstRgsDt: null,  // 등록일
            lastUpdrSn: null, // 최종등록자
            lastUpdDt: null, // 최종업데이트
            fileInfo: null, // 파일정보
            chnCd: null,  //채널코드
            sndnPuCd: null, //발송목적코드
            sndnDt: null,  //발송시간
            ttl: null,  //메세지제목
            sndnTlno: null,  //발신전화번호
            cts: null,  //내용
            adYn: null,  //광고성여부
            rcptDenTlno: null,  //수신거부전화번호
            sndnTrgTypCd: null,  //발송대상타입코드
            flSn: null,  //파일순번
            sndnTgpNmArray: computed(() => targetGrid.targetList.map(item => item.mbrSn)),  //발송대상배열
            sndnTgpNm: computed(() => '[' + formData.value.sndnTgpNmArray.toString() + ']'),  //발송대상
            fstRgtrSn: null, // 어드민 순번 todo 어드민순번 맵핑 필요
            immySndnYn: null,  // 즉시발송여부
            menuCode: state.menuCode
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
            // 반려
            if (modalName === 'reject') {
                if (type === 'modalconfirm') {
                    registReject();
                }
                isReject.value = false;
            }
            // 발송 대상
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
        const dellTarget = (e) => {
            targetGrid.targetList = targetGrid.targetList.filter(item => item.mbrSn !== e.data.mbrSn);
        };

        const getMessageDetail = async () => {
            try {
                targetGrid.targetList = [];
                const response = await _getCustomerAlarmDetail({cstNcSn: state.cstNcSn, menuCode: state.menuCode});

                if (!!response.data.data.sndnTgpNm) {
                    const sndnTgArray = response.data.data.sndnTgpNm.replace('[', '').replace(']', '').split(',');
                    //회원정보 조회
                    for (const item of sndnTgArray) {
                        const params = {
                            cnSercSe: 'mbrSn',
                            cnSercCts: item,
                            mskgnRlsYn: 'Y',
                            menuCode: '1001001'
                        };

                        await _getUserList(params).then(userData => {
                            if (userData.data.data.list.length > 0) {
                                targetGrid.targetList = [...targetGrid.targetList, userData.data.data.list[0]];
                            }
                        });
                    }
                }

                formData.value = response.data.data;
                state.originSndnDt = formData.value.sndnDt;   //기존 발송시간
                formData.value.sndnDt = formData.value.immySndnYn === 'Y' ? null : formData.value.sndnDt;   //발송시간
                formData.value.lastUpdrDt = dayJS(formData.value.lastUpdrDt).format('YYYY-MM-DD HH:mm:ss');
                state.channelName = state.channelTypeList.find(item => formData.value.chnCd === item.value).label // 채널명

                // 결재상태
                state.aprvName = !!formData.value.prStCd ? state.aprvTypeList.find(item => item.cmnCd === formData.value.prStCd).cmnCdNm : '승인대기';

                if (!!response.data.data.fileInfo) {
                    formData.value.flSn = response.data.data.fileInfo.flSn; // 파일순번
                    state.fileUploadList = [response.data.data.fileInfo]; // 파일 정보
                }

            } catch (error) {
                console.log(error);
            }
        };

        const saveMessage = (type) => {
            if (formValidation()) {
                $Modal.confirm({
                    title: '',
                    message: '메세지를 저장하시겠습니까?',
                    buttonText: {
                        confirm: '예',
                        cancel: '아니요'
                    }
                }).then(async (success) => {
                    // 업로드 저장
                    const resultUpload = resultTemplate ? await uploadFile('fileUploadList') : false;
                    // 메세지 저장
                    const resultMessage = resultUpload ? await updateMessage() : false;

                }).catch(error => {
                    console.log(error);
                });
            }
        };

        const formValidation = () => {
            ///return true;
            if (!formData.value.ttl) {
                $Modal.alert('제목을 입력해주세요');
                return false;
            }

            if (!formData.value.sndnTlno) {
                $Modal.alert('발신번호를 입력해주세요');
                return false;
            }

            if (!formData.value.cts) {
                $Modal.alert('발송내용을 입력해주세요');
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
        const updateMessage = async () => {
            try {
                // 즉시 발송일때 날짜 null
                await _editCustomerAlarmUpdate(formData.value).then(result => {
                    if (result.data.code === 'OK') {
                        goToPageReplace('/alarm/message/list');
                    }
                });
            } catch (error) {
                console.log(error);
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
        };

        // 승인처리
        const registApprove = async () => {
            try {

                if (!state.approveAbled) {
                    modalInfo.message = '발송시간이 경과하여 승인이 불가합니다.';
                    $Modal.alert(modalInfo).then(() => {
                        // 추가 처리 확인필요
                    });
                    return false;
                }

                let params = {
                    cstNcSn: formData.value.cstNcSn
                };
                await _registCustomerAlarmApprove(params).then(result => {
                    modalInfo.message = result.data.code === 'OK' ? '승인이 완료되었습니다.' : result.data.message;
                    $Modal.alert(modalInfo).then(() => {
                        if (result.data.code === 'OK') {
                            //화면 갱신
                            getMessageDetail();
                        }
                    });
                });
            } catch (error) {
                console.log(error);
            }
        };

        // 반려처리
        const registReject = async () => {
            try {
                let params = {
                    cstNcSn: formData.value.cstNcSn,
                    tdnYn: 'Y',
                    tdnRsn: formData.value.tdnRsn
                };

                await _registCustomerAlarmReject(params).then(result => {
                    modalInfo.message = result.data.code === 'OK' ? '반려 처리되었습니다.' : result.data.message;
                    $Modal.alert(modalInfo).then(() => {
                        //화면 갱신
                        getMessageDetail();
                    });
                });

            } catch (error) {
                console.log(error);
                return false;
            }
        };

        // 보류처리 / 보류취소
        const registHold = async (holdYn) => {
            let params = {
                cstNcSn: formData.value.cstNcSn,
                whldYn: holdYn
            };

            $Modal.confirm({
                title: '',
                message: holdYn === 'Y' ? '메세지발송을 보류하시겠습니까?' : '메세지발송보류를 취소하시겠습니까?',
                buttonText: {
                    confirm: '예',
                    cancel: '아니요'
                }
            }).then(async (success) => {
                await _registCustomerAlarmHold(params).then(result => {
                    modalInfo.message = result.data.code === 'OK' ? holdYn === 'Y' ? '메세지발송이 보류되었습니다.' : '메세지발송이 보류취소되었습니다' : result.data.message;
                    $Modal.alert(modalInfo).then(() => {
                        //화면 갱신
                        getMessageDetail();
                    });
                });
            }).catch(error => {
                console.log(error);
            });

        };

        const deleteMessage = () => {
            $Modal.confirm({
                title: '',
                message: '메세지를 삭제하시겠습니까?',
                buttonText: {
                    confirm: '예',
                    cancel: '아니요'
                }
            }).then(async (success) => {
                let params = {
                    cstNcSn: formData.value.cstNcSn
                };
                await _deleteCustomerAlarmDelete(params).then(result => {
                    modalInfo.message = result.data.code === 'OK' ? '메세지가 삭제되었습니다.' : result.data.message;
                    $Modal.alert(modalInfo).then(() => {
                        goToPageReplace('/alarm/message/list');
                    });
                });
            }).catch(error => {
                console.log(error);
            });
        };

        const goToPageReplace = (param) => {
            router.replace(param);
        };

        const rejectFormat = (type, con) => {
            formData.value.tdnRsn = con;
        };

        const reasonPopup = () => {
            modalInfo.message = formData.value.tdnYn === 'Y' ? formData.value.tdnRsn : '';
            $Modal.alert(modalInfo);
        };

        //테이블 셀 선택
        const onCellClicked = (e) => {
            //삭제
            if (e.colDef.field === 'delete') dellTarget(e)
        };

        return {
            state,
            formData,
            isRegComplete,
            fileUpload,
            isMessageTemplate,
            isSendTarget,
            isReject,
            targetGrid,
            selectMessageTemplate,
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
            registApprove,
            rejectFormat,
            reasonPopup,
            registHold,
            deleteMessage,
            onCellClicked
        };
    }
};

</script>