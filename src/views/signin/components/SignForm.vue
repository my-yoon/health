<template>
    <div class="ui-login-form-align">
        <div class="ui-login-form-head">
            <h3>로그인</h3>
            <p>아이디와 비밀번호를 입력해주세요</p>
        </div>
        <div class="ui-login-form-content">
            <div class="ui-login-form-item">
                <label for="userID">아이디</label>
                <div class="reg-item">
                    <input type="text" id="userID" class="form-control" placeholder="아이디를 입력하세요." v-model="state.userId">
                </div>
                {{ state.userId }}
            </div>
            <div class="ui-login-form-item">
                <label for="userPW">비밀번호</label>
                <div class="reg-item">
                    <input type="password" id="userPW" class="form-control" placeholder="비밀번호를 입력하세요."
                        v-model="state.userPassword">
                </div>
                <span class="input-guide error mt-6">5회 로그인 실패시 접속이 제한됩니다.(3/5)</span>
            </div>
            <div class="ui-login-form-item mt-12">
                <span class="checkbox">
                    <input id="idSave" name="idSaveGroup" type="checkbox">
                    <label for="idSave">아이디 저장</label>
                </span>
            </div>
        </div>
        <div class="btn-bottom-set mt-40">
            <button type="button" class="btn btn-sl posi full" @click="signIn">로그인</button>
        </div>
        <div class="ui-login-util">
            <ul>
                <li>
                    <button type="button" class="ui-login-util-item">가입신청</button>
                </li>
                <li>
                    <button type="button" class="ui-login-util-item">아이디 찾기</button>
                </li>
                <li>
                    <button type="button" class="ui-login-util-item">비밀번호 찾기</button>
                </li>
            </ul>
        </div>
    </div>
</template>