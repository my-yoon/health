<template>
    <div class="ui-section">
        <div class="ui-title-3">
            <p>※ 소분류 삭제시 소분류로 등록되어 있는 콘텐츠를 먼저 해재해야 합니다.</p>
            <div class="abs">
                <button type="button" class="btn btn-sm" @click="ctgrModalOpen">카테고리 검색</button>
            </div>
        </div>
        <div class="ui-content">
            <div class="ui-category-wrap">
                <div class="ui-category-item">
                    <div class="ui-category-select">
                        <label for="cate1">대분류명</label>
                        <select id="cate1" class="custom-select" v-model="state.selectedMjcsCd" @change="getMdcsList">
                            <template v-if="state?.mjcsList?.length">
                                <option v-for="(item, index) in state.mjcsList" :value="item.classificationCode" :key="`mjcs-option-${item.classificationCode}-${index}`">
                                    {{ item.classificationCodeName }}
                                </option>
                            </template>
                            <template v-else>
                                <option value="null" selected>없음</option>
                            </template>
                        </select>
                    </div>
                    <div class="ui-category-select">
                        <label for="cateM1">중분류명</label>
                        <select id="cateM1" class="custom-select" v-model="state.selectedMdcsCd" @change="getMncsList">
                            <template v-if="state?.mdcsList?.length">
                                <option v-for="(item, index) in state.mdcsList" :value="item.classificationCode" :key="`mjcs-option-${item.classificationCode}-${index}`">
                                    {{ item.classificationCodeName }}
                                </option>
                            </template>
                            <template v-else>
                                <option value="null" selected>없음</option>
                            </template>
                        </select>
                    </div>
                </div>
            </div>
        
            <div class="ui-category-wrap-sub">
                <div class="ui-category-wrap">
                    <div v-for="(item, index) in state.classificationList" class="ui-category-item" :key="`mjcs-item-${item.classificationCode}-${index}`">
                        <div class="ui-category-input">
                            <label :for="`list-cate${index}`">소분류명</label>
                            <input :id="`list-cate${index}`" type="text" class="form-control" autocomplete="off" v-model="item.classificationCodeName"
                                @keyup="(e) => enterToAdd(e, item.classificationCodeName, index)">
                        </div>
                        <div class="ui-category-pos">
                            <button v-if="index > 0 && index < state.classificationList.length-1" type="button" class="up" @click="(e) => oneLineUpDown(e, index)">
                                <span class="offscreen">위로이동</span>
                            </button>
                            <button v-if="index < state.classificationList.length-2" type="button" class="down"  @click="(e) => oneLineUpDown(e, index)">
                                <span class="offscreen">아래로이동</span>
                            </button>
                        </div>
                        <button type="button" class="del-cate" @click="removeClassification(item, index)"><span class="offscreen">삭제하기</span></button>
                        <button v-if="index === state.classificationList.length-1" type="button" class="btn btn-sm add"
                            @click="addClassification(item.classificationCodeName, index)">
                            <span class="ico-add"></span>추가
                        </button>
                    </div>
                </div>
            </div>
            <div class="btn-bottom-set flex justify-center">
                <button type="button" class="btn btn-sl posi" @click="saveClassification" :disabled="state.classificationList.length < 2">저장</button>
            </div>
        </div>
    </div>
    <HnCtgrSearchPop v-if="isShow" @modalCtgrClose="ctgrModalClose" />
</template>
<script>
import { reactive, onMounted, onUnmounted, inject, nextTick, ref  } from 'vue';
import { clsfState, _getClassificationList, _getClassificationListWithSub, _setClassificationList, _getCanDeleteYn } from '@/api/healthnews.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import HnCtgrSearchPop from './components/HnCtgrSearchPop.vue';

export default {
    components: {
        DefaultModal,
        HnCtgrSearchPop
    },
    setup() {
        const modal = inject('$Modal');

        const isShow = ref(false);

        const state = reactive({
            isMounted: false,
            mjcsList: [],
            mdcsList: [],
            selectedMjcsCd: '',
            selectedMdcsCd: '',
            classificationListOrigin: [],
            classificationList: []
        });

        const getMjcsList = async () => {
            try {
                state.mjcsList = await _getClassificationList({
                    classificationSectionCode: clsfState.codeGroup.mjcs.code,
                    classificationCode: ''
                });
            } catch (e) {
                simpleModal(e.message);
            }

            if (!state?.mjcsList?.length) {
                state.selectedMjcsCd = null;
                state.selectedMdcsCd = null;
                state.classificationList = [];
                state.classificationListOrigin = [];
                return;
            }
            state.selectedMjcsCd = state.mjcsList[0].classificationCode;
            getMdcsList();
        };

        const getMdcsList = async () => {
            try {
                state.mdcsList = await _getClassificationList({
                    classificationSectionCode: clsfState.codeGroup.mdcs.code,
                    upperRankClassificationCode: state.selectedMjcsCd
                });
            } catch (e) {
                simpleModal(e.message);
            }

            if (!state?.mdcsList?.length) {
                state.selectedMdcsCd = null;
                state.classificationList = [];
                state.classificationListOrigin = [];
                return;
            }
            state.selectedMdcsCd = state.mdcsList[0].classificationCode;
            getMncsList();
        };

        const getMncsList = async () => {
            try {
                state.classificationList = (await _getClassificationListWithSub({
                    classificationSectionCode: clsfState.codeGroup.mncs.code,
                    upperRankClassificationCode: state.selectedMdcsCd
                })).map((item, index) => {
                    item.classificationIndicationSerialNumber = index + 1;
                    return item;
                });
            } catch (e) {
                simpleModal(e.message);
            } finally {
                state.classificationList = state.classificationList ?? [];
                state.classificationListOrigin = _.cloneDeep(state.classificationList);
                state.classificationList.push(_.cloneDeep(clsfState.object));
            }
        };
                
        const validateName = (name, index) => {
            const noWhiteSpaceName = name.length > 0 ? name.replaceAll(' ', '') : name;

            if (!noWhiteSpaceName) {
                state.classificationList[index].classificationCodeName = '';
                simpleModal('소분류명을 입력하세요!');
                focusingNameInput(index);
                return false;
            }

            const dataForDuplicateNameCheck = _.cloneDeep(state.classificationList);
            dataForDuplicateNameCheck.splice(index, 1);
            const isDuplicatedName = dataForDuplicateNameCheck.filter(item => {
                return item.classificationCodeName.replaceAll(' ', '') === noWhiteSpaceName;
            }).length > 0;

            if (isDuplicatedName && noWhiteSpaceName) {
                state.classificationList[index].classificationCodeName = '';
                simpleModal('중복된 소분류명 입니다.');
                focusingNameInput(index);
                return false;
            }
            state.classificationList[index].classificationCodeName = noWhiteSpaceName;
            state.classificationList[index].classificationSectionCode = clsfState.codeGroup.mncs.code;
            state.classificationList[index].upperRankClassificationCode = state.selectedMdcsCd;

            return true;
        };

        const simpleModal = (message) => {
            if (!state.isMounted) return;
            modal.simple({ title: '안내', message, className: 'warning', buttonText: { ok: '확인' }});
        };

        const enterToAdd = (e, name, index) => {
            if (e.keyCode === 13 && index === state.classificationList.length - 1) addClassification(name, index);
            else if (e.keyCode === 40) focusingNameInput(index + 1);
            else if (e.keyCode === 38) focusingNameInput(index - 1);
        };

        const focusingNameInput = (index) => {
            document.getElementById(`list-cate${index}`).focus();
        };

        const addClassification = async (name, index) => {
            if (!validateName(name, index))  return;
            state.classificationList.push(_.cloneDeep(clsfState.object));
            await nextTick();
            focusingNameInput(index + 1);
        };

        const oneLineUpDown = (e, index) => {
            const to = e.target.classList.contains('up') ? index - 1 : index + 1;
            state.classificationList.splice(to, 0, state.classificationList.splice(index, 1)[0]);
        };

        const validate = () => {
            let isValid = true;
            const  requestParameter = _.cloneDeep(state.classificationList).map((item, index) => {
                item.classificationIndicationSerialNumber = index + 1;
                return item;
            });
            requestParameter.pop();

            const openModal = (message) => {
                simpleModal(message);
                isValid = false;
            };

            if (JSON.stringify(state.classificationListOrigin) === JSON.stringify(requestParameter)) {
                openModal('수정된 정보가 없습니다.');
            }

            if (requestParameter.filter(item => !item.classificationCodeName).length > 0) {
                openModal('소분류명을 입력하세요!');
            }

            const invalidMaxLength = requestParameter.filter((item, index) => {
                if (item.classificationCodeName.length > 500) {
                    state.classificationList[index].classificationCodeName = '';
                    return item;
                }
            }).length > 0;

            if (invalidMaxLength) {
                openModal('소분류명은 최대 500자까지 가능합니다.');
            }

            return isValid ? requestParameter : false;
        };

        const removeClassification = (item, index) => {
            const messagePrefix = item.classificationCodeName ? `[${item.classificationCodeName}]를 ` : '';
            modal.confirm({
                message: `${messagePrefix}삭제 하시겠습니까?`,
                buttonText: { confirm: '확인', cancel: '취소' }
            }).then(async () => {
                if (item.classificationCode) {
                    try {
                        const existCount = await _getCanDeleteYn({ classificationCode: item.classificationCode});
                        if (existCount > 0) {
                            simpleModal(`${existCount}개의 콘텐츠에서 사용중이므로 삭제 할 수 없습니다.`);
                            return;
                        }
                        item.deleteAlternative = 'Y';
                        const result = await _setClassificationList([item]);
                        if (result?.data?.code === 'FAIL') {
                            simpleModal(result.data.message);
                            return;
                        }
                    } catch (e) {
                        simpleModal(e.message);
                    }
                }
                state.classificationList.splice(index, 1);
            }).catch(() => {});
        };

        const saveClassification = async () => {
            const requestParameter = validate();
            if (!requestParameter) return;

            try {
                const result = await _setClassificationList(requestParameter);
                simpleModal(result.data.message);
                if (result?.data?.code === 'FAIL') return;
                getMncsList();
            } catch (e) {
                simpleModal(e.message);
            }
        };

        onMounted(() => {
            state.isMounted = true;
            getMjcsList();
        });

        onUnmounted(() => {
            state.isMounted = false;
        });
        
        const ctgrModalOpen = (type) => {
            isShow.value = true;
        };

        const ctgrModalClose = (type) => {
            isShow.value = false;
        };
        
        return {
            state,
            getMdcsList,
            getMncsList,
            validateName,
            enterToAdd,
            removeClassification,
            addClassification,
            oneLineUpDown,
            saveClassification,
            isShow,
            ctgrModalOpen,
            ctgrModalClose
        };
    }
};
</script>