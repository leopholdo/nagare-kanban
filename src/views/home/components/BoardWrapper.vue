<template>
  <div class="d-flex justify-center">
    <div class="board-wrapper">
      <span class="mx-4 wrapper-title">
        <v-icon class="mr-1"> {{ icon }} </v-icon>
        {{ name }}
      </span>

    <div class="ma-4" v-for="board in list" :key="board.name">
      <v-hover v-slot="{ hover }">
        <v-card hover
          :color="board.color" 
          height="100" width="250">
          <div :style="{ backgroundImage: 'url(' + board.background + ')' }" class="board-image">
            <v-card-title>{{board.name}}</v-card-title>

            <v-card-actions>
              <v-slide-x-reverse-transition>
                <v-icon 
                  v-if="hover || board.favorite"
                  @click="onClickFavorite(board)">>
                  {{ board.favorite ? 'mdi-heart' : 'mdi-heart-outline' }}
                </v-icon>
              </v-slide-x-reverse-transition>
            </v-card-actions>
          </div>
        </v-card>
      </v-hover>              
    </div>
    
    <div class="ma-4" v-if="showNewBoard">
      <v-card hover 
        color="#ebebeb"
        class="new-card"
        height="100" width="250"
        @click="newBoard = true"
        v-click-outside="{
          handler: onClickOutsideNB
        }">
        <div v-if="newBoard" class="pa-1 d-flex include" style="width: 100%">
          <input 
            class="include"
            type="text" 
            placeholder="Digite o nome"
            v-model="newBoardName">

            <v-btn icon>
              <v-icon color="white">mdi-check</v-icon>
            </v-btn>
        </div>

        <v-card-title v-else>+ Novo quadro</v-card-title>
      </v-card>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'BoardWrapper',

  props: {
    icon: {
        type: String,
        default: "mdi-grid"
    },
    name: String,
    list: Array,
    showNewBoard: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    newBoard: false,
    newBoardName: "",    
  }),

  methods: {
    onClickOutsideNB() {
      this.newBoard = false;
    },
    onClickFavorite(board) {
      this.$emit('onFavorite', board)
    }
  }
};
</script>

<style lang="scss" scoped>
.board-wrapper {
  width: 1128px;
  display: flex;
  flex-wrap: wrap;
}

@media screen and (max-width: 1264px) {
  .board-wrapper{
    width: 846px;
  }
}
@media screen and (max-width: 886px) {
  .board-wrapper{
    width: 564px;
  }
}
@media screen and (max-width: 604px) {
  .board-wrapper *:not(.wrapper-title *){
    width: 100% !important;
  }
}

.v-card__actions{
  justify-content: flex-end;
}

.wrapper-title {
  display: flex;
  align-items: center;
  flex-basis: 100%;
  font-size: 1.3rem;
  font-weight: 500;
}

.board-image {
  height: 100%;
  width: 100%;
  background-size: cover;
  color: white
}

.new-card {
  display: flex;
  align-items: center;
  justify-content: center;
	background: linear-gradient(-45deg, #00d4ff, #46b0ca, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	animation: gradient 10s ease infinite;
  color: white !important;
  input {
    color: white;
    text-align: center;
    width: 100%;
  }
}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
</style>