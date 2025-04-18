const developerMenu = [
    {
        path: '/developer/regist/list',
        name: 'developremanage',
        component: () => import('@/views/developer/DeveloperManage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['개발자관리', '가입신청관리목록'],
            menuCode: '1027001'
        }
    },
    {
        path: '/developermanagedetail',
        name: 'developremanagedetail',
        component: () => import('@/views/developer/DeveloperManageDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['개발자관리', '가입신청관리목록'],
            menuCode: '1027001'
        }
    },
    {
        path: '/developermanagereg',
        name: 'developermanagereg',


        component: () => import('@/views/developer/DeveloperManageRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['개발자관리', '가입신청관리목록'],
            menuCode: '1027001'
        }
    },
    {
        path: '/developer/info/list',
        name: 'developerinfo',
        component: () => import('@/views/developer/DeveloperInfo.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['개발자관리', '개발자정보관리'],
            menuCode: '1027002'
        }
    },
    {
        path: '/developerinfodetail',
        name: 'developerinfodetail',
        component: () => import('@/views/developer/DeveloperInfoDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['개발자관리', '개발자정보관리'],
            menuCode: '1027002'
        }
    },
    {
        path: '/developer/ban_request/list',
        name: 'developeroutrequest',
        component: () => import('@/views/developer/DeveloperOutRequest.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['개발자관리', '개발자탈퇴신청관리'],
            menuCode: '1027003'
        }
    },
    {
        path: '/developeroutrequestdetail',
        name: 'developeroutrequestdetail',
        component: () => import('@/views/developer/DeveloperOutRequestDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['개발자관리', '개발자탈퇴신청관리'],
            menuCode: '1027003'
        }
    },
    {
        path: '/developer/ban/list',
        name: 'developeroutlist',
        component: () => import('@/views/developer/DeveloperOutLIst.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['개발자관리', '탈퇴개발자관리'],
            menuCode: '1027004'
        }
    },
    {
        path: '/developeroutdetail',
        name: 'developeroutdetail',
        component: () => import('@/views/developer/DeveloperOutDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['개발자관리', '탈퇴개발자관리'],
            menuCode: '1027004'
        }
    }
];
export default developerMenu;