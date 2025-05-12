<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="plantPending" class="text-center py-12" aria-live="polite" aria-busy="true">
            <LoadingSpinner class="w-10 h-10 text-green-600 mx-auto" />
            <p class="mt-4 text-gray-700">Đang tải thông tin cây...</p>
        </div>

        <div v-else-if="plantError" class="text-center text-red-500 py-12 bg-red-50 border border-red-200 rounded" role="alert">
            <h2 class="text-lg font-semibold">Lỗi khi tải thông tin cây</h2>
            <p class="mt-2">{{ plantError.message || 'Vui lòng thử lại sau hoặc liên hệ hỗ trợ.' }}</p>
            <NuxtLink to="/plants" class="mt-4 inline-block text-primary hover:underline" aria-label="Quay lại danh sách cây">
                Quay lại danh sách cây
            </NuxtLink>
        </div>

        <div v-else-if="!plant" class="text-center text-gray-600 py-12" aria-live="polite">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 class="mt-4 text-xl font-semibold">Không tìm thấy cây này</h1>
            <p class="mt-2">Mã cây có thể không đúng hoặc cây không tồn tại</p>
            <NuxtLink to="/plants" class="mt-4 inline-block text-primary hover:underline" aria-label="Quay lại danh sách cây">
                Quay lại danh sách cây
            </NuxtLink>
        </div>

        <main v-else itemscope itemtype="https://schema.org/Product">
            <div class="bg-white rounded-lg shadow-xl overflow-hidden">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div class="md:col-span-1 p-4 sm:p-6">
                        <figure v-if="plant.images && plant.images.length > 0" class="relative">
                            <swiper-container
                                ref="mainSwiperRef"
                                class="main-swiper rounded-lg shadow-md border border-gray-200"
                                :slides-per-view="1"
                                :space-between="10"
                                :navigation="true"
                                :pagination="{ clickable: true }"
                                :thumbs="{ swiper: thumbsSwiperInstance }"
                                :loop="plant.images.length > 1"
                                aria-label="Bộ sưu tập hình ảnh cây giống"
                            >
                                <swiper-slide v-for="(image, index) in plant.images" :key="image.id || index">
                                    <NuxtImg
                                        :src="image.url"
                                        :alt="`${plant.name} - ảnh ${index + 1}`"
                                        class="w-full h-auto max-h-[65vh] object-contain rounded-lg"
                                        sizes="sm:100vw md:50vw lg:600px"
                                        quality="85"
                                        loading="lazy"
                                        :draggable="false"
                                        width="600"
                                        height="600"
                                        itemprop="image"
                                    />
                                </swiper-slide>
                            </swiper-container>

                            <div v-if="plant.images.length > 1" class="mt-3">
                                <swiper-container
                                    class="thumbs-swiper"
                                    init="false"
                                    :slides-per-view="4"
                                    :space-between="10"
                                    :free-mode="true"
                                    :watch-slides-progress="true"
                                    aria-label="Thumbnail navigation"
                                >
                                    <swiper-slide
                                        v-for="(image, index) in plant.images"
                                        :key="'thumb-' + (image.id || index)"
                                        class="cursor-pointer rounded overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                                        :aria-label="`Xem ảnh ${index + 1}`"
                                        :aria-controls="'slide-' + index"
                                    >
                                        <NuxtImg
                                            :src="image.url"
                                            :alt="`Thumbnail ${index + 1}`"
                                            class="w-full h-16 md:h-20 object-cover"
                                            sizes="80px"
                                            quality="70"
                                            loading="lazy"
                                            width="80"
                                            height="80"
                                        />
                                    </swiper-slide>
                                </swiper-container>
                            </div>
                            <figcaption class="sr-only">Hình ảnh minh họa cây giống {{ plant.name }}</figcaption>
                        </figure>

                        <div v-else class="w-full h-64 md:h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    <div class="md:col-span-1 p-6 md:p-8 space-y-6">
                        <header>
                            <h1 class="text-3xl md:text-4xl font-bold text-green-800" itemprop="name">{{ plant.name }}</h1>
                            <div v-if="plant.category" class="text-sm text-gray-500 mt-1" itemprop="category">
                                Danh mục:
                                <NuxtLink 
                                    :to="`/categories/${plant.category.id}`" 
                                    class="text-primary hover:underline"
                                    :aria-label="`Xem thêm cây trong danh mục ${plant.category.name}`"
                                >
                                    {{ plant.category.name }}
                                </NuxtLink>
                            </div>
                        </header>

                        <section>
                            <h2 class="text-xl font-semibold text-green-700 mb-2 border-b pb-1">Mô tả</h2>
                            <div v-if="plant.description" class="prose prose-sm max-w-none text-gray-700 leading-relaxed" itemprop="description" v-html="plant.description"></div>
                            <p v-else class="text-gray-600 italic">Chưa có mô tả chi tiết</p>
                        </section>

                        <section class="flex items-baseline space-x-4" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                            <div>
                                <div class="space-y-1 md:space-y-1.5 mt-2">
                                    <p class="text-base sm:text-lg md:text-xl font-semibold text-green-700">
                                        Giá: <span class="text-orange-600" itemprop="price">Thương lượng</span>
                                        <meta itemprop="priceCurrency" content="VND" />
                                    </p>
                                    <div class="text-xs sm:text-sm md:text-base text-gray-700 flex items-start sm:items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <div class="flex flex-col sm:flex-row sm:items-center sm:flex-wrap">
                                            <span class="leading-snug">Liên hệ tư vấn & báo giá:</span>
                                            <a 
                                                href="tel:0979072768" 
                                                class="sm:ml-1 font-medium text-blue-600 hover:text-blue-700 hover:underline leading-snug block sm:inline"
                                                aria-label="Gọi điện tư vấn"
                                                itemprop="telephone"
                                            >
                                                0979 072 768
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="plant.stock != null" itemprop="availability" :content="plant.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'">
                                <h2 class="text-lg font-semibold text-gray-700 mb-1">Tồn kho</h2>
                                <p :class="['text-lg font-semibold', plant.stock > 0 ? 'text-green-600' : 'text-red-600']">
                                    {{ plant.stock > 0 ? `Còn hàng (${plant.stock})` : 'Hết hàng' }}
                                </p>
                            </div>
                        </section>

                        <footer class="mt-8 pt-6 border-t">
                            <a
                                href="https://zalo.me/0979072768"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center justify-center bg-primary text-gray-800 bg-gray-200 text-lg font-semibold px-8 py-3 rounded-full hover:bg-primary-dark hover:bg-green-500 hover:text-white transition-colors duration-300 shadow-lg w-full sm:w-auto text-center"
                                aria-label="Liên hệ qua Zalo để mua cây giống"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16.75 13.96c.25.13.42.2.55.38a.87.87 0 0 1 .18.55v.45c0 .18-.07.38-.15.55a1.36 1.36 0 0 1-.5.58c-.4.34-.85.58-1.35.7a4 4 0 0 1-1.6.2c-.4 0-.8-.02-1.15-.07a8.7 8.7 0 0 1-3.4-1.4 13.2 13.2 0 0 1-3.2-2.9 12.1 12.1 0 0 1-2-3.6c-.2-.5-.3-1-.3-1.5v-.2c0-.2.03-.4.08-.6a1.8 1.8 0 0 1 .7-1.1c.2-.2.4-.3.6-.3h.4a.7.7 0 0 1 .6.3c.1.1.2.3.3.5l.8 1.8c.1.3.2.6.2.9 0 .3-.1.6-.2.8l-.5.9a.4.4 0 0 0 0 .5c.1.2.3.5.6.8a5.9 5.9 0 0 0 2.1 1.9c.3.2.6.4.8.6l.9-.5c.2-.1.5-.2.8-.2.3 0 .6.1.9.2l1.7.8c.3.1.5.2.6.4Zm-3.2-8.2a5.5 5.5 0 0 0-5.2 3.5 7.4 7.4 0 0 0 .2 4.7 10.6 10.6 0 0 0 2.7 3.8 11.5 11.5 0 0 0 4.1 2.7 7.5 7.5 0 0 0 4.6.3 5.5 5.5 0 0 0 3.5-5.2 5.6 5.6 0 0 0-1.5-4A5.5 5.5 0 0 0 13.5 5.8Zm0-2.3A7.8 7.8 0 0 1 21 11.6a8 8 0 0 1-2.1 5.7 10.1 10.1 0 0 1-6.2.4 13.8 13.8 0 0 1-5.4-3.5 14.2 14.2 0 0 1-3.5-5.4 9.8 9.8 0 0 1 .4-6.2A7.8 7.8 0 0 1 13.5 3.5Z" />
                                </svg>
                                Liên hệ Zalo để mua
                            </a>
                        </footer>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import { register } from 'swiper/element/bundle';

register();

const config = useRuntimeConfig();
const route = useRoute();
const plantSlug = route.params.slug;

const mainSwiperRef = ref(null);
const thumbsSwiperInstance = ref(null);

const { data: plant, pending: plantPending, error: plantError } = await useAsyncData(
    `plant-detail-${plantSlug}`,
    async () => {
        try {
            const response = await $fetch(`${config.public.apiBase}/plants/slug/${plantSlug}`);
            if (!response) {
                throw createError({ statusCode: 404, statusMessage: 'Plant not found', fatal: true });
            }
            return response;
        } catch (err) {
            console.error('Error fetching plant detail:', err);
            if (err.statusCode === 404) {
                throw createError({ statusCode: 404, statusMessage: 'Plant not found', fatal: true });
            }
            throw createError({ statusCode: 500, statusMessage: 'Could not load plant data', fatal: true });
        }
    }
);

const formatCurrency = (value) => {
    if (value == null) return '';
    const numberValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : Number(value);
    if (isNaN(numberValue)) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numberValue);
};

onMounted(() => {
    watch(
        plant,
        (newPlant) => {
            if (newPlant && newPlant.images && newPlant.images.length > 1) {
                nextTick(() => {
                    const thumbsSwiperEl = document.querySelector('.thumbs-swiper');
                    if (thumbsSwiperEl && thumbsSwiperEl.initialize) {
                        thumbsSwiperEl.initialize();
                        thumbsSwiperInstance.value = thumbsSwiperEl.swiper;

                        if (mainSwiperRef.value) {
                            mainSwiperRef.value.swiper.thumbs.swiper = thumbsSwiperInstance.value;
                            mainSwiperRef.value.swiper.thumbs.init();
                            mainSwiperRef.value.swiper.thumbs.update();
                        }
                    }
                });
            }
        },
        { immediate: true }
    );
});

useHead(() => {
  const plantName = plant.value?.name || 'Cây cao su giống';
  const plantDescription = plant.value?.description 
    ? plant.value.description.substring(0, 160) + '...'
    : `Thông tin chi tiết về giống cao su ${plantName} tại vườn ươm Tuấn Anh Bình Phước`;
  const imageUrl = plant.value?.images?.[0]?.url || 'https://res.cloudinary.com/dbonwxmgl/image/upload/q_auto,f_webp,w_auto/v1746146995/gpg18t1hvlrlvww9sw9j.png';
  const price = plant.value?.price || 0;
  const stockStatus = plant.value?.stock > 0 ? 'InStock' : 'OutOfStock';

  return {
    title: `${plantName} - Giống Cao Su Chất Lượng | Tuấn Anh Bình Phước`,
    meta: [
      { 
        name: 'description', 
        content: plantDescription 
      },
      { 
        name: 'keywords', 
        content: `cây cao su giống ${plantName}, bán ${plantName}, giá ${plantName} 2025, đặc điểm ${plantName}, kỹ thuật trồng ${plantName}, mua cây cao su giống Bình Phước` 
      },
      { 
        property: 'og:title', 
        content: `${plantName} - Vườn Ươm Tuấn Anh` 
      },
      { 
        property: 'og:description', 
        content: plantDescription 
      },
      { 
        property: 'og:image', 
        content: imageUrl 
      },
      { 
        property: 'og:url', 
        content: `${config.public.baseUrl}/plants/${plantSlug}` 
      },
      { 
        property: 'og:type', 
        content: 'product' 
      },
      { 
        name: 'twitter:card', 
        content: 'summary_large_image' 
      },
      { 
        name: 'twitter:title', 
        content: `${plantName} - Giống Cao Su Chất Lượng` 
      },
      { 
        name: 'twitter:description', 
        content: plantDescription 
      },
    ],
    link: [
      { 
        rel: 'canonical', 
        href: `${config.public.baseUrl}/plants/${plantSlug}` 
      }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": plantName,
          "description": plantDescription,
          "image": imageUrl,
          "brand": {
            "@type": "Brand",
            "name": "Vườn Ươm Tuấn Anh"
          },
          "offers": {
            "@type": "Offer",
            "url": `${config.public.baseUrl}/plants/${plantSlug}`,
            "priceCurrency": "VND",
            "price": price,
            "priceValidUntil": "2025-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": `https://schema.org/${stockStatus}`,
            "seller": {
              "@type": "Organization",
              "name": "Vườn Ươm Tuấn Anh"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "25"
          }
        })
      },
    ]
  };
});
</script>

<style>
swiper-container {
    --swiper-theme-color: #10B981;
    --swiper-navigation-color: #ffffff;
    --swiper-navigation-size: 30px;
    --swiper-pagination-color: var(--swiper-theme-color);
    --swiper-pagination-bullet-inactive-color: #9ca3af;
    --swiper-pagination-bullet-inactive-opacity: 0.5;
    --swiper-pagination-bullet-size: 8px;
    --swiper-pagination-bullet-horizontal-gap: 4px;
}

swiper-container::part(button-prev),
swiper-container::part(button-next) {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    transition: background-color 0.2s ease;
}

swiper-container::part(button-prev):hover,
swiper-container::part(button-next):hover {
    background-color: rgba(0, 0, 0, 0.5);
}

.thumbs-swiper swiper-slide {
    opacity: 0.6;
    transition: opacity 0.3s ease;
    border: 2px solid transparent;
    border-radius: 0.375rem;
}

.thumbs-swiper swiper-slide:hover {
    opacity: 0.8;
}

.thumbs-swiper .swiper-slide-thumb-active {
    opacity: 1;
    border-color: var(--swiper-theme-color);
}

.prose {
}
</style>
