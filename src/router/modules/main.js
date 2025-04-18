const main = [
    {
        path: '/main',
        name: 'mainpage',
        component: () => import('@/views/main/Main.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['main']
        }
    },
    {
        path: '/account/manage',
        name: 'mainmaster',
        component: () => import('@/views/main/MainMaster.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['계정정보 관리'],
            menuCode: '1001001'
        }
    },
    {
        path: '/account/manage/manager',
        name: 'mainmanager',
        component: () => import('@/views/main/MainManager.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['계정정보 관리'],
            menuCode: '1001002'
        }
    },
    {
        path: 'account/manage/associate-manager',
        name: 'mainassmaster',
        component: () => import('@/views/main/MainassManager.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['계정정보 관리'],
            menuCode: '1001003'
        }
    },
    {
        path: 'main/master',
        name: 'maindashboardmaster',
        component: () => import('@/views/main/DashboardMaster.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['main - master']
        }
    },
    {
        path: 'main/seller',
        name: 'maindashboardseller',
        component: () => import('@/views/main/DashboardSeller.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['main - seller']
        }
    }
];
export default main;