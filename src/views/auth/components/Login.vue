<template>
  <div v-if="showInactiveAccount" class="text-center">
    <h2 class="font-weight-regular">
      Conta inativa
    </h2>

    <p class="mt-6 text-body-2 text-medium-emphasis">
      A conta {{ email.value }} está inativa.
    </p>
    <p class="text-body-1 mt-1 font-weight-regular">
      Deseja reativa-la?
    </p>

    <v-row class="mt-4">
      <v-col cols="12" sm="6">
        <v-btn
          block
          height="40"
          variant="tonal"
          @click="showInactiveAccount = false">
          Não
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6">
        <v-btn
          block
          height="40"
          color="success"
          :loading="isLoading.btnActivate"          
          @click="activateAccount">
          Sim
        </v-btn>
      </v-col>
    </v-row>
  </div>

  <div v-else>
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
          class="action-hover-primary" 
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
import { useUserStore } from '@/store/user';

const emits = defineEmits([
  'showRegister'
]);

const authStore = useAuthStore();
const callerStore = useCallerStore();

const router = useRouter();

const formLogin = ref();
const isLoading = ref({
  btnSubmit: false,
  btnActivate: false
})

const errorMessage = ref("");

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const showInactiveAccount = ref(false);

async function login() {
  let response = await authStore.login(
    email.value, 
    password.value
  )

  if(callerStore.hasError) {      
    // When user inputs, clear error message
    formLogin.value.$el.addEventListener('input', () => {
      errorMessage.value = ""
    }, { once: true })
    
    if(response === 'except_user_not_found')
      errorMessage.value = 'Nome de usuário ou senha incorretos.'
    else if(response === 'except_user_inactive')
      showInactiveAccount.value = true
    else
      errorMessage.value = 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde. '

    isLoading.value.btnSubmit = false;

    return
  }    

  const { getUserImage } = useUserStore();

  await getUserImage();

  router.push({
    name: 'Home'
  })
}

async function onSubmit() {
  const { valid } = await formLogin.value.validate();
  if(!valid) return;

  isLoading.value.btnSubmit = true;

  login();
}

async function activateAccount() {
  isLoading.value.btnActivate = true;

  await callerStore.fetchData({
    method: 'put',
    url: 'User/Activate',
    data: {
      email: email.value, 
      password: password.value
    }
  })
  
  if(callerStore.hasError) {
    isLoading.value.btnActivate = false;
    return;
  }
  
  login();
}
</script>