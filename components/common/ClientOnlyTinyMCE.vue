<template>
    <div v-if="!isClientReady || loadingError" class="text-center py-8 border border-gray-300 rounded-md shadow-sm min-h-[300px] flex flex-col justify-center items-center">
        <div v-if="!loadingError">
            <LoadingSpinner class="w-6 h-6 text-gray-400 mx-auto" />
            <p class="mt-2 text-sm text-gray-600">Đang tải trình soạn thảo...</p>
        </div>
        <div v-else class="text-red-600">
            <p>Lỗi tải TinyMCE.</p>
            <p class="text-xs mt-1">{{ loadingError }}</p>
            <button @click="retryLoading" class="mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm">
                Thử lại
            </button>
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
import { ref, computed } from 'vue';
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
    plugins: [
        'advlist autolink lists link image charmap preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table help wordcount'
    ].join(' '),
    toolbar: [
        'undo redo | styleselect | bold italic underline strikethrough',
        'alignleft aligncenter alignright alignjustify',
        'bullist numlist outdent indent | link image media',
        'preview fullscreen | forecolor backcolor | code help'
    ].join(' | '),
    toolbar_sticky: true,
    automatic_uploads: true,
    images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', props.uploadUrl);
        
        xhr.upload.onprogress = (e) => {
            progress(e.loaded / e.total * 100);
        };
        
        xhr.onload = () => {
            if (xhr.status < 200 || xhr.status >= 300) {
                reject(`HTTP Error: ${xhr.status}`);
                return;
            }
            
            const json = JSON.parse(xhr.responseText);
            if (!json?.location) {
                reject('Invalid response format');
                return;
            }
            resolve(json.location);
        };
        
        xhr.onerror = () => {
            reject(`Upload error: ${xhr.status}`);
        };
        
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        xhr.send(formData);
    }),
    file_picker_types: 'image media',
    setup: (editor) => {
        editorInstance.value = editor;
        editor.on('init', () => {
            if (props.modelValue) {
                editor.setContent(props.modelValue);
            }
            emit('editor-ready', editor);
        });
    },
    menubar: 'file edit view insert format tools table help',
    placeholder: 'Bắt đầu viết bài của bạn ở đây...',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    branding: false,
    statusbar: false
}));

const imageUploadHandler = (blobInfo, progress) => new Promise((resolve, reject) => {
    console.log('Uploading image:', blobInfo.filename());
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', props.uploadUrl);
    
    xhr.upload.onprogress = (e) => {
        progress(e.loaded / e.total * 100);
    };
    
    xhr.onload = () => {
        console.log('Upload response:', xhr.status, xhr.responseText);
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
            console.error('Upload failed:', errorMsg);
            reject(errorMsg);
            return;
        }
        
        try {
            const json = JSON.parse(xhr.responseText);
            if (!json || typeof json.location !== 'string') {
                const errorMsg = 'Upload failed: Invalid response format from server. Expected { location: "..." }.';
                console.error(errorMsg, json);
                reject(errorMsg);
                return;
            }
            console.log('Upload successful:', json.location);
            resolve(json.location);
        } catch (e) {
            const errorMsg = 'Upload failed: Invalid JSON response from server.';
            console.error(errorMsg, e, xhr.responseText);
            reject(errorMsg);
        }
    };
    
    xhr.onerror = () => {
        const errorMsg = `Image upload failed due to a network error or server issue. Status: ${xhr.status}`;
        console.error(errorMsg);
        reject(errorMsg);
    };
    
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());
    xhr.send(formData);
});

const retryLoading = () => {
    loadingError.value = null;
    isClientReady.value = false;
    setTimeout(() => {
        isClientReady.value = true;
    }, 100);
};

watch(() => props.modelValue, (newValue) => {
    console.log('Model value changed:', newValue);
    if (content.value !== newValue) {
        content.value = newValue;
        if (editorInstance.value && editorInstance.value.getContent() !== newValue) {
            editorInstance.value.setContent(newValue || '');
        }
    }
});

watch(content, (newValue) => {
    console.log('Editor content changed:', newValue);
    const normalizedContent = newValue === '<p></p>' ? '' : newValue;
    if (props.modelValue !== normalizedContent) {
        emit('update:modelValue', normalizedContent);
    }
});

onMounted(() => {
    if (process.client) {
        console.log('Mounting TinyMCE editor on client');
        isClientReady.value = true;
        loadingError.value = null;
    } else {
        loadingError.value = 'TinyMCE cannot load on server.';
    }
});

const handleEditorInit = (event, editor) => {
    console.log('Editor initialized:', editor);
    editorInstance.value = editor;
    if (props.modelValue && editor.getContent() !== props.modelValue) {
        editor.setContent(props.modelValue);
    }
    emit('editor-ready', editor);
};

const handleBlur = (event, editor) => {
    const currentContent = editor.getContent();
    console.log('Editor blur event with content:', currentContent);
    const normalizedContent = currentContent === '<p></p>' ? '' : currentContent;
    if (props.modelValue !== normalizedContent) {
        emit('update:modelValue', normalizedContent);
    }
};
</script>

