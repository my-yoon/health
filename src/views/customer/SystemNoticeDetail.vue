<template>
    <section>
        <div class="ui-section">
            <subTitleBar :subTitle="state.subTitle"/>
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
                            <th scope="row">공지 구분</th>
                            <td>
                                {{ formData.systemNoticeTypeName }}
                            </td>
                            <th scope="row">조회수</th>
                            <td>
                                {{ formData.inquiryNum }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">공지대상</th>
                            <td>
                                {{ formData.systemNoticeExposeGroupName }}
                            </td>
                            <th scope="row">노출화면</th>
                            <td>
                                {{ formData.exposeScreenName }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">공지제목</th>
                            <td colspan="3">
                                {{ formData.systemNoticeTitle }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">공지내용</th>
                            <td colspan="3" v-html="formData.systemNoticeContent">
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">노출설정</th>
                            <td colspan="3">
                                {{
                                    formData.exposeType === '132002' ?
                                        dayJS(formData.exposeBeginDt).format('YYYY-MM-DD HH: mm') + ' ~ ' +
                                        dayJS(formData.exposeEndDt).format('YYYY - MM - DD HH: mm') :
                                        formData.exposeTypeName
                                }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">그만보기 설정</th>
                            <td colspan="3">
                                {{ formData.stopViewYn === 'Y' ? '사용' : '미사용' }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">등록자</th>
                            <td>{{ formData.regiterNm }}</td>
                            <th scope="row">등록일시</th>
                            <td>
                                <template v-if="formData.registDt">
                                    {{ dayJS(formData.registDt).format('YYYY-MM-DD HH:mm:ss') }}
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">수정자</th>
                            <td>{{ formData.updaterNm }}</td>
                            <th scope="row">수정일시</th>
                            <td>
                                <template v-if="formData.updateDt">
                                    {{ dayJS(formData.updateDt).format('YYYY-MM-DD HH:mm:ss') }}
                                </template>
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="btn-bottom-set flex justify-center">
            <button class="btn btn-sl nega" type="button" @click="goToPage('/cs_center/system_notice/list')">목록</button>
            <button class="btn btn-sl nega" type="button" @click="checkDel">삭제</button>
            <button class="btn btn-sl posi" type="button"
                    @click="checkEdit">수정
            </button>
        </div>


    </section>
</template>
<script>
import {reactive, inject, onMounted, onUnmounted, computed, ref} from 'vue';
import {_getSystemNotice, _delSystemNotice, _delSystemNoticeList} from '@/api/customer.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import {useCommFunc} from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
    components: {
        DefaultModal,
        DateSerch
    },
    setup() {
        const store = useStore();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const {
            goToPage,
            openModal
        } = useCommFunc();
        const route = useRoute();

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
        const { onChangeEditRol, onChangeDelRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const state = reactive({
            systemNoticeSn: '',
            subTitle: '시스템 공지사항 등록',
            menuCode: '1014004'
        });

        const formData = ref({
            systemNoticeSn: null,  // 공지사항 순번
            systemNoticeType: null,  // 공지사항 구분
            systemNoticeTypeName: null,  // 공지사항 구분명
            systemNoticeExposeGroup: null,  // 노출그룹 코드
            systemNoticeExposeGroupName: null,  // 노출그룹 코드명
            systemNoticeTitle: null,  // 공지사항 제목
            systemNoticeContent: null,  // 내용
            exposeType: null,  // 노출설정 코드
            exposeTypeName: null,  // 노출설정 코드명
            exposeBeginDt: null,  // 노출예약 시작일
            exposeEndDt: null,  // 노출예약 종료일
            exposeYn: null,  // 노출여부
            exposeScreen: null,  // 노출화면
            exposeScreenName: null,  // 노출화면 명
            inquiryNum: null,  // 조회수
            registerSn: null,  // 작성자 순번
            regiterNm: null,  // 작성자명
            registerAdminLevelName: null,  // 작성자 어드민 레벨
            registDt: null,  // 작성일
            updaterSn: null,  // 수정자 순분
            updaterNm: null,  // 수정자명
            updaterAdminLevelName: null,  // 수정자 어드민 레벨
            updateDt: null,  // 수정일
            stopViewYn: null,  // 그만보기 여부
            deleteYn: null,  // 삭제 여부
            deleteDt: null // 삭제일
        });


        onMounted(() => {
            state.systemNoticeSn = route.query.systemNoticeSn;
            getSystemNoticeDetail({systemNoticeSn: state.systemNoticeSn, menuCode: state.menuCode});
            state.pageType = 'detail';
            state.subTitle = '시스템 공지사항 상세';

            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });

        /**
         * 마스킹 해제 이벤트 버스 해제
         */
        onUnmounted(() => {
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });

        /**
         * 수정 권한 체크
         */
        const checkEdit = async () => {
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            goToPage('/cs_center/system_notice/register?systemNoticeSn=' + formData.value.systemNoticeSn);
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
            deleteNotice();
        };

        // 상세조회
        const getSystemNoticeDetail = async (params) => {
            try {
                const response = await _getSystemNotice(params);
                formData.value = response.data.data;
            } catch (error) {
                console.log(error);
            }
        };

        // 공지사항 삭제
        const deleteNotice = () => {
            $Modal.confirm({
                title: '',
                message: '삭제하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            })
                .then(success => {
                    if (success === 'confirm') {
                        delSystemNotice();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };

        const delSystemNotice = async () => {
            try {
                await _delSystemNoticeList({systemNoticeSnList: [state.systemNoticeSn]}).then(result => {
                    if (result.data.code === 'OK') {
                        $Modal.alert({message: '삭제 되었습니다.', buttonText: {ok: '확인'}}).then(v => {
                            goToPage('/cs_center/system_notice/list');
                        });
                    } else {
                        console.log(result.data);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };


        return {
            //공통 사용
            $Modal,
            dayJS,
            state,
            formData,
            deleteNotice,
            goToPage,
            openModal,

            checkEdit,
            checkDel
        };
    }
};
</script>