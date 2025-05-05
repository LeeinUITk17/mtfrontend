<template>
    <div class="overflow-x-auto shadow border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên cây</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="loading">
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">Đang tải...</td>
                </tr>
                <tr v-else-if="!plants || plants.length === 0">
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">Không có cây trồng nào.</td>
                </tr>
                <tr v-else v-for="plant in plants" :key="plant.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <NuxtImg
                            :src="plant.images && plant.images.length > 0 ? plant.images[0].url : (plant.imageUrl || '/placeholder-plant.png')"
                            :alt="plant.name"
                            class="h-12 w-12 rounded-md object-cover shadow"
                            width="48"
                            height="48"
                            loading="lazy"
                        />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ plant.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatCurrency(plant.price) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ plant.stock }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ plant.category?.name || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <NuxtLink :to="`/admin/plants/edit/${plant.id}`" class="text-indigo-600 hover:text-indigo-900">Sửa</NuxtLink>
                        <button @click="confirmDelete(plant.id, plant.name)" class="text-red-600 hover:text-red-900">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const props = defineProps({
    plants: {
        type: Array,
        required: true,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['delete-plant']);

const confirmDelete = (plantId, plantName) => {
    Swal.fire({
        title: 'Xác nhận xóa',
        text: `Bạn có chắc chắn muốn xóa cây "${plantName}" không?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Đúng, xóa nó!',
        cancelButtonText: 'Hủy bỏ'
    }).then((result) => {
        if (result.isConfirmed) {
            emit('delete-plant', plantId);
        }
    });
};

const formatCurrency = (value) => {
    if (value == null) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
</script>
