
// 배너조회
export const _getExhibitBanner = async (params) => {
    return await $api.get('/common/api/v1/exhibit/banners', { params });
};

// 노출순서변경 리스트 조회 (배너/팝업)
export const _getExhibitOrderList = async (params) => {
    return await $api.get('/common/api/v1/exhibit/sequence-setting', { params });
};

// 순서변경
export const _setExhibitOrder = async (params) => {
    return await $api.post('/common/api/v1/exhibit/sequence-setting', params);
};

//배너 상세
export const _detailExhibitBanner = async (num) => {
    return await $api.get(`/common/api/v1/exhibit/banners/${num}`);
};

//배너저장 수정
export const _registExhibitBanner = async (params) => {
    return await $api.post('/common/api/v1/exhibit/banners', params);
};

//이벤트 검색
export const _getExhibitEvent = async (params) => {
    return await $api.get('/common/api/v1/exhibit/events', { params });
};

//배너 삭제
export const _delExhibitBanner = async (num) => {
    return await $api.delete(`/common/api/v1/exhibit/banners/${num}`);
};


//팝업 리스트 조회
export const _getExhibitPopup = async (params) => {
    return await $api.get('/common/api/v1/exhibit/popups', { params });
};

//팝업 노출 순서 조회
export const _getOrderExhibitPopup = async (params) => {
    return await $api.get('/common/api/v1/exhibit/sequence-setting', { params });
};


//팝업 상세
export const _getExhibitPopupDetail = async (num) => {
    return await $api.get(`/common/api/v1/exhibit/popups/${num}`);
};

//팝업저장 수정/등록
export const _registExhibitPopup = async (params) => {
    return await $api.post('/common/api/v1/exhibit/popups', params);
};

//회원그룹 
export const _getMemberGroup = async (params) => {
    return await $api.get('/common/api/v1/exhibit/member-group', { params });
};

//팝업 삭제
export const _delExhibitPopup = async (num) => {
    return await $api.delete(`/common/api/v1/exhibit/popups/${num}`);
};

//팝업 그만보기 설정
export const _stopExhibitPopup = async (params) => {
    return await $api.post('/common/api/v1/exhibit/popup_setting', params);
};


//팝업 그만보기 죄회
export const _getStopExhibitPopup = async () => {
    return await $api.get('/common/api/v1/exhibit/popup_setting');
};
//메인 리스트 조회
export const _getMainlist = async (params) => {
    return await $api.get('/common/api/v1/exhibit/main-section', { params });
};

//메인 관리 정보저장
export const _saveMainSection = async (params) => {
    return await $api.post('/common/api/v1/exhibit/main-section', params);
};

//메인 관리 섹션구조
export const _getMainSection = async (num) => {
    return await $api.get(`/common/api/v1/exhibit/main-section/structure/${num}`);
};


//메인 관리 상세구조
export const _getMainDetail = async (num) => {
    return await $api.get(`/common/api/v1/exhibit/main-section/${num}`);
};

//메인 관리 승인
export const _approveMainSection = async (num) => {
    return await $api.post(`/common/api/v1/exhibit/main-section/approve/${num}`);
};

//메인 관리 승인자 리스트
export const _getMainSectionApproveUser = async (num, params) => {
    return await $api.get(`/common/api/v1/exhibit/approve-user/${num}`, { params });
};


//메인 관리 반려
export const _rejectMainSection = async (num, params) => {
    return await $api.post(`/common/api/v1/exhibit/main-section/reject/${num}`, params);
};



//섹션 추가
export const _copyMainSection = async (num, params) => {
    return await $api.post(`/common/api/v1/exhibit/main-section/copy/${num}`, params);
};






