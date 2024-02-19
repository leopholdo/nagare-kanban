<template>
  <v-card width="400">
    <div class="v-card-title d-flex align-center">
      <BackBtn
        class="mr-1"
        @click="emits('onBack')"
      ></BackBtn>

      <span>
        Alterar senha
      </span>
    </div>

    <v-divider></v-divider>

    <v-form       
      ref="formPassword"
      class="py-5 px-4 d-flex flex-column" 
      validate-on="blur"
      @submit.prevent="onSave">
      <v-text-field
        variant="solo-filled"
        label="Senha atual"
        class="mt-4 mb-2"
        :rules="[required]"
        :type="show.oldPassword ? 'text' : 'password'"
        :append-inner-icon="show.oldPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="show.oldPassword = !show.oldPassword"
        v-model="oldPassword"
      ></v-text-field>

      <v-text-field
        variant="solo-filled"
        label="Nova senha"
        class="mt-4 mb-2"
        :rules="[required, passwordIsValid]"
        :type="show.newPassword ? 'text' : 'password'"
        :append-inner-icon="show.newPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="show.newPassword = !show.newPassword"
        v-model="newPassword"
      ></v-text-field>

      <v-text-field
        variant="solo-filled"
        label="Repita a nova senha"
        class="mt-4 mb-2"
        :rules="[required, passwordMatches]"
        :type="show.newPasswordConfirm ? 'text' : 'password'"
        :append-inner-icon="show.newPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="show.newPasswordConfirm = !show.newPasswordConfirm"
        v-model="newPasswordConfirm"
      ></v-text-field>

        <div class="mt-4">
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

      <v-row dense class="justify-end mt-4">
        <v-col cols="12" sm="6">
          <v-btn
            block
            class="my-2"
            variant="tonal"
            @click="emits('onBack')">
            Cancelar
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            block
            type="submit"
            color="success"
            class="my-2"
            :loading="isLoading.btnSubmit">
            Salvar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { required } from '@/utils/validations';
import { passwordStrength } from '@/utils/passwordStrength';

import { useAlertStore } from '@/store/alert';
import { useCallerStore } from '@/store/caller';

//Emits
const emits = defineEmits([
  'onBack',
])

const callerStore = useCallerStore();

// Refs
const formPassword = ref()
const isLoading = ref({
  btnSubmit: false
})

const show = ref({
  oldPassword: false,
  newPassword: false,
  newPasswordConfirm: false,
})

const oldPassword = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')

// Hooks
watch(newPassword, () => {
  checkPassword()
})

onMounted(() => {
  checkPassword()
})

// Methods
function checkPassword() {
  // prevents whitespace
  newPassword.value = newPassword.value.trim()

  passwordStrength.forEach(criteria => {
    criteria.valid = criteria.validator(newPassword.value)
  })
}

function passwordIsValid() {
  return !passwordStrength.find(x => !x.valid) || 'A senha não é forte o suficiente.'
}

function passwordMatches() {
  return newPassword.value === newPasswordConfirm.value || 'A nova senha não confere.'
}

async function onSave() {
  const { valid } = await formPassword.value.validate()
  if(!valid) return

  isLoading.value.btnSubmit = true

  callerStore.fetchData({
    method: 'put',
    url: 'User/UpdatePassword',
    data: {
      password: oldPassword.value,
      newPassword: newPassword.value
    }
  }).then((response) => {
    const { newAlert } = useAlertStore();

    if(callerStore.hasError) {     
      isLoading.value.btnSubmit = false

      if(response === 'except_password_incorrect') {
        newAlert({
          type: 'warning',
          title: 'Atenção',
          text: 'A senha atual não confere. Por favor, tente novamente.'
        })

        return
      }
    }

    newAlert({
      text: 'Senha atualizada com sucesso.'
    })
    
    isLoading.value.btnSubmit = false
    emits('onBack')
  })

}
</script>