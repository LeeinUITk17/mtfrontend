<template>
  <NuxtLink
    :to="link"
    class="transition-all duration-300 flex items-center"
    :class="{
      'text-white bg-green-600 rounded-lg px-4 py-2 font-bold shadow-md': isActive && !isMobile,
      'hover:text-green-100 hover:bg-green-700/50 rounded-lg px-4 py-2': !isActive && !isMobile,
      'text-white bg-green-600/90 px-4 py-3 my-1 rounded-lg font-semibold': isActive && isMobile,
      'hover:bg-green-700/30 px-4 py-3 my-1 rounded-lg': !isActive && isMobile
    }"
    @click="$emit('click')"
  >
    <span class="whitespace-nowrap">{{ title }}</span>
    <svg 
      v-if="isActive && !isMobile"
      xmlns="http://www.w3.org/2000/svg" 
      class="h-4 w-4 ml-1 animate-pulse" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  link: string;
  activeLink: string;
  isMobile?: boolean;
}>();

defineEmits(['click']);

const isActive = computed(() => {
  if (props.link === '/') {
    return props.activeLink === props.link;
  }
  return props.activeLink.startsWith(props.link);
});
</script>