const eventMenu = [
    {
        path: '/event/list',
        component: () => import('@/views/event/EventList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '이벤트등록관리'],
            menuCode: '1013001'
        }
    },
    {
        path: '/event/register/genaral',
        name: 'eventregist_general',
        component: () => import('@/views/event/EventRegistGeneral.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '이벤트등록관리'],
            menuCode: '1013001'
        }
    },
    {
        path: '/event/edit/genaral',
        name: 'eventregist_general_edit',
        component: () => import('@/views/event/EventEditGeneral.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '이벤트등록관리'],
            menuCode: '1013001'
        }
    },
    {
        path: '/event/register/quiz',
        name: 'eventregist_quiz',
        component: () => import('@/views/event/EventRegistQuiz.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '이벤트등록관리'],
            menuCode: '1013001'
        }
    },
    {
        path: '/event/edit/quiz',
        name: 'eventregist_quiz_edit',
        component: () => import('@/views/event/EventEditQuiz.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '이벤트등록관리'],
            menuCode: '1013001'
        }
    },
    {
        path: '/event/register/roulette',
        name: 'eventregist_roulette',
        component: () => import('@/views/event/EventRegistRoulette.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '이벤트등록관리'],
            menuCode: '1013001'
        }
    },
    {
        path: '/event/edit/roulette',
        name: 'event_roulette_edit',
        component: () => import('@/views/event/EventEditRoulette.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '이벤트등록관리'],
            menuCode: '1013001'
        }
    },
    {
        path: '/event/register/attend',
        name: 'eventregist_attend',
        component: () => import('@/views/event/EventRegistAttend.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '이벤트등록관리'],
            menuCode: '1013001'
        }
    },
    {
        path: '/event/edit/attend',
        name: 'eventedit_attend',
        component: () => import('@/views/event/EventEditAttend.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '이벤트등록관리'],
            menuCode: '1013001'
        }
    },
    {
        path: '/event/detail',
        name: 'eventdetail',
        component: () => import('@/views/event/EventDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '이벤트등록관리'],
            menuCode: '1013001'
        }
    },
    {
        path: '/event/winner_notice/list',
        name: 'eventpzwrlist',
        component: () => import('@/views/event/EventPzwrList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '당첨자발표'],
            menuCode: '1013002'
        }
    },
    {
        path: '/event/winner_notice/register',
        name: 'eventpzwrRegist',
        component: () => import('@/views/event/EventPzwrRegist.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '당첨자발표'],
            menuCode: '1013002'
        }
    },
    {
        path: '/event/winner_notice/detail',
        name: 'eventpzwrDetail',
        component: () => import('@/views/event/EventPzwrDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '당첨자발표'],
            menuCode: '1013002'
        }
    },
    {
        path: '/event/recommend/status',
        name: 'eventfriendlist',
        component: () => import('@/views/event/EventFriendList.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '친구초대현황'],
            menuCode: '1013004'
        }
    },
    {
        path: '/event/after_reciever',
        name: 'eventreciever',
        component: () => import('@/views/event/EventReciever.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '후지급당첨자관리'],
            menuCode: '1013003'
        }
    },
    {
        path: '/event/after_reciever_detail',
        name: 'eventrecieverdetail',
        component: () => import('@/views/event/EventRecieverDetail.vue'),
        meta: {
            unauthorized: true,
            sublocation_depth: ['이벤트관리', '후지급당첨자관리'],
            menuCode: '1013003'
        }
    }



];
export default eventMenu;