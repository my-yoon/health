import { ref, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { _downExcel } from '@/api/common.js';

export function authCommFunc() {
    const router = useRouter();
    const $Modal = inject('$Modal');
    // 마스킹 권한
    const onChangeMaskingRol = (auth, type) => {
        console.log(type);
        /**
         * auth "Y/N" 권한
         * type 마스킹 상태
         * 마스킹 해제 후 재 조회
         */
        let msg = '';
        // type || !type ?  : msg = '마스킹 하시겠습니까?';
        if (auth === 'Y') {
            console.log('마스킹 권한 있음');
            $Modal.simple({
                title: '',
                message: '마스킹을 해제 하시겠습니까?',
                buttonText: {
                    ok: '확인'
                }
            })
                .then(success => {
                    console.log(success);
                    emitter.$emit('onChangeMskgn');
                })
                .catch(error => {
                    console.log(error);
                });


        } else {
            $Modal.simple({
                title: '',
                message: '마스킹 해제 권한이 없습니다.',
                buttonText: {
                    ok: '확인'
                }
            });
        }


    };
    // 다운로드 권한
    const onChangeDownRol = (auth, type, downParams) => {
        if (auth === 'Y') {
            /**
             * auth "Y/N" 권한
             * type "Y/N"개인정보 여부
             * downParams 엑셀 다운로드 params
             * 개인정보 없는 경우 사유등록 없이 다운
             */
            if (type === 'Y') {
                $Modal.simple({
                    title: '',
                    message: '다운로드 하시겠습니까?',
                    buttonText: {
                        ok: '확인'
                    }
                })
                    .then(async (success) => {
                        await exelFileDown(downParams.params, downParams.url);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                emitter.$emit('onChangeDownForm', downParams);

            }
        } else {
            $Modal.simple({
                title: '',
                message: '다운로드 권한이 없습니다.',
                buttonText: {
                    ok: '확인'
                }
            });
        }
    };
    // 수정 권한
    const onChangeEditRol = (auth) => {
        if (auth === 'Y') {
            /**
             * auth "Y/N" 권한
             */
            emitter.$emit('onChangeEdit');
        } else {
            $Modal.simple({
                title: '',
                message: '수정 권한이 없습니다.',
                buttonText: {
                    ok: '확인'
                }
            });
        }
    };

    // 등록 권한
    const onChangeRegistRol = (auth) => {
        if (auth === 'Y') {
            /**
             * auth "Y/N" 권한
             */
            emitter.$emit('onChangeRegist');
        } else {
            $Modal.simple({
                title: '',
                message: '등록 권한이 없습니다.',
                buttonText: {
                    ok: '확인'
                }
            });
        }
    };
    // 삭제 권한
    const onChangeDelRol = (auth) => {
        if (auth === 'Y') {
            /**
             * auth "Y/N" 권한
             */
            emitter.$emit('onChangeDel');
        } else {
            $Modal.simple({
                title: '',
                message: '삭제 권한이 없습니다.',
                buttonText: {
                    ok: '확인'
                }
            });
        }
    };
    // 승인 권한
    const onChangeApprRol = (auth) => {
        if (auth === 'Y') {
            /**
             * auth "Y/N" 권한
             */
            emitter.$emit('onChangeAppr');
        } else {
            $Modal.simple({
                title: '',
                message: '승인 권한이 없습니다.',
                buttonText: {
                    ok: '확인'
                }
            });
        }
    };
    // 엑셀 다운로드
    const exelFileDown = async (params, url) => {
        console.log('파일다운로드', params, url);
        try {
            console.log(params);
            const response = await _downExcel(url, params);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const fileName = decodeURIComponent(response.headers['content-disposition']?.split('filename="')[1].slice(0, -1));
            const downurl = window.URL.createObjectURL(blob);
            console.log(blob, fileName);
            const a = document.createElement('a');
            console.log(downurl);
            a.href = downurl;
            a.download = fileName;
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downurl);
        } catch (error) {
            console.log(error);
        }
    };

    return {
        $Modal,
        onChangeMaskingRol,
        onChangeDownRol,
        onChangeEditRol,
        onChangeRegistRol,
        onChangeDelRol,
        onChangeApprRol,
        exelFileDown

    };
}



