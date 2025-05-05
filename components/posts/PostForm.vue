<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <Transition name="fade">
            <div
                v-if="message"
                :class="[messageContainerClasses]"
                class="rounded-lg p-4 mb-6 transition-all duration-300 ease-in-out"
            >
                {{ message }}
            </div>
        </Transition>

        <div class="space-y-6 rounded-xl">
            <div class="space-y-1">
                <label for="post-title" class="block text-sm font-medium text-gray-700">
                    Tiêu đề <span class="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="post-title"
                    v-model="formData.title"
                    required
                    class="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:ring-opacity-50 transition duration-200 sm:text-sm"
                    placeholder="Nhập tiêu đề bài viết"
                />
            </div>

            <div class="space-y-1">
                <label for="post-content" class="block text-sm font-medium text-gray-700">
                    Nội dung <span class="text-red-500">*</span>
                </label>
                <div class="mt-1 rounded-lg border border-gray-300 overflow-hidden transition duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <ClientOnly>
                        <ClientOnlyTinyMCE
                            v-model="formData.content"
                            :upload-url="`${config.public.apiBase}/upload/image`"
                            :api-key="config.public.tinymceApiKey"
                            @editor-ready="handleTinyMCEInitialized"
                            @load-error="handleTinyMCELoadError"
                            @editor-content-update="handleEditorContentUpdate"
                        />
                        <template #fallback>
                            <div class="h-[300px] flex items-center justify-center text-gray-500">
                                Đang tải trình soạn thảo...
                            </div>
                        </template>
                    </ClientOnly>
                </div>
            </div>

            <div class="space-y-1">
                <label for="post-rating" class="block text-sm font-medium text-gray-700">
                    Đánh giá (Mức độ quan trọng/ưu tiên)
                </label>
                <select
                    id="post-rating"
                    v-model="formData.rating"
                    class="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:ring-opacity-50 transition duration-200 sm:text-sm bg-white"
                >
                    <option v-for="level in rateLevels" :key="level" :value="level">
                        {{ formatRateLevel(level) }}
                    </option>
                </select>
            </div>

            <div class="space-y-1" v-if="!isEditMode">
                <label class="block text-sm font-medium text-gray-700">
                    Hình ảnh bài viết (Tùy chọn)
                </label>
                <PostImageUploader
                    :multiple="true"
                    inputName="images"
                    v-model="selectedImageFiles"
                    :maxFileSizeMB="5"
                />
                <p class="mt-1 text-xs text-gray-500">Chọn một hoặc nhiều ảnh cho bài viết.</p>
            </div>

            <div class="flex justify-end pt-2 space-x-3">
                <NuxtLink
                    v-if="isEditMode"
                    to="/admin/posts"
                    class="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    Hủy bỏ
                </NuxtLink>
                <button
                    type="submit"
                    :disabled="loading"
                    class="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 ease-in-out transform hover:-translate-y-0.5"
                >
                    <span>{{ buttonText }}</span>
                    <svg
                        v-if="loading"
                        class="animate-spin ml-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        />
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </form>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuth } from '~/composables/useAuth';
import ClientOnlyTinyMCE from '~/components/common/ClientOnlyTinyMCE.vue';
import PostImageUploader from '~/components/posts/PostImageUploader.vue';

const props = defineProps({
    initialData: { type: Object, default: null },
    isEditMode: { type: Boolean, default: false },
});

const config = useRuntimeConfig();
const { user: loggedInUser } = useAuth();
const router = useRouter();

const formData = reactive({
    title: '',
    content: '',
    rating: 'low',
});

const selectedImageFiles = ref([]);
const loading = ref(false);
const message = ref(null);
const messageType = ref('error');
const editorRef = ref(null);
const isEditorReady = ref(false);
const rateLevels = ['low', 'medium', 'high'];

const buttonText = computed(() =>
    loading.value ? 'Đang xử lý...' : props.isEditMode ? 'Cập nhật bài viết' : 'Đăng bài viết'
);

const messageContainerClasses = computed(() => [
    'p-4 rounded-lg text-sm',
    messageType.value === 'error'
        ? 'bg-red-50 text-red-700 border border-red-200'
        : 'bg-green-50 text-green-700 border border-green-200',
]);

const formatRateLevel = (level) => {
    switch (level) {
        case 'low':
            return 'Thấp';
        case 'medium':
            return 'Trung bình';
        case 'high':
            return 'Cao';
        default:
            return level;
    }
};

watch(
    () => props.initialData,
    (newData) => {
        if (newData && props.isEditMode) {
            formData.title = newData.title || '';
            formData.content = newData.content || '';
            formData.rating = newData.rating || 'low';
            selectedImageFiles.value = [];
            if (editorRef.value && isEditorReady.value) {
                if (editorRef.value.getContent() !== formData.content) {
                    editorRef.value.setContent(formData.content);
                }
            }
        } else if (!props.isEditMode) {
            resetForm();
        }
    },
    { immediate: true, deep: true }
);

const handleTinyMCEInitialized = (editor) => {
    editorRef.value = editor;
    isEditorReady.value = true;
    if (props.isEditMode && props.initialData?.content && editor.getContent() !== props.initialData.content) {
        editor.setContent(props.initialData.content);
    } else if (!props.isEditMode && editor.getContent() !== '') {
        editor.setContent('');
    }
};

const handleTinyMCELoadError = (error) => {
    Swal.fire('Lỗi Editor!', 'Không thể tải trình soạn thảo. Vui lòng làm mới trang.', 'error');
    isEditorReady.value = false;
};

const handleEditorContentUpdate = (content) => {};

const handleSubmit = async () => {
    message.value = null;
    if (!isEditorReady.value || !editorRef.value) {
        Swal.fire('Chưa sẵn sàng', 'Trình soạn thảo chưa sẵn sàng, vui lòng đợi.', 'warning');
        return;
    }

    const currentContent = editorRef.value.getContent();
    if (!validateForm(currentContent)) {
        return;
    }

    loading.value = true;

    try {
        if (props.isEditMode) {
            const payload = {
                title: formData.title.trim(),
                content: currentContent,
                rating: formData.rating,
            };

            await $fetch(`${config.public.apiBase}/posts/${props.initialData.id}`, {
                method: 'PATCH',
                body: payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            handleSuccess();
        } else {
            const submissionData = new FormData();
            submissionData.append('title', formData.title.trim());
            submissionData.append('content', currentContent);
            submissionData.append('rating', formData.rating);
            submissionData.append('userId', loggedInUser.value.id);

            if (selectedImageFiles.value.length > 0) {
                selectedImageFiles.value.forEach((file) => {
                    submissionData.append('images', file);
                });
            }

            await $fetch(`${config.public.apiBase}/posts`, {
                method: 'POST',
                body: submissionData,
            });
            handleSuccess();
        }
    } catch (error) {
        handleError(error);
    } finally {
        loading.value = false;
    }
};

const validateForm = (content) => {
    if (!formData.title.trim()) {
        Swal.fire('Thiếu thông tin', 'Vui lòng nhập tiêu đề bài viết.', 'warning');
        return false;
    }
    const textContent = editorRef.value?.getContent({ format: 'text' })?.trim() ?? '';
    if (textContent === '') {
        Swal.fire('Thiếu thông tin', 'Vui lòng nhập nội dung bài viết.', 'warning');
        return false;
    }
    if (!props.isEditMode && !loggedInUser.value?.id) {
        Swal.fire('Lỗi', 'Không xác định được người dùng.', 'error');
        return false;
    }
    return true;
};

const handleSuccess = () => {
    const successMsg = props.isEditMode ? 'Cập nhật bài viết thành công!' : 'Đăng bài viết thành công!';
    Swal.fire({ icon: 'success', title: 'Thành công!', text: successMsg, timer: 2000, showConfirmButton: false });

    if (!props.isEditMode) {
        resetForm();
    }

    setTimeout(() => {
        router.push('/admin/posts');
    }, 1500);
};

const handleError = (error) => {
    const errorMessage = error.data?.message || error.message || 'Đã xảy ra lỗi khi xử lý yêu cầu.';
    Swal.fire({ icon: 'error', title: 'Lỗi!', text: errorMessage });
};

const resetForm = () => {
    Object.assign(formData, { title: '', content: '', rating: 'low' });
    selectedImageFiles.value = [];
    if (editorRef.value) {
        editorRef.value.setContent('');
    }
    message.value = null;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
