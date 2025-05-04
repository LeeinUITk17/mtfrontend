<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
            <label for="post-title" class="block text-sm font-medium text-gray-700">Tiêu đề</label>
            <input
                type="text"
                id="post-title"
                v-model="formData.title"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm"
            />
        </div>

        <div>
            <label for="post-content" class="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <TinyMCELoader
                v-if="canLoadEditor"
                v-model="formData.content"
                :upload-url="`${config.public.apiBase}/upload/image`"
                :api-key="config.public.tinymceApiKey"
                @editor-ready="handleEditorReady"
                @load-error="handleEditorLoadError"
            />
            <div v-else class="text-center py-8 border border-gray-300 rounded-md shadow-sm text-sm text-gray-600">
                Đang chuẩn bị trình soạn thảo...
            </div>
        </div>

        <div
            v-if="message"
            class="mt-4 rounded-md p-3 text-sm font-medium"
            :class="messageType === 'error' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'"
        >
            {{ message }}
        </div>

        <div class="flex justify-end">
            <button
                type="submit"
                :disabled="loading || !isEditorReady"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {{ loading ? 'Đang xử lý...' : (initialData ? 'Cập nhật bài viết' : 'Đăng bài viết') }}
                <svg
                    v-if="loading"
                    class="animate-spin ml-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, reactive, watch, defineAsyncComponent, onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';

const { user: loggedInUser } = useAuth();
const config = useRuntimeConfig();

const props = defineProps({
    initialData: {
        type: Object,
        default: null,
    },
});

const formData = reactive({
    title: '',
    content: '',
});

const loading = ref(false);
const message = ref(null);
const messageType = ref('error');
const isEditorReady = ref(false);
const canLoadEditor = ref(false);

const TinyMCELoader = defineAsyncComponent({
    loader: () => import('~/components/common/ClientOnlyTinyMCE.vue'),
});

onMounted(() => {
    canLoadEditor.value = true;
});

const handleEditorReady = () => {
    isEditorReady.value = true;
};

const handleEditorLoadError = (error) => {
    isEditorReady.value = false;
    message.value = 'Lỗi tải trình soạn thảo.';
    messageType.value = 'error';
    console.error('Error loading TinyMCE editor:', error);
};

watch(
    () => props.initialData,
    (newData) => {
        if (newData) {
            formData.title = newData.title || '';
            formData.content = newData.content || '';
        }
    },
    { immediate: true }
);

const handleSubmit = async () => {
    if (
        !formData.title ||
        !formData.content ||
        formData.content.trim() === '' ||
        formData.content.trim() === '<p> </p>' ||
        formData.content.trim() === '<p><br data-mce-bogus="1"></p>'
    ) {
        message.value = 'Tiêu đề và nội dung bài viết không được trống.';
        messageType.value = 'error';
        return;
    }

    loading.value = true;
    message.value = null;
    messageType.value = 'error';

    try {
        // Submit logic here
    } catch (error) {
        message.value = 'Đã xảy ra lỗi khi gửi bài viết.';
        messageType.value = 'error';
    } finally {
        loading.value = false;
    }
};
</script>
