const customerMenu = [
    {
        path: '/cs_center/faq/list',
        name: 'faqlist',
        component: () => import('@/views/customer/FaqList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['고객센터관리', 'FAQ관리'],
            menuCode: '1008003'
        }
    },
    {
        path: '/cs_center/faq/detail',
        name: 'faqdetail',
        component: () => import('@/views/customer/FaqRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['고객센터관리', 'FAQ관리'],
            menuCode: '1008003'
        }
    },
    {
        path: '/cs_center/notice/list',
        name: 'noticelist',
        component: () => import('@/views/customer/NoticeList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['고객센터관리', '공지사항관리'],
            menuCode: '1008001'
        }
    },
    {
        path: '/cs_center/notice/detail',
        name: 'noticedetail',
        component: () => import('@/views/customer/NoticeRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['고객센터관리', '공지사항관리'],
            menuCode: '1008001'
        }
    },
    {
        path: '/cs_center/system_notice/list',
        name: 'systemnoticelist',
        component: () => import('@/views/customer/SystemNoticeList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['고객센터관리', '시스템공지팝업관리'],
            menuCode: '1008004'
        }
    },
    {
        path: '/cs_center/system_notice/detail',
        name: 'systemnoticedetail',
        component: () => import('@/views/customer/SystemNoticeDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['고객센터관리', '시스템공지팝업관리'],
            menuCode: '1008004'
        }
    },
    {
        path: '/cs_center/system_notice/register',
        name: 'systemnoticeregist',
        component: () => import('@/views/customer/SystemNoticeRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['고객센터관리', '시스템공지팝업관리'],
            menuCode: '1008004'
        }
    },
    {
        path: '/cs_center/qna/list',
        name: 'qnalist',
        component: () => import('@/views/customer/QnaList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['고객센터관리', '1:1문의 관리'],
            menuCode: '1008002'
        }
    },
    {
        path: '/cs_center/qna/detail',
        name: 'qnadetail',
        component: () => import('@/views/customer/QnaDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['고객센터관리', '1:1문의 상세'],
            menuCode: '1008002'
        }
    },
    {
        path: '/cs_center/qna/wire/register',
        name: 'qnawireregist',
        component: () => import('@/views/customer/QnaWireRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['고객센터관리', '유선문의 등록'],
            menuCode: '1008002'
        }
    },
    {
        path: '/cs_center/qna/wire/detail',
        name: 'qnawiredetail',
        component: () => import('@/views/customer/QnaWireRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['고객센터관리', '유선문의 상세'],
            menuCode: '1008002'
        }
    }
];
export default customerMenu;