<template>
  <div class="overlay">
    <div class="flex-center flex-column h-100">
      <span class="loader"></span>
      <v-img 
        height="60px"
        width="60px"
        src="@/assets/logo.webp">
      </v-img>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  background: rgba(0, 0, 0, 0.5) !important;
  opacity: 1 !important;
  height: 100vh;
  width: 100vw;
  position: absolute;
  z-index: 3500;
}
.loader {
  position: absolute;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  display: inline-block;
  border-top: 5px solid #1da2ec;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
</style>