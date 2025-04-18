const dcsPnt = [
    {
        path: '/point/rule/list',
        name: 'dcspntplcymng',
        component: () => import('@/views/pntmng/DcsPntPlcyMng.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트정책', '포인트정책관리'],
            menucode: 1017001
        }
    },
    {
        path: '/dcspntplcyreg',
        name: 'dcspntplcyreg',
        component: () => import('@/views/pntmng/DcsPntPlcyReg.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트정책', '포인트정책관리'],
            menucode: 1017001
        }
    },
    {
        path: '/DcsPntPlcyDetail',
        name: 'DcsPntPlcyDetail',
        component: () => import('@/views/pntmng/DcsPntPlcyDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트정책', '포인트정책관리'],
            menucode: 1017001
        }
    },
    {
        path: '/dcspntplcymod',
        name: 'dcspntplcymod',
        component: () => import('@/views/pntmng/DcsPntPlcyReg.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트정책', '포인트정책관리'],
            menucode: 1017001
        }
    },
    {
        path: '/point/rule/approve/list',
        name: 'dcspntplcyaprv',
        component: () => import('@/views/pntmng/DcsPntPlcyAprv.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트정책', '포인트정책승인관리'],
            menucode: 1017003
        }
    },
    {
        path: '/dcspntplcyaprvdetail',
        name: 'dcspntplcyaprvdetail',
        component: () => import('@/views/pntmng/DcsPntPlcyAprvDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트정책', '포인트정책승인관리'],
            menucode: 1017003
        }
    },
    {
        path: '/point/rule/history',
        name: 'dcspntplcyhist',
        component: () => import('@/views/pntmng/DcsPntPlcyHist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트정책관리', '포인트정책이력'],
            menucode: 1017004
        }
    },
    {
        path: '/point/rule/history/stats',
        name: 'dcspntplcysts',
        component: () => import('@/views/pntmng/DcsPntPlcySts.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트정책관리', '포인트정책통계'],
            menucode: 1017005
        }
    },
    {
        path: '/point/publish/list',
        name: 'pntmnlissmng',
        component: () => import('@/views/pntmng/PntMnlIssMng.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트수동발급', '포인트수동발급관리'],
            menucode: 1017007
        }
    },
    {
        path: '/pntmnlissreg',
        name: 'pntmnlissreg',
        component: () => import('@/views/pntmng/PntMnlIssReg.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트수동발급', '포인트수동발급관리'],
            menucode: 1017007
        }
    },
    {
        path: '/pntmnlissdetail',
        name: 'pntmnlissdetail',
        component: () => import('@/views/pntmng/PntMnlIssDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트수동발급', '포인트수동발급관리'],
            menucode: 1017007
        }
    },
    {
        path: '/pntmnlissmod',
        name: 'pntmnlissmod',
        component: () => import('@/views/pntmng/PntMnlIssReg.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트수동발급', '포인트수동발급관리'],
            menucode: 1017007
        }
    },
    {
        path: '/point/publish/approve/list',
        name: 'pntissaprv',
        component: () => import('@/views/pntmng/PntIssAprv.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트수동발급', '포인트발급승인관리'],
            menucode: 1017008
        }
    },
    {
        path: '/pntissaprvdetail',
        name: 'pntissaprvdetail',
        component: () => import('@/views/pntmng/PntIssAprvDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트수동발급', '포인트발급승인관리'],
            menucode: 1017008
        }
    },
    {
        path: '/point/publish/history',
        name: 'isshistmng',
        component: () => import('@/views/pntmng/IssHistMng.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트내역관리', '발급내역'],
            menucode: 1017010
        }
    },
    {
        path: '/point/publish/cancel/list',
        name: 'isscancelmng',
        component: () => import('@/views/pntmng/IssCancelMng.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['포인트관리', '포인트내역관리', '발급취소관리'],
            menucode: 1017011
        }
    }
];
export default dcsPnt;