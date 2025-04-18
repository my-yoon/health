import axios from 'axios';
import dayjs from 'dayjs';
import $Modal from '@/plugins/modal';

/**
 * @process.env
 * VITE 에서는 import.meta.env 로 가져온다.
 */
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 6000
});

/**
 * @cancel
 * server 단 취소는 안되고 , front 에서 취소
 */
// request.isCancel = axios.isCancel;

// "admnSn": 1  - 통합어드민 마스터
//       accessToken : eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJKV1QgVE9LRU4iLCJhdWQiOiJLQkhDLUNsaWVudCIsIm1lbWJlckluZm8iOnsicHRucnBZbiI6Ik4iLCJhZG1uUHRuclR5Q2QiOiIxMTEwMDEiLCJhZG1uU24iOjEsImFkbW5JZCI6ImFkbWluMSIsImFkbW5ObSI6Iu2Gte2VqeyWtOuTnOuvvCDrp4jsiqTthLAiLCJhZG1uRW1hZCI6ImtiaGMuZ3NhaG5Aa2JoYy5jby5rciJ9LCJpc3MiOiJLQkhDLU9BdXRoIiwiZXhwIjoyNTY0MjA3Mzc1LCJhdXRoVHlwZSI6IkFETUlOIiwidG9rZW5UeXBlIjoiQUNDRVNTIiwiaWF0IjoxNzAwMjkzNzc1fQ.SvRg9aK1p2sXFfCN1LeAmizBXECsCMUZRZjo7X4cYEBTHIcoPyFDqJcKIcYeQvYl
// "admnSn": 94 - 통합어드민 CS매니저
//       accessToken : eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJKV1QgVE9LRU4iLCJhdWQiOiJLQkhDLUNsaWVudCIsIm1lbWJlckluZm8iOnsicHRucnBZbiI6Ik4iLCJhZG1uUHRuclR5Q2QiOiIxMTEwMDEiLCJhZG1uU24iOjk0LCJhZG1uSWQiOiJrYWFtIiwiYWRtbk5tIjoi7Ya17ZWp7Ja065Oc66-8IENT66ek64uI7KCAIiwiYWRtbkVtYWQiOiJ0ZXN0QHRlc3QuY28ua3IifSwiaXNzIjoiS0JIQy1PQXV0aCIsImV4cCI6MjU2NDIwNzU4MSwiYXV0aFR5cGUiOiJBRE1JTiIsInRva2VuVHlwZSI6IkFDQ0VTUyIsImlhdCI6MTcwMDI5Mzk4MX0.5b_v8MCcpz3-nlwhkGJNVOREB0O-aqnPLYrTb090phXbxRdgEf-qy_3yh8gyKa22
// "admnSn": 38 - 통합어드민 부매니저
//       accessToken : eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJKV1QgVE9LRU4iLCJhdWQiOiJLQkhDLUNsaWVudCIsIm1lbWJlckluZm8iOnsicHRucnBZbiI6Ik4iLCJhZG1uUHRuclR5Q2QiOiIxMTEwMDEiLCJhZG1uU24iOjM4LCJhZG1uSWQiOiJrYWFhbSIsImFkbW5ObSI6Iu2Gte2VqeyWtOuTnOuvvCDrtoDrp6Tri4jsoIAiLCJhZG1uRW1hZCI6ImtiaGMuZ3NhaG5Aa2JoYy5jby5rciJ9LCJpc3MiOiJLQkhDLU9BdXRoIiwiZXhwIjoyNTY0MjA3NjM1LCJhdXRoVHlwZSI6IkFETUlOIiwidG9rZW5UeXBlIjoiQUNDRVNTIiwiaWF0IjoxNzAwMjk0MDM1fQ.C7qS9RHSggLpsbrc1tuMov-7lUMo9-eeAhYgLwnkYIxikjSUykpSTOR9dEsGUrnE

request.interceptors.request.use(
    (config) => {
        const myToken = localStorage.getItem('AUTH-TOKEN');
        const lastAccessTime = localStorage.getItem('lastAccessTime');
        let diff = dayjs().diff(lastAccessTime, 'minute');
        // console.log(diff); //날짜차이 비교(분)
        if (diff > 30) {
            //강제 로그아웃
            localStorage.clear();
            emitter.$emit('goLoginPage');
        }
        config.headers['Content-Type'] = 'application/json';
        config.headers.Authorization = myToken;
        if (config.url === '/common/api/v1/file/upload' || config.url === '/common/api/v1/file/upload/editor' ||
            config.url === '/common/api/v1/mna/iss/user/excel') {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        return config;
    },
    (error) => {
        console.log('[API Request ERROR]', error);
        return Promise.reject(error);
    }
);


request.interceptors.response.use(
    response => {
        console.log('[API Response]');
        if (response.data.code == 'ERROR_CODE_AI001' ||
            response.data.code == 'ERROR_CODE_AI002' ||
            response.data.code == 'ERROR_CODE_AI003' ||
            response.data.code == 'ERROR_CODE_AI004' ||
            response.data.code == 'ERROR_UNKNOWN_AUTHORIZATION') {
            if (window.location.pathname !== '/login') {

                $Modal.confirm({
                    title: '',
                    message: `${response.data.message} 다시 로그인해주세요.`,

                    buttonText: {
                        confirm: '확인'
                    }
                })
                    .then(async (success) => {
                        window.location.href = `${import.meta.env.VITE_APP_KBADMIN_LOGIN_URL}/login`;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        } else {
            //응답 성공시 마지막 접속 시간을 갱신한다.
            let time = dayjs().format('YYYY-MM-DD HH:mm:ss');
            localStorage.setItem('lastAccessTime', time);
        }

        return response;
    },
    error => {
        console.log(error);
        // ~ axios에서 서버 요청을 취소한 경우에 실행.
        return Promise.reject(error);
    }
);

export const CancelToken = axios.CancelToken;

export default request;
