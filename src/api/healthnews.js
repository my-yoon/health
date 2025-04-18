export const clsfState = {
    codeGroup: {
        mjcs: { code: '244001', name: '대분류' },
        mdcs: { code: '244002', name: '중분류' },
        mncs: { code: '244003', name: '소분류' }
    },
    object: {
        classificationSerialNumber: null,
        classificationSectionCode: '',
        classificationCode: '',
        classificationCodeName: '',
        upperRankClassificationCode: '',
        deleteAlternative: null,
        classificationIndicationSerialNumber: 0,
        subCategorizeDetail: []
    }
};

/**
@분류조회_하위분류포함
@param {
    classificationSectionCode: 분류구분코드
    classificationCodeName: 분류코드명
    upperRankClassificationCode: 상위분류코드
} params 
@returns { response.data.data.list: Array }
*/
export const _getClassificationListWithSub = async (params) => {
    const response = await $api.post(
        '/common/api/v1/ctnts/getCategorizeListWithSeperateCode',
        params
    );
    return response.data.data.list;
};

/**
@분류조회
@param {
    classificationSectionCode: 분류구분코드
    classificationCodeName: 분류코드명
    upperRankClassificationCode: 상위분류코드
} params 
@returns { response.data.data.list: Array }
*/
export const _getClassificationList = async (params) => {
    const response = await $api.post(
        '/common/api/v1/ctnts/getSingleCategorizeSeperateCode',
        params
    );
    return response.data.data.list;
};

/**
@분류정보등록_추가_수정_삭제
@param {
    classificationIndicationSerialNumber: 분류표시순번(*)
    classificationSectionCode: 분류구분코드(*)
    classificationCodeName: 분류코드명(*)
    upperRankClassificationCode: 상위분류코드(*)
    classificationSerialNumber: 분류순번
    classificationCode: 분류코드
    deleteAlternative: 식제여부
} params
@returns { result }
*/
export const _setClassificationList = async (params) => {
    return await $api.post('/common/api/v1/ctnts/regCategorize', params);
};

/**
@컨텐츠목록조회
@param {
    currentPage: 현재페이지(*)
    cntPerPage: 페이지당 출력할 컨텐츠갯수(*)
    pageSize: 화면 하단 페이지 사이즈(*)
    majorCode: 대분류코드
    mediumCode: 중분류코드
    minorCode: 소분류코드
    firstRegistrationDate: 등록일
    quizCount: 퀴즈참여수
    quizCorrectAnswerRate: 정답율
    shareCount: 공유수
    interestNewsAggregateCount: 관심뉴수집계수
    title: 제목
    hashTagName: 해시태그
} params 
@returns { response.data.data.list: Array }
*/
export const _getContentList = async (params) => {
    const response = await $api.post(
        '/common/api/v1/ctnts/getHealthNewsWithSubDetailList',
        params
    );
    return response.data.data;
};

/**
@컨텐츠조회_상세
@param {
    contentsIdentification: 컨텐츠아이디(*) ctntsId
} params 
@returns { response.data.data.list: Array }
*/
export const _getContent = async (params) => {
    const response = await $api.post(
        '/common/api/v1/ctnts/getSingleHealthNews',
        params
    );
    return response.data.data;
};

/**
@컨텐츠수정
@param {
    contentsIdentification: 컨텐츠아이디(*)
    postUpAlternative: 게시여부
	majorCode: 대분류코드
	mediumCode: 중분류코드
	minorCode: 소분류코드
	majorCodeName: 대분류코드명
	mediumCodeName: 중분류코드명
	minorCodeName: 소분류코드명
	hashTagName: 해시태그
	useAlternative: 삭제여부[컨텐츠메인용]
	deleteAlternative: 삭제여부[분류코드용]
} params
@returns { result }
*/
export const _setContent = async (params) => {
    return await $api.post('/common/api/v1/ctnts/updateContents', params);
};

/**
@맵핑분류_수정
@param {
    contentsIdentification: 컨텐츠아이디(*)
    postUpAlternative: 게시여부
	majorCode: 대분류코드
	mediumCode: 중분류코드
	minorCode: 소분류코드
	majorCodeName: 대분류코드명
	mediumCodeName: 중분류코드명
	minorCodeName: 소분류코드명
	hashTagName: 해시태그
	useAlternative: 삭제여부[컨텐츠메인용]
	deleteAlternative: 삭제여부[분류코드용]
} params
@returns { result }
*/
export const _setClassificationMapping = async (params) => {
    return await $api.post('/common/api/v1/ctnts/updateMapping', params);
};

/**
@맵핑분류_저장
@param {
    contentsIdentification: 컨텐츠아이디(*)
	majorCode: 대분류코드
	mediumCode: 중분류코드
	minorCode: 소분류코드
	majorCodeName: 대분류코드명
	mediumCodeName: 중분류코드명
	minorCodeName: 소분류코드명
	deleteAlternative: 삭제여부[분류코드용]
} params
@returns { result }
*/
export const _setClassificationSave = async (params) => {
    return await $api.post('/common/api/v1/ctnts/insertMapping', params);
};

/**
@분류삭제가능여부확인
@param {
    classificationCode: 분류코드(*)
} params
@returns { result }
*/
export const _getCanDeleteYn = async (params) => {
    const response = await $api.post(
        '/common/api/v1/ctnts/getCanDeleteYn',
        params
    );
    return response.data.data.existCount;
};

/**
@분류조회
@param {
    classificationSectionCode: 분류구분코드
    classificationCodeName: 분류코드명
    upperRankClassificationCode: 상위분류코드
} params 
@returns { response.data.data.list: Array }
*/
export const _getCtgrSearchList = async (params) => {
    const response = await $api.post(
        '/common/api/v1/ctnts/getCategorySearchList',
        params
    );
    return response.data;
};
