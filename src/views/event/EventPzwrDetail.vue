<template>
    <section>
        <div class="ui-section">
            <subTitleBar :subTitle="state.subTitle" />
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
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.evenPzw.title"
                                                :class="checkValidState('title') ? 'error' : ''">
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('title')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">이벤트 선택<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <select class="custom-select sm" @change="changeList()" ref="eventSelect"
                                                v-model="state.eventSn" :disabled="dateValueCompare">
                                                <template v-if="state.searchList.length !== 0">
                                                    <option :value="state.evenPzw.eventSn">{{ state.evenPzw.eventName }}
                                                    </option>
                                                    <option v-for="(item, index) in state.searchList" :key="index"
                                                        :value="item.eventMaster.eventSn">
                                                        {{ item.eventMaster.eventName }}
                                                    </option>
                                                </template>
                                                <template v-else>
                                                    <option :value="state.evenPzw.eventName" selected>
                                                        {{ state.evenPzw.eventName }}
                                                    </option>
                                                </template>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <!-- 이벤트선택 수정 전 -->
                            <tr>
                                <th scope="row">게시일시 <span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <DateSingle @onSelectDate="onSelectPicker" :setDay="state.startDay"
                                        :disabled="dateValueCompare" style="display:flex" ref="dateSearch">
                                        <template #time>
                                            <TimeSingle @onSelectDate="onSelectPicker" :setTime="state.setTime"
                                                :disabled="dateValueCompare" ref="datetime" class="ml-10">
                                            </TimeSingle>
                                        </template>
                                    </DateSingle>

                                </td>
                                <th scope="row">게시여부 <span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio" v-for="(item, index) in state.eventShow" :key="index">
                                                <input :id="'show' + index" name="openRd2" type="radio" :value="item.value"
                                                    v-model="state.evenPzw.pstYn" :disabled="dateValueCompare">
                                                <label :for="'show' + index">{{ item.label }}</label>
                                            </span>
                                        </div>

                                    </div>
                                    <div v-if="checkValidState('pstYn')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">이벤트 대상 <span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    전체
                                    <!-- 회원그룹선택
                                    <div class="member-group-list"> 전환고객(kb은행), 군 간부, 공항철도, 국민카드, 푸르덴셜, 저축은행, 데이타시스템,
                                        인베스트먼트, 자산운용, 부동산신탁, 신용정보, 생명, 안랩, 주식회사 아이센스 </div> -->
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">이벤트 유형</th>
                                <td>
                                    <span v-if="state.evenPzw.eventType == 'GENERAL'">일반</span>
                                    <span v-if="state.evenPzw.eventType == 'QUIZ'">퀴즈</span>
                                    <span v-if="state.evenPzw.eventType == 'ROULETTE'">룰렛</span>
                                    <span v-if="state.evenPzw.eventType == 'ATTENDANCE'">출석</span>

                                </td>
                                <th scope="row">이벤트 기간</th>
                                <td>
                                    {{ state.eventMaster.eventStartDt }}
                                    ~
                                    {{ state.eventMaster.eventEndDt }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">참여제한</th>
                                <td>
                                    <span v-if="state.eventMaster.pcpType == 'ONEDAY'">1일1회</span>
                                    <span v-if="state.eventMaster.pcpType == 'ONCE'">기간내 1회</span>
                                    <span v-if="state.eventMaster.pcpType == 'LIMIT'">기간내 n회</span>
                                    <span v-if="state.eventMaster.pcpType == 'NONE'">참여제한없음</span>
                                </td>
                                <th scope=" row">당첨 후 지급혜택<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <td>
                                    <div v-for="(item, index) in state.productList" :key="index">
                                        {{ item.productNm }}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">등록자</th>
                                <td>
                                    {{ state.evenPzw.adminName }}
                                </td>
                                <th scope="row">등록일자</th>
                                <td>
                                    {{ dayJS(state.evenPzw.regDate).format('YYYY-MM-DD') }}
                                </td>
                            </tr>

                            <tr>

                                <th scope="row">컨텐츠<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="editor_container" id="editor_container">
                                        <ck-editor :editor="state.ckeditor" :model-value="state.contents" />
                                    </div>
                                    <div v-if="checkValidState('contents')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/event/winner_notice/list')">취소</button>
            <button type="button" class="btn btn-sl posi" @click="savePzwr">
                <template v-if="state.pageType === 'regist'">저장</template>
                <template v-else>수정</template>
            </button>
        </div>
    </section>
</template>
<script>
import { reactive, inject, onMounted, ref, watch, computed, nextTick, onBeforeMount } from 'vue';
import { _eventPzwrDetail, _getPzwrEventList, _updatePzwr } from '@/api/event.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import TimeSingle from '@/components/ui/TimeSingle.vue';
import DateSingle from '@/components/ui/DateSingle.vue';
import { useCommFunc, initializeEditor } from '@/core/helper/common.js';

import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

export default {
    components: {
        DefaultModal,
        TimeSingle,
        DateSingle,
        'ck-editor': CKEditor.component
    },
    setup() {

        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow, isRequestShow } = useCommFunc();
        const store = useStore();
        const route = useRoute();
        const noticeCategoryCd = ref(null);
        const dateSearch = ref(null);
        const datetime = ref(null);
        const dateSearch1 = ref(null);
        const datetime1 = ref(null);
        const eventSelect = ref(null);
        let editor = null;
        const state = reactive({
            imgName: '',
            setDay: new Date(),
            ckeditor: ClassicEditor,
            editorCon: '',
            // editorconfig: EditorOptions.editorConfig,
            pageType: 'regist',
            updateAt: null,
            subTitle: '당첨자 발표 상세',
            eventShow: [
                { label: '게시', value: 'Y' },
                { label: '비게시', value: 'N' }
            ],
            modalMsg: '',
            startDay: null,
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            },
            timeH: '00',
            timeM: '',
            ancSn: '',
            evenPzw: {},
            eventMaster: {},
            eventGeneral: {},
            productList: [],
            searchList: [],
            searchCon: {},
            changeAfter: false,
            contents: ''


        });

        const formData = reactive({
            ancSn: computed(() => state.ancSn),
            title: computed(() => state.evenPzw.title),
            eventSn: computed(() => state.eventSn),
            pstDate: computed(() => state.startDay),
            pstTime: computed(() => state.setTime),
            pstYn: computed(() => state.evenPzw.pstYn),
            contents: computed(() => state.contents)
        });

        watch(formData, () => {
            resetState();
        });


        onMounted(async () => {
            if (route.query.ancSn) {
                state.ancSn = route.query.ancSn;
                state.pageType = 'detail';
            }
            //에디터 초기화 
            editor = await initializeEditor();
            await eventPzwrDetail();
            await getPzwrEventList();
            //에디터 데이터 폼 데이터 업데이트 
            editor.setData(state.contents);
            editor.model.document.on('change', () => {
                state.contents = editor.getData();
            });
        });
        watch(formData, () => {
            resetState();
        });
        const dateValueCompare = computed(() => state.startDay <= dayJS(state.setDay).format('YYYY-MM-DD'));
        //모달창열기 
        const actionBtns = async (type) => {
            $Modal.confirm({
                title: '',
                message: '변경된 내용을 저장하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            })
                .then(async (success) => {
                    console.log(success);

                    await updatePzwr();
                })
                .catch(error => {
                    console.log(error);
                });
        };
        //이벤트 재선택
        const changeList = () => {
            let eventOrigin = eventSelect.value.options.selectedIndex;
            console.log(eventSelect.value.options[eventSelect.value.options.selectedIndex].value);
            if (eventOrigin !== 0) {
                let list = _.clone(state.searchList);
                let eventNum = Number(eventSelect.value.options[eventSelect.value.options.selectedIndex].value);
                state.searchCon = list.filter((v, i) => v.eventMaster.eventSn === eventNum);
                state.stratDay = new Date().getTime() + 3600 * 1000 * 24 * 1;
                dateSearch.value.setFromDate(state.stratDay);
                datetime.value.state.hour = '00';
                datetime.value.state.minutes = '00';
                console.log(state.searchCon);
                state.eventSn = state.searchCon[0].eventMaster.eventSn;
                state.evenPzw.eventType = state.searchCon[0].eventMaster.eventType;
                state.eventMaster.pcpType = state.searchCon[0].eventMaster.pcpType;
                state.eventMaster.eventStartDt = state.searchCon[0].eventMaster.eventStartDt;
                state.eventMaster.eventEndDt = state.searchCon[0].eventMaster.eventEndDt;
                state.evenPzw.regDate = state.searchCon[0].eventMaster.fstRgsDt;
                state.evenPzw.adminName = state.searchCon[0].eventMaster.fstRgtrSn;
                state.productList = state.searchCon[0].productList;
            } else {
                eventPzwrDetail();
            }
        };
        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            // console.log(type, value, status);
            if (type === 'singleday') {
                // console.log(value);
                state.startDay = dayJS(value).format('YYYY-MM-DD');
            } else if (type === 'time') {
                if (status === 'hour') {
                    state.timeH = value;
                } else if (status === 'minutes') {
                    state.timeM = value;
                }
            }
        };
        //조건 쪼개기
        const dateSlice = () => {
            //날짜 쪼개기
            const dateObj = new Date(state.evenPzw.pstDt);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const date = dateObj.getDate();
            const hours = dateObj.getHours();
            const min = dateObj.getMinutes();
            state.startDay = `${year}${month}${date}`;
            state.setTime = `${hours}${min}`;
            datetime.value.state.hour = hours;
            datetime.value.state.minutes = min;
        };
        const eventPzwrDetail = async () => {
            try {
                const response = await _eventPzwrDetail(state.ancSn);
                state.evenPzw = response.data.data;
                state.eventSn = response.data.data.eventSn;
                state.eventMaster = response.data.data.eventMaster;
                state.eventGeneral = response.data.data.eventGeneral;
                dateSearch.value.setFromDate(state.stratDay);
                state.contents = response.data.data.contents;
                if (response.data.data.eventType === 'GENERAL') {
                    state.productList = response.data.data.eventGeneral.productList;
                }
                if (response.data.data.eventType === 'QUIZ') {
                    state.productList = response.data.data.eventQuiz.productList;
                }
                if (response.data.data.eventType === 'ROULETTE') {
                    state.productList = response.data.data.eventRoulette.productList;
                }
                if (response.data.data.eventType === 'ATTENDANCE') {
                    state.productList = response.data.data.eventAttendance.productList;
                }
                // console.log(response.data.data, state.contents);
                dateSlice();
            } catch (error) {
                console.log(error);
            }
        };
        const updatePzwr = async () => {
            try {
                let params;
                if (dateValueCompare.value) {
                    params = {
                        ancSn: formData.ancSn,
                        title: formData.title,
                        contents: formData.contents
                    };
                } else {
                    params = {
                        ancSn: formData.ancSn,
                        title: formData.title,
                        eventSn: formData.eventSn,
                        pstDate: formData.pstDate,
                        pstTime: formData.pstTime,
                        pstYn: formData.pstYn,
                        contents: formData.contents
                    };
                }
                console.log(params);
                const response = await _updatePzwr(params);
                if (response.data.code === 'OK') {
                    goToPage('/event/winner_notice/list');
                }
            } catch (error) {
                console.log(error);
            }
        };
        const getPzwrEventList = async () => {
            try {
                const response = await _getPzwrEventList();
                state.searchList = response.data.data;
                console.log(response.data.data, state.searchList);
            } catch (error) {
                console.log(error);
            }
        };
        const savePzwr = () => {
            if (validCheck()) {
                actionBtns('edit');
            }
        };
        const resetState = () => {
            state.isCheckTermsName = false; // 중복확인
            state.validState.errState = false; // validation
            state.validState.message = '';
        };
        const query = state.word.slice(lastAtindex + 1).trim();
        const name = query.replace(parttern, '');
        state.userList = state.relatedList;

        // @validate
        const validCheck = (type) => {
            console.log(type);
            let target = [];
            target = ['title', 'pstYn', 'contents'];

            for (const item of target) {
                console.log(state.evenPzw[item]);
                state.validState.target = item;
                if (item == 'title') {
                    state.validState.message = '타이틀을 작성해 주세요 ';
                }
                if (item == 'pstYn') {
                    state.validState.message = '게시여부를 선택해 주세요';
                }
                if (item == 'contents') {
                    state.validState.message = '컨텐츠 내용을 작성해 주세요';
                }

                if (!state.evenPzw[item]) {
                    state.validState.errState = true;
                    break;
                }
            }
            return !state.validState.errState;
        };
        // 에러체크
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };
        const eventChck = (event, index, tagname) => {
            if (event.key == arrowdown) {
                state.tagname = tagname;
            } else {
                state.tagname = tagname;
            }
            return false;
        };
        return {
            //공통 사용
            $Modal,
            dayJS,
            noticeCategoryCd,
            dateSearch,
            datetime,
            dateSearch1,
            datetime1,
            goToPage,
            fileDown,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            isRequestShow,
            state,
            formData,
            openModal,
            actionBtns,
            onSelectPicker,
            checkValidState,
            savePzwr,
            dateValueCompare,
            changeList,
            eventSelect



        };
    }
};
</script>