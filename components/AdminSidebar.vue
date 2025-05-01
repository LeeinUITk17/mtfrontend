<template>
    <div class="p-4">
        <div class="text-2xl font-bold text-center mb-6 text-green-400">
            Admin Panel
        </div>

        <nav>
            <ul class="space-y-2">
                <li>
                    <NuxtLink
                        to="/admin"
                        class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        active-class="bg-gray-700"
                    >
                        <span class="mr-3">📊</span>
                        Dashboard
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink
                        to="/admin/plants"
                        class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        active-class="bg-gray-700"
                    >
                        <span class="mr-3">🌿</span>
                        Manage Plants
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink
                        to="/admin/posts"
                        class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        active-class="bg-gray-700"
                    >
                        <span class="mr-3">📝</span>
                        Manage Posts
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink
                        to="/admin/gallery"
                        class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        active-class="bg-gray-700"
                    >
                        <span class="mr-3">🖼️</span>
                        Manage Gallery
                    </NuxtLink>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
</script>

<style scoped>
</style>
