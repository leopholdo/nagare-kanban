<template>
  <v-app-bar 
    app 
    height="50"
    class="app-bar d-flex justify-center">
    <div style="width:200px" class="ml-auto"></div>

    <div class="d-flex justify-center align-center flex-column">
      <b>Nagare</b>
    </div>

    <div class="ml-auto ma-2 user-info pa-2">
      <div>
        <span class="user-name">
          {{user.name}}
        </span>
      </div>

      <v-avatar
        class="user-avatar"
        color="grey darken-1 shrink"
        size="32">
        <v-icon>
          mdi-account
        </v-icon>
      </v-avatar>
    </div>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'

const load = ref(false)

const user = ref({
  name: "User 1"
})
</script>

<style scoped lang="scss">
.v-toolbar__content {
  width: 100%;
}

input {
  outline: none;
}

.app-bar {
  background-image: linear-gradient(90deg,#020024,#00d4ff,#020024,#00d4ff) !important;
  background-size: 300% 100% !important;
  color: #fff !important;
}

.user-info {
  display: flex;
  align-items: center;
  width: 200px;
  height: 80%;
  border-radius: 5px;
  background-color: rgb(0 0 0 / 20%);
}
.user-avatar {
  margin-left: auto;
}

@media (max-width: 700px){
  .user-name {
    display: none;
  }
  .user-info {
   background-color: unset;
  }
}

@keyframes animateBg {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 0%; }
}

.loading {
  position: fixed;
  top: 64px;
  height: 15px;
  width: 100vw;
  animation: animateBg 6s linear infinite;
}
</style>