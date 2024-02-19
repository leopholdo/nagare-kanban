<template>
  <v-dialog 
    v-model="props.show" 
    persistent
    width="auto"
    height="auto">
    <v-card width="400" v-if="module === 'index'">
      <div>
        <div class="v-card-title d-flex">
          <span>
            Meu perfil
          </span>

          <CloseBtn
            class="ml-auto"
            @click="emits('update:show', false)"
          ></CloseBtn>
        </div>

        <v-divider></v-divider>

        <div class="py-5 px-4 d-flex flex-column">
          <v-avatar
            class="user-avatar align-self-center"
            color="grey darken-1 shrink"
            size="200">
            <v-img
              v-if="user?.image"
              :src="user.image"
            ></v-img>
            
            <span v-else-if="user?.initials">
              {{ initials }}
            </span>

            <v-icon v-else>
              mdi-account
            </v-icon>
          </v-avatar>

          <div class="mt-2 mb-5">
            <p class="text-body-1">
              {{ user.name }}
            </p>

            <p class="text-body-1 text-medium-emphasis">
              {{ user.email }}
            </p>
          </div>          

          <v-btn 
            block 
            class="my-2 align-self-baseline"
            height="40"
            variant="tonal"
            prepend-icon="mdi-account-edit"
            @click="module = 'profile'">
            Alterar perfil
          </v-btn>

          <v-btn 
            block 
            class="my-2 align-self-baseline"
            height="40"
            variant="tonal"
            prepend-icon="mdi-lock"
            @click="module = 'password'">
            Alterar senha
          </v-btn>

          <v-btn 
            block
            class="my-2"
            height="40"
            color="error"
            variant="outlined"
            prepend-icon="mdi-alert"
            @click="module = 'disable'">
            Desativar conta
          </v-btn>
        </div>
      </div>
    </v-card>

    <AccountProfile
      v-else-if="module === 'profile'"
      :user="user"
      @onBack="module = 'index'"
    ></AccountProfile>

    <AccountPassword
      v-else-if="module === 'password'"
      @onBack="module = 'index'"
    ></AccountPassword>

    <AccountDisable
      v-else-if="module === 'disable'"
      @onBack="module = 'index'"
    ></AccountDisable>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';

import AccountProfile from './AccountProfile.vue';
import AccountPassword from './AccountPassword.vue';
import AccountDisable from './AccountDisable.vue'

// Props
const props = defineProps([
  'show'
])

// Emits
const emits = defineEmits([
  'update:show'
])

const userStore = useUserStore()

// Refs
const module = ref('index')
const { user } = storeToRefs(userStore)
</script>

<style scoped lang="scss">

</style>