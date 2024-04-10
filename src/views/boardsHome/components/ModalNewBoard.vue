<template>
  <v-dialog 
    v-model="props.show" 
    width="auto"
    :fullscreen="xs"
    @update:model-value="emits('update:show', false)">
    <v-card :width="xs ? null : 435">
      <div class="flex-center pa-4">
        <span class="mx-auto">
          Criar quadro
        </span>

        <CloseBtn
          @click="emits('update:show', false)"
        ></CloseBtn>
      </div>

      <v-card-text class="pb-8">
        <v-label>
          Plano de fundo
        </v-label>

        <v-item-group v-model="background" mandatory>
          <v-row dense>
            <v-col cols="auto" v-for="image in availableBackgrounds" :key="image">
              <v-item 
                :value="image"
                v-slot="{ isSelected, toggle }">
                <v-card
                  rounded="lg"
                  hover
                  height="55"
                  width="90"
                  @click="toggle">
                  <v-img 
                    height="55"
                    cover
                    :src="image + 'crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=100'">
                    <div class="flex-center h-100">
                      <v-icon v-if="isSelected">
                        mdi-check
                      </v-icon>
                    </div>               
                  </v-img>
                </v-card>
              </v-item>
            </v-col>

            <v-spacer class="mr-auto"></v-spacer>
          </v-row>

          <v-row dense>
            <v-col cols="auto" v-for="color in availableColors" :key="color">
              <v-item 
                :value="color"
                v-slot="{ isSelected, toggle }">
                <v-card
                  rounded="lg"
                  hover
                  height="55"
                  width="70"                  
                  :color="color"
                  @click="toggle">   
                  <div class="flex-center h-100">
                    <v-icon v-if="isSelected">
                      mdi-check
                    </v-icon>
                  </div>               
                </v-card>
              </v-item>
            </v-col>

            <v-spacer class="mr-auto"></v-spacer>
          </v-row>
        </v-item-group>

        <v-form 
          ref="formNewBoard"
          class="mt-4"
          @submit.prevent="createBoard">
          <v-label>
            Nome do quadro *
          </v-label>
          <v-text-field
            density="comfortable"
            :rules="[required]"
            v-model="boardName"
          ></v-text-field>

          <v-btn 
            block
            height="45"
            color="primary"
            type="submit"
            class="mt-10"
            :loading="isLoading.btnSubmit">
            Criar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

import { availableBackgrounds, availableColors } from '@/utils/boards';
import { required } from '@/utils/validations';

import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useCallerStore } from '@/store/caller';

// Refs
const emits = defineEmits([
  'update:show'
])

// Props
const props = defineProps([
  'show'
])

const { xs } = useDisplay()
const router = useRouter()
const callerStore = useCallerStore()

// Refs
const formNewBoard = ref()
const isLoading = ref({
  btnSubmit: false
})

const background = ref('#5b6265')
const boardName = ref()

// Methods
async function createBoard() {
  const { valid } = await formNewBoard.value.validate()
  if(!valid) return
  
  isLoading.value.btnSubmit = true

  let isColor = background.value.startsWith('#')

  callerStore.fetchData({
    method: 'post',
    url: 'Board/CreateBoard',
    data: {
      name: boardName.value,
      color: isColor ? background.value : '',
      backgroundImage: isColor ? '' : background.value
    }
  }).then((response) => {
    if(callerStore.hasError || !response) return

    isLoading.value.btnSubmit = false

    router.push({
      name: 'Board',
      params: {
        id: response.id
      }
    })
  })
}

</script>