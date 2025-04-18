//가입신청 목록조회
export const _getJoinDevRequest = async (params) => {
    return await $api.get('/common/api/v1/developer/join-request', { params });
};

//가입신청 상세
export const _getDetailDevRequest = async (num, params) => {
    return await $api.get(`/common/api/v1/developer/join-request/${num}`, { params });
};

//가입신청 승인
export const _getApprDev = async (num, params) => {
    return await $api.put(`/common/api/v1/developer/join-request-approve/${num}`, params);
};

//가입신청 재신청 
export const _rejoinDevRequest = async (params) => {
    return await $api.post('/common/api/v1/developer/rejoin-request', params);
};

//가입신청 삭제 
export const _deleteDevRequest = async (params) => {
    return await $api.delete(`/common/api/v1/developer/join-request/${params}`);
};

//가입신청 
export const _regDevRequest = async (params) => {
    return await $api.post('/common/api/v1/developer/join-request', params);
};


// 정보관리목록
export const _getDevInfo = async (params) => {
    return await $api.get('/common/api/v1/developer/developer-information', { params });
};
// 정보관리상세
export const _getDevInfoDetail = async (num, params) => {
    return await $api.get(`/common/api/v1/developer/developer-information/${num}`, { params });
};

// 정보관리수정
export const _regDevInfoDetail = async (params) => {
    return await $api.post('/common/api/v1/developer/developer-information/', params);
};


//아이디 찾기 
export const _duplicateCheck = async (params) => {
    return await $api.get(`/common/api/v1/developer/id-duplicate-check/${params}`);
};

//사업자 찾기 
export const _duplicateEidCheck = async (params) => {
    return await $api.get(`/common/api/v1/developer/eid-duplicate-check/${params}`);
};

// 기업코드 중복체크 
export const _duplicateCcdCheck = async (params) => {
    return await $api.get(`/common/api/v1/developer/ccd-duplicate-check/${params}`);
};

// 이메일 중복체크 
export const _duplicateEmailCheck = async (params) => {
    return await $api.get(`/common/api/v1/developer/email-duplicate-check/${params}`);
};


//탈퇴신청 목록
export const _getDevOutRequest = async (params) => {
    return await $api.get('/common/api/v1/developer/developer-secession-request', { params });
};

//탈퇴신청상세
export const _getDevOutRequestDetail = async (num, params) => {
    return await $api.get(`/common/api/v1/developer/developer-secession-request/${num}`, { params });
};

//탈퇴신청반려
export const _rejectDev = async (num) => {
    return await $api.put(`/common/api/v1/developer/secession-reject/${num}`);
};

//탈퇴신청승인
export const _apprdDev = async (num) => {
    return await $api.put(`/common/api/v1/developer/secession-approve/${num}`);
};

//탈퇴자  목록
export const _getDevOutList = async (params) => {
    return await $api.get('/common/api/v1/developer/developer-secession', { params });
};


//탈퇴자 상세
export const _getDevOutDetail = async (params) => {
    return await $api.get(`/common/api/v1/developer/developer-secession/${params}`);
};