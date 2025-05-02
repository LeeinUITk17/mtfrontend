<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="plantPending" class="text-center py-12">
            <LoadingSpinner class="w-10 h-10 text-green-600 mx-auto" />
            <p class="mt-4 text-gray-700">Đang tải thông tin cây...</p>
        </div>

        <div v-else-if="plantError" class="text-center text-red-500 py-12">
            <p>Lỗi khi tải thông tin cây: {{ plantError.message }}</p>
            <p class="mt-2">Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
        </div>

        <div v-else-if="!plant" class="text-center text-gray-600 py-12">
            <p class="text-xl font-semibold">Không tìm thấy cây này.</p>
            <p class="mt-2">Mã cây có thể không đúng hoặc cây không tồn tại.</p>
            <NuxtLink to="/plants" class="mt-4 inline-block text-primary hover:underline">
                Quay lại danh sách cây
            </NuxtLink>
        </div>

        <div v-else class="bg-white rounded-lg shadow-xl overflow-hidden p-6 md:p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                <div class="md:col-span-1">
                    <NuxtImg
                        v-if="plant.imageUrl"
                        :src="plant.imageUrl"
                        :alt="'Image of ' + plant.name"
                        class="w-full h-auto object-cover rounded-lg shadow-md max-w-[800px] max-h-[600px]"
                        sizes="sm:100vw md:50vw lg:400px"
                        quality="80"
                    />
                    <div v-else class="w-full h-64 md:h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                        Không có ảnh
                    </div>
                </div>

                <div class="md:col-span-1 space-y-6">
                    <div>
                        <h1 class="text-3xl md:text-4xl font-bold text-green-800">{{ plant.name }}</h1>
                    </div>

                    <div>
                        <h2 class="text-xl font-semibold text-green-700 mb-2">Mô tả</h2>
                        <p class="text-gray-700 leading-relaxed">{{ plant.description || 'Chưa có mô tả chi tiết.' }}</p>
                    </div>

                    <div>
                        <h2 class="text-xl font-semibold text-green-700 mb-2">Giá</h2>
                        <p class="text-2xl font-bold text-primary">{{ formatCurrency(plant.price) }}</p>
                    </div>

                    <div class="mt-8">
                        <a href="https://zalo.me/0356356497" target="_blank" rel="noopener noreferrer" class="bg-primary text-gray-800 bg-gray-200 text-lg font-semibold px-8 py-3 rounded-full hover:bg-primary-dark hover:bg-green-500 hover:text-white transition-colors shadow-lg">
                            Liên hệ để mua
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

const config = useRuntimeConfig();
const route = useRoute();
const plantId = route.params.id;

const { data: plant, pending: plantPending, error: plantError } = await useAsyncData(
    `plant-${plantId}`,
    async () => {
        const response = await $fetch(`${config.public.apiBase}/plants/${plantId}`);
        if (!response) {
            throw new Error('Plant not found or empty response.');
        }
        return response;
    }
);

const formatCurrency = (value) => {
    if (value == null) return 'N/A';
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numberValue);
};

useHead(() => {
    const plantName = plant.value ? plant.value.name : 'Cây cảnh';
    const description = plant.value ? plant.value.description : 'Thông tin chi tiết về các loại cây cảnh.';
    const imageUrl = plant.value && plant.value.imageUrl ? plant.value.imageUrl : '/social-share-image.jpg';

    return {
        title: `${plantName} - Chi tiết Cây cảnh`,
        meta: [
            { name: 'description', content: description },
            { property: 'og:title', content: `${plantName} - Chi tiết Cây cảnh` },
            { property: 'og:description', content: description },
            { property: 'og:image', content: imageUrl },
        ],
    };
});
</script>

<style scoped>
</style>
