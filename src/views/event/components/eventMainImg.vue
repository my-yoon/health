<template>
    <div class="ui-section">
        <div>
            <subTitleBar :subTitle="'메인컨텐츠'" />
            <div class="ui-content">
                <div class=" table-util flex space-between">
                    <slot name="btns"></slot>
                    <div class="btn-set-m"><span class="ess"></span> 표시는 필수항목입니다.</div>
                </div>
                <div class="tbl-wrap mt-10">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 45px;">
                            <col style="width: auto;">
                            <col style="width: auto;">
                            <col style="width: 120px;">
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col" class="chk">
                                    <span class="checkbox">
                                        <input id="mainChkAll" name="mainGroup" type="checkbox">
                                        <label for="mainChkAll"></label>
                                    </span>
                                </th>
                                <th scope="col">메인 컨텐츠 이미지<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <th scope="col">이미지 설명<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <th scope="col">노출 순서<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <slot name="file"></slot>
                        </tbody>
                    </table>
                </div>
                <div class="ui-table-guide">
                    <span class="input-guide">메인 이미지는 가로 375, 750, 1125px 기준으로 제작되어야 합니다.</span>
                    <span class="input-guide">이미지 설명은 시각 장애인이 텍스트 리더기를 통해 읽을 수 있도록 사용하는 목적이므로 가급적 자세한 정보를 입력하십시오.</span>
                </div>
            </div>
        </div>
    </div>
</template>