// 고객알림 메세지관리 목록
export const _getCustomerAlarmList = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarmList', params);
};

// 고객알림 메세지 상세
export const _getCustomerAlarmDetail = async (params) => {
    return await $api.get(`/common/api/v1/operationManagement/CustomerAlarm/${params.cstNcSn}`, {params});
};

// 고객알림 메세지 등록
export const _registCustomerAlarmCreate = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarmCreate', params);
};

// 고객알림 메세지 수정
export const _editCustomerAlarmUpdate = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarmUpdate', params);
};

// 고객알림 메세지 삭제
export const _deleteCustomerAlarmDelete = async (params) => {
    return await $api.delete('/common/api/v1/operationManagement/CustomerAlarmDelete', {data: params});
};

// 고객알림 채널 코드
export const _getCustomerAlarmChnCd = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarm/CommonCodeChnCd', params);
};

// 고객알림 승인상태 코드
export const _getCustomerAlarmPrSt = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarm/CommonCodePrSt', params);
};

// 고객알림 발송목적 코드
export const _getCustomerAlarmSndnPu = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarm/CommonCodeSndnPu', params);
};

// 고객알림 발송대상타입 코드
export const _getCustomerAlarmSndnTrgTyp = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarm/CommonCodeSndnTrgTyp', params);
};

// 고객알림 템플릿 리스트 조회
export const _getCustomerAlarmTempList = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarmTempList', params);
};

// 고객알림 발송대상 조회
export const _getUserList = async (params) => {
    return await $api.post('/common/api/v1/user/userList', params);
};

// 고객알림 템플릿 등록
export const _registCustomerAlarmTempCrete = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarmTempCrete', params);
};

// 고객알림 템플릿 삭제
export const _deleteCustomerAlarmTemp = async (params) => {
    return await $api.delete('/common/api/v1/operationManagement/CustomerAlarmTempDelete', {data: params});
};

// 고객알림 템플릿 상세
export const _getCustomerAlarmTempDetail = async (params) => {
    return await $api.get(`/common/api/v1/operationManagement/CustomerAlarmTemp/${params}`);
};

// 고객알림 템플릿 수정
export const _editCustomerAlarmTempUpdate = async (params) => {
    return await $api.put('/common/api/v1/operationManagement/CustomerAlarmTempUpdate', params);
};

// 고객알림 메세지 승인
export const _registCustomerAlarmApprove = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarm/approve', params);
};

// 고객알림 메세지 반려
export const _registCustomerAlarmReject = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarm/reject', params);
};

// 고객알림 메세지 보류 / 보류취소
export const _registCustomerAlarmHold = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarm/hold', params);
};

// 고객알림 수신거부 전화번호 조회
export const _getRcptDenTlno = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarm/getRcptDenTlno', params);
};

// 고객알림 발신번호 조회
export const _getSndnTlno = async (params) => {
    return await $api.post('/common/api/v1/operationManagement/CustomerAlarm/getSndnTlno', params);
};

// 금지어 조회
export const _getProhibitedWord = async (params) => {
    return await $api.get('/common/api/v1/operation/prohibited-word', {params});
};

// 금지어 삭제
export const _deleteProhibitedWord = async (params) => {
    return await $api.delete('/common/api/v1/operation/prohibited-word', {data: params});
};

// 금지어 등록
export const _registProhibitedWord = async (params) => {
    return await $api.post('/common/api/v1/operation/prohibited-word', params);
};

// 추천 키워드 조회
export const _getRecommendKeyword = async (params) => {
    return await $api.get('/common/api/v1/operation/recommend-keyword', {params});
};

// 추천 키워드 등록
export const _registRecommendKeyword = async (params) => {
    return await $api.post('/common/api/v1/operation/recommend-keyword', params);
};

// 추천 키워드 수정
export const _editRecommendKeyword = async (params) => {
    return await $api.put('/common/api/v1/operation/recommend-keyword', params);
};

// 추천 키워드 삭제
export const _deleteRecommendKeyword = async (params) => {
    return await $api.delete('/common/api/v1/operation/recommend-keyword', {data: params});
};

// 그룹코드 조회
export const _getCommonCodeGrpCd = async (params) => {
    return await $api.get(`/common/api/v1/standardManagement/commonCode/childrenList/${params}`);
};

// 추천 키워드 통계 조회
export const _getRecommendKeywordStats = async (params) => {
    return await $api.get('/common/api/v1/operation/recommend-keyword/stats', {params});
};