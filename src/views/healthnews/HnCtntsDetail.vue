<template>
    <div class="tbl-wrap" v-if="state.contentsData">
        <table class="table reg">
            <colgroup>
                <col style="width: 160px;">
                <col style="width: auto;">
                <col style="width: 160px;">
                <col style="width: auto;">
            </colgroup>
            <tbody>
                <tr>
                    <th scope="row">제목</th>
                    <td colspan="3">{{ state?.contentsData?.title ?? '' }}</td>
                </tr>
                <tr>
                    <th scope="row">부가 설명</th>
                    <td colspan="3">{{ state?.contentsData?.contentsContents?.subTitle ?? '' }}</td>
                </tr>
                <tr>
                    <th scope="row">콘텐츠 타입</th>
                    <td>{{ state?.contentsData?.contentsContents?.contType ?? '' }}</td>
                    <th scope="row">등록일</th>
                    <td>{{ state?.contentsData?.firstRegistrationDate ?? '' }}</td>
                </tr>
                <tr>
                    <th scope="row">조회 수</th>
                    <td>{{ addComma(state?.contentsData?.inquiryNumber ?? 0) }}</td>
                    <th scope="row">게시 여부</th>
                    <td>
                        <div class="reg-group">
                            <div class="reg-item">
                                <span class="radio" v-for="(item, index) in pstOptionsList" :key="`pst-option-${index}`">
                                    <input :id="`isNotice${index}`" name="isNoticeGroup" type="radio" v-model="state.contentsData.postUpAlternative" :value="item.code">
                                    <label :for="`isNotice${index}`">{{ item.name }}</label>
                                </span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">퀴즈 참여</th>
                    <td>{{ addComma(state?.contentsData?.quizCount ?? 0) }}</td>
                    <th scope="row">정답률</th>
                    <td>{{ state?.contentsData?.quizCorrectAnswerRate ?? '' }} {{ state.contentsData.quizCorrectAnswerRate ? '%' : '' }}</td>
                </tr>
                <tr>
                    <th scope="row">관심 설정</th>
                    <td>{{ addComma(state?.contentsData?.interestNewsAggregateCount ?? 0) }}</td>
                    <th scope="row">공유</th>
                    <td>{{ addComma(state?.contentsData?.shareCount ?? 0) }}</td>
                </tr>
                <tr>
                    <th scope="row">출처</th>
                    <td colspan="3"></td>
                </tr>
                <tr>
                    <th scope="row">라벨 작성자</th>
                    <td>{{ state?.contentsData?.contentsContents?.label?.name ?? '' }}</td>
                    <th scope="row" rowspan="2">라벨 이미지</th>
                    <td rowspan="2">
                        <img class="contents-label-img" :src="state?.contentsData?.contentsContents?.label?.img ?? ''" />
                    </td>
                </tr>
                <tr>
                    <th scope="row">라벨 소속</th>
                    <td>{{ state?.contentsData?.contentsContents?.label?.team ?? '' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="ui-section" v-if="state.contentsData">
        <div class="ui-title-3">
            <h3>콘텐츠 썸네일</h3>
        </div>
        <div class="ui-content">
            <img class="contents-thumb-img" :src="state?.contentsData?.tnlUniformResourceLocator ?? ''" />
        </div>
    </div>
    <div class="ui-section" v-if="state.contentsData">
        <div class="ui-title-3">
            <h3>콘텐츠 내용</h3>
        </div>
        <div class="ui-content">
            <div class="detail-contents" v-html="state?.contentsData?.contentsContents?.contents ?? ''"/>
        </div>
    </div>
    <div class="ui-section" v-if="state.contentsData">
        <div class="ui-title-3">
            <h3>퀴즈</h3>
        </div>
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
                            <th scope="row">퀴즈 타입</th>
                            <td colspan="3">{{ state?.contentsData?.contentsContents?.quiz?.type ?? '' }}</td>
                        </tr>
                        <tr>
                            <th scope="row">퀴즈 문제</th>
                            <td colspan="3">{{ state?.contentsData?.contentsContents?.quiz?.question ?? '' }}</td>
                        </tr>
                        <tr v-for="(item, index) in state?.contentsData?.contentsContents?.quiz?.choice ?? []" :key="`choice-${index}`">
                            <th v-if="index === 0" scope="row" :rowspan="state?.contentsData?.contentsContents?.quiz?.choice?.length ?? 0">퀴즈 보기</th>
                            <td colspan="3">{{ index + 1 }}. {{ item }}</td>
                        </tr>
                        <tr>
                            <th scope="row">퀴즈 정답</th>
                            <td>{{ state?.contentsData?.contentsContents?.quiz?.answer ?? '' }}</td>
                            <th scope="row">퀴즈 포인트</th>
                            <td>{{ addComma(state?.contentsData?.contentsContents?.quiz?.point ?? 0) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="ui-section" v-if="state.contentsData">
        <div class="ui-title-3">
            <h3>리뷰</h3>
        </div>
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
                            <th scope="row">리뷰 작성자</th>
                            <td>{{ state?.contentsData?.contentsContents?.review?.info?.name ?? '' }}</td>
                            <th scope="row" rowspan="2">리뷰 이미지</th>
                            <td rowspan="2">
                                <img class="contents-review-img" :src="state?.contentsData?.contentsContents?.review?.info?.img ?? ''"/>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">리뷰 소속</th>
                            <td>{{ state?.contentsData?.contentsContents?.review?.info?.team ?? '' }}</td>
                        </tr>
                        <tr>
                            <th scope="row">리뷰 내용</th>
                            <td colspan="3">
                                <div class="form-item">
                                    <textarea class="form-control review-contents" v-model="state.contentsData.contentsContents.review.contents" readonly></textarea>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="ui-section" v-if="state.contentsData">
        <div class="ui-title-3">
            <h3>맵핑 관리</h3>
        </div>
        <div class="ui-content">
            <div class="tbl-wrap">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">해시태그</th>
                            <td>
                                <div class="reg-group wp-100">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" placeholder="콤마(,) 입력시 자동으로 해시태그가 추가됩니다." v-model="state.hashTagText" @keyup="addHashTagAtComma">
                                    </div>
                                </div>
                                <div v-if="state?.contentsData?.hashTagList?.length || state?.addHashTagList?.length" class="reg-group wp-100">
                                    <div class="ui-chips">
                                        <template v-for="(item, index) in state.contentsData.hashTagList" :key="`hash-chips-${index}`">
                                            <div v-if="item" class="ui-chips-item">
                                                <span>{{ item }}</span>
                                                <button type="button" class="ui-chips-del" @click="removeHashTag(index)"><span class="offscreen">삭제하기</span></button>
                                            </div>
                                        </template>
                                        <template v-for="(item, index) in state.addHashTagList" :key="`hash-chips-${index}`">
                                            <div v-if="item" class="ui-chips-item">
                                                <span>{{ item }}</span>
                                                <button type="button" class="ui-chips-del" @click="removeNewHashTag(item)"><span class="offscreen">삭제하기</span></button>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">분류</th>
                            <td>
                                <div class="reg-group wp-100">
                                    <div class="reg-item">
                                        <select class="custom-select" v-model="state.mjcsOption" @change="changeMjcsCd">
                                            <option v-for="(item, index) in state.mjcsOptionsList" :value="item" :key="`option-${item.classificationCode}-${index}`">
                                                {{ item.classificationCodeName }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="reg-item">
                                        <select class="custom-select" v-model="state.mdcsOption" :disabled="state.isMdcsDisabled" @change="changeMncsCd">
                                            <option v-for="(item, index) in state.mdcsOptionsList" :value="item" :key="`option-${item.classificationCode}-${index}`">
                                                {{ item.classificationCodeName }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="reg-item">
                                        <select class="custom-select" v-model="state.mncsOption" :disabled="state.isMncsDisabled">
                                            <option v-for="(item, index) in state.mncsOptionsList" :value="item" :key="`option-${item.classificationCode}-${index}`">
                                                {{ item.classificationCodeName }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="reg-item">
                                        <button type="button" class="btn btn-sm add" @click="addClassification"><span class="ico-add"></span>추가</button>
                                    </div>
                                </div>
                                <div class="reg-group inline" v-for="(item, index) in state.contentsData.subHealthNewsDetailList" :key="`ctnts-cs-${index}`">
                                    <template v-if="item.majorCodeName || item.majorCode">
                                        <div class="reg-item">
                                            {{ item.majorCodeName ?? item.majorCode }}
                                            {{ item.mediumCodeName||item.mediumCode ? '>' : ''}} {{ item.mediumCodeName ?? item.mediumCode }}
                                            {{ item.minorCodeName||item.minorCode ? '>' : ''}} {{ item.minorCodeName ?? item.minorCode }}
                                        </div>
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm" @click="deleteClassification(item, index)">삭제</button>
                                        </div>
                                    </template>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="btn-bottom-set flex justify-center">
        <button type="button" class="btn btn-sl nega" @click="goCtntsList">목록</button>
        <button type="button" class="btn btn-sl posi" @click="deleteCtnts">삭제</button>
        <button type="button" class="btn btn-sl posi" @click="saveCtnts">저장</button>
    </div>
    </template>
<script>
import { reactive, inject, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { clsfState, _getContent, _setContent, _getClassificationList, _setClassificationMapping, _setClassificationSave } from '@/api/healthnews.js';
    
export default {
    setup() {
        const router = useRouter();
        const store = useStore();
        const modal = inject('$Modal');
    
        const routerState = history.state;
        const pstOptionsList = [
            { code: 'Y', name: '게시' },
            { code: 'N', name: '비게시' }
        ];
    
        const state = reactive({
            isMounted: false,
            contentsData: null,
            hashTagText: '',
            addHashTagList: [],
            isMdcsDisabled: true,
            isMncsDisabled: true,
            mjcsOptionsList: [],
            mdcsOptionsList: [],
            mncsOptionsList: [],
            mjcsOption: null,
            mdcsOption: null,
            mncsOption: null,
            removeClassificationList: [],
            addClassificationList: []
        });
    
        const firstClassificationObject = (() => {
            const object = _.cloneDeep(clsfState.object);
            object.classificationCode = 'all';
            return object;
        })();
    
        const getClassificationFirstObject = (name) => {
            const object = _.cloneDeep(firstClassificationObject);
            object.classificationCodeName = `${name} 전체`;
            return object;
        };
    
        const simpleModal = (message) => {
            if (!state.isMounted) return;
            modal.simple({ title: '안내', message, className: 'warning', buttonText: { ok: '확인' }});
        };
    
        const init = async () => {
            let mjcsOptionsList = [];
            state.addHashTagList = [];
            state.removeClassificationList = [];
            state.addClassificationList = [];
            try {
                state.contentsData = (await _getContent({
                    contentsIdentification: routerState.contentsIdentification
                })).map(item => {
                    if (item.contentsContents) item.contentsContents = JSON.parse(item.contentsContents);
                    if (!item.contentsContents?.review?.contents) {
                        item.contentsContents['review'] = {'contents': '', 'info': {'name': '', 'team': '', 'img': ''}};
                    }
                    if (item.hashTagName) {
                        item.hashTagList = item.hashTagName.split(',').filter(item => item);
                    }
                    return item;
                })[0];
    
                mjcsOptionsList = await _getClassificationList({
                    classificationSectionCode: clsfState.codeGroup.mjcs.code,
                    classificationCode: ''
                });
            } catch (e) {
                simpleModal(e.message);
            }
    
            state.mjcsOptionsList = [getClassificationFirstObject(clsfState.codeGroup.mjcs.name), ...mjcsOptionsList];
            state.mdcsOptionsList = [getClassificationFirstObject(clsfState.codeGroup.mdcs.name)];
            state.mncsOptionsList = [getClassificationFirstObject(clsfState.codeGroup.mncs.name)];
            state.mjcsOption = state.mjcsOptionsList[0];
            state.mdcsOption = state.mdcsOptionsList[0];
            state.mncsOption = state.mncsOptionsList[0];
        };
            
        const addComma = (num) => num ? num.toLocaleString() : '';
    
        const removeHashTag = (index) => {
            state.contentsData.hashTagList.splice(index, 1);
        };
    
        const removeNewHashTag = (text) => {
            state.hashTagText = state.hashTagText.replaceAll(`${text}`, '').replaceAll(',,', ',');
            if (state.hashTagText[0] === ',') state.hashTagText = state.hashTagText.substring(1);
            if (state.hashTagText[state.hashTagText.length - 1] === ',') state.hashTagText = state.hashTagText.substring(state.hashTagText.length - 1, 0);
            state.addHashTagList = state.hashTagText ? state.hashTagText.split(',') : [];
        };
    
        const addHashTagAtComma = (e) => {
            if (e.keyCode !== 188 && e.keyCode !== 13) return;
            const hashTagLength = ([...state.contentsData.hashTagList ?? [], ...state.hashTagText.split(',')]).join(',').length;
            if (hashTagLength > 500) {
                simpleModal('해시태그는 500자까지 입력 가능합니다.');
                return;
            }
    
            if (e.keyCode === 13) {
                const lastText = state.hashTagText.slice(-1);
                if (lastText !== ',') state.hashTagText = state.hashTagText + ',';
            }
            let addHashTagListRemoveDuplicate  = Array.from(new Set(state.hashTagText.split(',')));
            if (state?.contentsData?.hashTagList?.length) {
                addHashTagListRemoveDuplicate = addHashTagListRemoveDuplicate.filter(item => {
                    return state.contentsData.hashTagList.filter(tag => tag === item.trim()).length < 1;
                });
            }
            state.hashTagText = addHashTagListRemoveDuplicate.join(',');
            state.addHashTagList = state.hashTagText ? state.hashTagText.split(',') : [];
        };
    
        const changeMjcsCd = async () => {
            if (state.mjcsOption === state.mjcsOptionsList[0]) {
                state.isMdcsDisabled = true;
                state.isMncsDisabled = true;
                state.mjcsOption = state.mjcsOptionsList[0];
                state.mdcsOption = state.mdcsOptionsList[0];
                state.mncsOption = state.mncsOptionsList[0];
                return;
            }
                
            let mdcsListByMjcs = [];
            try {
                mdcsListByMjcs = await _getClassificationList({
                    classificationSectionCode: clsfState.codeGroup.mdcs.code,
                    upperRankClassificationCode: state.mjcsOption.classificationCode
                });
            } catch (e) {
                simpleModal(e.message);
            }
    
            state.mdcsOptionsList = [
                getClassificationFirstObject(clsfState.codeGroup.mdcs.name),
                ...mdcsListByMjcs
            ];
    
            state.mdcsOption = state.mdcsOptionsList[0];
            state.mncsOption = state.mncsOptionsList[0];
            state.isMncsDisabled = true;
            state.isMdcsDisabled = false;
        };
    
        const changeMncsCd = async () => {
            if (state.mdcsOption === state.mdcsOptionsList[0]) {
                state.isMncsDisabled = true;
                state.mncsOption = state.mncsOptionsList[0];
                return;
            }
                
            let mncsListByMdcs = [];
            try {
                mncsListByMdcs = await _getClassificationList({
                    classificationSectionCode: clsfState.codeGroup.mncs.code,
                    upperRankClassificationCode: state.mdcsOption.classificationCode
                });
            } catch (e) {
                simpleModal(e.message);
            }
                
            state.mncsOptionsList = [
                getClassificationFirstObject(clsfState.codeGroup.mncs.name),
                ...mncsListByMdcs
            ];
                
            state.isMncsDisabled = false;
            state.mncsOption = state.mncsOptionsList[0];
        };
    
        const addClassification = () => {
            if (state.mjcsOption === state.mjcsOptionsList[0] && state.mjcsOptionsList.length > 1) {
                simpleModal('대분류를 선택해주세요.');
                return;
            }
            if (state.mdcsOption === state.mdcsOptionsList[0] && state.mdcsOptionsList.length > 1) {
                simpleModal('중분류를 선택해주세요.');
                return;
            }
            if (state.mncsOption === state.mncsOptionsList[0] && state.mncsOptionsList.length > 1) {
                simpleModal('소분류를 선택해주세요.');
                return;
            }
                
            const newClassification = {
                majorCode: state.mjcsOption.classificationCode === 'all' ? null : state.mjcsOption.classificationCode,
                mediumCode: state.mdcsOption.classificationCode === 'all' ? null : state.mdcsOption.classificationCode,
                minorCode: state.mncsOption.classificationCode === 'all' ? null : state.mncsOption.classificationCode,
                majorCodeName: state.mjcsOption.classificationCode === 'all' ? null : state.mjcsOption.classificationCodeName,
                mediumCodeName: state.mdcsOption.classificationCode === 'all' ? null : state.mdcsOption.classificationCodeName,
                minorCodeName: state.mncsOption.classificationCode === 'all' ? null : state.mncsOption.classificationCodeName
            };
    
            const duplicateClassification = state.contentsData.subHealthNewsDetailList.filter(item => _.isEqual(item, newClassification));
            if (duplicateClassification.length > 0) {
                simpleModal('중복된 분류입니다.');
                return;
            }
    
            state.contentsData.subHealthNewsDetailList.push(newClassification);
            state.addClassificationList.push(newClassification);
        };
    
        const deleteClassification = (item, index) => {
            let addClassItemIndex = 0;
            const isAddItem = state.addClassificationList.filter((addItem, index) => {
                if (addItem === item) addClassItemIndex = index;
                return addItem === item;
            }).length;
            if (isAddItem) {
                state.addClassificationList.splice(addClassItemIndex, 1);
            } else {
                state.removeClassificationList.push(item);
            }
            state.contentsData.subHealthNewsDetailList.splice(index, 1);
        };
    
        const goCtntsList = () => {
            router.push({ path: '/service/health_news/contents/list' });
        };
    
        const deleteCtnts = () => {
            if (state.contentsData.subHealthNewsDetailList.length === 0 || state.contentsData?.subHealthNewsDetailList[0]?.majorCode) {
                simpleModal('"맵핑관리 > 분류" 를 모두 삭제 및 저장 후, 콘텐츠 삭제가 가능합니다.');
                return;
            }
                
            modal.confirm({
                message: '삭제 하시겠습니까?',
                buttonText: { confirm: '삭제', cancel: '취소' }
            }).then(async (success) => {
                try {
                    const result = await _setContent([{
                        contentsIdentification: state.contentsData.contentsIdentification,
                        useAlternative: 'N'
                    }]);
                    if (result?.data?.code === 'FAIL') {
                        simpleModal(result.data.message);
                        return;
                    }
                    goCtntsList();
                } catch (e) {
                    simpleModal(e.message);
                }
            });
        };
    
        const saveCtnts = () => {
            modal.confirm({
                message: '저장 하시겠습니까?',
                buttonText: { confirm: '저장', cancel: '취소' }
            }).then(async (success) => {
                const hashTagList = [
                    ...state.contentsData.hashTagList ?? [],
                    ...state.addHashTagList.filter(item => item) ?? []
                ];
    
                state.contentsData.contentsContents.hashTag = hashTagList;
                try {
                    const result = await _setContent([{
                        contentsIdentification: state.contentsData.contentsIdentification,
                        postUpAlternative: state.contentsData.postUpAlternative,
                        hashTagName: hashTagList.join(','),
                        contentsContents: JSON.stringify(state.contentsData.contentsContents)
                    }]);
                    if (result?.data?.code === 'FAIL') {
                        simpleModal(result.data.message);
                        return;
                    }
                } catch (e) {
                    simpleModal(e.message);
                }
    
                const contentsIdentification = state.contentsData.contentsIdentification;
    
                if (state.removeClassificationList.length > 0) {
                    for await (const item of state.removeClassificationList) {
                        item.contentsIdentification = contentsIdentification;
                        item.deleteAlternative = 'Y';
                        try {
                            const result = await _setClassificationMapping(item);
                            if (result?.data?.code === 'FAIL') {
                                simpleModal(result.data.message);
                                return;
                            }
                        } catch (e) {
                            simpleModal(e.message);
                        }
                    }
                }
    
                if (state.addClassificationList.length > 0) {
                    for await (const item of state.addClassificationList) {
                        item.contentsIdentification = contentsIdentification;
                        item.deleteAlternative = 'N';
                        try {
                            const result = await _setClassificationSave(item);
                            if (result?.data?.code === 'FAIL') {
                                simpleModal(result.data.message);
                                return;
                            }
                        } catch (e) {
                            simpleModal(e.message);
                        }
                    }
                }
    
                init();
            });
        };
    
        onMounted(() => {
            state.isMounted = true;
            init();
        });
            
        onUnmounted(() => {
            state.isMounted = false;
            if (history.state.current !== '/service/health_news/contents/list') {
                store.commit('healthnews/setCtntsMngState', null);
            }
        });
            
        return {
            routerState,
            state,
            pstOptionsList,
            addComma,
            addHashTagAtComma,
            removeHashTag,
            removeNewHashTag,
            changeMjcsCd,
            changeMncsCd,
            addClassification,
            deleteClassification,
            goCtntsList,
            deleteCtnts,
            saveCtnts
        };
    }
};
</script>
    <style scoped>
    td > .contents-label-img {
        object-fit: scale-down;
        height: 100px;
    }
    
    td > .contents-review-img {
        height: 100px;
        object-fit: scale-down;
    }
    
    .ui-content > .contents-thumb-img {
        height: 169px;
        object-fit: scale-down;
    }
    
    .ui-content > .detail-contents {
        height:300px;
        background-color:#fff;
        overflow-y:scroll;
        border-top: 1px solid #d2d2d2;
        border-bottom: 1px solid #d2d2d2;
    }
    
    .form-item > .review-contents {
        padding: 0;
        height: 100px;
        border:none;
        resize:none;
        font-size: 12px !important;
        font: normal 14px/1.44 'KBFGText', 'Apple SD Gothic Neo', 'AppleSDGothicNeo', sans-serif;
    }
    .form-item > .review-contents:read-only {
        background-color: #fff;
        color: var(--base-txt-color)
    }
    </style>