<template>
  <v-navigation-drawer 
    temporary 
    location="right"
    width="350"
    :model-value="props.showDrawer" 
    @update:modelValue="emits('update:showDrawer', false)">
    <div class="d-flex align-center pa-2 pt-3">
      <v-icon 
        v-show="option"
        class="action-hover-primary"
        size="large"
        @click="option = ''">
        mdi-chevron-left
      </v-icon>

      <span class="ml-auto">
        {{ optionName }}
      </span>

      <v-icon 
        class="action-hover-primary ml-auto mr-1" 
        style="height: 28px;"
        @click="emits('update:showDrawer', false)">
        mdi-window-close
      </v-icon>
    </div>

    <v-scroll-x-transition leave-absolute>
      <div v-if="!option">
        <v-list density="comfortable">
          <v-list-item 
            prepend-icon="mdi-image-edit"
            title="Plano de fundo" 
            @click="option = 'customization'">
          </v-list-item>

          <v-list-item 
            prepend-icon="mdi-minus-circle-outline"
            title="Fechar quadro" 
            @click="option = 'closeBoard'">
          </v-list-item>

          <!-- <v-list-item 
            prepend-icon="mdi-palette"
            title="Cor do quadro" 
            @click="option = 'boardColor'">
            <template v-slot:append>
              <div 
                class="board-color" 
                :style="{ 'background-color': props.boardColor }"
              ></div>
            </template>
          </v-list-item> -->
        </v-list>
      </div>

      <div v-else>
        <!-- <div v-if="option == 'boardColor'">
          <v-color-picker      
            width="100%"
            show-swatches 
            v-model="color">
          </v-color-picker>
          
          <div class="px-2">
            <v-btn 
              block 
              color="success" 
              class="mt-4"
              @click="choseColor">
              <v-icon>mdi-check</v-icon>
              Escolher
            </v-btn>
          </div>
        </div> -->
      
        <div v-if="option == 'customization'" class="mx-4 pt-2">
          <v-item-group v-model="background">
            <v-row dense>
              <v-col cols="auto" v-for="image in availableBackgrounds" :key="image">
                <v-item 
                  :value="image"
                  v-slot="{ isSelected, toggle }">
                  <v-card
                    rounded="lg"
                    hover
                    height="60"
                    width="100"
                    @click="toggle">
                    <v-img 
                      height="60"
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
                    width="73"                  
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

              <!-- <v-col cols="auto">
                <v-card
                  rounded="lg"
                  hover
                  height="55"
                  width="73"
                  color="#00d4ff">
                  <div class="flex-center h-100">
                    <v-icon>
                      mdi-palette-outline
                    </v-icon>
                  </div>
                </v-card>
              </v-col> -->

              <v-spacer class="mr-auto"></v-spacer>
            </v-row>
          </v-item-group>
          
          <v-btn 
            block 
            color="success" 
            class="mt-5"
            prepend-icon="mdi-check"
            :disabled="!background"
            :loading="isLoading.btnChangeBackground"
            @click="chooseBackground">
            Escolher
          </v-btn>
        </div>

        <div v-else-if="option == 'closeBoard'" class="mx-4 pt-4">
          <p>
            Tem certeza que deseja fechar o quadro?
          </p>
          <p class="mt-2">
            Você pode encontrar e reabrir quadros fechados na 
            <router-link :to="{name: 'Home'}">
              sua página de quadros
            </router-link>
          </p>
          <v-btn 
            block 
            color="error" 
            class="mt-5"
            :disabled="!background"
            :loading="isLoading.btnCloseBoard"
            @click="closeBoard">
            Fechar
          </v-btn>
        </div>
      </div>
    </v-scroll-x-transition>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { availableBackgrounds, availableColors } from '@/utils/boards';

// Props
const props = defineProps([
  'showDrawer',
  'boardColor',
  'background'
])

// Emits
const emits = defineEmits([
  'update:showDrawer',
  'onChangeBackground',
  'onCloseBoard'
])

// Refs
const isLoading = ref({
  btnChangeBackground: false
})

const option = ref('')
const color = ref('')
const background = ref('')

// Hooks
const optionName = computed(() => {
  const options = {
    // 'boardColor': 'Cor do quadro ',
    'customization': 'Plano de fundo',
    'closeBoard': 'Fechar quadro',
  }

  return options[option.value] ?? 'Opções'
})

watch(() => props.background, (val) => {
  background.value = val
})

onMounted(() => {
  color.value = props.boardColor

  background.value = props.background
})

// Methods
function chooseBackground() {
  isLoading.value.btnChangeBackground = true
  
  const isColor = background.value.startsWith('#')

  emits('onChangeBackground', {
    obj: {
      color: isColor ? background.value : '',
      backgroundImage: isColor ? '' : background.value
    },
    callback: () => {
      isLoading.value.btnChangeBackground = false
      option.value = ""
      emits('update:showDrawer', false)
    }
  })
}

function closeBoard() {
  isLoading.value.btnCloseBoard = true

  emits('onCloseBoard')
}
</script>

<style lang="scss" scoped>
.board-color {
  margin-left: auto;
  width: 20px;
  height: 20px;
  border-radius: 50px;
  border: 1px solid #666;
}

a {
  color: #4a98ed;
  text-decoration: none;
  transition: color 0.3s;
}
a:hover {
  color: #7cbaed !important;
}
</style>