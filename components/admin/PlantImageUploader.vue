<template>
    <div class="space-y-4">
        <div>
            <label :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
                {{ label }} <span v-if="required" class="text-red-500">*</span>
                <span v-if="multiple" class="text-xs text-gray-500"> (Chọn nhiều ảnh)</span>
            </label>
            <label :for="inputId" class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors duration-150">
                <div class="space-y-1 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                        <span class="relative bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            Nhấn để chọn tệp
                        </span>
                        <input :id="inputId" :name="inputName" type="file" class="sr-only" :multiple="multiple" :accept="accept" @change="handleFileChange" />
                    </div>
                    <p class="text-xs text-gray-500">PNG, JPG, GIF, WEBP tối đa {{ maxFileSizeMB }}MB</p>
                </div>
            </label>
        </div>
        <div v-if="selectedFiles.length > 0" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            <div v-for="(file, index) in selectedFiles" :key="file.id || index" class="relative group aspect-square border rounded-md overflow-hidden">
                <img :src="file.previewUrl" :alt="'Xem trước ' + file.name" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-150 flex items-center justify-center">
                    <button
                        type="button"
                        @click="removeFile(index)"
                        class="p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        aria-label="Xóa ảnh xem trước"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onUnmounted, computed } from 'vue';

const props = defineProps({
    modelValue: { type: [Array, FileList, null], default: null },
    label: { type: String, default: 'Hình ảnh' },
    required: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    accept: { type: String, default: 'image/*' },
    maxFileSizeMB: { type: Number, default: 5 },
    inputName: { type: String, default: 'images' }
});

const emit = defineEmits(['update:modelValue']);
const selectedFiles = ref([]);
const inputId = computed(() => `file-upload-${Math.random().toString(36).substring(7)}`);

const createPreview = (file) => URL.createObjectURL(file);
const revokePreview = (url) => {
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
};

watch(() => props.modelValue, (newValue) => {
    if (newValue instanceof FileList) {
        selectedFiles.value = Array.from(newValue).map(file => ({
            file,
            previewUrl: createPreview(file),
            name: file.name
        }));
    } else if (Array.isArray(newValue) && newValue.length > 0 && newValue[0] instanceof File) {
        selectedFiles.value = newValue.map(file => ({
            file,
            previewUrl: createPreview(file),
            name: file.name
        }));
    } else if (!newValue) {
        selectedFiles.value.forEach(f => revokePreview(f.previewUrl));
        selectedFiles.value = [];
    }
}, { immediate: true });

const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files) return;

    const newlySelected = Array.from(files);
    const currentFiles = props.multiple ? [...selectedFiles.value] : [];

    newlySelected.forEach((file) => {
        if (file.size > props.maxFileSizeMB * 1024 * 1024) {
            alert(`File "${file.name}" quá lớn (tối đa ${props.maxFileSizeMB}MB).`);
            return;
        }
        currentFiles.push({
            file,
            previewUrl: createPreview(file),
            name: file.name
        });
    });

    selectedFiles.value = currentFiles;
    emit('update:modelValue', selectedFiles.value.map(f => f.file));
    event.target.value = '';
};

const removeFile = (index) => {
    if (!selectedFiles.value[index]) return;
    revokePreview(selectedFiles.value[index].previewUrl);
    selectedFiles.value.splice(index, 1);
    emit('update:modelValue', selectedFiles.value.map(f => f.file));
};

onUnmounted(() => {
    selectedFiles.value.forEach(f => revokePreview(f.previewUrl));
});
</script>
