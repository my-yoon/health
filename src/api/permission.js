/**
 * 어드민 회원 목록 조회
 * @params
    "size": 10,
    "offset": 0,
    "admnPtnrTyCd": "111001",
    "authSeCd": "144001",
    "admnPtalSitCd": "130001",
    "ptnrpYn": "N",
    "searchType": "admnNm",
    "searchText": "string",
    "mskgnRlsYn": "N",
    "page": 0
 */
export const _getAdminMember = async (params) => {
    return await $api.post('/common/api/v1/menuRole/menurole-admnlist', params);
};

export const _getAdminMenuList = async (params) => {
    return await $api.get('/common/api/v1/menuRole/menurole-menulist', { params });
};
/**
 * 메뉴권한관리 메뉴권한 수정
 */
export const _updateAdminMenuRole = async (params) => {
    return await $api.post('/common/api/v1/menuRole/menurole-save', params);
};