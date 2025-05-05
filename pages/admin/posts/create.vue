<template>
    <div class="py-6 px-4 sm:px-6 lg:px-8">
     
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 bg-gray-50">
            <h2 class="text-lg font-medium text-gray-800">Thông tin bài viết</h2>
            <p class="mt-1 text-sm text-gray-500">Nhập đầy đủ thông tin bên dưới</p>
        </div>
        
        <div class="p-6 sm:p-8">
            <PostForm />
        </div>
        
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">
            Lưu ý: Các trường có dấu <span class="text-red-500">*</span> là bắt buộc
        </div>
        </div>
    </div>
</template>

<script setup>
import PostForm from '~/components/posts/PostForm.vue';
definePageMeta({ layout: 'admin', middleware: ['auth'] });
</script>
