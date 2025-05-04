<template>
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
          <h3 class="text-lg font-bold text-gray-800 mb-4">{{ title }}</h3>
          <p class="text-sm text-gray-600 mb-6">{{ message }}</p>
          <div class="flex justify-end space-x-4">
            <button @click="emit('cancel')" class="px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50">Hủy</button> 
            <button @click="emit('confirm')" class="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700">Xác nhận</button> 
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  });
  
  const emit = defineEmits(['confirm', 'cancel']);
  </script>
  
  <style scoped>
  /* Fade transition */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>