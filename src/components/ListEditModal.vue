<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ mode === 'create' ? 'Nova Lista' : 'Editar Lista' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Nome da Lista</ion-label>
        <ion-input 
          v-model="listName" 
          placeholder="Digite o nome da lista"
          required
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-label>Lista Pública</ion-label>
        <ion-toggle v-model="isPublic"></ion-toggle>
      </ion-item>

      <ion-button 
        expand="block" 
        class="ion-margin-top" 
        @click="saveList"
        :disabled="!listName"
      >
        {{ mode === 'create' ? 'Criar' : 'Salvar' }}
      </ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonToggle,
  IonButton,
  IonButtons
} from '@ionic/vue';

const props = defineProps<{
  isOpen: boolean;
  initialName?: string;
  initialPublic?: boolean;
  mode: 'create' | 'edit';
}>();

const emit = defineEmits(['update:isOpen', 'save']);

const listName = ref(props.initialName || '');
const isPublic = ref(props.initialPublic || false);

const closeModal = () => {
  emit('update:isOpen', false);
};

const saveList = () => {
  emit('save', {
    name: listName.value,
    isPublic: isPublic.value
  });
  closeModal();
};
</script> 