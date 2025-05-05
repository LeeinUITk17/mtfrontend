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
            <ClientOnlyTinyMCE
                v-model="formData.content"
                :upload-url="`${config.public.apiBase}/upload/image`"
                :api-key="config.public.tinymceApiKey"
                @editor-ready="handleTinyMCEInitialized"
                @load-error="handleTinyMCELoadError"
            />
        </div>

        <div class="flex justify-end">
            <button
                type="submit"
                :disabled="loading || !isTinyMCEInitialized"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {{ loading ? 'Đang xử lý...' : (initialData ? 'Cập nhật bài viết' : 'Đăng bài viết') }}
                <svg v-if="loading" class="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useAuth } from '~/composables/useAuth';
import ClientOnlyTinyMCE from '~/components/common/ClientOnlyTinyMCE.vue';

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
const isTinyMCEInitialized = ref(false);

const { user: loggedInUser } = useAuth();

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

const handleTinyMCEInitialized = () => {
    isTinyMCEInitialized.value = true;
};

const handleTinyMCELoadError = (error) => {
    isTinyMCEInitialized.value = false;
    message.value = 'Lỗi tải trình soạn thảo.';
    messageType.value = 'error';
    console.error('Error loading TinyMCE in PostForm:', error);
};

const handleSubmit = async () => {
    if (!isTinyMCEInitialized.value) {
        message.value = 'Trình soạn thảo chưa sẵn sàng.';
        messageType.value = 'error';
        return;
    }

    loading.value = true;
    message.value = null;
    messageType.value = 'error';

    if (!formData.title || !formData.content || formData.content.trim() === '' || formData.content === '<p></p>') {
        message.value = 'Tiêu đề và nội dung bài viết không được trống.';
        messageType.value = 'error';
        loading.value = false;
        return;
    }

    const userIdForCreation = loggedInUser.value?.id;

    if (!props.initialData && !userIdForCreation) {
        message.value = 'Không thể xác định người dùng đăng bài.';
        messageType.value = 'error';
        loading.value = false;
        return;
    }

    try {
        let result;
        const postData = {
            title: formData.title,
            content: formData.content,
            ...(props.initialData ? {} : { userId: userIdForCreation }),
        };

        if (props.initialData?.id) {
            result = await $fetch(`${config.public.apiBase}/posts/${props.initialData.id}`, {
                method: 'PATCH',
                body: postData,
            });
            message.value = 'Bài viết đã cập nhật thành công!';
            messageType.value = 'success';
        } else {
            result = await $fetch(`${config.public.apiBase}/posts`, {
                method: 'POST',
                body: postData,
            });
            message.value = 'Bài viết đã đăng thành công!';
            messageType.value = 'success';
            formData.title = '';
            formData.content = '';
        }

        if (messageType.value === 'success') {
            setTimeout(() => {
                navigateTo('/admin/posts');
            }, 1500);
        }
    } catch (error) {
        console.error('API submission error:', error);
        message.value = error.data?.message || error.message || 'Đã xảy ra lỗi khi gửi bài viết.';
        messageType.value = 'error';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
</style>
