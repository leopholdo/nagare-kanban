<template>
  <v-list density="compact" bg-color="grey-darken-4">
    <v-list-subheader>Adicionar ao cartão</v-list-subheader>

    <v-list-item
      slim
      prepend-icon="mdi-tag-outline"
      title="Etiquetas">
    </v-list-item>
    
    <v-list-item
      slim
      prepend-icon="mdi-account"
      title="Membros">
    </v-list-item>

    <v-list-item
      slim
      prepend-icon="mdi-clock-outline"
      title="Datas">
    </v-list-item>

    <v-list-item
      slim
      prepend-icon="mdi-checkbox-marked-outline"
      title="Checklist">
    </v-list-item>

    <v-divider class="my-2"></v-divider>

    <v-list-subheader>Ações</v-list-subheader>
    
    <v-list-item
      slim
      prepend-icon="mdi-arrow-right-box"
      title="Mover">
    </v-list-item>

    <v-list-item
      slim
      prepend-icon="mdi-package-down"
      title="Arquivar">
    </v-list-item>
  </v-list>
</template>

<script setup>
import { defineEmits } from 'vue'

const emits = defineEmits([
  'update:showActionsPanel'
])
</script>

<style lang="scss" scoped>

</style>