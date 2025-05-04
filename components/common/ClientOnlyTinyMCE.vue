<template>
    <div>
        <div v-if="!isClientReady || loadingError" class="text-center py-8 border border-gray-300 rounded-md shadow-sm min-h-[300px] flex flex-col justify-center items-center">
            <div v-if="!loadingError">
                <LoadingSpinner class="w-6 h-6 text-gray-400 mx-auto" />
                <p class="mt-2 text-sm text-gray-600">Đang tải trình soạn thảo...</p>
            </div>
            <div v-else class="text-red-600">
                <p>Lỗi tải TinyMCE.</p>
                <p class="text-xs mt-1">{{ loadingError }}</p>
            </div>
        </div>

        <Editor
            v-if="isClientReady"
            :api-key="apiKey"
            :init="editorConfig"
            v-model="content"
            @onInit="handleEditorInit"
            @onBlur="handleBlur"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
    uploadUrl: { type: String, required: true },
    apiKey: { type: String, required: true }
});
const emit = defineEmits(['update:modelValue', 'editor-ready', 'load-error']);

const content = ref(props.modelValue);
const isClientReady = ref(false);
const editorInstance = ref(null);
const loadingError = ref(null);

const editorConfig = computed(() => ({
    plugins: 'preview powerpaste casechange importcss searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker help formatpainter permanentpen pageembed linkchecker emoticons export',
    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen preview save print | insertfile image media pageembed link anchor codesample | a11ycheck ltr rtl | showcomments addcomment | code',
    toolbar_sticky: true,
    autosave_ask_before_unload: true,
    autosave_interval: '30s',
    autosave_prefix: '{path}{query}-{id}-',
    autosave_restore_when_empty: false,
    autosave_retention: '2m',
    image_advtab: true,
    images_upload_url: props.uploadUrl,
    images_upload_handler: imageUploadHandler,
    automatic_uploads: true,
    file_picker_types: 'image media',
    height: 400,
    menubar: 'file edit view insert format tools table help',
    placeholder: 'Bắt đầu viết bài của bạn ở đây...',
    skin: 'oxide',
    content_css: 'default',
    setup: (editor) => {
        editorInstance.value = editor;
    },
    init_instance_callback: (editor) => {
        console.log('TinyMCE Initialized:', editor);
    }
}));

const imageUploadHandler = (blobInfo, progress) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', props.uploadUrl);

    xhr.upload.onprogress = (e) => {
        progress(e.loaded / e.total * 100);
    };

    xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
            let errorMsg = `HTTP Error: ${xhr.status}`;
            try {
                const jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse?.error?.message) {
                    errorMsg = jsonResponse.error.message;
                } else if (xhr.responseText) {
                    errorMsg = xhr.responseText.substring(0, 100);
                }
            } catch (e) {}
            reject(errorMsg);
            return;
        }

        const json = JSON.parse(xhr.responseText);
        if (!json || typeof json.location != 'string') {
            reject('Invalid JSON response from server: Missing "location" property.');
            return;
        }

        resolve(json.location);
    };

    xhr.onerror = () => {
        reject(`Image upload failed due to a network error or server issue. Code: ${xhr.status}`);
    };

    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());
    xhr.send(formData);
});

onMounted(() => {
    if (process.client) {
        isClientReady.value = true;
    }
});

watch(() => props.modelValue, (newValue) => {
    if (content.value !== newValue) {
        content.value = newValue;
    }
});

watch(content, (newValue) => {
    if (props.modelValue !== newValue) {
        emit('update:modelValue', newValue);
    }
});

const handleEditorInit = (event, editor) => {
    editorInstance.value = editor;
    emit('editor-ready', editor);
};

const handleBlur = (event, editor) => {
    emit('update:modelValue', editor.getContent());
};
</script>

<style>
.tox-tinymce {
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.tox .tox-statusbar {
    border-top: 1px solid #d1d5db !important;
}
.min-h-\[300px\] {
    min-height: 300px;
}
</style>
