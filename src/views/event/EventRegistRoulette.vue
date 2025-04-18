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

                                            <select class="custom-select sm" v-model="formData.pcpType"
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
                                            <div v-for="(item, index) in state.benefitList" :key="index">
                                                <span class="radio" v-if="!(index == 0)">
                                                    <input :id="'benefit' + index" name="openRdo41" type="radio"
                                                        :value="item.value" v-model="formData.eventBnefType"
                                                        :disabled="!(formData.eventType === 'GENERAL') && index == 0"
                                                        @change="changeCount(formData.eventBnefType)">
                                                    <label :for="'benefit' + index">{{ item.label }}</label>
                                                </span>
                                            </div>
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
            <eventBanner :formData="formData" :bannerList="state.bannerList" @fileListUp="fileListUp"
                @bannerDec="onChangebannerDec" @fileListDel="fileListDel" :bannerVal="checkValidState('bannerList')"
                :bannerDec="checkValidState('bannerImgDesc')" :errorMessage="state.validState.message"
                :errorStatus="state.validState.errState"></eventBanner>
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
                        @fileListDel="fileListDel('fileInputList')" :checkValidState="checkValidState('fileInputList')"
                        :errorMessage="state.validState.message" :errorStatus="state.validState.errState"
                        :formData="formData" :checkValidState_dec="checkValidState('mainImgDesc1')" />
                </template>
            </eventMainImg>
            <!-- 하단,백그라운드 이미지 추가 -->
            <eventEtcImg :backImgList="state.backImgList" :bottomImgList="state.bottomImgList" :formData="formData"
                @changeImg="fileListUp" @changeText="onChangeimgDec" @fileListDel="fileListDel" />

            <!-- 기능설정 룰렛  -->
            <eventApprRoultte :formData="formData" @formDataChange="onChangeFormData" @chiocePoint="openPoint"
                v-if="formData.eventType === 'ROULETTE'" ref="RoultteAppr">
                <!-- 룰렛 기능 에러 -->
                <template #errorCase>
                    <div v-if="checkValidState('roulettePoint1') ||
                        checkValidState('roulettePoint2') ||
                        checkValidState('roulettePoint3') ||
                        checkValidState('roulettePoint4') ||
                        checkValidState('roulettePoint5') ||
                        checkValidState('roulettePoint6') ||
                        checkValidState('rouletteProductNm1') ||
                        checkValidState('rouletteProductNm2') ||
                        checkValidState('rouletteProductNm3') ||
                        checkValidState('rouletteProductNm4') ||
                        checkValidState('rouletteProductNm5') ||
                        checkValidState('rouletteProductNm6')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div v-if="checkValidState(`roulettePrbl${formData.rouletteCnt}`)">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div
                        v-if="checkValidState('roulettePcpCnt1') || checkValidState('roulettePcpCnt2') || checkValidState('roulettePcpCnt3') || checkValidState('roulettePcpCnt4') || checkValidState('roulettePcpCnt5') || checkValidState('roulettePcpCnt6')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                </template>
            </eventApprRoultte>
        </template>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="registCancel">취소</button>
            <button type="button" class="btn btn-sl posi" @click="registEvent(formData.eventType)">저장</button>
        </div>
        <!-- 이벤트 약관 선택 -->
        <EventClause :isEventclause="isEventclause" @onModalClose="openClause" :formData="formData" @addCluse="onAddCluse"
            :eventClusListTable="state.eventClusListTable" :eventClusList="state.eventClusList" />
        <EventPointPop :isEventPoint="isEventPoint" @modalClose="openPoint" :formData="formData"
            :pointValue="state.pointValue" @formDataChangePoint="onChangePoint" :choiceSelectNum="state.choiceSelectNum" />

    </section>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import fileInput from './components/fileInput.vue';
import fileInputAtnd from './components/fileInputAtnd.vue';
import PrdAdd from './components/PrdAdd.vue';
import eventApprRoultte from './components/eventApprRoultte.vue';
import eventBanner from './components/eventBanner.vue';
import eventMainImg from './components/eventMainImg.vue';
import eventEtcImg from './components/eventEtcImg.vue';
import EventPointPop from './components/EventPointPop.vue';
import EventClause from './components/EventClause.vue';
import eventClauseList from './components/eventClauseList.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DateSingle from '@/components/ui/DateSingle.vue';
import pushAgree from './components/pushAgree.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _regRouletteEvent } from '@/api/event.js';
import { _uploadFile } from '@/api/common.js';
export default {
    components: { DefaultModal, DateSerch, DateSingle, pushAgree, fileInput, PrdAdd, eventApprRoultte, fileInputAtnd, EventPointPop, EventClause, eventClauseList, eventBanner, eventMainImg, eventEtcImg },
    setup() {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const route = useRoute();
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
            eventProductYn: false,
            eventPzwnDt: '',
            fileInputList: [{
                checkbox: false,
                fileName: [{ fileId: '', name: '', size: '' }],
                filedec: '',
                order: 1
            }],
            fileInputList_Atnd: [{
                checkbox: false,
                chcEps: 0,
                chcEpsPayPnt: 0,
                chcEpsPayImg1: 0,
                chcEpsPayImg2: 0
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
            eventAddAtnd: [
                {
                    atndEvntSn: 0,
                    chcEps: 0,
                    chcEpsPayPnt: 0,
                    chcEpsPayImg1: 0,
                    chcEpsPayImg2: 0
                }
            ],
            addImgList: [],
            eventType: [
                { label: '일반', value: 'GENERAL' },
                { label: '퀴즈', value: 'QUIZ' },
                { label: '룰렛', value: 'ROULETTE' },
                { label: '출석', value: 'ATTENDANCE' }
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
            imgType: '',
            attendNum: 0,
            imgcheckNum: 0
        });

        // 폼 params
        const formData = reactive({
            eventName: '', //제목
            eventType: 'ROULETTE', //이벤트 유형
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
            eventFrcYn: 'N', // 선착순 사용
            eventFrcCount: 0, // 선착순 인원
            eventPoint: 0, //이벤트 포인트
            eventProductYn: computed(() => state.eventProductYn ? 'Y' : 'N'), //이벤트 상품 여부
            eventBtnType: '', //이벤트 버튼 타입
            eventBtnName: '', //이벤트 버튼명
            eventBtnLink: '', // 이벤트 버튼 링크,
            prodlist: [], //상품   immyPayBnef: '', //즉시지급혜택 포인트,상품
            pzwnPayBnef: '', //당첨후 지급혜택  포인트,상품
            rouletteCnt: 4, //룰렛판 갯수
            rouletteType1: 1, //당첨구분(0:꽝,1:당첨)
            rouletteTxt1: '', //1번 표시텍스트
            roulettePoint1: 0, //1번 지급포인트
            rouletteProductNm1: '', //1번 상품명
            rouletteProduct1: '', //1번 지급 상품
            rouletteTax1: 'N', //1번 재세공과금대상 Y/N
            roulettePcpCnt1: 0, //1번 참여가능 인원(0:무제한)
            roulettePrbl1: '', //1번 확률 두자리 두자리
            rouletteType2: 0,
            rouletteTxt2: '',
            roulettePoint2: 0,
            rouletteProductNm2: '',
            rouletteProduct2: '',
            rouletteTax2: 'N',
            roulettePcpCnt2: 0,
            roulettePrbl2: '',
            rouletteType3: 0,
            rouletteTxt3: '',
            roulettePoint3: 0,
            rouletteProductNm3: '',
            rouletteProduct3: '',
            rouletteTax3: 'N',
            roulettePcpCnt3: 0,
            roulettePrbl3: '',
            rouletteType4: 0,
            rouletteTxt4: '',
            roulettePoint4: 0,
            rouletteProductNm4: '',
            rouletteProduct4: '',
            rouletteTax4: 'N',
            roulettePcpCnt4: 0,
            roulettePrbl4: '',
            rouletteType5: 0,
            rouletteTxt5: '',
            roulettePoint5: 0,
            rouletteProductNm5: '',
            rouletteProduct5: '',
            rouletteTax5: 'N',
            roulettePcpCnt5: 0,
            roulettePrbl5: '',
            rouletteType6: 0,
            rouletteTxt6: '',
            roulettePoint6: 0,
            rouletteProductNm6: '',
            rouletteProduct6: '',
            rouletteTax6: 'N',
            roulettePcpCnt6: 0,
            roulettePrbl6: '',
            infAgrmYnCpm: 'N' // 마케팅 수신동의 여부

        });
        //유형 선택시 formData 리셋
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
            formData.prodlist = [];

            formData.immyPayBnef = '';
            formData.pzwnPayBnef = '';
            formData.rouletteCnt = 4;
            formData.rouletteType1 = 1;
            formData.rouletteTxt1 = '';
            formData.roulettePoint1 = 0;
            formData.rouletteProductNm1 = '';
            formData.rouletteProduct1 = '';
            formData.rouletteTax1 = 'N';
            formData.roulettePcpCnt1 = 0;
            formData.roulettePrbl1 = '';
            formData.rouletteType2 = 0;
            formData.rouletteTxt2 = '';
            formData.roulettePoint2 = 0;
            formData.rouletteProductNm2 = '';
            formData.rouletteProduct2 = '';
            formData.rouletteTax2 = 'N';
            formData.roulettePcpCnt2 = 0;
            formData.roulettePrbl2 = '';
            formData.rouletteType3 = 0;
            formData.rouletteTxt3 = '';
            formData.roulettePoint3 = 0;
            formData.rouletteProductNm3 = '';
            formData.rouletteProduct3 = '';
            formData.rouletteTax3 = 'N';
            formData.roulettePcpCnt3 = 0;
            formData.roulettePrbl3 = '';
            formData.rouletteType4 = 0;
            formData.rouletteTxt4 = '';
            formData.roulettePoint4 = 0;
            formData.rouletteProductNm4 = '';
            formData.rouletteProduct4 = '';
            formData.rouletteTax4 = 'N';
            formData.roulettePcpCnt4 = 0;
            formData.roulettePrbl4 = '';
            formData.rouletteType5 = 0;
            formData.rouletteTxt5 = '';
            formData.roulettePoint5 = 0;
            formData.rouletteProductNm5 = '';
            formData.rouletteProduct5 = '';
            formData.rouletteTax5 = 'N';
            formData.roulettePcpCnt5 = 0;
            formData.roulettePrbl5 = '';
            formData.rouletteType6 = 0;
            formData.rouletteTxt6 = '';
            formData.roulettePoint6 = 0;
            formData.rouletteProductNm6 = '';
            formData.rouletteProduct6 = '';
            formData.rouletteTax6 = 'N';
            formData.roulettePcpCnt6 = 0;
            formData.roulettePrbl6 = '';
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
            let Commtarget = ['eventName', 'eventStartDt', 'bannerList', 'bannerImgDesc', 'fileInputList', 'mainImgDesc1', 'backImgList', 'bkgImgDesc'];
            let target = [];
            if (formData.eventType === 'ROULETTE' && formData.eventBnefType === 'IMMEDIATELY') {
                target = [...Commtarget, ...[`rouletteTxt${formData.rouletteCnt}`, 'roulettePoint1', 'roulettePoint2', 'roulettePoint3', 'roulettePoint4', 'roulettePoint5', `roulettePrbl${formData.rouletteCnt}`]];
            }
            if (formData.eventType === 'ROULETTE' && formData.eventBnefType === 'AFTER') {
                target = [...Commtarget, ...[`rouletteTxt${formData.rouletteCnt}`, 'eventPzwnDt', 'rouletteProductNm1', 'rouletteProductNm2', 'rouletteProductNm3', 'rouletteProductNm4', 'rouletteProductNm5', 'roulettePcpCnt1', 'roulettePcpCnt2', 'roulettePcpCnt3', 'roulettePcpCnt4', 'roulettePcpCnt5', 'roulettePcpCnt6', `roulettePrbl${formData.rouletteCnt}`]];
            }

            for (const item of target) {
                console.log(item, !formData[item], `roulettePrbl${formData.rouletteCnt}`);
                state.validState.target = item;
                if (!formData[item] &&
                    (item !== 'bannerList') &&
                    (item !== 'fileInputList') &&
                    (item !== 'mainImgDesc1') &&
                    (item !== 'backImgList') &&
                    (item !== 'productNm') &&
                    (item !== 'text') &&
                    (item !== `rouletteTxt${formData.rouletteCnt}`) &&
                    (item !== 'roulettePoint1') &&
                    (item !== 'roulettePoint2') &&
                    (item !== 'roulettePoint3') &&
                    (item !== 'roulettePoint4') &&
                    (item !== 'roulettePoint5') &&
                    (item !== 'roulettePoint6') &&
                    (item !== 'rouletteProductNm1') &&
                    (item !== 'rouletteProductNm2') &&
                    (item !== 'rouletteProductNm3') &&
                    (item !== 'rouletteProductNm4') &&
                    (item !== 'rouletteProductNm5') &&
                    (item !== 'rouletteProductNm6') &&
                    (item !== 'roulettePcpCnt1') &&
                    (item !== 'roulettePcpCnt2') &&
                    (item !== 'roulettePcpCnt3') &&
                    (item !== 'roulettePcpCnt4') &&
                    (item !== 'roulettePcpCnt5') &&
                    (item !== 'roulettePcpCnt6') &&
                    (item !== `roulettePrbl${formData.rouletteCnt}`)) {
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

                if (item === `rouletteTxt${formData.rouletteCnt}` && _.isEmpty(formData[`rouletteTxt${formData.rouletteCnt}`])) {
                    state.validState.message = getErrorMessage(item);
                    state.validState.errState = true;
                    break;
                }
                const pointItems = ['roulettePoint1', 'roulettePoint2', 'roulettePoint3', 'roulettePoint4', 'roulettePoint5', 'roulettePoint6'];
                for (const pointItem of pointItems) {
                    const typeNumber = pointItem.replace('roulettePoint', '');
                    if (item === pointItem && formData[pointItem] == 0 && formData[`rouletteType${typeNumber}`] == 1) {
                        state.validState.message = getErrorMessage(item);
                        state.validState.errState = true;
                        return;
                    }
                }
                let sum = 0;
                for (let i = 1; i <= formData.rouletteCnt; i++) {
                    sum += Number(formData[`roulettePrbl${i}`]);
                }
                if (item == `roulettePrbl${formData.rouletteCnt}` && !(sum.toFixed(2) === '100.00')) {
                    state.validState.errState = true;
                    state.validState.message = getErrorMessage(item);
                    break;
                }
                const productNmItems = ['rouletteProductNm1', 'rouletteProductNm2', 'rouletteProductNm3', 'rouletteProductNm4', 'rouletteProductNm5', 'rouletteProductNm6'];
                for (const productNmItem of productNmItems) {
                    if (item === productNmItem && formData[`rouletteType${productNmItem.replace('rouletteProductNm', '')}`] == 1 && _.isEmpty(formData[productNmItem])) {
                        state.validState.message = getErrorMessage(item);
                        state.validState.errState = true;
                        return;
                    }
                }
                const pcpCntItems = ['roulettePcpCnt1', 'roulettePcpCnt2', 'roulettePcpCnt3', 'roulettePcpCnt4', 'roulettePcpCnt5', 'roulettePcpCnt6'];
                for (const pcpCntItem of pcpCntItems) {
                    if (item === pcpCntItem && formData[`rouletteType${pcpCntItem.replace('roulettePcpCnt', '')}`] == 1 && formData[pcpCntItem] == 0) {
                        state.validState.message = getErrorMessage(item);
                        state.validState.errState = true;
                        return;
                    }
                }
            }
            return !state.validState.errState;
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
                        const imgs = ['bannerList', 'mainImgList1', 'mainImgList2', 'mainImgList3', 'mainImgList4', 'mainImgList5', 'backImgList', 'bottomImgList'];
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

        //참여 제한선택시 기본값 체크
        const onChageBenefit = (type, eventCase) => {
            type === 'LIMIT' ? formData.pcpCount = '10' : formData.pcpCount = '';
        };
        // 룰렛당첨, 당첨 인원 리셋 함수
        const datareset = (type) => {
            for (let i = 0; i < 6; i++) {
                console.log(RoultteAppr.value.state[`${type + (i)}`]);
                if (type === 'roulettePcpCnt') {
                    formData[`${type + (i + 1)}`] = 0;
                }
                if (type === 'isPrize') {
                    i === 0 ? RoultteAppr.value.state[`${type + (i)}`] = 1 : RoultteAppr.value.state[`${type + (i)}`] = 0;
                }
            }
            console.log(formData);
        };
        //참여 혜택 선택시 기본값 체크
        const changeCount = (type, eventCase) => {
            resetParams();
            if (type == 'IMMEDIATELY') {
                formData.immyPayBnef = 'POINT';
                formData.pzwnPayBnef = '';
                state.eventPzwnDt = '';
                state.bannerList = [];
                state.backImgList = [];
                state.bottomImgList = [];
                state.fileInputList = [{
                    checkbox: false,
                    fileName: [{ fileId: '', name: '', size: '' }],
                    filedec: '',
                    order: 1
                }];
                datareset('roulettePcpCnt');
                datareset('isPrize');
            }
            if (type == 'AFTER') {
                formData.pzwnPayBnef = 'PRODUCT';
                formData.immyPayBnef = '';
                state.eventPzwnDt = state.setSingleDay;
                state.bannerList = [];
                state.backImgList = [];
                state.bottomImgList = [];
                state.fileInputList = [{
                    checkbox: false,
                    fileName: [{ fileId: '', name: '', size: '' }],
                    filedec: '',
                    order: 1
                }];
                datareset('isPrize');
                state.choiceSelectNum = [];
            }
        };
        //유형에 따른 기본값 체크
        const changeCountType = (type, eventCase) => {
            console.log(type, eventCase);
            resetParams();
            if (type == 'GENERAL') {
                goToPage('/event/register/genaral');
            }
            if (type == 'QUIZ') {
                goToPage('/event/register/quiz');
            }
            if (type == 'ROULETTE') {
                formData.eventBnefType = 'IMMEDIATELY';
                formData.pcpType = 'ONCE';
                formData.immyPayBnef = 'POINT';
                formData.pzwnPayBnef = '';
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

                //룰렛 이벤트 추가 params
                let paramsRoulette = {
                    immyPayBnef: formData.immyPayBnef,
                    pzwnPayBnef: formData.pzwnPayBnef,
                    rouletteCnt: formData.rouletteCnt,
                    rouletteType1: formData.rouletteType1,
                    rouletteTxt1: formData.rouletteTxt1,
                    roulettePoint1: formData.roulettePoint1,
                    rouletteProductNm1: formData.rouletteProductNm1,
                    rouletteProduct1: formData.rouletteProduct1,
                    rouletteTax1: formData.rouletteTax1,
                    roulettePcpCnt1: formData.roulettePcpCnt1,
                    roulettePrbl1: formData.roulettePrbl1,
                    rouletteType2: formData.rouletteType2,
                    rouletteTxt2: formData.rouletteTxt2,
                    roulettePoint2: formData.roulettePoint2,
                    rouletteProductNm2: formData.rouletteProductNm2,
                    rouletteProduct2: formData.rouletteProduct2,
                    rouletteTax2: formData.rouletteTax2,
                    roulettePcpCnt2: formData.roulettePcpCnt2,
                    roulettePrbl2: formData.roulettePrbl2,
                    rouletteType3: formData.rouletteType3,
                    rouletteTxt3: formData.rouletteTxt3,
                    roulettePoint3: formData.roulettePoint3,
                    rouletteProductNm3: formData.rouletteProductNm3,
                    rouletteProduct3: formData.rouletteProduct3,
                    rouletteTax3: formData.rouletteTax3,
                    roulettePcpCnt3: formData.roulettePcpCnt3,
                    roulettePrbl3: formData.roulettePrbl3,
                    rouletteType4: formData.rouletteType4,
                    rouletteTxt4: formData.rouletteTxt4,
                    roulettePoint4: formData.roulettePoint4,
                    rouletteProductNm4: formData.rouletteProductNm4,
                    rouletteProduct4: formData.rouletteProduct4,
                    rouletteTax4: formData.rouletteTax4,
                    roulettePcpCnt4: formData.roulettePcpCnt4,
                    roulettePrbl4: formData.roulettePrbl4,
                    rouletteType5: formData.rouletteType5,
                    rouletteTxt5: formData.rouletteTxt5,
                    roulettePoint5: formData.roulettePoint5,
                    rouletteProductNm5: formData.rouletteProductNm5,
                    rouletteProduct5: formData.rouletteProduct5,
                    rouletteTax5: formData.rouletteTax5,
                    roulettePcpCnt5: formData.roulettePcpCnt5,
                    roulettePrbl5: formData.roulettePrbl5,
                    rouletteType6: formData.rouletteType6,
                    rouletteTxt6: formData.rouletteTxt6,
                    roulettePoint6: formData.roulettePoint6,
                    rouletteProductNm6: formData.rouletteProductNm6,
                    rouletteProduct6: formData.rouletteProduct6,
                    rouletteTax6: formData.rouletteTax6,
                    roulettePcpCnt6: formData.roulettePcpCnt6,
                    roulettePrbl6: formData.roulettePrbl6
                };

                let params = {
                    ...paramsComm,
                    ...paramsRoulette
                };
                console.log(params);
                const response = await _regRouletteEvent(params);
                console.log(response);
                if (response.data.code === 'OK') {
                    goToPage('/event/list');
                }
            } catch (error) {
                console.log(error);
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
        //이미지 등록폼 추가 || 삭제
        const onSelectFile = (caseType, type) => {
            // console.log(type, caseType);
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
            } else if (value === 'PcpCnt') {
                if (idType.checked) {
                    formData[`roulettePcpCnt${index + 1}`] = 1;
                } else {
                    formData[`roulettePcpCnt${index + 1}`] = 0;
                }
            } else if (caseType.indexOf('roulettePcpCntText') === 0) {
                let idType = document.querySelector(`#roulettePcpCntText${value}`);
                formData[`roulettePcpCnt${value}`] = Number(idType.value);
                console.log(formData[`roulettePcpCnt${value}`]);

            } else if (caseType.indexOf('roulettePrbl') === 0) {
                let per1 = document.querySelector(`#roulettePrbl_first${value}`).value;
                let per2 = document.querySelector(`#roulettePrbl_last${value}`).value;
                formData[`roulettePrbl${value}`] = `${per1}.${per2}`;
            } else if (value === 'Product') {
                let idType = document.querySelector(`#${caseType}`);
                formData[caseType] = idType.value;

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

            } else if (caseType.indexOf('rouletteType') > -1) {
                formData[caseType] = value;
                // 룰렛 꽝인지 당첨인지에 따른 리셋처리
                if (value == 0) {
                    // console.log('꽝입니다.');
                    formData[`rouletteTax${index + 1}`] = 'N';
                    formData[`rouletteProductNm${index + 1}`] = '';
                    formData[`rouletteTxt${index + 1}`] = '';
                    formData[`rouletteProduct${index + 1}`] = '';
                    formData[`roulettePoint${index + 1}`] = '';
                    formData[`roulettePcpCnt${index + 1}`] = 0;
                    formData[`rouletteTxt${index + 1}`] = '';
                } else {
                    if (formData.eventBnefType === 'AFTER') {
                        formData[`roulettePcpCnt${index + 1}`] = 1;
                    }
                }
            } else {
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
                state.eventPzwnDt = '';
                if (formData.eventBnefType === 'AFTER') {
                    state.eventPzwnDt = value;
                }
            }
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
        };
        // 배너 파일업로드
        const fileListUp = async (type, name) => {
            state.imgType = type;
            let inputName = null;
            if (type === 'bannerList') {
                await getImageInfo(name[0], imageSizeCallback);
                state[type] = name;
                resetState();
            }
            if (type === 'backImgList' || type === 'bottomImgList') {
                await getImageInfo((Array.from(document.querySelector(`#${name}`).files))[0], imageSizeCallback);
                state[type] = (Array.from(document.querySelector(`#${name}`).files));
                console.log(state[type]);
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
                massage = '배너이미지 규격에 맞지 않습니다.';
            } else if (state.imgType === 'fileInputList') {
                imgSize = callback.width % 375 !== 0;
                massage = '메인 콘텐츠 이미지가 규격에 맞지 않습니다.';
            } else if (state.imgType.indexOf('fileUploadtype') === 0) {
                imgSize = callback.width % 60 !== 0;
                massage = '출석도장이미지 규격에 맞지 않습니다.';
            } else {
                imgSize = callback.width % 375 !== 0;
                massage = '배경이미지 규격에 맞지 않습니다.';
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
                            state.fileInputList = [{
                                checkbox: false,
                                fileName: [{ fileId: '', name: '', size: '' }],
                                filedec: '',
                                order: 1
                            }];
                        } else if (state.imgType.indexOf('fileUploadtype') === 0) {
                            state.addImgList[state.attendNum][state.imgType] = '';
                            console.log(state.addImgList, state.attendNum, state.imgType);
                        } else {
                            state[state.imgType] = [];
                        }
                    })
                    .catch(error => {
                        console.log(error);
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
        const fileListDel = (type, index) => {
            console.log(type, index);
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
                if (type === 'imgdec') {
                    formData['mainImgDesc' + (index + 1)] = data.filedec;
                }
                resetState();
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
                let idType = document.querySelector(`#roulettePoint${index}`);
                idType.value = null;
                formData[`roulettePoint${type}`] = 0;
                isEventPoint.value = true;
                state.pointValue = index;
                console.log(formData[`roulettePoint${type}`]);
            } else {
                isEventPoint.value = false;
            }
        };
        // 포인트 추가
        const onChangePoint = (value, type) => {
            console.log(value, type);
            let idType = document.querySelector(`#roulettePoint${type}`);
            formData[`roulettePoint${type}`] = value.plcyMapKeySn;
            idType.value = value.point;
            state.choiceSelectNum.push(value.plcyMapKeySn);
            console.log(state.choiceSelectNum);
        };
        return {
            $Modal,
            dayJS,
            goToPage,
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
            registEvent,
            changeCount,
            onChageBenefit,
            changeCountType,
            onChangeimgDec,
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