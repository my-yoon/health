import axios from 'axios';
/**
 * 리스트 조회 ( category )
 * 
 */
export const _getCategoryList = async (params) => {
    return await 'test !!!';
    // return await $api.post('/bfmavm/api/v1/map/categoryList', params);
};

export const _getaccessToken = async (params) => {
    return await $api.post('/auth/admin-pass/token', params);
};