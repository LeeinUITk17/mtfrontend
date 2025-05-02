<template>
    <NuxtLink
        :to="link"
        class="transition-colors duration-300"
        :class="{
            'text-white font-bold bg-green-500 rounded-xl p-2 border-4 border-green-300': isActive && !isMobile,
            'hover:text-green-600': !isActive && !isMobile,
            'bg-green-600': isActive && isMobile,
            'hover:bg-green-600': !isActive && isMobile
        }"
    >
        {{ title }}
    </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    title: string;
    link: string;
    activeLink: string;
    isMobile?: boolean;
}>();

const isActive = computed(() => {
    return props.activeLink === props.link || (props.link !== '/' && props.activeLink.startsWith(props.link));
});
</script>

<style scoped>
</style>
