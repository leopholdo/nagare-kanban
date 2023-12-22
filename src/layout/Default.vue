<template>
  <v-app>
    <app-bar></app-bar>

    <slot>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </slot>
  </v-app>
</template>

<script setup>
  import AppBar from '@/components/AppBar.vue';
</script>