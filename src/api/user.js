// export const _getuserInfo = async (params) => {
//     return await $api.get(`/common/api/v1/adminMemberManagement/loginAdminInfo`);
// };

//계정정보조회

export const _getAccountDetail = async (params) => {
    return await $api.get(`/common/api/v1/adminMemberManagement/loginAdminInfo`, params);
};

//계정정보수정
export const _modifyAccountDetail = async (params) => {
    return await $api.put('/common/api/v1/adminMemberManagement/loginAdminInfo', params);
};

//이메일 인증 요청
export const _requestEmail = async (params) => {
    return await $api.post('/common/api/v1/adminMemberManagement/requestAdminMemberEmailCrtfSend', params);
};
//이메일 인증 확인
export const _confirmEmail = async (params) => {
    return await $api.post('/common/api/v1/adminMemberManagement/requestAdminMemberEmailCrtfValid', params);
};
//이메일 인증 검증
export const _getCheckEmail = async (params) => {
    return await $api.post('/common/api/v1/adminMemberManagement/getCheckAdminMemberEmailChange', params);
};
//비밀번호 변경
export const _changePassword = async (params) => {
    return await $api.post('/common/api/v1/adminMemberManagement/modofyAdminMemberPasswordChange', params);
};

//메뉴 조회
export const _getMenulist = async () => {
    return await $api.get('/common/api/v1/adminMenuAuth/login-admin-auth-list');
};


//즐겨찾기 리스트 조회
export const _getBookmark = async () => {
    return await $api.get('/common/api/v1/menu/bookmark');
};

//즐겨찾기 리스트 수정
export const _editBookmark = async (params) => {
    return await $api.put('/common/api/v1/menu/bookmark', params);
};

//즐겨찾기 리스트 등록
export const _saveBookmark = async (params) => {
    return await $api.post('/common/api/v1/menu/bookmark', params);
};

//즐겨찾기 리스트 삭제
export const _delBookmark = async (params) => {
    return await $api.delete('/common/api/v1/menu/bookmark', { data: params });
};