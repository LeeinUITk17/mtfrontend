<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="galleryPending" class="text-center py-12">
            <LoadingSpinner class="w-10 h-10 text-green-600 mx-auto" />
            <p class="mt-4 text-gray-700">Đang tải bộ sưu tập...</p>
        </div>

        <div v-else-if="galleryError" class="text-center text-red-500 py-12 bg-red-50 border border-red-200 rounded">
            <p>Lỗi khi tải bộ sưu tập: {{ galleryError.message }}</p>
            <p class="mt-2">Vui lòng thử lại sau.</p>
        </div>

        <div v-else-if="images && images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            <div
                v-for="(image, index) in images"
                :key="image.id || index"
                class="relative aspect-square cursor-pointer rounded-lg overflow-hidden shadow-md transform transition duration-300 ease-in-out hover:scale-102 hover:shadow-xl"
                @click="openModal(index)"
                :aria-label="'Mở ảnh ' + (image.id ? image.id : index + 1)"
            >
                <NuxtImg
                    :src="image.imageUrl"
                    :alt="'Ảnh bộ sưu tập ' + (index + 1)"
                    class="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                    sizes="sm:100vw md:50vw lg:300px"
                    @error="handleGridImageError(index)"
                />
                <div class="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                <div v-if="imageLoadErrors[index]" class="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                    Lỗi tải ảnh
                </div>
            </div>
        </div>

        <div v-else class="text-center text-gray-600 py-12">
            <p class="text-xl font-semibold">Không có ảnh nào trong bộ sưu tập.</p>
            <p class="mt-2">Hãy quay lại sau để xem các bộ sưu tập ảnh mới!</p>
        </div>

        <Transition name="fade">
            <div
                v-if="showModal"
                class="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-80 backdrop-blur-sm p-4"
                @click.self="closeModal"
                @keydown.escape="closeModal"
                tabindex="-1"
            >
                <div class="relative w-full max-w-5xl h-full flex items-center justify-center">
                    <button
                        class="absolute top-0 right-0 m-4 z-10 text-white hover:text-gray-300 transition-colors duration-300"
                        @click="closeModal"
                        aria-label="Đóng cửa sổ xem ảnh"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <button
                        class="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 text-white text-opacity-80 hover:text-opacity-100 transition-opacity duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                        @click="prevImage"
                        aria-label="Ảnh trước"
                        :disabled="!images || images.length <= 1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div class="relative flex items-center justify-center max-w-full max-h-[90vh]">
                        <div v-if="modalImageLoading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
                            <svg class="animate-spin h-10 w-10 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <img
                            v-if="images && images[currentImage] && !modalImageErrorState"
                            :src="images[currentImage].imageUrl"
                            :alt="'Ảnh hiện tại trong cửa sổ xem ' + (currentImage + 1)"
                            class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-xl"
                            @load="handleModalImageLoad"
                            @error="handleModalImageError"
                        />
                        <div v-else-if="modalImageErrorState" class="max-w-full max-h-[90vh] flex items-center justify-center text-gray-300 p-8 bg-gray-800 bg-opacity-50 rounded-lg">
                            Lỗi khi tải ảnh này.
                        </div>
                    </div>

                    <button
                        class="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 text-white text-opacity-80 hover:text-opacity-100 transition-opacity duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                        @click="nextImage"
                        aria-label="Ảnh tiếp theo"
                        :disabled="!images || images.length <= 1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, watch, onUnmounted, reactive, nextTick } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

const showModal = ref(false);
const currentImage = ref(0);
const modalImageLoading = ref(false);
const modalImageErrorState = ref(false);
const imageLoadErrors = reactive({});
const config = useRuntimeConfig();

const { data: images, pending: galleryPending, error: galleryError } = await useAsyncData(
    'gallery-images-public',
    async () => {
        const response = await $fetch(`${config.public.apiBase}/gallery-images`);
        if (!Array.isArray(response)) throw new Error('Dữ liệu bộ sưu tập không hợp lệ.');
        return response;
    },
    { default: () => [] }
);

const openModal = (index) => {
    if (!images.value || !images.value[index]) return;
    modalImageErrorState.value = false;
    currentImage.value = index;
    showModal.value = true;
    document.body.style.overflow = 'hidden';
    modalImageLoading.value = true;
};

const closeModal = () => {
    showModal.value = false;
    document.body.style.overflow = '';
    modalImageErrorState.value = false;
};

const nextImage = () => {
    if (!images.value || images.value.length <= 1) return;
    modalImageErrorState.value = false;
    currentImage.value = (currentImage.value + 1) % images.value.length;
    modalImageLoading.value = true;
};

const prevImage = () => {
    if (!images.value || images.value.length <= 1) return;
    modalImageErrorState.value = false;
    currentImage.value = currentImage.value === 0 ? images.value.length - 1 : currentImage.value - 1;
    modalImageLoading.value = true;
};

const handleModalImageLoad = () => {
    modalImageLoading.value = false;
    modalImageErrorState.value = false;
};

const handleModalImageError = () => {
    modalImageLoading.value = false;
    modalImageErrorState.value = true;
};

const handleGridImageError = (index) => {
    imageLoadErrors[index] = true;
};

const handleKeydown = (event) => {
    if (!showModal.value) return;
    if (event.key === 'ArrowRight' && images.value && images.value.length > 1) nextImage();
    else if (event.key === 'ArrowLeft' && images.value && images.value.length > 1) prevImage();
    else if (event.key === 'Escape') closeModal();
};

watch(showModal, (isOpen) => {
    if (isOpen) {
        document.addEventListener('keydown', handleKeydown);
        nextTick(() => {
            const modalElement = document.querySelector('.fixed.inset-0.z-50');
            modalElement?.focus();
        });
    } else {
        document.removeEventListener('keydown', handleKeydown);
    }
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
});

useHead({
    title: 'Thư Viện Ảnh Cây Cao Su Giống - Vườn Ươm Tuấn Anh Bình Phước',
    meta: [
        { 
            name: 'description', 
            content: 'Hình ảnh thực tế các giống cây cao su RRIV 209, PB 235, DK4, VM 515 tại vườn ươm Tuấn Anh. Xem quy trình chăm sóc, chất lượng cây giống và thành quả của bà con nông dân.' 
        },
        { 
            name: 'keywords', 
            content: 'hình ảnh cây cao su giống, ảnh thực tế vườn cao su, cây cao su giống RRIV 209, cây cao su PB 235, vườn ươm cao su Bình Phước, quy trình chăm sóc cao su, hình ảnh cây cao su khỏe mạnh, album cây cao su giống, thư viện ảnh nông nghiệp' 
        },
        { 
            property: 'og:title', 
            content: 'Thư Viện Ảnh Cây Cao Su Giống - Tuấn Anh Bình Phước' 
        },
        { 
            property: 'og:description', 
            content: 'Hình ảnh thực tế các giống cây cao su chất lượng cao tại vườn ươm Tuấn Anh' 
        },
        { 
            property: 'og:image', 
            content: images.value?.[0]?.imageUrl || 'https://res.cloudinary.com/dbonwxmgl/image/upload/q_auto,f_webp,w_auto/v1746146995/gpg18t1hvlrlvww9sw9j.png' 
        },
        { 
            property: 'og:url', 
            content: `${config.public.baseUrl}/gallery` 
        },
        { 
            property: 'og:type', 
            content: 'website' 
        },
        
        { 
            name: 'twitter:card', 
            content: 'summary_large_image' 
        },
        { 
            name: 'twitter:title', 
            content: 'Ảnh Thực Tế Cây Cao Su Giống - Tuấn Anh' 
        },
        { 
            name: 'twitter:description', 
            content: 'Hình ảnh chất lượng cây giống tại vườn ươm uy tín Bình Phước' 
        },
        { 
            name: 'twitter:image', 
            content: images.value?.[0]?.imageUrl || 'https://res.cloudinary.com/dbonwxmgl/image/upload/q_auto,f_webp,w_auto/v1746146995/gpg18t1hvlrlvww9sw9j.png' 
        },
        
        { 
            rel: 'canonical', 
            href: `${config.public.baseUrl}/gallery` 
        },
    ],
    link: [
        { 
            rel: 'canonical', 
            href: `${config.public.baseUrl}/gallery` 
        }
    ],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ImageGallery",
                "name": "Thư viện ảnh cây cao su giống",
                "description": "Hình ảnh thực tế các giống cây cao su tại vườn ươm Tuấn Anh",
                "url": `${config.public.baseUrl}/gallery`,
                "publisher": {
                    "@type": "Organization",
                    "name": "Vườn Ươm Cây Cao Su Giống Tuấn Anh",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://res.cloudinary.com/dbonwxmgl/image/upload/q_auto,f_webp,w_auto/v1746146995/gpg18t1hvlrlvww9sw9j.png"
                    }
                }
            })
        }
    ]
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.animate-spin {
    animation: spin 1s linear infinite;
}
</style>
