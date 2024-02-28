<template>
  <div class="d-flex justify-center">
    <div class="board-wrapper">
      <span class="mx-4 wrapper-title">
        <v-icon 
          size="1.5rem"
          class="mr-1"> 
          {{ icon }} 
        </v-icon>
        {{ name }}
      </span>

      <v-fade-transition group leave-absolute>
        <div class="ma-4" v-for="board in list" :key="board.name">
          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <v-card 
                hover
                v-bind="props"
                :color="board.color" 
                height="100" width="250"
                @click="onClickBoard(board.id)">
                <div 
                  :style="{ backgroundImage: 'url(' + board.backgroundImage + ')' }" 
                  class="board-image">
                  <v-card-title class="board-name">
                    {{board.name}}
                  </v-card-title>

                  <v-card-actions class="justify-end">
                    <v-slide-x-transition>
                      <v-icon 
                        class="icon-star"
                        v-if="isHovering || board.favorite"
                        @click.stop="onClickFavorite(board)">>
                        {{ board.favorite ? 'mdi-star' : 'mdi-star-outline' }}
                      </v-icon>
                    </v-slide-x-transition>
                  </v-card-actions>
                </div>
              </v-card>
            </template>
          </v-hover>              
        </div>
      </v-fade-transition>
    
      <div class="ma-4" v-if="showNewBoard">
        <v-card hover 
          color="#ebebeb"
          class="new-card"
          height="100" width="250"
          @click="emits('onClickNew')">

          <v-card-title>+ Novo quadro</v-card-title>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Props
const props = defineProps({
  name: String,
  list: Array,
  icon: {
    type: String,
    default: "mdi-grid"
  },
  showNewBoard: {
    type: Boolean,
    default: true
  }
})

// Emits
const emits = defineEmits([
  'onClickBoard',
  'onFavorite',
  'onClickNew'
])

const router = useRouter()

// Methods 
function onClickBoard(id) {
  emits('onClickBoard', id)
  
  router.push({
    name: 'Board',
    params: {
      id: id
    }
  })
}

function onClickFavorite(board) {
  emits('onFavorite', board)
}
</script>

<style lang="scss" scoped>
.wrapper-title {
  display: flex;
  align-items: center;
  flex-basis: 100%;
  font-size: 1.3rem;
  font-weight: 400;
}

.board-image {
  height: 100%;
  width: 100%;
  background-size: cover;
  color: #fff
}

.board-name {
  text-shadow: 1px 1px 5px #616161;
}

.icon-star {
  text-shadow: 0px 0px 10px #616161;
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