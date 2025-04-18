<template>
    <section>
        <!-- 검색 -->
        <div class="ui-section">
            <subTitleBar :subTitle="'건강정보요약'" />
            <div class="ui-content">
                <div class="tbl-wrap" v-if="state.healthInformationSummary !== null">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 120px;">
                            <col style="width: auto;">
                            <col style="width: 120px;">
                            <col style="width: auto;">
                            <col style="width: 120px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>건강검진일</th>
                                <td>
                                    {{ state.healthInformationSummary.mdexmDate }}
                                </td>
                                <th>판정</th>
                                <td colspan="3">{{ state.healthInformationSummary.jdgCts }}</td>
                            </tr>
                            <tr>
                                <th>신장</th>
                                <td>
                                    {{ state.healthInformationSummary.htVl }}{{ state.healthInformationSummary.htUnitNm }}
                                </td>
                                <th>체중</th>
                                <td>
                                    {{ state.healthInformationSummary.bdwtVl }}
                                    {{ state.healthInformationSummary.bdwtUnitNm }}
                                </td>
                                <th>허리둘레</th>
                                <td>
                                    {{ state.healthInformationSummary.wstVl }}
                                    {{ state.healthInformationSummary.wstUnitNm }}
                                </td>

                            </tr>
                            <tr>
                                <th>체질량지수</th>
                                <td>
                                    {{ state.healthInformationSummary.bmiVl }}
                                    {{ state.healthInformationSummary.bmiUnitNm }}
                                </td>
                                <th>시력</th>
                                <td>
                                    {{ getFormatSplt(state.healthInformationSummary.sgtVl) }}
                                </td>
                                <th>청력</th>
                                <td>{{ getFormatSplt(state.healthInformationSummary.hrgVl) }}</td>

                            </tr>
                            <tr>
                                <th>고혈압</th>
                                <td>
                                    수축기혈압 :
                                    {{ state.healthInformationSummary.systolicBpVl }}
                                    {{ state.healthInformationSummary.bpUnitNm }}
                                    <br />
                                    이완기혈압 :
                                    {{ state.healthInformationSummary.diastolicBpVl }}
                                    {{ state.healthInformationSummary.bpUnitNm }}
                                    <br />
                                </td>
                                <th>신장질환</th>
                                <td>
                                    신사구체여과율 :
                                    {{ state.healthInformationSummary.egfrVl }}
                                    {{ state.healthInformationSummary.egfrUnitNm }}
                                    <br />
                                    요단백 :
                                    {{ state.healthInformationSummary.urptVl }}
                                    {{ state.healthInformationSummary.urptUnitNm }}
                                    <br />
                                    혈청크레아틴 :
                                    {{ state.healthInformationSummary.srcrVl }}
                                    {{ state.healthInformationSummary.srcrUnitNm }}

                                </td>
                                <th>빈혈</th>
                                <td>
                                    혈색소(헤모글로빈) :
                                    {{ state.healthInformationSummary.hgbVl }}
                                    {{ state.healthInformationSummary.hgbUnitNm }}

                                </td>


                            </tr>
                            <tr>
                                <th>당뇨</th>
                                <td>
                                    공복시혈당단위 :
                                    {{ state.healthInformationSummary.blsgrVl }}
                                    {{ state.healthInformationSummary.blsgrUnitNm }}
                                </td>
                                <th>이상지지혈증</th>
                                <td>
                                    HLD콜레스테롤 :
                                    {{ state.healthInformationSummary.hdlChlstVl }}
                                    {{ state.healthInformationSummary.hdlChlstUnitNm }}
                                    <br />
                                    LDL콜레스테롤 :
                                    {{ state.healthInformationSummary.ldlChlstVl }}
                                    {{ state.healthInformationSummary.ldlChlstUnitNm }}
                                    <br />
                                    중성지방 :
                                    {{ state.healthInformationSummary.triChlstVl }}
                                    {{ state.healthInformationSummary.triChlstUnitNm }}
                                    <br />
                                    총콜레스테롤 :
                                    {{ state.healthInformationSummary.totChlstVl }}
                                    {{ state.healthInformationSummary.totChlstUnitNm }}
                                </td>
                                <th>간장질환</th>
                                <td>
                                    ALT(SGPT) :
                                    {{ state.healthInformationSummary.altVl }}
                                    {{ state.healthInformationSummary.altUnitNm }}
                                    <br />
                                    AST(SGOT) :
                                    {{ state.healthInformationSummary.astVl }}
                                    {{ state.healthInformationSummary.astUnitNm }}
                                    <br />
                                    y-GTP :
                                    {{ state.healthInformationSummary.ggtVl }}
                                    {{ state.healthInformationSummary.ggtUnitNm }}
                                </td>
                            </tr>
                            <tr>
                                <th>흉부질환</th>
                                <td>
                                    {{ state.healthInformationSummary.thoVl }}
                                    {{ state.healthInformationSummary.thoUnitNm }}
                                </td>
                                <th>골다공증</th>
                                <td>
                                    {{ state.healthInformationSummary.otpVl }}
                                    {{ state.healthInformationSummary.otpUnitNm }}
                                </td>
                                <th></th>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-else></NoData>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'건강활동 지표'" />
            <div class="ui-content" style="position: relative;">
                <div class="tbl-wrap" v-if="state.healthActivityGuidePost !== null">
                    <div style="position: absolute;top:-32px; left:110px;">{{ '(' + state.healthActivityGuidePost.startDate
                        +
                        '~' + state.healthActivityGuidePost.endDate + ') '
                    }}</div>
                    <table class="table reg" v-if="state.healthActivityGuidePost.step !== '-'">
                        <colgroup>
                            <col style="width: 120px;">
                            <col style="width: auto;">
                            <col style="width: 120px;">
                            <col style="width: auto;">
                            <col style="width: 120px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>걸음수</th>
                                <td>{{ state.healthActivityGuidePost.step }}/일</td>
                                <th>수면시간</th>
                                <td>{{ state.healthActivityGuidePost.sleep }}/일</td>
                                <th>흡연량</th>
                                <td>{{ state.healthActivityGuidePost.smoke }}/일</td>
                            </tr>
                            <tr>
                                <th>음주량</th>
                                <td>{{ state.healthActivityGuidePost.drunk }} /월</td>
                                <th>감정</th>
                                <td>{{ state.healthActivityGuidePost.stress }}</td>
                                <th>수분</th>
                                <td>{{ state.healthActivityGuidePost.water }}/일</td>
                            </tr>

                        </tbody>
                    </table>
                    <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-else></NoData>
                </div>

            </div>
        </div>


        <HealthMind :memberNum="state.memberNum" />
        <HealthNews :memberNum="state.memberNum" />
    </section>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watchEffect } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import HealthNews from './HealthNews.vue';
import HealthMind from './HealthMind.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { format } from 'date-fns';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _getHealthInfoSummary } from '@/api/memberinfo.js';
export default {
    components: { DefaultModal, DateSerch, HealthMind, HealthNews },
    props: ['memberNum'],
    setup(props) {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();
        const dateSearch = ref(null);
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            {
                headerName: '서비스명',
                field: 'seEsnChcCd',
                maxWidth: 130,
                valueGetter: (params) => {
                    if (params.data.seEsnChcCd === '253001') {
                        return '필수';
                    } else if (params.data.seEsnChcCd === '253002') {
                        return '선택';
                    }
                }
            },
            {
                headerName: '기간',
                field: 'clusAgrmSeCdYn',
                maxWidth: 130,
                valueGetter: (params) => {
                    if (params.data.clusAgrmSeCdYn === 'Y') {
                        return '동의';
                    } else if (params.data.clusAgrmSeCdYn === 'N') {
                        return '미동의';
                    }
                }
            },
            { headerName: '참여일자', field: 'clusAgrmDt', maxWidth: 150 },
            { headerName: '종료일자', field: 'clusAgrmWtdrDt', maxWidth: 150 },
            { headerName: '진행상태', field: 'clusAgrmWtdrDt', maxWidth: 150 }
        ]);

        const state = reactive({
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
            openMore: false,
            mskgnRlsYn: false,
            healthInformationSummary: {},
            healthActivityGuidePost: {},
            memberService: [],
            pagesize: 10,
            memberNum: '',
            startDay: dayJS(new Date().getTime() - 3600 * 1000 * 24).format('YYYY-MM-DD'),
            endDay: dayJS(new Date().getTime() + 3600 * 1000 * 24 * 30).format('YYYY-MM-DD')

        });
        const formData = reactive({
            mbrSn: computed(() => state.memberNum)
        });

        onMounted(() => {
            state.memberNum = route.query.mbrSn;
            if (state.memberNum) {
                getHealthInfoSummary();
            }


        });
        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });
        const onChangedPage = (pagenum) => {
            //console.log(pagenum);
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getHealthInfoSummary();
        };
        //리스트 조회
        const getHealthInfoSummary = async () => {
            try {
                let params = {
                    mbrSn: formData.mbrSn,
                    page: 0
                };
                console.log(params);
                const response = await _getHealthInfoSummary(params);
                console.log(response.data);
                state.healthInformationSummary = response.data.data.healthInformationSummary;
                state.healthActivityGuidePost = response.data.data.healthActivityGuidePost;
            } catch (error) {
                console.log(error);
            }
        };

        const getFormatSplt = (data) => {
            if (data) {
                const _split = data.split('/');
                return `좌 : ${_split[0]} / 우 : ${_split[1]}`;
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            fileDown,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            openModal,
            state,
            formData,
            initColum,
            pager,
            onChangedPage,
            getFormatSplt // 시력 // 청력 ( 좌 / 우 )

        };
    }
};

</script>