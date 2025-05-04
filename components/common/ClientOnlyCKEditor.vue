<template>
    <div v-if="!isEditorReady" class="text-center py-8 border border-gray-300 rounded-md shadow-sm">
        <LoadingSpinner class="w-6 h-6 text-gray-400 mx-auto" />
        <p class="mt-2 text-sm text-gray-600">Đang tải trình soạn thảo...</p>
    </div>

    <ckeditor
        v-if="isEditorReady"
        :editor="editorBuild"
        v-model="content"
        :config="editorConfig"
        @ready="handleEditorReady"
    ></ckeditor>
</template>

<script setup>
import { ref, shallowRef, onMounted, watch, reactive } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
    uploadUrl: { type: String, required: true },
});
const emit = defineEmits(['update:modelValue', 'editor-ready']);

const content = ref(props.modelValue);
const editorBuild = shallowRef(null);
const isEditorReady = ref(false);

const editorConfig = reactive({
    placeholder: 'Bắt đầu viết bài của bạn ở đây...',
    toolbar: {
        items: [
            'heading', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'bulletedList', 'numberedList', '|',
            'link', 'blockQuote', '|',
            'imageUpload',
            'mediaEmbed',
            'undo', 'redo'
        ]
    },
    image: {
        toolbar: ['imageTextAlternative', '|', 'imageStyle:full', 'imageStyle:side'],
        styles: ['full', 'side']
    },
    mediaEmbed: {
        toolbar: ['mediaEmbed']
    },
    extraPlugins: [],
});

onMounted(async () => {
    if (process.client) {
        try {
            const ClassicEditorBuildModule = await import('@ckeditor/ckeditor5-build-classic');
            const { MyCustomUploadAdapterPlugin: UploadAdapterPlugin } = await import('~/utils/MyUploadAdapter');

            editorBuild.value = ClassicEditorBuildModule.default;
            editorConfig.extraPlugins.push(editor => UploadAdapterPlugin(editor, props.uploadUrl));

            isEditorReady.value = true;
        } catch (error) {
            console.error('Failed to load CKEditor build or adapter:', error);
            isEditorReady.value = false;
        }
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

const handleEditorReady = (editor) => {
    emit('editor-ready', editor);
};
</script>

<style scoped>
:deep(.ck-editor__editable) {
    min-height: 300px;
    border-color: #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    padding: 0.75rem 1rem;
    background-color: white;
}

:deep(.ck-toolbar) {
    border-color: #d1d5db;
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    background-color: #f9fafb;
    padding: 0.5rem 0.75rem;
}

:deep(.ck.ck-editor__main .ck-editor__editable.ck-focused),
:deep(.ck.ck-editor__main .ck-toolbar.ck-focused) {
    border-color: var(--tw-ring-color);
    box-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    --tw-ring-color: rgba(59, 130, 246, 0.5);
    --tw-ring-offset-width: 2px;
    --tw-ring-offset-color: #fff;
    z-index: 1;
}

:deep(.ck-content img) {
    max-width: 100%;
    height: auto;
}
</style>
