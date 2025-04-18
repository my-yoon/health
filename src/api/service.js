/**
 * @CATEGORY
 */

// 카테고리 목록 조회
export const _getCommunityCategory = async (params) => {
    return await $api.post('/common/api/v1/community/category/list', params);
};

// 회원그룹
export const _getMemberGroup = async (params) => {
    return await $api.post('/common/api/v1/community/category/grp/list', params);
};

// 카테고리 등록
export const _createCategory = async (params) => {
    return await $api.post('/common/api/v1/community/category/create', params);
};

// 카테고리 수정
export const _modifyCategory = async (params) => {
    return await $api.put('/common/api/v1/community/category/modify', params);
};

// 카테고리 노출순서변경
export const _modifyCategoryOrder = async (params) => {
    // [{"ctgrMngSn": 1, "srtSqn": 1}]
    return await $api.put('/common/api/v1/community/category/indnSqn/modify', params);
};

// 카테고리 삭제
export const _deleteCategory = async (params) => {
    return await $api.delete('/common/api/v1/community/category/delete', { data: params });
};

// 카테고리 상세 조회
export const _getCategoryDetail = async (params) => {
    return await $api.get('/common/api/v1/community/category/detail', { params });
};

/**
 * @TAG
 */

// 태그 조회
export const _getCommunityTag = async (params) => {
    return await $api.post('/common/api/v1/community/tag/list', params);
};

// 태그 생성
export const _createTag = async (params) => {
    // { "hashTagNm": "태그명" }
    return await $api.post('/common/api/v1/community/tag/create', params);
};

// 태그 삭제
export const _deleteTag = async (params) => {
    // [{ "tagMngSn": 0 }]
    return await $api.delete('/common/api/v1/community/tag/delete', { data: params });
};

/**
 * @RECOMMEND TAG
 */

// 태그 조회
export const _getCommunityRecommend = async (params) => {
    return await $api.post('/common/api/v1/community/rcm/tag/list', params);
};

// 태그 상세 조회
export const _getCommunityRecommendDetail = async (params) => {
    // @params: ctgrMngSn
    return await $api.get('/common/api/v1/community/rcm/tag/detail', { params });
};

// 태그 목록 조회
export const _getCommunityRcmTag = async (params) => {
    // @params: ctgrMngSn
    return await $api.post('/common/api/v1/community/rcm/tag/create/popup', params);
};

// 태그 저장
export const _getCommunityTagSave = async (params) => {
    // "ctgrMngSn": 3,
    // "tagPopSn": 1,
    // "tagPopUseYn": "Y",
    // "tagRcmList": [
    //     {
    //     "tagRcmSn": 1,
    //     "tagRcmTagMngSn": 1,
    //     "tagRcmSrtSqn": 1,
    //     "tagRcmDelYn": "N"
    //     }
    // ]
    return await $api.post('/common/api/v1/community/rcm/tag/save', params);
};

// 투두 카테고리 목록 조회
export const _getTodoCategory = async (params) => {
    return await $api.get('/common/api/v1/todo/category', { params });
};