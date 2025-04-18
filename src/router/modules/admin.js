const adminmanage = [
    {
        path: '/member/kb_admin/list',
        name: 'adminmanage',
        component: () => import('@/views/admin/AdminManage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['어드민회원관리', 'KB어드민'],
            menuCode: '1004001'
        }
    },
    {
        path: '/member/kb_admin/detail',
        name: 'admindetail',
        component: () => import('@/views/admin/AdminDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['어드민회원관리', 'KB어드민'],
            menuCode: '1004001'
        }
    },
    {
        path: '/member/kb_admin/register',
        name: 'adminregist',
        component: () => import('@/views/admin/AdminRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['어드민회원관리', 'KB어드민'],
            menuCode: '1004001'
        }
    },
    {
        path: '/member/partner_sub/list',
        name: 'partnermanage',
        component: () => import('@/views/admin/PartnerManage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['어드민회원관리', '파트너부계정관리']
        }
    },
    {
        path: '/member/partner/sub_account/detail',
        name: 'partnerdetail',
        component: () => import('@/views/admin/PartnerDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['어드민회원관리', '파트너부계정관리']
        }
    },
    {
        path: '/member/partner/sub_account/register',
        name: 'partnerregist',
        component: () => import('@/views/admin/PartnerRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['어드민회원관리', '파트너부계정관리']
        }
    },
    {
        path: '/member/md_seller/list',
        name: 'mdsellerlist',
        component: () => import('@/views/admin/MdSellerList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['어드민회원관리', 'MD별셀러현황']
        }
    }
];
export default adminmanage;