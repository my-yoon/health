const sttlMenu = [
    {
        path: '/settlement/basic/standard',
        name: 'sttlBstd',
        component: () => import('@/views/sttl/SttlBstdPage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '기준정보관리', '기준정보관리'],
            menuCode: '1021003'
        }
    },
    {
        path: '/settlement/basic/meta',
        name: 'sttlBstdMeta',
        component: () => import('@/views/sttl/SttlBstdMetaPage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '기준정보관리', '메타관리'],
            menuCode: '1021002'
        }
    },
    {
        path: '/settlement/basic/detail',
        name: 'sttlBstdDtl',
        component: () => import('@/views/sttl/SttlBstdDtlPage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '기준정보관리', '상세관리'],
            menuCode: '1021004'
        }
    },
    {
        path: '/settlement/basic/calendar',
        name: 'sttlBstdDtlCal',
        component: () => import('@/views/sttl/SttlBstdDtlCalPage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '기준정보관리', '캘린더관리'],
            menuCode: '1021005'
        }
    },
    {
        path: '/settlement/basic/journalizing',
        name: 'sttlBstdDtlJnlz',
        component: () => import('@/views/sttl/SttlBstdDtlJnlzNew.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '기준정보관리', '분개모델관리'],
            menuCode: '1021006'
        }
    },
    {
        path: '/settlement/basic/batch_execution',
        name: 'sttlBatchExcution',
        component: () => import('@/views/sttl/SttlBatchExcution.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '기준정보관리', '배치실행내역'],
            menuCode: '1021018'
        }
    },
    {
        path: '/settlement/basic/calc_interface',
        name: 'SttlCalcInterface',
        component: () => import('@/views/sttl/SttlCalcInterface.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '기준정보관리', '정산인터페이스내역'],
            menuCode: '1021019'
        }
    },
    {
        path: '/settlement/daily/commerce',
        name: 'SttlDayCommerce',
        component: () => import('@/views/sttl/SttlDayCommerce.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '일별관리', '커머스집계'],
            menuCode: '1021008'
        }
    },
    {
        path: '/settlement/daily/card',
        name: 'SttlDayCard',
        component: () => import('@/views/sttl/SttlDayCard.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '일별관리', '카드집계'],
            menuCode: '1021017'
        }
    },
    {
        path: '/settlement/daily/pg',
        name: 'SttlDayPg',
        component: () => import('@/views/sttl/SttlDayPg.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '일별관리', 'PG대사'],
            menuCode: '1021020'
        }
    },
    {
        path: '/settlement/daily/accounting',
        name: 'SttlDayAccounting',
        component: () => import('@/views/sttl/SttlDayAccounting.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '일별관리', '일별회계처리내역'],
            menuCode: '1021009'
        }
    },
    {
        path: '/settlement/daily/slip',
        name: 'sttlDaySlip',
        component: () => import('@/views/sttl/SttlDaySlip.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '일별관리', '일별전표내역조회'],
            menuCode: '1021010'
        }
    },
    {
        path: '/settlement/monthly/counting',
        name: 'sttlMonthlyCounting',
        component: () => import('@/views/sttl/SttlMonthlyCounting.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '월별관리', '통합집계표'],
            menuCode: '1021012'
        }
    },
    {
        path: '/settlement/monthly/sales',
        name: 'sttlMonthlySales',
        component: () => import('@/views/sttl/SttlMonthlySales.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '월별관리', '통합매출원장'],
            menuCode: '1021013'
        }
    },
    {
        path: '/settlement/monthly/buy',
        name: 'sttlMonthlyBuy',
        component: () => import('@/views/sttl/SttlMonthlyBuy.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '월별관리', '통합매입원장'],
            menuCode: '1021014'
        }
    },
    {
        path: '/settlement/monthly/accounting',
        name: 'sttlMonthlyAccounting',
        component: () => import('@/views/sttl/SttlMonthlyAccounting.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '월별관리', '월별회계처리내역'],
            menuCode: '1021015'
        }
    },
    {
        path: '/settlement/monthly/bill',
        name: 'sttlMonthlyBill',
        component: () => import('@/views/sttl/SttlMonthlyBill.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '월별관리', '청구서관리'],
            menuCode: '1021021'
        }
    },
    {
        path: '/settlement/monthly/slip',
        name: 'sttlMonthlySlip',
        component: () => import('@/views/sttl/SttlMonthlySlip.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['통합정산', '월별관리', '월별전표내역조회'],
            menuCode: '1021016'
        }
    }
];
export default sttlMenu;