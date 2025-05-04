import { Ckeditor } from '@ckeditor/ckeditor5-vue';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('ckeditor', Ckeditor);
    console.log('CKEditor component registered client-side.');
});
