// 세자리 콤마
import {toNumber} from 'lodash/lang';

const toLocaleStringKo = (param) => {
    return param.value ? toNumber(param.value).toLocaleString('ko') : 0;
};

//반올림 처리 (소수점 자리)
const toRound = (num, demicalPoint) => {
    demicalPoint = demicalPoint ?? 1;
    return isNum(num) ? Math.round(num * (10 ** demicalPoint)) / (10 ** demicalPoint) : num;
};

// 단위 추가
const toAddUnit = (num, string) => {
    // 퍼센티지 소수점1자리 반올림 처리
    return isNum(num) ? (num ? toRound(num) : 0) + string : num;
};

// ag-grid valueFormatter 용 함수
const toGridUnit = (param) => {
    const unit = param.colDef?.unit ? param.colDef?.unit : '';
    return toAddUnit(param.value, unit);
};

const isNum = (num) => {
    return num !== '-';
};

const chartColorSet = {
    blue: '#36a2eb',
    red: '#ff6384',
    green: '#4bc0c0',
    orange: '#ff9f40',
    purple: '#9966ff',
    yellow: '#ffcd56',
    blue2: '#3664eb',
    red2: '#ff3284',
    green2: '#4b8ec0',
    orange2: '#ff6d40',
    purple2: '#9934ff',
    yellow2: '#ff9b56'
};

export {toLocaleStringKo, toRound, toAddUnit, toGridUnit, chartColorSet};
