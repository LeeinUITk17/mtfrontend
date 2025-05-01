<template>
    <div class="py-4">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Image Gallery Management</h1>

        <div class="mb-6 bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Upload New Image</h3>
            <form @submit.prevent="handleUpload" class="space-y-4">
                <div>
                    <label for="image-file" class="block text-sm font-medium text-gray-700">Select Image</label>
                    <input
                        type="file"
                        id="image-file"
                        @change="handleFileSelect"
                        accept="image/*"
                        required
                        class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                </div>
                <div class="flex justify-end">
                    <button
                        type="submit"
                        :disabled="uploading"
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        {{ uploading ? 'Uploading...' : 'Upload' }}
                    </button>
                </div>
            </form>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Image Gallery</h3>
            <div v-if="imagesPending" class="text-center">
                <LoadingSpinner />
                <p>Loading images...</p>
            </div>
            <div v-else-if="imagesError" class="text-red-500">Error: {{ imagesError.message }}</div>
            <div v-else-if="images && images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div v-for="image in images" :key="image.id" class="relative aspect-square rounded-lg overflow-hidden group">
                    <NuxtImg :src="image.url" alt="Gallery Image" class="w-full h-full object-cover" loading="lazy" />
                    <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            @click="confirmDeleteImage(image.id)"
                            class="text-white bg-red-600 p-2 rounded-full hover:bg-red-700"
                            aria-label="Delete Image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div v-else class="text-gray-600 italic">No images in the gallery yet.</div>
        </div>
    </div>
</template>

<script setup>
import { useAsyncData } from '#app';
import { ref } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth']
});

const selectedFile = ref(null);
const uploading = ref(false);

const handleFileSelect = (event) => {
    selectedFile.value = event.target.files ? event.target.files[0] : null;
};

const handleUpload = async () => {
    if (!selectedFile.value) return;

    uploading.value = true;

    const formData = new FormData();
    formData.append('image', selectedFile.value);

    try {
        console.log('Simulating upload file:', selectedFile.value.name);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const result = { success: true };
    } catch (error) {
        console.error('Upload error:', error);
    } finally {
        uploading.value = false;
        selectedFile.value = null;
    }
};

const { data: images, pending: imagesPending, error: imagesError, refresh: fetchImages } = await useAsyncData(
    'admin-gallery-images',
    async () => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const sampleImages = [
            { id: 'img1', url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg' },
            { id: 'img2', url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/xtdthqbilmkbzdzrnluy.jpg' },
            { id: 'img3', url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077762/vmtavyqywh98r2tikoiv.jpg' },
        ];
        return sampleImages;
    }
);

useHead({
    title: 'Image Gallery Management - Admin',
});
</script>
