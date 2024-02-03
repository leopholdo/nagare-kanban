<template>
  <div>
    <v-scroll-y-transition>
      <v-alert
        v-if="errorMessage"
        color="error"
        icon="$info"
        variant="tonal"
        class="mb-8"
        :text="errorMessage"
      ></v-alert>
    </v-scroll-y-transition>

    <v-form ref="formLogin" @submit.prevent="onSubmit">
      <v-text-field
        variant="solo-filled"
        label="E-mail"
        density="default"
        :rules="[required, emailValidation]"
        v-model="email"
      ></v-text-field>

      <v-text-field
        variant="solo-filled"
        label="Senha"
        density="default"
        class="mt-8"
        :type="showPassword ? 'text' : 'password'"
        :rules="[required]"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
        v-model="password">
      </v-text-field>

      <v-btn 
        block 
        rounded="xl"
        class="mt-8"
        size="large"
        color="primary"
        type="submit"
        :loading="isLoading.btnSubmit">
        Entrar
      </v-btn>

      <v-divider
        class="mt-10 mb-3"
      ></v-divider>

      <div class="d-flex flex-column text-center text-body-1">
        <span style="color: #A3A3A3">
          Não tem uma conta?
        </span>

        <a
          class="action-hover" 
          @click="emits('showRegister')">
          Inscrever-se no Nagare
        </a>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { 
  required, 
  email as emailValidation 
} from '@/utils/validations';

import { useAuthStore } from '@/store/auth';
import { useCallerStore } from '@/store/caller';

const emits = defineEmits([
  'showRegister'
]);

const authStore = useAuthStore();
const callerStore = useCallerStore();

const router = useRouter();

const formLogin = ref();
const isLoading = ref({
  btnSubmit: false
})

const errorMessage = ref("");

const email = ref("");
const password = ref("");
const showPassword = ref(false);

async function onSubmit() {
  const { valid } = await formLogin.value.validate();
  if(!valid) return;

  isLoading.value.btnSubmit = true;

  authStore.login(
    email.value, 
    password.value
  ).then((response) => {
    if(callerStore.hasError) {      
      // When user inputs, clear error message
      formLogin.value.$el.addEventListener('input', () => {
        errorMessage.value = ""
      }, { once: true })
      
      if(response === 'except_user_not_found')
        errorMessage.value = 'Nome de usuário ou senha incorretos.'
      else
        errorMessage.value = 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde. '

      isLoading.value.btnSubmit = false;

      return
    }

    router.push({
      name: 'Home'
    })
  })
}
</script>