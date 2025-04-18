export const _getMessageList = async (params) => {
    return await $api.post('/common/api/v1/standardManagement/messageList', params);
};

export const _getMessageDetail = async (params) => {
    return await $api.get(`/common/api/v1/standardManagement/messageDetail/${params}`);
};

export const _upDateMessage = async (params) => {
    return await $api.put('/common/api/v1/standardManagement/messageUpdate', params);
};
export const _registMessage = async (params) => {
    return await $api.post('/common/api/v1/standardManagement/messageCreate', params);
};

export const _setUnused = async (params) => {
    return await $api.put('/common/api/v1/standardManagement/messageUnused', params);
};


export const _getCommonList = async (params) => {
    return await $api.post('/common/api/v1/standardManagement/commonCodeFullList', params);
};

export const _getTreeList = async () => {
    return await $api.get('/common/api/v1/standardManagement/commonCode/tree');
};

export const _getCommonCode = async (params) => {
    return await $api.get(`/common/api/v1/standardManagement/commonCode/${params}`);
};

export const _registCommonCode = async (params) => {
    return await $api.post('/common/api/v1/standardManagement/commonCodeCreate', params);
};

export const _editCommonCode = async (params) => {
    return await $api.put('/common/api/v1/standardManagement/commonCodeUpdate', params);
};

export const _deleteCommonCode = async (params) => {
    return await $api.put('/common/api/v1/standardManagement/commonCodeDelete', params);
};

export const _getMenuTree = async (code, param) => {
    return await $api.get(`/common/api/v1/standardManagement/menu/tree/${code}?searchKeyword=${param}`);
};

export const _deleteMenu = async (code) => {
    return await $api.delete(`/common/api/v1/standardManagement/menu/${code}`);
};

export const _modifyMenu = async (params) => {
    return await $api.put(`/common/api/v1/standardManagement/menu/modify`, params);
};

export const _registerMenu = async (params) => {
    return await $api.post(`/common/api/v1/standardManagement/menu/register`, params);
};