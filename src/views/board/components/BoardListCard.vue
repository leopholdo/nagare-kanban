<template>
  <v-card hover class="mb-2">
    <v-card-title class="font-weight-normal">
      {{ props.name }}
    </v-card-title>
  </v-card>
</template>

<script setup>
const props = defineProps([
  'name'
])
</script>

<style lang="scss" scoped>
  .v-card-title {
    font-size: 0.9rem !important;
    font-weight: normal !important;
  }
</style>