export const searchCode = {
    //사업자유형
    bzmTyCd: [
        { cmnCdNm: '법인사업자', value: '221001', cmnCd: '221001', uprGrpCd: '221000' },
        { cmnCdNm: '개인사업자', value: '221002', cmnCd: '221002', uprGrpCd: '221000' }
    ],
    bzmTyCdtype1: [
        { cmnCdNm: '면세사업자', value: '221003', cmnCd: '221003', uprGrpCd: '221002' },
        { cmnCdNm: '과세사업자', value: '221004', cmnCd: '221004', uprGrpCd: '221002' }
    ],
    bzmTyCdtype2: [
        { cmnCdNm: '일반사업자', value: '221005', cmnCd: '221005', uprGrpCd: '221001' },
        { cmnCdNm: '간이사업자', value: '221006', cmnCd: '221006', uprGrpCd: '221001' },
        { cmnCdNm: '면세사업자', value: '221007', cmnCd: '221006', uprGrpCd: '221001' }
    ],
    //메일코드
    mailType2: [
        { cmnCdNm: 'kbhc.co.kr', value: '103015', cmnCd: '103015', uprGrpCd: '103000' },
        { cmnCdNm: 'gmail.com', value: '103001', cmnCd: '103001', uprGrpCd: '103000' },
        { cmnCdNm: 'kbfg.com', value: '103002', cmnCd: '103002', uprGrpCd: '103000' },
        { cmnCdNm: 'adoc.co.kr', value: '103004', cmnCd: '103004', uprGrpCd: '103000' },
        { cmnCdNm: 'huno.kr', value: '103005', cmnCd: '103005', uprGrpCd: '103000' },
        { cmnCdNm: 'aaihc.com', value: '103006', cmnCd: '103006', uprGrpCd: '103000' },
        { cmnCdNm: 'theragenbio.com', value: '103007', cmnCd: '103007', uprGrpCd: '103000' },
        { cmnCdNm: 'daum.net', value: '103008', cmnCd: '103008', uprGrpCd: '103000' },
        { cmnCdNm: 'hotmail.com', value: '103009', cmnCd: '103009', uprGrpCd: '103000' },
        { cmnCdNm: 'lycos.co.kr', value: '103010', cmnCd: '103010', uprGrpCd: '103000' },
        { cmnCdNm: 'nate.com', value: '103011', cmnCd: '103011', uprGrpCd: '103000' },
        { cmnCdNm: 'naver.com', value: '103012', cmnCd: '103012', uprGrpCd: '103000' },
        { cmnCdNm: 'paran.com', value: '103013', cmnCd: '103013', uprGrpCd: '103000' },
        { cmnCdNm: '직접입력', value: '103014', cmnCd: '103014', uprGrpCd: '103000' }
    ],
    //은행 코드
    bkcd: [
        { cmnCdNm: '선택하세요', value: '', cmnCd: '', uprGrpCd: '101000' },
        { cmnCdNm: '경남은행', value: '101001', cmnCd: '101001', uprGrpCd: '101000' },
        { cmnCdNm: '광주은행', value: '101002', cmnCd: '101002', uprGrpCd: '101000' },
        { cmnCdNm: '단위농협', value: '101003', cmnCd: '101003', uprGrpCd: '101000' },
        { cmnCdNm: '부산은행', value: '101004', cmnCd: '101004', uprGrpCd: '101000' },
        { cmnCdNm: '새마을금고', value: '101005', cmnCd: '101005', uprGrpCd: '101000' },
        { cmnCdNm: '산림조합', value: '101006', cmnCd: '101006', uprGrpCd: '101000' },
        { cmnCdNm: '신한은행', value: '101007', cmnCd: '101007', uprGrpCd: '101000' },
        { cmnCdNm: '신협', value: '101008', cmnCd: '101008', uprGrpCd: '101000' },
        { cmnCdNm: '씨티은행', value: '101009', cmnCd: '101009', uprGrpCd: '101000' },
        { cmnCdNm: '우리은행', value: '101010', cmnCd: '101010', uprGrpCd: '101000' },
        { cmnCdNm: '우체국예금보험', value: '101011', cmnCd: '101011', uprGrpCd: '101000' },
        { cmnCdNm: '전북은행회', value: '101013', cmnCd: '101013', uprGrpCd: '101000' },
        { cmnCdNm: '제주은행', value: '101014', cmnCd: '101014', uprGrpCd: '101000' },
        { cmnCdNm: '카카오뱅크', value: '101015', cmnCd: '101015', uprGrpCd: '101000' },
        { cmnCdNm: '케이뱅크', value: '101016', cmnCd: '101016', uprGrpCd: '101000' },
        { cmnCdNm: '토스뱅크', value: '101017', cmnCd: '101017', uprGrpCd: '101000' },
        { cmnCdNm: '하나은행', value: '101018', cmnCd: '101018', uprGrpCd: '101000' },
        { cmnCdNm: '홍콩상하이은행', value: '101019', cmnCd: '101019', uprGrpCd: '101000' },
        { cmnCdNm: 'IBK기업은행', value: '101020', cmnCd: '101020', uprGrpCd: '101000' },
        { cmnCdNm: 'KB국민은행', value: '101021', cmnCd: '101021', uprGrpCd: '101000' },
        { cmnCdNm: 'DGB대구은행', value: '101022', cmnCd: '101022', uprGrpCd: '101000' },
        { cmnCdNm: 'KDB산업은행', value: '101023', cmnCd: '101023', uprGrpCd: '101000' },
        { cmnCdNm: 'NH농협은행', value: '101024', cmnCd: '101024', uprGrpCd: '101000' },
        { cmnCdNm: 'SC제일은행', value: '101025', cmnCd: '101025', uprGrpCd: '101000' },
        { cmnCdNm: 'Sh수협은행', value: '101026', cmnCd: '101026', uprGrpCd: '101000' }
    ],
    //지역번호코드
    rprsTlnoFno: [
        { cmnCdNm: '02', value: '102001', cmnCd: '102001', uprGrpCd: '102000' },
        { cmnCdNm: '031', value: '102002', cmnCd: '102002', uprGrpCd: '102000' },
        { cmnCdNm: '032', value: '102003', cmnCd: '102003', uprGrpCd: '102000' },
        { cmnCdNm: '033', value: '102004', cmnCd: '102004', uprGrpCd: '102000' },
        { cmnCdNm: '041', value: '102005', cmnCd: '102005', uprGrpCd: '102000' },
        { cmnCdNm: '042', value: '102006', cmnCd: '102006', uprGrpCd: '102000' },
        { cmnCdNm: '043', value: '102007', cmnCd: '102007', uprGrpCd: '102000' },
        { cmnCdNm: '044', value: '102008', cmnCd: '102008', uprGrpCd: '102000' },
        { cmnCdNm: '051', value: '102009', cmnCd: '102009', uprGrpCd: '102000' },
        { cmnCdNm: '052', value: '102010', cmnCd: '102010', uprGrpCd: '102000' },
        { cmnCdNm: '053', value: '102011', cmnCd: '102011', uprGrpCd: '102000' },
        { cmnCdNm: '054', value: '102012', cmnCd: '102012', uprGrpCd: '102000' },
        { cmnCdNm: '055', value: '102013', cmnCd: '102013', uprGrpCd: '102000' },
        { cmnCdNm: '061', value: '102014', cmnCd: '102014', uprGrpCd: '102000' },
        { cmnCdNm: '062', value: '102015', cmnCd: '102015', uprGrpCd: '102000' },
        { cmnCdNm: '063', value: '102016', cmnCd: '102016', uprGrpCd: '102000' },
        { cmnCdNm: '064', value: '102017', cmnCd: '102017', uprGrpCd: '102000' }
    ],
    //상품타입
    ptnrSelrSvcTyCd: [
        { cmnCdNm: '전체', value: '', cmnCd: '', uprGrpCd: '112000' },
        { cmnCdNm: '상품', value: '112001', cmnCd: '112001', uprGrpCd: '112000' },
        { cmnCdNm: '서비스', value: '112002', cmnCd: '112002', uprGrpCd: '112000' },
        { cmnCdNm: '상품&서비스', value: '112003', cmnCd: '112003', uprGrpCd: '112000' }
    ],
    //표시타입
    noticeCategoryCd: [
        { cmnCdNm: '즉시노출', value: '132001', cmnCd: '132001', uprGrpCd: '132000' },
        { cmnCdNm: '예약노출', value: '132002', cmnCd: '132002', uprGrpCd: '132000' },
        { cmnCdNm: '비노출', value: '132003', cmnCd: '132003', uprGrpCd: '132000' }
    ],
    //공지승인상태코드
    approvalStatusCd: [
        { cmnCdNm: '승인요청', value: '135001', cmnCd: '135001', uprGrpCd: '135000' },
        { cmnCdNm: '승인', value: '135002', cmnCd: '135002', uprGrpCd: '135000' },
        { cmnCdNm: '반려', value: '135003', cmnCd: '135003', uprGrpCd: '135000' }
    ],
    //공지대상코드
    noticeTarget: [
        { cmnCdNm: '전체', value: '134001', cmnCd: '134001', uprGrpCd: '134000' },
        { cmnCdNm: '공지대상 Payer', value: '134002', cmnCd: '134002', uprGrpCd: '134000' },
        { cmnCdNm: '공지대상 Seller', value: '134003', cmnCd: '134003', uprGrpCd: '134000' },
        { cmnCdNm: '공지대상 Medical', value: '134004', cmnCd: '134004', uprGrpCd: '134000' },
        { cmnCdNm: '공지대상 Developer', value: '134005', cmnCd: '134005', uprGrpCd: '134000' }
    ],

    noticeCategoryCdBC: [
        { cmnCdNm: '일반', value: '227006', cmnCd: '227006', uprGrpCd: '227005' },
        { cmnCdNm: '서비스', value: '227007', cmnCd: '227007', uprGrpCd: '227005' },
        { cmnCdNm: '커머스', value: '227008', cmnCd: '227008', uprGrpCd: '227005' },
        { cmnCdNm: '메디컬/디벨로퍼', value: '227009', cmnCd: '227009', uprGrpCd: '227005' },
        { cmnCdNm: '루틴/커뮤니티/챌린지', value: '227010', cmnCd: '227010', uprGrpCd: '227005' },
        { cmnCdNm: '이벤트/프로모션', value: '227011', cmnCd: '227011', uprGrpCd: '227005' },
        { cmnCdNm: '기타', value: '227012', cmnCd: '227012', uprGrpCd: '227005' }
    ],
    //공지대상코드(시스템)
    noticeTargetSystem: [
        { cmnCdNm: '전체', value: '', cmnCd: '', uprGrpCd: '156000' },
        { cmnCdNm: '웰니스', value: '134001', cmnCd: '134002', uprGrpCd: '156000' },
        { cmnCdNm: '메디컬', value: '134002', cmnCd: '134002', uprGrpCd: '156000' },
        { cmnCdNm: '파트너어드민', value: '134002', cmnCd: '134002', uprGrpCd: '156000' }
    ],
    //시스템 공지타입
    noticeTypeCd: [
        { cmnCdNm: '시스템 정기점검', value: '155001', cmnCd: '155001', uprGrpCd: '155000' },
        { cmnCdNm: '시스템 장애', value: '155002', cmnCd: '155002', uprGrpCd: '155000' }
    ],
    //사유코드
    reJoinCD: [
        { cmnCdNm: '사업자등록증정보불일치', value: '160001', cmnCd: '160001', uprGrpCd: '160000' },
        { cmnCdNm: '법인계좌정보불일치', value: '160002', cmnCd: '160002', uprGrpCd: '160000' },
        { cmnCdNm: '기타기업정보불일치', value: '160003', cmnCd: '160003', uprGrpCd: '160000' },
        { cmnCdNm: '첨부서류미비', value: '160004', cmnCd: '160004', uprGrpCd: '160000' },
        { cmnCdNm: '미계약업체', value: '160005', cmnCd: '160005', uprGrpCd: '160000' }
    ],
    //사유코드
    declineReasonCd: [
        { cmnCdNm: '내용 검토 필요', value: '227022', cmnCd: '227022', uprGrpCd: '227021' },
        { cmnCdNm: '대상 검토 필요', value: '227023', cmnCd: '227023', uprGrpCd: '227021' }
    ],
    //회원상태코드
    mbrStCd: [
        { cmnCdNm: '정상', value: '104001', cmnCd: '104001', uprGrpCd: '104000' }
        // 삭제
        // { cmnCdNm: '탈퇴', value: '104002', cmnCd: '104002', uprGrpCd: '104000' },
        // { cmnCdNm: '유효기간 만료탈퇴', value: '104004', cmnCd: '104004', uprGrpCd: '104000' },
        // { cmnCdNm: '불량', value: '104005', cmnCd: '104005', uprGrpCd: '104000' },
        // { cmnCdNm: '불량확정 강제탈퇴', value: '104006', cmnCd: '104006', uprGrpCd: '104000' }

        // 2차 대상
        // { cmnCdNm: '자격상실', value: '104007', cmnCd: '104007', uprGrpCd: '104000' }
    ],
    //성별코드
    mbrSexCd: [
        { cmnCdNm: '남성', value: '109001', cmnCd: '109001', uprGrpCd: '109000' },
        { cmnCdNm: '여성', value: '109002', cmnCd: '109002', uprGrpCd: '109000' }
    ],
    //연령대
    agelist: [
        // { cmnCdNm: '10대', value: '283001', cmnCd: '283001', uprGrpCd: '283000' },
        { cmnCdNm: '10대', value: '283002', cmnCd: '283002', uprGrpCd: '283000' },
        { cmnCdNm: '20대', value: '283003', cmnCd: '283003', uprGrpCd: '283000' },
        { cmnCdNm: '30대', value: '283004', cmnCd: '283004', uprGrpCd: '283000' },
        { cmnCdNm: '40대', value: '283005', cmnCd: '283005', uprGrpCd: '283000' },
        { cmnCdNm: '50대', value: '283006', cmnCd: '283006', uprGrpCd: '283000' },
        { cmnCdNm: '60대', value: '283007', cmnCd: '283007', uprGrpCd: '283000' },
        { cmnCdNm: '70대', value: '283008', cmnCd: '283008', uprGrpCd: '283000' },
        { cmnCdNm: '80대', value: '283009', cmnCd: '283009', uprGrpCd: '283000' },
        { cmnCdNm: '90대', value: '283010', cmnCd: '283010', uprGrpCd: '283000' }
    ],
    frcdScsnTrgRsnTypCd: [
        { cmnCdNm: '회원정보 허위기재', value: '225001', cmnCd: '225001', uprGrpCd: '225000' },
        { cmnCdNm: '오케어 혜택 부정이용', value: '225002', cmnCd: '225002', uprGrpCd: '225000' },
        { cmnCdNm: '서비스운영 지장초래', value: '225003', cmnCd: '225003', uprGrpCd: '225000' },
        { cmnCdNm: '공공질서/미풍양속 저해', value: '225004', cmnCd: '225004', uprGrpCd: '225000' },
        { cmnCdNm: '이용목적과 다른 목적의 서비스이용', value: '225005', cmnCd: '225005', uprGrpCd: '225000' },
        { cmnCdNm: '규정/이용조건위반', value: '225006', cmnCd: '225006', uprGrpCd: '225000' },
        { cmnCdNm: '타인명의도용', value: '225007', cmnCd: '225007', uprGrpCd: '225000' },
        { cmnCdNm: '범죄목적 관련행위', value: '225008', cmnCd: '225008', uprGrpCd: '225000' },
        { cmnCdNm: '해킹행위', value: '225009', cmnCd: '225009', uprGrpCd: '225000' },
        { cmnCdNm: '법령상구속조치 위반행위', value: '225010', cmnCd: '225010', uprGrpCd: '225000' },
        { cmnCdNm: '회원사망', value: '225011', cmnCd: '225011', uprGrpCd: '225000' }
    ],

    fultRsnCd: [
        { cmnCdNm: 'CS', value: '226008', cmnCd: '226008', uprGrpCd: '226000' },
        { cmnCdNm: '회원정보 허위기재', value: '226001', cmnCd: '226001', uprGrpCd: '226000' },
        { cmnCdNm: '오케어혜택 부정이용', value: '226002', cmnCd: '226002', uprGrpCd: '226000' },
        { cmnCdNm: '서비스운영 지장초래', value: '226003', cmnCd: '226003', uprGrpCd: '226000' },
        { cmnCdNm: '공공질서/미풍양속저해', value: '226004', cmnCd: '226004', uprGrpCd: '226000' },
        { cmnCdNm: '이용목적과 다른 목적의 서비스이용', value: '226005', cmnCd: '226005', uprGrpCd: '226000' },
        { cmnCdNm: '규정/이용조건위반', value: '226006', cmnCd: '226006', uprGrpCd: '226000' },
        { cmnCdNm: '강제탈퇴 대상자 지정(소명기간)', value: '226007', cmnCd: '226007', uprGrpCd: '226000' }
    ],
    bnrTyCd: [
        { cmnCdNm: '메인배너', value: '268002', cmnCd: '268002', uprGrpCd: '268001' },
        { cmnCdNm: '띠배너', value: '268003', cmnCd: '268003', uprGrpCd: '268001' }
    ],
    prgStCd: [
        { cmnCdNm: '대기', value: '271002', cmnCd: '271002', uprGrpCd: '271001' },
        { cmnCdNm: '진행중', value: '271003', cmnCd: '271003', uprGrpCd: '271001' },
        { cmnCdNm: '종료', value: '271004', cmnCd: '271004', uprGrpCd: '271001' }
    ],
    prgStCd2: [
        { cmnCdNm: '대기', value: '271006', cmnCd: '271006', uprGrpCd: '271001' },
        { cmnCdNm: '진행중', value: '271007', cmnCd: '271007', uprGrpCd: '271001' },
        { cmnCdNm: '종료', value: '271008', cmnCd: '271008', uprGrpCd: '271001' }
    ],
    indnTrg: [
        { cmnCdNm: 'B2C회원', value: '274002', cmnCd: '274002', uprGrpCd: '274001' },
        { cmnCdNm: '회원그룹', value: '274003', cmnCd: '274003', uprGrpCd: '274001' }
    ],
    indnTrgPopup: [
        { cmnCdNm: 'B2C회원', value: '274002', cmnCd: '274002', uprGrpCd: '274001' },
        { cmnCdNm: '회원그룹', value: '274003', cmnCd: '274003', uprGrpCd: '274001' }
    ],
    indnStCd: [

        { cmnCdNm: '노출', value: '270002', cmnCd: '270002', uprGrpCd: '270001' },
        { cmnCdNm: '비노출', value: '270003', cmnCd: '270003', uprGrpCd: '270001' }
    ],
    indnStCd1: [
        { cmnCdNm: '노출', value: '270005', cmnCd: '270005', uprGrpCd: '270004' },
        { cmnCdNm: '비노출', value: '270006', cmnCd: '270006', uprGrpCd: '270004' }
    ],
    popupTyCd: [
        { cmnCdNm: '바텀팝업', value: '268005', cmnCd: '268005', uprGrpCd: '268004' },
        { cmnCdNm: '레이어팝업', value: '268006', cmnCd: '268006', uprGrpCd: '268004' },
        { cmnCdNm: '전면노출팝업', value: '268007', cmnCd: '268007', uprGrpCd: '268004' }
    ],
    indnOsSeCd: [
        { cmnCdNm: '전체', value: '', cmnCd: '', uprGrpCd: '275000' },
        { cmnCdNm: 'iOS', value: '275001', cmnCd: '275001', uprGrpCd: '275000' },
        { cmnCdNm: 'Android', value: '275002', cmnCd: '275002', uprGrpCd: '275000' }
    ],
    indnLctSeCd: [ // 배너
        { cmnCdNm: '전체', value: '', cmnCd: '', uprGrpCd: '269002' },
        { cmnCdNm: '투데이', value: '269003', cmnCd: '269003', uprGrpCd: '269022' },
        { cmnCdNm: '건강', value: '269005', cmnCd: '269005', uprGrpCd: '269022' },
        { cmnCdNm: '챌린지', value: '269007', cmnCd: '269007', uprGrpCd: '269022' },
        { cmnCdNm: '커뮤니티', value: '269009', cmnCd: '269009', uprGrpCd: '269022' }
    ],
    indnLctSeCd2: [ // 팝업
        { cmnCdNm: '전체', value: '', cmnCd: '', uprGrpCd: '269022' },
        { cmnCdNm: '투데이', value: '269023', cmnCd: '269023', uprGrpCd: '269022' },
        { cmnCdNm: '건강', value: '269024', cmnCd: '269024', uprGrpCd: '269022' },
        { cmnCdNm: '챌린지', value: '269025', cmnCd: '269025', uprGrpCd: '269022' },
        { cmnCdNm: '커뮤니티', value: '269026', cmnCd: '269026', uprGrpCd: '269022' }
    ],
    faqcategory: [
        { cmnCdNm: '일반(이용)', value: '159001', cmnCd: '159001', uprGrpCd: '159000' },
        { cmnCdNm: '혜택', value: '159002', cmnCd: '159002', uprGrpCd: '159000' },
        { cmnCdNm: '건강검진', value: '159003', cmnCd: '159003', uprGrpCd: '159000' },
        { cmnCdNm: '건강기록', value: '159004', cmnCd: '159004', uprGrpCd: '159000' },
        { cmnCdNm: '건강뉴스', value: '159005', cmnCd: '159005', uprGrpCd: '159000' },
        // { cmnCdNm: '제휴 서비스', value: '159006', cmnCd: '159006', uprGrpCd: '159000' },
        // { cmnCdNm: 'KB 오케어몰', value: '159007', cmnCd: '159007', uprGrpCd: '159000' },
        { cmnCdNm: '메디컬문의', value: '159008', cmnCd: '159008', uprGrpCd: '159000' },
        { cmnCdNm: '기타', value: '159009', cmnCd: '159009', uprGrpCd: '159000' }
    ]
};

export default searchCode;