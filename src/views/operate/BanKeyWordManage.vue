<template>
    <section>
        <div class="ui-word-filter">
            <div class="ui-word-filter-item">
                <dl class="ui-word-key">
                    <dt>한글</dt>
                    <dd v-for="item in state.korTypeList" :key="item.value">
                        <a :class="formData.searchType === item.value ? 'active':'' " class="btn-key" @click="onSelectType(item.value)">{{ item.label }}</a>
                    </dd>
                </dl>
            </div>
            <div class="ui-word-filter-item">
                <dl class="ui-word-key">
                    <dt>영어</dt>
                    <dd v-for="item in state.engTypeList" :key="item.value">
                        <a :class="formData.searchType === item.value ? 'active':'' " class="btn-key" @click="onSelectType(item.value)">{{ item.label }}</a>
                    </dd>
                </dl>
            </div>
            <div class="ui-word-filter-item">
                <dl class="ui-word-key">
                    <dt>단어검색</dt>
                    <dd>
                        <input v-model="formData.searchText" class="form-control" type="text">
                        <button class="btn btn-slm" type="button" @click="onSearchText">검색</button>
                    </dd>
                </dl>
            </div>
        </div>
        <div class="tbl-wrap mt-20">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button :disabled="state.deleteList.length === 0" class="btn btn-ss" type="button" @click="checkDel">삭제</button>
                    <button class="btn btn-ss" type="button" @click="checkRegist">금지어추가</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ state.totalCnt }}</strong>건</span>
                    <select v-model="formData.orderBy" class="custom-select sm" @change="onOrderBy">
                        <option v-for="item in state.orderByTypeList" :key="item.value" :value="item.value">{{ item.label }}</option>
                    </select>
                </div>
            </div>
            <div v-if="state.banKeyWordList.length===0" class="ui-no-date">
                <p>조회된 데이터가 없습니다.</p>
            </div>
            <div v-else class="ui-word-list">
                <ul>
                    <li v-for="item in state.banKeyWordList" :key="item.prohibitedWordSn">
                        <span class="checkbox">
                            <input :id="'wordChk'+item.prohibitedWordSn" v-model="state.deleteList" :value="item.prohibitedWordSn" name="wordChk"
                                   type="checkbox">
                            <label :for="'wordChk'+item.prohibitedWordSn">{{ item.prohibitedWordName }}</label>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </section>
    <DefaultModal :isShow="isRegKeyWord" buttonCancel="취소" buttonConfirm="저장" modalName="regKeyWord"
                  modalTitle="금지어 등록" @modalclose="modalClose">
        <template #modalcontent>
            <div class="ui-grid-top-guide mt-16">
                <p>줄바꿈으로 구분하여 복수 등록합니다.(최대100개)</p>
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 120px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                    <tr>
                        <th scope="row">금지어</th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item auto-height">
                                        <textarea v-model="state.regKeyWord" :rows="state.regKeyWordArray.length" class="form-control"
                                                  placeholder="금지어를 입력하세요."></textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </DefaultModal>
</template>
<script>
import { computed, reactive, inject, ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { _deleteProhibitedWord, _getProhibitedWord, _registProhibitedWord } from '@/api/operate.js';

export default {
    components: {DefaultModal},
    setup() {
        const store = useStore();
        const $Modal = inject('$Modal');
        const isRegKeyWord = ref(false);

        /**
         * 권한은 스토어에서 가져옴 (권한여부는 메뉴리스트에서 가져온다)
         * store.state.getMenuItem.menuInfo
         * "auth1RegistYn": "Y/N",  등록
         * "auth2UpdateYn": "Y/N",  수정
         * "auth3DeleteYn": "Y/N",  삭제
         * "auth4ApproveYn": "Y/N", 승인
         * "auth5DownloadYn": "Y/N", 다운
         * "auth6MaskingYn": "Y/N" 마스킹
         */
        const { onChangeRegistRol, onChangeDelRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);


        const state = reactive({
            banKeyWordList: [],
            deleteList: [],
            totalCnt: 0,
            // 한글 구분
            korTypeList: [
                {label: '전체', value: 'kor'},
                {label: 'ㄱ', value: 'ㄱ'},
                {label: 'ㄴ', value: 'ㄴ'},
                {label: 'ㄷ', value: 'ㄷ'},
                {label: 'ㄹ', value: 'ㄹ'},
                {label: 'ㅁ', value: 'ㅁ'},
                {label: 'ㅅ', value: 'ㅅ'},
                {label: 'ㅇ', value: 'ㅇ'},
                {label: 'ㅈ', value: 'ㅈ'},
                {label: 'ㅊ', value: 'ㅊ'},
                {label: 'ㅋ', value: 'ㅋ'},
                {label: 'ㅌ', value: 'ㅌ'},
                {label: 'ㅍ', value: 'ㅍ'},
                {label: 'ㅎ', value: 'ㅎ'}
            ],
            // 영어 구분
            engTypeList: [
                {label: '전체', value: 'eng'},
                {label: 'A', value: 'A'},
                {label: 'B', value: 'B'},
                {label: 'C', value: 'C'},
                {label: 'D', value: 'D'},
                {label: 'E', value: 'E'},
                {label: 'F', value: 'F'},
                {label: 'G', value: 'G'},
                {label: 'H', value: 'H'},
                {label: 'I', value: 'I'},
                {label: 'J', value: 'J'},
                {label: 'K', value: 'K'},
                {label: 'L', value: 'L'},
                {label: 'M', value: 'M'},
                {label: 'N', value: 'N'},
                {label: 'O', value: 'O'},
                {label: 'P', value: 'P'},
                {label: 'Q', value: 'Q'},
                {label: 'R', value: 'R'},
                {label: 'S', value: 'S'},
                {label: 'T', value: 'T'},
                {label: 'U', value: 'U'},
                {label: 'V', value: 'V'},
                {label: 'W', value: 'W'},
                {label: 'X', value: 'X'},
                {label: 'Y', value: 'Y'},
                {label: 'Z', value: 'Z'}
            ],
            // 정렬구분
            orderByTypeList: [
                {label: '내림차순', value: 'desc'},
                {label: '오름차순', value: 'asc'},
                {label: '최근 등록순', value: 'latest'}
            ],
            regKeyWordArray: computed(() => state.regKeyWord ? [state.regKeyWord.split('\n')] : ['']),
            regKeyWord: null, // 등록단어
            menuCode: '1016005'
        });

        // 검색 조건
        const formData = reactive({
            searchType: 'kor', // 검색조건 한글전체 기본값
            searchText: '', // 검색내용
            orderBy: 'desc', // 정렬
            menuCode: state.menuCode
        });

        onMounted(() => {
            getBanKeyWordList();
            emitter.$on('onChangeRegist', onChangeRegist);
            emitter.$on('onChangeDel', onChangeDel);
        });

        /**
         * 마스킹 해제 이벤트 버스 해제
         */
        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            emitter.$off('onChangeDel');
        });

        /**
         * 등록 권한 체크
         */
        const checkRegist = async () => {
            await onChangeRegistRol(menuInfo.value.auth1RegistYn);
        };

        /**
         * 등록 권한 체크 callback
         */
        const onChangeRegist = () => {
            regKeyWordPopup();
        };

        /**
         * 삭제 권한 체크
         */
        const checkDel = async () => {
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            deleteKeyWord();
        };

        //리스트 조회
        const getBanKeyWordList = async () => {
            try {
                clearList();
                const response = await _getProhibitedWord(formData);

                state.banKeyWordList = response.data.data.list;

                state.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        // 초성검색
        const onSelectType = (item) => {
            formData.searchType = item;
            // 조회
            getBanKeyWordList();
        };

        // 단어검색
        const onSearchText = () => {
            if (!!formData.searchText) {
                // 조회
                getBanKeyWordList();
            } else {
                $Modal.alert('검색어를 입력해주세요');
            }
        };

        // 정렬 변경
        const onOrderBy = () => {
            getBanKeyWordList();
        };

        // 단어등록
        const regKeyWord = async (checkedYn) => {
            if (state.regKeyWord.length > 0) {
                await _registProhibitedWord({prohibitedWordName: state.regKeyWord, checkedYn: checkedYn ?? 'N', menuCode: state.menuCode}).then(result => {
                    // 중복관련 처리
                    if (result.data) {
                        dupRegKeyWord(result.data);
                    }
                });
            }
        };

        const dupRegKeyWord = (item) => {
            // 전체 중복 여부
            if (item.detail.length === state.regKeyWord.split('\n').length) {
                $Modal.alert({message: '이미 동일한 금지어가 등록되어있습니다.', buttonText: {ok: '확인'}});
                return true;
            } else {
                $Modal.confirm({
                    title: '',
                    message: '이미 등록되어 있는 금지어(' + item.detail.toString() + ')를 제외하고 저장하시겠습니까?',
                    buttonText: {
                        confirm: '예',
                        cancel: '아니요'
                    }
                }).then(success => {
                    regKeyWord('Y');
                }).catch(error => {
                    console.log(error);
                });
            }
        };

        // 단어삭제
        const deleteKeyWord = () => {
            if (state.deleteList.length > 0) {
                $Modal.confirm({
                    title: '',
                    message: '선택하신 등록 건을 삭제하시겠습니까?',
                    buttonText: {
                        confirm: '예',
                        cancel: '아니요'
                    }
                }).then(async (success) => {
                    await _deleteProhibitedWord({prohibitedWordSnList: state.deleteList});
                    await getBanKeyWordList();
                }).catch(async error => {
                    console.log(error);
                });
            }
        };

        const modalClose = (type) => {
            // 저장
            if (type === 'modalconfirm') {
                regKeyWord();
            }
            isRegKeyWord.value = false;
        };

        const regKeyWordPopup = () => {
            state.regKeyWord = null;
            isRegKeyWord.value = true;
        };

        const clearList = () => {
            state.regKeyWord = null;
            state.deleteList = [];
        };


        return {
            state,
            formData,
            isRegKeyWord,
            onSelectType,
            onSearchText,
            onOrderBy,
            // deleteKeyWord,
            modalClose,

            checkRegist,
            checkDel
        };
    }
};

</script>