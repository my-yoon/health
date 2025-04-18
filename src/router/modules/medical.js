const medicalMenu = [
    {
        path: '/medical/regist/list',
        name: 'medicalmanage',
        component: () => import('@/views/medical/MedicalManage.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['메디컬관리', '가입신청관리목록'],
            menuCode: '1026001'
        }
    },
    {
        path: '/medicalmanagedetail',
        name: 'medicalmanagedetail',
        component: () => import('@/views/medical/MedicalManageDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['메디컬관리', '가입신청관리목록'],
            menuCode: '1026001'
        }
    },
    {
        path: '/medicalmanagereg',
        name: 'medicalmanagereg',
        component: () => import('@/views/medical/MedicalManageRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['메디컬관리', '가입신청관리목록'],
            menuCode: '1026001'
        }
    },
    {
        path: '/medical/info/list',
        name: 'medicalinfo',
        component: () => import('@/views/medical/MedicalInfo.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['메디컬관리', '메디컬정보관리'],
            menuCode: '1026002'
        }
    },
    {
        path: '/medicalinfodetail',
        name: 'medicalinfodetail',
        component: () => import('@/views/medical/MedicalInfoDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['메디컬관리', '메디컬정보관리'],
            menuCode: '1026002'
        }
    },
    {
        path: '/medical/ban_request/list',
        name: 'medicaloutrequest',
        component: () => import('@/views/medical/MedicalOutRequest.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['메디컬관리', '메디컬탈퇴신청관리'],
            menuCode: '1026003'
        }
    },
    {
        path: '/medicaloutrequestdetail',
        name: 'medicaloutrequestdetail',
        component: () => import('@/views/medical/MedicalOutRequestDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['메디컬관리', '메디컬탈퇴신청관리'],
            menuCode: '1026003'
        }
    },
    {
        path: '/medical/ban/list',
        name: 'medicaloutlist',
        component: () => import('@/views/medical/MedicalOutlist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['메디컬관리', '탈퇴메디컬관리'],
            menuCode: '1026004'
        }
    },
    {
        path: '/medicaloutdetail',
        name: 'medicaloutdetail',
        component: () => import('@/views/medical/MedicalOutDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['메디컬관리', '탈퇴메디컬관리'],
            menuCode: '1026004'
        }
    }
];
export default medicalMenu;