const sellerMenu = [
    {
        path: '/seller/regist/list',
        name: 'sellermanage',
        component: () => import('@/views/seller/SellerManage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['셀러관리', '가입신청관리목록'],
            menuCode: '1025001'
        }
    },
    {
        path: '/sellermanagedetail',
        name: 'sellermanagedetail',
        component: () => import('@/views/seller/SellerManageDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['셀러관리', '가입신청관리상세'],
            menuCode: '1025001'
        }
    },
    {
        path: '/sellermanageregist',
        name: 'sellermanageregist',
        component: () => import('@/views/seller/SellerManageRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['셀러관리', '가입신청 정보입력'],
            menuCode: '1025001'
        }
    },
    {
        path: '/seller/info/list',
        name: 'sellerinfo',
        component: () => import('@/views/seller/SellerInfo.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['셀러관리', '셀러정보관리'],
            menuCode: '1025002'
        }
    },
    {
        path: '/sellerinfodetail',
        name: 'sellerdetail',
        component: () => import('@/views/seller/SellerInfoDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['셀러관리', '셀러정보관리'],
            menuCode: '1025002'
        }
    },
    {
        path: '/seller/ban/list',
        name: 'sellerout',
        component: () => import('@/views/seller/SellerOut.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['셀러관리', '탈퇴목록'],
            menuCode: '1025004'
        }
    },
    {
        path: '/selleroutdetail',
        name: 'selleroutdetail',
        component: () => import('@/views/seller/SellerOutDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['셀러관리', '탈퇴관리'],
            menuCode: '1025004'
        }
    },
    {
        path: '/seller/ban_request/list',
        name: 'selleroutlist',
        component: () => import('@/views/seller/SellerOutList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['셀러관리', '탈퇴신청'],
            menuCode: '1025003'
        }
    },
    {
        path: '/selleroutlistdetail',
        name: 'selleroutlistdetail',
        component: () => import('@/views/seller/SellerOutListDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['셀러관리', '탈퇴신청상세'],
            menuCode: '1025003'
        }
    }
];
export default sellerMenu;