/**
 * 약관그룹 조회
 * @params { clusGrpNm: 약관그룹명 }
 */
export const _getTermsGroup = async (params) => {
    return await $api.get('/common/api/v1/clauseGroup/list', { params });
};
/**
 * 약관그룹명 중복확인
 * @params { clusGrpNm: 약관그룹명 }
 */
export const _checkTermsGroupName = async (params) => {
    return await $api.get('/common/api/v1/clauseGroup/duplicate', { params });
};
/**
 * 약관그룹 등록
 * @param { 
 *  clusGrpSn: 0, // 약관그룹순번
 *  clusGrpNm: 약관그룹명, 
 *  isDel: false // 삭제여부
 * }
 */
export const _setTermsGroup = async (params) => {
    return await $api.post('/common/api/v1/clauseGroup/save', params);
};

/**
 * 약관유형 목록
 */
export const _getTermsType = async (params) => {
    return await $api.get('/common/api/v1/clauseType/list', { params });
};

/**
 * 약관유형 등록
 * @param {
 *  tlusSn: 0,
 *  tlusClusNm: '이용약관-편집형약관-001',
 *  clusGrpSn: 5,
 *  clusTyCd: '246001',
 *  tlusShpCd: '248001',
 *  tlusClusCts: '내용 편집형약관-001',
 *  tacClusTlusVrbMapList: []
 * }
 */
export const _createTermsType = async (params) => {
    return await $api.post('/common/api/v1/clauseType/create', params);
};

/**
 * 약관유형 수정
 */
export const _updateTermsType = async (params) => {
    return await $api.put('/common/api/v1/clauseType/modify', params);
};

/**
 * 약관유형 상세
 * @param {
 *  tlusSn: 약관유형별템플릿순번
 *  clusGrpSn: 약관그룹순번
 *  clusTyCd: 약관유형코드-약관유형코드
 * }
 */
export const _getTermsTypeDetail = async (params) => {
    return await $api.get('/common/api/v1/clauseType/detail', { params });
};

/**
 * 약관 목록
 */
export const _getTerms = async (params) => {
    return await $api.post('/common/api/v1/clause/list', params);
};
/**
 * 약관 등록
 * @param {
 * lastUpdrSn": 1,
 * clusMngStCd": "251003",
 * clusGrpSn": 3,
 * tlusSn": 2,
 * clusTyCd": "246001",
 * clusMngOffrTyCd": "249001",
 * clusMngTgpTyCd": "250001",
 * clusMngOffrNtprSn": 1,
 * clusMngShpCd": "248001",
 * clusNm": "약관명",
 * dstrbDt": "2023-11-07",
 * rpdDt": "2023-11-07",
 * rpdRsn": "제개정사유",
 * esnClusYn": "Y",
 * impaCtsChgYn": "N",
 * vrbCunt": 0,
 * clusCts": "약관내용템플릿~~",
 * clusHstIclDelYn": "N",
 * tacClusMngVrbMapInfo": [
 * {
 *  clusMngVrbMapSn": 0,
 *  clusMngSn": 0,
 *  vrbIndnSqn": 1,
 *  vrbNm": "기업명",
 *  vrbDscr": "기업명설명",
 *  lastUpdrSn": 1
 * }
 * ]
 * }
 */
export const _createTerms = async (params) => {
    return await $api.post('/common/api/v1/clause/creat', params);
};

/**
 * 약관 수정
*/
export const _updateTerms = async (params) => {
    return await $api.put('/common/api/v1/clause/modify', params);
};
/**
 * 약관 삭제
*/
export const _deleteTerms = async (params) => {
    return await $api.delete('/common/api/v1/clause/delete', { data: params });
};

/**
 * 약관 상세 조회
 */
export const _getTermsDetail = async (params) => {
    return await $api.get('/common/api/v1/clause/detail', { params });
};

/**
 * 약관 이력 조회
*/
export const _getTermsHistory = async (params) => {
    return await $api.get('/common/api/v1/clause/detail-hist', { params });
};

/**
 * 서비스제공자 목록 조회
 */
export const _getTermsOffice = async (params) => {
    return await $api.post('/common/api/v1/company/all/list', params);
};

/**
 * 영역별약관 목록 조회
 * @param {
 *  searchType: 조회조건 clusAgrmDomnCdNm(약관동의영역)/serviceOfferNm(서비스제공자)/ serviceTargetNm(서비스대상자)
 * }
*/
export const _getTermsArea = async (params) => {
    return await $api.get('/common/api/v1/clause-mncds/list', { params });
};
export const _getTermsAreaDetail = async (params) => {
    return await $api.get('/common/api/v1/clause-mncds/detail', { params });
};
/**
 * 영역별약관 등록
 */
export const _createTermsArea = async (params) => {
    return await $api.post('/common/api/v1/clause-mncds/save', params);
};