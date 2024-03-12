<template>
  <v-app-bar 
    app 
    height="50"
    class="app-bar d-flex justify-center">

    <router-link :to="{name: 'Home'}">
      <Logo :sm="true"></Logo>
    </router-link>

    <v-menu width="200">
      <template v-slot:activator="{ props }">
        <v-avatar
          class="user-avatar"
          color="grey darken-1 shrink"
          size="32"
          v-bind="props">
          <v-img
            v-if="user?.image"
            :src="user.image"
          ></v-img>

          <span v-else-if="user?.initials">
            {{ user.initials }}
          </span>

          <v-icon v-else>
            mdi-account
          </v-icon>
        </v-avatar>
      </template>

      <v-list density="compact">
        <v-list-item 
          :title="user.name" 
          :subtitle="user.email">
          <template #prepend>
            <v-avatar
              class="user-avatar"
              color="grey darken-1 shrink"
              size="32">
              <v-img
                v-if="user?.image"
                :src="user.image"
              ></v-img>
              
              <span v-else-if="user?.initials">
                {{ user.initials }}
              </span>

              <v-icon v-else>
                mdi-account
              </v-icon>
            </v-avatar>
          </template>          
        </v-list-item>

        <v-divider class="my-2"/>

        <v-list-item 
          link slim 
          prepend-icon="mdi-account"
          title="Perfil"
          @click="showProfile = true">
        </v-list-item>

        <v-list-item 
          link slim 
          prepend-icon="mdi-logout"
          title="Logout"
          @click="logout">
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <Account
    v-if="showProfile"
    v-model:show="showProfile"    
  ></Account>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/store/auth';
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';

import Logo from './Logo.vue';
import Account from './Account/Account.vue';

const router = useRouter();
const userStore = useUserStore();

const { user } = storeToRefs(userStore)
const showProfile = ref(false);

function logout() {
  const { resetAuth } = useAuthStore();

  resetAuth();

  router.push({
    name: 'Auth'
  })
}
</script>

<style scoped lang="scss">
a {
  text-decoration: none;
  color: #fff;
}

.v-toolbar__content {
  width: 100%;
}

input {
  outline: none;
}

.app-bar {
  // background: rgba(0, 118, 184, 15%);
  background: #243b47;
  color: #fff !important;
  padding: 0 5px;
}


.user-avatar {
  cursor: pointer;
  margin-left: auto;
}

@media (max-width: 700px){
  .user-name {
    display: none;
  }
  .user-info {
   background-color: unset;
  }
}

@keyframes animateBg {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 0%; }
}

.loading {
  position: fixed;
  top: 64px;
  height: 15px;
  width: 100vw;
  animation: animateBg 6s linear infinite;
}
</style>