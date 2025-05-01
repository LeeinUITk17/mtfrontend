<template>
    <div class="flex min-h-screen bg-gray-100">
        <aside class="w-64 bg-gray-800 text-white hidden md:block flex-shrink-0">
            <AdminSidebar />
        </aside>
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="bg-white shadow-md">
                <AdminHeader />
            </header>
            <main class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 bg-gray-100">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
</style>
