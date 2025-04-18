import { createRouter, createWebHistory } from 'vue-router';
import membermanage from '@/router/modules/membermanage.js';
import pntmng from '@/router/modules/pntmng.js';
import main from '@/router/modules/main.js';
import content from '@/router/modules/content.js';
import payMenu from '@/router/modules/payer.js';
import medicalMenu from '@/router/modules/medical.js';
import adminmanage from '@/router/modules/admin.js';
import sellerMenu from '@/router/modules/seller.js';
import developerMenu from '@/router/modules/developer.js';
import healthnews from '@/router/modules/healthnews.js';
import standardMenu from '@/router/modules/standard.js';
import sttlMenu from '@/router/modules/sttl.js';
import customerMenu from '@/router/modules/customer.js';
import indicatorMenu from '@/router/modules/indicator.js';
import eventMenu from '@/router/modules/event.js';
import operate from '@/router/modules/operate.js';
import permission from '@/router/modules/permission.js';
import service from '@/router/modules/service.js';
import exhibitMenu from '@/router/modules/exhibit.js';
import terms from '@/router/modules/terms.js';
import log from '@/router/modules/log.js';
import survey from '@/router/modules/survey.js';

const routes = [
    {
        path: '',
        redirect: '/main',
        name: 'index'
    },
    {
        path: '',
        name: 'layout',
        component: () => import('@/layout/Index.vue'),
        children: [
            ...membermanage,
            ...main,
            ...payMenu,
            ...pntmng,
            ...adminmanage,
            ...sellerMenu,
            ...standardMenu,
            ...sttlMenu,
            ...customerMenu,
            ...indicatorMenu,
            ...eventMenu,
            ...healthnews,
            ...operate,
            ...permission,
            ...terms,
            ...exhibitMenu,
            ...service,
            ...log,
            ...developerMenu,
            ...medicalMenu,
            ...survey
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue')
    },
    {
        path: '/sign-in',
        name: 'sign-in',
        component: () => import('@/views/signin/SignIn.vue')
    },
    {
        path: '/cellphone',
        name: 'cellphone',
        component: () => import('@/views/signin/CellPhone.vue')
    },
    {
        path: '/sample',
        name: 'sample',
        component: () => import('@/views/sample/Sample.vue')
    },
    ...content
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach(async (to, from, next) => {
    /* 라우터 전처리
    * to:  이동할 URL정보가 담긴 라우터 객체
    * from: 현재 URL정보가 담긴 라우터 객체
    * next : from 에서 to로 이동하기 위해 호출 되야 하는 함수, next()가 호출되기 전에는 이동하지 않음.
    */
    console.log('from ==>', from.fullPath);
    console.log('to ==>', to.fullPath);
    next();
});
export default router;
