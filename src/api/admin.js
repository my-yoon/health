// KB어드민 회원관리 목록
export const _getAdminList = async (params) => {
    return await $api.post('/common/api/v1/adminMemberManagement/kbhcAdmin/list', params);
};

// KB어드민 회원상세
export const _getAdminDetail = async (params) => {
    return await $api.get(`/common/api/v1/adminMemberManagement/kbhcAdmin/${params.admnSn}`, { params });
};

// KB어드민 회원등록
export const _registAdmin = async (params) => {
    return await $api.post('/common/api/v1/adminMemberManagement/kbhcAdmin/create', params);
};

// KB어드민 회원수정
export const _editAdmin = async (params) => {
    return await $api.put('/common/api/v1/adminMemberManagement/kbhcAdmin/modify', params);
};

// 어드민 회원관리 회원삭제
export const _delAdmin = async (params) => {
    return await $api.delete('/common/api/v1/adminMemberManagement/remove', { data: params });
};

// 어드민 회원관리 휴면해제
export const _editAdminDormancyRelease = async (params, num) => {
    console.log(params, num);
    return await $api.put(`/common/api/v1/adminMemberManagement/kbhcAdmin/modifyDormancyRelease/${params}?menuCode=${num}`);
};

// 어드민 회원관리 로그인 잠금해제 및 임시비밀번호 재발송
export const _editLoginLockRelease = async (params, num) => {
    return await $api.put(`/common/api/v1/adminMemberManagement/modifyLoginLockRelease/${params}?menuCode=${num}`);
};

// 어드민 회원관리 가입안내 이메일 재발송
export const _reSendJoinGuideEmail = async (params) => {
    return await $api.put(`/common/api/v1/adminMemberManagement/reSendJoinGuideEmail/${params}`);
};

// 어드민 회원관리 아이디 중복체크
export const _getDupicationId = async (params) => {
    return await $api.get(`/common/api/v1/adminMemberManagement/validateDupicationId/${params}`);
};

// 파트너 부계정관리 목록
export const _getPartnerSubAccount = async (params) => {
    return await $api.post(`/common/api/v1/adminMemberManagement/partnerSubAccount/list`, params);
};

// 파트너 부계정관리 상세
export const _getPartnerSubAccountDetail = async (params) => {
    return await $api.get(`/common/api/v1/adminMemberManagement/partnerSubAccount/${params.admnSn}`, { params });
};

// 파트너 부계정관리 등록
export const _registPartnerSubAccount = async (params) => {
    return await $api.post('/common/api/v1/adminMemberManagement/partnerSubAccount/create', params);
};

// 파트너 부계정관리 수정
export const _editPartnerSubAccount = async (params) => {
    return await $api.put('/common/api/v1/adminMemberManagement/partnerSubAccount/modify', params);
};

// MD별 셀러현황 목록
export const _getSellerByMDList = async (params) => {
    return await $api.post('/common/api/v1/adminMemberManagement/sellerByMD/list', params);
};

// 셀러현황 목록
export const _getSellerList = async (params) => {
    return await $api.post('/common/api/v1/adminMemberManagement/sellerByMD/seller/list', params);
};