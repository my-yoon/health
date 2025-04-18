<template>
    <div style="min-height:100vh">
        <div class="example_header">
            <h1>KB Admin 컴포넌트 사용</h1>
        </div>

        <div class="example">
            <div class="example_menu">
                <ul>
                    <li v-for="(item, index) in state.menulist" :key="index" @click="onChangeExample(item.value)"
                        :class="{ active: state.currentmenu === item.value }">
                        {{ item.label }}
                    </li>
                </ul>
            </div>
            <div class="example_con">
                <div class="gap" v-if="state.currentmenu === 'example0'">
                    <h2>{{ state.menulist[0].label }}</h2>
                    <div class="dec">로그인 후 <strong>_getMenulist(@/api/user.js)</strong>에서 권한과 함께 자동 셋팅</div>
                    <div class="dec">권한 추가 및 삭제는 권한관리에서 가능 </div>
                    <MenuSample />
                </div>

                <div class="gap" v-if="state.currentmenu === 'example1'">
                    <h2>{{ state.menulist[1].label }}</h2>
                    <div class="dec"><strong>@/router/modules/1depth메뉴명.js</strong> 라우터 작성
                        <strong>@/router/index.js</strong>모듈로 추가
                    </div>
                    <div class="dec">라우터 path 작성 시 DB에서 생성된 ( <strong>_getMenulist(@/api/user.js)</strong>) URL과 메뉴 코드 함께 작성
                    </div>
                    <div class="dec">meta의 sublocation_depth <strong>필수 작성(메뉴 depth순서대로 작성)</strong></div>
                    <div class="dec">템플릿 작성은 표준 가이드 규칙 대로 작성 (폴더명: 소문자 표기, 템플릿명: 대소문자구분)</div>
                    <div class="dec"> (<router-link to="/member/list">작성된 레이아웃 보기</router-link>)</div>
                    <RouterSample />
                </div>
                <!-- <div class="gap" v-if="state.currentmenu === 'example2'">
                    <h2>{{ state.menulist[2].label }}</h2>
                    <div class="dec">페이지 상단 타이틀 옆의 새창 버튼 처리
                        <span class="admin-new-window" style="display: inline-block;"></span>
                    </div>
                    <div class="dec"><strong>@/router/modules/content.js</strong>파일에 작성</div>
                    <div class="dec">페이지라우터에 작성된 path, url뒤에<strong> "_new"</strong>프리픽스 작성</div>
                    <div class="dec"> (<router-link to="/member/list">작성된 레이아웃 보기</router-link>)</div>
                    <RouterPopSample />
                </div> -->
                <div class="gap" v-if="state.currentmenu === 'example3'">
                    <h2>{{ state.menulist[2].label }}</h2>
                    <div class="dec">emitter 사용</div>
                    <div class="dec">글로벌로 등록(main.js참고)</div>
                    <div class="dec">함수명 작성시 기존 함수와 겹치지 않도록 <strong>"_bus"</strong> 프리픽스 작성</div>

                    <EventBusSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example4'">
                    <h2>{{ state.menulist[3].label }}</h2>
                    <div class="dec">@/api폴더안에 1depth메뉴별로 api 작성</div>
                    <div class="dec">@/core/request.js에 기본설정되어 있음</div>
                    <div class="dec">api호출 주소는 .env 설정 파일 참고</div>
                    <ApiSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example5'">
                    <h2>{{ state.menulist[4].label }}</h2>
                    <div class="dec">글로벌로 등록(main.js참고)</div>
                    <div class="dec">페이지내 사용시 <strong>return에 "dayJS" 추가 필수</strong> </div>
                    <div class="dec">inject 사용 </div>
                    <MomentSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example6'">
                    <h2>{{ state.menulist[5].label }}</h2>
                    <div class="dec">글로벌로 등록</div>
                    <div class="dec">페이지내 사용시 <strong>return에 "lodash" 추가 필수</strong> </div>
                    <LodashSample />
                </div>

                <div class="gap" v-if="state.currentmenu === 'example7'">
                    <h2>{{ state.menulist[6].label }}</h2>
                    <div class="dec">vue3-toastify 사용</div>
                    <div class="dec">글로벌로 등록(main.js참고)</div>
                    <ToastedSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example8'">
                    <h2>{{ state.menulist[7].label }}</h2>
                    <div class="dec">Teleport기반 모달 사용</div>
                    <div class="dec">공통 모달은 <strong>alert창, 단순 알림</strong>만 사용함</div>
                    <div class="dec">글로벌로 등록되어 있어 컴포넌트 별도로 등록하지 않고 <strong>"inject"</strong>로 사용</div>
                    <div class="dec">사용 옵션은 @/plugins/modal/modal/ComfirmModal.vue 참고</div>
                    <div class="dec">디자인 확인</div>
                    <div class="dec_sample">
                        <button class="btn btn-ss" @click="modal('simple')">단순 심플</button>
                        <button class="btn btn-ss" @click="modal('alert')">alert modal</button>
                        <button class="btn btn-ss" @click="modal('confirm')">confirm modal</button>
                    </div>
                    <ModalSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example9'">
                    <h2>{{ state.menulist[8].label }}</h2>
                    <div class="dec">Teleport기반 모달 사용</div>
                    <div class="dec">페이지내에 DefaultModal컴포넌트 등록 하여 콘테츠 부분만 변경하여 사용(하단 버튼 유무, 타이틀, 닫기버튼 처리는 props로 처리 됨)</div>
                    <div class="dec">디자인 확인</div>
                    <div class="dec_sample">
                        <div>
                            <button class="btn btn-ss" @click="openModal_sample">모달열기</button>
                            <DefaultModal :isShow="isShow" :modalName="'isShow'" :modalTitle="'타이틀 내용'"
                                :buttonConfirm="'저장'" :buttonCancel="'취소'" @modalclose="modalclose_sample">
                                <template #modalcontent>
                                    <div>팝업내용작성</div>
                                </template>
                            </DefaultModal>
                        </div>
                    </div>
                    <ModalContentSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example10'">
                    <h2>{{ state.menulist[9].label }}</h2>
                    <div class="dec">템플릿에서 전역으로 사용 되는 공통함수</div>
                    <div class="dec">1. 페이지 이동(goToPage('이동할 경로 작성'))</div>
                    <div class="dec">2. 모달 팝업(openModal('모달네임')) 지정된 모달창만 사용 다음 페이지 참고</div>
                    <div class="dec">3. 파일다운(fileDown) </div>
                    <div class="dec">테이블 리스트의 파일 다운로드시에는 사유등록 팝업에 내용 작성 후 작성 내용을<strong>"fileDown()"</strong>에
                        <strong>params</strong>로 보내어 처리(23/09/18 미구현되어 있음 추후 전달 내용)
                    </div>
                    <div class="dec">템플릿에서 전역으로 사용 되는 공통함수는 스트라토에서 전달 개별적으로 추가 금지</div>
                    <CommFuncSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example11'">
                    <h2>{{ state.menulist[10].label }}</h2>
                    <div class="dec">템플릿에서 전역으로 사용 되는 공통 모달팝업</div>
                    <div class="dec">1. 파일다운로드 사유등록 모달팝업(모달 네임 = isDownShow)</div>
                    <div class="dec">2. 사업자등록증 보기 모달팝업(모달 네임 = isImgShow)</div>
                    <div class="dec">3. 파트너 리스트 조회 모달팝업(모달 네임 = isPartnerShow)</div>
                    <div class="dec">4. 가입재신청사유등록 모달팝업(모달 네임 = isRequestShow)</div>
                    <div class="dec">디자인 확인</div>
                    <div class="dec_sample">
                        <button class="btn btn-ss" @click="openModal('isPartnerShow')">파트너조회 팝업</button>
                        <button class="btn btn-ss" @click="openModal('isDownShow')">다운로드 사유 등록 팝업</button>
                        <button class="btn btn-ss" @click="openModal('isImgShow', imgfile('Document-230825.jpg'))">사업자등록증 사본
                            팝업</button>
                        <button class="btn btn-ss" @click="openModal('isRequestShow')">가입재신청 사유 등록 팝업</button>
                        <DefaultModal :isShow="isPartnerShow" :modalTitle="'파트너 조회'" :buttonConfirm="'닫기'"
                            :buttonCancel="''" :modalName="'isPartnerShow'" @modalclose="modalControl">
                            <template #modalcontent>
                                <PartnerSerch @selectPartner="selectPartner" />
                            </template>
                        </DefaultModal>
                        <DefaultModal :isShow="isDownShow" :modalTitle="'다운로드 사유 등록'" :buttonConfirm="'저장'"
                            :buttonCancel="''" :modalName="'isDownShow'" @modalclose="modalControl">
                            <template #modalcontent>
                                <DownModalCon @downloadFormat="downConfirm" />
                            </template>
                        </DefaultModal>
                        <DefaultModal :isShow="isImgShow" :modalTitle="'사업자등록증 사본'" :buttonConfirm="'닫기'" :buttonCancel="''"
                            :modalName="'isImgShow'" @modalclose="modalControl">
                            <template #modalcontent>
                                <div class="ui-img-section">
                                    {{ state.imgName }}
                                </div>
                            </template>
                        </DefaultModal>
                        <DefaultModal :isShow="isRequestShow" :modalTitle="'가입재신청 사유 등록'" :buttonConfirm="'확인'"
                            :buttonCancel="'취소'" :modalName="'isRequestShow'" @modalclose="modalControl">
                            <template #modalcontent>
                                <RequestRegist @requestFormat="requestConfirm" />
                            </template>
                        </DefaultModal>
                    </div>
                    <CommModalSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example12'">
                    <h2>{{ state.menulist[11].label }}</h2>
                    <div class="dec">테이블 상단에 검색필터가 있는 경우 태그 참고하여 사용</div>
                    <div class="dec">기간 조회가 있는 경우 &lt;dateSerch&gt; 사용(날짜별 옵션값은 &lt;dateSerch&gt;안에 처리 되어 있음 결과값 콘솔참고)</div>
                    <div class="dec">데이터 피커만 사용 하는 경우에는 :pickerOnly 옵션에서 true, false 로 처리 하여 사용</div>
                    <div class="dec"><button class="btn btn-ss" @click="goToPage('/cs_center/notice/list')">사용 샘플
                            보기</button> </div>
                    <div class="dec">디자인 확인</div>
                    <div class="dec_sample">
                        <div class="ui-data-filter">
                            <div class="form-item">
                                <!-- 기간조회가 없는 경우 태그 사용 -->
                                <div class="item">
                                    <label>조건검색</label>
                                    <span class="input">
                                        <span class="dv">
                                            <select class="custom-select sm" v-model="state.messageType">
                                                <option value="" selected>선택</option>
                                                <option value="msgCd">코드명</option>
                                                <option value="msgCts">한글명</option>
                                            </select>
                                        </span>
                                        <span class="dv">
                                            <input type="text" class="form-control sm" v-model="state.searchWord"
                                                :disabled="!state.messageType">
                                        </span>
                                    </span>
                                </div>
                                <!-- 기간조회가 있는 경우 컴포넌트 사용 -->
                                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker"
                                    :selectOptions="[{ label: '가입일시', value: '가입일시' }, { label: '수정일시', value: '수정일시' }]"
                                    :selectButtonOptions="state.selectButtonOptions" />
                                <div class="btn-filter-set">
                                    <button type="button" class="btn btn-sm" @click="'재조회 이벤트 처리'">
                                        <span class="ico-search"></span>조회
                                    </button>
                                    <button type="button" @click="'재조회 이벤트 처리'" class="btn btn-sm">
                                        <span class="ico-reload sg"></span>
                                        <span class="offscreen">리로드</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <TableFilterSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example13'">
                    <h2>{{ state.menulist[12].label }}</h2>
                    <div class="dec">글로벌로 작성되어 템플릿내에 컴포넌트 선언하지 않음</div>
                    <div class="dec">타이틀명 작성</div>
                    <div class="dec">디자인 확인</div>
                    <div class="dec_sample">
                        <subTitleBar :subTitle="'이력 정보'" />
                    </div>
                    <SubtitleSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example14'">
                    <h2>{{ state.menulist[13].label }}</h2>
                    <div class="dec">글로벌로 작성되어 템플릿내에 컴포넌트 선언하지 않음</div>
                    <div class="dec">공통기능외 필요 메서드는 www.ag-grid.com 참고하여 사용</div>
                    <div class="dec">예시)선택된 셀의 데이터 가져올때 .getFocusedCell() </div>
                    <div class="dec"> 데이터 없는 경우 사용 컴포넌트 &lt;NoData :nodatatext="'조회된 데이터가 없습니다.'" /&gt;</div>
                    <div class="dec"><button class="btn btn-ss" @click="goToPage('')">사용 샘플 보기</button> </div>
                    <AgGridSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example15'">
                    <h2>{{ state.menulist[14].label }}</h2>
                    <div class="dec">필터 컴포넌트(&lt;columlist&gt;)는 글로벌로 작성되어 템플릿내에 컴포넌트 선언하지 않음</div>
                    <div class="dec">기획서내에 공통기능 사항 작성되어 있지 않더라도 필수 적용 사항임</div>
                    <div class="dec">컬럼 원본 데이터는 lodash로 DeepClone하여 처리(하단 메서드 참고)</div>
                    <div class="dec"><button class="btn btn-ss" @click="goToPage('/messagelist')">사용 샘플 보기</button> </div>
                    <div class="dec">컬럼 필터 디자인 확인</div>
                    <div class="dec_sample">
                        <button type="button" class="btn btn-opt-ico filter" @click="resetTable">
                            <span class="offscreen">컬럼 셋팅</span>
                        </button>
                        <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit"><span class="offscreen">컬럼
                                리사이징</span></button>
                        <columlist :columlists="tablelist_payermanage_label" @checkColum="checkOptions" />
                    </div>
                    <AgGridColumnSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example16'">
                    <h2>{{ state.menulist[15].label }}</h2>
                    <div class="dec">컴포넌트(&lt;PageNavigation&gt;)는 글로벌로 작성되어 템플릿내에 컴포넌트 선언하지 않음</div>
                    <div class="dec">하단의 참조값, 메서드 공통 사용</div>
                    <div class="dec"><button class="btn btn-ss" @click="goToPage('/massagelist')">사용 샘플 보기</button> </div>
                    <div class="dec">디자인 확인</div>
                    <div class="dec_sample">
                        //셀렉트 박스 선택시 리스트 갯수에 따라 페이징 처리됨
                        <selectBox :selectType="'page'" @changedValue="selectedOptions" />
                        //리스트 하단 사용 컴포넌트
                        <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                            @changedPage="onChangedPage" />
                    </div>
                    <PagingSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example17'">
                    <h2>{{ state.menulist[16].label }}</h2>
                    <div class="dec">UI 작성 규칙은 퍼블리싱된 HTML기준으로 작성함</div>
                    <TableDetailSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example18'">
                    <h2>{{ state.menulist[17].label }}</h2>
                    <div class="dec">UI 작성 규칙은 퍼블리싱된 HTML기준으로 작성함</div>
                    <div class="dec">&lt;div class="reg-group"&gt;, &lt;div class="reg-item"&gt; 필수 사용</div>
                    <div class="dec">라디오 버튼, 체크 박스 하단 코드와 동일하게 사용 (id, for값 동일하게 작성)</div>
                    <div class="dec">디자인 확인</div>
                    <div class="dec_sample">
                        <input type="text" class="form-control">
                        <select class="custom-select" style="margin-top:10px;">
                            <option value="사용">사용 </option>
                            <option value="미사용">미사용 </option>
                        </select>
                        <span class=" checkbox" style="margin-left:10px">
                            <input id="columChk2" name="columChkGroup" type="checkbox" value="코드">
                            <label for="columChk2">코드</label>
                        </span>
                        <span class="radiobox" style="margin-left:10px">
                            <input id="columChk1" name="columChkGroup" type="radio" value="코드">
                            <label for="columChk1">코드</label>
                        </span>
                    </div>
                    <FormUiSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example19'">
                    <h2>{{ state.menulist[18].label }}</h2>
                    <div class="dec">UI 작성 규칙은 퍼블리싱된 HTML기준으로 작성함</div>

                    <div class="dec">디자인 확인</div>
                    <div class="dec_sample">
                        <button type="button" class="btn btn-ss">기본버튼</button>
                        <div class="radio-group btn-group">
                            <span class="radio">
                                <input id="dateType0" name="dategroup" type="radio" value="year" />
                                <label for="dateType0">1년</label>
                            </span>
                            <span class="radio">
                                <input id="dateType1" name="dategroup" type="radio" value="year" />
                                <label for="dateType1">6개월</label>
                            </span>
                        </div>
                    </div>
                    <ButtonSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example20'">
                    <h2>{{ state.menulist[19].label }}</h2>
                    <div class="dec">글로벌로 작성되어 따로 컴포넌트 선언하지 않음</div>
                    <div class="dec">페이징 처리만 공통으로 사용</div>
                </div>
                <div class="gap" v-if="state.currentmenu === 'example21'">
                    <h2>{{ state.menulist[20].label }}</h2>
                    <div class="dec">스토어 데이터 사용 규칙</div>
                </div>
                <div class="gap" v-if="state.currentmenu === 'example22'">
                    <h2>{{ state.menulist[21].label }}</h2>
                    <div class="dec">공통에디터 사용</div>
                    <div class="dec"><strong>class="editor_container" </strong>클래스 필수 사용</div>
                    <div class="dec">이미지 업로더 방식 공통으로 처리 예정(추후 업데이트)</div>
                    <EditSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example23'">
                    <h2>{{ state.menulist[22].label }}</h2>
                    <div class="dec">파일업로드 fileListUp()함수 사용 </div>
                    <div class="dec">formData를 배열로 만들어 사용</div>
                    <div class="dec">파일다운로드 fileDownload () 함수 사용</div>
                    <div class="dec">파일 업로드시 reponse 데이터 중 Fileid로 파일다운로드 </div>
                    <div class="dec">다운로드시 필요한 파일 정보는 response.headers에서 필요 정보 추출하여 사용</div>
                    <FileSample />
                </div>
                <div class="gap" v-if="state.currentmenu === 'example24'">
                    <h2>{{ state.menulist[23].label }}</h2>
                    <div class="dec">검색,등록, 수정 시 공통 코드로 사용하는 selectbox, radio만 공통 컴포넌트 사용</div>
                    <div class="dec">10/24 등록된 기준 (사업자유형,메일, 지역번호, 은행, 상품타입, 공지승인타입, 표시타입, 공지대상코드, 공지대상코드(시스템), 시스템 공지타입,
                        관리자파트너유형코드, 권한구분코드)<br> 추후 추가 변경 예정</div>
                    <div class="dec">공통 코드 파일 @/data/commcode/index.js</div>
                    <div class="dec">공통에서 작성된 코드 이외 작성시 index.js 추가 하여 사용</div>
                    <div class="dec">selectbox, radio만 공통 컴포넌트는 글로벌로 작성되어 따로 컴포넌트 선언하지 않음</div>
                    <div class="dec"><button class="btn btn-ss" @click="goToPage('/sellermanageregist')">사용 샘플 보기 (서비스타입 항목,
                            지역번호 항목 참고)</button>
                    </div>
                    <CommCodeSample />
                </div>
            </div>

        </div>
        <ConfirmModal />
    </div>
</template>
<script>
import { reactive, inject, ref, computed } from 'vue';
import MenuSample from './components/MenuSample.vue';
import RouterSample from './components/RouterSample.vue';
import RouterPopSample from './components/RouterPopSample.vue';
import MomentSample from './components/MomentSample.vue';
import LodashSample from './components/LodashSample.vue';
import ApiSample from './components/ApiSample.vue';
import ToastedSample from './components/ToastedSample.vue';
import ModalSample from './components/ModalSample.vue';
import ChartSample from './components/ChartSample.vue';
import EventBusSample from './components/EventBusSample.vue';
import SelectboxSample from './components/SelectboxSample.vue';
import SubtitleSample from './components/SubTitleSample.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import ModalContentSample from './components/ModalContentSample.vue';
import CommFuncSample from './components/CommFuncSample.vue';
import CommModalSample from './components/CommModalSample.vue';
import TableFilterSample from './components/TableFilterSample.vue';
import AgGridSample from './components/AgGridSample.vue';
import AgGridColumnSample from './components/AgGridColumnSample.vue';
import PagingSample from './components/PagingSample.vue';
import ButtonSample from './components/ButtonSample.vue';
import TableDetailSample from './components/TableDetailSample.vue';
import EditSample from './components/EditSample.vue';
import CommCodeSample from './components/CommCodeSample.vue';
import FileSample from './components/FileSample.vue';
import FormUiSample from './components/FormUiSample.vue';
import ConfirmModal from '@/plugins/modal/modal/ConfirmModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { tablelist_payermanage_const, tablelist_payermanage_label } from '@/data/table.js';
export default {
    components: {
        DefaultModal,
        ConfirmModal,
        DateSerch,
        ModalContentSample,
        MenuSample,
        RouterSample,
        RouterPopSample,
        MomentSample,
        LodashSample,
        ApiSample,
        ToastedSample,
        ModalSample,
        ChartSample,
        EventBusSample,
        SelectboxSample,
        SubtitleSample,
        CommFuncSample,
        CommModalSample,
        TableFilterSample,
        AgGridSample,
        AgGridColumnSample,
        PagingSample,
        TableDetailSample,
        FormUiSample,
        ButtonSample,
        EditSample,
        FileSample,
        CommCodeSample

    },
    setup() {
        const $Modal = inject('$Modal');
        const {
            //공통팝업 함수 
            openModal,
            //공통팝업 사용 데이터 
            isPartnerShow,
            isDownShow,
            isImgShow,
            isRequestShow,
            goToPage
        } = useCommFunc();
        const state = reactive({
            menulist: [
                { label: '메뉴구조', value: 'example0' },
                { label: '페이지생성', value: 'example1' },
                // { label: '페이지생성_팝업', value: 'example2' },
                { label: '이벤트버스사용', value: 'example3' },
                { label: 'API예제', value: 'example4' },
                { label: 'Day.js', value: 'example5' },
                { label: 'lodash', value: 'example6' },
                { label: '토스트팝업', value: 'example7' },
                { label: '공통 모달', value: 'example8' },
                { label: '모달 - 페이지내에 개별 사용', value: 'example9' },
                { label: '공통함수', value: 'example10' },
                { label: '공통함수사용 - 모달팝업', value: 'example11' },
                { label: '리스트 테이블 검색 필터', value: 'example12' },
                { label: '페이지 서브 타이틀', value: 'example13' },
                { label: 'Aggrid 기본 사용', value: 'example14' },
                { label: '리스트 테이블 컬럼 필터, 리사이징(필수사용)', value: 'example15' },
                { label: '페이징처리(셀렉트 박스 포함)', value: 'example16' },
                { label: '상세테이블 UI 작성', value: 'example17' },
                { label: '폼 UI 작성', value: 'example18' },
                { label: '버튼 UI 작성', value: 'example19' },
                { label: '셀렉트 박스 공통(업데이트 예정)', value: 'example20' },
                { label: '스토어사용(업데이트 예정)', value: 'example21' },
                { label: '에디터사용', value: 'example22' },
                { label: '파일업로드', value: 'example23' },
                { label: '공통코드항목', value: 'example24' }


            ],
            currentmenu: 'example0',
            // 사유등록 내용
            download: { pass: '', reason: '' },
            partnerName: '',
            request: { title: '', con: '' },
            imgName: '',
            selectButtonOptions: [
                { label: '1년', value: 'year' },
                { label: '6개월', value: '6month' },
                { label: '1개월', value: '1month' },
                { label: '일주일', value: 'week' },
                { label: '당일', value: 'today' }
            ],
            searchWord: '',
            messageType: '',
            //테이블데이터
            rowData: tablelist_payermanage_const, // 실제 데이터
            tableColum_c: _.clone(tablelist_payermanage_label), //컬럼명 처리
            //테이블 옵션
            defaultColDef: {
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1
            },
            domLayout: 'autoHeight',
            filterCoulm: [],
            //테이블 초기 셋팅을 위한 참조값
            gridApi: null,
            gridColumApi: null,
            pagesize: 10
        });
        const isShow = ref(false);
        const openModal_sample = () => {
            isShow.value = true;
        };
        const modalclose_sample = (type, modalName) => {
            console.log(modalName);
            isShow.value = false;
        };
        const onChangeExample = (params) => {
            state.currentmenu = params;
        };
        const modal = (type) => {
            if (type === 'simple') {
                $Modal.simple({
                    title: 'default modal title',
                    message: 'This is a simple modal.',
                    buttonText: {
                        ok: '확인'
                    }
                })
                    .then(success => {
                        console.log(success);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else if (type === 'alert') {
                $Modal.alert({
                    title: 'alertt modal title',
                    message: 'alert modal.',
                    closeButtonHide: true
                });
            } else if (type === 'confirm') {
                $Modal.confirm({
                    title: 'confirm modal title',
                    message: 'This is a confirm modal.',

                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(success => {
                        console.log(success);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };
        //파트너 선택
        const selectPartner = (data) => {
            state.partnerName = data;
            console.log(data);
        };
        // 재가입요청 데이터 처리
        const requestConfirm = (type, con) => {
            if (type === 'title') {
                state.request.title = con;
            } else {
                state.request.con = con;
            }
            console.log(state.request);
        };
        //사업자등록증 사본
        const imgfile = (fileName) => {
            state.imgName = fileName;
            console.log(state.imgName);
        };
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (modalName === 'isImgShow') {
                isImgShow.value = false;
            } else if (modalName === 'isRequestShow') {
                isRequestShow.value = false;
            } else if (modalName === 'isPartnerShow') {
                isPartnerShow.value = false;

            } else if (modalName === 'isDownShow') {
                isDownShow.value = false;

            } else if (!modalName) {
                isImgShow.value = false;
                isRequestShow.value = false;
                isPartnerShow.value = false;
                isDownShow.value = false;
            }
            console.log(type, modalName);
        };
        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value) => {
            if (type === 'day') {
                state.startday = value[0];
                state.endday = value[1];
            }
            console.log(state.startday, state.endday, type, value);
            //api호출
        };
        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };
        // 컬럼 변경
        const resetTable = () => {
            const initColum = _.clone(tablelist_payermanage_label);
            state.tableColum_c = initColum.filter(item => !state.filterCoulm.includes(item.headerName));
            console.log('원본컬럼:' + tablelist_payermanage_label.length, '수정된 컬럼:' + state.tableColum_c.length);
            return state.filterCoulm;
        };
        // 테이블 리사이징을 위한 참조값 설정
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
            // console.log(params.columnApi);
        };
        // 테이블 현재창에 맞춤
        const sizeToFit = () => {
            console.log('sizeColumnsToFit() 메서드 사용');
            //state.gridApi.sizeColumnsToFit();
        };
        // 테이블 컬럼 초기값 설정 ==> 지정한 대로 나오도록 
        const onFirstDataRendered = () => {
            console.log(state.gridColumApi.getColumns);
            const allColumsIds = [];
            state.gridColumApi.getColumns().forEach((column) => {
                allColumsIds.push(column.getId());
            });
            state.gridColumApi.autoSizeColumns(allColumsIds);
        };

        // 페이징 처리
        const pager = reactive({
            current: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 100
        });
        const onChangedPage = (num) => {
            console.log(num);
            pager.current = num;
            //api호출
        };
        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
            if (type === 'page') {
                state.pagesize = value;
                //api호출
            }

        };

        return {
            state,
            openModal,
            isPartnerShow,
            isDownShow,
            isImgShow,
            isRequestShow,
            goToPage,
            pager,
            $Modal,
            isShow,
            tablelist_payermanage_const,
            tablelist_payermanage_label,
            modal,
            onChangeExample,
            openModal_sample,
            modalclose_sample,
            modalControl,
            selectPartner,
            requestConfirm,
            imgfile,
            onSelectPicker,
            checkOptions,
            resetTable,
            onGridReady,
            sizeToFit,
            onFirstDataRendered,
            selectedOptions
        };
    }
};
</script>

<style>
.example_header {
    background: #253349;
    height: 60px;
}

.example_header>h1 {
    max-width: 1200px;
    margin: 0px auto;
    padding-left: 20px;
    display: flex;
    align-items: center;
    position: relative;
    line-height: 60px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    text-align: left;
}

.example {
    max-width: 1200px;
    margin: 0px auto 30px;
    display: flex;
    height: calc(100% - 60px);

}

.dec_sample {
    padding: 10px;
}

.dec_sample>.btn {
    display: inline-block;
}

.dec_sample>.btn+.btn {

    margin-left: 10px;
}

.example_menu {
    width: 200px;
    border-right: 1px solid #ebebeb;
    border-left: 1px solid #ebebeb;
    padding-top: 0px;
    flex-shrink: 0;
}

.example_menu>ul>li {
    padding: 9px 5px 9px 20px;
    border-bottom: 1px solid #ebebeb;
    cursor: pointer;

}

.example_menu>ul>li.active {
    background: #f7f7f7
}

.example_con {
    padding: 20px 0 0 40px;
    flex: 1 1 auto
}

.example .gap {
    overflow: hidden;
    width: 100%;
}

.example .gap>h2 {
    margin: 0 0 15px;
    font-size: 18px;
    font-weight: bold;
}

.example .gap .sample {
    margin: 15px 0 25px;
}

.example .guides .sample {
    margin: 0x 0 15px;
    background: #282c34;
    border-radius: 6px;
    padding: 10px 20px 0
}

.example .guides .sample pre code {
    color: #d19a66;
    font-family: Consolas, monospace !important;
}

.example .dec {
    color: #6bacce
}

.example .dec strong {
    font-weight: 700;
    color: #ff3232
}

.example .container {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 600px;
    box-sizing: border-box;
}

.example .container .sLeft {
    width: 0;
}

.example .container .sRight {
    width: 100%;
    height: 100%;
}

.list-move {
    transition: transform 0.5s;
}
</style>