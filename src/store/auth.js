// Utilities
import { defineStore } from 'pinia';
import { useCallerStore } from './caller';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  
  const user = ref(JSON.parse(localStorage.getItem('user')));
  const token = ref(localStorage.getItem('token'));

  async function login(email, password) {
    const { fetchData } = useCallerStore();

    return await fetchData({
      method: 'post',
      url: 'Auth/Login',
      data: {
        Email: email,
        Password: password
      }
    }).then((response) => {
      if(!response) return

      if(response.token) {
        token.value = response.token
        user.value = response.user

        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))

        return
      }
      debugger;
      
      return response
    })
  }

  function resetAuth() {
    token.value = ""
    user.value = ""

    localStorage.setItem('token', "")
    localStorage.setItem('user', {})
  }

  return {
    token,
    user,
    login,
    resetAuth
  }
})
