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
                                            <span class="radio" v-for="(item, index) in state.eventType" :key="index">
                                                <input :id="'type' + index" name="openRdo1" type="radio" :value="item.value"
                                                    v-model="formData.eventType"
                                                    @change="changeCountType(formData.eventType)">
                                                <label :for="'type' + index">{{ item.label }}</label>
                                            </span>
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
                                            <select class="custom-select" v-model="formData.pcpType"
                                                @change="onChageBenefit(formData.pcpType, formData.eventType)">
                                                <template v-for="(option, index) in state.eventLimit" :key="index">
                                                    <option :value="option.value">
                                                        {{ option.label }}
                                                    </option>
                                                </template>
                                            </select>
                                        </div>
                                        <div class="reg-item" v-if="formData.pcpType === 'LIMIT'">
                                            <input type="number" class="form-control" v-model="formData.pcpCount">
                                            <span class="unit">회</span>
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
                                <td>
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <template v-for="(item, index) in state.benefitList" :key="index">
                                                <div>
                                                    <span class="radio" v-if="!(index == 0)">
                                                        <input :id="'benefit' + index" name="openRdo41" type="radio"
                                                            :value="item.value" v-model="formData.eventBnefType"
                                                            :disabled="!(formData.eventType === 'GENERAL') && index == 0"
                                                            @change="changeCount(formData.eventBnefType, formData.eventType)">
                                                        <label :for="'benefit' + index">{{ item.label }}</label>
                                                    </span>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">당첨자발표일<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <DateSingle @onSelectDate="onSelectPicker" :setDay="state.setSingleDay"
                                                :disabled="!(formData.eventBnefType === 'AFTER')" ref="dateSearch1">
                                            </DateSingle>
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('eventPzwnDt')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <!-- 약관 -->
                            <eventClauseList :eventClusListTable="state.eventClusListTable" :formData="formData"
                                @openClause="openClause" @onChangeClause="onChangeClause" @delClause="delClause" />
                            <!-- 마케팅동의 -->
                            <pushAgree @onChagePush="onChagePush" />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <template v-if="formData.eventBnefType.length > 0 && formData.eventName.length > 0">
            <!-- //show이벤트 유형 혜택구분 둘다 설정 완료시 노출 -->
            <!-- 이벤트 배너 -->
            <eventBanner :formData="formData" :bannerList="state.bannerList" @fileListUp="fileListUp"
                @bannerDec="onChangebannerDec" @fileListDel="fileListDel" :bannerVal="checkValidState('bannerList')"
                :bannerDec="checkValidState('bannerImgDesc')" :errorMessage="state.validState.message"
                :errorStatus="state.validState.errState">
            </eventBanner>
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
                    <!-- fileListDel('bannerList') -->
                    <fileInput :fileInputList="state.fileInputList" @changefileList="onChangeFile"
                        @fileListDel="fileListDel('fileInputList')" ref="fileInputMain"
                        :checkValidState="checkValidState('fileInputList')" :errorMessage="state.validState.message"
                        :errorStatus="state.validState.errState" :formData="formData"
                        :checkValidState_dec="checkValidState('mainImgDesc1')" />
                </template>
            </eventMainImg>



            <eventBenefit :formData="formData" :pointValue="state.pointValue" @formDataChange="onChangeFormData"
                :eventBnefType="formData.eventBnefType" @chiocePoint="openPoint">
                <template #pdtCon v-if="formData.eventBnefType === 'AFTER'">
                    <tr>
                        <th scope="row">당첨 후 지급 혜택<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td colspan="3">
                            <div class="reg-group" v-if="false">
                                <div class="reg-item">
                                    <span class="dv">
                                        <!-- eventBnefType === 'AFTER' 당첨 후 지급 일때사용 -->
                                        <span class="checkbox">
                                            <input id="use" name="openRdo6" type="checkbox" v-model="state.eventProductYn">
                                            <label for="use">외부소싱상품</label>
                                        </span>
                                    </span>

                                </div>
                            </div>
                            <div class="table-util mt-20">
                                <div class="btn-set-m flex">
                                    <button type="button" class="btn btn-ss"
                                        @click="onSelectFile('addprodlist', 'add')">추가</button>
                                    <button type="button" class="btn btn-ss"
                                        @click="onSelectFile('addprodlist', 'remove')">삭제</button>
                                </div>
                                <div class="tbl-wrap mt-10">
                                    <table class="table reg">
                                        <colgroup>
                                            <col style="width: 45px;">
                                            <col style="width: auto;">
                                            <col style="width: 140px;">
                                            <col style="width: 140px;">
                                            <col style="width: 160px;">
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th scope="col" class="chk">
                                                    <span class="checkbox">
                                                        <input id="benListChkAll" name="benListChkGroup" type="checkbox">
                                                        <label for="benListChkAll"></label>
                                                    </span>
                                                </th>
                                                <th scope="col">제품 명(최대 30자)
                                                    <span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                                <th scope="col">당첨 수량
                                                    <span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                                <th scope="col">제세공과금 대상
                                                    <span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                                <th scope="col">당첨 등 수(최대10자)
                                                    <span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <PrdAdd :addprodlist="state.addprodlist" @onChangePdtList="onChangeFormData" />

                                        </tbody>
                                    </table>
                                    <div
                                        v-if="checkValidState('productNm') && !(state.addprodlist[state.addprodlist.length - 1].productNm)">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                    <div
                                        v-if="checkValidState('text') && !(state.addprodlist[state.addprodlist.length - 1].text)">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </td>

                    </tr>
                </template>
            </eventBenefit>
            <div v-if="(checkValidState('eventFrcCount') && formData.eventFrcYn === 'Y') || checkValidState('eventPoint')">
                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                    {{ state.validState.message }}
                </p>
            </div>

            <!-- 기능설정 퀴즈  -->
            <eventApprQuiz :formData="formData" @formDataChange="onChangeFormData" v-if="formData.eventType === 'QUIZ'" />

            <!-- 퀴즈 기능 에러 -->
            <div v-if="(checkValidState('eventAnswer') && !(formData.eventAnswer)) ||
                (checkValidState('eventQuiz1') || checkValidState('eventQuiz2') || checkValidState('eventQuiz3') || checkValidState('eventQuiz4')) ||
                (checkValidState('eventHintLink') && formData.eventHintType === 'LINK') ||
                (checkValidState('eventHintTxt') && formData.eventHintType === 'TEXT')">
                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                    {{ state.validState.message }}
                </p>
            </div>
        </template>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="registCancel">취소</button>
            <button type="button" class="btn btn-sl posi" @click="registEvent(formData.eventType)">저장</button>
        </div>
        <!-- 이벤트 약관 선택 -->
        <EventClause :isEventclause="isEventclause" @onModalClose="openClause" :formData="formData" @addCluse="onAddCluse"
            :eventClusListTable="state.eventClusListTable" :eventClusList="state.eventClusList" />
        <!-- 포인트 검색 -->
        <EventPointPop :isEventPoint="isEventPoint" @modalClose="openPoint" :formData="formData"
            :pointValue="state.pointValue" @formDataChangePoint="onChangePoint" />
    </section>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import fileInput from './components/fileInput.vue';
import fileInputAtnd from './components/fileInputAtnd.vue';
import PrdAdd from './components/PrdAdd.vue';
import eventMainImg from './components/eventMainImg.vue';
import eventBanner from './components/eventBanner.vue';
import eventApprDefault from './components/eventApprDefault.vue';
import eventApprQuiz from './components/eventApprQuiz.vue';
import eventBenefit from './components/eventBenefit.vue';
import EventPointPop from './components/EventPointPop.vue';
import EventClause from './components/EventClause.vue';
import eventClauseList from './components/eventClauseList.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DateSingle from '@/components/ui/DateSingle.vue';
import pushAgree from './components/pushAgree.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _regQuizEvent } from '@/api/event.js';
import { _uploadFile } from '@/api/common.js';
export default {
    components: { DefaultModal, DateSerch, DateSingle, pushAgree, fileInput, PrdAdd, eventApprDefault, eventBenefit, eventApprQuiz, fileInputAtnd, EventPointPop, EventClause, eventMainImg, eventBanner, eventClauseList },
    setup() {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const route = useRoute();
        const fileUploadBanner = ref(null);
        const fileUploadBack = ref(null);
        const fileUploadBottom = ref(null);
        const fileInputMain = ref(null);
        const dateSearch = ref(null);
        const RoultteAppr = ref(null);
        const isEventclause = ref(false);
        const isEventPoint = ref(false);
        const { goToPage, openModal, getImageInfo, getErrorMessage } = useCommFunc();
        const store = useStore();
        const state = reactive({
            fileInfo: [],
            bannerList: [],
            mainImgList1: [],
            mainImgList2: [],
            mainImgList3: [],
            mainImgList4: [],
            mainImgList5: [],
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
            eventProductYn: false,
            eventPzwnDt: '',
            fileInputList: [{
                checkbox: false,
                fileName: [{ fileId: '', name: '', size: '' }],
                filedec: '',
                order: 1
            }],
            addprodlist: [
                {
                    checkbox: false,
                    tax: false,
                    productNm: '', //상품명
                    productCnt: 1, //tnwkd
                    productTax: 'N', //제세공과금
                    text: '' //당첨등수 표시명
                }
            ],

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
            eventKeyword: [
                { label: '전체', value: '' },
                { label: '이벤트제목', value: 'NAME' },
                { label: '이벤트 번호', value: 'CODE' }
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
            eventPointYN: false,
            pointlist: [],
            delNum: 0,
            errorrouType: false,
            errorcntroucnt: false,

            eventClusList: [], //약관 번호만 
            eventClusListTable: [], //약관 리스트 
            Clause: [],
            pointValue: 0,
            imgType: '',
            imgcheckNum: 0

        });

        // 폼 params
        const formData = reactive({
            eventName: '', //제목
            eventType: 'QUIZ', //이벤트 유형
            pstYn: 'Y', //게시여부
            eventTarget: 'ALL', // 이벤트 대상
            pcpType: 'ONCE', //참여제한
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
            fstRgtrSn: 0,
            fstRgsDt: '',
            lastUpdrSn: 0,
            lastUpdDt: '',
            eventFrcYn: 'N', // 선착순 사용
            eventFrcCount: 0, // 선착순 인원
            eventPoint: 0, //이벤트 포인트
            eventProductYn: computed(() => state.eventProductYn ? 'Y' : 'N'), //이벤트 상품 여부
            prodlist: [], //상품 
            eventQuiz1: '', //퀴즈1
            eventQuiz2: '', //퀴즈2
            eventQuiz3: '', //퀴즈3
            eventQuiz4: '', //퀴즈4
            eventQuiz5: '', //퀴즈5
            eventAnswer: '', //정답번호
            eventHintType: '', //힌트 타입
            eventHintLink: '', //힌트 링크
            eventHintTxt: '', //힌트 문구
            immyPayBnef: '', //즉시지급혜택 포인트,상품
            pzwnPayBnef: '', //당첨후 지급혜택  포인트,상품
            infAgrmYnCpm: 'N' // 마케팅 수신동의 여부

        });
        //퀴즈 유형 선택시 formData 리셋
        const resetParams = () => {
            formData.pstYn = 'Y';
            formData.eventTarget = 'ALL';
            // formData.pcpCount = '';
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
            formData.fstRgtrSn = 0;
            formData.fstRgsDt = '';
            formData.lastUpdrSn = 0;
            formData.lastUpdDt = '';
            formData.eventFrcYn = 'N';
            formData.eventFrcCount = 0;
            formData.eventPoint = 0;
            state.eventProductYn = false;
            formData.prodlist = [];
            formData.eventQuiz1 = '';
            formData.eventQuiz2 = '';
            formData.eventQuiz3 = '';
            formData.eventQuiz4 = '';
            formData.eventQuiz5 = '';
            formData.eventAnswer = '';
            formData.eventHintType = '';
            formData.eventHintLink = '';
            formData.eventHintTxt = '';
            formData.immyPayBnef = '';
            formData.pzwnPayBnef = '';
            formData.infAgrmYnCpm = 'N';

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
            let Commtarget = ['eventName', 'eventStartDt', 'bannerList', 'bannerImgDesc', 'fileInputList', 'mainImgDesc1'];
            let quiztarget = ['eventAnswer', 'eventQuiz1', 'eventQuiz2', 'eventQuiz3', 'eventQuiz4', 'eventHintLink', 'eventHintTxt'];
            let target = [];
            if (formData.eventType === 'QUIZ' && formData.eventBnefType === 'IMMEDIATELY') {
                target = [...Commtarget, ...['eventFrcYn', 'eventFrcCount', 'eventPoint'], ...quiztarget];
            }
            if (formData.eventType === 'QUIZ' && formData.eventBnefType === 'AFTER') {
                target = [...Commtarget, ...['eventPzwnDt', 'productNm', 'text'], ...quiztarget];
            }
            const isEmpty = (field) => _.isEmpty(field);
            console.log(target);
            for (const item of target) {
                console.log(item, !formData[item]);
                state.validState.target = item;
                if (!formData[item] &&
                    (item !== 'bannerList') &&
                    (item !== 'fileInputList') &&
                    (item !== 'mainImgDesc1') &&
                    (item !== 'eventFrcYn') &&
                    (item !== 'eventFrcCount') &&
                    (item !== 'productNm') &&
                    (item !== 'text') &&
                    (item !== 'eventHintLink') &&
                    (item !== 'eventHintTxt') &&
                    (item !== 'eventPoint')) {
                    console.log(item);
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
                if (item === 'eventStartDt' && (formData.eventStartDt > formData.eventEndDt)) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
                if (item === 'eventPzwnDt' && (formData.eventEndDt > formData.eventPzwnDt)) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
                if (item === 'eventFrcCount' && isEventFrcCountEmpty()) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
                if ((item === 'productNm' || item === 'text') && isProductFieldEmpty(item)) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
                if (item === 'eventPoint' && !formData[item]) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
                if (item === 'bannerList' && isEmpty(state.bannerList)) {
                    state.validState.errState = true;
                    state.validState.message = getErrorMessage(item);
                    break;
                }

                if (item === 'fileInputList' && _.isEmpty(state.fileInputList[0].fileName[0].name)) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }

                if (item === 'mainImgDesc1' && isEmpty(state.fileInputList[0].filedec)) {
                    state.validState.errState = true;
                    state.validState.message = getErrorMessage(item);
                    break;
                }
                if (item === 'eventHintLink' && formData.eventHintType === 'LINK' && (_.isEmpty(formData.eventHintLink) || !(formData.eventHintLink.includes('https://') || formData.eventHintLink.includes('http://')))) {
                    state.validState.message = _.isEmpty(formData.eventHintLink) ? '퀴즈 힌트 링크를 작성해 주세요' : '링크는 http:// 또는 https:// 로 시작하여야 합니다.';
                    state.validState.errState = true;
                    break;
                }

                if (item === 'eventHintTxt' && formData.eventHintType === 'TEXT' && _.isEmpty(formData.eventHintTxt)) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
            }
            return !state.validState.errState;
        };
        // 선착순 인원이 비어있는지 확인하는 함수
        const isEventFrcCountEmpty = () => {
            return formData.eventFrcYn === 'Y' && formData.eventFrcCount === 0;
        };
        // 상품 필드가 비어있는지 확인하는 함수
        const isProductFieldEmpty = (item) => {
            return (item === 'productNm' || item === 'text') && !state.addprodlist[`${state.addprodlist.length - 1}`][item];
        };
        // 유효성 체크시 에러 태그 클래스 추가
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        onMounted(() => {
            changeCountType(formData.eventType);
        });

        //이벤트 등록시 확인 얼럿
        const registEvent = (type) => {
            if (validCheck()) {
                console.log('통과');
                $Modal.confirm({
                    message: formData.eventName + '를 등록 하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(async (success) => {
                        //이미지 등록
                        const imgs = ['bannerList', 'mainImgList1', 'mainImgList2', 'mainImgList3', 'mainImgList4', 'mainImgList5'];
                        await regImgUpload();
                        for (const item of imgs) {
                            if (state[item].length > 0) {
                                await uploadFile(item);
                            }
                        }
                        await regApiEvent(type);
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

        //참여 제한선택시 기본값 체크
        const onChageBenefit = (type, eventCase) => {
            if (type == 'LIMIT') {
                formData.pcpCount = '10';
            } else {
                formData.pcpCount = '';
            }
        };
        //참여 혜택 선택시 기본값 체크
        const changeCount = (type, eventCase) => {
            if (type == 'AFTER') {
                resetParams();
                state.eventProductYn = true;
                formData.eventPoint = 0;
                state.eventPzwnDt = state.setSingleDay;

            }
            if (type == 'IMMEDIATELY') {
                resetParams();
                state.eventProductYn = false;
                formData.eventPoint = 0;
            }
        };
        //유형에 따른 기본값 체크
        const changeCountType = (type, eventCase) => {
            resetParams();
            if (type == 'GENERAL') {
                goToPage('/event/register/genaral');
            }
            if (type == 'QUIZ') {
                formData.eventBnefType = 'IMMEDIATELY';
                formData.pcpType = 'ONCE';
                formData.eventPoint = 0;
                formData.eventHintType = 'LINK';
                state.eventProductYn = false;
            }
            if (type == 'ROULETTE') {
                goToPage('/event/register/roulette');
            }
            if (type == 'ATTENDANCE') {
                goToPage('/event/register/attend');
            }

        };
        //마케팅 정보 수신 동의
        const onChagePush = (type, value) => {
            value ? formData[type] = 'Y' : formData[type] = 'N';
        };
        //이벤트 등록
        const regApiEvent = async (type) => {
            try {
                let paramsComm = {
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
                    fstRgtrSn: formData.fstRgtrSn,
                    fstRgsDt: formData.fstRgsDt,
                    lastUpdrSn: formData.lastUpdrSn,
                    lastUpdDt: formData.lastUpdDt,
                    infAgrmYnCpm: formData.infAgrmYnCpm
                };

                //퀴즈 이벤트 추가 params
                let paramsQuiz = {
                    eventFrcYn: formData.eventFrcYn,
                    eventFrcCount: formData.eventFrcCount,
                    eventPoint: formData.eventPoint,
                    eventProductYn: formData.eventProductYn,
                    prodlist: formData.prodlist,
                    eventQuiz1: formData.eventQuiz1,
                    eventQuiz2: formData.eventQuiz2,
                    eventQuiz3: formData.eventQuiz3,
                    eventQuiz4: formData.eventQuiz4,
                    eventAnswer: formData.eventAnswer,
                    eventHintType: formData.eventHintType,
                    eventHintLink: formData.eventHintLink,
                    eventHintTxt: formData.eventHintTxt
                };

                if (type === 'QUIZ') {
                    let params = {
                        ...paramsComm,
                        ...paramsQuiz
                    };
                    console.log(params);
                    const response = await _regQuizEvent(params);
                    if (response.data.code === 'OK') {
                        goToPage('/event/list');
                    }
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
            // 2차 상품 추가시
            let filedName1 = {
                checkbox: false,
                tax: false,
                productNm: '',
                productCnt: 1,
                productTax: 'N',
                text: ''
            };
            if (type === 'add') {
                //출석
                if (caseType === 'addprodlist') {
                    state[caseType].push(filedName1);
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
                if (caseType === 'addprodlist') {
                    console.log(state.delNum);
                    formData.prodlist.splice(state.delNum, 1);
                }

                if (caseType === 'fileInputList') {
                    state.fileInputList = state.fileInputList.filter((item) => {
                        if (!item.checkbox == true) {
                            return item;
                        }

                    });
                }
            }
        };
        // 컴포넌트 value받아 오기
        const onChangeFormData = (caseType, value, index) => {
            let idType = document.querySelector(`#${caseType}`);
            if (value === 'text' || value === 'point') {
                console.log(idType, idType.value);
                formData[caseType] = idType.value;
            } else if (value === 'tax') {
                if (idType.checked) {
                    formData[caseType] = 'Y';
                } else {
                    formData[caseType] = 'N';
                }
            } else if (value === 'Product') {
                let idType = document.querySelector(`#${caseType}`);
                formData[caseType] = idType.value;
            } else if (caseType === 'eventDay') {
                formData[caseType] = value;
                state.eventDayOption = value;
            } else if (caseType === 'eventFrcYn') {
                formData[caseType] = value;
                if (value === 0) {
                    formData.eventFrcCount = 0;
                }
            } else if (caseType === 'eventPointYN' && !(formData.eventPoint)) {
                state.eventPointYN = value;
                formData.eventPoint = 0;

            } else if (caseType === 'productNm' || caseType === 'productCnt' || caseType === 'productCnt' || caseType === 'tax' || caseType === 'text') {
                const key = 'checkbox';
                const taxkey = 'tax';
                state.addprodlist[index][caseType] = value;
                const array = state.addprodlist.map(item => {
                    if (item.tax == true) {
                        item.productTax = 'Y';
                    } else {
                        item.productTax = 'N';
                    }
                    const { [key]: checkbox, [taxkey]: tax, ...rest } = item;
                    return rest;
                });
                formData.prodlist = array;
            } else if (caseType === 'eventAnswer') {
                formData[caseType] = value + 1;
            } else if (caseType === 'eventHintType') {
                if (value === 'LINK') { formData.eventHintTxt = ''; }
                if (value === 'TEXT') { formData.eventHintLink = ''; }
                formData[caseType] = value;

            } else {
                formData[caseType] = value;
                console.log(caseType);
                if (caseType == 'checkbox' && value.indexOf('mainChkpdt') > -1) {
                    state.delNum = index;
                }
            }
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
        // 배너 파일업로드
        const fileListUp = async (type, value) => {
            state.imgType = type;
            console.log(type, value);
            await getImageInfo(value[0], imageSizeCallback);
            state[type] = value;
            resetState();
        };

        // 배너 설명 
        const onChangebannerDec = (type, value) => {
            formData[type] = value;
            resetState();
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
                    'mainImgList5': 'mainImg5'
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
        //메인콘텐츠 이미지 순서에 따라 params에 전달
        const regImgUpload = () => {
            state.fileInputList.forEach((item) => {
                const orderMapping = {
                    1: { stateKey: 'mainImgList1', formDataKey: 'mainImgDesc1' },
                    2: { stateKey: 'mainImgList2', formDataKey: 'mainImgDesc2' },
                    3: { stateKey: 'mainImgList3', formDataKey: 'mainImgDesc3' },
                    4: { stateKey: 'mainImgList4', formDataKey: 'mainImgDesc4' },
                    5: { stateKey: 'mainImgList5', formDataKey: 'mainImgDesc5' }
                };

                const mapping = orderMapping[item.order];
                if (mapping) {
                    state[mapping.stateKey] = item.fileName;
                    formData[mapping.formDataKey] = item.filedec;
                }
            });

        };
        // 파일 리스트 삭제 
        const fileListDel = (type) => {
            if (type === 'fileInputList') {
                state.fileInputList[state.imgcheckNum] = {
                    checkbox: false,
                    fileName: [{ fileId: '', name: '', size: '' }],
                    filedec: '',
                    order: 1
                };
            } else {
                state[type] = [];
            }
        };
        // 메인 콘텐츠 컴포넌트 폼 데이터 추가 
        const onChangeFile = async (type, typeName, index, data) => {
            if (!_.isEmpty(data)) {
                if (type === 'inputFile') {
                    state.imgType = 'fileInputList';
                    state.imgcheckNum = index;
                    await getImageInfo(data[0], imageSizeCallback);
                    state.fileInputList[index].fileName = data;
                }
                resetState();
            }
        };
        // 이미지 규격체크 메인 하단 375 배너 327*160
        const imageSizeCallback = (callback) => {
            let imgSize = null;
            let massage = null;
            if (state.imgType === 'bannerList') {
                imgSize = callback.width % 327 !== 0 && callback.height % 160 !== 0;
                massage = '배너이미지 규격에 맞지 않습니다.';
            } else if (state.imgType === 'fileInputList') {
                imgSize = callback.width % 375 !== 0;
                massage = '메인 콘텐츠 이미지가 규격에 맞지 않습니다.';
            }

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
                        } else {
                            state[state.imgType] = [];
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }

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
        //약관 리스트
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
                isEventPoint.value = true;
                state.pointValue = index;
            } else {
                isEventPoint.value = false;
            }
        };
        const onChangePoint = (value, type) => {
            console.log(value, type);
            state.pointValue = value.point;
            formData.eventPoint = value.plcyMapKeySn;
        };


        return {
            $Modal,
            dayJS,
            goToPage,
            fileUploadBanner,
            fileInputMain,
            RoultteAppr,
            isEventclause,
            openModal,
            formData,
            state,
            onSelectPicker,
            onInitDate,
            fileListUp,
            uploadFile,
            fileListDel,
            onChangeFile,
            onSelectFile,
            regImgUpload,
            onChangeFormData,
            regApiEvent,
            registEvent,
            registCancel,
            changeCount,
            onChageBenefit,
            changeCountType,
            checkValidState,
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