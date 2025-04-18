//가입신청 목록조회
export const _getJoinRequestPayer = async (params) => {
    return await $api.get('/common/api/v1/payer/join-request', { params });
};

//가입신청 상세 조회
export const _getJoinRequestDetailPayer = async (num, params) => {
    return await $api.get(`/common/api/v1/payer/join-request/${num}`, { params });
};

//가입신청 승인
export const _approveJoinReqeust = async (num, params) => {
    return await $api.put(`/common/api/v1/payer/join-request-approve/${num}`, params);
};

//가입재신청
export const _reJoinReqeust = async (params) => {
    return await $api.post('/common/api/v1/payer/rejoin-request', params);
};

//가입삭제
export const _deleteReqeust = async (params) => {
    return await $api.delete(`/common/api/v1/payer/join-request/${params}`);
};



//가입신청 저장 || 수정
export const _registJoinReqeustPayer = async (params) => {
    return await $api.post('/common/api/v1/payer/join-request', params);

};




//아이디 찾기
export const _duplicateCheck = async (params) => {
    return await $api.get(`/common/api/v1/payer/id-duplicate-check/${params}`);
};


//사업자 찾기
export const _duplicateEidCheck = async (params) => {
    return await $api.get(`/common/api/v1/payer/eid-duplicate-check/${params}`);
};

/**
 * 기업코드 중복체크
 */
export const _duplicateCcdCheck = async (params) => {
    return await $api.get(`/common/api/v1/payer/ccd-duplicate-check/${params}`);
};

/**
 * 이메일 중복체크
 */
export const _duplicateEmailCheck = async (params) => {
    return await $api.get(`/common/api/v1/payer/email-duplicate-check/${params}`);
};


// //셀러 정보 목록
export const _getPayerInfo = async (params) => {
    return await $api.get('/common/api/v1/payer/payer-information', { params });
};

// //셀러 정보 상세
// export const _getSellerInfoDetail = async (num, params) => {
//     return await $api.get(`/common/api/v1/seller/seller-information/${num}`, { params });
// };


// //셀러 정보 수장

// export const _registSellerInfoDetail = async (params) => {
//     return await $api.post('/common/api/v1/seller/seller-information', params);

// };

//탈퇴 신청페이어 목록
export const _getPayerOutRequset = async (params) => {
    return await $api.get('/common/api/v1/payer/payer-secession-request', { params });
};

//탈퇴 신청셀러 상세
export const _getPayerOutRequestDetail = async (num, params) => {
    return await $api.get(`/common/api/v1/payer/payer-secession-request/${num}`, { params });
};

//탈퇴 신청셀러 반려
export const _rejectPayerRequest = async (params) => {
    return await $api.put(`/common/api/v1/payer/secession-reject/${params}`);
};

//탈퇴 신청 승인
export const _apprPayerRequest = async (params) => {
    return await $api.put(`/common/api/v1/payer/secession-approve/${params}`);
};


//탈퇴 페이어 목록
export const _getPayerOut = async (params) => {
    return await $api.get('/common/api/v1/payer/payer-secession', { params });
};

//탈퇴 페이어 상세
export const _getPayerOutDetail = async (num, params) => {
    return await $api.get(`/common/api/v1/payer/payer-secession/${num}`, { params });
};