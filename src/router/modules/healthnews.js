const healthnews = [
    {
        path: '/service/health_news/contents/list',
        name: 'hnCtntsMng',
        component: () => import('@/views/healthnews/HnCtntsMng.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['서비스 이용관리', '건강뉴스', '콘텐츠 목록 관리'],
            menuCode: '1012001'
        }
    },
    {
        path: '/service/health_news/contents/detail',
        name: 'hnCtntsDetail',
        component: () => import('@/views/healthnews/HnCtntsDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['서비스 이용관리', '건강뉴스', '콘텐츠 목록 관리', '콘텐츠 상세'],
            menuCode: '1012001'
        }
    },
    {
        path: '/service/health_news/depth_1',
        name: 'hnMjcsMng',
        component: () => import('@/views/healthnews/HnMjcsMng.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['서비스 이용관리', '건강뉴스', '대분류 관리'],
            menuCode: '1012001'
        }
    },
    {
        path: '/service/health_news/depth_2',
        name: 'hnMdcsMng',
        component: () => import('@/views/healthnews/HnMdcsMng.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['서비스 이용관리', '건강뉴스', '중분류 관리'],
            menuCode: '1012001'
        }
    },
    {
        path: '/service/health_news/depth_3',
        name: 'hnMncsMng',
        component: () => import('@/views/healthnews/HnMncsMng.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['서비스 이용관리', '건강뉴스', '소분류 관리'],
            menuCode: '1012001'
        }
    }
];
export default healthnews;