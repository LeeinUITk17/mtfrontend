<template>
    <div class="flex items-center justify-center h-screen bg-green-50">
        <div class="flex flex-col items-center justify-center p-8 rounded-lg bg-white shadow-xl">
            <svg class="w-16 h-16 text-green-600 animate-loading-plant" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.44 11.33l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66z" />
            </svg>
            <p class="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
@keyframes loading-plant {
    0% {
        transform: scale(1) rotate(0deg);
        opacity: 0.8;
    }
    50% {
        transform: scale(1.05) rotate(3deg);
        opacity: 1;
    }
    100% {
        transform: scale(1) rotate(0deg);
        opacity: 0.8;
    }
}

.animate-loading-plant {
    animation: loading-plant 1.8s ease-in-out infinite alternate;
    transform-origin: center bottom;
}
</style>
