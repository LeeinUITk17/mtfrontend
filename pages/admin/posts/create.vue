<template>
    <div class="py-4">
        <div class="bg-white rounded-lg shadow p-6">
            <PostForm />
        </div>
    </div>
</template>

<script setup>
import PostForm from '~/components/posts/PostForm.vue';
definePageMeta({ layout: 'admin', middleware: ['auth'] });
</script>