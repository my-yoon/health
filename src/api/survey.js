export const stringToDate = (date) => {
    let resData;
    if (!_.isEmpty(date)) {
        let yyyy = date.substring(0, 4);
        let mm = date.substring(4, 6);
        let dd = date.substring(6, 8);
        resData = yyyy + '-' + mm + '-' + dd;
    }
    return resData;
};

export const addComma = (num) => num ? num.toLocaleString('ko') : '';

/**
@설문카테고리 목록 조회
@param {
    size: 발급구분코드
    offset: offset,
    categoryName: 설문카테고리이름
    categoryCode: 설문카테고리코드
    postUpYn: 노출여부
    page: 페이지순번
} params 
@returns { code: String, data.list: Array }
*/
export const _getSurveyCategoryList = async (params, type) => {
    const url = '/common/api/v1/survey/getCategoryList';
    let data = await $api.post(url, params);

    return data.data;
};

/**
@설문카테고리 등록
@param {
    "categoryName": "카테고리",
    "categoryDescription": "설명",
    "postUpYn": "Y",
    "questionGroupSectionCode": "328001(단수) / 328002(복수)"
} params 
@returns { code: String, data.list: Array }
*/
export const _surveyCategoryReg = async (params) => {

    const url = '/common/api/v1/survey/registerCategory';
    let data = await $api.post(url, params);

    return data.data;
};

/**
@설문카테고리 상세조회
@param {
    "categorySerialNumber  ": "카테고리시리얼넘버",
} params 
@returns { code: String, data.list: Array }
*/
export const _getCategoryDetail = async (serialNo) => {

    let data = await $api.get(`/common/api/v1/survey/getCategoryDetail/${serialNo}`);
    return data.data;
};

/**
@설문카테고리 삭제
@param {
    "questionSerialNumber ": "카테고리시리얼넘버",
} params 
@returns { code: String, data.list: Array }
*/
export const _removeCategory = async (serialNo) => {
    
    const param = {
        categorySerialNumber: serialNo
    };

    const url = `/common/api/v1/survey/removeCategory/${serialNo}`;
    let data = await $api.post(url, param);
    return data.data;
};

/**
@ 설문카테고리 수정
@param 
    {
        "categorySerialNumber": 0,
        "categoryName": "카테고리",
        "categoryDescription": "설명",
        "postUpYn": "Y",
        "questionGroupSectionCode": "328001(단수) / 328002(복수)",
        "questionList": [
          {
            "categorySerialNumber": 0,
            "questionSerialNumber": 0,
            "indicationSerialNumber": 0
          }
        ]
      }
@returns { code: String, data.list: Array }
*/
export const _modifyCategory = async (param) => {

    const url = `/common/api/v1/survey/modifyCategory`;
    let data = await $api.post(url, param);
    return data.data;
};

/**
@ 설문 삭제
@param {
    "questionSerialNumberList  ": "설문시리얼넘버",
} params 
@returns { code: String, data.list: Array }
*/
export const _removeQuestion = async (param) => {

    const url = `/common/api/v1/survey/removeQuestion`;
    let data = await $api.post(url, param);
    return data.data;
};

/**
@ 설문목록조회
@param 
    {
    "size": 10,
    "offset": 0,
    "questionTitle": "string", //설문제목
    "questionCode": "string", //설문코드
    "categoryName": "string", //설문카테고리명
    "publicationStatusSectionCode": "string", // 발생상태 (330001 :임시저장, 330002 : 발행완료, 330003 : 종료 )
    "useYn": "string", // 사용여부
    "page": 0
    }
@returns { code: String, data.list: Array }
*/
export const _getQuestionList = async (param) => {

    const url = `/common/api/v1/survey/getQuestionList`;
    let data = await $api.post(url, param);
    return data.data;
};

/**
@ 설문등록
@param 
    {
        questionRegistrationSectionCode: '', //설문등록구분코드
        questionTitle: '', // 설문제목
        questionDescription: '', // 설문내용
        screenTypeSectionCode: '', // 화면유형구분코드
        pageQuestionItemCount: 0, // 페이지문항건수
        screenTrnsfEffectYn: '', // 화면전환효과여부
        indicationSerialNumber: 0, // 표시순번
        useYn: '', //사용여부
        markingTypeCode: '', // 채점유형구분코드
        postUpYn: '', // 게시여부
        postUpBeginDatetime: '', // 게시시작일시
        postUpEndDatetime: '', // 게시종료일시
        clauseAgreementYn: '', // 약관동의사용여부
        clauseManagementSerialNumberContents: '', // 약관관리순번내용
        questionChargeSectionCode: '', // 설문요금구분코드
        questionCharge: 0, // 설문요금
        testTime: '', // 검사시간
        tnlUrl: '', // 썸네일URL
        targetTypeCode: '', // 대상유형구분코드
        targetCompanyCode: '', // 대상회사코드
        questionGuidescreenYn: '' // 설문안내화면여부
    }
@returns { code: String, data.list: Array }
*/
export const _registerQuestion = async (param) => {

    const url = `/common/api/v1/survey/registerQuestion`;
    let data = await $api.post(url, param);
    return data.data;
};

/**
@ 설문 상세조회
@param {
    "questionSerialNumber ": "설문시리얼넘버",
} params 
@returns { code: String, data.list: Array }
*/
export const _getQuestionDetail = async (serialNo) => {

    let data = await $api.get(`/common/api/v1/survey/getQuestionDetail/${serialNo}`);
    return data.data;
};

/**
@ 설문수정
@param {
    "serviceSectionCode": "string",
    "categorySerialNumber": 0,
    "questionSerialNumber": 0,
    "questionTitle": "string",
    "questionDescription": "string",
    "screenTypeSectionCode": "string",
    "pageQuestionItemCount": 0,
    "screenTrnsfEffectYn": "string",
    "useYn": "string",
    "markingTypeCode": "string",
    "postUpYn": "string",
    "postUpBeginDatetime": "string",
    "postUpEndDatetime": "string",
    "clauseAgreementYn": "string",
    "clauseManagementSerialNumberContents": "string",
    "questionChargeSectionCode": "string",
    "questionCharge": 0,
    "testTime": "string",
    "tnlUrl": "string",
    "targetTypeCode": "string",
    "targetCompanyCode": "string",
    "questionGuidescreenYn": "string",
    "questionItemIndicationList": [
        {
            "questionSerialNumber": 0,
            "questionItemSerialNumber": 0,
            "questionItemIndicationSerialNumber": 0
        }
    ]
} params 
@returns { code: String, data.list: Array }
*/
export const _modifyQuestion = async (param) => {

    let data = await $api.post('/common/api/v1/survey/modifyQuestion', param);
    return data.data;
};

/**
@ 설문 버전 업데이트
@param {
    "questionSerialNumber ": "설문시리얼넘버",
} params 
@returns { code: String, data.list: Array }
*/
export const _questionVersionUpdate = async (serialNo) => {
    let data = await $api.get(`/common/api/v1/survey/questionVersionUpdate/${serialNo}`);
    return data.data;
};

/**
@ 설문복사
@param {
    {
    "categorySerialNumber": 0,
    "questionSerialNumber": 0
    }
} params 
@returns { code: String, data.list: Array }
*/
export const _questionCopy = async (param) => {

    let data = await $api.post('/common/api/v1/survey/questionCopy', param);
    return data.data;
};

/**
@ 설문 발행등록
@param {
    "questionSerialNumber ": "설문시리얼넘버",
} params 
@returns { code: String, data.list: Array }
*/
export const _modifyQuestionPublication = async (serialNo) => {
    const param = {
        questionSerialNumber: serialNo
    };
    let data = await $api.post(`/common/api/v1/survey/modifyQuestionPublication/${serialNo}`, param);
    return data.data;
};