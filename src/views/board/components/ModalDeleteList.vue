<template>
  <v-card :width="xs ? null : 320">
    <div class="flex-center pt-3 px-2">
      <BackBtn
        @click="emits('update:show', false)"
      ></BackBtn>

      <span class="mx-auto">
        Transferir cards
      </span>
    </div>

    <v-card-text class="pb-5">
      <p class="text-body-1 text-medium-emphasis text-justify">
        Selecione uma lista para transferir os cards desta lista.
      </p>

      <v-select
        return-object
        class="mt-2"
        item-value="id"
        item-title="name"
        :items="availableBoardLists"
        v-model="targetBoardList"
      ></v-select>

      <p class="text-body-1 text-medium-emphasis text-justify mt-5">
        Você deseja adicionar os quadros ao topo ou ao final da lista?
      </p>

      <v-radio-group
        inline
        class="mt-2"
        v-model="order">
        <v-radio
          label="Topo"
          value="top"
        ></v-radio>
        
        <v-radio        
          class="ml-2"
          label="Final"
          value="bottom"
        ></v-radio>
      </v-radio-group>

      <v-btn
        block
        class="mt-2"
        color="primary"
        :disabled="!targetBoardList"
        :loading="isLoading.btnSubmit"
        @click="onSubmit">
        Transferir e excluir
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import { useDisplay } from 'vuetify';
import { useCallerStore } from '@/store/caller';
import { useAlertStore } from '@/store/alert';

// Refs
const emits = defineEmits([
  'update:show',
  'onTransferCards'
])

// Props
const props = defineProps([
  'show',
  'boardLists',
  'selectedBoardList'
])

const { xs } = useDisplay()

// Stores
const callerStore = useCallerStore()
const alertStore = useAlertStore()

// Refs
const isLoading = ref({
  btnSubmit: false
})
const availableBoardLists = ref([])
const targetBoardList = ref()
const order = ref('top')

onMounted(() => {
  availableBoardLists.value = props.boardLists.filter(
    bl => bl.id != props.selectedBoardList.id
  )
})

// Methods
async function onSubmit() {
  isLoading.value.btnSubmit = true
  
  let url = 'Card/TransferCards?' +
    `origin=${props.selectedBoardList.id}&` +
    `target=${targetBoardList.value.id}&` +
    `top=${order.value === 'top'}`

  await callerStore.fetchData({
    method: 'put',
    url: url
  })
  
  if(callerStore.hasError) {
    isLoading.value.btnSubmit = false
    return
  }

  await callerStore.fetchData({
    method: 'delete',
    url: `BoardList/DeleteBoardList/${props.selectedBoardList.id}`,
  })

  if(callerStore.hasError) return
  
  emits('onTransferCards', {
    callback: () => {
      isLoading.value.btnSubmit = false

      const cardsCount = props.selectedBoardList.cards.length

      alertStore.newAlert({
        timeout: 9000,
        title: `Lista ${props.selectedBoardList.name} excluída com sucesso`,
        text: `${cardsCount} ${cardsCount > 1 ? 'cards foram adicionados' : 'card foi adicionado'} 
          ao ${order.value === 'top' ? 'topo' : 'final'} da lista 
          ${targetBoardList.value.name}.`
      })
    }
  })
}
</script>