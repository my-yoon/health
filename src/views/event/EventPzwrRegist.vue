<template>
    <section>
        <div class="ui-section">
            <subTitleBar :subTitle="state.subTitle" />
            <div class="ui-content">
                <div class="tbl-wrap">
                    <!-- {{ state.pageType }}<br> -->
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
                                            <input type="text" class="form-control" v-model="formData.title"
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
                                            <select class="custom-select sm" v-model="state.eventSn" ref="eventSelect"
                                                @change="changeList" :disabled="state.pageType === 'detail'">
                                                <option value="">선택하세요</option>
                                                <option v-for="(item, index) in state.searchList" :key="index"
                                                    :value="item.eventMaster.eventSn">
                                                    {{ item.eventMaster.eventName }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">게시일시 <span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <DateSingle @onSelectDate="onSelectPicker" :setDay="state.setDay"
                                        :disabled="!(formData.eventSn)" style="display:flex" ref="dateSearch">
                                        <template #time>
                                            <TimeSingle @onSelectDate="onSelectPicker" :setTime="state.setTime"
                                                :disabled="!(formData.eventSn)" ref="datetime" class="ml-10">
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
                                                    v-model="formData.pstYn"
                                                    :disabled="state.pageType === 'detail' || !formData.eventSn">
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
                                    <template v-if="formData.eventSn && state.searchCon[0].eventMaster">
                                        <span v-if="state.searchCon[0].eventMaster.eventTarget == 'ALL'">전체</span>
                                    </template>
                                    <!-- 회원그룹선택
                                    <div class="member-group-list"> 전환고객(kb은행), 군 간부, 공항철도, 국민카드, 푸르덴셜, 저축은행, 데이타시스템,
                                        인베스트먼트, 자산운용, 부동산신탁, 신용정보, 생명, 안랩, 주식회사 아이센스 </div> -->
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">이벤트 유형</th>
                                <td>
                                    <template v-if="formData.eventSn && state.searchCon[0].eventMaster">
                                        <span v-if="state.searchCon[0].eventMaster.eventType == 'GENERAL'">일반</span>
                                        <span v-if="state.searchCon[0].eventMaster.eventType == 'QUIZ'">퀴즈</span>
                                        <span v-if="state.searchCon[0].eventMaster.eventType == 'ROULETTE'">룰렛</span>
                                        <span v-if="state.searchCon[0].eventMaster.eventType == 'ATTENDANCE'">출석</span>
                                    </template>

                                </td>
                                <th scope="row">이벤트 기간</th>
                                <td>
                                    <template v-if="formData.eventSn && state.searchCon[0].eventMaster">
                                        {{ dayJS(state.searchCon[0].eventMaster.eventStartDt).format('YYYY-MM-DD') }}
                                        ~
                                        {{ dayJS(state.searchCon[0].eventMaster.eventEndDt).format('YYYY-MM-DD') }}
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">참여제한</th>
                                <td>
                                    <template v-if="formData.eventSn && state.searchCon[0].eventMaster">
                                        <span v-if="state.searchCon[0].eventMaster.pcpType == 'ONEDAY'">1일1회</span>
                                        <span v-if="state.searchCon[0].eventMaster.pcpType == 'ONCE'">기간내 1회</span>
                                        <span v-if="state.searchCon[0].eventMaster.pcpType == 'LIMIT'">기간내 n회</span>
                                        <span v-if="state.searchCon[0].eventMaster.pcpType == 'NONE'">참여제한없음</span>
                                    </template>
                                </td>
                                <th scope="row">당첨 후지급혜택<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>

                                    <div v-for="(item, index) in state.productList" :key="index">
                                        {{ item.productNm }}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">등록자</th>
                                <td>
                                    <template v-if="formData.eventSn && state.searchCon[0].eventMaster">
                                        {{ state.searchCon[0].eventMaster.adminId }} ({{state.searchCon[0].eventMaster.adminNm}})
                                    </template>
                                </td>
                                <th scope="row">등록일자</th>
                                <td>
                                    <template v-if="formData.eventSn && state.searchCon[0].eventMaster">
                                        {{ dayJS(state.searchCon[0].eventMaster.fstRgsDt).format('YYYY-MM-DD') }}
                                    </template>
                                </td>
                            </tr>
                            <!-- <tr>
                                <th scope="row">수정자</th>
                                <td>
                                    <template v-if="formData.eventSn">{{ state.searchCon[0].lastUpdrSn }}</template>
                                </td>
                                <th scope="row">최종수정일자</th>
                                <td>
                                    <template v-if="formData.eventSn && !(state.searchCon[0].lastUpdDt == '')">
                                        {{ dayJS(state.searchCon[0].lastUpdDt).format('YYYY-MM-DD') }}
                                    </template>
                                </td>
                            </tr> -->
                            <tr>
                                <th scope="row">컨텐츠<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="editor_container">
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
            <button type="button" class="btn btn-sl posi" @click="actionBtns('edit')"
                v-if="state.pageType === 'detail'">저장</button>
            <button type="button" class="btn btn-sl posi" @click="savePzwr" v-else>저장</button>
        </div>
    </section>
</template>
<script>
import { reactive, inject, onMounted, ref, watch, computed, nextTick } from 'vue';
import { _eventPzwrReigst, _getPzwrEventList } from '@/api/event.js';
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
            subTitle: '당첨자 발표 등록',
            searchCon: [
                { eventMaster: null },
                { productList: null }
            ],
            searchList: [],
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
            productList: [],
            eventSn: '',
            contents: ''
        });

        const formData = reactive({
            title: '',
            eventSn: computed(() => state.eventSn),
            pstDate: computed(() => state.startDay),
            pstTime: computed(() => state.timeH + ':' + state.timeM),
            pstYn: '',
            contents: computed(() => state.contents)
        });


        onMounted(async () => {
            //에디터 초기화 
            editor = await initializeEditor();
            await getPzwrEventList();
            await onchangeSingleDate();
            //에디터 데이터 폼 데이터 업데이트 
            editor.setData(state.contents);
            editor.model.document.on('change', () => {
                state.contents = editor.getData();
            });

        });
        watch(formData, () => {
            if (formData.eventSn) {
                // let list = _.clone(state.searchList);
                // state.searchCon = list.filter((v, i) => v.eventMaster.eventSn === eventNum);
                // state.stratDay = state.searchCon[0].eventMaster.eventPzwnDt;
                // dateSearch1.value.setFromDate(state.stratDay);
                // console.log(dateSearch1.value);
            }
            resetState();
        });
        //이벤트 재선택
        const changeList = () => {
            let eventOrigin = eventSelect.value.options.selectedIndex;
            console.log(eventSelect.value.options[eventSelect.value.options.selectedIndex].value);
            let list = _.clone(state.searchList);
            let eventNum = Number(eventSelect.value.options[eventSelect.value.options.selectedIndex].value);
            state.searchCon = list.filter((v, i) => v.eventMaster.eventSn === eventNum);
            state.stratDay = new Date().getTime() + 3600 * 1000 * 24 * 1;
            dateSearch.value.setFromDate(state.stratDay);
            datetime.value.state.hour = '00';
            datetime.value.state.minutes = '00';
            state.productList = state.searchCon[0].productList;
            console.log(state.searchCon);
            state.eventSn = state.searchCon[0].eventMaster.eventSn;

        };
        //모달창열기 
        const actionBtns = async (type) => {
            if (type === 'save') {
                state.modalMsg = '당첨자 등록 하시겠습니까?';
            }
            if (type === 'edit') {
                state.modalMsg = '변경된 내용을 저장하시겠습니까?';
            }

            $Modal.confirm({
                title: '',
                message: state.modalMsg,
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            })
                .then(async (success) => {
                    console.log(success);

                    if (type === 'save') {
                        await eventPzwrReigst();
                    }
                    if (type === 'edit') {
                        //수정 API
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };
        const onchangeSingleDate = (type, value, status) => {
            console.log(type, value, status);
        };
        const selectedOptions = (valueCode, valueName, type) => {
            console.log(type);
            if (type === 'rprsTlnoFno' || type === 'mailType2') {
                if (type === 'mailType2') {
                    state.mailType2 = valueName;
                } else {
                    formData[type] = valueName;
                }
            } else if (type === 'mailType1') {
                console.log();
            } else if (type === 'noticeCategoryCdBC') {
                formData.value.noticeCategoryCd = valueCode;
            } else {
                formData.value[type] = valueCode;
            }
            console.log(valueCode, valueName, type);
        };
        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            console.log(type, value, status);
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
                state.startDay = dayJS(value).format('YYYY-MM-DD');
            } else if (type === 'time') {
                if (status === 'hour') {
                    state.timeH = value;
                } else if (status === 'minutes') {
                    state.timeM = value;
                }
                console.log(formData.pstTime);
            }
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
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
                actionBtns('save');
            }

        };
        const resetState = () => {
            state.isCheckTermsName = false; // 중복확인
            state.validState.errState = false; // validation
            state.validState.message = '';
        };
        // @validate
        const validCheck = (type) => {
            console.log(type);
            let target = [];
            target = ['title', 'pstYn', 'contents'];

            for (const item of target) {
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

                if (!formData[item]) {
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
        // 신규등록
        const eventPzwrReigst = async () => {
            try {
                let params = {
                    title: formData.title,
                    eventSn: formData.eventSn,
                    pstDate: formData.pstDate,
                    pstTime: formData.pstTime,
                    pstYn: formData.pstYn,
                    contents: formData.contents
                };
                console.log(params);
                const response = await _eventPzwrReigst(params);
                console.log(response);
                if (response.data.code === 'OK') {
                    goToPage('/event/winner_notice/list');
                }
                console.log(response);

            } catch (error) {
                console.log(error);
            }
        };
        return {
            //공통 사용
            $Modal,
            dayJS,
            noticeCategoryCd,
            dateSearch,
            datetime,
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
            selectedOptions,
            actionBtns,
            onSelectPicker,
            checkValidState,
            savePzwr,
            changeList,
            eventSelect




        };
    }
};
</script>