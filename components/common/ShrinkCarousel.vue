<template>
    <div class="shrink-carousel-container">
        <Swiper
            :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperNavigation, SwiperPagination]"
            :slides-per-view="1"
            :loop="true"
            :autoplay="{
                delay: 8000,
                disableOnInteraction: true,
            }"
            :breakpoints="{
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                },
            }"
            :pagination="{
                clickable: true,
                el: '.swiper-pagination'
            }"
            :navigation="{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }"
        >
            <SwiperSlide v-for="(item, index) in items" :key="item.id || index">
                <div class="carousel-item bg-white rounded-lg shadow-md overflow-hidden flex flex-col border border-gray-200">
                    <div v-if="item.imageUrl" class="relative">
                        <img
                            :src="item.imageUrl"
                            :alt="item.title || 'Item image'"
                            class="w-full h-40 object-cover"
                        />
                    </div>
                    <div v-else class="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        No Image
                    </div>
                    <div class="p-4 flex-grow flex flex-col justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ item.title }}</h3>
                            <p v-if="item.description" class="text-sm text-gray-600">{{ item.description }}</p>
                            <p v-if="item.value" class="text-base font-bold text-green-600 mt-2">{{ item.value }}</p>
                        </div>
                        <div class="mt-4">
                            <button v-if="item.link" @click="navigateTo(item.link)" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm">
                                View
                            </button>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
            <div class="swiper-pagination"></div>
        </Swiper>
    </div>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Array,
        required: true,
        default: () => [],
        validator: (value) => Array.isArray(value),
    },
});

import { navigateTo } from '#app';
</script>

<style scoped>
.shrink-carousel-container {
    padding: 1rem 0;
}

.carousel-item {
    height: 350px;
}
</style>
