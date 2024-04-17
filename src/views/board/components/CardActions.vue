<template>
  <div class="section-container">
    <v-card 
      @click="emits('update:showActionsPanel', !props.showActionsPanel)"
      class="options-card"
      density="compact"
      :prepend-icon="props.showActionsPanel ? 'mdi-arrow-right' : 'mdi-arrow-left'"
      title="Reduzir painel">
    </v-card>
  </div>

  <div class="mt-4 mb-2">
    <p class="text-no-wrap" :class="[{'d-none': !props.showActionsPanel}]">
      Adicionar ao cartão
    </p>
  </div>

  <div class="section-container">
    <v-card 
      @click=""
      class="options-card"
      density="compact"
      prepend-icon="mdi-tag-outline"
      title="Etiquetas">
    </v-card>
    
    <v-card 
      @click=""
      class="options-card"
      density="compact"
      prepend-icon="mdi-account"
      title="Membros">
    </v-card>

    <v-card 
      @click=""
      class="options-card"
      density="compact"
      prepend-icon="mdi-clock-outline"
      title="Datas">
    </v-card>

    <v-card 
      @click=""
      class="options-card"
      density="compact"
      prepend-icon="mdi-checkbox-marked-outline"
      title="Checklist">
    </v-card>
  </div>

  <div class="mt-4 mb-2">
    <p class="text-no-wrap" :class="[{'d-none': !props.showActionsPanel}]">
      Ações
    </p>
  </div>

  <div class="section-container">
    <v-card 
      @click=""
      class="options-card"
      density="compact"
      prepend-icon="mdi-arrow-right-box"
      title="Mover">
    </v-card>

    <v-card 
      @click=""
      class="options-card"
      density="compact"
      prepend-icon="mdi-package-down"
      title="Arquivar">
    </v-card>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps([
  'showActionsPanel'
])

const emits = defineEmits([
  'update:showActionsPanel'
])
</script>

<style lang="scss" scoped>
:deep(.v-btn__content) {
  overflow: hidden;
}

.options-card {
  background-color: rgb(var(--v-theme-grey-darken-4), 0.4);

  :deep(.v-card-item) {
    padding: 0px 10px !important;
    height: 100%;
  }

  // :deep(.v-card-item__prepend) {
  //   padding-inline-end: 0px !important;
  // }

  :deep(.v-card-title) {
    font-size: 0.9rem !important;
    font-weight: 400 !important;
  }
}

.section-container {
  gap: 8px;
  display: grid;
  grid-auto-rows: 40px;
}
</style>