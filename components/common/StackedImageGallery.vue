<template>
    <div class="relative w-full aspect-[4/3] md:aspect-[16/9] max-w-xl mx-auto" ref="galleryContainerRef">
        <div
            v-for="(image, index) in images"
            :key="image.id || index"
            class="absolute inset-0 w-full h-full rounded-lg shadow-xl overflow-hidden transition-all duration-700 ease-out transform border-4 border-white"
            :style="calculateCardStyle(index)"
            :aria-label="image.alt || `Hình ảnh ${index + 1}`"
            @click="setActiveAndStopAutoplay(index)"
            @mouseenter="pauseAutoplay"
            @mouseleave="resumeAutoplay"
        >
            <NuxtImg
                :src="image.src"
                :alt="image.alt || `Hình ảnh ${index + 1}`"
                class="w-full h-full object-cover"
                sizes="sm:100vw md:50vw lg:500px"
                quality="85"
                loading="lazy"
                draggable="false"
            />
        </div>
        <div v-if="!images || images.length === 0" class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
            Không có ảnh để hiển thị
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
    images: {
        type: Array,
        required: true,
        default: () => [],
    },
    maxVisibleBehind: {
        type: Number,
        default: 2,
    },
    scaleFactor: {
        type: Number,
        default: 0.9,
    },
    offsetYFactor: {
        type: Number,
        default: 4,
    },
    offsetXFactor: {
        type: Number,
        default: 2,
    },
    rotateFactor: {
        type: Number,
        default: 3,
    },
    autoplayInterval: {
        type: Number,
        default: 2500,
    },
});

const activeIndex = ref(0);
let autoplayTimer = null;
const galleryContainerRef = ref(null);
const isMouseOverGallery = ref(false);

const calculateCardStyle = (index) => {
    if (!props.images || props.images.length === 0) return {};

    let zIndex = props.images.length - Math.abs(index - activeIndex.value);
    let scale = 1;
    let translateY = 0;
    let translateX = 0;
    let opacity = 0;
    let rotate = 0;

    let relativeIndex;
    if (index === activeIndex.value) {
        relativeIndex = 0;
    } else if (index > activeIndex.value) {
        relativeIndex = index - activeIndex.value;
    } else {
        relativeIndex = props.images.length - (activeIndex.value - index);
    }

    if (relativeIndex === 0) {
        zIndex = props.images.length + 1;
        scale = 1.03;
        translateY = 0;
        translateX = 0;
        opacity = 1;
        rotate = 0;
    } else if (relativeIndex > 0 && relativeIndex <= props.maxVisibleBehind) {
        scale = Math.pow(props.scaleFactor, relativeIndex);
        translateY = relativeIndex * props.offsetYFactor;
        translateX = relativeIndex * props.offsetXFactor * ((activeIndex.value + relativeIndex) % 2 === 0 ? -1 : 1);
        rotate = relativeIndex * props.rotateFactor * ((activeIndex.value + relativeIndex) % 2 === 0 ? -1 : 1);
        opacity = 1 - (relativeIndex * (1 / (props.maxVisibleBehind + 1.5)));
        zIndex = props.images.length - relativeIndex;
    } else {
        scale = Math.pow(props.scaleFactor, props.maxVisibleBehind + 1);
        translateY = (props.maxVisibleBehind + 1) * props.offsetYFactor;
        translateX = (props.maxVisibleBehind + 1) * props.offsetXFactor;
        opacity = 0;
        zIndex = 0;
        rotate = (props.maxVisibleBehind + 1) * props.rotateFactor;
    }

    return {
        transform: `translateX(${translateX}%) translateY(${translateY}%) scale(${scale}) rotate(${rotate}deg)`,
        zIndex: zIndex,
        opacity: opacity,
        cursor: index === activeIndex.value ? 'default' : 'pointer',
    };
};

const nextImage = () => {
    if (props.images.length > 0) {
        activeIndex.value = (activeIndex.value + 1) % props.images.length;
    }
};

const startAutoplay = () => {
    if (props.images.length <= 1) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => {
        if (!isMouseOverGallery.value) {
            nextImage();
        }
    }, props.autoplayInterval);
};

const stopAutoplay = () => {
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
};

const pauseAutoplay = () => {
    isMouseOverGallery.value = true;
};

const resumeAutoplay = () => {
    isMouseOverGallery.value = false;
};

const setActiveAndStopAutoplay = (index) => {
    activeIndex.value = index;
    stopAutoplay();
};

onMounted(() => {
    if (props.images && props.images.length > 0) {
        startAutoplay();
    }
});

onUnmounted(() => {
    stopAutoplay();
});

watch(() => props.images, (newImages) => {
    if (newImages && newImages.length > 0) {
        activeIndex.value = 0;
        startAutoplay();
    } else {
        stopAutoplay();
    }
}, { deep: true });
</script>

<style scoped>
.transition-all[style*="cursor: pointer"]:hover {
}
</style>
