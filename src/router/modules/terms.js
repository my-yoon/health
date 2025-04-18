const terms = [
    { // 약관그룹관리
        path: '/policy/group/list',
        name: 'termsgroup',
        component: () => import('@/views/terms/TermsGroup.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['약관관리', '약관그룹관리'],
            menuCode: '1006001'
        }
    },
    { // 약관유형 목록
        path: '/policy/type/list',
        name: 'termstype',
        component: () => import('@/views/terms/TermsType.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['약관관리', '약관유형관리'],
            menuCode: '1006002'
        }
    },
    { // 약관유형 등록
        path: '/policy/type/register',
        name: 'createtermstype',
        component: () => import('@/views/terms/CreateTermsType.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['약관관리', '약관유형관리'],
            menuCode: '1006002'
        }
    },
    { // 약관관리 목록
        path: '/policy/list',
        name: 'terms',
        component: () => import('@/views/terms/Terms.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['약관관리', '약관관리'],
            menuCode: '1006003'
        }
    },
    { // 약관관리 등록
        path: '/policy/register',
        name: 'createterms',
        component: () => import('@/views/terms/CreateTerms.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['약관관리', '약관관리'],
            menuCode: '1006003'
        }
    },
    { // 영역별약관관리
        path: '/policy/domain/list',
        name: 'termsarea',
        component: () => import('@/views/terms/TermsArea.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['약관관리', '영역별약관관리'],
            menuCode: '1006004'
        }
    },
    { // 영역별약관관리 등록
        path: '/policy/domain/register',
        name: 'createtermsarea',
        component: () => import('@/views/terms/CreateTermsArea.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['약관관리', '영역별약관관리'],
            menuCode: '1006004'
        }
    }
];
export default terms;