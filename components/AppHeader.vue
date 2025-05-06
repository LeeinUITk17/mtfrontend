<template>
    <header class="bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white py-4 shadow-md">
        <nav class="container mx-auto px-4 flex items-center justify-between">
            <NuxtLink to="/" class="flex items-center hover:opacity-90 transition-opacity space-x-2 md:space-x-3">
                <img
                    src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746146995/gpg18t1hvlrlvww9sw9j.png"
                    alt="Cây Giống Tuấn Anh Logo"
                    class="h-9 w-auto md:h-11 rounded-full shadow-sm"
                >
                <span class="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                    Cây Giống Tuấn Anh
                </span>
            </NuxtLink>

            <div class="flex items-center">
                <button
                    @click="toggleMenu"
                    class="md:hidden text-green-700 hover:text-green-900 focus:outline-none p-2"
                    aria-label="Toggle navigation menu"
                >
                    <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <ul class="hidden md:flex items-center space-x-6 text-lg font-semibold">
                    <li class="border-2 p-1 border-green-300 rounded-xl"><HeaderItem title="Trang chủ" link="/" :active-link="route.path" /></li>
                    <li class="border-2 p-1 border-green-300 rounded-xl"><HeaderItem title="Cây giống" link="/plants" :active-link="route.path" /></li>
                    <li class="border-2 p-1 border-green-300 rounded-xl"><HeaderItem title="Bài viết" link="/posts" :active-link="route.path" /></li>
                    <li class="border-2 p-1 border-green-300 rounded-xl"><HeaderItem title="Hình ảnh " link="/gallery" :active-link="route.path" /></li>
                    <li class="border-2 p-1 border-green-300 rounded-xl"><HeaderItem title="Liên hệ" link="/contact" :active-link="route.path" /></li>
                    <!-- <li v-if="isAuthenticated">
                        <NuxtLink
                            to="/admin"
                            :class="{'text-green-600 font-bold': route.path === '/admin' || route.path.startsWith('/admin/')}"
                            class="hover:text-green-600 transition-colors"
                        >
                            Admin
                        </NuxtLink>
                    </li>
                    <li v-else>
                        <NuxtLink
                            to="/login"
                            :class="{'text-green-600 font-bold': route.path === '/login' || route.path.startsWith('/auth/')}"
                            class="inline-block bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors font-semibold text-sm"
                        >
                            Login
                        </NuxtLink>
                    </li> -->
                </ul>
            </div>
        </nav>

        <transition name="slide-down">
            <ul v-if="isMenuOpen" class="md:hidden w-full bg-green-700 text-white p-4 mt-2 space-y-3 shadow-lg border-t border-green-600 absolute top-full left-0 z-20">
                <li><HeaderItem title="Plants" link="/plants" :active-link="route.path" is-mobile @click="closeMenu" /></li>
                <li><HeaderItem title="Posts" link="/posts" :active-link="route.path" is-mobile @click="closeMenu" /></li>
                <li><HeaderItem title="Gallery" link="/gallery" :active-link="route.path" is-mobile @click="closeMenu" /></li>
                <li><HeaderItem title="Contact" link="/contact" :active-link="route.path" is-mobile @click="closeMenu" /></li>
                <!-- <li v-if="isAuthenticated">
                    <NuxtLink
                        @click="closeMenu"
                        to="/admin"
                        :class="{'bg-green-600': route.path === '/admin' || route.path.startsWith('/admin/')}"
                        class="block p-2 rounded hover:bg-green-600 transition-colors text-white"
                    >
                        Admin
                    </NuxtLink>
                </li>
                <li v-else>
                    <NuxtLink
                        @click="closeMenu"
                        to="/login"
                        :class="{'bg-green-600': route.path === '/login' || route.path.startsWith('/auth/')}"
                        class="block bg-green-600 text-white text-center p-2 rounded hover:bg-green-700 transition-colors font-semibold"
                    >
                        Login
                    </NuxtLink>
                </li> -->
            </ul>
        </transition>
    </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import HeaderItem from '~/components/common/HeaderItem.vue';

const isMenuOpen = ref(false);
const route = useRoute();
const { isAuthenticated } = useAuth();

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
    isMenuOpen.value = false;
};

watch(() => route.fullPath, () => {
    if (process.client && isMenuOpen.value && window.innerWidth < 768) {
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

header {
    position: relative;
    z-index: 20;
}
</style>
