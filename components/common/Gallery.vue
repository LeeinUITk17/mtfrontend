<template>
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      <div
        v-for="(imgSrc, index) in images"
        :key="index"
        class="relative aspect-square cursor-pointer rounded-lg overflow-hidden shadow-md transform transition duration-300 ease-in-out hover:scale-102 hover:shadow-xl"
        @click="openModal(index)"
        aria-label="Open image in modal"
      >
        <NuxtImg
          :src="imgSrc"
          alt="Gallery Image"
          class="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
      </div>
    </div>
    <Transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-80 backdrop-blur-sm p-4"
        @click.self="closeModal"
        @keydown.escape="closeModal"
      >
        <div class="relative w-full max-w-5xl h-full flex items-center justify-center">
          <button
            class="absolute top-0 right-0 m-4 z-10 text-white hover:text-gray-300 transition-colors duration-300"
            @click="closeModal"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            class="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 text-white text-opacity-80 hover:text-opacity-100 transition-opacity duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-white rounded-full"
            @click="prevImage"
            aria-label="Previous image"
            :disabled="images.length <= 1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="relative flex items-center justify-center max-w-full max-h-[90vh]">
            <div v-if="modalImageLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-lg">
              <svg class="animate-spin h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <img
              :src="images[currentImage]"
              alt="Modal Image"
              class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-xl"
              @load="handleModalImageLoad"
              @error="handleModalImageError"
            />
          </div>
          <button
            class="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 text-white text-opacity-80 hover:text-opacity-100 transition-opacity duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-white rounded-full"
            @click="nextImage"
            aria-label="Next image"
            :disabled="images.length <= 1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
const config = useRuntimeConfig();
const showModal = ref(false);
const currentImage = ref(0);
const modalImageLoading = ref(false);

const images = ref([
  "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg",
  "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/xtdthqbilmkbzdzrnluy.jpg",
  "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077762/vmtavyqywh98r2tikoiv.jpg",
  "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077762/gryyvyt2icj8pasisd80.jpg",
  "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/vq6ccikx0ot4xv3nvkcv.jpg",
  "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077762/zy25jn5txsatpsfquhvt.jpg",
  "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077762/f4uz4lqifowwsup2j4nt.jpg",
  "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077766/tic4dil5kzefok4conki.jpg",

]);

const openModal = (index) => {
  currentImage.value = index;
  showModal.value = true;
  document.body.style.overflow = 'hidden';
  modalImageLoading.value = true;
};

const closeModal = () => {
  showModal.value = false;
  document.body.style.overflow = '';
};

const nextImage = () => {
  currentImage.value = (currentImage.value + 1) % images.value.length;
  modalImageLoading.value = true;
};

const prevImage = () => {
  currentImage.value = currentImage.value === 0 ? images.value.length - 1 : currentImage.value - 1;
  modalImageLoading.value = true;
};

const handleModalImageLoad = () => {
  modalImageLoading.value = false;
};

const handleModalImageError = () => {
  modalImageLoading.value = false;
  console.error('Failed to load modal image:', images.value[currentImage.value]);
};

const handleKeydown = (event) => {
  if (!showModal.value) return;
  if (event.key === 'ArrowRight') {
    nextImage();
  } else if (event.key === 'ArrowLeft') {
    prevImage();
  }
};

watch(showModal, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});


useHead({
  script: [
    {
      key: 'gallery-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "name": "Thư viện ảnh vườn ươm cao su giống",
        "description": "Hình ảnh thực tế các giống cao su tại vườn ươm Tuấn Anh",
        "url": `${config.public.baseUrl}/gallery`,
        "publisher": {
          "@type": "Organization",
          "name": "Vườn Ươm Cây Cao Su Giống Tuấn Anh",
          "logo": {
            "@type": "ImageObject",
            "url": "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746146995/gpg18t1hvlrlvww9sw9j.png"
          }
        }
      })
    },
    ...images.value.map((imgSrc, index) => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "contentUrl": imgSrc,
        "description": `Hình ảnh thực tế giống cao su tại vườn ươm Tuấn Anh - Ảnh ${index + 1}`,
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "acquireLicensePage": `${config.public.baseUrl}/gallery`,
        "creator": {
          "@type": "Organization",
          "name": "Vườn Ươm Tuấn Anh"
        }
      })
    }))
  ]
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
