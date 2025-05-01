<template>
    <button :class="buttonClasses" @click="$emit('click', $event)">
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    color: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary', 'red', 'gray'].includes(value),
    },
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    outline: {
        type: Boolean,
        default: false,
    },
});

const buttonClasses = computed(() => {
    const baseClasses = 'font-bold py-2 px-4 rounded transition-colors';
    const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90';
    const sizeClasses = {
        sm: 'text-sm px-3 py-1',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
    }[props.size];

    let colorClasses = '';
    if (props.outline) {
        colorClasses = {
            primary: 'border border-primary text-primary hover:bg-primary-light hover:text-white',
            secondary: 'border border-secondary text-secondary hover:bg-secondary hover:text-gray-800',
            red: 'border border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
            gray: 'border border-gray-500 text-gray-500 hover:bg-gray-100',
        }[props.color];
    } else {
        colorClasses = {
            primary: 'bg-primary text-white hover:bg-primary-dark',
            secondary: 'bg-secondary text-white hover:bg-yellow-600',
            red: 'bg-red-500 text-white hover:bg-red-600',
            gray: 'bg-gray-500 text-white hover:bg-gray-600',
        }[props.color];
    }

    return [baseClasses, sizeClasses, colorClasses, disabledClasses].join(' ');
});
</script>
