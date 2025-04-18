<template>
    <div class="ui-dashboard">
        <div class="ui-dashboard-summary-wrap">
            <div class="ui-dashboard-summary">
                <div class="ui-dashboard-summary-head">
                    <h2>CS / 업무승인</h2>
                </div>
                <div class="ui-dashboard-summary-list">
                    <div class="ui-dashboard-summary-item alarm"><!-- 건수 1개이상 class 'alarm' 적용 -->
                        <div class="ds-head">
                            <h3>1:1문의</h3>
                        </div>
                        <div class="ds-cont">
                            <div class="ds-cont-item">
                                <span class="lb">이관요청</span>
                                <span class="value">
                                    <a href="#" class="num-link">1</a>
                                </span>
                            </div>
                            <div class="ds-cont-item">
                                <span class="lb">답변대기</span>
                                <span class="value">
                                    <a href="#" class="num-link">5</a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="ui-dashboard-summary-item alarm"><!-- 건수 1개이상 class 'alarm' 적용 -->
                        <div class="ds-head">
                            <h3>공지사항</h3>
                        </div>
                        <div class="ds-cont">
                            <div class="ds-cont-item">
                                <span class="lb">승인대기</span>
                                <span class="value">
                                    <a href="#" class="num-link">3</a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="ui-dashboard-summary-item alarm"><!-- 건수 1개이상 class 'alarm' 적용 -->
                        <div class="ds-head">
                            <h3>포인트</h3>
                        </div>
                        <div class="ds-cont">
                            <div class="ds-cont-item">
                                <span class="lb">승인대기</span>
                                <span class="value">
                                    <a href="#" class="num-link">0</a>
                                </span>
                            </div>
                            <div class="ds-cont-item">
                                <span class="lb">정책변경</span>
                                <span class="value">
                                    <a href="#" class="num-link">1</a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="ui-dashboard-summary-item">
                        <div class="ds-head">
                            <h3>스타</h3>
                        </div>
                        <div class="ds-cont">
                            <div class="ds-cont-item">
                                <span class="lb">승인대기</span>
                                <span class="value">-</span>
                            </div>
                        </div>
                    </div>
                    <div class="ui-dashboard-summary-item alarm"><!-- 건수 1개이상 class 'alarm' 적용 -->
                        <div class="ds-head">
                            <h3>상품권_용역형</h3>
                        </div>
                        <div class="ds-cont">
                            <div class="ds-cont-item">
                                <span class="lb">승인대기</span>
                                <span class="value">
                                    <a href="#" class="num-link">2</a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="ui-dashboard-summary-item">
                        <div class="ds-head">
                            <h3>상품권_물품형</h3>
                        </div>
                        <div class="ds-cont">
                            <div class="ds-cont-item">
                                <span class="lb">승인대기</span>
                                <span class="value">
                                    <a href="#" class="num-link">0</a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="ui-dashboard-summary-item alarm"><!-- 건수 1개이상 class 'alarm' 적용 -->
                        <div class="ds-head">
                            <h3>이벤트</h3>
                        </div>
                        <div class="ds-cont">
                            <div class="ds-cont-item">
                                <span class="lb">승인대기</span>
                                <span class="value">
                                    <a href="#" class="num-link">3</a>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="ui-dashboard-summary-item alarm"><!-- 건수 1개이상 class 'alarm' 적용 -->
                        <div class="ds-head">
                            <h3>메시지</h3>
                        </div>
                        <div class="ds-cont">
                            <div class="ds-cont-item">
                                <span class="lb">승인대기</span>
                                <span class="value">
                                    <a href="#" class="num-link">4</a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui-dashboard-list">

            <!-- 계정승인 현황 -->
            <div class="ui-dashboard-pos-set">
                <button type="button" class="btn-pos">순서변경</button>
            </div>
            <div class="ui-dashboard-item">
                <div class="ui-dashboard-item-head">
                    <h2>계정승인 현황</h2>
                    <button type="button" class="btn-direct-link"><span class="offscreen">계정승인 현황 바로가기</span></button>
                </div>
                <div class="ui-dashboard-item-cont flex space-between">
                    <template v-for="(item, index) in state.accountApproval" :key="index">
                        <div class="ui-acc-app-item" :class="[item.name.toLowerCase(), { alarm: item.in > 0 || item.out > 0 }]">
                            <div class="aa-head">
                                <h3>{{ item.name }}</h3>
                            </div>
                            <div class="aa-cont">
                                <div class="aa-cont-item">
                                    <span class="lb">가입요청</span>
                                    <span class="value">
                                        <a href="#" class="num-link">{{ item.in }}</a>
                                    </span>
                                </div>
                                <div class="aa-cont-item">
                                    <span class="lb">탈퇴요청</span>
                                    <span class="value">
                                        <a href="#" class="num-link">{{ item.out }}</a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- 회원현황 -->
            <div class="ui-dashboard-item">
                <div class="ui-dashboard-item-head">
                    <h2>회원현황</h2>
                    <button type="button" class="btn-direct-link"><span class="offscreen">회원현황 바로가기</span></button>
                    <span class="s-date">기준일 : 2023-09-18</span>
                </div>
                <div class="ui-dashboard-item-cont">
                    <div class="ui-dashboard-item-box">
                        <div class="ui-dashboard-member-chart flex">
                            <div class="member-chart-item total wp-30">
                                <div class="member-chart-item-head">
                                    <h3>활동 회원수</h3>
                                </div>
                                <div class="member-chart-item-cont">
                                    <!-- <div style="height: 200px; line-height: 200px; background-color: #f7f7f7; text-align: center;">파이차트영역</div> -->
                                    <chart-pie ref="ChartPie" :data-sets="state.chartPie.datasets" :labels="state.chartPie.label" :options="state.chartPie.options"></chart-pie>
                                </div>
                            </div>
                            <div class="member-chart-item period wp-70">
                                <div class="member-chart-item-head">
                                    <h3>9월 활동 회원 수</h3>
                                    <div class="ui-radio-switch">
                                        <span class="radio">
                                            <input id="dateMemberSort1" name="dateActiveMemberSortGroup" v-model="state.activityMemberStandard" value="day" type="radio" @change="changeActivityMemberStandard">
                                            <label for="dateMemberSort1">일</label>
                                            <!-- <input id="dateMemberSort1" name="dateMemberSortGroup" type="radio" checked>
                                            <label for="dateMemberSort1">일</label> -->
                                        </span>
                                        <span class="radio">
                                            <input id="dateMemberSort2" name="dateActiveMemberSortGroup" v-model="state.activityMemberStandard" value="month" type="radio" @change="changeActivityMemberStandard">
                                            <label for="dateMemberSort2">월</label>
                                            <!-- <input id="dateMemberSort2" name="dateMemberSortGroup" type="radio">
                                            <label for="dateMemberSort2">월</label> -->
                                        </span>
                                    </div>
                                </div>
                                <div class="member-chart-item-cont">
                                    <!-- <div style="height: 200px; line-height: 200px; background-color: #f7f7f7; text-align: center;">라인차트영역</div> -->
                                    <chart-line ref="chartLine" :data-sets="state.chartLine.datasets" :labels="state.chartLine.label" :options="state.chartLine.options"></chart-line>
                                </div>
                            </div>
                        </div>
                        <div class="ui-dashboard-member-count flex space-between">
                            <div class="member-count-item">
                                <div class="member-count-item-head member">
                                    <h3>회원 가입자</h3>
                                </div>
                                <div class="member-count-item-cont flex space-between">
                                    <div class="member-count-sub-item">
                                        <div class="member-count-sub-item-head">
                                            <h4>전체수</h4>
                                        </div>
                                        <div class="member-count-sub-item-cont">
                                            <div class="ms-cont-item flex space-between">
                                                <span class="lb">임직원</span>
                                                <span class="value">550,578명</span>
                                            </div>
                                            <div class="ms-cont-item flex space-between">
                                                <span class="lb">일반</span>
                                                <span class="value">199,772명</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="member-count-sub-item">
                                        <div class="member-count-sub-item-head">
                                            <h4>9월 신규</h4>
                                        </div>
                                        <div class="member-count-sub-item-cont">
                                            <div class="ms-cont-item flex space-between">
                                                <span class="lb">임직원</span>
                                                <span class="value">550,578명</span>
                                            </div>
                                            <div class="ms-cont-item flex space-between">
                                                <span class="lb">일반</span>
                                                <span class="value">199,772명</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="member-count-item">
                                <div class="member-count-item-head company">
                                    <h3>가입 업체수</h3>
                                </div>
                                <div class="member-count-item-cont flex space-between">
                                    <div class="member-count-sub-item">
                                        <div class="member-count-sub-item-head">
                                            <h4>전체수</h4>
                                        </div>
                                        <div class="member-count-sub-item-cont">
                                            <div class="ms-cont-item flex space-between">
                                                <span class="lb">고객사</span>
                                                <span class="value">54개</span>
                                            </div>
                                            <div class="ms-cont-item flex space-between">
                                                <span class="lb">입점사</span>
                                                <span class="value">34개</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="member-count-sub-item">
                                        <div class="member-count-sub-item-head">
                                            <h4>9월 신규</h4>
                                        </div>
                                        <div class="member-count-sub-item-cont">
                                            <div class="ms-cont-item flex space-between">
                                                <span class="lb">고객사</span>
                                                <span class="value">54개</span>
                                            </div>
                                            <div class="ms-cont-item flex space-between">
                                                <span class="lb">입점사</span>
                                                <span class="value">34개</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 매출현황 -->
            <div class="ui-dashboard-item">
                <div class="ui-dashboard-item-head">
                    <h2>매출현황</h2>
                    <button type="button" class="btn-direct-link"><span class="offscreen">매출현황 바로가기</span></button>
                </div>
                <div class="ui-dashboard-item-cont">
                    <div class="ui-dashboard-item-box">
                        <div class="ui-sales-con flex space-between">
                            <div class="ui-sales-con-item">
                                <div class="ui-sales-con-item-head">
                                    <h3>9월</h3>
                                </div>
                                <div class="ui-sales-con-item-cont">
                                    <div class="sales-sum flex space-between align-center">
                                        <div class="sales-sum-item flex align-center">
                                            <div class="sum-item">
                                                <strong class="lb">결제완료</strong>
                                                <span class="value">152,750,000원</span>
                                            </div>
                                            <div class="sum-unit minus"><span class="offscreen">-</span></div>
                                            <div class="sum-item">
                                                <strong class="lb">결제취소</strong>
                                                <span class="value">46,850,000원</span>
                                            </div>
                                            <div class="sum-unit eq"><span class="offscreen">=</span></div>
                                        </div>
                                        <div class="sales-sum-item">
                                            <div class="sum-item">
                                                <strong class="lb">총 매출</strong>
                                                <span class="value total">152,750,000원</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="is-sales-sum">
                                        (전월 대비 5,103,090원 <span class="arrow up"><span class="offscreen">상승</span></span>)
                                    </div>
                                </div>
                            </div>
                            <div class="ui-sales-con-item">
                                <div class="ui-sales-con-item-head">
                                    <h3>오늘</h3>
                                </div>
                                <div class="ui-sales-con-item-cont">
                                    <div class="sales-sum flex space-between align-center">
                                        <div class="sales-sum-item flex align-center">
                                            <div class="sum-item">
                                                <strong class="lb">결제완료</strong>
                                                <span class="value">10,008,000원</span>
                                            </div>
                                            <div class="sum-unit minus"><span class="offscreen">-</span></div>
                                            <div class="sum-item">
                                                <strong class="lb">결제취소</strong>
                                                <span class="value">2,070,000원</span>
                                            </div>
                                            <div class="sum-unit eq"><span class="offscreen">=</span></div>
                                        </div>
                                        <div class="sales-sum-item">
                                            <div class="sum-item">
                                                <strong class="lb">총 매출</strong>
                                                <span class="value total">9,801,000원</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="is-sales-sum">
                                        (전일 대비 300,800원 <span class="arrow down"><span class="offscreen">하락</span></span>)
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ui-sales-con flex">

                            <!-- 매출현황 - 매출내역 -->
                            <div class="ui-sales-list wp-30">
                                <div class="ui-sales-list-head">
                                    <h3>9월 매출내역</h3>
                                </div>
                                <div class="ui-sales-list-cont">
                                    <div class="ui-sales-list-item-group">
                                        <div class="ui-sales-list-item">
                                            <div class="sl-head">
                                                <h4>결제</h4>
                                            </div>
                                            <div class="sl-cont">
                                                <div class="sl-item">
                                                    <span class="lb">카드({{ Number(state.salesHistory.card.count).toLocaleString() }}건)</span>
                                                    <span class="value"><span class="plus">{{ Number(state.salesHistory.card.price).toLocaleString() }}</span>원</span>
                                                </div>
                                                <div class="sl-item">
                                                    <span class="lb">현금({{ Number(state.salesHistory.cash.count).toLocaleString() }}건)</span>
                                                    <span class="value"><span class="plus">{{ Number(state.salesHistory.cash.price).toLocaleString() }}</span>원</span>
                                                </div>
                                                <div class="sl-item">
                                                    <span class="lb">포인트({{ Number(state.salesHistory.point.count).toLocaleString() }}건)</span>
                                                    <span class="value"><span class="plus">{{ Number(state.salesHistory.point.price).toLocaleString() }}</span>원</span>
                                                </div>
                                                <div class="sl-item">
                                                    <span class="lb">쿠폰({{ Number(state.salesHistory.coupon.count).toLocaleString() }}건)</span>
                                                    <span class="value"><span class="plus">{{ Number(state.salesHistory.coupon.price).toLocaleString() }}</span>원</span>
                                                </div>
                                                <div class="sl-item">
                                                    <span class="lb">상품권({{ Number(state.salesHistory.voucher.count).toLocaleString() }}건)</span>
                                                    <span class="value"><span class="plus">{{ Number(state.salesHistory.voucher.price).toLocaleString() }}</span>원</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="ui-sales-list-item">
                                            <div class="sl-head">
                                                <h4>환불 및 취소</h4>
                                            </div>
                                            <div class="sl-cont">
                                                <div class="sl-item">
                                                    <span class="lb">환불금액</span>
                                                    <span class="value"><span class="minus">{{ Number(state.salesHistory.refund.price).toLocaleString() }}</span>원</span>
                                                </div>
                                                <div class="sl-item">
                                                    <span class="lb">취소금액</span>
                                                    <span class="value"><span class="minus">{{ Number(state.salesHistory.cancel.price).toLocaleString() }}</span>원</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="ui-sales-list-total">
                                        <span class="lb">총매출</span>
                                        <strong class="value">{{ Number(state.salesHistory.totalPrice).toLocaleString() }}원</strong>
                                    </div>
                                </div>
                            </div>

                            <!-- 매출현황 - 매출통계 -->
                            <div class="ui-sales-chart wp-70">
                                <div class="ui-sales-chart-head">
                                    <h3>매출통계</h3>
                                    <span class="s-date">기준일 : 2023-09-18</span>
                                </div>
                                <div class="ui-sales-chart-cont">
                                    <div class="ui-radio-switch">
                                        <span class="radio">
                                            <input id="dateSalesSort1" name="dateSalesSortGroup" v-model="state.salesStatStandard" value="day" type="radio" @change="changeStatStandard">
                                            <label for="dateSalesSort1">일</label>
                                        </span>
                                        <span class="radio">
                                            <input id="dateSalesSort2" name="dateSalesSortGroup" v-model="state.salesStatStandard" value="month" type="radio" @change="changeStatStandard">
                                            <label for="dateSalesSort2">월</label>
                                        </span>
                                    </div>
                                    <div class="ui-chart">
                                        <!-- <div style="height: 260px; line-height: 260px; background-color: #f7f7f7; text-align: center;">바차트영역</div> -->
                                        <div class="ui-bar-chart">
                                            <div class="ui-bar-y">
                                                <strong class="unit">(천원)</strong>
                                                <ul class="ui-bar-y-unit">
                                                    <li>{{ formatNumberZero(Math.floor(state.salesStatMax * .8 / 1000).toLocaleString()) }}</li>
                                                    <li>{{ formatNumberZero(Math.floor(state.salesStatMax * .6 / 1000).toLocaleString()) }}</li>
                                                    <li>{{ formatNumberZero(Math.floor(state.salesStatMax * .4 / 1000).toLocaleString()) }}</li>
                                                    <li>{{ formatNumberZero(Math.floor(state.salesStatMax * .2 / 1000).toLocaleString()) }}</li>
                                                    <!-- <li>4,000</li>
                                                    <li>3,000</li>
                                                    <li>2,000</li>
                                                    <li>1,000</li> -->
                                                    <li>0</li>
                                                </ul>
                                            </div>
                                            <div class="ui-bar-x">
                                                <strong class="unit">({{ state.salesStatStandard === 'day' ? '일' : '월' }})</strong>
                                                <ul class="ui-bar-x-unit">
                                                    <li v-for="(item, index) in state.salesStat" :key="index">
                                                        <span class="bar" :style="`height: ${getStatHeight(item.price)}%;`">
                                                            <span class="bar-tooltip">
                                                                <span class="t-date">{{ dayJS(item.date).format('M월D일') }}</span>
                                                                <span class="t-count">{{ item.count }}건</span>
                                                                <strong class="t-sales-num">{{ Number(item.price).toLocaleString() }}원</strong>
                                                            </span>
                                                        </span>
                                                        <span class="x-value">{{ state.salesStatStandard === 'day' ? dayJS(item.date).format('D') : dayJS(item.date).format('M') }}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="ui-bar-g"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, onMounted, watch, computed, inject, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

import ChartPie from '@/components/chart/ChartPie.vue';
import ChartLine from '@/components/chart/ChartLine.vue';

export default {
    components: { ChartPie, ChartLine },
    setup() {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();
        const dayJS = inject('dayJS');

        const ChartPie = ref(null);
        const chartLine = ref(null);

        const state = reactive({
            username: '',
            userpass: '',
            userInfo: {},

            // SUMMARY(HEAD)
            
            // 계정승인 현황
            accountApproval: {},
            
            // 회원현황
            memberStat: {},
            // 활동 회원수 (Pie Chart)
            activityMemberStandard: 'day', // state 기준 ( day | month )
            chartPie: {
                label: [],
                datasets: [],
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        datalabels: {
                            formatter: (value) => {
                                return value;
                            }
                        }
                    }
                }
            },
            chartLine: {
                label: [],
                datasets: [],
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 30
                        }
                    },
                    
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            // position: 'left',
                            // title: {
                            //     display: false
                            // }
                            grid: {
                                drawOnChartArea: false
                            },
                            // scaleGrace: {
                            //     top: '30%',
                            //     bottom: 0
                            // },
                            grace: '50',
                            min: 0,
                            ticks: {
                                min: 0,
                                font: {
                                    family: 'KBFGText',
                                    size: 14,
                                    style: 'normal'
                                },
                                beginAtZero: true,
                                callback: (value, index, ticks) => {
                                    // console.log('test', ticks);
                                    return (index === ticks.length - 1) ? '(명)' : value;
                                }
                            }
                        },
                        x: {
                            grid: {
                                drawOnChartArea: false
                            },
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    family: 'KBFGText',
                                    size: 14,
                                    style: 'normal'
                                }
                                // callback: (value, index, ticks) => {
                                //     console.log('test', value, index, ticks);
                                //     return (index === ticks.length - 1) ? '(일)' : value;
                                // }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // 범례 표시
                        },
                        datalabels: {
                            formatter: (value) => {
                                return '';
                            }
                        }
                    }
                }
            },
            chartList: [],
            
            // 매출현황
            // 매출현황 - 매출내역 (temp)
            salesHistory: {
                date: '',
                totalPrice: '',

                card: {}, // 카드
                cash: {}, // 현금
                point: {}, // 포인트
                coupon: {}, // 쿠폰
                voucher: {}, // 상품권

                refund: {}, // 환불
                cancel: {} // 취소
            },
            // 매출현황 - 매출통계 (temp)
            salesStat: [],
            salesStatMax: '',
            salesStatStandard: 'day' // state 기준 ( day | month )
        });
        
        watch(route, () => {
            console.log(route);
        });

        onMounted(() => {
            state.userInfo = JSON.parse(localStorage.getItem('USERINFO'));
            headSticky();

            getActivityMember();
            getMonthActivityMember();

            getAccountApproval(); // 계정승인 현황
            getSalesStat(); // 매출통계
            getSalesHistory(); // 매출내역
        });

        const headSticky = () => {
            const adminScroller = document.querySelector('#adminContainer .contents');
            const summary = document.querySelector('.ui-dashboard-summary');
            const summaryOffset = summary.getBoundingClientRect().top;
            adminScroller.addEventListener('scroll', () => {
                // console.log(adminScroller.scrollTop, summaryOffset);
                (adminScroller.scrollTop >= summaryOffset) ? summary.classList.add('sticky') : summary.classList.remove('sticky');
            });
        };

        /**
         * @chart
         */
        // const chartInit = () => {
        //     // 
        // };

        /**
         * @changeActivityMemberStandard
         */
        const changeActivityMemberStandard = () => {
            getMonthActivityMember();
        };

        /**
         * @get pie chart data ( 활동 회원수 )
         */
        const getActivityMember = () => {
            try {
                const params = {};
                const response = { // temp
                    labels: ['최근 30일 활동 회원수', '전체 가입자수'],
                    data: [300, 800]
                };

                state.chartPie.label = response.labels;
                state.chartPie.datasets = [response];
                ChartPie.value.chartResize();
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @get line chart data ( 월 활동 회원수 )
         * @type day | month
         */
        const getMonthActivityMember = () => {
            try {
                const params = {};
                let response = null; // temp
                if (state.activityMemberStandard === 'month') {
                    response = [ // temp
                        {xAxis: '2023-10', yAxis: [{pnt_tot: '0', pnt_mbr: '0', rem_cnt: '0', pnt_rat: '0.00'}]},
                        {xAxis: '2023-11', yAxis: [{pnt_tot: '150', pnt_mbr: '1', rem_cnt: '13', pnt_rat: '7.69'}]},
                        {xAxis: '2023-12', yAxis: [{pnt_tot: '150', pnt_mbr: '1', rem_cnt: '13', pnt_rat: '7.69'}]},
                        {xAxis: '2024-01', yAxis: [{pnt_tot: '150', pnt_mbr: '1', rem_cnt: '13', pnt_rat: '7.69'}]}
                    ];
                } else {
                    response = [ // temp
                        {xAxis: '2023-12-03', yAxis: [{pnt_tot: '0', pnt_mbr: '0', rem_cnt: '0', pnt_rat: '0.00'}]},
                        {xAxis: '2023-12-04', yAxis: [{pnt_tot: '150', pnt_mbr: '1', rem_cnt: '13', pnt_rat: '7.69'}]},
                        {xAxis: '2023-12-05', yAxis: [{pnt_tot: '150', pnt_mbr: '1', rem_cnt: '13', pnt_rat: '7.69'}]}
                    ];
                }
                state.chartLine.label = response.map(d => d.xAxis);
                state.chartLine.datasets = [{
                    data: response.map(item => item.yAxis[0].pnt_tot),
                    type: 'line'
                }];
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @get accountApproval 계정승인현황 조회
         */
        const getAccountApproval = () => {
            try {
                const params = {
                    // 
                };
                const response = [
                    { name: 'Payer', in: '10', out: '1' },
                    { name: 'Seller', in: '1', out: '1' },
                    { name: 'Medical', in: '0', out: '0' },
                    { name: 'Developer', in: '0', out: '1' }
                ];
                state.accountApproval = response;

            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @get salesHistory
         */
        const getSalesHistory = () => {
            try {
                const params = {
                    // 
                };
                const response = {
                    'date': '2024-01-01',
                    'totalPrice': '105900000',
                    
                    'card': { count: '1234', price: '8009120' }, // 카드
                    'cash': { count: '1234', price: '1976120' }, // 현금
                    'point': { count: '1234', price: '501061' }, // 포인트
                    'coupon': { count: '1234', price: '320850' }, // 쿠폰
                    'voucher': { count: '1234', price: '855500' }, // 상품권
                    
                    'refund': { count: '1234', price: '498100' }, // 환불
                    'cancel': { count: '1234', price: '580360' } // 취소
                };
                state.salesHistory = response;

            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @get salesStat
         */
        const getSalesStat = () => {
            try {
                const params = {
                    // stat standard
                    standard: state.salesStatStandard
                };
                const response = state.salesStatStandard === 'day' ?
                    [ // day
                        { date: '2024-01-01', count: '87', price: '3536150' },
                        { date: '2024-01-02', count: '187', price: '1736150' },
                        { date: '2024-01-03', count: '47', price: '2536150' },
                        { date: '2024-01-04', count: '72', price: '836150' },
                        { date: '2024-01-05', count: '46', price: '2536150' },
                        { date: '2024-01-06', count: '12', price: '2236150' },
                        { date: '2024-01-07', count: '3', price: '3236150' },
                        { date: '2024-01-08', count: '17', price: '1536150' },
                        { date: '2024-01-09', count: '92', price: '536150' },
                        { date: '2024-01-10', count: '136', price: '1536150' },
                        { date: '2024-01-11', count: '87', price: '3536150' },
                        { date: '2024-01-12', count: '187', price: '1736150' },
                        { date: '2024-01-13', count: '47', price: '2536150' }
                    ] : [ // month
                        { date: '2024-01', count: '187', price: '135361520' },
                        { date: '2024-02', count: '387', price: '27361520' },
                        { date: '2024-03', count: '347', price: '65361520' },
                        { date: '2024-04', count: '272', price: '8361520' },
                        { date: '2024-05', count: '546', price: '53601520' },
                        { date: '2024-06', count: '312', price: '22361520' },
                        { date: '2024-07', count: '153', price: '32361520' },
                        { date: '2024-08', count: '217', price: '15361520' },
                        { date: '2024-09', count: '392', price: '15361520' },
                        { date: '2024-10', count: '336', price: '25361520' },
                        { date: '2024-11', count: '287', price: '115361520' },
                        { date: '2024-12', count: '487', price: '107361520' }
                    ];
                state.salesStat = response;
                state.salesStatMax = Math.max(...state.salesStat.map(d => d.price));
                console.log(state.salesStatMax);
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @changeStatStandard
         */
        const changeStatStandard = () => {
            getSalesStat();
        };

        /**
         * salesStat max 값 비율 height (%) 구하기
         * @max state.salesStatMax
         */
        const getStatHeight = (value) => {
            const percentage = (value / state.salesStatMax) * 100;
            return percentage;
        };

        /**
         * format number width zero
         * @toLocaleString 이후 첫번째 , 이후 자리 0 으로 변환
         */
        const formatNumberZero = (price) => {
            let formatNumber = price;
            const parts = price.split(',');
            if (parts.length > 1) {
                const firstPart = parts[1] > 100 ? Math.floor(parts[1] / 100) * 100 : '000'; // parts[1].padEnd(3, '0'); // Math.round(parts[1] / 100) * 100;
                formatNumber = `${parts[0]},${firstPart}`;
                // console.log(price, parts[1], parts[1].padEnd(1, '0'));
            }
            return formatNumber;
        };

        return {
            dayJS,
            state,
            ChartPie,

            changeActivityMemberStandard,
            getStatHeight,
            changeStatStandard,
            formatNumberZero
        };
    }
};
</script>