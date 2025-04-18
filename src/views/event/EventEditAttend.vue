<template>
    <section>
        <!-- 기본정보 -->
        <div class="ui-section">
            <subTitleBar :subTitle="'기본 정보'" :ess="'표시는 필수항목입니다.'" />
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
                                <th scope="row">제목<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" maxlength="60"
                                                v-model="formData.eventName"
                                                :class="checkValidState('eventName') ? 'error' : ''">
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('eventName')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>

                            </tr>
                            <tr>
                                <th scope="row">이벤트 유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <template v-for="(item, index) in state.eventType" :key="index">
                                                <span class="radio" v-if="item.value === formData.eventType">
                                                    <input :id="'type' + index" name="openRdo1" type="radio"
                                                        :value="item.value" v-model="formData.eventType">
                                                    <label :for="'type' + index">{{ item.label }}</label>
                                                </span>
                                            </template>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">게시여부<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio" v-for="(item, index) in state.eventShow" :key="index">
                                                <input :id="'show' + index" name="openRd2" type="radio" :value="item.value"
                                                    v-model="formData.pstYn">
                                                <label :for="'show' + index">{{ item.label }}</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>

                            </tr>
                            <tr>
                                <th scope="row">이벤트 대상<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <template v-for="(item, index) in state.eventTarget" :key="index">
                                                <span class="radio" v-if="index === 0">
                                                    <input :id="'target' + index" name="openRdo3" type="radio"
                                                        :value="item.value" v-model="formData.eventTarget"
                                                        :disabled="!(index === 0)">
                                                    <label :for="'target' + index">{{ item.label }}</label>
                                                </span>
                                            </template>
                                        </div>
                                    </div>
                                    <template v-if="formData.eventTarget === 'TARTGET'">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <button type="button" class="btn btn-slm">회원 그룹 선택</button>
                                            </div>
                                        </div>
                                        <div class="reg-group wp-100">
                                            <div class="reg-item">
                                                <div class="ui-chips">
                                                    <div class="ui-chips-item">
                                                        <span>KB카드</span>
                                                        <button type="button" class="ui-chips-del">
                                                            <span class="offscreen">삭제하기</span>
                                                        </button>
                                                    </div>
                                                    <div class="ui-chips-item">
                                                        <span>KB손해보험</span>
                                                        <button type="button" class="ui-chips-del">
                                                            <span class="offscreen">삭제하기</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">참여제한<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <select class="custom-select sm" v-model="formData.pcpType"
                                                @change="changeCount(formData.pcpType)"
                                                v-if="formData.eventType === 'ATTENDANCE'">
                                                <template v-for="(option, index) in state.eventLimit" :key="index">
                                                    <option :value="option.value" v-if="index === 1">
                                                        {{ option.label }}
                                                    </option>
                                                </template>
                                            </select>
                                        </div>

                                    </div>
                                </td>
                                <th scope="row">이벤트기간<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <dateSerch @onSelectDate="onSelectPicker" :pickerOnly="true"
                                                :setDay="state.setDay" ref="dateSearch" />
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('eventStartDt')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">혜택구분<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <template v-for="(item, index) in state.benefitList" :key="index">
                                                <!-- 출석-->
                                                <div>
                                                    <span class="radio" v-if="(index == 1)">
                                                        <input :id="'benefit' + index" name="openRdo41" type="radio"
                                                            :value="item.value" v-model="formData.eventBnefType"
                                                            :disabled="!(formData.eventType === 'GENERAL') && index == 0">
                                                        <label :for="'benefit' + index">{{ item.label }}</label>
                                                    </span>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </td>

                            </tr>

                            <eventClauseList :eventClusListTable="state.eventClusListTable" :formData="formData"
                                @openClause="openClause" @onChangeClause="onChangeClause" @delClause="delClause" />
                            <!-- 마케팅동의 -->
                            <pushAgree @onChagePush="onChagePush" :agreeValue="state.eventMaster.infAgrmYnCpm" />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <template v-if="formData.eventBnefType.length > 0 && formData.eventName.length > 0">
            <eventBanner :formData="formData" :bannerList="state.bannerList" @fileListUp="fileListUp"
                @bannerDec="onChangebannerDec" @fileListDel="fileListDel" :bannerVal="checkValidState('bannerList')"
                :bannerDec="checkValidState('bannerImgDesc')" :errorMessage="state.validState.message"
                :errorStatus="state.validState.errState" />
            <!-- 메인컨텐츠 -->
            <eventMainImg>
                <template #btns>
                    <div class="btn-set-m flex">
                        <button type="button" class="btn btn-ss" @click="onSelectFile('fileInputList', 'add')">추가</button>
                        <button type="button" class="btn btn-ss"
                            @click="onSelectFile('fileInputList', 'remove')">삭제</button>
                    </div>
                </template>
                <template #file>
                    <fileInput :fileInputList="state.fileInputList" @changefileList="onChangeFile"
                        @fileListDel="fileListDel('fileInputList')" ref="fileInputMain"
                        :checkValidState="checkValidState('fileInputList')" :errorMessage="state.validState.message"
                        :errorStatus="state.validState.errState" :formData="formData"
                        :checkValidState_dec="checkValidState('mainImgDesc1')" />
                </template>
            </eventMainImg>

            <!-- 하단 백그라운드 이미지 추가 -->
            <eventEtcImg :backImgList="state.backImgList" :formData="formData" @changeImg="fileListUp"
                @changeText="onChangeimgDec" :bottomImgList="state.bottomImgList" @fileListDel="fileListDel" />

            <!-- 기능설정 출석  ATTENDANCE-->
            <eventApprAttendance :formData="formData" @formDataChange="onChangeFormData" @chiocePoint="openPoint"
                :eventBasicPoint="state.eventBasicPointTx" :eventGaegnPoint="state.eventGaegnPointTx"
                :slotsNum="state.fileInputList_Atnd.length">
                <template #btns>
                    <div class="btn-set-m flex">
                        <button type="button" class="btn btn-ss"
                            @click="onSelectFile('fileInputList_Atnd', 'add')">추가</button>
                        <button type="button" class="btn btn-ss"
                            @click="onSelectFile('fileInputList_Atnd', 'remove')">삭제</button>
                    </div>
                </template>
                <template #benefit>
                    <fileInputAtnd :fileInputList_Atnd="state.fileInputList_Atnd" :eventDayOption="state.eventDayOption"
                        @changefileList="atndOption" @chiocePoint="openPoint" @fileListDel="fileListDel"
                        :pointValue="state.pointValue" :eventSn=state.eventSn>
                    </fileInputAtnd>
                </template>
                <template #pointError>
                    <div v-if="checkValidState('eventBasicPoint')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                </template>
                <template #pointError1>
                    <div v-if="checkValidState('eventGaegnPoint')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                </template>
                <template #benefitError>
                    <div v-if="checkValidState('chcEps')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div v-if="checkValidState('chcEpsPayPnt')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div v-if="checkValidState('file') || checkValidState('file1')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                </template>
            </eventApprAttendance>
        </template>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="registCancel">취소</button>
            <button type="button" class="btn btn-sl posi" @click="editEvent(formData.eventType)">저장</button>
        </div>
        <!-- 이벤트 약관 선택 -->
        <EventClause :isEventclause="isEventclause" @onModalClose="openClause" :formData="formData" @addCluse="onAddCluse"
            :eventClusListTable="state.eventClusListTable" :eventClusList="state.eventClusList" />
        <!-- 이벤트 포인트 선택 -->
        <EventPointPop :isEventPoint="isEventPoint" @modalClose="openPoint" :formData="formData"
            :pointValue="state.pointValue" @formDataChangePoint="onChangePoint" :choiceSelectNum="state.choiceSelectNum"
            :pointType="state.pointType" />
    </section>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch, nextTick } from 'vue';
import fileInput from './components/fileInput.vue';
import fileInputAtnd from './components/fileInputAtnd.vue';
import EventPointPop from './components/EventPointPop.vue';
import EventClause from './components/EventClause.vue';
import eventClauseList from './components/eventClauseList.vue';
import eventApprAttendance from './components/eventApprAttendance.vue';
import eventMainImg from './components/eventMainImg.vue';
import eventEtcImg from './components/eventEtcImg.vue';
import eventBanner from './components/eventBanner.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DateSingle from '@/components/ui/DateSingle.vue';
import pushAgree from './components/pushAgree.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _detailEvent, _editAtndEvent, _editAddEvent } from '@/api/event.js';
import { _uploadFile } from '@/api/common.js';
export default {
    components: { DateSerch, DateSingle, pushAgree, fileInput, eventApprAttendance, fileInputAtnd, EventPointPop, EventClause, eventMainImg, eventEtcImg, eventBanner, eventClauseList },
    setup() {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const route = useRoute();
        const fileInputMain = ref(null);
        const dateSearch = ref(null);
        const isEventclause = ref(false);
        const isEventPoint = ref();
        const { goToPage, openModal, getErrorMessage, getImageInfo } = useCommFunc();
        const store = useStore();
        const state = reactive({
            fileInfo: [],
            bannerList: [],
            mainImgList1: [],
            mainImgList2: [],
            mainImgList3: [],
            mainImgList4: [],
            mainImgList5: [],
            backImgList: [],
            bottomImgList: [],
            setDay: {
                from: new Date(), //시작일
                to: new Date().getTime() + 3600 * 1000 * 24 * 30 //종료일
            },
            setSingleDay: new Date().getTime() + 3600 * 1000 * 24 * 31, //당첨자 발표일
            startDay: '',
            endDay: '',
            mainImg1: '',
            mainImg2: '',
            mainImg3: '',
            mainImg4: '',
            mainImg5: '',
            bkgImg: '',
            bottomImg: '',
            point: false,
            eventPzwnDt: '',
            fileInputList: [{
                checkbox: false,
                fileName: [{ fileId: '', name: '', size: '' }],
                filedec: '',
                order: 1
            }],
            fileInputList_Atnd: [],
            eventAddAtnd: [],
            addImgList: [],
            eventType: [
                { label: '일반', value: 'GENERAL' },
                { label: '퀴즈', value: 'QUIZ' },
                { label: '룰렛', value: 'ROULETTE' },
                { label: '출석', value: 'ATTENDANCE' }
                // { label: '초대', value: 'INVITATION' }
            ],
            benefitList: [
                { label: '혜택없음', value: 'NONE' },
                { label: '즉시지급', value: 'IMMEDIATELY' },
                { label: '당첨 후 지급', value: 'AFTER' }
            ],
            eventTarget: [
                { label: '모든사용자', value: 'ALL' },
                { label: '회원그룹', value: 'TARTGET' },
                { label: '건강정보동의 회원', value: '' }
            ],
            eventShow: [
                { label: '게시', value: 'Y' },
                { label: '비게시', value: 'N' }
            ],
            eventLimit: [
                { label: '기간내 1회', value: 'ONCE' },
                { label: '1일 1회', value: 'ONEDAY' },
                { label: '기간내 n회', value: 'LIMIT' }
            ],
            eventDayOption: 28,
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            },
            pointlist: [],
            delNum: 0,
            errorrouType: false,
            errorcntroucnt: false,

            eventClusList: [], //약관 번호만 
            eventClusListTable: [], //약관 리스트 
            Clause: [],
            pointValue: 0,
            choiceSelectNum: [],
            pointType: '',
            eventBasicPointTx: 0,
            eventGaegnPointTx: 0,
            eventMaster: {},
            eventAtnd: {},
            eventSn: 0,
            imgType: '',
            attendNum: 0,
            imgcheckNum: 0
        });
        onMounted(() => {
            if (route.query.eventSn) {
                state.eventSn = route.query.eventSn;
                detailEvent();
            }
        });
        // 폼 params
        const formData = reactive({
            eventSn: computed(() => Number(state.eventSn)),
            eventName: '', //제목
            eventType: 'ATTENDANCE', //이벤트 유형
            pstYn: 'Y', //게시여부
            eventTarget: 'ALL', // 이벤트 대상
            pcpType: 'NONE', //참여제한
            pcpCount: '0', // 중복회수
            eventStartDt: computed(() => state.startDay), //시작일 
            eventEndDt: computed(() => state.endDay), //종료일
            eventBnefType: 'NONE', //참여혜택
            eventPzwnDt: computed(() => state.eventPzwnDt == '' ? '' : dayJS(state.eventPzwnDt).format('YYYY-MM-DD')),
            eventClusYn: computed(() => state.eventClusList.length > 0 ? 'Y' : 'N'), // 약관여부
            eventClusList: computed(() => state.eventClusList),
            // eventProgress: '', //이벤트 상태
            bannerImg: computed(() => state.bannerImg), //배너이미지
            bannerImgDesc: '', //배너이미지 설명
            mainImg1: computed(() => state.mainImg1), //이미지 1
            mainImgDesc1: '', //이미지 1설명
            mainImg2: computed(() => state.mainImg2), //이미지 2
            mainImgDesc2: '', //이미지 2설명
            mainImg3: computed(() => state.mainImg3), //이미지 3
            mainImgDesc3: '', //이미지 3설명
            mainImg4: computed(() => state.mainImg4), //이미지 4
            mainImgDesc4: '', //이미지 4설명
            mainImg5: computed(() => state.mainImg5), //이미지 5설명
            mainImgDesc5: '', //이미지 5설명
            bkgImg: computed(() => state.bkgImg), //배경이미지
            bkgImgDesc: '', // 배경이미지 설명
            bottomImg: computed(() => state.bottomImg), // 하단 이미지
            bottomImgDesc: '', // 하단 이미지 설명
            fstRgtrSn: 0,
            fstRgsDt: '',
            lastUpdrSn: 0,
            lastUpdDt: '',
            infAgrmYnCpm: 'N', // 마케팅 수신동의 여부
            //출석
            eventDay: 28,
            eventBasicPoint: 0,
            eventGaegnPoint: 0,
            eventGaegnYn: computed(() => state.eventGaegnPointTx > 0 ? 'Y' : 'N'),
            list: []
        });
        //퀴즈 유형 선택시 formData 리셋
        const resetParams = () => {
            // formData.eventName = '';
            formData.pstYn = 'Y';
            formData.eventTarget = 'ALL';
            formData.pcpCount = '';
            state.bannerImg = '';
            formData.bannerImgDesc = '';
            state.mainImg1 = '';
            formData.mainImgDesc1 = '';
            state.mainImg2 = '';
            state.mainImg2 = '';
            formData.mainImgDesc2 = '';
            state.mainImg3 = '';
            state.mainImg3 = '';
            formData.mainImgDesc3 = '';
            state.mainImg4 = '';
            formData.mainImgDesc4 = '';
            state.mainImg5 = '';
            formData.mainImgDesc5 = '';
            state.bkgImg = '';
            formData.bkgImgDesc = '';
            state.bottomImg = '';
            formData.bottomImgDesc = '';
            formData.fstRgtrSn = 0;
            formData.fstRgsDt = '';
            formData.lastUpdrSn = 0;
            formData.lastUpdDt = '';
            formData.eventPoint = 0;
            formData.infAgrmYnCpm = 'N';
            //출석
            formData.eventDay = 28;
            formData.eventBasicPoint = 0;
            formData.eventGaegnYn = computed(() => state.eventGaegnPointTx > 0 ? 'Y' : 'N');
            formData.eventGaegnPoint = 0;
        };

        const resetState = () => {
            state.isCheckTermsName = false; // 중복확인 
            state.validState.errState = false; // validation
            state.validState.message = '';
            state.errorrouType = false;
            state.errorcntroucnt = false;
        };
        watch(formData, () => {
            resetState();
        });

        // @validate
        const validCheck = (type) => {
            let Commtarget = ['eventName', 'eventStartDt', 'bannerList', 'bannerImgDesc', 'fileInputList', 'mainImgDesc1', 'backImgList', 'bkgImgDesc'];
            let target = [];
            if (formData.eventType === 'ATTENDANCE') {
                target = [...Commtarget, ...['eventBasicPoint', 'chcEps', 'chcEpsPayPnt', 'file', 'file1']];
            }
            for (const item of target) {
                console.log(item, !formData[item]);
                state.validState.target = item;
                if (!formData[item] &&
                    (item !== 'bannerList') &&
                    (item !== 'fileInputList') &&
                    (item !== 'mainImgDesc1') &&
                    (item !== 'backImgList') &&
                    (item !== 'text') &&
                    (item !== 'chcEps') &&
                    (item !== 'chcEpsPayPnt') &&
                    (item !== 'file') &&
                    (item !== 'file1')) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
                if (item === 'eventStartDt' && (formData.eventStartDt > formData.eventEndDt)) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
                if (item === 'bannerList' && _.isEmpty(state.bannerList)) {
                    state.validState.errState = true;
                    state.validState.message = getErrorMessage(item);
                    break;
                }
                if (item === 'fileInputList' && _.isEmpty(state.fileInputList[0].fileName[0].name)) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
                if (item === 'mainImgDesc1' && _.isEmpty(state.fileInputList[0].filedec)) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
                if (item === 'backImgList' && _.isEmpty(state.backImgList)) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
                //누적혜택이 있는경우
                if (state.fileInputList_Atnd.length > 0) {
                    if (item === 'chcEps' && state.eventAddAtnd[(state.eventAddAtnd.length - 1)][item] < 1) {
                        state.validState.message = getErrorMessage(item);
                        state.validState.errState = true;
                        break;
                    }
                    if (item === 'chcEpsPayPnt' && state.eventAddAtnd[(state.eventAddAtnd.length - 1)][item] < 1) {
                        state.validState.message = getErrorMessage(item);
                        state.validState.errState = true;
                        break;
                    }
                    const img1Name = state.fileInputList_Atnd.every(item => item['chcEpsPayImg1Name'] !== '');
                    console.log(img1Name);
                    if (item === 'file' && !img1Name) {
                        state.validState.message = getErrorMessage(item);
                        state.validState.errState = true;
                        break;
                    }
                    const img2Name = state.fileInputList_Atnd.every(item => item['chcEpsPayImg2Name'] !== '');
                    if (item === 'file' && !img2Name) {
                        state.validState.message = getErrorMessage(item);
                        state.validState.errState = true;
                        break;
                    }
                }
            }
            return !state.validState.errState;
        };

        // 유효성 체크시 에러 태그 클래스 추가
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        //이벤트 등록시 확인 얼럿
        const editEvent = (type) => {
            if (validCheck()) {
                console.log('통과');
                $Modal.confirm({
                    message: formData.eventName + '를 수정 하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(async (success) => {

                        console.log(formData);
                        await editAtndEvent(type);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                $Modal.simple({
                    title: '',
                    message: state.validState.message,
                    buttonText: {
                        ok: '확인'
                    }
                });
            }
        };
        // 작성 취소
        const registCancel = () => {
            $Modal.confirm({
                title: '',
                message: '작성한 내용이 있을 경우 저장되지 않습니다. 작성을 취소하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            }).then(success => {
                console.log(success);
                if (success === 'confirm') {
                    goToPage('/event/list');
                }
            }).catch(error => {
                console.log(error);
            });
        };
        //이벤트 상세
        const detailEvent = async () => {
            try {
                let params = state.eventSn;
                const response = await _detailEvent(params);
                console.log(response);
                state.eventMaster = response.data.data.eventMaster;
                state.productList = response.data.data.productList;
                state.eventAtnd = response.data.data.eventAtnd;
                editSet();
            } catch (error) {
                console.log(error);
            }
        };
        //params set
        const editSet = () => {
            //공통 
            formData.eventName = state.eventMaster.eventName;
            formData.eventTarget = state.eventMaster.eventTarget;
            formData.eventType = state.eventMaster.eventType;
            formData.pcpType = state.eventMaster.pcpType;
            formData.pcpCount = state.eventMaster.pcpCount;
            formData.pstYn = state.eventMaster.pstYn;
            formData.eventBnefType = state.eventMaster.eventBnefType;
            //데이터 피커 초기화
            state.startDay = state.eventMaster.eventStartDt;
            state.endDay = state.eventMaster.eventEndDt;
            state.setDay.from = state.eventMaster.eventStartDt; //시작일
            state.setDay.to = state.eventMaster.eventEndDt; //종료일
            dateSearch.value.initDate();
            //당첨자발표
            state.eventMaster.eventPzwnDt === '' ? state.eventPzwnDt = '' : state.eventPzwnDt = state.eventMaster.eventPzwnDt;
            //약관처리
            if (state.eventMaster.eventClusList === null) {
                state.eventClusList = [];
                state.eventClusListTable = [];
            } else {
                for (let i = 0; i < state.eventMaster.eventClusList.length; i++) {
                    state.eventClusList.push({
                        'clusMngSn': state.eventMaster.eventClusList[i].clusMngSn
                    });
                }
                state.eventClusListTable = state.eventMaster.eventClusList;
            }
            //출석
            state.eventBasicPointTx = state.eventAtnd.eventBasicPoint;
            formData.eventBasicPoint = state.eventAtnd.basicPointPlcySn;
            state.eventGaegnPointTx = state.eventAtnd.eventGaegnPoint;
            formData.eventDay = state.eventAtnd.eventDay;
            state.eventDayOption = state.eventAtnd.eventDay;
            if (state.eventAtnd.eventGaegnYn === 'N') {
                state.eventGaegnPointTx = 0;
            } else {
                formData.eventGaegnPoint = state.eventAtnd.gaegnPointPlcySn;
                state.eventGaegnPointTx = state.eventAtnd.eventGaegnPoint;

            }
            // 추가혜택 input에 담기
            if (state.eventAtnd.list.length > 0) {
                for (let i = 0; i < state.eventAtnd.list.length; i++) {
                    state.fileInputList_Atnd.push(
                        {
                            checkbox: false,
                            atndEventSn: state.eventAtnd.list[i].atndEventSn,
                            chcEps: state.eventAtnd.list[i].chcEps,
                            chcEpsPayPnt: state.eventAtnd.list[i].chcEpsPayPnt,
                            chcEpsPayImg1: state.eventAtnd.list[i].chcEpsPayImg1,
                            chcEpsPayImg1Name: state.eventAtnd.list[i].chcEpsPayImg1Info !== null ? state.eventAtnd.list[i].chcEpsPayImg1Info.fileOriNm : '',
                            chcEpsPayImg2: state.eventAtnd.list[i].chcEpsPayImg2,
                            chcEpsPayImg2Name: state.eventAtnd.list[i].chcEpsPayImg2Info !== null ? state.eventAtnd.list[i].chcEpsPayImg2Info.fileOriNm : '',
                            chcEpsPayImg1size: state.eventAtnd.list[i].chcEpsPayImg1Info !== null ? state.eventAtnd.list[i].chcEpsPayImg1Info.fileSize : '',
                            chcEpsPayImg2size: state.eventAtnd.list[i].chcEpsPayImg2Info !== null ? state.eventAtnd.list[i].chcEpsPayImg2Info.fileSize : ''
                        }
                    );
                    state.eventAddAtnd.push(
                        {
                            atndEventSn: state.eventAtnd.list[i].atndEventSn,
                            chcEps: state.eventAtnd.list[i].chcEps,
                            chcEpsPayPnt: state.eventAtnd.list[i].chcEpsPlcySn,
                            chcEpsPayImg1: state.eventAtnd.list[i].chcEpsPayImg1,
                            chcEpsPayImg2: state.eventAtnd.list[i].chcEpsPayImg2
                        }
                    );
                }
            }
            imgInit();

        };
        const imgInit = () => {
            // 배경이미지
            if (state.eventMaster.bkgImg) {
                state.bkgImg = state.eventMaster.bkgImg;
                formData.bkgImgDesc = state.eventMaster.bkgImgDesc;
                state.backImgList[0] = ({ name: state.eventMaster.bkgImgInfo.fileOriNm, size: state.eventMaster.bkgImgInfo.fileSize });
            }
            //하단이미지
            if (state.eventMaster.bottomImg) {
                state.bottomImg = state.eventMaster.bottomImg;
                formData.bottomImgDesc = state.eventMaster.bottomImgDesc;
                state.bottomImgList[0] = ({ name: state.eventMaster.bottomImgInfo.fileOriNm, size: state.eventMaster.bottomImgInfo.fileSize });
            }
            // 배너이미지 
            state.bannerImg = state.eventMaster.bannerImg;
            state.bannerList[0] = ({ name: state.eventMaster.bannerImgInfo.fileOriNm, size: state.eventMaster.bannerImgInfo.fileSize });
            formData.bannerImgDesc = state.eventMaster.bannerImgDesc;
            // 메인 컨텐츠 이미지
            let target = ['mainImg1', 'mainImg2', 'mainImg3', 'mainImg4', 'mainImg5'];
            for (let i = 0; i < target.length; i++) {
                if (state.eventMaster[target[i]]) {
                    if (i === 0) {
                        state.mainImg1 = state.eventMaster.mainImg1;
                        formData.mainImgDesc1 = state.eventMaster.mainImgDesc1;
                        state.fileInputList[i].filedec = state.eventMaster['mainImgDesc' + (i + 1)];
                        state.fileInputList[i].fileName[i] = {
                            fileId: state.eventMaster['mainImg' + (i + 1) + 'Info'].fileId,
                            name: state.eventMaster['mainImg' + (i + 1) + 'Info'].fileOriNm,
                            size: state.eventMaster['mainImg' + (i + 1) + 'Info'].fileSize
                        };
                    } else {
                        state[target[i]] = state.eventMaster[target[i]];
                        formData['mainImgDesc' + (i + 1)] = state.eventMaster['mainImgDesc' + (i + 1)];
                        state.fileInputList.push({
                            checkbox: false,
                            fileName: [{
                                fileId: state.eventMaster['mainImg' + (i + 1) + 'Info'].fileId,
                                name: state.eventMaster['mainImg' + (i + 1) + 'Info'].fileOriNm,
                                size: state.eventMaster['mainImg' + (i + 1) + 'Info'].fileSize
                            }],
                            filedec: state.eventMaster['mainImgDesc' + (i + 1)],
                            order: (i + 1)
                        });
                    }
                }
            }
        };


        //유형에 따른 기본값 체크
        const changeCountType = (type, eventCase) => {
            // console.log(type, eventCase);
            resetParams();
            if (type == 'GENERAL') {
                goToPage('/event/register/genaral');
            }
            if (type == 'QUIZ') {
                goToPage('/event/register/quiz');
            }
            if (type == 'ROULETTE') {
                goToPage('/event/register/roulette');
            }
            if (type == 'ATTENDANCE') {
                formData.pcpType = 'ONEDAY';
                formData.eventBnefType = 'IMMEDIATELY';
                formData.eventDay = 28;
            }
        };
        //마케팅 정보 수신 동의
        const onChagePush = (type, value) => {
            value ? formData[type] = 'Y' : formData[type] = 'N';
        };
        //이벤트 등록
        const editAtndEvent = async (type) => {
            try {
                let paramsComm = {
                    eventSn: formData.eventSn,
                    eventName: formData.eventName,
                    eventType: formData.eventType,
                    pstYn: formData.pstYn,
                    eventTarget: formData.eventTarget,
                    pcpType: formData.pcpType,
                    pcpCount: formData.pcpCount,
                    eventStartDt: formData.eventStartDt,
                    eventEndDt: formData.eventEndDt,
                    eventBnefType: formData.eventBnefType,
                    eventPzwnDt: formData.eventPzwnDt,
                    eventClusYn: formData.eventClusYn,
                    eventClusList: formData.eventClusList,
                    bannerImg: formData.bannerImg,
                    bannerImgDesc: formData.bannerImgDesc,
                    mainImg1: formData.mainImg1,
                    mainImgDesc1: formData.mainImgDesc1,
                    mainImg2: formData.mainImg2,
                    mainImgDesc2: formData.mainImgDesc2,
                    mainImg3: formData.mainImg3,
                    mainImgDesc3: formData.mainImgDesc3,
                    mainImg4: formData.mainImg4,
                    mainImgDesc4: formData.mainImgDesc4,
                    mainImg5: formData.mainImg5,
                    mainImgDesc5: formData.mainImgDesc5,
                    bkgImg: formData.bkgImg,
                    bkgImgDesc: formData.bkgImgDesc,
                    bottomImg: formData.bottomImg,
                    bottomImgDesc: formData.bottomImgDesc,
                    fstRgtrSn: formData.fstRgtrSn,
                    fstRgsDt: formData.fstRgsDt,
                    lastUpdrSn: formData.lastUpdrSn,
                    lastUpdDt: formData.lastUpdDt,
                    infAgrmYnCpm: formData.infAgrmYnCpm
                };

                //출석 이벤트 추가 params
                let paramsAttend = {
                    eventDay: formData.eventDay,
                    eventBasicPoint: formData.eventBasicPoint,
                    eventGaegnYn: formData.eventGaegnYn,
                    eventGaegnPoint: formData.eventGaegnPoint
                };
                let params = {
                    ...paramsComm,
                    ...paramsAttend
                };
                console.log(paramsComm, paramsAttend, state.eventAddAtnd);
                const response = await _editAtndEvent(params);
                if (response.data.code === 'OK') {
                    // 누적혜택 호출
                    if (state.fileInputList_Atnd.length > 0) {
                        state.eventAddAtnd = state.eventAddAtnd.map((item, index) => {
                            item.atndEventSn = response.data.data.atndEventSn;
                            return item;
                        });
                        const res = await _editAddEvent(state.eventAddAtnd);
                        if (res.data.code === 'OK') {
                            goToPage('/event/list');
                        }
                    }
                    goToPage('/event/list');
                }
            } catch (error) {
                console.log(error);
            }
        };
        //이미지 등록폼 추가 || 삭제
        const onSelectFile = (caseType, type) => {
            let filedName = {
                checkbox: false,
                fileName: [{ fileId: '', name: '', size: '' }],
                filedec: '',
                order: state[caseType].length + 1
            };
            if (type === 'add') {
                // 출석
                if (caseType === 'fileInputList_Atnd') {
                    let filedName = {
                        atndEventSn: state.eventAtnd.list[0].atndEventSn,
                        chcEps: '',
                        chcEpsPayImg1: '',
                        chcEpsPayImg1Name: '',
                        chcEpsPayImg1size: '',
                        chcEpsPayImg2: '',
                        chcEpsPayImg2Name: '',
                        chcEpsPayImg2size: '',
                        chcEpsPayPnt: '',
                        checkbox: false
                    };
                    // 추가 혜택 받을 params담기
                    let addlist = {
                        atndEventSn: 0,
                        chcEps: 0,
                        chcEpsPayPnt: 0,
                        chcEpsPayImg1: 0,
                        chcEpsPayImg2: 0
                    };
                    state[caseType].push(filedName);
                    state.eventAddAtnd.push(addlist);
                    console.log(state.fileInputList_Atnd);
                } else {
                    if (state[caseType].length < 5) {
                        state[caseType].push(filedName);
                    } else {
                        $Modal.simple({
                            title: '',
                            message: '5개 까지만 추가 할 수 있습니다.',
                            buttonText: {
                                ok: '확인'
                            }
                        });
                    }
                }

            } else if (type === 'remove') {
                if (caseType === 'fileInputList_Atnd') {
                    state.fileInputList_Atnd.splice(state.delNum, 1);
                    state.eventAddAtnd.splice(state.delNum, 1);
                    state.addImgList.splice(state.delNum, 1);
                }
                //메인컨텐츠 삭제
                if (caseType === 'fileInputList') {
                    let num = null;
                    state.fileInputList = state.fileInputList.filter((item, index) => {
                        if (!item.checkbox == true) {
                            return item;
                        } else {
                            num = index;
                        }
                    });
                    //삭제시 이미지 번호 index별로 재 정리
                    let target = ['mainImg1', 'mainImg2', 'mainImg3', 'mainImg4', 'mainImg5'];
                    target.map((item, index) => {
                        if (index < state.fileInputList.length) {
                            console.log(state.fileInputList[(index)].fileName[0]);
                            state[item] = state.fileInputList[(index)].fileName[0].fileId;
                            formData['mainImgDesc' + (index + 1)] = state.fileInputList[(index)].filedec;
                        } else {
                            console.log('1===', index);
                            state[item] = 0;
                            formData['mainImgDesc' + (index + 1)] = '';
                        }
                    });
                }
            }
        };
        // 컴포넌트 value받아 오기
        const onChangeFormData = (caseType, value, index) => {
            let idType = document.querySelector(`#${caseType}`);
            if (caseType === 'eventDay') {
                formData[caseType] = value;
                state.eventDayOption = value;
            } else if (caseType === 'eventGaegnPoint') {
                state.eventGaegnPoint = value;
                formData[caseType] = value;
                console.log(state.eventGaegnPoint);
            } else {
                console.log(caseType, value);
                formData[caseType] = value;
                if (caseType == 'checkbox' && value.indexOf('mainChkpdt') > -1) {
                    state.delNum = index;
                }
            }
            console.log(formData);
            resetState();
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            if (type === 'day') {
                state.startDay = value[0];
                state.endDay = value[1];
            } else if (type === 'self_end' || type === 'self_start') {
                // 직접 데이터 피커 설정
                if (type === 'self_start') {
                    state.startDay = value;
                } else if (type === 'self_end') {
                    state.endDay = value;
                }
            } else if (type === 'singleday') {
                console.log(value);
                state.eventPzwnDt = '';
                if (formData.eventBnefType === 'AFTER') {
                    state.eventPzwnDt = value;
                }
            }
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };

        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
        };
        const fileListUp = async (type, name) => {
            state.imgType = type;
            let inputName = null;
            if (type === 'bannerList') {
                state[type] = name;
                await getImageInfo(name[0], imageSizeCallback);

                resetState();
            }
            if (type === 'backImgList' || type === 'bottomImgList') {
                state[type] = (Array.from(document.querySelector(`#${name}`).files));
                await getImageInfo((Array.from(document.querySelector(`#${name}`).files))[0], imageSizeCallback);

            }
            resetState();
        };
        // 배너 설명 
        const onChangebannerDec = (type, value) => {
            formData[type] = value;
            resetState();
        };
        // 이미지 규격체크 메인 하단 375 배너 327*160
        const imageSizeCallback = (callback) => {
            console.log(callback.width);
            let imgSize = null;
            let massage = null;
            if (state.imgType === 'bannerList') {
                imgSize = callback.width % 327 !== 0 && callback.height % 160 !== 0;
                massage = '배너 이미지 사이즈를 확인해주세요';
            } else if (state.imgType === 'fileInputList') {
                imgSize = callback.width % 375 !== 0;
                massage = '메인 콘텐츠 이미지 사이즈를 확인해주세요';
            } else if (state.imgType.indexOf('fileUploadtype') === 0) {
                imgSize = callback.width % 60 !== 0;
                massage = '출석도장 이미지 사이즈를 확인해주세요';
            } else {
                imgSize = callback.width % 375 !== 0;
                massage = '배경 이미지 사이즈를 확인해주세요.';
            }
            if (callback.fileType.indexOf('png') > -1 || callback.fileType.indexOf('jpeg') > -1 || callback.fileType.indexOf('jpg') > -1) {
                if (imgSize) {
                    $Modal.simple({
                        message: massage,
                        buttonText: {
                            ok: '확인'
                        }
                    })
                        .then(async (success) => {
                            console.log(success);
                            if (state.imgType === 'fileInputList') {
                                state.fileInputList[state.imgcheckNum] = {
                                    checkbox: false,
                                    fileName: [{ fileId: '', name: '', size: '' }],
                                    filedec: '',
                                    order: 1
                                };
                                imgInit();
                            } else if (state.imgType.indexOf('fileUploadtype') === 0) {
                                if (state.imgType === 'fileUploadtype1') {
                                    state.fileInputList_Atnd[state.attendNum].chcEpsPayImg1Name = '';
                                    state.fileInputList_Atnd[state.attendNum].chcEpsPayImg1 = '';
                                    state.fileInputList_Atnd[state.attendNum].chcEpsPayImg1size = '';
                                } else {
                                    state.fileInputList_Atnd[state.attendNum].chcEpsPayImg2Name = '';
                                    state.fileInputList_Atnd[state.attendNum].chcEpsPayImg2 = '';
                                    state.fileInputList_Atnd[state.attendNum].chcEpsPayImg2size = '';
                                }
                                imgInit();
                            } else {
                                imgInit();
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    if (state.imgType === 'bannerList') {
                        uploadFile(state.imgType);
                    }
                    if (state.imgType === 'fileInputList') {
                        uploadFile(state.imgNum);
                    }
                    if (state.imgType.indexOf('fileUploadtype') === 0) {
                        attenduploadFile(state.addImgList);
                    }
                    // state.imgType === 'bannerList' ? uploadFile(state.imgType) : uploadFile(state.imgNum);
                }
            } else {
                if (state.imgType === 'bannerList') {
                    state[state.imgType] = [];
                }
                if (state.imgType === 'fileInputList') {
                    console.log(state.imgcheckNum);
                    state.fileInputList[state.imgcheckNum] = {
                        checkbox: false,
                        fileName: [{ fileId: '', name: '', size: '' }],
                        filedec: '',
                        order: 1
                    };
                }
                if (state.imgType.indexOf('fileUploadtype') === 0) {
                    if (state.imgType === 'fileUploadtype1') {
                        state.fileInputList_Atnd[state.attendNum].chcEpsPayImg1Name = '';
                        state.fileInputList_Atnd[state.attendNum].chcEpsPayImg1 = '';
                        state.fileInputList_Atnd[state.attendNum].chcEpsPayImg1size = '';
                    } else {
                        state.fileInputList_Atnd[state.attendNum].chcEpsPayImg2Name = '';
                        state.fileInputList_Atnd[state.attendNum].chcEpsPayImg2 = '';
                        state.fileInputList_Atnd[state.attendNum].chcEpsPayImg2size = '';
                    }
                }

                $Modal.simple({
                    message: '파일의 확장자를 확인해 주세요  (JPG, PNG만 가능합니다.)',
                    buttonText: {
                        ok: '확인'
                    }
                });
            }

        };

        //기타 이미지 업데이트
        const onChangeimgDec = (type, value) => {
            console.log(type, value);
            formData[type] = value;
        };
        //파일업로드 API
        const uploadFile = async (type) => {
            const formData = new FormData();
            formData.append('file', state[type][0]);
            try {
                const response = await _uploadFile(formData);
                const typeMappings = {
                    'bannerList': 'bannerImg',
                    'mainImgList1': 'mainImg1',
                    'mainImgList2': 'mainImg2',
                    'mainImgList3': 'mainImg3',
                    'mainImgList4': 'mainImg4',
                    'mainImgList5': 'mainImg5',
                    'backImgList': 'bkgImg',
                    'bottomImgList': 'bottomImg'
                };
                console.log(typeMappings[type]);
                if (typeMappings[type]) {
                    state[typeMappings[type]] = response.data.fileId;
                }
                state.fileInfo.push(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        const attenduploadFile = async (type) => {
            const formData = new FormData();
            formData.append('file', type[0]);
            try {
                console.log(state.eventAddAtnd, state.fileInputList_Atnd, state.imgType);
                const response = await _uploadFile(formData);
                if (state.imgType === 'fileUploadtype1') {
                    state.fileInputList_Atnd[state.attendNum].chcEpsPayImg1Name = response.data.fileOriNm;
                    state.fileInputList_Atnd[state.attendNum].chcEpsPayImg1 = response.data.fileId;
                    state.fileInputList_Atnd[state.attendNum].chcEpsPayImg1size = response.data.fileSize;
                    state.eventAddAtnd[state.attendNum].chcEpsPayImg1 = response.data.fileId;
                } else {
                    state.fileInputList_Atnd[state.attendNum].chcEpsPayImg2Name = response.data.fileOriNm;
                    state.fileInputList_Atnd[state.attendNum].chcEpsPayImg2 = response.data.fileId;
                    state.fileInputList_Atnd[state.attendNum].chcEpsPayImg2size = response.data.fileSize;
                    state.eventAddAtnd[state.attendNum].chcEpsPayImg2 = response.data.fileId;
                }
            } catch (error) {
                console.log(error);
            }
        };

        // 파일 리스트 삭제 
        const fileListDel = (type, index) => {
            if (type === 'fileInputList') {
                state.fileInputList[state.imgcheckNum] = {
                    checkbox: false,
                    fileName: [{ fileId: '', name: '', size: '' }],
                    filedec: '',
                    order: 1
                };
            } else if (type.indexOf('chcEpsPayImg') === 0) {
                if (type.indexOf('chcEpsPayImg1_') === 0) {
                    state.fileInputList_Atnd[index].chcEpsPayImg1Name = '';
                    state.fileInputList_Atnd[index].chcEpsPayImg1size = '';
                    console.log();
                } else {
                    console.log(state.fileInputList_Atnd[state.attendNum]);
                    state.fileInputList_Atnd[index].chcEpsPayImg2Name = '';
                    state.fileInputList_Atnd[index].chcEpsPayImg2size = '';
                }
            } else {
                state[type] = [];
            }
        };
        // 메인 콘텐츠 컴포넌트 폼 데이터 추가 
        const onChangeFile = (type, typeName, index, data) => {
            resetState();
            if (type === 'inputFile') {
                //수정시에는 이미지 데이터 바로 api콜 함으로 api용 배열 추가해야함
                state.imgType = 'fileInputList';
                state.imgcheckNum = index;
                state.fileInputList[index].fileName = data;
                let uploadfileName = 'mainImgList' + (index + 1);
                state[uploadfileName] = data;
                getImageInfo(data[0], imageSizeCallback);
            }
            if (type === 'imgdec') {
                formData['mainImgDesc' + (index + 1)] = data.filedec;
            }
            resetState();
        };

        //출석 이벤트 추가혜택
        const atndOption = (caseType, index, type, value, imgfile, imgnum) => {
            // console.log(caseType, index, type, value);
            if (caseType === 'checkbox') {
                state.delNum = type;
            } else if (caseType === 'inputFile') {
                console.log(imgnum);
                state.imgType = imgnum;
                state.attendNum = index;
                state.addImgList = imgfile;
                getImageInfo(state.addImgList[0], imageSizeCallback);
            } else {
                state.eventAddAtnd[index][type] = value;
                state.fileInputList_Atnd[index][type] = value;
            }
            resetState();
        };


        //약관 팝업열기
        const openClause = (type) => {
            if (type === 'open') {
                isEventclause.value = true;
            } else {
                isEventclause.value = false;
            }
        };

        //약관 삭제
        const delClause = () => {
            for (const item of state.Clause) {
                let inputName = document.getElementById(item.value);
                if (inputName.checked) {
                    console.log(state.Clause, state.eventClusListTable, state.eventClusList, item.num);
                    state.eventClusListTable = state.eventClusListTable.filter((j, index) => {
                        if (index !== item.num) {
                            return item;
                        }
                    });
                    state.eventClusList = state.eventClusList.filter((j, index) => {
                        if (index !== item.num) {
                            return item;
                        }
                    });
                }
            }
            state.Clause = [];
        };
        //약관 추가
        const onAddCluse = (value) => {
            let isListCheck = state.eventClusList.some(item => item.clusMngSn == value.clusMngSn);
            let isListTableCheck = state.eventClusListTable.some(item => item.clusMngSn == value.clusMngSn);
            console.log(value);
            if (!isListCheck && !isListTableCheck) {
                state.eventClusList.push({
                    'clusMngSn': value.clusMngSn
                });
                state.eventClusListTable.push(value);
            } else {
                $Modal.simple({
                    title: '',
                    message: '이미 추가된 약관입니다.',
                    buttonText: {
                        ok: '확인'
                    }
                })
                    .then(success => {
                        console.log(success);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            return isListCheck, isListTableCheck;


        };
        //테이블 내의 약관리스트 표시
        const onChangeClause = (type, index) => {
            console.log('#' + type);
            let inputName = document.getElementById(type);
            let arrCheck = state.Clause.some(item => item.value === type);
            if (!arrCheck) {
                state.Clause.push({ 'value': type, 'num': index });
            }
        };

        //포인트 모달
        const openPoint = (type, value, index) => {
            if (type === 'open') {
                console.log(value, index);
                state.pointType = value;
                isEventPoint.value = true;
                state.pointValue = index;
            } else {
                isEventPoint.value = false;
            }
        };
        // 포인트 추가
        const onChangePoint = (value, type, index) => {
            console.log(value, type);
            formData[type] = value.plcyMapKeySn;
            state.choiceSelectNum.push(value.plcyMapKeySn);
            if (type === 'eventBasicPoint') {
                state.eventBasicPointTx = value.point;
            }
            if (type === 'eventGaegnPoint') {
                state.eventGaegnPointTx = value.point;
                console.log(formData.eventGaegnYn, state.eventGaegnPointTx);
            }
            if (type === 'chcEpsPayPnt') {
                console.log(value, type, index);
                atndOption('', index, type, value.plcyMapKeySn);
                state.fileInputList_Atnd[index][type] = value.point;
                state.eventAddAtnd[index][type] = value.plcyMapKeySn;
            }
        };

        return {
            $Modal,
            dayJS,
            goToPage,
            fileInputMain,
            isEventclause,
            openModal,
            formData,
            dateSearch,
            state,
            onSelectPicker,
            onInitDate,
            fileListUp,
            onChangeimgDec,
            uploadFile,
            fileListDel,
            onChangeFile,
            onSelectFile,
            onChangeFormData,
            onChangebannerDec,
            editEvent,
            atndOption,
            changeCountType,
            checkValidState,
            registCancel,

            //약관
            openClause,
            onChangeClause,
            delClause,
            onAddCluse,
            //포인트
            isEventPoint,
            openPoint,
            onChangePoint,
            onChagePush

        };
    }
};
</script>