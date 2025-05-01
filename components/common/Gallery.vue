<template>
    <div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="cursor-pointer rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105"
          @click="openModal(index)"
        >
          <nuxt-img
            :src="img"
            alt="Gallery Image"
            class="w-full h-auto rounded-lg"
            width="300"
            height="auto"
          />
        </div>
      </div>
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-70"
        @click.self="closeModal"
      >
        <div class="relative bg-white p-6 rounded-lg max-w-4xl w-full">
          <button
            class="absolute top-1/2 left-1 transform -translate-y-1/2 p-4 rounded-full text-2xl font-bold shadow-xl"
            @click="prevImage"
          >
            <
          </button>
            <img
            :src="images[currentImage]"
            alt="Modal Image"
            class="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg"
            />
          <button
            class="absolute top-1/2 right-1 transform -translate-y-1/2 p-4 rounded-full text-2xl font-bold shadow-xl"
            @click="nextImage"
          >
            >
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
export default {
  data() {
    return {
      showModal: false,
      currentImage: 0,
      images: [
        "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/pjbl4okuzh5puywoxj9i.jpg",
        "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/xtdthqbilmkbzdzrnluy.jpg",
        "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077762/vmtavyqywh98r2tikoiv.jpg",
        "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077762/gryyvyt2icj8pasisd80.jpg",
        "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077761/vq6ccikx0ot4xv3nvkcv.jpg",
        "https://res.cloudinary.com/dbonwxmgl/image/upload/v1746077762/zy25jn5txsatpsfquhvt.jpg",

      ],
    };
  },
  methods: {
    openModal(index) {
      this.currentImage = index;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    nextImage() {
      this.currentImage = (this.currentImage + 1) % this.images.length;
    },
    prevImage() {
      this.currentImage =
        this.currentImage === 0 ? this.images.length - 1 : this.currentImage - 1;
    },
  },
};
</script>


  