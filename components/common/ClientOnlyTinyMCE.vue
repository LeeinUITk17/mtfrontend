<template>
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
    <editor
        v-else
        :api-key="apiKey"
        :init="editorConfig"
        v-model="content"
        @onInit="handleEditorInit"
        @onBlur="handleBlur"
    />
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
    uploadUrl: { type: String, required: true },
    apiKey: { type: String, required: true },
});
const emit = defineEmits(['update:modelValue', 'editor-ready', 'load-error']);

const content = ref(props.modelValue);
const isClientReady = ref(false);
const editorInstance = ref(null);
const loadingError = ref(null);

const editorConfig = computed(() => ({
    selector: 'textarea',
    height: 400,
    plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
    toolbar: 'undo redo | styleselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | preview fullscreen | forecolor backcolor | code help',
    toolbar_sticky: true,
    automatic_uploads: true,
    images_upload_handler: imageUploadHandler,
    file_picker_types: 'image media',
    setup: (editor) => {
        editorInstance.value = editor;
    },
    init_instance_callback: (editor) => {},
    menubar: 'file edit view insert format tools table help',
    placeholder: 'Bắt đầu viết bài của bạn ở đây...',
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
                    errorMsg = xhr.responseText.substring(0, 100) + '...';
                }
            } catch (e) {}
            reject(errorMsg);
            return;
        }
        try {
            const json = JSON.parse(xhr.responseText);
            if (!json || typeof json.location !== 'string') {
                reject('Upload failed: Invalid response format from server. Expected { location: "..." }.');
                return;
            }
            resolve(json.location);
        } catch (e) {
            reject('Upload failed: Invalid JSON response from server.');
        }
    };
    xhr.onerror = () => {
        reject(`Image upload failed due to a network error or server issue. Status: ${xhr.status}`);
    };
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());
    xhr.send(formData);
});

watch(() => props.modelValue, (newValue) => {
    if (content.value !== newValue) {
        content.value = newValue;
        if (editorInstance.value && editorInstance.value.getContent() !== newValue) {
            editorInstance.value.setContent(newValue || '');
        }
    }
});

watch(content, (newValue) => {
    const normalizedContent = newValue === '<p></p>' ? '' : newValue;
    if (props.modelValue !== normalizedContent) {
        emit('update:modelValue', normalizedContent);
    }
});

onMounted(() => {
    if (process.client) {
        isClientReady.value = true;
        loadingError.value = null;
    } else {
        loadingError.value = 'TinyMCE cannot load on server.';
    }
});

const handleEditorInit = (event, editor) => {
    editorInstance.value = editor;
    if (props.modelValue && editor.getContent() !== props.modelValue) {
        editor.setContent(props.modelValue);
    }
    emit('editor-ready', editor);
};

const handleBlur = (event, editor) => {
    const currentContent = editor.getContent();
    const normalizedContent = currentContent === '<p></p>' ? '' : currentContent;
    if (props.modelValue !== normalizedContent) {
        emit('update:modelValue', normalizedContent);
    }
};
</script>

<style scoped>
</style>
