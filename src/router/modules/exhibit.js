const exhibitMenu = [
    {
        path: '/display/banner/list',
        name: 'bannerlist',
        component: () => import('@/views/exhibit/BannerList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['전시관리', '배너관리'],
            menuCode: '1014001'
        }
    },
    {
        path: '/display/banner/detail',
        name: 'bannerdetail',
        component: () => import('@/views/exhibit/BannerDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['전시관리', '배너관리'],
            menuCode: '1014001'
        }
    },
    {
        path: '/display/banner/regist',
        name: 'bannerregist',
        component: () => import('@/views/exhibit/BannerRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['전시관리', '배너관리'],
            menuCode: '1014001'
        }
    },
    {
        path: '/display/popup/list',
        name: 'popuplist',
        component: () => import('@/views/exhibit/PopupList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['전시관리', '팝업관리'],
            menuCode: '1014002'
        }
    },
    {
        path: '/display/popup/detail',
        name: 'popupdetail',
        component: () => import('@/views/exhibit/PopupDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['전시관리', '팝업관리'],
            menuCode: '1014002'
        }
    },
    {
        path: '/display/popup/regist',
        name: 'popupregist',
        component: () => import('@/views/exhibit/PopupRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['전시관리', '팝업관리'],
            menuCode: '1014002'
        }
    },
    {
        path: '/display/main/list',
        name: 'mainlist',
        component: () => import('@/views/exhibit/MainList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['전시관리', '메인관리'],
            menuCode: '1014004'
        }
    },
    {
        path: '/display/main/detail',
        name: 'maindetail',
        component: () => import('@/views/exhibit/MainDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['전시관리', '메인관리'],
            menuCode: '1014004'
        }
    },
    {
        path: '/display/main/reg',
        name: 'mainreg',
        component: () => import('@/views/exhibit/MainRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['전시관리', '메인관리'],
            menuCode: '1014004'
        }
    }

];
export default exhibitMenu;