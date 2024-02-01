<template>
  <div>
    <div class="d-flex text-body-1 align-center mb-5">
      <v-icon 
        size="2rem" 
        class="action-hover" 
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
        type="submit">
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
        variant="solo-filled"
        label="Nome"
        density="default"
        :rules="[required]"
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
        class="action-hover" 
        @click="emits('onBack')">
        Clique aqui para fazer login
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

import { 
  required, 
  email as emailValidation 
} from '@/utils/validations';

const emits = defineEmits([
  'onBack'
]);

const formEmail = ref();
const formPassword = ref();
const formName = ref();

const step = ref(0);
const isLoading = ref({
  checkUserBtn: false,
  finishBtn: false
});

const showPassword = ref(false);
const passwordStrength = ref([]);

const email = ref("");
const password = ref("");
const name = ref("");

const stepNumber = computed(() => {
  return `Etapa ${step.value + 1} de 3`
});

const stepDescription = computed(() => {
  if(step.value === 0) return 'Digite o seu melhor e-mail'
  else if(step.value === 1) return 'Crie uma senha'
  else return 'Como podemos te chamar?'
});

onMounted(() => {
  passwordStrength.value = [
    {
      type: 'letter',
      label: '1 letra',
      valid: false,
      validator: ((password) => { return password.match(/[a-zA-Z]+/) != null})
    },
    {
      type: 'number',
      label: '1 número',
      valid: false,
      validator: ((password) => { return password.match(/\d+/) != null })
    },
    {
      type: 'special',
      label: '1 caractere especial (exemplo: # ? ! &)',
      valid: false,
      validator: ((password) => { return password.match(/[^a-zA-Z0-9\s]/) != null })
    },
    {
      type: 'character',
      label: '10 caracteres',
      valid: false,
      validator: ((password) => { return password.length >= 10 })
    }
  ]
})

function onBack() {
  if(step.value) step.value--
  else emits('onBack')
}

async function onNextEmail() {
  const { valid } = await formEmail.value.validate();
  if(!valid) return;

  isLoading.value.checkUserBtn = true

  step.value++
}

function passwordIsValid() {
  // prevents whitespace
  password.value = password.value.trim()

  passwordStrength.value.forEach(criteria => {
    criteria.valid = criteria.validator(password.value)
  })

  return !passwordStrength.value.find(x => !x.valid) || 'A senha não é forte o suficiente.'
}

async function onNextPassword() {
  const { valid } = await formPassword.value.validate();
  if(!valid) return;

  step.value++
}

async function onRegister() {
  const { valid } = await formName.value.validate();
  if(!valid) return;

  
}
</script>