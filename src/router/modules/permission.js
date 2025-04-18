const permission = [
    {
        path: '/authority/kb_admin/menus',
        name: 'kbadminmenu',
        component: () => import('@/views/permission/KBAdminMenu.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['권한관리', 'KB어드민 메뉴권한관리'],
            menuCode: '1005001'
        }
    },
    {
        path: '/authority/partner_admin/menus',
        name: 'partnernmenu',
        component: () => import('@/views/permission/PartnerMenu.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['권한관리', '파트너어드민 메뉴권한관리'],
            menuCode: '1005002'
        }
    }
];
export default permission;