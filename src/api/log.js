/**
 * 다운로드로그 리스트
 */
export const _getDownloadLogList = async (params, mskgnRlsYn) => {
    return await $api.get('/common/api/v1/logManagement/downloadLog/list', { params });
};

/**
 * 사용자 접속로그 리스트
 */
export const _getAccessLogList = async (params) => {
    return await $api.get('/common/api/v1/logManagement/userAccessLog/list', { params });
};

/**
 * 사용자 행위로그 리스트
 */
export const _getActionLogList = async (params) => {
    return await $api.get('/common/api/v1/logManagement/userActionLog/list', { params });
};

/**
 * 관리자 권한변경로그 리스트
 */
export const _getAuthChangeLogList = async (params) => {
    return await $api.get('/common/api/v1/logManagement/adminAuthChangeLog/list', { params });
};

/**
 * 다운로드로그 excel Download
 */
export const _downloadLogExcel = async (params) => {
    return await $api.post('/common/api/v1/logManagement/downloadLog/excel', params);
};

/**
 * 사용자 접속로그 excel Download
 */
export const _accessLogExcel = async (params) => {
    return await $api.post('/common/api/v1/logManagement/userAccessLog/excel', params);
};

/**
 * 사용자 행위로그 excel Download
 */
export const _actionLogExcel = async (params) => {
    return await $api.post('/common/api/v1/logManagement/userActionLog/excel', params);
};

/**
 * 관리자 권한변경로그 excel Download
 */
export const _authChangeLogExcel = async (params) => {
    return await $api.post('/common/api/v1/logManagement/adminAuthChangeLog/excel', params);
};