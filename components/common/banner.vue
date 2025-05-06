<template>
    <div class="relative w-full h-96 overflow-hidden">
      <div
        class="flex w-full h-full transition-transform duration-1000 ease-in-out"
        :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
      >
        <div v-for="(slide, index) in slides" :key="index" class="w-full flex-shrink-0 min-w-full">
          <div
            class="bg-cover bg-center h-full w-full"
            :style="{ backgroundImage: `url(${slide.image})` }"
          >
            <div class="flex items-center justify-center h-full bg-black bg-opacity-50">
              <div class="text-center text-white max-w-lg px-4">
                <h1 class="text-4xl font-bold mb-4">{{ slide.title }}</h1>
                <p class="text-lg mb-6">{{ slide.description }}</p>
                <nuxt-link
                  :to="slide.link"
                  class="bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
                >
                  {{ slide.buttonText }}
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          @click="goToSlide(index)"
          :class="{
            'bg-white': activeIndex === index,
            'bg-gray-400': activeIndex !== index
          }"
          class="w-3 h-3 rounded-full transition-colors duration-300"
        ></button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { NuxtLink } from '#components';
  
  interface Slide {
    title: string;
    description: string;
    buttonText: string;
    link: string;
    image: string;
  }
  
  const slides: Slide[] = [
  {
    title: "Chào mừng đến với Vườn Cây Giống Xanh Tươi",
    description: "Khám phá các loại cây giống chất lượng cho khu vườn và nông trại của bạn.",
    buttonText: "Xem Cây Giống",
    link: "/plants",
    image: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077762/gryyvyt2icj8pasisd80.jpg",
  },
  {
    title: "Chia Sẻ Kinh Nghiệm Trồng Cây",
    description: "Học cách chăm sóc và phát triển cây giống hiệu quả từ những người làm vườn chuyên nghiệp.",
    buttonText: "Đọc Bài Viết",
    link: "/posts",
    image: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077766/tic4dil5kzefok4conki.jpg",
  },
  {
    title: "Tham Quan Vườn Cây Giống Của Chúng Tôi",
    description: "Xem những hình ảnh thực tế từ vườn cây và khách hàng của chúng tôi.",
    buttonText: "Xem Thư Viện Ảnh",
    link: "/gallery",
    image: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077762/f4uz4lqifowwsup2j4nt.jpg",
  },
  ];

  
  const activeIndex = ref(0);
  let autoSlide: ReturnType<typeof setInterval> | null = null;
  
  const startAutoSlide = () => {
    if (autoSlide) clearInterval(autoSlide);
    autoSlide = setInterval(() => {
      nextSlide();
    }, 10000);
  };
  
  const nextSlide = () => {
    activeIndex.value = (activeIndex.value + 1) % slides.length;
  };
  
  const goToSlide = (index: number) => {
    activeIndex.value = index;
    if (autoSlide) clearInterval(autoSlide);
    startAutoSlide();
  };
  
  onMounted(() => {
    startAutoSlide();
  });
  
  onBeforeUnmount(() => {
    if (autoSlide) clearInterval(autoSlide);
  });
  </script>
  
  <style scoped>
  button {
    transition: background-color 0.3s ease;
  }
  </style>