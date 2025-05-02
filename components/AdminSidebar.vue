<template>
    <div class="p-4">
        <NuxtLink to="/admin" class="flex items-center hover:opacity-90 transition-opacity space-x-2 mb-4 md:space-x-3">
                <img
                    src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746146995/gpg18t1hvlrlvww9sw9j.png"
                    alt="Cây Giống Tuấn Anh Logo"
                    class="h-9 w-auto md:h-11 rounded-full shadow-sm"
                >
                <span class="text-xl md:text-2xl lg:text-3xl font-bold text-green-700">
                    ADMIN
                </span>
            </NuxtLink>

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
