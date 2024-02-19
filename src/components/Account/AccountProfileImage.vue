<template>
  <v-card width="600">
    <v-card-title class="d-flex align-center">
      <BackBtn
        class="mr-1"
        @click="emits('onBack')"
      ></BackBtn>

      <span>
        Alterar perfil
      </span>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="px-0">
      <cropper 
        ref="cropperRef" 
        class="cropper" 
        default-boundaries="fill"
        :stencil-component="CircleStencil"
        :src="props.image.src">
      </cropper>

      <div class="d-flex flex-column align-center my-2">
        <v-btn 
          size="large"
          variant="text"
          prepend-icon="mdi-rotate-right"
          class="my-1"
          @click="rotate">
          Girar
        </v-btn>

        <v-btn 
          color="success"
          variant="tonal"
          size="large"
          class="my-1"
          :loading="isLoading.btnCrop"
          @click="crop">
          Cortar foto
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

// Props
const props = defineProps([
  'image'
])

// Emits
const emits = defineEmits([
  'onBack',
  'onCrop'
])

// Refs
const cropperRef = ref()
const isLoading = ref({
  btnCrop: false
})

// Methods
function rotate() {
  cropperRef.value.rotate(90);
}

function crop() {
  if(!cropperRef.value) return

  isLoading.value.btnCrop = true

  const { canvas } = cropperRef.value.getResult()

  // let context = canvas.getContext("2d");
  // let width = canvas.width;
  // let height = canvas.height;

  // context.globalCompositeOperation = "destination-in";
  // context.beginPath();
  // context.scale(1, height/width);
  // context.arc(width / 2, width / 2, width / 2, 0, Math.PI * 2);
  // context.closePath();
  // context.fill();

  isLoading.value.btnCrop = false

  emits('onCrop', canvas)
}
</script>

<style lang="scss" scoped>
  .cropper {
    height: 100%;
    max-height: 60vh;
  }
</style>