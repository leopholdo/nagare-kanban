<template>
  <div class="alert-overlay">
    <div class="alert-wrapper">
      <v-scroll-y-transition group>
        <v-alert
          v-for="alert in listAlerts"
          closable
          :key="alert.id"
          class="mb-2"
          width="400"
          border="start"
          variant="outlined"
          :type="alert.type"
          :border-color="alert.type"
          :title="alert.title"
          :text="alert.text"
          @click:close="alertStore.closeAlert(alert)"
        ></v-alert>
      </v-scroll-y-transition>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useAlertStore } from '@/store/alert';

const alertStore = useAlertStore()

const { listAlerts } = storeToRefs(alertStore)
</script>

<style lang="scss" scoped>
.alert-overlay {
  position: absolute;
  z-index: 3501;
  height: 100vh;
}

.alert-wrapper {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
</style>