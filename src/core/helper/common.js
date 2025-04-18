import { ref, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { _uploadEditFile, _downExcel, _getCommonCode, _fileDownload } from '@/api/common.js';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

export function useCommFunc() {
    const router = useRouter();
    const $Modal = inject('$Modal');
    //모달 데이터
    const isDownShow = ref(false);
    const isPartnerShow = ref(false);
    const isImgShow = ref(false);
    const isRequestShow = ref(false);
    const isImgDownShow = ref(false);
    const goToPage = (params) => {
        router.push(params);
    };
    //페이지 새로고침
    const pageReload = () => {
        router.go(0);
    };
    const exelFileDown = async (reasoncon, params, url) => {
        console.log('파일다운로드', reasoncon, params, url);
        try {
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
    const tableResize = (params) => {
        console.log('테이블리사이징');
    };
    const openModal = (modal, menuCode, type, value) => {
        console.log(modal);
        if (modal === 'isPartnerShow') {
            isPartnerShow.value = true;
        } else if (modal === 'isDownShow') {
            isDownShow.value = true;
        } else if (modal === 'isImgShow') {
            isImgShow.value = true;
        } else if (modal === 'isRequestShow') {
            isRequestShow.value = true;
        } else if (modal === 'isImgDownShow') {
            emitter.$emit('onChangeImgDownForm', menuCode, type, value);
        }
    };

    /**
     * images size check ( width * height )
     * @file image
     */
    const getImageInfo = (file, callback) => {
        console.log('>>load reader', file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        const fileSize = Math.floor(file.size / 1024);
        const fileType = file.type;
        // console.log('file type', file.type);
        if (fileType.indexOf('image') > -1) {
            reader.onload = function(e) {
                console.log('>>load reader');
                // let image = new Image(); // ck-editor 랑 충돌남....
                let image = document.createElement('img');
                image.src = e.target.result;
                image.onload = function() {
                    const _image = {
                        width: this.width,
                        height: this.height,
                        ratio: this.width / this.height,
                        fileSize: fileSize, // KB
                        fileType: fileType // file type
                    };
                    callback(_image);
                };
            };
        } else {
            const _file = {
                fileSize: fileSize, // KB
                fileType: fileType // file type
            };
            callback(_file);
        }
    };

    /**
     * 비밀번호 생성규칙 * 영문, 숫자, 특수기호가 포함된 8~16자리
     * @params password
     */
    const validPassword = (password) => {
        const reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;
        return reg.test(password);
    };

    /**
     * Email validation check ( 직접입력일때 )
     */
    const validEmail = (email) => {
        const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return reg.test(email);
    };

    /**
     * @format Brn 사업자번호 format 333-22-55555 형식 만들기
     * @brn 숫자 10자리 (3332255555)
     */
    const formatterBrn = (brn) => {
        // const reg = /^\{10}$/;
        // if (!reg.test(brn)) return brn;

        const fomatted = brn?.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
        return fomatted;
    };

    const getCommonCode = async (code, callback) => {
        try {
            const response = await _getCommonCode(code);
            callback(response.data.data.list);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * 파일 다운로드
     * 
     * @item Sn
     */
    const fileDownload = async (item) => {
        try {
            const response = await _fileDownload(item);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            const match = /filename="(.+?)"/.exec([response.headers['content-disposition']]);
            const filename = decodeURI(match ? match[1] : null);
            console.log(filename);
            a.href = url;
            a.download = filename;
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
        }
    };

    //오류 메세지 이벤트용
    const getErrorMessage = (item) => {
        switch (item) {
            case 'eventName':
                return '이벤트 제목을 넣어 주세요';
            case 'bannerImgDesc':
                return '이벤트 배너 이미지 설명을 작성해야 합니다.';
            case 'eventBtnType':
                return '버튼 타입을 작성해주세요';
            case 'eventStartDt':
                return '이벤트 시작일이 종료일 보다 클 수 없습니다.';
            case 'eventPzwnDt':
                return '당첨자 발표일은 이벤트 종료일 이후로 선택해주세요';
            case 'eventBtnName':
                return '버튼명를 작성해주세요';
            case 'eventBtnLink':
                return '버튼링크를 작성해주세요';
            case 'eventHintTxt':
                return '퀴즈 힌트 내용을 작성해 주세요';
            case 'eventQuiz1':
            case 'eventQuiz2':
            case 'eventQuiz3':
            case 'eventQuiz4':
                return '퀴즈 답변을 작성해 주세요';
            case 'eventAnswer':
                return '정답을 선택해 주세요';
            case 'eventFrcCount':
                return '선착순 인원을 선택해 주세요';
            case 'eventPoint':
                return '포인트를 등록해주세요';
            case 'bannerList':
                return '이벤트 배너를 등록해야 합니다.';
            case 'fileInputList':
                return '메인컨텐츠를 1개 이상 등록해야합니다.';
            case 'mainImgDesc1':
                return '메인컨텐츠 이미지 설명을 작성해야 합니다.';
            case 'productNm':
                return '상품명을 등록해 주세요';
            case 'text':
                return '당첨등수를 등록해 주세요';
            case 'eventBasicPoint':
                return '기본포인트를 작성하세요';
            case 'backImgList':
                return '배경 이미지를 작성해야 합니다.';
            case 'bkgImgDesc':
                return '배경 이미지 설명을 작성해야 합니다.';
            case 'chcEps':
                return '누적혜택 회차를 선택하세요';
            case 'chcEpsPayPnt':
                return '누적혜택 포인트를 입력하세요';
            case 'file':
                return '출석 이미지를 선택하세요';
            case 'file1':
                return '출석 이미지를 선택하세요';
            case 'rouletteTxt4':
            case 'rouletteTxt5':
            case 'rouletteTxt6':
                return '룰렛 텍스트를 작성해주세요';
            case 'roulettePoint1':
            case 'roulettePoint2':
            case 'roulettePoint3':
            case 'roulettePoint4':
            case 'roulettePoint5':
            case 'roulettePoint6':
                return '룰렛 포인트를 작성해주세요';
            case 'roulettePrbl4':
            case 'roulettePrbl5':
            case 'roulettePrbl6':
                return '합계는 100.00% 이어야 합니다.';
            case 'rouletteProductNm1':
            case 'rouletteProductNm2':
            case 'rouletteProductNm3':
            case 'rouletteProductNm4':
            case 'rouletteProductNm5':
            case 'rouletteProductNm6':
                return '룰렛 상품을 작성해주세요';
            case 'roulettePcpCnt1':
            case 'roulettePcpCnt2':
            case 'roulettePcpCnt3':
            case 'roulettePcpCnt4':
            case 'roulettePcpCnt5':
            case 'roulettePcpCnt6':
                return '당첨인원을 작성해 주세요';
            default:
                return '';
        }
    };


    return {
        $Modal,
        goToPage,
        exelFileDown,
        tableResize,
        openModal,
        pageReload,
        isPartnerShow,
        isDownShow,
        isImgShow,
        isRequestShow,
        isImgDownShow,
        getImageInfo,
        // checkImageWidth,
        validPassword,
        validEmail,
        formatterBrn,
        getCommonCode,
        fileDownload,
        getErrorMessage
    };
}
const formData = new FormData();
export class UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then((file) => {
            return new Promise((resolve, reject) => {
                this._initListeners(resolve, reject, file);
            });
        });
    }

    async _initListeners(resolve, reject, file) {

        formData.append('file', file);
        console.log('> formData', file);
        const response = await _uploadEditFile(formData);
        console.log(response);
        // return response;
        resolve({
            default: response.data
        });

    }
}

export const EditorOptions = {
    editorConfig: {
        // image: {
        //     resize: false
        // },
        // extraPlugins: [
        //     function(editor) {
        //         editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        //             return new UploadAdapter(loader);
        //         };
        //     }
        // ]
    }

};


/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Code, Italic, Strikethrough, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
// import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FontBackgroundColor, FontColor, FontFamily, FontSize } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';
import {
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload
} from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List, ListProperties } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { SpecialCharacters } from '@ckeditor/ckeditor5-special-characters';
import {
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar
} from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { WordCount } from '@ckeditor/ckeditor5-word-count';
export const initializeEditor = async () => {
    try {
        const editor = await ClassicEditor
            .create(document.querySelector('.editor_container'), {
                plugins: [
                    Alignment,
                    BlockQuote,
                    Bold,
                    Essentials,
                    FontBackgroundColor,
                    FontColor,
                    FontFamily,
                    FontSize,
                    GeneralHtmlSupport,
                    Heading,
                    HorizontalLine,
                    Image,
                    //ImageCaption,
                    //ImageResize,
                    //ImageStyle,
                    //ImageToolbar,
                    ImageUpload,
                    Indent,
                    Italic,
                    Link,
                    List,
                    ListProperties,
                    MediaEmbed,
                    Paragraph,
                    PasteFromOffice,
                    SourceEditing,
                    Strikethrough,
                    Table,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    TextTransformation,
                    Underline,
                    WordCount
                ],
                toolbar: {
                    items: [
                        'heading',
                        '|',
                        'fontFamily',
                        'fontSize',
                        'fontColor',
                        'fontBackgroundColor',
                        '|',
                        'bold',
                        'italic',
                        'strikethrough',
                        'underline',
                        'link',
                        'horizontalLine',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'alignment',
                        'outdent',
                        'indent',
                        '|',
                        'imageUpload',
                        'blockQuote',
                        'insertTable',
                        'undo',
                        'redo',
                        '|',
                        'sourceEditing'
                    ]
                },
                language: 'ko',
                image: {
                    toolbar: [
                        'imageTextAlternative',
                        'toggleImageCaption',
                        'imageStyle:inline',
                        'imageStyle:block',
                        'imageStyle:side'
                    ]
                },
                table: {
                    contentToolbar: [
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells',
                        'tableCellProperties',
                        'tableProperties'
                    ]
                },
                extraPlugins: [
                    function(editor) {
                        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                            return new UploadAdapter(loader);
                        };
                    }
                ],
                htmlSupport: {
                    allow: [
                        {
                            name: /.*/,
                            attributes: true,
                            classes: true,
                            styles: true
                        }
                    ]
                }

            })
            .then(editor => {
                console.log(editor);
                return editor;
            })
            .catch(editor => {
                console.log(editor);
            });
        return editor;
    } catch (error) {
        throw error;
    }
};