<template>
    <div class="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col space-y-3">
        <a
            href="https://zalo.me/0979072768"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-icon-button hover:bg-blue-100 transform hover:scale-110 transition-transform"
            aria-label="Liên hệ qua Zalo"
            title="Liên hệ qua Zalo"
        >
            <img
                src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/oiuvdbnx2i8xidl7c6ry.png"
                alt="Zalo Logo"
                class="contact-icon-image"
            />
        </a>
        <a
            href="https://www.facebook.com/caosugiongtuananh"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-icon-button hover:bg-blue-100 transform hover:scale-110 transition-transform"
            aria-label="Theo dõi trên Facebook"
            title="Theo dõi trên Facebook"
        >
            <img
                src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746092376/qgx8ou1dbf4ogr7g6bmw.png"
                alt="Facebook Logo"
                class="contact-icon-image"
            />
        </a>
        <a
            href="tel:0979072768"
            class="contact-icon-button phone-button hover:bg-green-100 transform hover:scale-110 transition-transform"
            aria-label="Gọi điện thoại"
            title="Gọi điện thoại"
        >
            <img
                src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746094548/vmgyzg8cng98s8qpyjbl.png"
                alt="Gọi điện thoại"
                class="contact-icon-image"
            />
        </a>
        <a
            href="https://www.google.com/maps/place/Nh%C3%A0+v%C4%83n+h%C3%B3a+khu+ph%E1%BB%91+4/@11.428879,106.3867057,11z/data=!4m9!1m2!2m1!1zS2h1IHBo4buRIDA3LCBIdXnhu4duIENoxqFuIFRow6BuaCwgVOG7iW5oIELDrG5oIFBoxrDhu5tj!3m5!1s0x3174ad003c2c9b23:0x4857ff7ec4e5e056!8m2!3d11.4289184!4d106.5587397!16s%2Fg%2F11xcnjcdlp?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-icon-button hover:bg-red-100 transform hover:scale-110 transition-transform"
            aria-label="Xem vị trí trên bản đồ"
            title="Xem vị trí trên bản đồ"
        >
            <img
                src="https://res.cloudinary.com/dbonwxmgl/image/upload/v1746093764/q8g8qpomxzkrz6wbr7h1.png"
                alt="Google Maps Logo"
                class="contact-icon-image"
            />
        </a>
        <button
            @click="scrollToTop"
            class="contact-icon-button hover:bg-gray-200 transform hover:scale-110 transition-transform"
            aria-label="Lên đầu trang"
            title="Lên đầu trang"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="contact-icon-image text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 11l7-7 7 7M5 19l7-7 7 7"
                />
            </svg>
        </button>
    </div>
</template>

<script setup>
const scrollToTop = () => {
    if (process.client) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
};
</script>

<style scoped>
.contact-icon-button {
    @apply w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center transition-colors duration-200;
    @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500;
}

.contact-icon-image {
    @apply h-6 w-6;
    object-fit: contain;
}

@keyframes ring {
    0% { transform: rotate(0) scale(1); }
    10% { transform: rotate(14deg) scale(1.1); }
    20% { transform: rotate(-10deg) scale(1.1); }
    30% { transform: rotate(14deg) scale(1.1); }
    40% { transform: rotate(-10deg) scale(1.1); }
    50% { transform: rotate(0) scale(1); }
    100% { transform: rotate(0) scale(1); }
}

.phone-button {
    animation: ring 5s ease-in-out infinite;
}
</style>
