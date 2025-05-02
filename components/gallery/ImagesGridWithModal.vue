<template>
    <div>
      <div v-if="images && images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        <div
          v-for="(image, index) in images"
          :key="image.id || index"
          class="relative aspect-square cursor-pointer rounded-lg overflow-hidden shadow-md transform transition duration-300 ease-in-out hover:scale-102 hover:shadow-xl"
          @click="openModal(index)"
          :aria-label="'Mở ảnh ' + (index + 1) + ' trong cửa sổ xem'"
        >
          <NuxtImg
            :src="image.imageUrl"
            :alt="'Ảnh trong thư viện ' + (index + 1)"
            class="w-full h-full object-cover rounded-lg"
            loading="lazy"
            sizes="sm:100vw md:50vw lg:300px"
          />
          <div class="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
        </div>
      </div>

       <div v-else class="text-center text-gray-600 py-12">
            <p class="text-xl font-semibold">Không có ảnh nào.</p>
            <p class="mt-2">Bộ sưu tập này hiện chưa có ảnh nào được hiển thị.</p>
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
              aria-label="Đóng cửa sổ xem ảnh"
            >
               <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              class="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 text-white text-opacity-80 hover:text-opacity-100 transition-opacity duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-white rounded-full"
              @click="prevImage"
              aria-label="Ảnh trước"
              :disabled="images.length <= 1"
            >
               <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

             <div class="relative flex items-center justify-center max-w-full max-h-[90vh]">
                 <div v-if="modalImageLoading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
                     <svg class="animate-spin h-10 w-10 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                 </div>
                  <img
                      v-if="images && images.length > 0 && images[currentImage] && !modalImageErrorState"
                      :src="images[currentImage].imageUrl"
                      :alt="'Ảnh hiện tại trong cửa sổ xem'"
                      class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-xl"
                      @load="handleModalImageLoad"
                      @error="handleModalImageError"
                   />
                   <div v-else-if="modalImageErrorState" class="max-w-full max-h-[90vh] flex items-center justify-center text-gray-500 p-4 bg-white rounded-lg">
                        Lỗi tải ảnh
                   </div>
             </div>

            <button
              class="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 text-white text-opacity-80 hover:text-opacity-100 transition-opacity duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-white rounded-full"
              @click="nextImage"
              aria-label="Ảnh tiếp theo"
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
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

const props = defineProps({
    images: {
        type: Array,
        required: true,
        default: () => [],
        validator: (value) => value.every(img => typeof img === 'object' && img !== null && 'imageUrl' in img && 'id' in img)
    }
});

const showModal = ref(false);
const currentImage = ref(0);
const modalImageLoading = ref(false);
const modalImageErrorState = ref(false);

const openModal = (index) => {
  modalImageErrorState.value = false;
  currentImage.value = index;
  showModal.value = true;
  document.body.style.overflow = 'hidden';
  modalImageLoading.value = true;
};

const closeModal = () => {
  showModal.value = false;
  document.body.style.overflow = '';
  modalImageErrorState.value = false;
};

const nextImage = () => {
   if (!props.images || props.images.length <= 1) return;
  modalImageErrorState.value = false;
  currentImage.value = (currentImage.value + 1) % props.images.length;
  modalImageLoading.value = true;
};

const prevImage = () => {
   if (!props.images || props.images.length <= 1) return;
   modalImageErrorState.value = false;
  currentImage.value = currentImage.value === 0 ? props.images.length - 1 : currentImage.value - 1;
  modalImageLoading.value = true;
};

const handleModalImageLoad = () => {
  modalImageLoading.value = false;
  modalImageErrorState.value = false;
};

const handleModalImageError = () => {
  modalImageLoading.value = false;
  modalImageErrorState.value = true;
   if (props.images && props.images[currentImage.value]) {
     console.error('Failed to load modal image:', props.images[currentImage.value].imageUrl);
   } else {
     console.error('Failed to load modal image at unknown index or images not loaded.');
   }
};

const handleKeydown = (event) => {
  if (!showModal.value || !props.images || props.images.length <= 1) return;

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
