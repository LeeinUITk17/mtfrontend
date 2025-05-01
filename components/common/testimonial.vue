<template>
    <div class="relative w-full h-auto border-4 border-white rounded-lg  text-white py-12">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-white mt-2">What they're saying about us</h2>
        </div>
        <div class="flex w-full overflow-hidden relative">
            <div
                class="flex w-full transition-transform duration-1000 ease-in-out"
                :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
            >
                <div
                    v-for="(testimonial, index) in testimonials"
                    :key="index"
                    class="w-full min-w-full flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8 px-4 md:px-8"
                >
                    <div class="flex-shrink-0">
                        <img
                            :src="testimonial.image"
                            alt="Testimonial Highlight"
                            class="w-64 h-64 md:w-80 md:h-80 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                    <div class="bg-green-900 text-white p-6 md:p-8 rounded-lg shadow-lg max-w-md lg:max-w-lg">
                        <p class="text-3xl md:text-4xl font-bold text-white mb-4">“</p>
                        <p class="text-base md:text-lg italic text-gray-300 mb-4 leading-relaxed">
                            {{ testimonial.message }}
                        </p>
                        <p class="text-3xl md:text-4xl font-bold text-white mt-4 text-right">”</p>
                        <div class="flex items-center mt-6">
                            <img
                                :src="testimonial.avatar"
                                alt="Avatar"
                                class="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-gray-700 shadow-lg object-cover"
                            />
                            <div class="ml-4">
                                <h4 class="font-semibold text-base md:text-lg text-white">{{ testimonial.name }}</h4>
                                <p class="text-xs md:text-sm text-gray-300">{{ testimonial.role }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            <button
                v-for="(testimonial, index) in testimonials"
                :key="index"
                @click="goToSlide(index)"
                :class="{
                    'bg-green-500 w-3 h-3': activeIndex === index,
                    'bg-gray-500 w-2.5 h-2.5 hover:bg-green-500': activeIndex !== index
                }"
                class="rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="Go to testimonial slide"
            ></button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const testimonials = ref([
    {
        name: "Kaido",
        message: "The plants from this shop are amazing! They transformed my garden into a paradise.",
        role: "Kaidou of the Beasts",
        avatar: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1719120844/gdfgqtutjv2lteatix5d.jpg",
        image:  "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg",
    },
    {
        name: "Monkey D. Garp",
        message: "The plants here are top-notch! They make my garden look like a piece of art.",
        role: "Marine Vice Admiral",
        avatar: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1718817087/z4nt0sdjlvhi3an5nqzz.jpg",
        image:  "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/xtdthqbilmkbzdzrnluy.jpg",
    },
    {
        name: "Roronoa Zoro",
        message: "The plants I bought here are thriving beautifully! My home feels so much more alive and vibrant.",
        role: "Pirate Hunter",
        avatar: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1718873734/zkzfapfwda9uglxrlqnr.jpg",
        image: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077762/vmtavyqywh98r2tikoiv.jpg",
    },
]);

const activeIndex = ref(0);
let autoSlide: ReturnType<typeof setInterval> | null = null;

const startAutoSlide = () => {
    if (autoSlide) clearInterval(autoSlide);
    if (testimonials.value.length > 1) {
        autoSlide = setInterval(() => {
            nextSlide();
        }, 5000);
    }
};

const nextSlide = () => {
    if (!testimonials.value || testimonials.value.length === 0) return;
    activeIndex.value = (activeIndex.value + 1) % testimonials.value.length;
};

const goToSlide = (index: number) => {
    activeIndex.value = index;
    if (testimonials.value.length > 1) {
        if (autoSlide) clearInterval(autoSlide);
        startAutoSlide();
    }
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
    transition: all 0.3s ease;
}
</style>
