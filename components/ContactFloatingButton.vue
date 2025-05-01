<template>
    <div class="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50" ref="containerRef">
        <Transition name="slide-up">
            <div
                v-if="isPopupOpen"
                class="absolute bottom-full right-0 mb-4 p-3 bg-white rounded-lg shadow-xl flex flex-col items-end space-y-3 origin-bottom-right"
            >
                <a
                    href="https://zalo.me/0356356497"
                    target="_blank"
                    class="w-10 h-10 bg-white text-white rounded-full shadow flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                    aria-label="Contact via Zalo"
                    @click="closePopup"
                >
                    <img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/oiuvdbnx2i8xidl7c6ry.png" alt="Zalo Logo" class="h-7 w-7" />
                </a>
                <a
                    href="https://www.facebook.com/yourfanpage"
                    target="_blank"
                    class="w-10 h-10 bg-white text-white rounded-full shadow flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                    aria-label="Follow on Facebook"
                    @click="closePopup"
                >
                    <img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/qgx8ou1dbf4ogr7g6bmw.png" alt="Facebook Logo" class="h-7 w-7" />
                </a>
                <a
                    href="https://www.youtube.com/yourchannel"
                    target="_blank"
                    class="w-10 h-10 bg-white text-white rounded-full shadow flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
                    aria-label="Follow on YouTube"
                    @click="closePopup"
                >
                    <img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/skrccs2d36g5hmixyfrw.png" alt="YouTube Logo" class="h-7 w-7" />
                </a>
                <a
                    href="https://www.google.com/maps/place/Nh%C3%A0+Ga+B%E1%BA%BFn+Xe+Su%E1%BB%91i+Ti%C3%AAn/@10.8700062,106.7618543,13z/data=!4m22!1m15!4m14!1m6!1m2!1s0x317527587e9ad5bf:0xafa66f9c8be3c91!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTSwgSMOgbiBUaHV5w6puLCBraHUgcGjhu5EgNiBQLCBMaW5oIFRydW5nLCBUaOG7pyDEkOG7qWMsIEjhu5MgQ2jDrSBNaW5o!2m2!1d106.8030541!2d10.8700089!1m6!1m2!1s0x317527587e9ad5bf:0xafa66f9c8be3c91!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTSwgSMOgbiBUaHV5w6puLCBraHUgcGjhu5EgNiBQLCBUaOG7pyDEkOG7qWMsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!2m2!1d106.8030541!2d10.8700089!3m5!1s0x3174d8ad97e3301f:0x86f901230f1bcc0f!8m2!3d10.8795175!4d106.8141018!16s%2Fg%2F11wx9ykt1w?entry=ttu&g_ep=EgoyMDI1MDQyOC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    class="w-10 h-10 bg-white text-white rounded-full shadow flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                    aria-label="View store location on map"
                    @click="closePopup"
                >
                <img src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746093764/q8g8qpomxzkrz6wbr7h1.png" alt="Google MapMap Logo" class="h-7 w-7" />
                </a>
            </div>
        </Transition>
        <button
            @click.stop="togglePopup"
            class="w-14 h-14 md:w-16 md:h-16 bg-white text-white rounded-full shadow-xl flex items-center justify-center hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
            aria-label="Open contact options"
        >
            <img v-if="!isPopupOpen" src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746094166/l5l3fe4fiktlxae700iw.png" alt="Contact Icon" class="h-7 w-7 md:h-8 md:w-8" />
            <img v-else src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746094548/vmgyzg8cng98s8qpyjbl.png" alt="Contact Icon" class="h-7 w-7 md:h-8 md:w-8" />
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isPopupOpen = ref(false);
const containerRef = ref(null);

const togglePopup = () => {
    isPopupOpen.value = !isPopupOpen.value;
};

const closePopup = () => {
    isPopupOpen.value = false;
};

const handleOutsideClick = (event) => {
    if (isPopupOpen.value && containerRef.value && !containerRef.value.contains(event.target)) {
        closePopup();
    }
};

onMounted(() => {
    document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>
