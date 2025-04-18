const log = [
    { // 사용자접속로그 로그
        path: '/logs/user/login',
        name: 'access',
        component: () => import('@/views/log/AccessLog.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['로그관리', '로그인/로그아웃 이력관리'],
            menuCode: '1016001'
        }
    },
    { // 사용자행위 로그
        path: '/logs/user/transactions',
        name: 'action',
        component: () => import('@/views/log/ActionLog.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['로그관리', '개인정보조회이력'],
            menuCode: '1016002'
        }
    },
    { // 사용자다운로드 로그
        path: '/logs/user/download',
        name: 'downloalog',
        component: () => import('@/views/log/DownloadLog.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['로그관리', '사용자다운로드로그'],
            menuCode: '1016003'
        }
    },
    { // 관리자권한변경 로그
        path: '/logs/admin/change_auth',
        name: 'authchange',
        component: () => import('@/views/log/AuthChangeLog.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['로그관리', '관리자권한변경로그'],
            menuCode: '1016004'
        }
    }

];
export default log;