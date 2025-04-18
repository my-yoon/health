//회원정보
export const _getMemberInfoList = async (params) => {
    return await $api.post('/common/api/v1/user/userList', params);
};

//회원정보상세
export const _getMemberInfoDetail = async (num, params) => {
    return await $api.get(`/common/api/v1/user/userInfo/${num}`, { params });
};


//개인정보 변경 사유
export const _changeInfoHistory = async (params) => {
    return await $api.post('/common/api/v1/user/personalInfoHistory', params);
};

//개인정보 변경 조회
export const _getInfoHistory = async (params) => {
    return await $api.get('/common/api/v1/user/personalInfoHistory', { params });
};

//개인정보가입이력 조회
export const _getInfoHistoryList = async (params) => {
    return await $api.get('/common/api/v1/user/memberStatHistoryList', { params });
};

//이용중지 설정
export const _addFaultMember = async (params) => {
    return await $api.post('/common/api/v1/user/addFaultMember', params);
};

// 불량회원목록
export const _getFaultMember = async (params) => {
    return await $api.get('/common/api/v1/user/faultUserList', { params });
};

// 불량회원상세
export const _getFaultInfo = async (num, params) => {
    return await $api.get(`/common/api/v1/user/faultUserInfo/${num}`, { params });
};

// 이용중지 해제
export const _removeFault = async (params) => {
    return await $api.post('/common/api/v1/user/removeFaultMember', params);
};

// 강제탈퇴
export const _memberOut = async (params) => {
    return await $api.post('/common/api/v1/user/addForcedSecessionMember', params);
};

// 탈퇴회원목록
export const _memberOutList = async (params) => {
    return await $api.get('/common/api/v1/user/secessionUserList', { params });
};

// 탈퇴회원상세
export const _memberOutDetail = async (num) => {
    return await $api.get(`/common/api/v1/user/secessionUserInfo/${num}`);
};


// 참여 이벤트 목록
export const _getMemberEvent = async (params) => {
    return await $api.post('/common/api/v1/user/getUserMemberParticipationEventList', params);
};

//VOC
export const _getMemberVOC = async (params) => {
    return await $api.post('/common/api/v1/user/getUserMemberVocListExcelList', params);
};


//약관 동의 목록
export const _getMemberClause = async (params) => {
    return await $api.get('/common/api/v1/clause-mbr/list', { params });
};

//약관 동의 철회
export const _setMemberClauseCancel = async (params) => {
    return await $api.post('/common/api/v1/clause-mbr/registerClauseMemberAgrmHst ', params);
};

// 포인트/쿠폰 목록
export const _getMemberPoint = async (params) => {
    return await $api.post('/common/api/v1/iss/hst/customer/list', params);
};

//건강정보 요약 
export const _getHealthInfoSummary = async (params) => {
    return await $api.post('/common/api/v1/user/getUserMemberHealthInfoSummary', params);
};


// 메디컬 서비스 
export const _getServiceHealth = async (params) => {
    return await $api.post('/common/api/v1/user/getMedicalServiceUseList', params);
};


// 일반 건강검진결과
export const _getDefaultHealth = async (params) => {
    return await $api.post('/common/api/v1/user/getGeneralHealthMedicalExaminationResultList', params);
};

//심리검사
export const _getMemberMindInfo = async (params) => {
    return await $api.post('/common/api/v1/survey/psytstUstkInfo', params);
};

//건강뉴스
export const _getViewNews = async (params) => {
    return await $api.post('/common/api/v1/ctnts/getContentsViewHstList', params);
};
//서비스 
export const _getServiceInfo = async (params) => {
    return await $api.post('/common/api/v1/user/getUserMemberServiceInfo', params);
};