<template>
    <nav id="adminNav">
        <button type="button" class="nav-toggle" @click="hideMenu"><span class="offscreen">메뉴숨기기</span></button>
        <div class="admin-nav-scroller">
            <!-- 즐겨찾기 : 시작 -->
            <div class="admin-fav-wrap">
                <div class="admin-fav-head">
                    <h2>즐겨찾기</h2>
                    <ul class="admin-fav-util">
                        <li>
                            <button type="button" class="admin-fav-util-item reload">
                                <span class="offscreen">새로고침</span>
                            </button>
                        </li>
                        <li>
                            <button type="button" class="admin-fav-util-item setting" @click="settingLayer">
                                <span class="offscreen">즐기찾기메뉴설정</span>
                            </button>
                        </li>
                        <!-- <li>
                            <button type="button" :class="['admin-fav-util-item', 'toggle', { acitve }]">
                                <span class="offscreen">즐겨찾기토글</span>
                            </button>
                        </li> -->
                    </ul>
                </div>
                <div class="admin-fav-list">
                    <div class="ui-no-date" v-if="state.favMenu.length === 0">
                        <p>즐겨찾는 메뉴를 추가 해주세요!</p>
                    </div>
                    <ul>
                        <li v-for="(item, index) in state.favMenu" :key="index">
                            <button type="button" class="admin-fav-item">{{ item.menuName }}</button>
                            <button type="button" class="admin-fav-check active">
                                <span class="offscreen">즐겨찾기등록</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 즐겨찾기 : 끝 -->
            <!-- 메뉴 : 시작 -->
            <div class="admin-menu-wrap">
                <ul>
                    <!-- <li>
                        <span class="admin-menu-item dep1 window" target="_blank">쇼핑몰관리</span>
                        <button type="button" class="admin-fav-check">
                            <span class="offscreen">즐겨찾기 등록</span>
                        </button>
                    </li>
                    <li><span class="admin-menu-item dep1 window" target="_blank">상품관리</span>
                        <button type="button" class="admin-fav-check">
                            <span class="offscreen">즐겨찾기 등록</span>
                        </button>
                    </li>
                    <li>
                        <span class="admin-menu-item dep1 window" target="_blank">주문관리</span>
                        <button type="button" class="admin-fav-check">
                            <span class="offscreen">즐겨찾기 등록</span>
                        </button>
                    </li> -->
                    <!-- 1depth -->
                    <!-- {{ state.menu[1] }} -->
                    <li :class="[{ 'depth': item.list !== null }]" v-for="(item, index) in  state.menu" :key="index">
                        <button type="button"
                            :class="['admin-menu-item dep1', { 'active': item.isActive }, { 'no-child': item.list === null }]"
                            @click="gnbOpen(index)">
                            {{ item.label }}
                        </button>
                        <button :class="['admin-fav-check', { active: item.isFav }]" v-if="item.list === null"
                            @click="() => { item.isFav ? modal() : menuFav(index, '', '', item.label) }">
                            <span class="offscreen">즐겨찾기등록</span>
                        </button>
                        <!-- 2depth false-->
                        <ul v-if="item.list !== null">
                            <li v-for="(sub, i) in  item.list " :key="i">
                                <button type="button"
                                    :class="['admin-menu-item dep2', { 'active': sub.isActive }, { 'no-child': sub.list === null }]"
                                    @click="gnbOpen(index, i)">
                                    {{ sub.label }}
                                </button>
                                <button :class="['admin-fav-check', { active: sub.isFav }]" v-if="sub.list === null"
                                    @click="() => { sub.isFav ? modal() : menuFav(index, i, '', sub.label) }">
                                    <span class="offscreen">즐겨찾기등록</span>
                                </button>
                                <!-- 3depth -->
                                <ul v-if="sub.list !== null">
                                    <li v-for="( depth, idx ) in  sub.list " :key="idx"
                                        :class="[{ 'active': depth.isActive }]">
                                        <button type="button" class="admin-menu-item dep3"
                                            @click="gnbOpen(index, i, idx)">{{ depth.label }}</button>
                                        <button :class="['admin-fav-check', { active: depth.isFav }]"
                                            @click="() => { depth.isFav ? modal() : menuFav(index, i, idx, depth.label) }">
                                            <span class="offscreen">즐겨찾기등록</span>
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!-- 메뉴 : 끝 -->
            <!-- 배너 : 시작 -->
            <div class="admin-banner-wrap">
                <ul>
                    <li><button type="button" class="admin-banner-item">ooo 바로가기</button></li>
                    <li><button type="button" class="admin-banner-item">ooo 바로가기</button></li>
                </ul>
            </div>
            <!-- 배너 : 끝 -->
        </div>

    </nav>
</template>
<style>
.admin-menu-wrap>ul>li>ul>li>ul>li.isActive {
    background-color: #e4ebf5;
}

.admin-menu-wrap>ul>li ul {
    display: none;
}

.admin-menu-item.active+ul {
    display: block;
}
</style>
<script>

import { reactive, getCurrentInstance, computed, onMounted, inject, ref } from 'vue';
export default {
    props: ['menuList', 'favItem'],
    emits: ['gnbOpen', 'hideMenu', 'changeMenuFav', 'settingMenuFav'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const $Modal = inject('$Modal');
        const state = reactive({
            menu: computed(() => props.menuList),
            favMenu: computed(() => props.favItem)
        });
        onMounted(() => {
            //즐겨찾기 초기화
            // state.menu.forEach((item, index) => {
            //     item.list.forEach((item, index) => {
            //         item.list.forEach((item, index) => {
            //             if (item.isFav)
            //                 state.favMenuList.push(item);
            //         });

            //     });
            // });

        });
        const onChangeList = (event) => {
            console.log(event);
        };

        const gnbOpen = (depth1, depth2, depth3) => {
            emit('gnbOpen', depth1, depth2, depth3);
        };
        const menuFav = (depth1, depth2, depth3, menuitem) => {
            emit('changeMenuFav', depth1, depth2, depth3, menuitem);
        };
        const hideMenu = () => {
            emit('hideMenu');
        };
        const settingLayer = () => {
            emit('settingMenuFav');
        };
        const modal = () => {
            $Modal.simple({
                message: '이미 즐겨찾기에 추가 되었습니다.',
                className: 'warning',
                buttonText: {
                    ok: '확인'
                }
            });
        };
        return {
            state,
            // list,
            gnbOpen,
            menuFav,
            hideMenu,
            modal,
            settingLayer,
            onChangeList
        };
    }
};
</script>