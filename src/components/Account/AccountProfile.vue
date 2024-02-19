<template>
  <v-card width="400" v-if="!showEditImage">
    <div class="v-card-title d-flex align-center">
      <BackBtn
        class="mr-1"
        @click="emits('onBack')"
      ></BackBtn>

      <span>
        Alterar perfil
      </span>
    </div>

    <v-divider></v-divider>

    <v-form       
      ref="formProfile"
      class="py-5 px-4 d-flex flex-column" 
      @submit.prevent="onSave">
      <div 
        class="avatar-wrapper my-2" 
        @click="inputFile.click()">
        <div class="badge-change-image">
          <v-icon size="30">
            mdi-image-edit-outline
          </v-icon>

          <input
            type="file"
            ref="inputFile"
            class="d-none"
            @change="uploadImage($event)"
            accept="image/*"
          />
        </div>
        
        <v-avatar
          class="user-avatar"
          color="grey-darken-2"
          size="200">
          <v-img
            v-if="image"
            :src="image.src"
          ></v-img>
          
          <span v-else-if="user?.initials">
            {{ initials }}
          </span>

          <v-icon size="100" v-else>
            mdi-account
          </v-icon>
        </v-avatar>
      </div>
      
      <v-text-field
        variant="solo-filled"
        label="Nome"
        class="mt-4 mb-2"
        v-model="name"
        :rules="[required]"
      ></v-text-field>
    
      <v-text-field
        variant="solo-filled"
        label="Email"
        class="my-2"
        v-model="email"
        :rules="[required, emailValidation]"
      ></v-text-field>

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

  <AccountProfileImage 
    v-else
    @onBack="() => {
      imageUpload.value = {}
      showEditImage = false
    }"
    @onCrop="onCrop"
    :image="imageUpload"
  ></AccountProfileImage>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { required, email as emailValidation } from '@/utils/validations';

import { useCallerStore } from '@/store/caller';
import { useUserStore } from '@/store/user';
import { useAlertStore } from '@/store/alert';

import AccountProfileImage from './AccountProfileImage.vue';

//Emits
const emits = defineEmits([
  'onBack',
])

// Props
const props = defineProps ([
  'user'
])

// Stores
const callerStore = useCallerStore()
const { newAlert } = useAlertStore()

// Refs
const inputFile = ref()
const formProfile = ref()
const isLoading = ref({
  btnSubmit: false
})

const showEditImage = ref(false)

const name = ref('')
const email = ref('')
const image = ref({})
const imageUpload = ref({})
const imageCanvas = ref()

// Methods
function uploadImage(event) {
  imageUpload.value = {}

  const { files } = event.target;
  if (files && files[0]) {
    if (imageUpload.value.src) {
      URL.revokeObjectURL(image.src);
    }
    const blob = URL.createObjectURL(files[0]);

    imageUpload.value.src = blob;
    imageUpload.value.type = files[0].type;

    showEditImage.value = true
  }
}

function onCrop(canvas) {
  image.value.src = canvas.toDataURL(imageUpload.value.type)
  imageCanvas.value = canvas

  imageUpload.value.src = {}
  showEditImage.value = false
}

async function onSave() {
  const { valid } = await formProfile.value.validate()
  if(!valid) return  

  isLoading.value.btnSubmit = true

  let response = await callerStore.fetchData({
    method: 'put',
    url: 'User/Update',
    data: {
      name: name.value,
      email: email.value
    }
  })

  if(!response || callerStore.hasError) {
    if(response === 'except_email_already_registered') {
      newAlert({
        timeout: 5000,
        type: 'warning',
        title: 'Atenção',
        text: 'Este endereço de e-mail já está vinculado a uma conta existente.'
      })
    }
    
    isLoading.value.btnSubmit = false
    return
  }

  const { setUser, setUserImage } = useUserStore()

  setUser(response.name, response.email)

  if(imageCanvas.value) {
    const form = new FormData()

    const blob = await new Promise(resolve => imageCanvas.value.toBlob(resolve));

    form.append('Image', blob)

    response = await callerStore.fetchData({
      method: 'put',
      url: 'User/UpdateUserImage',
      formData: true,
      data: form
    })

    if(!response || callerStore.hasError) {
      isLoading.value.btnSubmit = false
      return
    }

    setUserImage(response.contentType, response.image)
  }

  isLoading.value.btnSubmit = false

  emits('onBack')  
}

// Lifecycle Hooks
onMounted(() => {
  if(props.user)
    name.value = props.user.name
    email.value = props.user.email
    image.value.src = props.user.image
})
</script>

<style lang="scss" scoped>
.avatar-wrapper {
  align-self: center;
  position: relative;
  cursor: pointer;
}

.badge-change-image {
  position: absolute;
  padding: 10px;
  right: 0;
  bottom: 0;
  z-index: 2;
  border-radius: 50%;
  background: #424242;
  transition: background-color 0.4s;
}
.avatar-wrapper:hover {
  .badge-change-image {
    background-color: #757575;
  }
}
</style>