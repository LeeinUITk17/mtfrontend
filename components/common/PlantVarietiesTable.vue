<template>
    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
            <table class="min-w-full">
                <thead class="bg-green-700 text-green-50">
                    <tr>
                        <th scope="col" class="pl-4 pr-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider sm:pl-6 w-full md:w-7/12">
                            Tên Giống Cây
                        </th>
                        <th scope="col" class="hidden md:table-cell px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider md:w-5/12">
                            Đặc Điểm / Loại Hình
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(variety, index) in plantVarieties" :key="index" class="hover:bg-green-50 transition-colors duration-150 ease-in-out">
                        <td class="pl-4 pr-3 py-4 text-xl sm:pl-6">
                            <div class="flex items-center">
                                <span class="text-xl mr-3 text-green-500 flex-shrink-0" aria-hidden="true">🌱</span>
                                <div>
                                    <div class="font-medium text-gray-900 group-hover:text-green-700">{{ variety.name }}</div>
                                    <div class="md:hidden text-xs text-gray-500 mt-1">
                                        {{ variety.type }}
                                    </div>
                                    <div v-if="variety.description" class="md:hidden text-xs text-gray-500 mt-0.5">
                                        {{ variety.description }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="hidden md:table-cell px-3 py-4 text-sm text-gray-600 whitespace-normal">
                            <p class="font-medium">{{ variety.type }}</p>
                            <p v-if="variety.description" class="text-xs text-gray-500 mt-0.5">{{ variety.description }}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="plantVarieties.length === 0" class="p-8 text-center text-gray-500 italic border-t border-gray-200">
            <p>Thông tin về các giống cây trồng đang được cập nhật. Vui lòng quay lại sau!</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const plantVarieties = ref([
    { name: 'Cao su RRIV 209', type: 'Năng Suất Cao', description: 'Giống phổ biến, cho mủ nhiều và ổn định.' },
    { name: 'Cao su PB 235', type: 'Chịu Hạn Tốt', description: 'Thích hợp với vùng đất khô cằn, duy trì sản lượng tốt.' },
    { name: 'Cao su RRIV 106 (LH 83/85)', type: 'Truyền Thống Chất Lượng', description: 'Chất lượng mủ tốt, vỏ tái sinh nhanh.' },
    { name: 'Cao su PB 255', type: 'Kháng Gió Đổ', description: 'Thân cây cứng cáp, phù hợp vùng có gió mạnh.' },
    { name: 'Cao su RRIV 124 (LH90/952)', type: 'Kháng Bệnh Vượt Trội', description: 'Chống chịu tốt các bệnh thường gặp trên cây cao su.' },
    { name: 'Cao su VM 515', type: 'Lấy Gỗ & Mủ Kết Hợp', description: 'Tăng trưởng nhanh, phù hợp khai thác cả mủ và gỗ.' },
    { name: 'Cao su RRIV 4 (LH 82/182)', type: 'Thích Nghi Đa Dạng', description: 'Phù hợp nhiều loại đất và điều kiện khí hậu.' },
    { name: 'Cao su PB 260', type: 'Năng Suất Ổn Định', description: 'Được ưa chuộng nhờ sản lượng mủ đều qua các năm.' },
    { name: 'Stump Trần (Rễ trần)', type: 'Stump Ươm Giống', description: 'Giải pháp tiết kiệm chi phí cho việc trồng mới.' },
    { name: 'Stump Bầu Cắt Ngọn', type: 'Stump Ươm Giống', description: 'Cây giống khỏe, tỷ lệ sống cao sau khi trồng.' },
    { name: 'Bầu Ươm 1 Tầng Lá', type: 'Cây Thực Sinh', description: 'Cây con khỏe mạnh, đã phát triển tầng lá đầu tiên.' },
    { name: 'Bầu Ươm 2 Tầng Lá', type: 'Cây Thực Sinh', description: 'Cây phát triển tốt, sẵn sàng cho việc trồng đại trà.' },
    { name: 'Bầu Ươm 3 Tầng Lá', type: 'Cây Thực Sinh', description: 'Cây lớn, khả năng thích nghi cao khi ra trồng.' },
    { name: 'Điều Cao Sản AB05-08', type: 'Cây Điều Giống', description: 'Giống điều năng suất cao, hạt to, chất lượng tốt.' },
    { name: 'Tiêu Vĩnh Linh', type: 'Cây Tiêu Giống', description: 'Giống tiêu truyền thống, kháng bệnh, vị cay nồng đặc trưng.' },
]);
</script>

<style scoped>
th {
    hyphens: auto;
}

td p.font-medium {
    color: #374151;
}
</style>
