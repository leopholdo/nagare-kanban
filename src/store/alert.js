// Utilities
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAlertStore = defineStore('alert', () => {
  
  const listAlerts = ref([])

  function newAlert(alert) {

    let id = 0
    let ids = listAlerts.value.map(x => x.id)

    if(ids.length)
      id = Math.max(...ids) + 1

    let obj = {
      id: id,
      type: alert.type || 'success',
      title: alert.title || '',
      text: alert.text || '',
      timeout: alert.timeout || 3000
    }

    listAlerts.value.push(obj)

    setTimeout(() => {
      closeAlert(obj)
    }, obj.timeout)
  }

  function closeAlert(alert) {
    let index = listAlerts.value.indexOf(alert)

    listAlerts.value.splice(index, 1)
  }

  return {
    listAlerts,
    newAlert,
    closeAlert
  }
})