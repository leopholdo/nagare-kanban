<template>
  <div v-if="step < 3">
    <div class="d-flex text-body-1 align-center mb-5">
      <v-icon 
        size="2rem" 
        class="action-hover-primary" 
        style="margin-left: -10px"
        @click="onBack">
        mdi-chevron-left
      </v-icon>

      <div class="d-flex flex-column">
        <span style="color: #A3A3A3">
          {{ stepNumber }}
        </span>
        <span>
          {{ stepDescription }}
        </span>
      </div>
    </div>

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

    <v-form 
      v-if="step === 0"
      ref="formEmail" 
      @submit.prevent="onNextEmail">
      <v-text-field
        variant="solo-filled"
        label="E-mail"
        density="default"
        :rules="[required, emailValidation]"
        v-model="email"
      ></v-text-field>
      
      <v-btn 
        block 
        rounded="xl"
        class="mt-8"
        size="large"
        color="primary"
        type="submit"
        :loading="isLoading.checkUserBtn">
        Avançar
      </v-btn>
    </v-form>

    <v-form 
      v-else-if="step === 1"
      ref="formPassword" 
      @submit.prevent="onNextPassword">
      <v-text-field
        variant="solo-filled"
        label="Senha"
        density="default"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[required, passwordIsValid]"
        @click:append-inner="showPassword = !showPassword"
        v-model="password">
      </v-text-field>

      <div class="mt-5">
        <p>
          A senha deve ter pelo menos
        </p>

        <div 
          class="d-flex align-center" 
          v-for="criteria in passwordStrength"
          :key="criteria.type">
          <v-icon color="#007cc1">
            {{ criteria.valid ? 'mdi-check-circle' : 'mdi-circle-outline' }}
          </v-icon>

          <span class="ml-1">
            {{ criteria.label }}
          </span>
        </div>
      </div>
      
      <v-btn 
        block 
        rounded="xl"
        class="mt-8"
        size="large"
        color="primary"
        @click="onNextPassword">
        Avançar
      </v-btn>
    </v-form>

    <v-form 
      v-else
      ref="formName" 
      @submit.prevent="onRegister">
      <v-text-field
        counter
        variant="solo-filled"
        label="Nome"
        density="default"
        maxlength="40"
        :rules="[required, nameLengthValidation]"
        v-model="name"
      ></v-text-field>
      
      <v-btn 
        block 
        rounded="xl"
        class="mt-8"
        size="large"
        color="primary"
        type="submit"
        :loading="isLoading.finishBtn">
        Finalizar
      </v-btn>
    </v-form>

    <v-divider
      class="mt-10 mb-3"
    ></v-divider>

    <div class="d-flex flex-column text-center text-body-1">
      <span style="color: #A3A3A3">
        Já tem uma conta?
      </span>

      <a
        class="action-hover-primary" 
        @click="emits('onBack')">
        Clique aqui para fazer login
      </a>
    </div>
  </div>

  <div v-else class="flex-center flex-column">
    <v-icon size="2.5rem" color="#2895ff">
      mdi-check-circle-outline
    </v-icon>

    <h2 class="mt-4">
      Registro realizado com sucesso!
    </h2>

    <p class="text-body-1 mt-2">
      Aguarde enquanto redirecionamos você
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useCallerStore } from '@/store/caller';
import { useAuthStore } from '@/store/auth';

import { passwordStrength } from '@/utils/passwordStrength';

import { 
  required, 
  email as emailValidation 
} from '@/utils/validations';


// Emits
const emits = defineEmits([
  'onBack'
]);

const callerStore = useCallerStore();
const router = useRouter();

// Refs
const formEmail = ref();
const formPassword = ref();
const formName = ref();

const step = ref(0);
const isLoading = ref({
  checkUserBtn: false,
  finishBtn: false
});

const errorMessage = ref("");

const showPassword = ref(false);

const email = ref("");
const password = ref("");
const name = ref("");

// Validations
const nameLengthValidation = (v) => {
  return v.length <= 40 || 'O nome não deve exceder 40 caracteres.'
}

// Computeds
const stepNumber = computed(() => {
  return `Etapa ${step.value + 1} de 3`
});

const stepDescription = computed(() => {
  if(step.value === 0) return 'Digite o seu melhor e-mail'
  else if(step.value === 1) return 'Crie uma senha'
  else return 'Como podemos te chamar?'
});

// Hooks
watch(password, () => {
  checkPassword()
})

onMounted(() => {
  checkPassword()
})

// Methods
function onBack() {
  if(step.value) step.value--
  else emits('onBack')
}

async function onNextEmail() {
  const { valid } = await formEmail.value.validate();
  if(!valid) return;

  isLoading.value.checkUserBtn = true

  callerStore.fetchData({
    url: `Auth/UserExists?email=${email.value}`
  }).then((response) => {
    if(!callerStore.hasError && !response) {
      isLoading.value.checkUserBtn = false
      step.value++

      return
    } 
    else {
      if(callerStore.hasError) {
        errorMessage.value = 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.'
      }
      else {
        errorMessage.value = "Este endereço já está vinculado a uma conta existente. Pra continuar, faça login."
      }

      // When user inputs, clear error message
      formEmail.value.$el.addEventListener('input', () => {
        errorMessage.value = ""
      }, { once: true })
  
      isLoading.value.checkUserBtn = false
  
      return
    }
  })
}

function checkPassword() {
  // prevents whitespace
  password.value = password.value.trim()

  passwordStrength.forEach(criteria => {
    criteria.valid = criteria.validator(password.value)
  })
}

function passwordIsValid() {
  return !passwordStrength.find(x => !x.valid) || 'A senha não é forte o suficiente.'
}

async function onNextPassword() {
  const { valid } = await formPassword.value.validate();
  if(!valid) return;

  step.value++
}

async function onRegister() {
  const { valid } = await formName.value.validate();
  if(!valid) return;

  isLoading.value.finishBtn = true

  await callerStore.fetchData({
    method: 'post',
    url: 'Auth/Register',
    data: {
      email: email.value,
      password: password.value,
      name: name.value
    }
  })

  if(callerStore.hasError) return

  const { login } = useAuthStore();

  await login(email.value, password.value)

  if(callerStore.hasError) return

  step.value = 3

  setTimeout(() => {
    router.push({
      name: 'Home'
    })
  }, 3000);

}
</script>