//가입신청 목록조회
export const _getJoinRequest = async (params) => {
    return await $api.get('/common/api/v1/seller/join-request', { params });
};
//가입신청 상세 조회
export const _getJoinRequestDetail = async (num, params) => {
    return await $api.get(`/common/api/v1/seller/join-request/${num}`, { params });
};
//가입신청 승인
export const _approveJoinReqeust = async (admnSn, params) => {
    return await $api.put(`/common/api/v1/seller/join-request-approve/${admnSn}`, params);
};

//가입재신청
export const _reJoinReqeust = async (params) => {
    return await $api.post('/common/api/v1/seller/rejoin-request', params);
};

//가입삭제
export const _deleteReqeust = async (params) => {
    return await $api.delete(`/common/api/v1/seller/join-request/${params}`);
};


//MD 목록
export const _getMdUser = async (params) => {
    console.log(params);
    return await $api.get('/common/api/v1/seller/md-user', { params });
};


//가입신청 저장 || 수정
export const _registJoinReqeust = async (params) => {
    return await $api.post('/common/api/v1/seller/join-request', params);

};

//아이디 찾기 
export const _duplicateCheck = async (params) => {
    return await $api.get(`/common/api/v1/seller/id-duplicate-check/${params}`);
};


//사업자 찾기 
export const _duplicateEidCheck = async (params) => {
    return await $api.get(`/common/api/v1/seller/eid-duplicate-check/${params}`);
};

// 기업코드 중복체크 
export const _duplicateCcdCheck = async (params) => {
    return await $api.get(`/common/api/v1/seller/ccd-duplicate-check/${params}`);
};

// 이메일 중복체크 
export const _duplicateEmailCheck = async (params) => {
    return await $api.get(`/common/api/v1/seller/email-duplicate-check/${params}`);
};


//셀러 정보 목록
export const _getSellerInfo = async (params) => {
    return await $api.get('/common/api/v1/seller/seller-information', { params });
};

//셀러 정보 상세
export const _getSellerInfoDetail = async (num, params) => {
    return await $api.get(`/common/api/v1/seller/seller-information/${num}`, { params });
};


//셀러 정보 수장

export const _registSellerInfoDetail = async (params) => {
    return await $api.post('/common/api/v1/seller/seller-information', params);

};

//탈퇴 신청셀러 목록
export const _getSellerOutRequset = async (params) => {
    return await $api.get('/common/api/v1/seller/seller-secession-request', { params });
};

//탈퇴 신청셀러 상세
export const _getOutlistDetail = async (num, params) => {
    return await $api.get(`/common/api/v1/seller/seller-secession-request/${num}`, { params });
};

//탈퇴 신청셀러 반려
export const _rejectSellerRequest = async (params) => {
    return await $api.put(`/common/api/v1/seller/secession-reject/${params}`);
};

//탈퇴 신청 승인
export const _confirmSellerRequest = async (params) => {
    return await $api.put(`/common/api/v1/seller/secession-approve/${params}`);
};

//탈퇴 셀러 목록
export const _getSellerOutlist = async (params) => {
    return await $api.get('/common/api/v1/seller/seller-secession', { params });
};


//탈퇴 셀러 상세
export const _getSellerOutDetail = async (num, params) => {
    return await $api.get(`/common/api/v1/seller/seller-secession/${num}`, { params });
};



/**
 * 개인정보 변경 이력 (공통 seller, payer, developer, medical)
 */
export const _getChangehistory = async (admnSn) => {
    return await $api.get(`/common/api/v1/personalinfomation-changehistory/${admnSn}`);
};



