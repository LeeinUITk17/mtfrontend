<template>
  <div class="overflow-x-auto py-0 whitespace-nowrap no-scrollbar px-2 md:px-4">
    <div class="flex space-x-4 md:space-x-8 bg-gradient-to-r from-green-500 via-green-900 to-green-500 p-3 md:p-4 rounded-xl">
      <div
        v-for="item in menuItems"
        :key="item.id"
        class="flex-shrink-0"
        style="min-width: fit-content;"
      >
        <button
          type="button"
          class="text-center font-bold text-lg uppercase tracking-wider px-4 py-2 rounded-xl transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white"
          :class="{
            'text-white bg-green-600 shadow': item.isActive,
            'text-gray-100 hover:text-white': !item.isActive,
          }"
          @click="handleClick(item)"
          :aria-label="'Scroll to ' + item.name"
        >
          {{ item.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface MenuItem {
  id: number | string;
  name: string;
  data: string;
  isActive: boolean;
}

const props = defineProps<{ menuItems: MenuItem[] }>();

const emit = defineEmits<{
  (e: 'scrollToSection', sectionId: string): void;
}>();

const handleClick = (item: MenuItem) => {
  props.menuItems.forEach(menuItem => {
    menuItem.isActive = menuItem.id === item.id;
  });
  emit('scrollToSection', item.data);
};
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
