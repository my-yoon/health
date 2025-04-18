const membermanage = [
    {
        path: '/member/list',
        name: 'memberinfo',
        component: () => import('@/views/membermanage/MemberManage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['회원관리', '회원정보관리'],
            menuCode: '1002001'
        }
    },
    {
        path: '/member/detail',
        name: 'memberinfodetail',
        component: () => import('@/views/membermanage/MemberManageDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['회원관리', '회원정보관리'],
            menuCode: '1002001'
        }
    },
    {
        path: '/member/fault/list',
        name: 'memberfault',
        component: () => import('@/views/membermanage/MemberFault.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['회원관리', '불량회원관리'],
            menuCode: '1002002'
        }
    },
    {
        path: '/member/fault/detail',
        name: 'memberfaultdetail',
        component: () => import('@/views/membermanage/MemberFaultDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['회원관리', '불량회원관리'],
            menuCode: '1002002'
        }
    },
    {
        path: '/member/ban/list',
        name: 'memberoutlist',
        component: () => import('@/views/membermanage/MemberOutList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['회원관리', '탈퇴회원관리'],
            menuCode: '1002003'
        }
    },
    {
        path: '/member/health_info/list',
        name: 'memberhealtlist',
        component: () => import('@/views/membermanage/MemberManageHealth.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['회원관리', '건강정보관리'],
            menuCode: '1002004'
        }
    },
    {
        path: '/member/health_info/detail',
        name: 'memberhealtdetail',
        component: () => import('@/views/membermanage/MemberManageHealthDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['회원관리', '건강정보관리'],
            menuCode: '1002004'
        }
    },
    {
        path: '/member/ban/detail',
        name: 'memberoutdetail',
        component: () => import('@/views/membermanage/MemberOutDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['회원관리', '탈퇴회원관리'],
            menuCode: '1002003'
        }
    },
    {
        path: '/membershiplist',
        name: 'membershiplist',
        component: () => import('@/views/membermanage/MemberInfo.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['회원관리', '회원정보관리', '자격상실명단관리'],
            menuCode: ''
        }
    },
    {
        path: '/membershiplist1',
        name: 'membershiplist1',
        component: () => import('@/views/membermanage/Memberdisable.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['회원관리', '휴먼회원관리', '자격상실명단관리1'],
            menuCode: ''
        }
    }
];
export default membermanage;