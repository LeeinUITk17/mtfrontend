<template>
    <div class="bg-gray-50 min-h-screen">
        <div class="container mx-auto px-4 py-12 md:py-16">
            <div class="text-center mb-10 md:mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-green-800 tracking-tight">Tin tức & Kinh nghiệm</h1>
                <p class="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                    Khám phá các bài viết chia sẻ kiến thức, mẹo chăm sóc và những câu chuyện thú vị về thế giới cây giống.
                </p>
            </div>

            <div v-if="postsPending" class="text-center py-12">
                <LoadingSpinner class="w-10 h-10 text-green-600 mx-auto" />
                <p class="mt-4 text-gray-500">Đang tải bài viết...</p>
            </div>

            <div v-else-if="postsError" class="text-center text-red-500 py-12 bg-red-50 rounded-lg border border-red-200">
                <p>Lỗi khi tải danh sách bài viết.</p>
                <p class="mt-1 text-sm">{{ postsError.message || 'Vui lòng thử lại sau.' }}</p>
            </div>

            <div v-else-if="paginatedPosts && paginatedPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <PostPreview v-for="post in paginatedPosts" :key="post.id" :post="post" />
            </div>

            <div v-else class="text-center text-gray-600 py-16">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="mt-4 text-xl font-semibold">Chưa có bài viết nào.</p>
                <p class="mt-1 text-gray-500">Chúng tôi sẽ sớm cập nhật các bài viết mới.</p>
            </div>

            <div v-if="!postsPending && totalPages > 1" class="mt-10 md:mt-12 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                <div class="text-sm text-gray-600">
                    Trang <span class="font-medium">{{ currentPage }}</span> / <span class="font-medium">{{ totalPages }}</span> (Tổng số <span class="font-medium">{{ allPosts.length }}</span> bài viết)
                </div>
                <div class="flex justify-center items-center space-x-1">
                    <button @click="goToPage(1)" :disabled="currentPage === 1" class="pagination-button" aria-label="Trang đầu">«</button>
                    <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button" aria-label="Trang trước">‹</button>
                    <button
                        v-for="page in paginationButtons" :key="page" @click="goToPage(page)"
                        :class="['pagination-button px-3', { 'pagination-button-active': currentPage === page }]"
                        :aria-current="currentPage === page ? 'page' : undefined"
                    >{{ page }}</button>
                    <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button" aria-label="Trang sau">›</button>
                    <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="pagination-button" aria-label="Trang cuối">»</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import PostPreview from '~/components/posts/PostPreview.vue';

const config = useRuntimeConfig();

const currentPage = ref(1);
const itemsPerPage = ref(9);

const { data: allPosts, pending: postsPending, error: postsError, refresh: refreshPosts } = await useAsyncData(
    'all-public-posts-list',
    async () => {
        try {
            const fetchedPosts = await $fetch(`${config.public.apiBase}/posts`);
            if (!Array.isArray(fetchedPosts)) return [];
            return fetchedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } catch {
            return [];
        }
    },
    { default: () => [] }
);

const totalPages = computed(() => {
    if (!allPosts.value || allPosts.value.length === 0) return 0;
    return Math.ceil(allPosts.value.length / itemsPerPage.value);
});

const paginatedPosts = computed(() => {
    if (!allPosts.value || allPosts.value.length === 0) return [];
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return allPosts.value.slice(startIndex, endIndex);
});

const paginationButtons = computed(() => {
    const current = currentPage.value, total = totalPages.value, delta = 1;
    const range = [1, ...Array.from({ length: Math.min(total - 2, delta * 2 + 1) }, (_, i) => Math.max(2, current - delta) + i)];
    if (total > 1) range.push(total);
    const rangeWithDots = range.reduce((acc, val, i, arr) => {
        if (i > 0 && val - arr[i - 1] > 1) acc.push('...');
        acc.push(val);
        return acc;
    }, []);
    return rangeWithDots.filter((page, index, self) => typeof page === 'string' || self.indexOf(page) === index).filter((page, index, self) => {
        if (typeof page === 'number') return true;
        return !(index > 0 && self[index - 1] === '...' || index < self.length - 1 && self[index + 1] === '...');
    });
});

watch(allPosts, (newVal) => {
    const newTotalPages = Math.ceil((newVal?.length || 0) / itemsPerPage.value);
    if (currentPage.value > newTotalPages && newTotalPages > 0) {
        currentPage.value = newTotalPages;
    } else if (currentPage.value > 1 && newTotalPages === 0) {
        currentPage.value = 1;
    }
}, { deep: true });

const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));
    } catch {
        return '';
    }
};

const extractText = (html) => {
    if (!html) return '';
    if (process.server) return '';
    try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    } catch {
        return '';
    }
};

const goToPage = (pageNumber) => {
    if (typeof pageNumber !== 'number' || pageNumber < 1 || pageNumber > totalPages.value || pageNumber === currentPage.value) return;
    currentPage.value = pageNumber;
    if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' });
};

const nextPage = () => { if (currentPage.value < totalPages.value) goToPage(currentPage.value + 1); };
const prevPage = () => { if (currentPage.value > 1) goToPage(currentPage.value - 1); };

useHead({
    title: 'Kinh Nghiệm Trồng & Chăm Sóc Cây Cao Su Giống | Tuấn Anh',
    meta: [
        { 
            name: 'description', 
            content: 'Chia sẻ kinh nghiệm trồng, chăm sóc cây cao su giống các loại RRIV 209, PB 235, DK4. Kỹ thuật lấy mủ, phòng bệnh và tăng năng suất từ vườn ươm Tuấn Anh Bình Phước.' 
        },
        { 
            name: 'keywords', 
            content: 'kinh nghiệm trồng cao su, kỹ thuật chăm sóc cây cao su giống, bệnh cây cao su, cách lấy mủ cao su, giống cao su năng suất cao, trồng cao su Bình Phước, chăm sóc cao su con, phân bón cho cây cao su, phòng trừ sâu bệnh cao su, mô hình trồng cao su hiệu quả' 
        },
        { property: 'og:title', content: 'Kinh Nghiệm Trồng & Chăm Sóc Cây Cao Su Giống | Tuấn Anh' },
        { 
            property: 'og:description', 
            content: 'Kiến thức chuyên sâu về trồng và chăm sóc cây cao su giống từ vườn ươm Tuấn Anh Bình Phước' 
        },
        { property: 'og:image', content: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746146995/gpg18t1hvlrlvww9sw9j.png' },
        { property: 'og:url', content: 'https://caosugiongtuananh.com/blog' },
        { property: 'og:type', content: 'website' },
        
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Kinh Nghiệm Trồng Cây Cao Su Giống | Tuấn Anh' },
        { name: 'twitter:description', content: 'Chia sẻ kinh nghiệm từ vườn ươm cao su giống uy tín tại Bình Phước' },
        { name: 'twitter:image', content: 'https://res.cloudinary.com/dbonwxmgl/image/upload/q_auto,f_webp,w_auto/v1746146995/gpg18t1hvlrlvww9sw9j.png' },
        
        { rel: 'canonical', href: 'https://caosugiongtuananh.com/posts' },
    ],
    link: [
        { rel: 'canonical', href: 'https://caosugiongtuananh.com/posts' }
    ],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Blog",
                "name": "Kinh nghiệm trồng cây cao su giống",
                "description": "Chia sẻ kiến thức chuyên sâu về trồng và chăm sóc cây cao su giống",
                "url": "https://caosugiongtuananh.com/blog",
                "publisher": {
                    "@type": "Organization",
                    "name": "Cây Giống Tuấn Anh",
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
.pagination-button {
    @apply px-2.5 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}
.pagination-button-active {
    @apply bg-green-600 text-white border-green-600 z-10 hover:bg-green-700;
}
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
