const stringToDate = (date) => {
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
@포인트정책관리_리스트
@param {
    pntIssSeCd: 발급구분코드
    pntPlcyNm: 정책명
    pntIssTyCd: 포인튜유형코드
    plcyStCd: 정책상태
    listType: 10일반조회 or 20승인조회
    currentPage: 페이지 번호,
    pageSize: 페이지 사이즈,
    rgsDtFr: 시작일자,
    rgsDtTo: 종료일자
} params 
@returns { code: String, data.list: Array }
*/
export const _getDcsPntPlcyList = async (params, type) => {
    const url = '/common/api/v1/point/policy/list';
    let data = await $api.post(url, params);
    for (var i = 0 ; i < data.data.data.list.length; i++) {
        var resData = data.data.data.list[i];
        resData.pntPlcyBgnDate = stringToDate(resData.pntPlcyBgnDate);
        resData.pntPlcyEndDate = stringToDate(resData.pntPlcyEndDate);
        resData.pntVldBgnDate = stringToDate(resData.pntVldBgnDate);
        resData.pntVldEndDate = stringToDate(resData.pntVldEndDate);
        resData.pntAmt = addComma(resData.pntAmt);
        resData.dplIssPsbYnNm = resData.dplIssPsbYn == 'Y' ? '허용' : '비허용' ;
        if (resData.dplIssPsbYn == 'Y') {
            resData.dplIssPsbTr = resData.dplStngSeCd == '209001' ? addComma(resData.dplIssPsbNum) + '일' : '일 최대 ' + addComma(resData.dplIssPsbNum) + '회';
            resData.dplIssPsbTr = resData.dplIssPsbNum ? resData.dplIssPsbTr : '';
        } else {
            resData.dplIssPsbTr = '';
        }
    }
    return data.data;
};

/**
@포인트정책이력_조회
@param {
    pntPlcyCd: 포인트 정책코드,
    rgsDtFr: 시작일자,
    rgsDtTo: 종료일자,
    currentPage: 페이지 번호
    pageSize: 페이지 사이즈,
} params 
@returns { code: String, data.list: Array }
*/
export const _getDcsPntPlcyHistList = async (params, type) => {
    const url = '/common/api/v1/point/policy/history/list';
    let data = await $api.post(url, params);
    return data.data;
};

/**
@포인트정책통계_조회
@param {
    pntPlcyCd: 포인트정책코드,
    rgsDtFr: 시작일자,
    rgsDtTo: 종료일자,
    pageSize: 페이지 사이즈,
    currentPage: 페이지 번호
} params 
@returns { code: String, data.list: Array }
*/
export const _getDcsPntPlcyStsList = async (params, type) => {
    const url = '/common/api/v1/point/policy/stats';
    let data = await $api.post(url, params);
    for (var i = 0 ; i < data.data.data.list.length; i++) {
        var resData = data.data.data.list[i];
        resData.totalPntAmt = addComma(resData.totalPntAmt);
        resData.totalIssCnt = addComma(resData.totalIssCnt);
        resData.issCnt = addComma(resData.issCnt);
        resData.issCnclCnt = addComma(resData.issCnclCnt);
        resData.issUsePntAmt = addComma(resData.issUsePntAmt);
        resData.issRemPntAmt = addComma(resData.issRemPntAmt);
        resData.issCnclPntAmt = addComma(resData.issCnclPntAmt);
    }
    return data.data;
};

/**
@포인트수동발급관리_승인완료정책_조회
@param {
    pntIssSeCd 발급구분코드,
    pntPlcyNm: 포인트정책명,
    rgsDtFr: 시작일자,
    rgsDtTo: 종료일자,
    pageSize: 페이지 사이즈,
    currentPage: 페이지 번호
} params 
@returns { code: String, data.list: Array }
*/
export const _getPntMnlIssMngList = async (params) => {
    let data = await $api.post('/common/api/v1/mna/iss/policy/list', params);
    for (var i = 0 ; i < data.data.data.list.length; i++) {
        var resData = data.data.data.list[i];
        resData.pntPlcyBgnDate = stringToDate(resData.pntPlcyBgnDate);
        resData.pntPlcyEndDate = stringToDate(resData.pntPlcyEndDate);
        resData.pntVldBgnDate = stringToDate(resData.pntVldBgnDate);
        resData.pntVldEndDate = stringToDate(resData.pntVldEndDate);
        resData.pntAmt = addComma(resData.pntAmt);
        resData.dplIssPsbYnNm = resData.dplIssPsbYn == 'Y' ? '허용' : '비허용';
        if (resData.dplIssPsbYn == 'Y') {
            resData.dplIssPsbTr = resData.dplStngSeCd == '209001' ? addComma(resData.dplIssPsbNum) + '일' : '일 최대 ' + resData.dplIssPsbNum.toLocaleString('ko') + '회';
            resData.dplIssPsbTr = resData.dplIssPsbNum ? resData.dplIssPsbTr : '';
        } else {
            resData.dplIssPsbTr = '';
        }
    }
    return data.data;
};

/**
@포인트수동발급관리_리스트_조회
@param {
    pntIssTyCd: 포인트유형코드,
    pntIssSeCd: 발급구분코드,
    issCmplTyCd: 지급상태코드,
    issStCd: 발급상태코드,
    rgsTyCd: 날짜구분,
    pntPlcyNm: 포인트정책명,
    listType : "10"(요청리스트)/"20"(승인리스트),
    rgsDtFr: 시작일자,
    rgsDtTo: 종료일자,
    pageSize: 페이지 사이즈,
    currentPage: 페이지 번호
} params 
@returns { code: String, data.list: Array }
*/
export const _getPntMnlIssList = async (params, type) => {
    const url = '/common/api/v1/mna/iss/list';
    let data = await $api.post(url, params);
    for (var i = 0 ; i < data.data.data.list.length; i++) {
        var resData = data.data.data.list[i];
        resData.pntAmt = addComma(resData.pntAmt);
        resData.issTgpNum = addComma(resData.issTgpNum);
        resData.pntPlcyBgnDate = stringToDate(resData.pntPlcyBgnDate);
        resData.pntPlcyEndDate = stringToDate(resData.pntPlcyEndDate);
    }
    return data.data;
};

/**
@발급내역관리_리스트
@param {
    listType: 10(요청리스트),20(승인리스트),
    searchDateKey: 일자종류 선택(발급일, 할당일, 유효기간시작일, 유효기간종료일),
    rgsDtFr: 시작일자,
    rgsDtTo: 종료일자,
    searchPntKey: 검색키 (포인트번호, 정책번호, 정책명),
    searchPntValue: 검색값,
    searchCustKey: 검색키,
    searchCustValue: 검색값,
    pntIssTyCd: 포인트유형코드,
    pntStCd: 포인트상태,
    maskingReleaseYn: 마스킹여부 "N"(마스킹)/"Y"(마스킹해제),
    pageSize: 페이지 사이즈,
    currentPage: 페이지 번호
} params 
@returns { code: String, data.list: Array }
*/
export const _getIssHistList = async (params, type) => {
    const url = '/common/api/v1/iss/hst/list';
    let data = await $api.post('/common/api/v1/iss/hst/list', params);
    for (var i = 0 ; i < data.data.data.list.length; i++) {
        var resData = data.data.data.list[i];
        resData.pntAmt = addComma(resData.pntAmt);
    }
    return data.data;
    
};

/**
@포인트정책관리_상세
@param {
    pntPlcyCd: 포인트정책코드
} params 
@returns { code: String, data: Object }
*/
export const _getDcsPntPlcyDetail = async (params) => {
    let data = await $api.get('/common/api/v1/point/policy/' + params.pntPlcyCd);
    let resData = data.data.data;
    resData.pntAmt = addComma(resData.pntAmt);
    resData.pntPlcyBgnDate = stringToDate(resData.pntPlcyBgnDate);
    resData.pntPlcyEndDate = stringToDate(resData.pntPlcyEndDate);
    resData.pntVldBgnDate = stringToDate(resData.pntVldBgnDate);
    resData.pntVldEndDate = stringToDate(resData.pntVldEndDate);
    return data.data;
};

/**
@포인트수동발급관리_상세
@param {
    cstPntIssMngSn: 고객포인트발급관리순번
} params 
@returns { code: String, data: Object }
*/
export const _getPntMnlIssDetail = async (params) => {
    let data = await $api.get('/common/api/v1/mna/iss/ById/' + params.cstPntIssMngSn);
    let resData = data.data.data;
    resData.pntAmt = addComma(resData.pntAmt);
    resData.issTgpNum = addComma(resData.issTgpNum);
    resData.pntPlcyBgnDate = stringToDate(resData.pntPlcyBgnDate);
    resData.pntPlcyEndDate = stringToDate(resData.pntPlcyEndDate);
    resData.pntVldBgnDate = stringToDate(resData.pntVldBgnDate);
    resData.pntVldEndDate = stringToDate(resData.pntVldEndDate);
    resData.bknIssDate = stringToDate(resData.bknIssDate);
    resData.issBstdDate = stringToDate(resData.issBstdDate);
    resData.dplIssPsbNum = resData.dplIssPsbNum ? resData.dplIssPsbNum : 0;
    resData.fstRgsDt = resData.fstRgsDt ? resData.fstRgsDt.substring(0, 10) : '';
    resData.athrRqstDt = resData.athrRqstDt ? resData.athrRqstDt.substring(0, 10) : '';
    resData.issAprvDt = resData.issAprvDt ? resData.issAprvDt.substring(0, 10) : '';
    resData.issCnclDt = resData.issCnclDt ? resData.issCnclDt.substring(0, 10) : '';
    return data.data;
};

/**
@발급내역_상세
@param {
    pntNoSn : 포인트번호순번
} params 
@returns { code: String, data: Object }
*/
export const _getIsshistDetail = async (params) => {
    let data = await $api.get('/common/api/v1/iss/hst/list/' + params.pntNoSn);
    let resData = data.data.data;
    resData.pntAmt = addComma(resData.pntAmt);
    resData.pntVldBgnDate = stringToDate(resData.pntVldBgnDate);
    resData.pntVldEndDate = stringToDate(resData.pntVldEndDate);
    return data.data;
};

/**
@회원찾기_리스트_조회
@param {
    searchKey: 검색키 (이름, 아이디, 회원번호, 이메일, 휴대전화번호),
    searchValue: 검색값,
    mbrSexCd: 성별(남성, 여성),
    aggpCd: 연령대,
    mbrJnDtFr: 가입일자 시작일자,
    mbrJnDtTo: 가입일자 종료일자,
    pageSize: 페이지 사이즈,
    currentPage: 페이지 번호
} params 
@returns { code: String, data.list: Array }
*/
export const _getMnlIssUser = async (params) => {
    let data = await $api.post('/common/api/v1/user/userList', params);
    return data.data;
};

/**
@승인자_리스트_조회
@param {
    searchKey: 검색키(이름, 아이디, 이메일),
    searchValue: 검색값,
    pageSize: 페이지 사이즈,
    currentPage: 페이지 번호
} params 
@returns { code: String, data.list: Array }
*/
export const _getAprvList = async (params) => {
    let data = await $api.post('/common/api/v1/adminMemberManagement/kbhcAdmin/list', params);
    return data.data;
};

/**
@발급대상자_조회_파일업로드
@param {
    file: 파일데이터
} params 
@returns { code: String, data: Object }
*/
export const _getIssTrgInfo = async (params) => {
    let data = await $api.post('/common/api/v1/mna/iss/user/excel', params);
    return data.data;
};

/**
@B2C전체회원_발급대상자_조회
@param {
    issBstdDate : 발급기준일자
} params 
@returns { code: String, data: Object }
*/
export const _getIssB2CTrgInfo = async (params) => {
    let data = await $api.get('/common/api/v1/mna/iss/user/' + params);
    return data.data;
};

/**
@공통_사유란_SelectBtn
@param {
    grpCd : 공통코드
} params 
@returns { code: String, data: Object }
*/
export const _getCmmMenu = async (params) => {
    let data = await $api.get('/common/api/v1/standardManagement/commonCode/childrenList/' + params.uprGrpCd);
    return data.data;
};

/**
@회원그룹_조회
@param {
    size: 10,
    offset: 0,
    admnPtnrTyCd: "111001(All) / 111002(Payer) / 111003(Seller) / 111004(Medical) / 111005(Developer)",
    cnSercSe: "조건검색구분 (mbrGrpNm: 그룹명, mbrGrpDscr: 그룹설명)",
    cnSercCts: "조건검색내용",
    orderType: "mbrGrpNm(그룹명) / fstRgsDt(최초등록일시) / lastClctDt(최종수집일시)",
    orderSort: "desc / asc",
    menuCode: "1016000 - 다운로드 기능을 호출한 화면의 메뉴코드",
    page: 0
} params 
@returns { code: String, data: Object }
*/
export const _getUserGroupList = async (params) => {
    let data = await $api.post('/common/api/v1/userMemberGroup/list', params);
    return data.data;
};


/**
@포인트정책_등록
@param {
    pntPlcyNm: 포인트정책명,
    pntPlcyDscr: 포인트정책설명,
    pntPlcyCrtRsn: 포인트정책생성사유,
    pntPlcyBgnDate: 정책기간 시작일자,
    pntPlcyEndDate: 정책기간 종료일자,
    pntIssTyCd: 포인트유형코드,
    pntIssSeCd: 발급구분코드,
    pntAmt: 포인트,
    dplIssPsbYn: 중복여부("Y","N"),
    dplStngSeCd: 중복설정구분코드,
    dplIssPsbNum: 중복발급가능수,
    pntIssLmtCnt: 발행한도,
    pntVldTrStngCd: 포인트유횽기간설정코드,
    pntVldTrSeCd: 설정기간구분코드,
    pntVldTr: 포인트유효기간,
    pntVldBgnDate: 포인트유효기간 시작일자,
    pntVldEndDate: 포인트유효기간 종료일자,
    plcyCrtrNm: 정책생성자명,
    plcyCrtDpnm: 정책상성부서명,
    pntCtgrMjcsCd: 카테고리 대분류
    pntCtgrMdcsCd: 카테고리 중분류
} params  
@returns { data.code: String }
*/
export const _setDcsPntPlcyReg = async (params) => {
    return await $api.post('/common/api/v1/point/policy/create', params);
};

/**
@포인트정책_수정
@param {
    pntPlcyCd: 포인트정책코드,
    pntPlcyNm: 포인트정책명,
    pntPlcyDscr: 포인트정책설명,
    pntPlcyCrtRsn: 포인트정책생성사유,
    pntPlcyBgnDate: 정책기간 시작일자,
    pntPlcyEndDate: 정책기간 종료일자,
    pntIssTyCd: 포인트유형코드,
    pntIssSeCd: 발급구분코드,
    pntAmt: 포인트,
    dplIssPsbYn: 중복여부("Y","N"),
    dplStngSeCd: 중복설정구분코드,
    dplIssPsbNum: 중복발급가능수,
    pntIssLmtCnt: 발행한도,
    pntVldTrStngCd: 포인트유횽기간설정코드,
    pntVldTrSeCd: 설정기간구분코드,
    pntVldTr: 포인트유효기간,
    pntVldBgnDate: 포인트유효기간 시작일자,
    pntVldEndDate: 포인트유효기간 종료일자,
    pntCtgrMjcsCd: 카테고리 대분류
    pntCtgrMdcsCd: 카테고리 중분류
} params  
@returns { data.code: String }
*/
export const _setDcsPntPlcyMod = async (params) => {
    return await $api.post('/common/api/v1/point/policy/update', params);
};

/**
@승인결재_요청
@param {
    athrRqstCdArr": 요청대상리스트
    athrTypCd: 승인타입코드,
    athrStCd: 승인상태코드,
    athrPsbId: 승인대상자아이디,
    athrRqstId: 승인요청자아이디,
    fstRgtrSn: 등록자계정번호
} params  
@returns { data.code: String }
*/
export const _setAthrAprvReq = async (params) => {
    let data = await $api.post('/common/api/v1/athr/aprv/req', params);
    return data;
};

/**
@승인결재_결과
@param {
    athrInfArr": 승인대상리스트,
    athrTypCd: 승인타입코드,
    athrStCd: 승인상태코드,
    athrMnId: 승인자아이디,
    athrTdnRsn: 사유
} params  
@returns { data.code: String }
*/
export const _setAthrAprvRes = async (params) => {
    let data = await $api.post('/common/api/v1/athr/aprv/res', params);
    return data;
};

/**
@포인트_수동발급_등록
@param {
    pntPlcyCd: 포인트정책코드,
    issDtSeCd: 발급일시구분코드,
    bknIssDate: 예약발급일자,
    issTrgCd: 발급대상자코드(B2C전체, 회원조회, 회원그룹),
    mbrSnArr: 발급대상자,
    mbrGrpCd: 대상자그룹코드,
    issTrgUpldFnm: 파입이름,
    issTrgUpldFlPtnm: : ,
    fstRgtrSn: 등록자계정번호,
} params  
@returns { data.code: String }
*/
export const _setPntMnlIssReg = async (params) => {
    return await $api.post('/common/api/v1/mna/iss/create', params);
};

/**
@포인트수동발급_수정
@param {
    cstPntIssMngSn: 고객포인트발급관리순번,
    pntPlcyCd: 포인트정책코드,
    issDtSeCd: 발급일시구분코드,
    bknIssDate: 예약발급일자,
    issTrgCd: 발급대상자코드(B2C전체, 회원조회, 회원그룹),
    mbrSnArr: 발급대상자,
    mbrGrpCd: 대상자그룹코드,
    issTrgUpldFnm: 파입이름,
    issTrgUpldFlPtnm: : ,
    lastUpdrSn : 수정자계정번호
} params  
@returns { data.code: String }
*/
export const _setPntMnlIssMod = async (params) => {
    return await $api.post('/common/api/v1/mna/iss/update', params);
};
