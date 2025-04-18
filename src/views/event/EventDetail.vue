<template>
    <div class="tbl-wrap">
        <!-- {{ state.eventMaster }} -->
        <table class="table reg">
            <colgroup>
                <col style="width: 160px;">
                <col style="width: auto;">
                <col style="width: 160px;">
                <col style="width: auto;">
            </colgroup>
            <tbody>
                <tr>
                    <th scope="row">제목</th>
                    <td colspan="3">{{ state.eventMaster.eventName }}</td>
                </tr>
                <tr>
                    <th scope="row">이벤트 유형</th>
                    <td>
                        <template v-if="state.eventMaster.eventType === 'GENERAL'">
                            일반
                        </template>
                        <template v-else-if="state.eventMaster.eventType === 'QUIZ'">
                            퀴즈
                        </template>
                        <template v-else-if="state.eventMaster.eventType === 'ROULETTE'">
                            룰렛
                        </template>
                        <template v-else-if="state.eventMaster.eventType === 'ATTENDANCE'">
                            출석
                        </template>
                        <template v-else-if="state.eventMaster.eventType === 'INVITATION'">
                            초대
                        </template>
                        {{ state.eventMaster.eventType }}
                    </td>
                    <th scope="row">게시 여부</th>
                    <td>
                        <template v-if="state.eventMaster.pstYn === 'Y'">
                            게시
                            (
                            <span v-if="state.eventMaster.eventProgress === 'ING'"> 진행중</span>
                            <span v-if="state.eventMaster.eventProgress === 'WAITING'"> 대기</span>
                            <span v-if="state.eventMaster.eventProgress === 'END'"> 종료</span>
                            <span v-if="state.eventMaster.eventProgress === 'STOP'"> 긴급종료</span>
                            <span v-if="state.eventMaster.eventProgress === 'SOLD OUT'">마감</span>
                            )
                        </template>
                        <template v-else-if="state.eventMaster.pstYn === 'N'">
                            비게시
                        </template>
                    </td>
                </tr>
                <tr>
                    <th scope="row">이벤트 대상</th>
                    <td colspan="3">
                        <template v-if="state.eventMaster.eventTarget === 'ALL'">
                            모든 사용자
                        </template>
                        <div v-if="false">
                            회원 그룹 선택
                            <div class="member-group-list">
                                전환고객(kb은행), 군 간부, 공항철도, 국민카드, 푸르덴셜, 저축은행, 데이타시스템, 인베스트먼트, 자산운용, 부동산신탁, 신용정보, 생명, 안랩, 주식회사
                                아이센스
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">참여 제한</th>
                    <td>
                        <template v-if="state.eventMaster.pcpType === 'NONE'">
                            참여제한 없음
                        </template>
                        <template v-else-if="state.eventMaster.pcpType === 'ONCE'">
                            기간내 1회
                        </template>
                        <template v-else-if="state.eventMaster.pcpType === 'ONEDAY'">
                            1일 1회
                        </template>
                        <template v-else-if="state.eventMaster.pcpType === 'LIMIT'">
                            중복참여 (기간내) {{ state.eventMaster.pcpCount }}회
                        </template>
                    </td>
                    <th scope="row">이벤트 기간</th>
                    <td>
                        {{ state.eventMaster.eventStartDt }} ~ {{ state.eventMaster.eventEndDt }}
                        <template v-if="state.eventMaster.eventBnefType === 'AFTER'">
                            &nbsp;&nbsp;&nbsp;( 당첨자 발표일 : {{ state.eventMaster.eventPzwnDt }} )
                        </template>
                    </td>
                </tr>
                <tr>
                    <th scope="row">혜택 구분</th>
                    <td>
                        <template v-if="state.eventMaster.eventBnefType === 'NONE'">
                            혜택없음
                        </template>
                        <template v-else-if="state.eventMaster.eventBnefType === 'IMMEDIATELY'">
                            즉시지급
                        </template>
                        <template v-else-if="state.eventMaster.eventBnefType === 'AFTER'">
                            당첨 후 지급
                        </template>
                    </td>
                    <th scope="row">이벤트 코드</th>
                    <td>{{ state.eventMaster.eventSn }}</td>
                </tr>
                <tr v-if="state.eventMaster.eventClusList">
                    <th scope="row">약관</th>
                    <td colspan="3">
                        <div class="mt-10" v-for="(item, index) in state.eventMaster.eventClusList" :key="index">
                            <router-link :to="`/policy/register?clusMngSn=${item.clusMngSn}&detailTyCd=DL`" target="_blank">
                                {{ item.clusNm }}
                            </router-link>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">마케팅 정보 PUSH <br>수신동의
                    </th>
                    <td colspan="3">
                        <div class="reg-group">
                            <div class="reg-item">
                                <span class="checkbox">
                                    <input id="push" name="pushGroup" type="checkbox" v-model="state.infAgrmYnCpm" disabled>
                                    <label for="push">필수</label>
                                </span>

                            </div>

                        </div>


                    </td>
                </tr>
                <tr>
                    <th scope="row">등록자</th>
                    <td>{{ (state.eventMaster.adminId) ? state.eventMaster.adminId + ' (' + state.eventMaster.fstRgtrSn +
                        ')' :
                        state.eventMaster.fstRgtrSn }} </td>
                    <th scope="row">등록일시</th>
                    <td>{{ state.eventMaster.fstRgsDt }}</td>
                </tr>
                <tr>
                    <th scope="row">수정자</th>
                    <td>{{ (state.eventMaster.lastUpdrSn > 0) ? state.eventMaster.lastUpdrSn : '' }}</td>
                    <th scope="row">최종수정일시</th>
                    <td>{{ state.eventMaster.lastUpdDt }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="ui-tab-wrap mt-30">
        <div class="ui-tabs">
            <ul>
                <li :class="{ 'active': state.tabValue === item.value }" v-for="(item, index) in state.eventTabs"
                    :key="index" @click="TabsChange(item.value)">
                    <button type="button" class="ui-tab-item"><span>{{ item.label }}</span></button>
                </li>
            </ul>
        </div>
        <div class="ui-panels">
            <!-- 이벤트 상세 -->
            <div class="ui-panel-item" v-if="state.tabValue === 0">
                <div class="ui-section">
                    <subTitleBar :subTitle="'이벤트 배너'" />
                    <div class="ui-content">
                        <div class="tbl-wrap">
                            <table class="table reg">
                                <colgroup>
                                    <col style="width: 160px;">
                                    <col style="width: auto;">
                                    <col style="width: 160px;">
                                    <col style="width: auto;">
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th scope="row">이미지</th>
                                        <td>
                                            <!-- {{ state.eventMaster.bannerImgInfo.fileUrl }} -->
                                            <div class="reg-group">
                                                <div class="reg-item-img">
                                                    <template v-if="state.eventMaster.bannerImgInfo">
                                                        <img :src="`${state.eventMaster.bannerImgInfo.fileUrl}`"
                                                            :alt="state.eventMaster.bannerImgDesc" />
                                                    </template>
                                                </div>
                                            </div>
                                        </td>
                                        <th scope="row">이미지 설명</th>
                                        <td>
                                            {{ state.eventMaster.bannerImgDesc }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
                <div class="ui-section">
                    <subTitleBar :subTitle="'콘텐츠'">
                        <template #btn>
                            <div class="">
                                <button type="button" class="btn btn-sm" @click="openFullImgModal">이미지
                                    모아보기</button>
                            </div>
                        </template>
                    </subTitleBar>
                    <div class="ui-content">
                        <div class="tbl-wrap">
                            <table class="table reg">
                                <colgroup>
                                    <col style="width: 160px;">
                                    <col style="width: auto;">
                                    <col style="width: 160px;">
                                    <col style="width: auto;">
                                </colgroup>
                                <tbody>
                                    <tr v-if="state.eventMaster.mainImg1Info">
                                        <th scope="row">메인 컨텐츠</th>
                                        <td>
                                            <a @click="fileDownload(state.eventMaster.mainImg1)">
                                                {{ state.eventMaster.mainImg1Info.fileOriNm }}
                                            </a>
                                        </td>
                                        <th scope="row">이미지 설명</th>
                                        <td>{{ state.eventMaster.mainImgDesc1 }}</td>
                                    </tr>
                                    <tr v-if="state.eventMaster.mainImg2Info">
                                        <th scope="row"></th>
                                        <td>
                                            <a @click="fileDownload(state.eventMaster.mainImg2)">
                                                {{ state.eventMaster.mainImg2Info.fileOriNm }}
                                            </a>
                                        </td>
                                        <th scope="row">이미지 설명</th>
                                        <td>{{ state.eventMaster.mainImgDesc2 }}</td>
                                    </tr>
                                    <tr v-if="state.eventMaster.mainImg3Info">
                                        <th scope="row"></th>
                                        <td>
                                            <a @click="fileDownload(state.eventMaster.mainImg3)">
                                                {{ state.eventMaster.mainImg3Info.fileOriNm }}
                                            </a>
                                        </td>
                                        <th scope="row">이미지 설명</th>
                                        <td>{{ state.eventMaster.mainImgDesc3 }}</td>
                                    </tr>
                                    <tr v-if="state.eventMaster.mainImg4Info">
                                        <th scope="row"></th>
                                        <td>
                                            <a @click="fileDownload(state.eventMaster.mainImg4)">
                                                {{ state.eventMaster.mainImg4Info.fileOriNm }}
                                            </a>
                                        </td>
                                        <th scope="row">이미지 설명</th>
                                        <td>{{ state.eventMaster.mainImgDesc4 }}</td>
                                    </tr>
                                    <tr v-if="state.eventMaster.mainImg5Info">
                                        <th scope="row"></th>
                                        <td>
                                            <a @click="fileDownload(state.eventMaster.mainImg5)">
                                                {{ state.eventMaster.mainImg5Info.fileOriNm }}
                                            </a>
                                        </td>
                                        <th scope="row">이미지 설명</th>
                                        <td>{{ state.eventMaster.mainImgDesc5 }}</td>
                                    </tr>

                                    <tr v-if="state.eventMaster.bkgImgInfo">
                                        <!-- 배경이미지 -->
                                        <th scope="row">백그라운드 이미지</th>
                                        <td>
                                            <a @click="fileDownload(state.eventMaster.bkgImg)">
                                                {{ state.eventMaster.bkgImgInfo.fileOriNm }}
                                            </a>
                                        </td>
                                        <th scope="row">이미지 설명</th>
                                        <td>{{ state.eventMaster.bkgImgDesc }}</td>
                                    </tr>
                                    <tr v-if="state.eventMaster.bottomImgInfo">
                                        <!-- 배경이미지 -->
                                        <th scope="row">하단 콘텐츠</th>
                                        <td>
                                            <a @click="fileDownload(state.eventMaster.bottomImg)">
                                                {{ state.eventMaster.bottomImgInfo.fileOriNm }}
                                            </a>
                                        </td>
                                        <th scope="row">이미지 설명</th>
                                        <td>{{ state.eventMaster.bottomImgDesc }}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
                <div class="ui-section"
                    v-if="!(state.eventMaster.eventType === 'ROULETTE') && !(state.eventMaster.eventType === 'ATTENDANCE')">
                    <subTitleBar :subTitle="'당첨혜택'" />
                    <div class="ui-content">
                        <div class="tbl-wrap">
                            <table class="table reg">
                                <colgroup>
                                    <col style="width: 160px;">
                                    <col style="width: auto;">
                                    <col style="width: 160px;">
                                    <col style="width: auto;">
                                </colgroup>
                                <tbody
                                    v-if="state.eventMaster.eventType === 'GENERAL' || state.eventMaster.eventType === 'QUIZ'">
                                    <tr>
                                        <th scope="row">선착순 설정</th>
                                        <td>

                                            <template
                                                v-if="state[state.eventQnG[state.eventMaster.eventType === 'GENERAL' ? 0 : 1]].eventFrcYn === 'Y'">
                                                사용</template>
                                            <template v-else> 미사용</template>
                                        </td>
                                        <th scope="row">선착순 인원 설정</th>
                                        <td>
                                            <template
                                                v-if="state[state.eventQnG[state.eventMaster.eventType === 'GENERAL' ? 0 : 1]].eventFrcCount > 0">
                                                {{ state.eventGeneral.eventFrcCount }} 명</template>
                                            <template v-else>-</template>
                                        </td>
                                    </tr>
                                    <tr v-if="state.eventMaster.eventBnefType === 'IMMEDIATELY'">
                                        <th scope="row">즉시 지급 혜택</th>
                                        <td colspan="3">
                                            <template
                                                v-if="state[state.eventQnG[state.eventMaster.eventType === 'GENERAL' ? 0 : 1]].eventPoint > 0">
                                                {{ state[state.eventQnG[state.eventMaster.eventType === 'GENERAL' ? 0 :
                                                    1]].eventPoint }}
                                                ({{ state[state.eventQnG[state.eventMaster.eventType ===
                                                    'GENERAL' ? 0 :
                                                    1]].pointPlcyCd }})
                                            </template>
                                            <template v-else>-</template>
                                        </td>
                                    </tr>
                                    <tr v-if="state.eventMaster.eventBnefType === 'AFTER'">
                                        <th scope="row">당첨 후 지급혜택</th>
                                        <td colspan="3">
                                            <template
                                                v-if="state[state.eventQnG[state.eventMaster.eventType === 'GENERAL' ? 0 : 1]].eventProductYn === 'Y'">
                                                <div class="tbl-wrap mt-10">
                                                    <table class="table reg t-center">
                                                        <colgroup>
                                                            <col style="width: auto">
                                                            <col style="width: 140px">
                                                            <col style="width: 140px">
                                                            <col style="width: 160px">
                                                        </colgroup>
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" class="t-center">제품 명(최대 30자)</th>
                                                                <th scope="col" class="t-center">당첨 수량</th>
                                                                <th scope="col" class="t-center">제세공과금 대상</th>
                                                                <th scope="col" class="t-center">당첨 등 수</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="(item, index) in state.productList" :key="index">
                                                                <td class="t-left">{{ item.productNm }}</td>
                                                                <td>{{ item.productCnt }}</td>
                                                                <td>{{ item.productTax }}</td>
                                                                <td>{{ item.text }}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </template>
                                            <template v-else>-</template>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="ui-section">
                    <!-- {{ state.eventRoulette }} -->
                    <subTitleBar :subTitle="'기능'" />
                    <div class="ui-content">
                        <div class="tbl-wrap">
                            <table class="table reg">
                                <colgroup>
                                    <col style="width: 160px;">
                                    <col style="width: auto;">
                                    <col style="width: 160px;">
                                    <col style="width: auto;">
                                </colgroup>
                                <!-- 일반만 사용 -->
                                <tbody v-if="state.eventMaster.eventType === 'GENERAL'">
                                    <tr>
                                        <th scope="row">버튼 이벤트</th>
                                        <td v-if="state.eventGeneral.eventBtnType === 'JOIN'">이벤트 참여</td>
                                        <td v-if="state.eventGeneral.eventBtnType === 'LINK'">외부링크</td>
                                        <td v-if="state.eventGeneral.eventBtnType === 'DISABLE'">비노출</td>
                                        <th scope="row">버튼명</th>
                                        <td>
                                            {{ state.eventGeneral.eventBtnName }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">외부링크</th>
                                        <td colspan="3">
                                            {{ state.eventGeneral.eventBtnLink }}
                                        </td>
                                    </tr>

                                </tbody>
                                <!-- 퀴즈만 사용 -->
                                <tbody v-if="state.eventMaster.eventType === 'QUIZ'">
                                    <tr>
                                        <th scope="row">답변</th>
                                        <td>

                                            <div class="tbl-wrap">
                                                <table class="table reg">
                                                    <colgroup>
                                                        <col style="width: 60px;">
                                                        <col style="width: auto;">
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">정답</th>
                                                            <th scope="col">답변</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(item, index) in 4" :key="index">
                                                            <td>
                                                                <span class="radio"
                                                                    v-if="(index + 1) === state.eventQuiz.eventAnswer">
                                                                    <input id="correctRdo2" name="correctRdoGroup"
                                                                        type="radio" checked="">
                                                                    <label for="correctRdo2"></label>
                                                                </span>
                                                            </td>

                                                            <td>
                                                                {{ state.eventQuiz[`eventQuiz${(index + 1)}`] }}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                        <th scope="row">힌트 이벤트</th>
                                        <td>
                                            <p>
                                                <template v-if="state.eventQuiz.eventHintType === 'LINK'">외부링크</template>
                                                <template v-else>텍스트</template>
                                            </p>
                                            <p class="mt-10" v-if="state.eventQuiz.eventHintType === 'LINK'">
                                                {{ state.eventQuiz.eventHintLink }}
                                            </p>
                                            <p class="mt-10" v-if="state.eventQuiz.eventHintType === 'TEXT'">
                                                {{ state.eventQuiz.eventHintTxt }}
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-if="state.eventMaster.eventType === 'ROULETTE'">
                                    <tr v-if="state.eventRoulette.immyPayBnef">
                                        <th scope="row">즉시지급혜택</th>
                                        <td colspan="3">
                                            즉시지급
                                        </td>
                                    </tr>
                                    <tr v-if="state.eventRoulette.pzwnPayBnef">
                                        <th scope="row">당첨 후 지급 혜택</th>
                                        <td colspan="3">
                                            상품
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">파이 개수</th>
                                        <td colspan="3">{{ state.eventRoulette.rouletteCnt }}</td>
                                    </tr>
                                    <tr>
                                        <!-- {{ state.productList }} -->
                                        <th scope="row">파이 정보</th>
                                        <td colspan="3">
                                            <div class="tbl-wrap">
                                                <table class="table reg">
                                                    <colgroup>
                                                        <col style="width: 100px;">
                                                        <col style="width: 160px;">
                                                        <col style="width: auto;">
                                                        <col style="width: 160px;">
                                                        <!-- <col style="width: 240px;"> -->
                                                        <col style="width: 160px;">
                                                        <col style="width: 100px;">
                                                        <col style="width: 100px;">
                                                        <col style="width: 160px;" v-if="state.eventRoulette.immyPayBnef">
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" class="t-center">위치</th>
                                                            <th scope="col" class="t-center">당첨 구분</th>
                                                            <th scope="col" class="t-center">표시 텍스트</th>
                                                            <th scope="col" class="t-center"
                                                                v-if="state.eventRoulette.immyPayBnef">지급 리워드 포인트</th>
                                                            <th scope="col" class="t-center"
                                                                v-if="state.eventRoulette.pzwnPayBnef">지급 상품<br>
                                                                (꽝 설정 시 상품 호출 불가)
                                                            </th>
                                                            <th scope="col" class="t-center">제세공과금 대상<br>
                                                                (설정 시 수동 방송)
                                                            </th>
                                                            <th scope="col" colspan="2" class="t-center"
                                                                v-if="state.eventRoulette.immyPayBnef">당첨 인원 제한 설정<br>

                                                            </th>
                                                            <th scope="col" colspan="2" class="t-center"
                                                                v-if="state.eventRoulette.pzwnPayBnef">당첨 인원 제한 설정
                                                            </th>
                                                            <th scope="col" class="t-center">기본 확률<br>
                                                                (합계 100%)
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(item, index) in state.eventRoulette.rouletteCnt"
                                                            :key="index">


                                                            <td class="t-center">
                                                                <div
                                                                    :class="`evt-pie-${state.eventRoulette.rouletteCnt}-${index + 1}`">
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <template
                                                                    v-if="state.eventRoulette[`${'rouletteType'}${index + 1}`] === '1'">
                                                                    당첨
                                                                </template>
                                                                <template v-else>꽝</template>
                                                            </td>
                                                            <td class="t-center">{{
                                                                state.eventRoulette[`${'rouletteTxt'}${index + 1}`] }}
                                                            </td>
                                                            <td class="t-right" v-if="state.eventRoulette.immyPayBnef">
                                                                {{ state.eventRoulette[`${'roulettePoint'}${index + 1}`]
                                                                }}P<br>
                                                                <template
                                                                    v-if="state.eventRoulette[`${'pointPlcyCd'}${index + 1}`]">
                                                                    ({{ state.eventRoulette[`${'pointPlcyCd'}${index + 1}`]
                                                                    }})
                                                                </template>

                                                            </td>
                                                            <td class="t-center" v-if="state.eventRoulette.pzwnPayBnef">
                                                                <template
                                                                    v-if="state.eventRoulette[`${'rouletteType'}${index + 1}`] === '1'">
                                                                    {{ state.productList[index].productNm }}
                                                                </template>
                                                            </td>
                                                            <td class="t-center">
                                                                {{ state.eventRoulette[`${'rouletteTax'}${index + 1}`] }}
                                                            </td>
                                                            <td class="t-right" colspan="2">
                                                                {{ state.eventRoulette[`${'roulettePcpCnt'}${index + 1}`] }}
                                                                명
                                                            </td>
                                                            <td class="t-right">
                                                                {{ state.eventRoulette[`${'roulettePrbl'}${index + 1}`] }}%

                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-if="state.eventMaster.eventType === 'ATTENDANCE'">

                                    <tr>
                                        <th scope="row">날짜</th>
                                        <td colspan="3">{{ state.eventAtnd.eventDay }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">기본 지급 포인트</th>
                                        <td>{{ state.eventAtnd.eventBasicPoint }} ({{ state.eventAtnd.basicPointPlcyCd }} )
                                        </td>
                                        <th scope="row">개근 혜택</th>
                                        <td>
                                            <template v-if="state.eventAtnd.eventGaegnPoint > 0">
                                                {{ state.eventAtnd.eventGaegnPoint }}
                                                ({{ state.eventAtnd.gaegnPointPlcyCd }})
                                            </template>
                                            <template v-else>
                                                사용하지 않음
                                            </template>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">누적 혜택</th>
                                        <td colspan="3">
                                            <div class="tbl-wrap" v-if="state.eventAtnd.list.length > 0">
                                                <table class="table reg">
                                                    <colgroup>
                                                        <col style="width: 140px">
                                                        <col style="width: 140px">
                                                        <col style="width: auto">
                                                        <col style="width: auto">
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" class="t-center">회차</th>
                                                            <th scope="col" class="t-center">지급 포인트</th>
                                                            <th scope="col" class="t-left">기본 이미지</th>
                                                            <th scope="col" class="t-left">지급 이미지</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(item, index) in state.eventAtnd.list" :key="index">
                                                            <td class="t-center">
                                                                {{ item.chcEps }}
                                                            </td>
                                                            <td class="t-right">
                                                                {{ item.chcEpsPayPnt }}
                                                            </td>
                                                            <td class="t-left">
                                                                <div style="width:150px"
                                                                    v-if="!(item.chcEpsPayImg1Info === null)">
                                                                    <img :src="item.chcEpsPayImg1Info.fileUrl" />
                                                                </div>
                                                            </td>
                                                            <td class="t-left">
                                                                <div style="width:150px">
                                                                    <template v-if="!(item.chcEpsPayImg2Info === null)">
                                                                        <img :src="item.chcEpsPayImg2Info.fileUrl" />
                                                                    </template>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div v-else>누적 혜택 없음</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 당첨자 내역 -->
            <eventJoinList v-if="state.tabValue === 1" :eventSn="state.eventSn"
                :eventBnefType="state.eventMaster.eventBnefType" :eventProgress="state.eventMaster.eventProgress"
                :eventType="state.eventMaster.eventType">
            </eventJoinList>
        </div>
    </div>
    <div class="btn-bottom-set flex justify-center">
        <button type="button" class="btn btn-sl nega" @click="goToPage('/event/list')">목록</button>
        <button type="button" class="btn btn-sl posi" :disabled="!(state.eventMaster.eventProgress === 'WAITING')"
            @click="onChangeAuthEdit('edit')">수정</button>

        <button type="button" class="btn btn-sl posi" @click="onChangeAuthEdit('end')"
            :disabled="(state.eventMaster.eventProgress == 'END' || state.eventMaster.eventProgress == 'STOP')">긴급종료</button>

    </div>
    <!-- 이미지 모아 보기 -->
    <DefaultModal :isShow="isFullImg" :modalName="'isFullImg'" :modalTitle="'콘텐츠 이미지 미리보기'" :buttonConfirm="'닫기'"
        :buttonCancel="''" @modalclose="modalControl">
        <template #modalcontent>
            <div style="width:100%; overflow:hidden">
                <template v-if="state.eventMaster.mainImg1Info">
                    <div>
                        <img :src="`${state.eventMaster.mainImg1Info.fileUrl}`" :alt="state.eventMaster.mainImgDesc1"
                            style="width:100%;" />
                    </div>
                </template>
                <template v-if="state.eventMaster.mainImg2Info">
                    <div>
                        <img :src="`${state.eventMaster.mainImg2Info.fileUrl}`" :alt="state.eventMaster.mainImgDesc2"
                            style="width:100%;" />
                    </div>
                </template>
                <template v-if="state.eventMaster.mainImg3Info">
                    <div>
                        <img :src="`${state.eventMaster.mainImg3Info.fileUrl}`" :alt="state.eventMaster.mainImgDesc3"
                            style="width:100%;" />
                    </div>
                </template>
                <template v-if="state.eventMaster.mainImg4Info">
                    <div>
                        <img :src="`${state.eventMaster.mainImg4Info.fileUrl}`" :alt="state.eventMaster.mainImgDesc4"
                            style="width:100%;" />
                    </div>

                </template>
                <template v-if="state.eventMaster.mainImg5Info">
                    <div>
                        <img :src="`${state.eventMaster.mainImg5Info.fileUrl}`" :alt="state.eventMaster.mainImgDesc5"
                            style="width:100%;" />
                    </div>

                </template>
                <template v-if="state.eventMaster.bkgImgInfo">
                    <div>
                        <img :src="`${state.eventMaster.bkgImgInfo.fileUrl}`" :alt="state.eventMaster.bkgImgDesc"
                            style="width:100%;" />
                    </div>

                </template>
                <template v-if="state.eventMaster.bottomImgInfo">
                    <div>
                        <img :src="`${state.eventMaster.bottomImgInfo.fileUrl}`" :alt="state.eventMaster.bottomImgDesc"
                            style="width:100%;" />
                    </div>

                </template>
            </div>
        </template>
    </DefaultModal>
</template>
<script>
import { reactive, inject, ref, onMounted, computed, onUnmounted } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import eventJoinList from './components/eventJoinList.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _detailEvent, _getEventJoinList, _eventStop } from '@/api/event.js';

export default {
    components: { DefaultModal, eventJoinList },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow, isRequestShow, fileDownload } = useCommFunc();
        const isFullImg = ref(false);
        const store = useStore();
        const route = useRoute();
        const state = reactive({
            eventSn: '',
            eventMaster: {},
            eventGeneral: {},
            eventQuiz: {},
            eventRoulette: {},
            eventAtnd: {},
            eventQnG: ['eventGeneral', 'eventQuiz'],
            eventTabs: [
                { label: '컨텐츠', value: 0 },
                { label: '참여내역', value: 1 }
            ],
            tabValue: 0,
            productList: [
                { productNm: '' }
            ],
            productList_: [],
            productKey: 'productNm',
            pageMode: '',
            infAgrmYnCpm: false
        });
        /**
         * 권한은 스토어에서 가져옴 (권한여부는 메뉴리스트에서 가져온다)
         * store.state.getMenuItem.menuInfo
         * "auth1RegistYn": "Y/N",  등록
         * "auth2UpdateYn": "Y/N",  수정
         * "auth3DeleteYn": "Y/N",  삭제
         * "auth4ApproveYn": "Y/N", 승인
         * "auth5DownloadYn": "Y/N", 다운 
         * "auth6MaskingYn": "Y/N" 마스킹
         */
        const { onChangeMaskingRol, onChangeEditRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        onMounted(() => {
            state.eventSn = route.query.eventSn;
            console.log(state.eventSn);
            detailEvent();
            emitter.$on('onChangeEdit', onChangeEdit);
        });
        onUnmounted(() => {
            emitter.$off('onChangeEdit');
        });
        //수정권한 처리
        const onChangeAuthEdit = async (type) => {
            state.pageMode = type;
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };
        // 버튼별 권한 처리 
        const onChangeEdit = () => {
            if (state.pageMode === 'edit') {
                let url = '';
                state.eventMaster.eventType === 'GENERAL' ? url = `/event/edit/genaral` : state.eventMaster.eventType === 'QUIZ' ? url = `/event/edit/quiz` : state.eventMaster.eventType === 'ROULETTE' ? url = `/event/edit/roulette` : url = `/event/edit/attend`;
                $Modal.confirm({
                    title: '',
                    message: '수정하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(success => {
                        console.log(success);
                        goToPage(`${url}?eventSn=${state.eventSn}`);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            if (state.pageMode === 'end') {
                console.log('삭제');
                actionBtns('stop');
            }
        };
        const detailEvent = async () => {
            try {
                let params = state.eventSn;
                const response = await _detailEvent(params);
                console.log(response);

                state.eventMaster = response.data.data.eventMaster;
                state.eventMaster.infAgrmYnCpm === 'Y' ? state.infAgrmYnCpm = true : state.infAgrmYnCpm = false;
                state.productList = response.data.data.productList;
                if (state.eventMaster.eventType === 'QUIZ') {
                    state.eventQuiz = response.data.data.eventQuiz;
                } else if (state.eventMaster.eventType === 'GENERAL') {
                    state.eventGeneral = response.data.data.eventGeneral;
                } else if (state.eventMaster.eventType === 'ROULETTE') {
                    state.eventRoulette = response.data.data.eventRoulette;
                    state.productList = [];
                    state.productList_ = response.data.data.productList;
                    console.log(state.productList_);
                    for (let i = 0; i < (state.eventRoulette.rouletteCnt); i++) {
                        if (state.eventRoulette['rouletteProduct' + (i + 1)] !== 0) {
                            let list = state.productList_;
                            let item = list[0];
                            console.log(i, '상품 있음', item);
                            state.productList.splice(i, 0, item);
                            list.splice(0, 1);
                        } else {
                            console.log(i, ' 상품없음 ');
                            state.productList.splice(i, 0, { eventPrdSn: null, b2bMallYn: null, productNm: null, productCnt: null, productTax: null, text: null });
                        }
                    }
                } else if (state.eventMaster.eventType === 'ATTENDANCE') {
                    state.eventAtnd = response.data.data.eventAtnd;
                }
            } catch (error) {
                console.log(error);
            }
        };
        const eventStop = async () => {
            try {
                let params = { eventSn: state.eventSn };
                const response = await _eventStop(params);
                if (response.data.code === 'OK') {
                    goToPage('/event/list');
                }
            } catch (error) {
                console.log(error);
            }
        };

        const openFullImgModal = (type) => {
            isFullImg.value = true;
        };
        //모달창열기 
        const actionBtns = async (type) => {
            if (type === 'stop') {
                state.modalMsg = '긴급종료 하시겠습니까?';
            }
            $Modal.confirm({
                title: '',
                message: state.modalMsg,

                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            })
                .then(success => {
                    console.log(success);
                    eventStop();
                })
                .catch(error => {
                    console.log(error);
                });
        };
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (modalName === 'isFullImg') {
                isFullImg.value = false;
            } else if (!modalName) {
                isFullImg.value = false;
            }
        };
        const TabsChange = (value) => {
            state.tabValue = value;
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            fileDown,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            isRequestShow,
            state,
            openModal,
            isFullImg,
            modalControl,
            openFullImgModal,
            fileDownload,
            TabsChange,
            actionBtns,
            onChangeAuthEdit

        };
    }
};
</script>