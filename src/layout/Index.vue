<template>
    <div :class="['layout', { 'nav-hide': state.navhide }]">
        <MainHeader :adminfo="state.userInfomation" />
        <div id="adminContainer">
            <!-- state.authMenuList -->
            <MainMenu :menuList="state.authMenuList" :favItem="state.favItem" @gnbOpen="onGnbOpen" @hideMenu="onHideMenu"
                @changeMenuFav="onMenuFav" @settingMenuFav="onChangeMenuFav" />
            <div id=" adminContainer">
                <div class="contents">
                    <div>
                        <Location :pageMeta="state.pageMeta" :routerInfo="state.routeInfo"
                            v-if="state.navigation && !(state.currentPage.url === '/main')" />
                        <div class="temp-section">
                            <RouterView :adminfo="state.userInfomation" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--- footer -->
        <footer id="adminFooter">
            ⓒ2023 KB Healthcare. All rights Reserved
        </footer>
        <!---// footer -->
    </div>

    <!-- 컨퍼모달 -->
    <ConfirmModal />
    <!-- 다운로드모달 -->
    <isFileDownShow :adminfo="state.userInfomation" />
    <!-- 이미지 다운로드 -->
    <isImgDownShow :adminfo="state.userInfomation" />
    <!-- 즐겨찾기 -->
    <DefaultModal :isShow="isShow" :modalTitle="'Favorite 메뉴 관리'" :buttonConfirm="'저장'" :buttonCancel="'취소'"
        @modalclose="modalControl">
        <template #modalcontent>
            <div class="ui-dragdrop-menu">
                <draggable v-model="state.favItem" tag="ul" item-key="id" class="ui-dragdrop-list">
                    <template v-slot:item="{ item }">
                        <!-- 커스텀 아이템 슬롯 -->
                        <li class="ui-dragdrop-item">
                            <span>{{ item.menuName }} </span>
                            <button type="button" class="del" @click="onChangeDel(item)"><span
                                    class="offscreen">삭제</span></button>
                        </li>
                    </template>
                </draggable>
            </div>
        </template>
    </DefaultModal>
</template>
<script>
import ConfirmModal from '@/plugins/modal/modal/ConfirmModal.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useStore } from 'vuex';
import { reactive, onMounted, onUnmounted, watch, nextTick, ref, inject, computed, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MainMenu from '@/components/layout/MainMenu.vue';
import MainHeader from '@/components/layout/MainHeader.vue';
import Location from '@/components/layout/Location.vue';
import { menuItem } from '@/data/menu.js';
import { _getaccessToken } from '@/api/dashboard.js';
import { _getAccountDetail, _getMenulist, _getBookmark, _editBookmark, _saveBookmark, _delBookmark } from '@/api/user.js';
export default {
    components: { MainMenu, MainHeader, Location, ConfirmModal, DefaultModal },

    setup() {
        const store = useStore();
        const $Modal = inject('$Modal');
        const router = useRouter();
        const route = useRoute();
        const dayJS = inject('dayJS');
        const state = reactive({
            winH: 0,
            pageMeta: [],
            locations: [],
            navigation: false,
            pageTabs: [],
            menu: menuItem,
            currentPage: {},
            navhide: false,
            favItem: [],
            routeInfo: null,
            authorCode: '',
            userInfo: {},
            authorizationCode: '',
            userInfomation: {},
            adminSn: '',
            // authMenuList: menuItem,
            authMenuList: [],
            bookMarkSn: null,
            menuInfo: {
                menuCode: '',
                auth1RegistYn: '',
                auth2UpdateYn: '',
                auth3DeleteYn: '',
                auth4ApproveYn: '',
                auth5DownloadYn: '',
                auth6MaskingYn: ''
            }
            // mounted 는 시점 차이로 watch 로 대체
            // 최초 1회 실행으로 menuInfo 받아올 목적으로 생성
            // isLoadMenuInfo: false
        });
        const isShow = ref(false);
        watch(route, () => {
            setLocation();

        });
        onMounted(async () => {
            console.log(import.meta.env);
            state.routeInfo = route;
            //로그인 정보가 없다면 테스트 로그인  처리
            if (!localStorage.getItem('AUTH-TOKEN') && import.meta.env.MODE != 'prod') {
                console.log('테스트 로그인 (admnSn:1)');
                await testToken();
            }
            //이걸 모든 페이지(레이아웃)에서 처리 해야 할지 고민
            await userSaveInfo();
            await getMenulist();
            emitter.$on('goLoginPage', goLoginPage);

        });
        onUnmounted(() => {
            emitter.$off('goLoginPage');
        });
        const goLoginPage = () => {
            console.log('loginPage');
            $Modal.confirm({
                message: `30분이 경과하여 로그아웃 되었습니다.`,
                className: 'confirm',
                closeButtonHide: true,
                buttonText: {
                    confirm: '로그인 하러가기'
                }
            })
                .then(async (success) => {
                    console.log(success);
                    window.location.href = `${import.meta.env.VITE_APP_KBADMIN_LOGIN_URL}`;
                })
                .catch(error => {
                    console.log(error);
                });
        };
        const setLocation = () => {
            //네비게이션 
            state.pageMeta = route.meta.sublocation_depth;
            state.navigation = Object.keys(route.meta).length > 0;
            state.currentPage = { 'url': route.path, 'label': route.meta.sublocation_depth, 'menuCode': route.meta.menuCode };
            // let num = state.currentPage.label.length;
            // console.log('??? ', state.authMenuList);
            //현재페이지 정보
            nextTick(() => {
                state.authMenuList.forEach((item) => {
                    // console.log('네비게이션', state.currentPage, item);
                    if (state.currentPage.menuCode === item.menuCode && item.list === null) getMenuInfo(item);
                    else {
                        if (item.list !== null) {
                            item.list.forEach((list) => {
                                if (state.currentPage.menuCode === list.menuCode && list.list === null) getMenuInfo(list);
                                if (list.list !== null) {
                                    list.list.map((last) => {
                                        if (state.currentPage.menuCode === last.menuCode) getMenuInfo(last);
                                    });
                                }
                            });
                        }
                    }
                    return item;
                });
                state.isLoadMenuInfo = true;
            });
        };
        // GNB 활성화
        const onGnbOpen = (depth1, depth2, depth3) => {
            state.authMenuList.forEach((item, index) => {
                //depth1
                if (index === depth1) {
                    if (item.list === null) {
                        if (item.url.indexOf('https') > -1 || item.url.indexOf('http') > -1) {
                            console.log('111');
                            let token = localStorage.getItem('AUTH-TOKEN');
                            window.open(`${item.url}?token=${token}`);
                        } else {
                            router.push(item.url);
                        }
                        getMenuInfo(item);
                    } else {
                        item.isActive = true;
                        item.list.forEach((list, i) => {
                            if (i === depth2) {
                                list.isActive = true;
                                if (list.list === null) {
                                    router.push(list.url);
                                    getMenuInfo(list);
                                    console.log(list);

                                } else {
                                    //depth3
                                    list.list.forEach((listlast, idx) => {
                                        if (idx === depth3) {
                                            listlast.isActive = true;
                                            //ums사이트 외부링크이동
                                            if (listlast.url.indexOf('https') > -1 || listlast.url.indexOf('http') > -1) {
                                                console.log(listlast);
                                                window.open(listlast.url);

                                            } else {
                                                router.push(listlast.url);
                                                getMenuInfo(listlast);
                                            }
                                        } else {
                                            listlast.isActive = false;
                                        }
                                    });
                                }
                            }

                        });
                    }
                } else {
                    item.isActive = false;
                }
            });
        };
        const getMenuInfo = (list) => {
            state.menuInfo = {
                menuCode: list.menuCode,
                auth1RegistYn: list.auth1RegistYn,
                auth2UpdateYn: list.auth2UpdateYn,
                auth3DeleteYn: list.auth3DeleteYn,
                auth4ApproveYn: list.auth4ApproveYn,
                auth5DownloadYn: list.auth5DownloadYn,
                auth6MaskingYn: list.auth6MaskingYn
            };
            store
                .dispatch('getMenuItem/saveMenu', state.menuInfo);

            console.log('set state.menuInfo', state.menuInfo);


        };

        //GNB all 비활성화
        const disableGnb = () => {
            state.menu.forEach((item, index) => {
                item.isActive = false;
                item.list.forEach((item, index) => {
                    item.isActive = false;
                    item.list.forEach((item, index) => {
                        item.isActive = false;
                    });

                });
            });
        };
        //GNB 전체 열기 닫기
        const onHideMenu = () => {
            state.navhide === true ? state.navhide = false : state.navhide = true;
        };

        //즐겨 추가
        const onMenuFav = (depth1, depth2, depth3, menuitem) => {
            modal('addfav', depth1, depth2, depth3, menuitem);
            console.log(depth1, depth2, depth3);
        };
        // 즐겨찾기 추가 및 조회
        const modal = (type, depth1, depth2, depth3, menuitem) => {
            console.log(menuitem);
            if (type === 'addfav') {
                $Modal.confirm({
                    message: `${menuitem}를 즐겨찾기에 추가 하시겠습니까?`,
                    className: 'confirm',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(async (success) => {
                        console.log(success);
                        if (depth2 === '' && depth3 === '') {
                            await saveBookmark(state.authMenuList[depth1].menuCode);
                            await getBookmark();

                            return state.authMenuList[depth1].isFav = true;
                        } else if (!(depth1 === '') && !(depth2 === '') && depth3 === '') {
                            await saveBookmark(state.authMenuList[depth1].list[depth2].menuCode);
                            await getBookmark();
                            return state.authMenuList[depth1].list[depth2].isFav = true;
                        } else {
                            await saveBookmark(state.authMenuList[depth1].list[depth2].list[depth3].menuCode);
                            await getBookmark();
                            return state.authMenuList[depth1].list[depth2].list[depth3].isFav = true;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else if (type === 'noneitem') {
                $Modal.simple({
                    message: '등록된 즐겨 찾기가 없습니다.',
                    className: 'warning',
                    buttonText: {
                        ok: '확인'
                    }
                });
            }
        };
        //즐겨 찾기 순서 변경
        const onChangeMenuFav = () => {
            if (state.favItem.length > 0) {
                isShow.value = true;
            } else {
                modal('noneitem');
            }

        };
        //즐겨 찾기 삭제
        const onChangeDel = (item) => {
            console.log(item);
            isShow.value = false;
            $Modal.simple({
                title: '',
                message: '삭제 하시겠습니까?',
                buttonText: {
                    ok: '확인'
                }
            })
                .then(async (success) => {
                    console.log(success);
                    state.bookMarkSn = item.bookMarkSn;
                    await delBookmark(state.bookMarkSn);
                })
                .catch(error => {
                    console.log(error);
                    isShow.value = true;
                });
        };
        // 즐겨찾기 조회
        const getBookmark = async () => {
            try {
                const response = await _getBookmark();
                state.favItem = response.data.data.list;
            } catch (error) {
                console.log(error);
            }
        };
        // 즐겨찾기 등록
        const saveBookmark = async (code) => {
            try {
                let params = {
                    menuCode: code
                };
                const response = await _saveBookmark(params);
                if (response.data.code === 'OK') {
                    await getBookmark();
                }
            } catch (error) {
                console.log(error);
            }
        };
        // 즐겨찾기 수정
        const editBookmark = async (codes) => {
            try {
                let params = {
                    paramList: codes
                };
                console.log(params);
                const response = await _editBookmark(params);
                if (response.data.code === 'OK') {
                    await getBookmark();
                }
            } catch (error) {
                console.log(error);
            }
        };
        // 즐겨찾기 삭제
        const delBookmark = async (code) => {
            try {
                let params = {
                    bookMarkSn: code
                };
                // console.log(params);
                const response = await _delBookmark(params);
                if (response.data.code === 'OK') {
                    getBookmark();
                }
            } catch (error) {
                console.log(error);
            }
        };

        //팝업 컨트롤
        const modalControl = (type) => {
            if (type)
                if (type === 'modalclose' || type === 'modalcancel') {
                    isShow.value = false;
                }
            if (type === 'modalconfirm') {
                isShow.value = false;
                state.favItem = state.favItem.map((item, i) => {
                    item.order = i + 1;
                    return item;
                });
                editBookmark(state.favItem);
            }
            if (!type) {
                isShow.value = false;
            }
        };

        const showModal = () => {
            isShow.value = true;
        };
        const closeModal = () => {
            isShow.value = false;
        };
        //토큰 처리 
        const testToken = async () => {
            try {
                // 로그인 안할때 강제 토큰                
                localStorage.clear();
                let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJKV1QgVE9LRU4iLCJhdWQiOiJLQkhDLUNsaWVudCIsIm1lbWJlckluZm8iOnsiYWRtblB0YWxTaXRDZCI6IjEzMDAwMSIsInB0bnJwWW4iOiJOIiwiYWRtblB0bnJUeUNkIjoiMTExMDAxIiwiYWRtblNuIjoxLCJhZG1uSWQiOiJhZG1pbjEiLCJhdXRoU2VDZCI6IjE0NDAwMSIsImFkbW5ObSI6Iu2Gte2VqeyWtOuTnOuvvCDrp4jsiqTthLAiLCJhZG1uRW1hZCI6ImFkbWluQGtiaGMuY28ua3IifSwiaXNzIjoiS0JIQy1PQXV0aCIsImV4cCI6MjU2ODI0NTEwNiwiYXV0aFR5cGUiOiJBRE1JTiIsInRva2VuVHlwZSI6IkFDQ0VTUyIsImlhdCI6MTcwNDMzMTUwNn0.6r74PNXRRb8ruXV12Rm62J9hMg4zipMrOBcGq1fpBnOL-i2ZNYnh1EPvjMLWKI1U';
                let time = dayJS(new Date()).format('YYYY-MM-DD HH:mm:ss');
                localStorage.setItem('AUTH-TOKEN', token);
                localStorage.setItem('admnSn', 1);
                localStorage.setItem('admnNm', '통합어드민 마스터');
                localStorage.setItem('lastAccessTime', time);
            } catch (error) {
                console.log(error);
            }
        };
        //메뉴리스트 조회
        const getMenulist = async () => {
            try {
                const response = await _getMenulist();
                state.authMenuList = response.data.data.list;
                if (response.data.code === 'OK') {
                    await getBookmark();
                    await setLocation();
                    await onGnbOpen();
                }
            } catch (error) {
                console.log(error);
            }
        };
        //토큰 순번으로 조회 메인에서 한번 조회 함
        const userSaveInfo = async () => {
            try {
                const response = await _getAccountDetail();
                state.userInfomation = response.data.data;

                // store commit
                store.dispatch('authModule/setUserInfo', response.data.data);
                console.log(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        return {
            MainMenu,
            MainHeader,
            state,
            menuItem,
            isShow,
            onGnbOpen,
            disableGnb,
            onHideMenu,
            showModal,
            closeModal,
            modalControl,
            onChangeMenuFav,
            onMenuFav,
            modal,
            testToken,
            onChangeDel
        };
    }
};
</script>