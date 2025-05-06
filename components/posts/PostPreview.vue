<template>
    <NuxtLink :to="`/posts/${post.id}`" class="group block bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 border border-gray-100 flex flex-col h-full">
        <div class="relative h-48 w-full overflow-hidden">
            <NuxtImg v-if="post.images?.length > 0" :src="post.images[0].url" :alt="post.title || 'Ảnh bài viết'" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" sizes="sm:100vw md:50vw lg:400px" quality="80" loading="lazy" />
            <div v-else class="w-full h-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-green-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <span v-if="post.rating" :class="ratingBadgeClass(post.rating)" class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold z-10 shadow-sm">
                {{ formatRateLevel(post.rating) }}
            </span>
        </div>
        <div class="p-5 flex flex-col flex-grow">
            <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-green-700 transition-colors duration-200 line-clamp-2" :title="post.title">
                {{ post.title }}
            </h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">
                {{ extractText(post.content) || 'Xem chi tiết bài viết...' }}
            </p>
            <div class="mt-auto pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                <span>Ngày đăng: {{ formatDate(post.createdAt) }}</span>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>
const props = defineProps({
    post: { type: Object, required: true }
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));
    } catch (e) {
        return '';
    }
};

const extractText = (html) => {
    if (!html || process.server) return '';
    try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        let text = tempDiv.textContent || tempDiv.innerText || '';
        return text.length > 100 ? text.substring(0, 100) + '...' : text;
    } catch (e) {
        return '';
    }
};

const formatRateLevel = (level) => {
    switch (level) {
        case 'low': return 'Thường';
        case 'medium': return 'Quan trọng';
        case 'high': return 'Nổi bật';
        default: return '';
    }
};

const ratingBadgeClass = (level) => {
    switch (level) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
</script>

<style scoped>
.line-clamp-2 { }
.line-clamp-3 { }
</style>
