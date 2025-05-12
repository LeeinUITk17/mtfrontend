<template>
  <div class="bg-gray-50 py-12 md:py-16">
    <div class="container mx-auto px-4">
      <nav aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2">
          <li class="inline-flex items-center">
            <NuxtLink to="/posts" class="inline-flex items-center text-sm text-gray-600 hover:text-primary group" aria-label="Back to posts list">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại danh sách bài viết
            </NuxtLink>
          </li>
        </ol>
      </nav>

      <main id="main-content">
        <div v-if="postPending" class="text-center py-16" aria-live="polite">
          <LoadingSpinner class="w-12 h-12 text-green-600 mx-auto" />
          <p class="mt-4 text-gray-500">Đang tải bài viết...</p>
        </div>

        <div v-else-if="postError" class="text-center text-red-500 py-16 bg-red-50 rounded-lg border border-red-200" role="alert">
          <h2 class="text-lg font-semibold">Lỗi khi tải bài viết</h2>
          <p class="mt-2">{{ postError.message || 'Không thể kết nối đến máy chủ.' }}</p>
        </div>

        <div v-else-if="!post" class="text-center text-gray-600 py-16" aria-live="polite">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 class="mt-4 text-xl font-semibold">Không tìm thấy bài viết.</h1>
          <p class="mt-2 text-gray-500">Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        </div>

        <article v-else class="max-w-4xl mx-auto" itemscope itemtype="https://schema.org/BlogPosting">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <figure v-if="post.images && post.images.length > 0" class="relative border-b border-gray-200">
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
                  <NuxtImg 
                    :src="image.url" 
                    :alt="`${post.title} - ảnh ${index + 1}`" 
                    class="w-full h-64 md:h-96 object-cover" 
                    sizes="sm:100vw md:80vw lg:768px" 
                    quality="85" 
                    loading="lazy"
                    itemprop="image"
                  />
                </swiper-slide>
              </swiper-container>
              <NuxtImg 
                v-else 
                :src="post.images[0].url" 
                :alt="post.title" 
                class="w-full h-64 md:h-96 object-cover" 
                sizes="sm:100vw md:80vw lg:768px" 
                quality="85" 
                loading="lazy"
                itemprop="image"
              />
              <figcaption class="sr-only">Hình ảnh minh họa cho bài viết {{ post.title }}</figcaption>
            </figure>

            <div class="p-6 md:p-10 lg:p-12">
              <header>
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2" itemprop="headline">{{ post.title }}</h1>
                <div class="flex items-center text-sm text-gray-500 mb-6">
                  <span class="mx-2">•</span>
                  <span itemprop="author" itemscope itemtype="https://schema.org/Person">
                    <span itemprop="name">Vườn Ươm Tuấn Anh</span>
                  </span>
                </div>
              </header>

              <PostDetailContent :post="post" />

              <footer class="mt-8 pt-6 border-t border-gray-100">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p class="text-sm font-medium text-gray-600 mb-2">Chia sẻ bài viết:</p>
                    <div class="flex space-x-3">
                      <a href="https://www.facebook.com/caosugiongtuananh" aria-label="Chia sẻ lên Facebook" class="text-gray-400 hover:text-blue-600 transition-colors">
                        <img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/qgx8ou1dbf4ogr7g6bmw.png" alt="Facebook Logo" class="h-7 w-7" width="28" height="28" loading="lazy" />
                      </a>
                      <a href="https://zalo.me/0979072768" aria-label="Chia sẻ qua Zalo" class="text-gray-400 hover:text-blue-500 transition-colors">
                        <img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/oiuvdbnx2i8xidl7c6ry.png" alt="Zalo Logo" class="h-7 w-7" width="28" height="28" loading="lazy" />
                      </a>
                    </div>
                  </div>
                  <NuxtLink to="/posts" class="text-sm text-gray-600 hover:text-primary inline-flex items-center">
                    Xem thêm bài viết khác
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </NuxtLink>
                </div>
              </footer>
            </div>
          </div>
        </article>

        <aside v-if="relatedPosts && relatedPosts.length > 0" class="mt-12 md:mt-16" aria-label="Bài viết liên quan">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Bài viết liên quan</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PostPreview v-for="related in relatedPosts" :key="related.slug" :post="related" />
          </div>
        </aside>
      </main>
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
const postSlug = route.params.slug;

const { data: post, pending: postPending, error: postError } = await useAsyncData(
  `public-post-${postSlug}`,
  async () => {
    try {
      const fetchedPost = await $fetch(`${config.public.apiBase}/posts/slug/${postSlug}`);
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
  `related-posts-public-${postSlug}`,
  async () => {
    try {
      const posts = await $fetch(`${config.public.apiBase}/posts`, {
        query: {
          limit: 2,
          excludeId: postSlug,
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
  const postTitle = post.value?.title ?? 'Bài viết về cây cao su giống';
  const description = post.value?.content ? extractText(post.value.content).substring(0, 155) + '...' : 'Kinh nghiệm trồng và chăm sóc cây cao su giống từ vườn ươm Tuấn Anh Bình Phước';
  const imageUrl = post.value?.images?.[0]?.url ?? 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746146995/gpg18t1hvlrlvww9sw9j.png';

  const baseKeywords = [
    'cây cao su giống',
    'kỹ thuật trồng cao su',
    'chăm sóc cây cao su',
    'kinh nghiệm trồng cao su',
    'bệnh cây cao su',
    'giống cao su năng suất cao',
    'vườn ươm cao su Bình Phước'
  ];

  const contentKeywords = post.value?.content || [];

  return {
    title: `${postTitle} | Kinh Nghiệm Trồng Cao Su - Tuấn Anh`,
    meta: [
      { 
        name: 'description', 
        content: description 
      },
      { 
        name: 'keywords', 
        content: [...new Set([...baseKeywords, ...contentKeywords])].join(', ') 
      },
      { 
        property: 'og:title', 
        content: `${postTitle} | Vườn Ươm Cao Su Tuấn Anh` 
      },
      { 
        property: 'og:description', 
        content: description 
      },
      { 
        property: 'og:image', 
        content: imageUrl 
      },
      { 
        property: 'og:url', 
        content: `${config.public.baseUrl}/posts/slug/${postSlug}` 
      },
      { 
        property: 'og:type', 
        content: 'article' 
      },
      { 
        property: 'article:published_time', 
        content: post.value?.createdAt 
      },
      { 
        property: 'article:modified_time', 
        content: post.value?.updatedAt 
      },
      { 
        property: 'article:author', 
        content: 'Vườn Ươm Tuấn Anh' 
      },
      { 
        name: 'twitter:card', 
        content: 'summary_large_image' 
      },
      { 
        name: 'twitter:title', 
        content: `${postTitle} | Kinh Nghiệm Trồng Cao Su` 
      },
      { 
        name: 'twitter:description', 
        content: description 
      },
      { 
        name: 'twitter:image', 
        content: imageUrl 
      },
    ],
    link: [
      { 
        rel: 'canonical', 
        href: `${config.public.baseUrl}/posts/slug/${postSlug}` 
      }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": postTitle,
          "description": description,
          "image": imageUrl,
          "author": {
            "@type": "Organization",
            "name": "Vườn Ươm Cao Su Tuấn Anh",
            "url": config.public.baseUrl
          },
          "publisher": {
            "@type": "Organization",
            "name": "Cây Giống Tuấn Anh",
            "logo": {
              "@type": "ImageObject",
              "url": "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746146995/gpg18t1hvlrlvww9sw9j.png"
            }
          },
          "datePublished": post.value?.createdAt,
          "dateModified": post.value?.updatedAt,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${config.public.baseUrl}/posts/slug/${postSlug}`
          }
        })
      }
    ]
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
