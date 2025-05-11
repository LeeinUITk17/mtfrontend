<template>
    <section id="about-us-section" class="py-12 md:py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-10 md:mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-green-700 tracking-tight">
                    ĐÔI NÉT VỀ CHÚNG TÔI
                </h2>
                <p class="mt-2 text-sm md:text-base text-gray-500">
                    ►► Tuấn Anh - Nhà Cung Cấp Cây Cao Su Giống Chất Lượng Cao Tại Bình Phước ◄◄
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div class="order-1 lg:order-2">
                    <StackedImageGallery :images="galleryImages" :maxVisible="3" :scaleFactor="0.92" :offsetFactor="6" />
                </div>

                <div class="space-y-6 text-gray-700 leading-relaxed order-2 lg:order-1">
                    <p class="text-base md:text-lg">
                        Chào mừng bạn đến với <strong class="text-green-600 font-semibold">Cơ Sở Cây Giống Tuấn Anh</strong> – đơn vị hàng đầu tại Bình Phước chuyên <strong>bán cây cao su giống</strong> chất lượng cao với giá cạnh tranh. Với nhiều năm kinh nghiệm trong lĩnh vực cây giống cao su, chúng tôi cam kết mang đến cho bà con nông dân những <strong>cây cao su giống loại 1</strong> khỏe mạnh, sinh trưởng tốt, dễ trồng và thích nghi với nhiều vùng khí hậu khác nhau.
                    </p>

                    <div class="space-y-3">
                        <div class="flex items-start">
                            <span class="text-green-600 mr-3 mt-1 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                            </span>
                            <div>
                                <h3 class="text-lg md:text-xl font-semibold text-green-600 mb-1">Sản phẩm nổi bật</h3>
                                <p class="text-sm md:text-base">
                                    Cung cấp đa dạng các <strong>giống cây cao su</strong> chất lượng cao: <strong>BP235, RRIV209, RRIV106, DK4, VM515</strong> – Tỷ lệ sống trên 99%, đã được kiểm chứng thực tế. Đặc biệt <strong>cây cao su giống RRIV 209</strong> và <strong>PB 235</strong> cho năng suất mủ vượt trội, kháng bệnh tốt.
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <span class="text-green-600 mr-3 mt-1 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    <path fill-rule="evenodd" d="M3 4a2 2 0 00-2 2v5.5a2.5 2.5 0 002.5 2.5h1.088c.068.193.15.378.25.552A4.002 4.002 0 009.5 17h1a4.002 4.002 0 003.662-2.448c.102-.174.182-.36.25-.552H15.5A2.5 2.5 0 0018 11.5V6a2 2 0 00-2-2H3zm0 1h14v5a1 1 0 01-1 1h-1.5a.5.5 0 00-.47.326A5.002 5.002 0 0110.5 15h-1a5.002 5.002 0 01-3.53-1.674A.5.5 0 005.5 13H4a1 1 0 01-1-1V5zm12.5 1a.5.5 0 000-1h-3a.5.5 0 000 1h3zM4.5 6a.5.5 0 000-1h-1a.5.5 0 000 1h1z" clip-rule="evenodd" />
                                </svg>
                            </span>
                            <div>
                                <h3 class="text-lg md:text-xl font-semibold text-green-600 mb-1">Giao hàng & Tư vấn</h3>
                                <ul class="list-none space-y-1 pl-0 text-sm md:text-base">
                                    <li><strong>Bán cây cao su giống số lượng lớn</strong> - Giao hàng toàn quốc – Miễn phí vận chuyển, hỗ trợ tận nơi từ Gia Lai, Tây Nguyên đến miền Tây, miền Bắc.</li>
                                    <li>Tư vấn miễn phí <strong>kỹ thuật trồng cây cao su giống</strong>, chọn giống phù hợp và hướng dẫn chi tiết <strong>cách chăm sóc cây cao su giống</strong> mới trồng, <strong>phòng bệnh cho cây cao su</strong>.</li>
                                </ul>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <span class="text-green-600 mr-3 mt-1 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                                </svg>
                            </span>
                            <div>
                                <h3 class="text-lg md:text-xl font-semibold text-green-600 mb-1">Thông tin liên hệ</h3>
                                <p class="text-sm md:text-base"><strong>Địa chỉ vườn ươm:</strong> Khu phố 07, Huyện Chơn Thành, Tỉnh Bình Phước - <strong>Địa chỉ mua cây cao su giống tại Bình Phước</strong> uy tín</p>
                                <p class="text-sm md:text-base"><strong>Hotline/Zalo:</strong> <a href="tel:0979072768" class="text-blue-600 hover:underline font-medium">0979 072 768</a> - Tư vấn <strong>giá cây cao su giống 2025</strong></p>
                            </div>
                        </div>
                    </div>

                    <p class="text-green-700 font-semibold text-md md:text-lg italic pt-4">
                        Chuyên cung cấp <strong>cây cao su giống F1</strong>, <strong>cây cao su giống ghép mắt</strong> chất lượng cao. Rất mong được đồng hành cùng Quý khách!
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import StackedImageGallery from '~/components/common/StackedImageGallery.vue';

const galleryImages = ref([
    { 
      id: 'main', 
      src: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746940629/aoc0ok9kf5utn2dlsftx.jpg', 
      alt: 'Cây cao su giống chất lượng cao tại vườn ươm Tuấn Anh Bình Phước - Địa chỉ bán cây cao su giống uy tín' 
    },
    { 
      id: 'top', 
      src: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746940625/uvywmv98uqb2qm7zuaz5.jpg', 
      alt: 'Toàn cảnh vườn ươm cao su giống Tuấn Anh tại Chơn Thành, Bình Phước - Nơi cung cấp cây giống cao su số lượng lớn' 
    },
    { 
      id: 'side', 
      src: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746940625/u9gkjlpbpqggj7esly19.jpg', 
      alt: 'Luống cây cao su giống đạt chuẩn xuất vườn - Giống cây cao su chất lượng cao' 
    },
]);
</script>

<style scoped>
</style>