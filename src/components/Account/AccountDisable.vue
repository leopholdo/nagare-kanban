<template>
  <v-card width="420" class="pa-4 text-center">
    <h2 class="font-weight-regular">
      Desativar conta
    </h2>

    <h3 class="mt-4 font-weight-regular">
      Sentimos muito por você estar indo embora :(
    </h3>
    <p class="mt-2">
      Seu progresso será pausado e você não terá mais acesso à plataforma.
    </p>

    <v-checkbox 
      class="mt-4"
      hide-details
      label="Estou ciente e quero desativar minha conta"
      v-model="check"
    ></v-checkbox>

    <v-row>
      <v-col cols="12" sm="6">
        <v-btn
          block
          class="my-2"
          height="40"
          variant="tonal"
          @click="emits('onBack')">
          Cancelar
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6">
        <v-btn
          block
          class="my-2"
          height="40"
          color="error"
          variant="text"
          :disabled="!check"
          :loading="isLoading.btnSubmit"
          @click="disableAccount">
          Confirmar
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

import { useCallerStore } from '@/store/caller';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

// Emits
const emits = defineEmits([
  'onBack'
])

const callerStore = useCallerStore()
const router = useRouter();

// Refs
const isLoading = ref({
  btnSubmit: false
})
const check = ref(false)

// Methods
function disableAccount() {
  isLoading.value.btnSubmit = true

  callerStore.fetchData({
    method: 'put',
    url: 'User/Disable'
  }).then(() => {
    if(callerStore.hasError) {
      isLoading.value.btnSubmit = false
      return
    }

    const { resetAuth } = useAuthStore()
    
    resetAuth()
    
    isLoading.value.btnSubmit = false

    router.push({
      name: 'Auth'
    })
  })
}
</script>