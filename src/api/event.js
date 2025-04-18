// 이벤트등록관리
export const _getEventList = async (params) => {
    return await $api.get('/common/api/v1/event/list', { params });
};

// 일반 이벤트등록
export const _regGeneralEvent = async (params) => {
    return await $api.post('/common/api/v1/event/general/reg', params);
};

// 일반 이벤트수정
export const _editGeneralEvent = async (params) => {
    return await $api.put('/common/api/v1/event/general/reg', params);
};


// 퀴즈 이벤트등록
export const _regQuizEvent = async (params) => {
    return await $api.post('/common/api/v1/event/quiz/reg', params);
};

// 퀴즈 이벤트수정
export const _editQuizEvent = async (params) => {
    return await $api.put('/common/api/v1/event/quiz/reg', params);
};

// 출석 이벤트등록
export const _regAtndEvent = async (params) => {
    return await $api.post('/common/api/v1/event/atnd/reg', params);
};
// 출석 이벤트추가
export const _regAddEvent = async (params) => {
    console.log(params);
    return await $api.post('/common/api/v1/event/atnd/add/reg', params);
};
// 출석 이벤트수정
export const _editAtndEvent = async (params) => {
    console.log(params);
    return await $api.put('/common/api/v1/event/atnd/reg', params);
};

// 출석 이벤트수정
export const _editAddEvent = async (params) => {
    console.log(params);
    return await $api.put('/common/api/v1/event/atnd/add/reg', params);
};


// 룰렛 이벤트등록
export const _regRouletteEvent = async (params) => {
    return await $api.post('/common/api/v1/event/roulette/reg', params);
};

// 룰렛 이벤트수정
export const _editRouletteEvent = async (params) => {
    return await $api.put('/common/api/v1/event/roulette/reg', params);
};

// 이벤트 조회
export const _detailEvent = async (params) => {
    return await $api.get(`/common/api/v1/event/detail/${params}`);
};

// 이벤트 조회
export const _getJoinList = async (num, params) => {
    return await $api.get(`/common/api/v1/event/joinlist/${num}`, { params });
};

//당첨대상 이벤트 리스트 
export const _getPzwrSerch = async () => {
    return await $api.get('/common/api/v1/event/pzwr/search');
};

//참여내역 리스트 
export const _getEventJoinList = async (num, params) => {
    return await $api.get(`/common/api/v1/event/joinlist/${num}`, { params });
};
//당첨자 발표 
export const _getPzwrList = async (params) => {
    return await $api.get('/common/api/v1/event/pzwr/list', { params });
};

//이벤트 긴급종료
export const _eventStop = async (params) => {
    return await $api.post('/common/api/v1/event/stop', params);
};

//당첨자 발표 등록
export const _eventPzwrReigst = async (params) => {
    return await $api.post('/common/api/v1/event/pzwr', params);
};

//당첨자 발표 상세
export const _eventPzwrDetail = async (num) => {
    return await $api.get(`/common/api/v1/event/pzwr/${num}`);
};

//당첨대상 이벤트 리스트 
export const _getPzwrEventList = async (params) => {
    return await $api.get('/common/api/v1/event/pzwr/search', { params });
};
//친구초대 리스트
export const _getInviteList = async (params) => {
    return await $api.get('/common/api/v1/event/invite/list', { params });
};

//당첨자 추첨
export const _getDrawList = async (num) => {
    return await $api.get(`/common/api/v1/event/draw/${num}`);
};

//당첨자 확정
export const _confirmPzwr = async (params) => {
    return await $api.post('/common/api/v1/event/pzwr/confirm', params);
};

//당첨자 수정
export const _updatePzwr = async (params) => {
    return await $api.put('/common/api/v1/event/pzwr/update', params);
};

//후지급 당첨자 
export const _getPzwrManage = async (params) => {
    return await $api.get('/common/api/v1/event/pwzr/manage', { params });
};

//후지급 당첨자 상세
export const _getPzwrDetail = async (num, params) => {
    return await $api.get(`/common/api/v1/event/pwzr/manage/${num}`, { params });
};

//후지급 당첨자 업데이트
export const _upDatePzwrDetail = async (num, params) => {
    return await $api.put(`/common/api/v1/event/pwzr/manage/${num}`, params);
};


//약관조회
export const _getEventClause = async (params) => {
    return await $api.get('/common/api/v1/clause-mncds/evnt-detail', { params });
};


// 이벤트 조회

export const _getEventPoint = async (params) => {
    return await $api.get(`/common/api/v1/event/point/${params}`);
};

