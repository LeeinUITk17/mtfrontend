<template>
    <div class="post-content-wrapper">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">{{ post.title }}</h1>
        <div class="text-sm text-gray-500 mb-6 border-b border-gray-200 pb-3">
            <span>Ngày đăng: {{ formatDate(post.createdAt) }}</span>
        </div>
        <div v-if="post.content" class="prose prose-green lg:prose-lg max-w-none text-gray-700 leading-relaxed" v-html="post.content"></div>
        <p v-else class="text-gray-500 italic">Bài viết này chưa có nội dung.</p>
    </div>
</template>

<script setup>
const props = defineProps({
    post: { type: Object, required: true }
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(dateString));
    } catch (e) {
        return 'Invalid Date';
    }
};
</script>

<style>
.prose {
}
.prose h2 {
    @apply text-2xl font-semibold mt-8 mb-4 text-green-700 border-b pb-1;
}
.prose h3 {
    @apply text-xl font-semibold mt-6 mb-3 text-green-700;
}
.prose p {
    @apply mb-4;
}
.prose a {
    @apply text-green-700 hover:text-green-800 hover:underline transition-colors;
}
.prose img {
    @apply rounded-lg my-6 shadow-sm border;
    max-width: 100%;
    height: auto;
}
.prose blockquote {
    @apply border-l-4 border-green-300 pl-4 italic text-gray-600 my-6;
}
.prose ul {
    @apply list-disc pl-6 mb-4;
}
.prose ol {
    @apply list-decimal pl-6 mb-4;
}
.prose li > p {
    @apply mb-1;
}
</style>
