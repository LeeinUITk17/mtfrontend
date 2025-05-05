<template>
    <div class="container mx-auto px-4 py-8">
        <GalleryUploadForm @upload-success="handleUploadSuccess" class="mb-10" />

        <hr class="my-8 border-gray-300">   
        <div v-if="deleteMessage" class="mb-4 p-3 rounded-md text-sm font-medium"
            :class="deleteError ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'">
            {{ deleteMessage }}
        </div>

        <ImageTable
            :images="paginatedImages"
            :loading="imagesPending || isDeleting"
            @delete-image="handleDeleteImage"
        />

        <div v-if="!imagesPending && totalPages > 1" class="mt-8 flex justify-center items-center space-x-2">
            <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                v-for="page in paginationButtons"
                :key="page"
                @click="goToPage(page)"
                :class="{
                    'bg-blue-500 text-white border-blue-500': currentPage === page,
                    'bg-white text-gray-700 hover:bg-gray-100 border-gray-300': currentPage !== page
                }"
                class="px-3 py-1 border rounded-md text-sm transition-colors"
            >
                {{ page }}
            </button>

            <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>

        <div v-if="!imagesPending && allImages.length > 0" class="mt-4 text-center text-sm text-gray-500">
            Hiển thị {{ paginatedImages.length }} trên tổng số {{ allImages.length }} ảnh.
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import GalleryUploadForm from '~/components/gallery/GalleryUploadForm.vue';
import ImageTable from '~/components/gallery/ImageTable.vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth']
});

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();

const isDeleting = ref(false);
const deleteMessage = ref(null);
const deleteError = ref(false);

const currentPage = ref(1);
const itemsPerPage = ref(8);

const dataKey = ref(`admin-gallery-images-all-${Date.now()}`);
const {
    data: allImages,
    pending: imagesPending,
    error: imagesError,
    refresh: refreshImages
} = await useAsyncData(
    dataKey.value,
    async () => {
        const response = await $fetch(`${config.public.apiBase}/gallery-images`);
        if (!Array.isArray(response)) return [];
        if (response.length > 0 && response[0].createdAt) {
            return response.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return response;
    },
    { default: () => [] }
);

const totalPages = computed(() => {
    if (!allImages.value || allImages.value.length === 0) return 0;
    return Math.ceil(allImages.value.length / itemsPerPage.value);
});

const paginatedImages = computed(() => {
    if (!allImages.value || allImages.value.length === 0) return [];
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return allImages.value.slice(startIndex, endIndex);
});

const paginationButtons = computed(() => {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
});

watch(allImages, (newVal, oldVal) => {
    if (newVal && newVal.length !== oldVal?.length) {
        const newTotalPages = Math.ceil(newVal.length / itemsPerPage.value);
        if (currentPage.value > newTotalPages && newTotalPages > 0) {
            currentPage.value = newTotalPages;
        } else if (currentPage.value > 1 && newTotalPages === 0) {
            currentPage.value = 1;
        }
    }
});

const handleUploadSuccess = () => {
    deleteMessage.value = null;
    deleteError.value = false;
    currentPage.value = 1;
    refreshImages();
};

const handleDeleteImage = async (imageId) => {
    isDeleting.value = true;
    deleteMessage.value = null;
    deleteError.value = false;

    try {
        await $fetch(`${config.public.apiBase}/gallery-images/${imageId}`, { method: 'DELETE' });
        deleteMessage.value = `Ảnh (ID: ${imageId}) đã được xóa thành công!`;
        deleteError.value = false;
        await refreshImages();
    } catch (err) {
        const apiErrorMessage = err.data?.message || err.message || 'Lỗi không xác định.';
        deleteMessage.value = `Lỗi khi xóa ảnh (ID: ${imageId}): ${apiErrorMessage}`;
        deleteError.value = true;
    } finally {
        isDeleting.value = false;
        setTimeout(() => { deleteMessage.value = null; deleteError.value = false; }, 7000);
    }
};

const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages.value && pageNumber !== currentPage.value) {
        currentPage.value = pageNumber;
        scrollToTableTop();
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        scrollToTableTop();
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        scrollToTableTop();
    }
};

const scrollToTableTop = () => {
    if (process.client) {
        const tableElement = document.querySelector('.shadow.border-b');
        tableElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

useHead({
    title: 'Quản lý Bộ sưu tập Ảnh - Admin',
});
</script>

<style scoped>
.container {
    max-width: 1280px;
}
</style>
