<template>
    <div>
        <div class="ui-section">
            <div class="ui-content">
                <div class="table-util">
                    <button type="button" class="btn btn-sm" @click="actionBtns('copySection')"
                        v-if="state.mainSn">섹션추가</button>
                </div>
                <div class="table-list mt-10">
                    <table class="table list">
                        <colgroup>
                            <col style="width: 150px;">
                            <col style="width: 200px;">
                            <col style="width: 200px;">
                            <col style="width: auto;">
                            <col style="width: 150px;">
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">노출순서</th>
                                <th scope="col">섹션명</th>
                                <th scope="col">섹션노출 상태</th>
                                <th scope="col">타이틀</th>
                                <th scope="col">순서변경</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="ui-dragdrop-menu table" v-if="state.dragShow">
                    <draggable v-model="state.mainViewlist" class=" ui-dragdrop-list" item-key="sctnIndnSqn">
                        <template v-slot:item="{ item, index }">
                            <div class="ui-dragdrop-item">
                                <span class="dv w-150">{{ item.sctnIndnSqn }}</span>
                                <span class="dv w-200 t-left">{{ item.mainScrnSctnNm }} </span>
                                <span class="dv w-200 t-left">
                                    <span class="radio">
                                        <input :id="'rdo1-1' + item.sctnIndnSqn" :name="'rdoGroup1-1-' + item.sctnIndnSqn"
                                            type="radio" value="N" @change="onChangeSection('section', item, 'N')"
                                            v-model="item.sctnIndnYn">
                                        <label :for="'rdo1-1' + item.sctnIndnSqn">비노출</label>
                                    </span>
                                    <span class="radio">
                                        <input :id="'rdo1-2' + item.sctnIndnSqn" :name="'rdoGroup1-1-' + item.sctnIndnSqn"
                                            type="radio" value="Y" @change="onChangeSection('section', item, 'Y')"
                                            v-model="item.sctnIndnYn">
                                        <label :for="'rdo1-2' + item.sctnIndnSqn">노출</label>
                                    </span>
                                </span>
                                <span class="dv flex1 t-left">
                                    <span class="radio">
                                        <input :id="'rdo2-1' + item.sctnIndnSqn" :name="'rdoGroup2-1-' + item.sctnIndnSqn"
                                            type="radio" @change="onChangeSection('title', item, 'N')" value="N"
                                            v-model="item.sctnTtlIndnYn">
                                        <label :for="'rdo2-1' + item.sctnIndnSqn" value="N">비노출</label>
                                    </span>
                                    <span class="radio">
                                        <input :id="'rdo2-2' + item.sctnIndnSqn" :name="'rdoGroup2-1-' + item.sctnIndnSqn"
                                            type="radio" @change="onChangeSection('title', item, 'Y')"
                                            v-model="item.sctnTtlIndnYn" value="Y">
                                        <label :for="'rdo2-2' + item.sctnIndnSqn">노출</label>
                                    </span>
                                    <input type="text" class="form-control w-500" :id="'title-' + item.sctnIndnSqn"
                                        @change="onChangeSection('titletx', item, 'title-' + item.sctnIndnSqn)"
                                        v-if="item.sctnTtlIndnYn === 'Y'" v-model="item.sctnTtl"
                                        :disabled="item.sctnIndnYn === 'N'">
                                </span>
                                <span class="dv w-150">
                                    <span class="drag"></span>
                                </span>
                            </div>
                        </template>
                    </draggable>

                </div>
            </div>
        </div>
        <div class="ui-section">
            <div class="ui-content">
                <div class="ui-grid-top-guide t-right"><span class="ess"></span> 표시는 필수항목입니다. </div>
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 180px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">
                                변경 내용을 등록해주세요.<br>(5~3000자 이내 입력)
                                <span class="ess"><span class="offscreen">필수입력</span></span>
                            </th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item wp-100">
                                        <div class="textarea">
                                            <textarea id="textarea" class="form-control "
                                                :class="{ 'error': state.validState.errState }" style="height: 100px;"
                                                v-model="formData.aprvRqstCts">
                                            </textarea>
                                            <div class="txt-counter"><strong>{{ formData.aprvRqstCts.length }}</strong> /
                                                <span>3000</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="checkValidState('aprvRqstCts')">
                                    <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                        {{ state.validState.message }}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
            <div class="btn-bottom-set flex justify-center">
                <button type="button" class="btn btn-sl nega" @click="goToPage('/display/main/list')">목록</button>
                <button type="button" class="btn btn-sl posi" @click="actionBtns('save')" v-if="!state.mainSn">저장</button>
                <button type="button" class="btn btn-sl posi" @click="actionBtns('edit')" v-if="state.mainSn">수정</button>
                <button type="button" class="btn btn-sl posi" @click="actionBtns('confirm')">승인요청</button>
            </div>
        </div>
        <DefaultModal :buttonCancel="'닫기'" :buttonConfirm="state.confirmBtnMsg" :isShow="isShowModal"
            :modalName="'isShowModal'" :modalTitle="state.modalTitle" @modalclose="modalControl" class="ui-modal">
            <template #modalcontent>
                <MainApprove v-if="state.confirm" @onChangeApproveUser="onChangeApproveUser" :menuCode="state.menuCode" />
                <MainCopy v-if="state.copySection" :orderCount="state.mainViewlist.length"
                    :addSectionList="state.addSectionList" @onChangeAddSection="onChangeAddSection" @limitAdd='limitAdd' />
            </template>
        </DefaultModal>
    </div>
</template>
<script>
import { reactive, inject, ref, onMounted, onUnmounted, computed, nextTick, watch, onBeforeMount } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import MainApprove from './components/MainApprove.vue';
import MainCopy from './components/MainCopy.vue';
import { _saveMainSection, _getMainSection, _getMainDetail, _copyMainSection } from '@/api/exhibit.js';

export default {
    components: { DefaultModal, MainApprove, MainCopy },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const isShowModal = ref(false);
        const { goToPage, openModal } = useCommFunc();
        const store = useStore();
        const route = useRoute();
        const initColum = ref([
            {
                headerName: '선택',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '이름', field: '' },
            { headerName: '아이디', field: '', maxWidth: 120 },
            { headerName: '이메일', field: '', maxWidth: 150 }
        ]);
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const state = reactive({
            menuCode: computed(() => menuInfo.value.menuCode),
            //테이블데이터
            tableColum_c: _.clone(initColum),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            domLayout: 'autoHeight',
            dragShow: false,
            mainViewlist_clone: [],
            mainViewlist: [],

            confirmBtnMsg: '승인',
            modalTitle: '승인요청',
            confirm: false,
            copySection: false,
            mainSn: '',
            mainDeatail: {
                list: []
            },
            pageStatus: '',
            addSectionList: [],
            sectList: [],
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            }
        });
        const { onChangeEditRol, onChangeDelRol } = authCommFunc();
        onMounted(async () => {
            state.pageStatus = '';
            state.dragShow = false;
            if (route.query.mainSn) {
                state.mainSn = route.query.mainSn;
                await getMainDetail();
            } else {
                await getMainSection();
            }
            console.log(menuInfo.value);
            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });
        onUnmounted(() => {
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });
        const formData = reactive({
            mainSn: null, //메인순번
            mainCd: '385001', //메인코드 [385001:오늘(홈), 385002:챌린지, 385003:건강, 385004:커뮤니티
            mainStCd: '', //메인상태코드 [384001:승인대기(요청), 384002:승인반려, 384003:승인완료] //승인자 없는 경우 빼기
            aprvUsrSn: null, //승인자순번//승인자 없는 경우 빼기
            aprvRqstCts: '', // 승인요청내용
            sectList: [
                {
                    sectSn: 0, //섹션순번
                    sectCd: '', //섹션코드 [385005:메인배너, 385006:건강인사이트, 385007:유료구매서비스, 385008:라이프로그, 385009:진행중인챌린지, 385010:추천챌린지, 385011:1번띠배더, 385012:챌린지피트, 385013:2번띠배너, 385014:건강뉴스, 385015:추천상품(커머스), 385016:3번띠배너, 385017:핫딜상품(커머스)]
                    sectVwYn: 'N', //섹션노출상태 [Y:노출, N:비노출]
                    ttl: '', //타이틀
                    ttlVwYn: 'N', //타이틀노출상태 = [Y:노출, N:비노출]
                    sectSqn: 0, //섹션순서
                    dmmyYn: '' //더미유무
                }
            ]
        });
        // 메인 관리 구조
        const getMainSection = async () => {
            try {
                // 메인화면코드 [385001:오늘(홈), 385002:챌린지, 385003:건강, 385004:커뮤니티]
                let params = {
                    mcd: '385001'
                };
                const response = await _getMainSection(params.mcd);
                state.mainViewlist = response.data.data.list;
                state.dragShow = true;
                formData.mainCd = params.mcd;

            } catch (error) {
                console.log(error);

            }
        };
        // 승인자 선택
        const onChangeApproveUser = (value) => {
            formData.aprvUsrSn = value;
            formData.mainStCd = '384001';
            // saveMainSection();
            // modalControl();
        };
        // 메인 관리 폼 저장 
        const mainStr = () => {
            for (let i = 0; i < state.mainViewlist.length; i++) {
                let params = {
                    sectSn: i,
                    sectCd: state.mainViewlist[i].mainScrnSctnCd,
                    sectVwYn: state.mainViewlist[i].sctnIndnYn,
                    ttl: state.mainViewlist[i].sctnTtl,
                    ttlVwYn: state.mainViewlist[i].sctnTtlIndnYn,
                    sectSqn: i + 1,
                    dmmyYn: state.mainViewlist[i].dmmySctnCrtPsbYn
                };
                formData.sectList.splice(i, 1, params);
            }
        };
        // 메인 저장 수정
        const saveMainSection = async () => {
            try {
                await mainStr();
                let Commparams = {
                    mainSn: formData.mainSn,
                    mainCd: formData.mainCd,
                    aprvRqstCts: formData.aprvRqstCts,
                    sectList: formData.sectList
                };
                let apprParams = {
                    mainStCd: formData.mainStCd,
                    aprvUsrSn: formData.aprvUsrSn
                };
                let params = {};

                if (state.pageStatus === 'confirm' || state.pageStatus === 'edit') {
                    params = {
                        ...Commparams,
                        ...apprParams
                    };
                } else {
                    params = {
                        ...Commparams
                    };
                }
                console.log(params);
                const response = await _saveMainSection(params);
                if (response.data.code === 'OK') {
                    goToPage('/display/main/list');
                }
            } catch (error) {
                console.log(error);

            }
        };

        // 메인상세
        const getMainDetail = async () => {
            try {
                state.dragShow = false;
                const response = await _getMainDetail(state.mainSn);
                state.mainDeatail = response.data.data;
                state.mainViewlist = [];
                console.log(state.mainDeatail.list.length);
                for (let i = 0; i < state.mainDeatail.list.length; i++) {
                    let params = {
                        mainScrnCd: state.mainDeatail.mainScrnCd,
                        mainScrnNm: state.mainDeatail.mainScrnNm,
                        mainScrnSctnCd: state.mainDeatail.list[i].mainScrnSctnCd,
                        mainScrnSctnNm: state.mainDeatail.list[i].mainScrnSctnNm,
                        sctnIndnYn: state.mainDeatail.list[i].sctnIndnYn,
                        sctnTtl: state.mainDeatail.list[i].sctnTtl,
                        sctnTtlIndnYn: state.mainDeatail.list[i].sctnTtlIndnYn,
                        sctnIndnSqn: state.mainDeatail.list[i].sctnIndnSqn,
                        dmmySctnCrtPsbYn: state.mainDeatail.list[i].dmmySctnCrtPsbYn
                    };
                    formData.aprvRqstCts = state.mainDeatail.aprvRqstCts;
                    state.mainViewlist.splice(i, 1, params);
                    state.dragShow = true;
                }
                // 섹션 추가 가능한 것만 (더미가 Y)
                state.addSectionList = state.mainViewlist.filter(v => v.dmmySctnCrtPsbYn === 'Y');
                state.addSectionList.splice(0, 0, { 'mainScrnSctnNm': '선택', 'mainScrnSctnCd': '' });


            } catch (error) {
                console.log(error);
            }
        };

        const onChangeAddSection = (value, index) => {
            console.log(value, index);
            value === 'del' ? state.sectList.splice(index, 1) : state.sectList = value;

        };
        //섹션 카피 
        const copyMainSection = async () => {
            try {
                let params = {
                    sectList: state.sectList
                };
                console.log(params, state.mainSn);
                const response = await _copyMainSection(state.mainSn, params);

                await getMainDetail();
            } catch (error) {
                console.log(error);
            }
        };
        //섹션 카피 열개 이상처리시
        const limitAdd = (type) => {
            type === 'open' ? isShowModal.value = false : isShowModal.value = true;
        };



        //수정권한 처리
        const onChangeAuthEdit = async () => {
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };
        //삭제권한 처리
        const onChangeAuthDel = async () => {
            console.log(menuInfo.value.auth3DeleteYn);
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
        };

        const onChangeEdit = () => {
            actionBtns('edit');
        };
        const onChangeDel = () => {
            actionBtns('del');
        };

        const actionBtns = (type) => {
            state.confirm = false;
            state.copySection = false;
            state.pageStatus = type;
            if (validCheck()) {
                if (type === 'save') {

                    $Modal.confirm({
                        title: '',
                        message: '승인요청없이 "승인완료" 되어 Front에 반영됩니다. <br> 저장하시겠습니까?',

                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    })
                        .then(async (success) => {
                            console.log(success);
                            saveMainSection();
                        })
                        .catch(error => {
                            console.log(error);
                        });

                }
                if (type === 'edit') {
                    console.log(state.mainDeatail);
                    state.pageStatus = 'edit';
                    formData.mainSn = state.mainSn;
                    formData.aprvUsrSn = state.mainDeatail.aprvMnSn;
                    formData.mainStCd = state.mainDeatail.mainScrnStCd;
                    saveMainSection();
                }
                if (type === 'confirm') {
                    isShowModal.value = true;
                    state[type] = true;
                    state.confirmBtnMsg = '승인';
                    state.modalTitle = '승인요청';

                }
            }
            if (type === 'copySection') {
                isShowModal.value = true;
                state[type] = true;
                state.confirmBtnMsg = '확인';
                state.modalTitle = '섹션복사';
            }
        };
        const modalControl = (type) => {
            if (state.confirm) {
                if (formData.aprvUsrSn !== null) {
                    if (state.mainSn) {
                        state.pageStatus = 'edit';
                        formData.mainSn = state.mainSn;
                        formData.mainStCd = state.mainDeatail.mainScrnStCd;
                    }
                    if (type === 'modalconfirm') {
                        saveMainSection();
                    }
                } else {
                    $Modal.confirm({
                        title: '',
                        message: '승인자를 선택해주세요',
                        buttonText: {
                            confirm: '확인'
                        }
                    });
                }
            } else {
                if (type === 'modalconfirm') {
                    copyMainSection();
                }

            }
            isShowModal.value = false;
        };

        const onChangeSection = (type, item, itemvalue) => {
            console.log(state.mainViewlist);
        };

        watch(formData, () => {
            resetState();
        });
        const resetState = () => {
            state.validState.errState = false; // validation
            state.validState.message = '';
        };
        // @validate
        const validCheck = (type) => {
            let target = ['aprvRqstCts'];
            for (const item of target) {
                state.validState.target = item;
                if (item === 'aprvRqstCts') {
                    state.validState.message = '변경내용을 작성해주세요 ';
                }
                if (_.isEmpty(formData[item])) {
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
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            openModal,
            isShowModal,
            state,
            formData,
            onChangeAuthDel,
            onChangeAuthEdit,
            actionBtns,
            modalControl,
            onChangeSection,
            onChangeApproveUser,
            onChangeAddSection,
            limitAdd,
            checkValidState
        };
    }
};
</script>