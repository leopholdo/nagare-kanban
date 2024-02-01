<template>
  <v-app>
    <slot>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </slot>
  </v-app>
</template>

<script setup>
</script>