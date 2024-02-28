<template>
  <div class="dialog-overlay" @click="emits('onClose')">
    <div @click.stop="">
      <v-card>
        <v-card-title>
          <v-row>
            <v-col sm="11" class="d-flex flex-column">
              <input 
                class="board-name-input w-100"
                type="text" 
                :value="props.name"
                @change="evt => emits('onChange', {name: evt.target.value})">

                <span class="text-caption ml-1">
                  na lista {{ props.listName }}
                </span>
            </v-col>

            <v-col sm="1" class="d-flex justify-end">
              <CloseBtn
                @click="emits('onClose')"
              ></CloseBtn>
            </v-col>
          </v-row>
        </v-card-title>
        
        <v-card-text>
          <div 
            v-if="showMarkdown"
            class="description-markdown-wrapper my-5"
            v-html="descriptionMarkdown"
            @click="onClickMarkdown"
          ></div>

          <v-textarea
            v-else
            no-resize auto-grow
            class="mt-5"
            variant="solo-filled"
            ref="descriptionField"
            v-model="description"
            @blur="showMarkdown = true"
            ></v-textarea>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'
import { nextTick } from 'vue';
import { ref, computed } from 'vue';

const props = defineProps([
  'name',
  'listName'
])

const emits = defineEmits([
  'onClose'
])

const descriptionMarkdown = computed(() => marked(description.value))

const showMarkdown = ref(true)
const description = ref('')
const descriptionField = ref()

function onClickMarkdown() {
  showMarkdown.value = false

  nextTick(() => {
    descriptionField.value.focus()
  })
}
</script>

<style lang="scss" scoped>
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

  .v-card {
    margin: 48px 0 80px;
    width: 750px;
    position: relative;
  }
}

.board-name-input {
  transition: background-color 0.2s;
  border-radius: 5px;
}
.board-name-input:hover {
  background-color: #5b5b5b3d;
}

.description-markdown-wrapper {
  cursor: pointer;
  padding: 1rem;
  min-height: 140px;
  border-radius: 5px;
  transition: background-color 0.2s;
  background-color: rgb(var(--v-theme-background), 0.2);

  :deep(ul) {
    padding-left: 40px;
  }
}
.description-markdown-wrapper:hover {
  background-color: rgb(var(--v-theme-background), 0.4);
}
</style>