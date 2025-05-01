<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
            <label for="post-title" class="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" id="post-title" v-model="formData.title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
        </div>

        <div>
            <label for="post-content" class="block text-sm font-medium text-gray-700">Content</label>
            <textarea id="post-content" v-model="formData.content" rows="10" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"></textarea>
        </div>

        <div class="flex justify-end">
            <button type="submit" :disabled="loading" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {{ loading ? 'Processing...' : (initialData ? 'Update Post' : 'Create Post') }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';

const props = defineProps({
    initialData: {
        type: Object,
        default: null
    }
});

const formData = reactive({
    title: '',
    content: ''
});

const loading = ref(false);

watch(() => props.initialData, (newData) => {
    if (newData) {
        formData.title = newData.title || '';
        formData.content = newData.content || '';
    }
}, { immediate: true });

const handleSubmit = async () => {
    loading.value = true;

    if (!formData.title || !formData.content) {
        loading.value = false;
        return;
    }

    try {
        let result;
        if (props.initialData?.id) {
            console.log('Simulating update:', props.initialData.id, formData);
            await new Promise(resolve => setTimeout(resolve, 500));
            result = { success: true };
        } else {
            console.log('Simulating create:', formData);
            await new Promise(resolve => setTimeout(resolve, 500));
            result = { success: true, postId: 'new-generated-id' };
        }

        if (result.success) {
            console.log('Success!', result);
            await navigateTo('/admin/posts');
        } else {
            console.error('API Error:', result.error);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    } finally {
        loading.value = false;
    }
};
</script>
