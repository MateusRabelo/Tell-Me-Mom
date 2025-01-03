<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Minhas Listas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="createNewList">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item-sliding v-for="list in shoppingLists" :key="list.id">
          <ion-item :router-link="`/list/${list.id}`">
            <ion-label>
              <h2>{{ list.name }}</h2>
              <p>{{ list.items?.length || 0 }} items</p>
            </ion-label>
          </ion-item>
          
          <ion-item-options>
            <ion-item-option color="primary" @click="shareList(list.id)">
              <ion-icon :icon="share" slot="icon-only"></ion-icon>
            </ion-item-option>
            <ion-item-option color="danger" @click="deleteList(list.id)">
              <ion-icon :icon="trash" slot="icon-only"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButtons, IonButton,
  IonIcon, IonItemSliding, IonItemOptions, IonItemOption
} from '@ionic/vue';
import { add, share, trash } from 'ionicons/icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/firebase';

interface ShoppingList {
  id: string;
  name: string;
  items?: any[];
}

const shoppingLists = ref<ShoppingList[]>([]);

onMounted(async () => {
  if (auth.currentUser) {
    const q = query(
      collection(db, 'lists'),
      where('ownerId', '==', auth.currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    shoppingLists.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ShoppingList[];
  }
});

const createNewList = () => {
  // Implementar criação de nova lista
};

const shareList = (listId: string) => {
  // Implementar compartilhamento
};

const deleteList = (listId: string) => {
  // Implementar deleção
};
</script> 