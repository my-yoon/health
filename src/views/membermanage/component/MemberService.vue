<template>
    <div>
        <div class="ui-section">
            <subTitleBar :subTitle="'라이프로그 기록 현황'" />
            <div class="ui-content">
                <div class="tbl-wrap" v-if="state.serviceList.lifeLogPresentSituationList !== null">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 120px;">
                            <col style="width: auto;">
                            <col style="width: 120px;">
                            <col style="width: auto;">
                            <col style="width: 120px;">
                            <col style="width: auto;">
                            <col style="width: 120px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">걸음</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.step }}
                                </td>
                                <th scope="row">수면</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.sleep }}</td>
                                <th scope="row">식사</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.food }}</td>
                                <th scope="row">감정</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.stress }}</td>
                            </tr>
                            <tr>
                                <th scope="row">체성분</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.bodyComposition }}</td>
                                <th scope="row">흡연</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.smoke }}</td>
                                <th scope="row">수분</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.nutrition }}</td>
                                <th scope="row">혈당</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.bloodGlucose }}</td>
                            </tr>
                            <tr>
                                <th scope="row">혈압</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.bloodPressure }}</td>
                                <th scope="row">음주</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.drunk }}</td>
                                <th scope="row">심박</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.heartRate }}</td>
                                <th scope="row">복약</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.medicine }}</td>
                            </tr>
                            <tr>
                                <th scope="row">운동</th>
                                <td>{{ state.serviceList.lifeLogPresentSituationList.exercise }}</td>
                                <th scope="row"></th>
                                <td></td>
                                <th scope="row"></th>
                                <td></td>
                                <th scope="row"></th>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <NoData v-else :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'챌린지 활동 현황'" />
            <div class="ui-content">
                <div class="tbl-wrap" v-if="state.serviceList.challengeActivityPresentSituation !== null">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">챌린지 참여 총 횟수</th>
                                <td>{{ state.serviceList.challengeActivityPresentSituation?.participationTotalCount || 0 }}
                                </td>
                                <th scope="row">성공한 챌린지 횟수</th>
                                <td>{{ state.serviceList.challengeActivityPresentSituation?.successCount || 0 }}</td>
                                <th scope="row">실패한 챌린지 횟수</th>
                                <td>{{ state.serviceList.challengeActivityPresentSituation?.failureCount || 0 }}</td>
                            </tr>
                            <tr>
                                <th scope="row">참여한 챌린지 카테고리</th>
                                <td colspan="5">
                                    <!-- 혈당관리 참여한 챌린지 -->
                                    {{ `혈당관리(${state.serviceList.challengeActivityPresentSituation?.bloodSugarChallengeCount
                                        || 0}) ` }}

                                    <!-- 혈압관리 참여한 챌린지 -->
                                    {{ ` /
                                    혈압관리(${state.serviceList.challengeActivityPresentSituation?.bloodPressureChallengeCount
                                        || 0}) ` }}

                                    <!-- 혈관관리 참여한 챌린지 -->
                                    {{ ` /
                                    혈관관리(${state.serviceList.challengeActivityPresentSituation?.bloodVesselChallengeCount ||
                                        0}) ` }}

                                    <!-- 체중관리 참여한 챌린지 -->
                                    {{ ` /
                                    체중관리(${state.serviceList.challengeActivityPresentSituation?.bodyWeightChallengeCount ||
                                        0}) ` }}

                                    <!-- 통계걷기 참여한 챌린지 -->
                                    {{ ` / 통계걷기(${state.serviceList.challengeActivityPresentSituation?.walkingChallengeCount
                                        || 0}) ` }}

                                </td>
                            </tr>
                            <!-- <tr>
                                <th scope="row">보유뱃지</th>
                                <td colspan="5"> {{ }}</td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
                <NoData v-else :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            </div>

        </div>
        <div class="ui-section" v-if="false">
            <subTitleBar :subTitle="'커뮤니티 활동 현황'" />
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
                                <th scope="row">게시글 작성 건수</th>
                                <td colspan="4"> </td>
                            </tr>
                            <tr>
                                <th scope="row">댓글작성건수</th>
                                <td>{{ }}</td>
                                <th scope="row">게시글 공감 횟수</th>
                                <td>{{ }}</td>
                            </tr>
                            <tr>
                                <th scope="row">사용자 팔로워 수</th>
                                <td>{{ }}</td>
                                <th scope="row">사용자 팔로잉 수</th>
                                <td>{{ }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'디바이스 및 서비스 연동현황'" />
            <div class="ui-content">
                <div class="tbl-wrap" v-if="state.serviceList.deviceAndServiceInterlockedPresentSituation !== null">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">연동된 타 App</th>
                                <td>
                                    <template
                                        v-if="state.serviceList.deviceAndServiceInterlockedPresentSituation.interlockedOtherApp === null">
                                        -</template>
                                    <template v-else>
                                        {{
                                            state.serviceList.deviceAndServiceInterlockedPresentSituation.interlockedOtherApp
                                        }}
                                    </template>
                                </td>
                                <th scope="row">사용자 모바일/OS</th>
                                <td>
                                    {{
                                        state.serviceList.deviceAndServiceInterlockedPresentSituation.serviceDeviceInfo?.mblDvcInf
                                    }}
                                    /
                                    {{
                                        state.serviceList.deviceAndServiceInterlockedPresentSituation.serviceDeviceInfo?.mblOsNm
                                    }}

                                    {{
                                        state.serviceList.deviceAndServiceInterlockedPresentSituation.serviceDeviceInfo?.mblOsVer
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <NoData v-else :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            </div>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { format } from 'date-fns';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _getServiceInfo } from '@/api/memberinfo.js';

export default {
    props: ['memberNum', 'menuInfo'],
    components: { DefaultModal, DateSerch },
    setup(props) {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();
        const dateSearch = ref(null);
        const { goToPage, openModal } = useCommFunc();
        const state = reactive({
            serviceList: {
                lifeLogPresentSituationList: {},
                challengeActivityPresentSituation: {},
                deviceAndServiceInterlockedPresentSituation: {
                    interlockedOtherApp: {},
                    serviceDeviceInfo: {}
                }
            },
            memberNum: ''
        });
        const formData = reactive({
            mbrSn: computed(() => state.memberNum)
        });
        // watch(state.memberNum, () => {
        //     if (state.memberNum) {
        //         getServiceInfo();
        //     }
        // });


        onMounted(() => {
            console.log(props.memberNum);
            state.memberNum = route.query.mbrSn;
            if (state.memberNum) {
                getServiceInfo();
            }

        });

        //리스트 조회
        const getServiceInfo = async () => {
            try {
                let params = {
                    mbrSn: formData.mbrSn
                };
                const response = await _getServiceInfo(params);
                console.log(response.data);
                state.serviceList.challengeActivityPresentSituation = response.data.data.challengeActivityPresentSituation;
                state.serviceList.deviceAndServiceInterlockedPresentSituation = response.data.data.deviceAndServiceInterlockedPresentSituation;
                state.serviceList.lifeLogPresentSituationList = response.data.data.lifeLogPresentSituationList;

            } catch (error) {
                console.log(error);
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            openModal,
            state,
            formData


        };
    }
};

</script>