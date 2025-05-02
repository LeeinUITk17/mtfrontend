<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">Bộ sưu tập Ảnh</h1>

        <div v-if="imagesPending" class="text-center py-12">
            <LoadingSpinner class="w-10 h-10 text-green-600 mx-auto" />
            <p class="mt-4 text-gray-700">Đang tải ảnh bộ sưu tập...</p>
        </div>

        <div v-else-if="imagesError" class="text-center text-red-500 py-12">
            <p>Lỗi khi tải ảnh bộ sưu tập: {{ imagesError.message }}</p>
            <p class="mt-2">Vui lòng thử lại sau.</p>
        </div>

        <div v-else>
            <ImagesGridWithModal :images="paginatedImages" />
        </div>

        <div v-if="!imagesPending && !imagesError && (!images || images.length === 0)" class="text-center text-gray-600 py-12">
            <p class="text-xl font-semibold">Không có ảnh nào trong bộ sưu tập.</p>
            <p class="mt-2">Hãy quay lại sau để xem các bộ sưu tập ảnh mới!</p>
        </div>

        <div v-if="totalPages > 1 && !imagesPending && !imagesError && images && images.length > 0" class="mt-12 flex justify-center items-center space-x-2">
            <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Trước
            </button>

            <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="{
                    'bg-green-500 text-white': currentPage === page,
                    'bg-white text-gray-700 hover:bg-gray-100': currentPage !== page
                }"
                class="px-3 py-1 border rounded-md transition-colors"
            >
                {{ page }}
            </button>

            <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Sau
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import ImagesGridWithModal from '~/components/gallery/ImagesGridWithModal.vue';

const config = useRuntimeConfig();

const currentPage = ref(1);
const itemsPerPage = ref(10);

const { data: images, pending: imagesPending, error: imagesError } = await useAsyncData(
    'all-gallery-images',
    async () => {
        const response = await $fetch(`${config.public.apiBase}/gallery-images`);
        if (!response) {
            console.warn('Empty or null response received for gallery images.');
            return [];
        }
        return response;
    }
);

const totalPages = computed(() => {
    if (!images.value) return 0;
    return Math.ceil(images.value.length / itemsPerPage.value);
});

const paginatedImages = computed(() => {
    if (!images.value) {
        console.warn('Images data not loaded yet for pagination slicing.');
        return [];
    }
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return images.value.slice(start, end);
});

watch(images, () => {
    currentPage.value = 1;
}, { deep: true });

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        if (process.client) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        goToPage(currentPage.value + 1);
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        goToPage(currentPage.value - 1);
    }
};

useHead({
    title: 'Bộ sưu tập Ảnh - Plant Shop',
    meta: [
        { name: 'description', content: 'Khám phá bộ sưu tập ảnh cây cảnh của chúng tôi.' },
        { property: 'og:title', content: 'Bộ sưu tập Ảnh - Plant Shop' },
        { property: 'og:description', content: 'Khám phá bộ sưu tập ảnh cây cảnh của chúng tôi.' },
        { property: 'og:image', content: '/social-share-image.jpg' },
        { property: 'og:url', content: `${config.public.apiBase}/gallery` }
    ]
});
</script>

<style scoped>
</style>
