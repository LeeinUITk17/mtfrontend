<template>
    <div>
        <banner />

        <div class="sticky top-0 z-10 bg-gradient-to-r from-green-500 via-green-900 to-green-500 shadow-md">
            <scrollableMenu :menu-items="menuItems" @scrollToSection="handleScrollToSection" />
        </div>

        <section id="featured-plants-section" class="py-12 md:py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">Cây trồng nổi bật</h2>
                <div v-if="plantsPending" class="text-center py-10">
                    <LoadingSpinner />
                    <p class="text-sm text-gray-500 mt-2">Đang tải cây trồng...</p>
                </div>
                <div v-else-if="plantsError" class="text-center text-red-500 bg-red-50 p-4 rounded border border-red-200">
                    <p>Không thể tải cây trồng nổi bật: {{ plantsError.message || plantsError }}</p>
                </div>
                <div v-else-if="featuredPlants && featuredPlants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <PlantCard v-for="plant in featuredPlants" :key="plant.id" :plant="plant" />
                </div>
                <div v-else class="text-center text-gray-600 py-10">
                    <p>Chưa có cây trồng nổi bật nào.</p>
                </div>
            </div>
        </section>
        <section id="plant-varieties-section" class="py-12 md:py-16 bg-green-50/30"> 
            <div class="container mx-auto px-4">
                <PlantVarietiesTable />
            </div>
        </section>

        <section id="recent-posts-section" class="bg-gray-50 py-12 md:py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">Bài viết Quan trọng Gần đây</h2>
                <div v-if="postsPending" class="text-center py-10">
                    <LoadingSpinner />
                    <p class="text-sm text-gray-500 mt-2">Đang tải bài viết...</p>
                </div>
                <div v-else-if="postsError" class="text-center text-red-500 bg-red-50 p-4 rounded border border-red-200">
                    <p>Không thể tải bài viết: {{ postsError.message || postsError }}</p>
                </div>
                <div v-else-if="recentHighRatedPosts && recentHighRatedPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                    <PostPreview v-for="post in recentHighRatedPosts" :key="post.id" :post="post" />
                </div>
                <div v-else class="text-center text-gray-600 py-10">
                    <p>Chưa có bài viết quan trọng nào.</p>
                </div>
                <div class="text-center mt-8">
                    <NuxtLink to="/posts" class="text-primary hover:underline font-medium">Xem tất cả bài viết →</NuxtLink>
                </div>
            </div>
        </section>

        <section id="cta-section" class="bg-primary py-10 text-gray-500 text-center">
            <div class="container mx-auto px-4">
                <p class="text-xl mb-4 font-semibold">Sẵn sàng tìm cây mới hoặc chia sẻ kinh nghiệm?</p>
                <NuxtLink to="/plants" class="inline-block text-primary text-lg font-semibold px-8 py-3 rounded-full hover:bg-green-100 transition-colors shadow-md">
                    Khám phá ngay
                </NuxtLink>
            </div>
        </section>

        <section id="gallery-section" class="py-12 md:py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">Thư viện Ảnh</h2>
                <Gallery :initial-images="latestGalleryImages" :loading="galleryPending" :error="galleryError" />
                <div class="text-center mt-8">
                    <NuxtLink to="/gallery" class="text-primary hover:underline font-medium">Xem toàn bộ thư viện →</NuxtLink>
                </div>
            </div>
        </section>

        <section id="testimonial-section" class="bg-gray-50 py-12 md:py-16">
            <div class="container mx-auto px-4">
                <testimonial />
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import PlantCard from '~/components/plants/PlantCard.vue';
import PostPreview from '~/components/posts/PostPreview.vue';
import scrollableMenu from '~/components/common/scrollableMenu.vue';
import Gallery from '~/components/common/Gallery.vue';
import banner from '~/components/common/banner.vue';
import testimonial from '~/components/common/testimonial.vue';
import PlantVarietiesTable from '~/components/common/PlantVarietiesTable.vue';

const config = useRuntimeConfig();

const menuItems = ref([
    { id: 1, name: 'Cây nổi bật', data: 'featured-plants-section', isActive: true },
    { id: 2, name: 'Bài viết mới', data: 'recent-posts-section', isActive: false },
    { id: 3, name: 'Khám phá', data: 'cta-section', isActive: false },
    { id: 4, name: 'Thư viện', data: 'gallery-section', isActive: false },
    { id: 5, name: 'Đánh giá', data: 'testimonial-section', isActive: false },
]);

const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

const { data: featuredPlants, pending: plantsPending, error: plantsError } = await useAsyncData(
    'featured-plants',
    () => $fetch(`${config.public.apiBase}/plants`, { query: { limit: 6 } }),
    { default: () => [] }
);

const { data: recentHighRatedPosts, pending: postsPending, error: postsError } = await useAsyncData(
    'recent-high-posts',
    () => $fetch(`${config.public.apiBase}/posts`, { query: { limit: 4, rating: 'high' } }),
    { default: () => [] }
);

const { data: latestGalleryImages, pending: galleryPending, error: galleryError } = await useAsyncData(
    'latest-gallery-images',
    () => $fetch(`${config.public.apiBase}/gallery-images`, { query: { limit: 10 } }),
    { default: () => [] }
);

useHead({
    title: 'Cây Giống Tuấn Anh - Trang chủ',
    meta: [
        { name: 'description', content: 'Khám phá các loại cây giống chất lượng, đọc bài viết kinh nghiệm và xem hình ảnh thực tế tại Cây Giống Tuấn Anh.' },
        { property: 'og:title', content: 'Cây Giống Tuấn Anh - Trang chủ' },
        { property: 'og:description', content: 'Khám phá các loại cây giống chất lượng, đọc bài viết kinh nghiệm và xem hình ảnh thực tế tại Cây Giống Tuấn Anh.' },
        { property: 'og:image', content: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746146995/gpg18t1hvlrlvww9sw9j.png' },
    ],
});
</script>

<style scoped>
</style>
