//아이디 찾기 
export const _duplicateCheck = async (params) => {
    return await $api.get(`/common/api/v1/medical/id-duplicate-check/${params}`);
};

//사업자 찾기 
export const _duplicateEidCheck = async (params) => {
    return await $api.get(`/common/api/v1/medical/eid-duplicate-check/${params}`);
};

// 기업코드 중복체크 
export const _duplicateCcdCheck = async (params) => {
    return await $api.get(`/common/api/v1/medical/ccd-duplicate-check/${params}`);
};

// 이메일 중복체크 
export const _duplicateEmailCheck = async (params) => {
    return await $api.get(`/common/api/v1/medical/email-duplicate-check/${params}`);
};
//가입신청 목록조회
export const _getJoinMedicalRequest = async (params) => {
    return await $api.get('/common/api/v1/medical/join-request', { params });
};

//가입신청 상세
export const _getDetailMedicalRequest = async (num, params) => {
    return await $api.get(`/common/api/v1/medical/join-request/${num}`, { params });
};

//가입신청 승인
export const _getApprMedical = async (num, params) => {
    return await $api.put(`/common/api/v1/medical/join-request-approve/${num}`, params);
};

//가입신청 재신청 
export const _rejoinMedicalRequest = async (params) => {
    return await $api.post('/common/api/v1/medical/rejoin-request', params);
};

//가입신청 삭제 
export const _deleteMedicalRequest = async (params) => {
    return await $api.delete(`/common/api/v1/medical/join-request/${params}`);
};

//가입신청 
export const _regMedicalRequest = async (params) => {
    return await $api.post('/common/api/v1/medical/join-request', params);
};


// 정보관리목록
export const _getMedicalInfo = async (params) => {
    return await $api.get('/common/api/v1/medical/medical-information', { params });
};
// 정보관리상세
export const _getMedicalInfoDetail = async (num, params) => {
    return await $api.get(`/common/api/v1/medical/medical-information/${num}`, { params });
};

// 정보관리수정
export const _regMedicalInfoDetail = async (params) => {
    return await $api.post('/common/api/v1/medical/medical-information/', params);
};


//탈퇴신청 목록
export const _getMedicalOutRequest = async (params) => {
    return await $api.get('/common/api/v1/medical/medical-secession-request', { params });
};

//탈퇴신청상세
export const _getMedicalOutRequestDetail = async (num, params) => {
    return await $api.get(`/common/api/v1/medical/medical-secession-request/${num}`, { params });
};

//탈퇴신청반려
export const _rejectMedical = async (num) => {
    return await $api.put(`/common/api/v1/medical/secession-reject/${num}`);
};

//탈퇴신청승인
export const _apprdMedical = async (num) => {
    return await $api.put(`/common/api/v1/medical/secession-approve/${num}`);
};
//탈퇴자  목록
export const _getMedicalOutList = async (params) => {
    return await $api.get('/common/api/v1/medical/medical-secession', { params });
};

//탈퇴자 상세
export const _getMedicalOutDetail = async (params) => {
    return await $api.get(`/common/api/v1/medical/medical-secession/${params}`);
};
