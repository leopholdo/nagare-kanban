// Utilities
import { defineStore } from 'pinia';
import { useCallerStore } from './caller';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  
  const user = ref(JSON.parse(localStorage.getItem('user')));

  const callerStore = useCallerStore();

  async function getUserImage() {    
    return await callerStore.fetchData({
      url: 'User/GetLoggedUserImage'
    }).then((response) => {
      if(!response || callerStore.hasError) return

      setUserImage(response.contentType, response.image)
    })
  }

  function setUserImage(contentType, imageBase64) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
      
    const image = new Image();

    image.crossOrigin = "";
    image.src = `data:${contentType};base64,${imageBase64}`

    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      ctx.drawImage(image, 0, 0);      

      user.value.image = canvas.toDataURL()

      localStorage.setItem("user", JSON.stringify(user.value));
    };
  }

  function setUser(name, email) {
    if(name && email) {
      let initials = ""
      let splitName = name.split(" ")
  
      initials = splitName[0].substring(0, 1).toUpperCase()
  
      if(splitName.length > 1) {
        initials += splitName[splitName.length - 1].substring(0, 1).toUpperCase()
      }

      user.value = {
        ...user.value,
        ...{
          name: name,
          email: email  
        }
      }
  
      localStorage.setItem("user", JSON.stringify(user.value))

    } else {
      localStorage.setItem("user", JSON.stringify({}))
    }
  }

  return {
    user,
    getUserImage,
    setUserImage,
    setUser
  }
})
