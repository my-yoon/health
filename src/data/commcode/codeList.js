import {
    _getCustomerAlarmChnCd,
    _getCustomerAlarmPrSt,
    _getCustomerAlarmSndnTrgTyp,
    _getCustomerAlarmSndnPu,
    _getCommonCodeGrpCd
} from '@/api/operate.js';

export const codeList = {
    get: async (type) => {
        try {
            let response;
            switch (type) {
                // 승인상태
                case 'approve':
                    response = await _getCustomerAlarmPrSt();
                    break;
                // 채널
                case 'channel' :
                    response = await _getCustomerAlarmChnCd();
                    break;
                // 발송대상
                case 'sendTarget' :
                    response = await _getCustomerAlarmSndnTrgTyp();
                    break;
                //발송목적
                case 'sendPurpose' :
                    response = await _getCustomerAlarmSndnPu();
                    break;
            }

            let list = !!response ? [...response.data.data.list] : [];

            return list.map(item => {
                item.label = item.cmnCdNm;
                item.value = item.cmnCd;
                return item;
            });
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    getGroupCode: async (uprGrpCd) => {
        try {
            const response = await _getCommonCodeGrpCd(uprGrpCd);
            return response.data.data.list.filter(item => item.useYn === 'Y').map(item => {
                item.label = item.cmnCdNm;
                item.value = item.cmnCd;
                return item;
            });

        } catch (error) {
            console.log(error);
            return error;
        }
    }
};

export default codeList;
