import Editor from '@tinymce/tinymce-vue';

export default defineNuxtPlugin((nuxtApp) => {
    try {
        nuxtApp.vueApp.use({
            install(app) {
                app.component('Editor', Editor);
            }
        });
        console.log('TinyMCE Vue plugin registered client-side successfully.');
    } catch (e) {
        console.error('Error registering TinyMCE Vue plugin:', e);
    }
});
