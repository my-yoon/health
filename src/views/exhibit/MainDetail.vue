<template>
    <div>
        <div class="ui-section">
            <subTitleBar :subTitle="'메인 구성 내역'" />
            <div class="ui-content">
                <div class="table-list">
                    <table class="table list">
                        <colgroup>
                            <col style="width: 120px;">
                            <col style="width: 200px;">
                            <col style="width: 200px;">
                            <col style="width: auto;">
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">노출순서</th>
                                <th scope="col">섹션명</th>
                                <th scope="col">섹션노출 상태</th>
                                <th scope="col">타이틀</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in state.mainDeatail.list" :key="index">
                                <td>{{ item.sctnIndnSqn }}</td>
                                <td class="t-left">{{ item.mainScrnSctnNm }}</td>
                                <td>
                                    <template v-if="item.sctnIndnYn === 'Y'">노출</template>
                                    <template v-else>비노출</template>
                                </td>
                                <td class="t-left">
                                    <template v-if="item.sctnTtl === ''">-</template>
                                    <template v-else>{{ item.sctnTtl }}</template>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
        <div class="ui-section">
            <div class="ui-content">
                <div class="table-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">상태</th>
                                <td colspan="3">{{ state.mainDeatail.mainScrnStNm }}</td>
                            </tr>
                            <!-- 반려일때 -->
                            <template v-if="state.mainDeatail.mainScrnStCd === '384002'">
                                <tr>
                                    <th scope="row">반려사유</th>
                                    <td colspan="3">{{ state.mainDeatail.tdnRsn }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">반려자</th>
                                    <td>{{ state.mainDeatail.tdnMnNm }}</td>
                                    <th scope="row">반려일자</th>
                                    <td>{{ state.mainDeatail.tdnDt }}</td>
                                </tr>
                            </template>
                            <!-- 승인일때 -->
                            <template v-if="state.mainDeatail.mainScrnStCd === '384003'">
                                <tr>
                                    <th scope="row">승인자</th>
                                    <td>
                                        <template v-if="state.mainDeatail.aprvMnNm !== null">
                                            {{ state.mainDeatail.aprvMnNm }}
                                        </template>
                                        <template v-else>
                                            즉시반영
                                        </template>

                                    </td>
                                    <th scope="row">승인일자</th>
                                    <td>{{ state.mainDeatail.aprvDt }}</td>
                                </tr>
                            </template>
                            <tr>
                                <th scope="row">승인요청내용</th>
                                <td colspan="3">
                                    {{ state.mainDeatail.aprvRqstCts }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">등록자</th>
                                <td>{{ state.mainDeatail.rgtrNm }}</td>
                                <th scope="row">등록일자</th>
                                <td>{{ state.mainDeatail.rgsDt }}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
        <!-- 승인 반려는 승인자만 할수 있다 수정은 등록자만 -->
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/display/main/list')">목록</button>
            <button type="button" class="btn btn-sl posi" @click="actionBtns('reject')"
                v-if="state.mainDeatail.mainScrnStCd !== '384003' && state.adminfo.admnSn === state.mainDeatail.aprvMnSn">반려</button>
            <button type="button" class="btn btn-sl posi" @click="actionBtns('confirm')"
                v-if="state.mainDeatail.mainScrnStCd !== '384003' && state.adminfo.admnSn === state.mainDeatail.aprvMnSn">승인</button>
            <button type="button" class="btn btn-sl posi" @click="goToPage('/display/main/reg?mainSn=' + state.mainSn)"
                v-if="state.mainDeatail.mainScrnStCd !== '384003' && state.adminfo.admnSn === state.mainDeatail.rgtrSn">수정</button>
        </div>
        <DefaultModal :buttonCancel="'취소'" :buttonConfirm="state.confirmBtnMsg" :isShow="isShowModal"
            :modalName="'isShowModal'" :modalTitle="state.modalTitle" @modalclose="modalControl" class="ui-modal">
            <template #modalcontent>
                <div>
                    <div v-if="state.reject">
                        <div class="ui-title-3">
                            <h3>반려사유를 등록해주세요. <strong>(5~3000자 이내 입력)</strong></h3>
                        </div>
                        <div class="tbl-wrap mt-10">
                            <table class="table reg">
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <div class="textarea">
                                                        <textarea id="textarea" class="form-control" style="height: 150px;"
                                                            v-model="formData.tdnRsn">
                                                    </textarea>
                                                        <div class="txt-counter">
                                                            <strong>{{ formData.tdnRsn.length }}</strong> /
                                                            <span>3000</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-if="checkValidState('reJointext')">
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
            </template>
        </DefaultModal>
    </div>
</template>
<script>
import { reactive, inject, ref, onMounted, onUnmounted, computed } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _getMainDetail, _approveMainSection, _rejectMainSection } from '@/api/exhibit.js';

export default {
    props: ['adminfo'],
    components: { DefaultModal },
    setup(props) {
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
        const state = reactive({
            adminfo: computed(() => props.adminfo),
            pagesize: 10,
            searchlist: [
                { label: '이름', value: '' },
                { label: '아이디', value: '' },
                { label: '이메일', value: '' }
            ],
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
            mainRequestlist: [],
            mainDeatail: {
                list: []
            },
            reject: false,
            confirm: false,
            confirmBtnMsg: '반려',
            modalTitle: '반려',
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            },
            mainSn: ''
        });

        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeEditRol, onChangeDelRol } = authCommFunc();
        onMounted(() => {
            state.mainSn = route.query.mainSn;
            getMainDetail();
            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });
        onUnmounted(() => {
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });
        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });
        const formData = reactive({
            tdnRsn: ''
        });

        const onChangedPage = (pagenum) => {
            //console.log(pagenum);
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
        };
        //메인 관리 상세
        const getMainDetail = async () => {
            try {
                const response = await _getMainDetail(state.mainSn);
                state.mainDeatail = response.data.data;
            } catch (error) {
                console.log(error);
            }
        };
        //승인
        const approveMainSection = async () => {
            try {
                console.log(state.mainSn);
                const response = await _approveMainSection(state.mainSn);
                if (response.data.code === 'OK') {
                    goToPage('/display/main/list');
                }
            } catch (error) {
                console.log(error);
            }
        };
        //반려
        const rejectMainSection = async () => {
            try {
                let params = {
                    tdnRsn: formData.tdnRsn
                };
                console.log(state.mainSn);
                const response = await _rejectMainSection(state.mainSn, params);
                if (response.data.code === 'OK') {
                    goToPage('/display/main/list');
                }
            } catch (error) {
                console.log(error);
            }
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

            if (type === 'reject') {
                isShowModal.value = true;
                state.reject = false;
                state[type] = true;
                state.confirmBtnMsg = '반려';
                state.modalTitle = '반려';

            }
            if (type === 'confirm') {
                console.log('승인처리');
                $Modal.confirm({
                    title: '',
                    message: '승인처리 하시겠습니까?',

                    buttonText: {
                        confirm: '확인'
                    }
                })
                    .then(async (success) => {
                        console.log(success);
                        approveMainSection();


                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };
        const modalControl = () => {
            isShowModal.value = false;
            rejectMainSection();
        };
        // @validate
        const validCheck = (type) => {
            let target = ['afterSeq'];
            for (const item of target) {
                state.validState.target = item;
                if (item == 'afterSeq' && orderCheck(state.seqGroup)) {
                    state.validState.errState = true;
                    state.validState.message = '반려메세지를 작성해 주세요';
                    break;
                }
                return !state.validState.errState;
            }
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
            pager,
            formData,
            onChangeAuthDel,
            onChangeAuthEdit,
            actionBtns,
            modalControl,
            checkValidState
        };
    }
};
</script>