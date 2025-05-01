<template>
    <header class="bg-primary-light text-white py-3 shadow-md">
        <nav class="container mx-auto px-4 flex items-center justify-between">
            <NuxtLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
                <img
                    src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746003119/ufe8eljibxt73lqwc2ut.png"
                    alt="Plant Shop Logo"
                    class="h-8 w-auto md:h-10"
                >
                <span to="/" class="text-2xl font-bold hover:opacity-80 transition-opacity ml-2">
                    Plant Shop
                </span>
            </NuxtLink>
            <div class="flex items-center">
                <button
                    @click="toggleMenu"
                    class="md:hidden text-white focus:outline-none p-2"
                    aria-label="Toggle navigation menu"
                >
                    <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <ul class="hidden md:flex items-center space-x-6 text-xl font-semibold">
                    <li><NuxtLink to="/plants" class="hover:text-opacity-80 transition-colors">Plants</NuxtLink></li>
                    <li><NuxtLink to="/posts" class="hover:text-opacity-80 transition-colors">Posts</NuxtLink></li>
                    <li><NuxtLink to="/testimonials" class="hover:text-opacity-80 transition-colors">Testimonials</NuxtLink></li>
                    <li><NuxtLink to="/gallery" class="hover:text-opacity-80 transition-colors">Gallery</NuxtLink></li>
                </ul>
            </div>
        </nav>
        <transition name="slide-down">
            <ul v-if="isMenuOpen" class="md:hidden bg-primary text-white p-4 mt-2 space-y-3 shadow-lg border-t border-green-600">
                <li><NuxtLink @click="closeMenu" to="/plants" class="block p-2 rounded hover:bg-primary-dark transition-colors">Plants</NuxtLink></li>
                <li><NuxtLink @click="closeMenu" to="/posts" class="block p-2 rounded hover:bg-primary-dark transition-colors">Posts</NuxtLink></li>
                <li><NuxtLink @click="closeMenu" to="/testimonials" class="block p-2 rounded hover:bg-primary-dark transition-colors">Testimonials</NuxtLink></li>
                <li><NuxtLink @click="closeMenu" to="/gallery" class="block p-2 rounded hover:bg-primary-dark transition-colors">Gallery</NuxtLink></li>
                <li>
                    <NuxtLink
                        @click="closeMenu"
                        to="/auth/login"
                        class="block bg-primary-light text-white text-center p-2 rounded hover:bg-primary-dark transition-colors font-semibold"
                    >
                        Login
                    </NuxtLink>
                </li>
            </ul>
        </transition>
    </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
    isMenuOpen.value = false;
};

watch(useRoute(), () => {
    if (isMenuOpen.value && window.innerWidth < 768) {
        closeMenu();
    }
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease-in-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}
</style>
