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
            prepend-icon="mdi-palette"
            title="Cor do quadro" 
            @click="option = 'boardColor'">
            <template v-slot:append>
              <div 
                class="board-color" 
                :style="{ 'background-color': props.boardColor }"
              ></div>
            </template>
          </v-list-item>
          
          <!-- <v-list-item 
            prepend-icon="mdi-panorama-variant"
            title="Imagem de fundo" 
            @click="option = 'boardColor'">
            <template v-slot:append>
              <div class="board-color" :style="{ 'background-color': boardColor }"></div>
            </template>
          </v-list-item> -->
        </v-list>
      </div>

      <div v-else>
        <div v-if="option == 'boardColor'">
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
        </div>
      </div>
    </v-scroll-x-transition>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps([
  'showDrawer',
  'boardColor'
])

const emits = defineEmits([
  'onChange',
  'update:showDrawer'
])

const option = ref("")
const color = ref("")

const optionName = computed(() => {
  const options = {
    'boardColor': 'Cor do quadro '
  }

  return options[option.value] ?? 'Opções'
})

onMounted(() => {
  color.value = props.boardColor
})

function choseColor() {
  option.value = ""

  emits('onChange', {color: color.value})
  emits('update:showDrawer', false)
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
</style>