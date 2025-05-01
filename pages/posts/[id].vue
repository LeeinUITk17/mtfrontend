<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="postPending || relatedPostsPending" class="text-center py-12">
            <LoadingSpinner class="w-10 h-10 text-blue-600 mx-auto" />
            <p class="mt-4 text-gray-700">Đang tải chi tiết bài viết...</p>
        </div>

        <div v-else-if="postError || relatedPostsError" class="text-center text-red-500 py-12">
            <p>Lỗi khi tải dữ liệu: {{ postError?.message || relatedPostsError?.message }}</p>
            <p class="mt-2">Vui lòng thử lại sau.</p>
        </div>

        <div v-else-if="!post" class="text-center text-gray-600 py-12">
            <p class="text-xl font-semibold">Không tìm thấy bài viết này.</p>
            <p class="mt-2">Mã bài viết có thể không đúng hoặc bài viết không tồn tại.</p>
            <NuxtLink to="/posts" class="mt-4 inline-block text-blue-600 hover:underline">
              Quay lại danh sách bài viết
            </NuxtLink>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
                <div class="bg-white rounded-lg shadow-xl overflow-hidden p-6 md:p-8">
                    <PostDetailContent :post="post" />
                </div>
            </div>

            <aside class="md:col-span-1 space-y-8">
                <PostAuthorInfo :user="post.user" v-if="post.user" />
                <PostRelatedList :relatedPosts="relatedPosts" />
            </aside>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useAsyncData } from '#app';
import { ref } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';
import PostDetailContent from '~/components/posts/PostDetailContent.vue';
import PostAuthorInfo from '~/components/posts/PostAuthorInfo.vue';
import PostRelatedList from '~/components/posts/PostRelatedList.vue';

const samplePosts = [
    {
      id: 'p1',
      title: '5 Mẹo chăm sóc Monstera',
      content: '<p>Monstera là loại cây rất phổ biến... Dưới đây là một vài mẹo:</p><ol><li>Tưới nước thật đẫm khi lớp đất trên cùng khô.</li><li>Cung cấp ánh sáng gián tiếp rực rỡ.</li><li>Sử dụng hỗn hợp đất thoát nước tốt.</li><li>Lau lá thường xuyên.</li><li>Cân nhắc dùng cọc rêu để cây leo.</li></ol><p>Chúc bạn thành công!</p>',
      userId: 'user1-id',
      user: { id: 'user1-id', username: 'john_d', fullName: 'John Doe', avatar: 'https://via.placeholder.com/150?text=JD' },
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 15,
    },
    {
      id: 'p2',
      title: 'Cách tưới nước cho cây mọng nước',
      content: 'Cây mọng nước cần lượng nước vừa đủ, không quá nhiều, không quá ít. Chìa khóa là tưới đẫm và để đất khô hoàn toàn giữa các lần tưới. Khi nghi ngờ, thà tưới ít còn hơn tưới quá nhiều.',
      userId: 'user2-id',
      user: { id: 'user2-id', username: 'plant_lover', avatar: 'https://via.placeholder.com/150?text=PL' },
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 8,
    },
    {
      id: 'p3',
      title: 'Chọn chậu phù hợp',
      content: 'Kích thước và chất liệu rất quan trọng khi chọn chậu cho cây. Đảm bảo chậu có lỗ thoát nước tốt!',
      userId: 'user1-id',
      user: { id: 'user1-id', username: 'john_d', fullName: 'John Doe', avatar: 'https://via.placeholder.com/150?text=JD' },
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 5,
    },
    {
      id: 'p4',
      title: 'Sâu bệnh và bệnh hại phổ biến',
      content: 'Phát hiện và xử lý sâu bệnh sớm để bảo vệ cây của bạn.',
      userId: 'user2-id',
      user: { id: 'user2-id', username: 'plant_lover', avatar: 'https://via.placeholder.com/150?text=PL' },
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 3,
    },
    {
      id: 'p5',
      title: 'Nhân giống cây bằng lá',
      content: 'Một số loại cây có thể nhân giống dễ dàng chỉ từ một chiếc lá.',
      userId: 'user1-id',
      user: { id: 'user1-id', username: 'john_d', fullName: 'John Doe', avatar: 'https://via.placeholder.com/150?text=JD' },
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 10,
    },
    {
      id: 'p6',
      title: 'Cách tạo terrarium',
      content: 'Terrarium là một hệ sinh thái nhỏ đẹp mắt.',
      userId: 'user3-id',
      user: { id: 'user3-id', username: 'terra_master', fullName: 'Alice Wonderland', avatar: 'https://via.placeholder.com/150?text=AW' },
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 7,
    },
];

const route = useRoute();
const postId = route.params.id;

const { data: post, pending: postPending, error: postError } = await useAsyncData(
  `post-${postId}`,
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const foundPost = samplePosts.find(p => p.id === postId);
    return foundPost;
  }
);

const { data: relatedPosts, pending: relatedPostsPending, error: relatedPostsError } = await useAsyncData(
  `related-posts-${postId}`,
  async () => {
     if (!post.value?.userId) {
        return [];
     }
    await new Promise(resolve => setTimeout(resolve, 600));
    const related = samplePosts
      .filter(p => p.userId === post.value.userId && p.id !== postId)
      .slice(0, 5);
    return related;
  },
  {
     watch: [post],
     immediate: !!post.value?.userId
  }
);

useHead(() => {
  const postTitle = post.value ? post.value.title : 'Bài viết';
  const description = post.value ? post.value.content?.substring(0, 150) + '...' : 'Xem chi tiết bài viết về cây cảnh.';
  return {
    title: `${postTitle} - Diễn đàn Cây cảnh`,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: `${postTitle} - Diễn đàn Cây cảnh` },
      { property: 'og:description', content: description },
      { property: 'og:url', content: `http://localhost:8080/posts/${postId}` },
    ]
  };
});
</script>

<style scoped>
</style>
