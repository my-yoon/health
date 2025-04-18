const content = [

    {
        path: '/',
        name: 'Popup',
        component: () => import('@/layout/Popup.vue'),
        children: [
            {
                path: '/memberinfo_new',
                name: 'memberinfo_new',
                component: () => import('@/views/membermanage/MemberInfo.vue')
            },
            {
                path: '/messagelist_new',
                name: 'messagelist_new',
                component: () => import('@/views/standard/MessageList.vue')
            },
            {
                path: '/sttlBstd_new',
                name: 'sttlBstd_new',
                component: () => import('@/views/sttl/SttlBstd.vue')
            },
            {
                path: '/sttlBstdMeta_new',
                name: 'sttlBstdMeta_new',
                component: () => import('@/views/sttl/SttlBstdMeta.vue')
            },
            {
                path: '/sttlBstdDtl_new',
                name: 'sttlBstdDtl_new',
                component: () => import('@/views/sttl/SttlBstdDtl.vue')
            }
        ]
    }
];
export default content;