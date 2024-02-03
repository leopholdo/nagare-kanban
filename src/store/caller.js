// Utilities
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';

export const useCallerStore = defineStore('caller', () => {
  const hasError = ref(false)

  async function fetchData(opt) {
    hasError.value = false

    let method = opt.method ?? 'get'
    let headers = {
      'Content-Type': 'application/json',
      'accept': '*/*'
    }

    const { token } = useAuthStore();
    if(token) headers.Authentication = `Bearer ${token}`

    return await axios({
      method: method,
      headers: headers,
      url: `${import.meta.env.VITE_API_MAIN}/${opt.url}`,
      data: opt.data,
    }).then((response) => {
      return response.data

    }).catch((error) => {
      hasError.value = true;
      
      if(error.response?.data?.toString().includes('except')) 
        return error.response.data
      else 
        return
    });
  }

  return {
    fetchData,
    hasError
  }
})