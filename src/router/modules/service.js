const serviceMenu = [
    {
        path: '/service/todo/category',
        name: 'todoCategory',
        component: () => import('@/views/service/TodoCategory.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['서비스 이용관리', '투두관리', '카테고리관리'],
            menuCode: '1030003'
        }
    },
    {
        path: '/service/community/category',
        name: 'CommunityCategory',
        component: () => import('@/views/service/CommunityCategory.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['서비스 이용관리', '커뮤니티관리', '카테고리관리'],
            menuCode: '1030005'
        }
    },
    {
        path: '/service/community/tag',
        name: 'CommunityTag',
        component: () => import('@/views/service/CommunityTag.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['서비스 이용관리', '커뮤니티관리', '태그관리'],
            menuCode: '1030006'
        }
    },
    {
        path: '/service/community/recommend',
        name: 'CommunityRecommend',
        component: () => import('@/views/service/CommunityRecommend.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['서비스 이용관리', '커뮤니티관리', '추천태그관리'],
            menuCode: '1030007'
        }
    },
    {
        path: '/service/community/rcmdetail',
        name: 'CommunityRecommendDetail',
        component: () => import('@/views/service/CommunityRecommendDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['서비스 이용관리', '커뮤니티관리', '추천태그관리'],
            menuCode: '1030007'
        }
    }
];
export default serviceMenu;