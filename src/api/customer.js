// faq리스트
export const _getFaqList = async (params) => {
    return await $api.get('/common/api/v1/faq/faqList', {params});
    // return await $api.post(`/common/api/v1/faq/faqList?size=${params.size}&offset=${params.offset}&inqType=${params.inqType}&bgnDate=${params.bgnDate}&endDate=${params.endDate}&searchType=${params.searchType}&searchText=${params.searchText}&exposeYn=${params.exposeYn}&category=${params.category}`);


};
// faqTop 10리스트
export const _getTop10List = async () => {
    return await $api.get('/common/api/v1/faq/top10List');
};
/**
 * faqTop10 modify ( 수정/삭제 )
 * @params [{
 *  "faqSn": 2,
 *  "faqTop10Yn": "N",
 *  "faqTop10Sequence": 10
 * }]
 */
export const _modifyTop10 = async (params) => {
    return await $api.put('/common/api/v1/faq/top10Modify', params);
};

// faq리스트 삭제
export const _deleteFaqList = async (params) => {
    return await $api.put('/common/api/v1/faq/deletes', params);
};


// faq리스트 수정
export const _modifyFaqList = async (params) => {
    return await $api.put('/common/api/v1/faq/modify', params);
};

// faq리스트 상세
export const _getFaqDetail = async (params) => {
    return await $api.get(`/common/api/v1/faq/${params}`);
};

// faq등록
export const _registFaq = async (params) => {
    return await $api.post('/common/api/v1/faq/create', params);
};
// 공지사항 조회
export const _getNoticeList = async (params) => {
    return await $api.post('/common/api/v1/customerNotice/list', params);
};


// 공지사항 목록 삭제
export const _delNoticeList = async (params) => {
    const paramsArr = params;
    const queryString = paramsArr.map(item => `noticeSn=${item}`).join('&');
    return await $api.put(`/common/api/v1/customerNotice/delete?${queryString}`);
};

// 공지사항 등록
export const _registNotice = async (params) => {
    return await $api.post('/common/api/v1/customerNotice', params);
};


// 공지사항 수정
export const _editNotice = async (params) => {
    return await $api.put('/common/api/v1/customerNotice', params);
};
// 공지사항 상세조회
export const _getNoticeDetail = async (params) => {
    return await $api.get(`/common/api/v1/customerNotice/${params}`);
};


// 공지사항 승인
export const _ApproveNotice = async (params) => {
    return await $api.put('/common/api/v1/customerNotice/approve', params);
};

// 공지사항 반려
export const _DeclineNotice = async (params) => {
    return await $api.put('/common/api/v1/customerNotice/decline', params);
};

// 시스템 공지 리스트
export const _getSystemNoticeList = async (params) => {
    return await $api.get('/common/api/v1/customer/system-notice', {params});
};

// 시스템 공지 단건 조회
export const _getSystemNotice = async (params) => {
    return await $api.get(`/common/api/v1/customer/system-notice/${params.systemNoticeSn}`, {params});
};

// 시스템 공지 등록
export const _registSystemNotice = async (params) => {
    return await $api.post('/common/api/v1/customer/system-notice', params);
};

// 시스템 공지 수정
export const _editSystemNotice = async (params) => {
    return await $api.put('/common/api/v1/customer/system-notice', params);
};

// 시스템 공지 삭제
export const _delSystemNotice = async (params) => {
    return await $api.delete('/common/api/v1/customer/system-notice', {data: params});
};

// 시스템 공지 다건 삭제
export const _delSystemNoticeList = async (params) => {
    return await $api.delete('/common/api/v1/customer/system-notice/multi', {data: params});
};

// 1:1문의 이관 파트너 목록
export const _getQnaPartnerList = async (params) => {
    return await $api.get('/common/api/v1/qna/qnaPartnerList', {params});
};

// 1:1문의 이관 등록
export const _registTranferCreate = async (params) => {
    return await $api.post('/common/api/v1/qna/tranferCreate', params);
};

// 1:1문의 목록
export const _getQnaList = async (params) => {
    return await $api.post('/common/api/v1/qna/qnaList', params);
};

// 1:1문의 상세
export const _getQnaDetail = async (params) => {
    return await $api.get(`/common/api/v1/qna/${params.qnaSn}`, {params});
};

// 1:1문의 삭제
export const _deleteQna = async (params) => {
    return await $api.put('/common/api/v1/qna/deletes', params);
};

// 1:1문의 답변응대수락
export const _registQnaAnswerAceept = async (params) => {
    return await $api.put('/common/api/v1/qna/answerAceept', params);
};

// 1:1문의 답변 임시 저장
export const _editQna = async (params) => {
    return await $api.put('/common/api/v1/qna/update', params);
};

// 1:1문의 답변 수정(cs 발송이후)
export const _editQnaAfter = async (params) => {
    return await $api.put('/common/api/v1/qna/afterUpdate', params);
};

// 1:1문의 CS 발송
export const _editQnaSendCs = async (params) => {
    return await $api.put('/common/api/v1/qna/sendCs', params);
};

// 1:1문의 상세
export const _getQnaWireDetail = async (params) => {
    return await $api.get(`/common/api/v1/qna/wire/${params.wireInqSn}`, {params});
};

// 유선문의 회원목록
export const _getQnaWireMemberList = async (params) => {
    return await $api.post('/common/api/v1/qna/qnaWireMemberList', params);
};

// 유선문의 저장
export const _registQnaWire = async (params) => {
    return await $api.post('/common/api/v1/qna/wire/create', params);
};

// 유선문의 수정
export const _editQnaWire = async (params) => {
    return await $api.put('/common/api/v1/qna/wire/update', params);
};

