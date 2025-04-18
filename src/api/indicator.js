// 누적가입자
export const _getCumulativeSubscriber = async (params) => {
    return await $api.get('/common/api/v1/statics/cumulative-subscriber', {params});
};

// 누적가입자 엑셀
export const _getCumulativeSubscriberExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/cumulative-subscriber/excel', params);
};

// 누적탈퇴자
export const _getCumulativeWithdrawal = async (params) => {
    return await $api.get('/common/api/v1/statics/cumulative-withdrawal', {params});
};

// 누적탈퇴자 엑셀
export const _getCumulativeWithdrawalExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/cumulative-withdrawal/excel', params);
};

// 신규가입자
export const _getCumulativeNewSubscriber = async (params) => {
    return await $api.get('/common/api/v1/statics/new-subscriber', {params});
};

// 신규가입자 엑셀
export const _getCumulativeNewSubscriberExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/new-subscriber/excel', params);
};

// 신규탈퇴자
export const _getCumulativeNewWithdrawal = async (params) => {
    return await $api.get('/common/api/v1/statics/new-withdrawal', {params});
};

// 신규탈퇴자 엑셀
export const _getCumulativeNewWithdrawalExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/new-withdrawal/excel', params);
};

// 이벤트진행 및 종료현황
export const _getEventPresentSituation = async (params) => {
    return await $api.get('/common/api/v1/statics/event-present-situation', {params});
};

// 이벤트진행 및 종료현황 엑셀
export const _getEventPresentSituationExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/event-present-situation/excel', params);
};

// 이벤트대상자 및 열람자참여율
export const _getEventTargetParticipation = async (params) => {
    return await $api.get('/common/api/v1/statics/event-target-participation', {params});
};

// 이벤트대상자 및 열람자참여율 엑셀
export const _getEventTargetParticipationExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/event-target-participation/excel', params);
};

// 파트너가입 및 승인
export const _getPartnerJoinApproval = async (params) => {
    return await $api.get('/common/api/v1/statics/partner-join-approval', {params});
};

// 파트너가입 및 승인 엑셀
export const _getPartnerJoinApprovalExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/partner-join-approval/excel', params);
};

// 파트너부계정권한승인
export const _getPartnerSubAccountApproval = async (params) => {
    return await $api.get('/common/api/v1/statics/partner-sub-account-approval', {params});
};

// 파트너부계정권한승인 엑셀
export const _getPartnerSubAccountApprovalExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/partner-sub-account-approval/excel', params);
};

// VOC처리현황
export const _getVocInquiryProcess = async (params) => {
    return await $api.get('/common/api/v1/statics/voc-inquiry-process', {params});
};

// VOC처리현황 엑셀
export const _getVocInquiryProcessExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/voc-inquiry-process/excel', params);
};

// VOC문의유형
export const _getVocInquiryType = async (params) => {
    return await $api.get('/common/api/v1/statics/voc-inquiry-type', {params});
};

// VOC문의유형 엑셀
export const _getVocInquiryTypeExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/voc-inquiry-type/excel', params);
};

// VOC문의담당사
export const _getVocInquiryChargeCompanyType = async (params) => {
    return await $api.get('/common/api/v1/statics/voc-inquiry-charge-company', {params});
};

// VOC문의담당사 엑셀
export const _getVocVocInquiryChargeCompanyTypeExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/voc-inquiry-charge-company/excel', params);
};

// VOC문의이관사
export const _getVocInquiryTransferCompany = async (params) => {
    return await $api.get('/common/api/v1/statics/voc-inquiry-transfer-company', {params});
};

// VOC문의이관사 엑셀
export const _getVocInquiryTransferCompanyExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/voc-inquiry-transfer-company/excel', params);
};

// 모바일OS분포
export const _getOsDistribution = async (params) => {
    return await $api.get('/common/api/v1/statics/os-distribution', {params});
};

// 모바일OS분포 엑셀
export const _getOsDistributionExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/os-distribution/excel', params);
};

// 디바이스분포
export const _getDeviceDistribution = async (params) => {
    return await $api.get('/common/api/v1/statics/device-distribution', {params});
};

// 디바이스분포 엑셀
export const _getDeviceDistributionExcel = async (params) => {
    return await $api.post('/common/api/v1/statics/device-distribution/excel', params);
};

// 리워드포인트 지급완료 현황
export const _getRewardPointAcqstStatus = async (params) => {
    return await $api.get('/common/api/v1/statics/reward-point-acqst-status', {params});
};

// 리워드포인트 지급 정책
export const _getRewardPointPayPolicy = async (params) => {
    return await $api.get('/common/api/v1/statics/reward-point-pay-policy', {params});
};

// 리워드포인트 지급 정책
export const _getRewardPointIssueExhaust = async (params) => {
    return await $api.get('/common/api/v1/statics/reward-point-issue-exhaust', {params});
};

// 흡연
export const _getSmokingAmount = async (params) => {
    return await $api.get('/common/api/v1/statics/smoking-amount', {params});
};

// 식사
export const _getMealAmount = async (params) => {
    return await $api.get('/common/api/v1/statics/meal-amount', {params});
};

// 성별 및 연령대
export const _getGenderAgeRange = async (params) => {
    return await $api.get('/common/api/v1/statics/gender-age-range', {params});
};

// 성별 및 연령대
export const _getRewardPointAcqstCategory = async (params) => {
    return await $api.get('/common/api/v1/statics/reward-point-acqst-category', {params});
};

// 평균 걸음수
export const _getAverageStepCount = async (params) => {
    return await $api.get('/common/api/v1/statics/average-step-count', {params});
};

// 평균 수면시간
export const _getAverageSleepTime = async (params) => {
    return await $api.get('/common/api/v1/statics/average-sleep-time', {params});
};

// 감정
export const _getFeeling = async (params) => {
    return await $api.get('/common/api/v1/statics/feeling', {params});
};

// 운동
export const _getExercise = async (params) => {
    return await $api.get('/common/api/v1/statics/exercise', {params});
};

// 평균 체성분
export const _getAverageBodyComposition = async (params) => {
    return await $api.get('/common/api/v1/statics/average-body-composition', {params});
};

// 음주
export const _getDrinking = async (params) => {
    return await $api.get('/common/api/v1/statics/drinking', {params});
};

// 인기 건강뉴스 선호도
export const _getHealthNews = async (params) => {
    return await $api.get('/common/api/v1/statics/health-news', {params});
};

// 인기 챌린지 선호도
export const _getChallenge = async (params) => {
    return await $api.get('/common/api/v1/statics/challenge', {params});
};

// mau, wau, dau
export const _getServiceAccessUsage = async (params) => {
    return await $api.get('/common/api/v1/statics/service-access-usage/' + params.sauTy, {params});
};

// 앱버전 분포
export const _getAppVersion = async (params) => {
    return await $api.get('/common/api/v1/statics/app-version', {params});
};

// 설문완료 분포
export const _getQuestionComplete = async (params) => {
    return await $api.get('/common/api/v1/statics/question-complete', {params});
};

// mau전환율
export const _getMauConversionRate = async (params) => {
    return await $api.get('/common/api/v1/statics/mau-conversion-rate', {params});
};

// mau유지율
export const _getMauKeepRate = async (params) => {
    return await $api.get('/common/api/v1/statics/mau-keep-rate', {params});
};