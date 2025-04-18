export function _uploadEditFile(formData) {
    return $api({
        url: '/common/api/v1/file/upload/editor',
        method: 'post',
        data: formData,
        timeout: 6000
    });
}


export function _uploadFile(formData) {
    console.log(formData);
    return $api({
        url: '/common/api/v1/file/upload',
        method: 'post',
        data: formData,
        timeout: 6000
    });
}

export const _fileDownload = async (params) => {
    return await $api.get(`/common/api/v1/file/download/${params}`, { responseType: 'blob' });
};
export const _getCommTree = async () => {
    return await $api.get('/common/api/v1/standardManagement/commonCode/tree');
};

export const _getPartnerList = async (params) => {
    return await $api.post('/common/api/v1/company/list', params);
};


export const _downExcel = async (url, params) => {
    return await $api.post(`${url}`, params, { responseType: 'blob' });
};


export const _getCommonCode = async (num) => {
    return await $api.get(`/common/api/v1/standardManagement/commonCode/childrenList/${num}`);
};

export const _imgDownload = async (params) => {
    return await $api.post('/common/api/v1/logManagement/downloadLog/create', params);
};
