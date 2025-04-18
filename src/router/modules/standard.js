const standardMenu = [
    {
        path: '/standard/commoncode/list',
        name: 'standardcode',
        component: () => import('@/views/standard/StandardCode.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['기준관리', '공통코드관리', '공통코드관리'],
            menuCode: '1007001'
        }
    },
    {
        path: '/standard/commoncode/register',
        name: 'standardcoderegist',
        component: () => import('@/views/standard/StandardCodeRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['기준관리', '공통코드관리', '공통코드등록/수정'],
            menuCode: '1007001'
        }
    },
    {
        path: '/standard/message/list',
        name: 'messagelist',
        component: () => import('@/views/standard/MessageList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['기준관리', '메세지관리', '메세지관리'],
            menuCode: '1007003'
        }
    },
    {
        path: '/standard/menu/mgmt',
        name: 'menu',
        component: () => import('@/views/standard/Menu.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['기준관리', '메뉴관리'],
            menuCode: '1007002'
        }
    }
];
export default standardMenu;