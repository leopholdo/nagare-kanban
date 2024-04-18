<template>
  <div 
    class="dialog-overlay"
    :class="[{'fullscreen': !smAndUp}]" 
    @click="isLoading.card ? null : emits('onClose')">
    <div @click.stop="">
      <v-card 
        class="main-card"         
        color="grey-darken-3"
        :fullscreen="smAndUp"
        :loading="isLoading.card"
        :width="mdAndUp ? '770px' : (smAndUp ? '600px' : '100vw')">
        <v-card-title>
          <v-row>
            <v-col cols="10" class="d-flex" style="gap: 13px">
              <div>
                <v-icon v-if="smAndUp">
                  mdi-card-text-outline
                </v-icon>

                <CloseBtn
                  v-else
                  @click="emits('onClose')"
                ></CloseBtn>
              </div>

              <div class="d-flex flex-column w-100">
                <input 
                  class="board-name-input w-100 text-h5 px-1"
                  type="text" 
                  v-model="name"
                  @blur="(props.card.name != name) ? cardHasChanged() : null"
                />

                <div class="d-flex" >
                  <span class="text-body-2 pl-1">
                    na lista 
                  </span>

                  <v-menu 
                    :close-on-content-click="false"
                    v-model="showModalMoveCard">
                    <template v-slot:activator="{ props }">
                      <span 
                        class="text-body-2 ml-1 text-decoration-underline action-hover"
                        v-bind="props">
                        {{ boardList?.name }}
                      </span>
                    </template>

                    <ModalMoveCard
                      :cardId="props.card.id"
                      :boardId="boardList?.boardId"
                      :boardLists="props.boardLists"
                      :boardListId="boardList?.id"
                      :position="props.card.position"
                      @onClose="showModalMoveCard = false"
                      @positionHasChanged="positionHasChanged"
                    ></ModalMoveCard>
                  </v-menu>
                </div>
              </div>
            </v-col>

            <v-col 
              cols="2" 
              class="d-flex justify-end">
              <CloseBtn
                v-if="smAndUp"
                @click="emits('onClose')"
              ></CloseBtn>

              <v-menu v-else>
                <template v-slot:activator="{ props }">
                  <MenuBtn v-bind="props"></MenuBtn>
                </template>

                <CardActionsMenu
                ></CardActionsMenu>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-title>
        
        <v-card-text>
          <div class="d-flex" style="gap: 20px">
            <div class="main-wrapper w-100">
              <div class="d-flex align-center mt-5" style="gap: 15px">
                <v-icon size="25">
                  mdi-text
                </v-icon>

                <span class="text-h6">
                  Descrição
                </span>
              </div>

              <div 
                v-if="showMarkdown && !description"
                class="description-markdown-wrapper my-2"
                @click="onClickMarkdown">
                Adicione uma descrição
              </div>

              <div v-else>
                <div 
                  v-if="showMarkdown"
                  class="description-markdown-wrapper my-2"
                  v-html="descriptionMarkdown"
                  @click="onClickMarkdown"
                ></div>
      
                <v-textarea
                  v-else
                  no-resize auto-grow
                  class="mt-2 description-field"
                  rounded="lg"
                  bg-color="grey-darken-3"
                  variant="solo-filled"
                  ref="descriptionField"
                  v-model="description"
                  @blur="handleBlurDescription"
                ></v-textarea>
              </div>
            </div>
            
            <div 
              class="right-panel-wrapper" 
              :style="{width: showRightPanel ? '280px' : '47px'}">
              <CardActions
                v-model:showActionsPanel="showRightPanel"
              ></CardActions>
            </div>
          </div>          
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { useCallerStore } from '@/store/caller';

import CardActions from './CardActions.vue';
import CardActionsMenu from './CardActionsMenu.vue';
import ModalMoveCard from './ModalMoveCard.vue'

// Props
const props = defineProps([
  'card',
  'boardLists'
])

// Emits
const emits = defineEmits([
  'onClose',
  'positionHasChanged',
  'cardHasChanged'
])

const callerStore = useCallerStore()
const { smAndUp, mdAndUp } = useDisplay()

const descriptionMarkdown = computed(() => marked(description.value))

// Refs
const isLoading = ref({
  card: false
})
const showRightPanel = ref(true)
const showMarkdown = ref(true)
const showModalMoveCard = ref(false)

const name = ref(props.card.name)
const description = ref(props.card.description)
const descriptionField = ref()
const boardList = ref()

// Hooks
onMounted(() => {
  boardList.value = props.boardLists.find(bl => bl.id === props.card.boardListId)
})

watch(() => props.card.boardListId, () => {
  boardList.value = props.boardLists.find(bl => bl.id === props.card.boardListId)
})

// Methods
async function cardHasChanged() {
  isLoading.value.card = true;

  await callerStore.fetchData({
    method: 'put',
    url: 'Card/UpdateCard',
    data: {
      id: props.card.id,
      name: name.value,
      description: description.value
    }
  }).then((response) => {

    if(callerStore.hasError || !response) return;

    emits('cardHasChanged', response)

    isLoading.value.card = false;
  })
}

function positionHasChanged(callback) {
  boardList.value = props.boardLists.find(bl => bl.id === props.card.boardListId)

  emits('positionHasChanged', callback)
}

function onClickMarkdown() {
  showMarkdown.value = false

  nextTick(() => {
    descriptionField.value.focus()
  })
}

async function handleBlurDescription() {
  if(description.value != props.card.description) {
    await cardHasChanged()
  }

  showMarkdown.value = true;
}
</script>

<style lang="scss" scoped>
.fullscreen {
  overflow-y: hidden !important;
  
  .main-card {
    border-radius: 0px !important;
    margin: 0 !important;
  }

  .right-panel-wrapper {
    display: none;
  }

  :deep(.v-card-title) {
    position: sticky;
  }

  :deep(.v-card-text) {
    overflow-y: auto !important;
    height: calc(100vh - 68px);
  }  
}

.dialog-overlay {
  display: flex;
  align-items: flex-start;
  background-color: #000000a3;
  height: 100%;
  justify-content: center;
  left: 0;
  overflow-y: auto;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1010;

  .main-card {
    padding: 5px;
    margin: 48px 0 80px;    
    position: relative;
  }
}

.board-name-input {
  font-size: 1.2rem;
  transition: background-color 0.2s;
  border-radius: 5px;
  text-overflow: ellipsis;
}
.board-name-input:hover {
  background-color: #717171;
}

.description-markdown-wrapper {
  cursor: pointer;
  padding: 1rem;
  min-height: 140px;
  border-radius: 10px;
  transition: background-color 0.2s;
  background-color: rgb(var(--v-theme-grey-darken-4), 0.4);

  :deep(ul) {
    padding-left: 40px;
  }
}
.description-markdown-wrapper:hover {
  background-color: rgb(var(--v-theme-grey-darken-4), 0.3);
}

.right-panel-wrapper {
  transition: width 0.5s;
}
</style>