<template>
  <div class="bg-gray-50 py-12 md:py-16">
    <div class="container mx-auto px-4">
      <NuxtLink to="/posts" class="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6 group">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Quay lại danh sách bài viết
      </NuxtLink>

      <div v-if="postPending" class="text-center py-16">
        <LoadingSpinner class="w-12 h-12 text-green-600 mx-auto" />
        <p class="mt-4 text-gray-500">Đang tải bài viết...</p>
      </div>

      <div v-else-if="postError" class="text-center text-red-500 py-16 bg-red-50 rounded-lg border border-red-200">
        <p class="text-lg font-semibold">Lỗi khi tải bài viết</p>
        <p class="mt-2">{{ postError.message || 'Không thể kết nối đến máy chủ.' }}</p>
      </div>

      <div v-else-if="!post" class="text-center text-gray-600 py-16">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="mt-4 text-xl font-semibold">Không tìm thấy bài viết.</p>
        <p class="mt-2 text-gray-500">Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      </div>

      <div v-else class="max-w-4xl mx-auto">
        <article class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div v-if="post.images && post.images.length > 0" class="relative border-b border-gray-200">
            <swiper-container
              v-if="post.images.length > 1"
              class="post-image-swiper"
              :slides-per-view="1"
              :space-between="0"
              :navigation="true"
              :pagination="{ clickable: true }"
              :loop="true"
            >
              <swiper-slide v-for="(image, index) in post.images" :key="image.id || index">
                <NuxtImg :src="image.url" :alt="`${post.title} - ảnh ${index + 1}`" class="w-full h-64 md:h-96 object-cover" sizes="sm:100vw md:80vw lg:768px" quality="85" loading="lazy" />
              </swiper-slide>
            </swiper-container>
            <NuxtImg v-else :src="post.images[0].url" :alt="post.title" class="w-full h-64 md:h-96 object-cover" sizes="sm:100vw md:80vw lg:768px" quality="85" loading="lazy" />
          </div>

          <div class="p-6 md:p-10 lg:p-12">
            <PostDetailContent :post="post" />
            <div class="mt-8 pt-6 border-t border-gray-100">
              <p class="text-sm font-medium text-gray-600 mb-2">Chia sẻ bài viết:</p>
              <div class="flex space-x-3">
                <a href="https://www.facebook.com/caosugiongtuananh" aria-label="Share on Facebook" class="text-gray-400 hover:text-blue-600 transition-colors"><img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/qgx8ou1dbf4ogr7g6bmw.png" alt="Facebook Logo" class="h-7 w-7" /></a>
                <a href="https://zalo.me/0979072768" aria-label="Share on Zalo" class="text-gray-400 hover:text-blue-500 transition-colors"><img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/oiuvdbnx2i8xidl7c6ry.png" alt="Zalo Logo" class="h-7 w-7" /></a>
              </div>
            </div>
          </div>
        </article>

        <section v-if="relatedPosts && relatedPosts.length > 0" class="mt-12 md:mt-16">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Bài viết khác</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PostPreview v-for="related in relatedPosts" :key="related.id" :post="related" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useAsyncData, createError } from '#app';
import { ref, computed, onMounted } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import PostDetailContent from '~/components/posts/PostDetailContent.vue';
import PostPreview from '~/components/posts/PostPreview.vue';
import { register } from 'swiper/element/bundle';

onMounted(() => {
  register();
});

const extractText = (html) => {
  if (!html || process.server) return '';
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  } catch (e) {
    return '';
  }
};

const config = useRuntimeConfig();
const route = useRoute();
const postId = route.params.id;

const { data: post, pending: postPending, error: postError } = await useAsyncData(
  `public-post-${postId}`,
  async () => {
    try {
      const fetchedPost = await $fetch(`${config.public.apiBase}/posts/${postId}`);
      if (!fetchedPost) {
        throw createError({ statusCode: 404, statusMessage: 'Bài viết không tồn tại.', fatal: true });
      }
      return fetchedPost;
    } catch (err) {
      if (err.statusCode === 404) {
        throw createError({ statusCode: 404, statusMessage: 'Bài viết không tồn tại.', fatal: true });
      }
      throw createError({ statusCode: 500, statusMessage: err.data?.message || 'Không thể tải bài viết.', fatal: true });
    }
  },
  { default: () => null }
);

const { data: relatedPosts, pending: relatedPostsPending, error: relatedPostsError } = await useAsyncData(
  `related-posts-public-${postId}`,
  async () => {
    try {
      const posts = await $fetch(`${config.public.apiBase}/posts`, {
        query: {
          limit: 2,
          excludeId: postId,
        },
      });
      return Array.isArray(posts) ? posts : [];
    } catch (err) {
      return [];
    }
  },
  { default: () => [], server: false }
);

useHead(() => {
  const postTitle = post.value?.title ?? 'Bài viết';
  const description = post.value?.content ? extractText(post.value.content).substring(0, 155) + '...' : 'Chi tiết bài viết từ Cây Giống Tuấn Anh.';
  const imageUrl = post.value?.images?.[0]?.url ?? '/default-og-image.jpg';

  return {
    title: `${postTitle} - Tin tức & Kinh nghiệm`,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: `${postTitle} - Tin tức & Kinh nghiệm` },
      { property: 'og:description', content: description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: `${config.public.apiBase}/posts/${postId}` },
      { property: 'og:type', content: 'article' },
      { property: 'article:published_time', content: post.value?.createdAt },
      { property: 'article:modified_time', content: post.value?.updatedAt },
    ],
  };
});

</script>

<style>
.post-image-swiper {
  --swiper-theme-color: #10B981;
  --swiper-navigation-color: #ffffff;
  --swiper-navigation-size: 28px;
  --swiper-pagination-color: var(--swiper-theme-color);
  --swiper-pagination-bullet-inactive-color: #ffffff;
  --swiper-pagination-bullet-inactive-opacity: 0.4;
}
.post-image-swiper::part(button-prev),
.post-image-swiper::part(button-next) {
  background-color: rgba(0, 0, 0, 0.25);
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
.post-image-swiper::part(button-prev):hover,
.post-image-swiper::part(button-next):hover {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
