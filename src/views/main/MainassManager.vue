<template>
    <div>
        <div class="ui-section">
            <subTitleBar :subTitle="'계정 정보'" />
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
                                <th scope="row">아이디</th>
                                <td></td>
                                <th scope="row">이름</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th scope="row">부서명</th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" value="부서명">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>

                                <th scope="row">이메일</th>
                                <td colspan="3">
                                    <!-- <div class="reg-group">
                                        <div class="reg-item">

                                            <input type="text" class="form-control" v-model="state.mailType1"
                                                :disabled="state.accountInfo.admnLvlId !== 'A00' || state.mailConfirm"
                                                @change="mailChange">
                                        </div>
                                        <span class="ui-coupler">@</span>
                                        <commselect :selectType="'searchCode.mailType2'" @changedValue="selectedOptions"
                                            :initData="state.mailType2" ref="mailType"
                                            :disabled="state.accountInfo.admnLvlId !== 'A00' || state.mailConfirm" />
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm" @click="actionBtns('mailrequest')">이메일
                                                인증
                                            </button>
                                        </div>
                                    </div>
                                    <div class="reg-group" v-if="state.mailConfirm">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" placeholder="인증번호 입력"
                                                v-model="state.mailConfirmNum" :disabled="state.mailConfirmDone">
                                        </div>
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm" @click="confirmEmail"
                                                :disabled="!state.mailConfirmNum.length > 0 || state.mailConfirmDone">확인</button>
                                            <span class="input-guide inline">
                                                <template v-if="state.mailConfirmDone">
                                                    인증 완료
                                                </template>
                                                <template v-else>
                                                    인증유효시간
                                                    <strong>{{ formattedTime }}</strong>
                                                </template>
                                            </span>
                                        </div>
                                    </div> -->
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">휴대전화번호</th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" class="form-control">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" class="form-control">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'권한 정보'" />
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
                                <th scope="row">채널</th>
                                <td></td>
                                <th scope="row">권한레벨</th>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'소속 정보'" />
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
                                <th scope="row">회사명</th>
                                <td colspan="3"></td>
                            </tr>
                            <tr>
                                <th scope="row">관리자 이름</th>
                                <td>이순신</td>
                                <th scope="row">관리자 휴대전화번호</th>
                                <td>010-2233-2233</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'이력 정보'" />
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
                                <th scope="row">최종로그인일시</th>
                                <td colspan="3">2023-09-29 16:22:58</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>