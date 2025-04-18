import { createApp, provide, h } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import VueUniversalModal from 'vue-universal-modal';
/** toasted, modal datepicker */
import '@/plugins/lodash';
import '@/plugins/toasted';
import $Modal from '@/plugins/modal';
import i18n from '@/plugins/i18n';
import VueDatePicker from '@vuepic/vue-datepicker';
import 'vue3-toastify/dist/index.css';
// 테이블
import { AgGridVue } from 'ag-grid-vue3';
import PageNavigation from '@/components/ui/PageNavigation.vue';
import Draggable from 'vue3-draggable';
// uicomponents
import subTitleBar from '@/components/ui/TitleBar.vue';
import selectBox from '@/components/ui/SelectBox.vue';
import commselect from '@/components/ui/CommSelect.vue';
import commradio from '@/components/ui/CommRadio.vue';
import columlist from '@/components/ui/ColumFilter.vue';
import tableBtn from '@/components/ui/TableBtn.vue';
import DownModalCon from '@/components/ui/DownModalCon.vue';
import PartnerSerch from '@/components/ui/PartnerSerch.vue';
import RequestRegist from '@/components/ui/RequestRegist.vue';
import NoData from '@/components/ui/NoData.vue';
import isFileDownShow from '@/plugins/modal/modal/DownModal.vue';
import isImgDownShow from '@/plugins/modal/modal/DownImgModal.vue';
import SearchBtns from '@/components/ui/SearchBtns.vue';
import ToolTip from '@/components/ui/ToolTip.vue';

/** chart */
import { Chart as ChartJS } from 'chart.js/auto';
import { Bubble, Bar, Line } from 'vue-chartjs';

/** @moment */
import dayjs from 'dayjs';
/** @emitter */
import eventBus from '@/core/eventBus';
window.emitter = eventBus;

/** @request */
import request from '@/core/request';
window.$api = request;

const app = createApp(App);
app.use(dayjs);
app.use(router);
app.use(ChartJS);
app.use(i18n);
app.use(store);
app.use(Draggable);
app.use(VueUniversalModal, { teleportTarget: '#modals' });
app.provide('$Modal', $Modal);
app.provide('dayJS', dayjs);
app.component('DatePicker', VueDatePicker);
app.component('tableBtn', tableBtn);
app.component('AgGridVue', AgGridVue);
app.component('subTitleBar', subTitleBar);
app.component('PageNavigation', PageNavigation);
app.component('selectBox', selectBox);
app.component('commselect', commselect);
app.component('commradio', commradio);
app.component('columlist', columlist);
app.component('DownModalCon', DownModalCon);
app.component('PartnerSerch', PartnerSerch);
app.component('RequestRegist', RequestRegist);
app.component('draggable', Draggable);
app.component('NoData', NoData);
app.component('isFileDownShow', isFileDownShow);
app.component('isImgDownShow', isImgDownShow);
app.component('SearchBtns', SearchBtns);
app.component('ToolTip', ToolTip);
app.mount('#app');

