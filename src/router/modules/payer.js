const payerMenu = [
    {
        path: '/payer/regist/list',
        name: 'payermanage',
        component: () => import('@/views/payer/PayerManage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['페이어관리', '가입신청관리목록'],
            menuCode: '1024001'
        }
    },
    {
        path: '/payermanagedetail',
        name: 'payermanagedetail',
        component: () => import('@/views/payer/PayerManageDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['페이어관리', '가입신청관리상세'],
            menuCode: '1024001'
        }
    },
    {
        path: '/payermanageregist',
        name: 'payermanageregist',
        component: () => import('@/views/payer/PayerManageRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['페이어관리', '가입신청 정보입력'],
            menuCode: '1024001'
        }
    },
    {
        path: '/payer/info/list',
        name: 'payerinfolist',
        component: () => import('@/views/payer/PayerInfo.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['페이어관리', '페이어정보관리'],
            menuCode: '1024002'
        }
    },
    {
        path: '/payer/ban_request/list',
        name: 'payeroutlist',
        component: () => import('@/views/payer/PayerOutList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['페이어관리', '페이어탈퇴신청관리'],
            menuCode: '1024003'
        }
    },
    {
        path: '/payeroutlistdetail',
        name: 'payeroutlistdetail',
        component: () => import('@/views/payer/PayerOutListDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['페이어관리', '페이어탈퇴신청관리'],
            menuCode: '1024003'
        }
    },
    {
        path: '/payer/ban/list',
        name: 'payerout',
        component: () => import('@/views/payer/PayerOut.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['페이어관리', '페이어탈퇴관리'],
            menuCode: '1024004'
        }
    },
    {
        path: '/payeroutdetail',
        name: '/payeroutdetail',
        component: () => import('@/views/payer/PayerOutDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['페이어관리', '페이어탈퇴관리'],
            menuCode: '1024004'
        }
    }
];
export default payerMenu;