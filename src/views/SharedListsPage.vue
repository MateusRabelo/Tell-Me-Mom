<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Listas Compartilhadas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item-sliding v-for="list in sharedLists" :key="list.id">
          <ion-item :router-link="`/list/${list.id}`">
            <ion-label>
              <h2>{{ list.name }}</h2>
              <p>Compartilhado por: {{ list.ownerName }}</p>
            </ion-label>
          </ion-item>
          
          <ion-item-options>
            <ion-item-option color="danger" @click="leaveList(list.id)">
              <ion-icon :icon="exit" slot="icon-only"></ion-icon>
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
  IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption,
  IonIcon
} from '@ionic/vue';
import { exit } from 'ionicons/icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/firebase';

interface SharedList {
  id: string;
  name: string;
  ownerName: string;
}

const sharedLists = ref<SharedList[]>([]);

onMounted(async () => {
  if (auth.currentUser) {
    const q = query(
      collection(db, 'lists'),
      where('sharedWith', 'array-contains', auth.currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    sharedLists.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SharedList[];
  }
});

const leaveList = (listId: string) => {
  // Implementar função para deixar a lista compartilhada
};
</script> 