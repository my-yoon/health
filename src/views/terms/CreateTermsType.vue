<template>
    <section class="temp-section">
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
                        <th scope="row">약관그룹<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group inline">
                                <div class="reg-item">
                                    <select v-model="formData.termsGroupSn" class="custom-select sm"
                                        :disabled="state.pageType === 'detail'">
                                        <option value="">선택</option>
                                        <option v-for="(item, index) in state.termsGroup" :key="index"
                                            :value="item.clusGrpSn">
                                            {{ item.clusGrpNm }}
                                        </option>
                                    </select>
                                    <span v-if="checkValidState('termsGroupSn')" class="input-guide"
                                        :class="{ 'error': checkValidState('termsGroupSn') }">
                                        {{ state.validState.message }}
                                    </span>
                                </div>
                            </div>
                        </td>
                        <th scope="row">약관유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group inline">
                                <div class="reg-item">
                                    <select v-model="formData.termsTypeCd" class="custom-select sm"
                                        :disabled="state.pageType === 'detail'">
                                        <option value="">선택</option>
                                        <option v-for="(item, index) in state.termsTypeCd" :key="index" :value="item.value">
                                            {{ item.cmnCdNm }}
                                        </option>
                                    </select>
                                    <span v-if="checkValidState('termsTypeCd')" class="input-guide"
                                        :class="{ 'error': checkValidState('termsTypeCd') }">
                                        {{ state.validState.message }}
                                    </span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">관리형태<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <commradio :selectType="'termsCode.tlusShpCd'" :initData="formData.tlusShpCd"
                                        :disabled="state.pageType === 'detail'" @changedValue="selectedOptions"
                                        ref="commRadio" />
                                </div>
                            </div>
                        </td>
                        <th scope="row">약관명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <input type="text" class="form-control" v-model="formData.termsName"
                                        :disabled="state.pageType === 'detail'" />
                                </div>
                            </div>
                            <p v-if="checkValidState('termsName')" class="input-guide"
                                :class="{ 'error': checkValidState('termsName') }">
                                {{ state.validState.message }}
                            </p>
                        </td>
                    </tr>
                    <tr v-if="formData.tlusShpCd === '248001'">
                        <td colspan="4">
                            <div class="editor_container">
                                <ck-editor :model-value="formData.termsContents" :editor="state.ckeditor" />
                            </div>
                            <p v-if="checkValidState('termsContents')" class="input-guide"
                                :class="{ 'error': checkValidState('termsContents') }">
                                {{ state.validState.message }}
                            </p>
                        </td>
                    </tr>
                    <tr v-if="formData.tlusShpCd === '248002'">
                        <td colspan="4">
                            <div class="ui-terms-type">
                                <div class="ui-var-list">
                                    <div class="ui-var-item" v-for="(item, index) in state.termsVariable" :key="index">
                                        <div class="var-name">
                                            <input type="text" v-model="item.vrbNm" class="form-control" placeholder="변수명"
                                                @input="changeVariable(item, index)" />
                                        </div>
                                        <div class="var-guide">
                                            <input type="text" v-model="item.vrbDscr" class="form-control"
                                                placeholder="변수명 설명" @input="changeVariable(item, index)" />
                                        </div>
                                    </div>
                                </div>
                                <div class="ui-editor">
                                    <div class="editor_container">
                                        <ck-editor :model-value="formData.termsContents" :editor="state.ckeditor" />
                                    </div>
                                    <p v-if="checkValidState('termsContents')" class="input-guide"
                                        :class="{ 'error': checkValidState('termsContents') }">
                                        {{ state.validState.message }}
                                    </p>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <!-- 등록 pageType: regist -->
            <template v-if="state.pageType === 'regist'">
                <button type="button" class="btn btn-sl nega" @click="cancelCreate">취소</button>
                <button type="button" class="btn btn-sl posi" @click="createTerms">등록</button>
            </template>
            <!-- 상세 pageType: detail -->
            <template v-else>
                <button type="button" class="btn btn-sl nega" @click="goToPage('/policy/type/list')">목록</button>
                <button type="button" class="btn btn-sl posi" @click="checkEdit">수정</button>
            </template>
        </div>
    </section>
</template>
<script>
import { useRoute } from 'vue-router';
import { reactive, onMounted, onUnmounted, watch, inject, ref, computed } from 'vue';
import { _getTermsGroup, _getTermsType, _createTermsType, _updateTermsType, _getTermsTypeDetail } from '@/api/terms';
import { useCommFunc, initializeEditor } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { commoCode } from '@/data/commcode';
import { useStore } from 'vuex';

import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { nextTick } from 'vue';

export default {
    components: {
        'ck-editor': CKEditor.component
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const $Modal = inject('$Modal');
        const { goToPage } = useCommFunc();
        const commRadio = ref(null);

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
        const { onChangeEditRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const state = reactive({
            ckeditor: ClassicEditor,
            // editorconfig: EditorOptions.editorConfig,
            pagesize: 10,
            termsType: [], // 약관유형목록
            termsGroup: [], // 약관그룹목록
            termsTypeCd: commoCode.termsCode.clusTyCd, // 약관유형
            // tlusShpCd: commoCode.termsCode.tlusShpCd, // 관리형태
            termsVariable: [],

            validState: {
                type: '', // 약관그룹(termsGroup), 약관유형(termsTypeCd), 약관명(termsName)
                errState: false, // error state
                message: '' // input message
            },

            pageType: 'regist' // 등록(regist) | 상세 (detail)
        });

        /**
         * @data
         */
        const formData = reactive({
            termsGroupSn: '', // 약관그룹 (선택)
            termsTypeCd: '', // 약관유형
            tlusShpCd: '248001', // 관리형태 ( default: 편집형 )
            termsName: '', // 약관명
            termsContents: '', // 약관내용 editor
            tacClusTlusVrbMapList: []
        });

        watch(formData, () => {
            resetState();
        });

        onMounted(async () => {
            resetVariable();
            getTermsGroup();
            await getTermsType();

            console.log('route.query', route.query);
            if (!_.isEmpty(route.query)) {
                console.log('query not empty ? detail page');
                state.pageType = 'detail';
                await getTermsTypeDetail();
            }

            await initEditor();

            emitter.$on('onChangeEdit', onChangeEdit);
        });

        onUnmounted(() => {
            emitter.$off('onChangeEdit');
        });

        /**
         * 수정 권한 체크
         */
        const checkEdit = () => {
            onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            editTerms();
        };

        /**
         * @editor init()
         */
        const initEditor = async () => {
            const editor = await initializeEditor();

            editor.setData(formData.termsContents);
            editor.model.document.on('change', () => {
                formData.termsContents = editor.getData();
            });
        };

        /**
         * @set variable
         */
        const resetVariable = () => {
            state.termsVariable = [];
            for (let i = 0; i < 20; i++) {
                const item = {
                    // mapSn: 0,
                    tlusSn: route.query.tlusSn,
                    indnSqn: i + 1,
                    vrbNm: '',
                    vrbDscr: '',
                    delYn: 'N'
                };
                state.termsVariable.push(item);
            }
        };
        /**
         * 변수 수정 시 formData 반영
         */
        const setVariable = () => {
            const items = state.termsVariable.filter(d => !_.isEmpty(d.vrbNm) || (_.isEmpty(d.vrbNm) && d.mapSn != null && d.mapSn !== 0));

            items.forEach((item, index) => {
                if (_.isEmpty(item.vrbNm) && item.mapSn != null && item.mapSn !== 0) {
                    item.delYn = 'Y';
                } else {
                    item.delYn = 'N';
                }
            });
            console.log('setVariable filter', state.termsVariable, items);
            formData.tacClusTlusVrbMapList = items;
        };

        /**
         * @validation 상태 초기화
         */
        const resetState = () => {
            state.validState.type = ''; // validation
            state.validState.errState = false;
            state.validState.message = '';
        };

        /**
         * 약관그룹조회
         */
        const getTermsGroup = async () => {
            try {
                const params = {
                    size: 10000,
                    offset: 0,
                    clusGrpNm: ''
                };
                const response = await _getTermsGroup(params);

                console.log('>> get', response);
                state.termsGroup = response.data.data.list;
                // pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 약관유형조회
         */
        const getTermsType = async () => {
            try {
                console.log(formData.termsGroupSn);
                const params = {
                    clusGrpSn: formData.termsGroupSn, // 약관그룹순번
                    clusTyCd: formData.termsTypeCd, // 약관유형코드
                    size: 10000,
                    offset: 0
                };
                const response = await _getTermsType(params);
                console.log('response', response);
                state.termsType = response.data.data.list;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 약관유형 상세 조회
         */
        const getTermsTypeDetail = async () => {
            try {
                const params = {
                    tlusSn: route.query.tlusSn,
                    clusGrpSn: route.query.clusGrpSn,
                    clusTyCd: route.query.clusTyCd
                };
                console.log('getTermsDetail params', params);
                const response = await _getTermsTypeDetail(params);
                // formData setting
                formData.termsGroupSn = response.data.data.clusGrpSn;
                formData.termsTypeCd = response.data.data.clusTyCd;
                formData.tlusShpCd = response.data.data.tlusShpCd;
                formData.termsName = response.data.data.tlusClusNm;
                formData.termsContents = response.data.data.tlusClusCts;
                formData.tacClusTlusVrbMapList = response.data.data.tacClusTlusVrbMapList;
                formData.tlusSn = response.data.data.tlusSn;

                commRadio.value.state.selectOption = formData.tlusShpCd;

                /**
                 * 상세 진입시 detail 정보 변수 반영
                 */
                state.termsVariable = state.termsVariable.map(d => formData.tacClusTlusVrbMapList.find(v => d.indnSqn === v.indnSqn) || d);
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 셀렉트박스 선택
         * { @code: cmnCd, @name: cmnCdNm, @type }
         */
        const selectedOptions = (code, name, type) => {
            // console.log(code, name, type);
            if (type === 'tlusShpCd') { // 약관유형별템플릿관리형태코드
                formData.tlusShpCd = code;
                console.log('change options');
                nextTick(() => {
                    initEditor();
                });
            }
        };

        /**
         * @change 변수
         */
        const changeVariable = (item, index) => {
            setVariable();
        };

        /**
         * 취소
         */
        const cancelCreate = () => {
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
                    goToPage('/policy/type/list');
                }
            }).catch(error => {
                console.log(error);
            });
        };

        /**
         * 등록
         */
        const createTerms = async () => {
            try {
                console.log('createTerms');
                const params = {
                    // lastUpdrSn: 1,
                    tlusSn: 0,
                    tlusClusNm: formData.termsName,
                    clusGrpSn: formData.termsGroupSn,
                    clusTyCd: formData.termsTypeCd,
                    tlusShpCd: formData.tlusShpCd,
                    tlusClusCts: formData.termsContents,
                    tacClusTlusVrbMapList: formData.tacClusTlusVrbMapList
                };
                console.log(params);
                if (validFormData()) {
                    console.log('등록');
                    const response = await _createTermsType(params);
                    console.log(response);
                    goToPage('/policy/type/list');
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 수정
         */
        const editTerms = async () => {
            console.log('수정');
            try {
                console.log('createTerms');
                const params = {
                    // lastUpdrSn: 1,
                    tlusSn: formData.tlusSn,
                    tlusClusNm: formData.termsName,
                    clusGrpSn: formData.termsGroupSn,
                    clusTyCd: formData.termsTypeCd,
                    tlusShpCd: formData.tlusShpCd,
                    tlusClusCts: formData.termsContents,
                    tacClusTlusVrbMapList: formData.tacClusTlusVrbMapList
                };
                // console.log(params);
                if (validFormData()) {
                    console.log('수정');
                    const response = await _updateTermsType(params);
                    console.log(response);
                    goToPage('/policy/type/list');
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @validate
         */
        const validFormData = () => {
            const target = ['termsGroupSn', 'termsTypeCd', 'termsName', 'termsContents'];
            for (const item of target) {
                state.validState.target = item;
                state.validState.message = (item === 'termsGroupSn') ? '약관그룹을 선택해주세요.' :
                    (item === 'termsTypeCd') ? '약관유형을 선택해주세요.' :
                        (item === 'termsName') ? '약관명을 입력해주세요.' : '약관내용을 입력해주세요.';
                // console.log(item, formData[item], !formData[item]);
                if (!formData[item]) {
                    state.validState.errState = true;
                    break;
                }
            }

            return !state.validState.errState;
        };

        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        return {
            state,
            formData,
            goToPage,
            commRadio,
            selectedOptions,
            changeVariable,
            cancelCreate,
            createTerms,
            // editTerms,
            checkValidState,

            checkEdit
        };
    }
};

</script>