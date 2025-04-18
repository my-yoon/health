const operate = [
    {
        path: '/alarm/message/list',
        name: 'messagemanage',
        component: () => import('@/views/operate/MessageManage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['운영관리', '고객알림', '메세지관리'],
            menuCode: '1010002'
        }
    },
    {
        path: '/alarm/message/register',
        name: 'messageregist',
        component: () => import('@/views/operate/MessageRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['운영관리', '고객알림', '메세지 등록'],
            menuCode: '1010002'
        }
    },
    {
        path: '/alarm/message/detail',
        name: 'messagedetail',
        component: () => import('@/views/operate/MessageDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['운영관리', '고객알림', '메세지 상세'],
            menuCode: '1010002'
        }
    },
    {
        path: '/alarm/message/template/list',
        name: 'messagetemplatemanage',
        component: () => import('@/views/operate/MessageTemplateManage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['운영관리', '고객알림', '메세지 템플릿 관리'],
            menuCode: '1010004'
        }
    },
    {
        path: '/alarm/message/template/register',
        name: 'messagetemplateregist',
        component: () => import('@/views/operate/MessageTemplateRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['운영관리', '고객알림', '메세지 템플릿 등록'],
            menuCode: '1010004'
        }
    },
    {
        path: '/alarm/message/template/detail',
        name: 'messagetemplatedetail',
        component: () => import('@/views/operate/MessageTemplateDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['운영관리', '고객알림', '메세지 템플릿 상세'],
            menuCode: '1010004'
        }
    },
    {
        path: '/ban_words',
        name: 'bankeywordmanage',
        component: () => import('@/views/operate/BanKeyWordManage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['운영관리', '금지어 관리'],
            menuCode: '1010005'
        }
    },
    {
        path: '/keywords/stats',
        name: 'recommendkeywordmanage',
        component: () => import('@/views/operate/RecommendKeyWordManage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['운영관리', '추천키워드 관리', '추천키워드 관리'],
            menuCode: '1010006'
        }
    },
    {
        path: '/keywords',
        name: 'recommendkeywordstats',
        component: () => import('@/views/operate/RecommendKeyWordStats.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['운영관리', '추천키워드 관리', '추천키워드 통계'],
            menuCode: '1010006'
        }
    }

];
export default operate;