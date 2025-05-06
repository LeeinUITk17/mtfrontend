<template>
    <div class="bg-gray-100 rounded-lg p-6 text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Về tác giả</h3>
        <img
            :src='https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg'
            :alt="'Avatar của ' + (user.fullName || user.username)"
            class="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-md"
        />
        <h4 class="text-lg font-semibold text-gray-700 mt-4">
            {{ user.fullName || user.username || 'Ẩn danh' }}
        </h4>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface User {
    id: string;
    username: string;
    fullName?: string | null;
    avatar?: string | null;
    createdAt?: string;
}

const props = defineProps<{
    user: User;
}>();
</script>

<style scoped>
</style>
