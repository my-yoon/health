const indicatorMenu = [
    // 회원통계
    {
        path: '/stats/member/accum_join',
        name: 'cumulativesubscriber',
        component: () => import('@/views/indicator/CumulativeSubscriber.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '회원통계', '누적가입자'],
            menuCode: '1015002'
        }
    },
    {
        path: '/stats/member/accum_ban',
        name: 'cumulativewithdrawal',
        component: () => import('@/views/indicator/CumulativeWithdrawal.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '회원통계', '누적탈퇴자'],
            menuCode: '1015003'
        }
    },
    {
        path: '/stats/member/join_new',
        name: 'newsubscriber',
        component: () => import('@/views/indicator/NewSubscriber.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '회원통계', '신규가입자'],
            menuCode: '1015004'
        }
    },
    {
        path: '/stats/member/ban_new',
        name: 'newwithdrawal',
        component: () => import('@/views/indicator/NewWithdrawal.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '회원통계', '신규탈퇴자'],
            menuCode: '1015005'
        }
    },
    {
        path: '/stats/member/sex_age',
        name: 'genderagerange',
        component: () => import('@/views/indicator/GenderAgeRange.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '회원통계', '성별 및 연령대 분포'],
            menuCode: '1015007'
        }
    },

    // 서비스이용통계
    {
        path: '/stats/event_status',
        name: 'eventpresentsituation',
        component: () => import('@/views/indicator/EventPresentSituation.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '서비스이용통계', '이벤트진행 및 종료현황'],
            menuCode: '1015014'
        }
    },
    {
        path: '/stats/event/target_join_rate',
        name: 'eventtargetparticipation',
        component: () => import('@/views/indicator/EventTargetParticipation.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '서비스이용통계', '이벤트대상자 및 열람자참여율'],
            menuCode: '1015015'
        }
    },
    {
        path: '/stats/mau',
        name: 'mau',
        component: () => import('@/views/indicator/Mau.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '서비스이용통계', '이용현황-MAU'],
            menuCode: '1015008'
        }
    },
    {
        path: '/stats/wau',
        name: 'wau',
        component: () => import('@/views/indicator/Wau.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '서비스이용통계', '이용현황-WAU'],
            menuCode: '1015008'
        }
    },
    {
        path: '/stats/dau',
        name: 'dau',
        component: () => import('@/views/indicator/Dau.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '서비스이용통계', '이용현황-DAU'],
            menuCode: '1015008'
        }
    },
    {
        path: '/stats/survey/complete',
        name: 'serveyComplete',
        component: () => import('@/views/indicator/ServeyComplete.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '서비스이용통계', '설문완료분포'],
            menuCode: '1015008'
        }
    },

    // 건강정보통계
    {
        path: '/stats/life_log/smoking',
        name: 'smokingamount',
        component: () => import('@/views/indicator/SmokingAmount.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '건강정보통계', '흡연'],
            menuCode: '1015019'
        }
    },
    {
        path: '/stats/life_log/meal',
        name: 'mealamount',
        component: () => import('@/views/indicator/MealAmount.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '건강정보통계', '식사'],
            menuCode: '1015019'
        }
    },
    {
        path: '/stats/life_log/average_step_count',
        name: 'averagestepcount',
        component: () => import('@/views/indicator/AverageStepCount.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '건강정보통계', '평균 걸음수'],
            menuCode: '1015019'
        }
    },
    {
        path: '/stats/life_log/average_sleep_hours',
        name: 'averagesleephours',
        component: () => import('@/views/indicator/AverageSleepTime.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '건강정보통계', '평균 수면시간'],
            menuCode: '1015019'
        }
    },
    {
        path: '/stats/life_log/emotion',
        name: 'emotion',
        component: () => import('@/views/indicator/Feeling.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '건강정보통계', '감정'],
            menuCode: '1015019'
        }
    },
    {
        path: '/stats/life_log/average_body_composition',
        name: 'averagebodycomposition',
        component: () => import('@/views/indicator/AverageBodyComposition.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '건강정보통계', '평균 체성분'],
            menuCode: '1015019'
        }
    },
    {
        path: '/stats/life_log/drinking',
        name: 'drinking',
        component: () => import('@/views/indicator/Drinking.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '건강정보통계', '음주'],
            menuCode: '1015019'
        }
    },
    {
        path: '/stats/life_log/training',
        name: 'training',
        component: () => import('@/views/indicator/Exercise.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '건강정보통계', '운동'],
            menuCode: '1015019'
        }
    },
    {
        path: '/stats/life_log',
        name: 'lifelog',
        component: () => import('@/views/indicator/LifeLog.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '건강정보통계', '라이프로그'],
            menuCode: '1015020'
        }
    },
    {
        path: '/stats/contents/popular_news',
        name: 'popularnews',
        component: () => import('@/views/indicator/PopularNews.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '건강정보통계', '인기 건강뉴스 선호도'],
            menuCode: '1015019'
        }
    },
    {
        path: '/stats/contents/popular_challenge',
        name: 'popularchallenge',
        component: () => import('@/views/indicator/PopularChallenge.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '건강정보통계', '인기 챌린지 선호도'],
            menuCode: '1015019'
        }
    },

    // 파트너통계
    {
        path: '/stats/partner/join',
        name: 'partnerjoinapproval',
        component: () => import('@/views/indicator/PartnerJoinApproval.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '파트너통계', '파트너가입 및 승인'],
            menuCode: '1015033'
        }
    },
    {
        path: '/stats/partner/sub_account/create',
        name: 'partnersubaccountapproval',
        component: () => import('@/views/indicator/PartnerSubAccountApproval.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '파트너통계', '파트너 부계정 권한 승인'],
            menuCode: '1015033'
        }
    },

    // 포인트통계
    {
        path: '/stats/partner/point/acquire',
        name: 'rewardpointacqststatus',
        component: () => import('@/views/indicator/RewardPointAcqstStatus.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '포인트통계', '리워드포인트 지급완료 현황'],
            menuCode: '1015034'
        }
    },
    {
        path: '/stats/partner/point/pay_rule',
        name: 'rewardpointpaypolicy',
        component: () => import('@/views/indicator/RewardPointPayPolicy.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '포인트통계', '리워드포인트 지급 정책'],
            menuCode: '1015035'
        }
    },
    {
        path: '/stats/partner/point/acquire_category',
        name: 'rewardpointacqstcategory',
        component: () => import('@/views/indicator/RewardPointAcqstCategory.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '포인트통계', '리워드포인트 지급완료 카테고리'],
            menuCode: '1015036'
        }
    },

    {
        path: '/stats/partner/point/issue_pay',
        name: 'rewardpointissueexhaust',
        component: () => import('@/views/indicator/RewardPointIssueExhaust.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '포인트통계', '리워드포인트 지급완료 및 소진'],
            menuCode: '1015037'
        }
    },

    // VOC통계
    {
        path: '/stats/voc/settle',
        name: 'vocinquiryprocess',
        component: () => import('@/views/indicator/VocInquiryProcess.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', 'VOC통계', 'VOC처리현황'],
            menuCode: '1015040'
        }
    },
    {
        path: '/stats/voc/inquire_type',
        name: 'vocinquirytype',
        component: () => import('@/views/indicator/VocInquiryType.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', 'VOC통계', 'VOC문의유형'],
            menuCode: '1015041'
        }
    },
    {
        path: '/stats/voc/settle_company',
        name: 'vocinquirychargecompanytype',
        component: () => import('@/views/indicator/VocInquiryChargeCompanyType.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', 'VOC통계', 'VOC문의담당사'],
            menuCode: '1015042'
        }
    },
    {
        path: '/stats/voc/transfer_company',
        name: 'vocinquirytransfercompany',
        component: () => import('@/views/indicator/VocInquiryTransferCompany.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', 'VOC통계', 'VOC문의이관사'],
            menuCode: '1015043'
        }
    },

    // 모바일지표
    {
        path: '/stats/mobile/os',
        name: 'osdistribution',
        component: () => import('@/views/indicator/OsDistribution.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '모바일지표', '모바일OS분포'],
            menuCode: '1015045'
        }
    },
    {
        path: '/stats/mobile/device',
        name: 'devicedistribution',
        component: () => import('@/views/indicator/DeviceDistribution.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '모바일지표', '디바이스분포'],
            menuCode: '1015046'
        }
    },
    {
        path: '/stats/mobile/app_version',
        name: 'appVersion',
        component: () => import('@/views/indicator/AppVersion.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '모바일지표', '앱버전'],
            menuCode: '1015046'
        }
    },

    // 전환율통계
    {
        path: '/stats/mau_conversion_rate',
        name: 'mauConversionRate',
        component: () => import('@/views/indicator/MauConversionRate.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '전환율통계', 'MAU전환율'],
            menuCode: '1015016'
        }
    },
    {
        path: '/stats/mau_keep_rate',
        name: 'mauKeepRate',
        component: () => import('@/views/indicator/MauKeepRate.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['지표관리', '전환율통계', 'MAU유지율'],
            menuCode: '1015016'
        }
    }
];
export default indicatorMenu;