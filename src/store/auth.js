// Utilities
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCallerStore } from './caller';
import { useUserStore } from './user';

export const useAuthStore = defineStore('auth', () => {
  
  const token = ref(localStorage.getItem('token'));

  async function login(email, password) {
    const { fetchData } = useCallerStore();
    const { setUser } = useUserStore();

    return await fetchData({
      method: 'post',
      url: 'Auth/Login',
      data: {
        Email: email,
        Password: password
      }
    }).then(async (response) => {
      if(!response) return

      if(response.token) {
        token.value = response.token
        localStorage.setItem('token', response.token)

        setUser(response.user.name, response.user.email)

        return
      }
      
      return response
    })
  }

  function resetAuth() {
    const {setUser} = useUserStore();

    token.value = ""

    localStorage.setItem('token', "")

    setUser("", "")
  }

  return {
    token,
    login,
    resetAuth
  }
})
