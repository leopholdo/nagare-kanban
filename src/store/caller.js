// Utilities
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';
import { useRouter } from 'vue-router';

export const useCallerStore = defineStore('caller', () => {  
  const router = useRouter();

  const hasError = ref(false)

  async function fetchData(opt) {

    hasError.value = false

    let method = opt.method ?? 'get'
    let headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'accept': '*/*'
    }

    if(opt.formData) headers['Content-Type'] = 'multipart/form-data'

    const { token } = useAuthStore();
    if(token) headers.Authorization = `Bearer ${token}`

    return await axios({
      method: method,
      headers: headers,
      url: `${import.meta.env.VITE_API_MAIN}/${opt.url}`,
      data: opt.data,
    }).then((response) => {
      return response.data

    }).catch((error) => {
      hasError.value = true;
      
      if(error.response?.data?.toString().includes('except')) {
        return error.response.data
      }
      else if(error.response.status === 401) {
        const { resetAuth } = useAuthStore();

        resetAuth();

        router.push({
          name: 'Auth'
        })

        return
      }
      else {
        return
      }
    });
  }

  return {
    fetchData,
    hasError
  }
})