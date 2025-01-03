<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Listas Compartilhadas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="loading" class="flex justify-center items-center h-full">
        <ion-spinner></ion-spinner>
      </div>
      
      <div v-else-if="sharedLists.length === 0" class="p-4 text-center">
        <p>Nenhuma lista compartilhada encontrada</p>
      </div>
      
      <ion-list v-else>
        <ion-item v-for="list in sharedLists" :key="list.id" @click="openListItems(list)">
          <ion-label>
            <h2>{{ list.name }}</h2>
            <p>{{ list.items?.length || 0 }} items</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>

    <list-items-modal
      v-model:is-open="showItemsModal"
      :list="selectedList"
      @list-updated="loadSharedLists"
    />
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonSpinner
} from '@ionic/vue';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ListItemsModal from '@/components/ListItemsModal.vue';
import { useRouter } from 'vue-router';

interface SharedList {
  id: string;
  name: string;
  isPublic: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
  }>;
}

const router = useRouter();
const sharedLists = ref<SharedList[]>([]);
const loading = ref(true);
const unsubscribe = ref<(() => void) | null>(null);
const showItemsModal = ref(false);
const selectedList = ref<SharedList | null>(null);

const loadSharedLists = async () => {
  if (!auth.currentUser) return;

  try {
    loading.value = true;
    
    if (unsubscribe.value) {
      unsubscribe.value();
    }

    const q = query(
      collection(db, 'lists'),
      where('sharedWith', 'array-contains', auth.currentUser.uid)
    );
    
    const unsubscribeSnapshot = onSnapshot(q, 
      (snapshot) => {
        sharedLists.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SharedList[];
        loading.value = false;
      }, 
      (error) => {
        console.error('Erro ao carregar listas compartilhadas:', error);
        alert('Erro ao carregar listas. Por favor, recarregue a página.');
        loading.value = false;
      }
    );
    
    unsubscribe.value = unsubscribeSnapshot;
  } catch (error) {
    console.error('Erro ao configurar listener:', error);
    loading.value = false;
  }
};

onMounted(() => {
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push('/login');
    } else {
      loadSharedLists();
    }
  });

  onUnmounted(() => {
    unsubscribeAuth();
    if (unsubscribe.value) {
      unsubscribe.value();
    }
  });
});

const openListItems = (list: SharedList) => {
  selectedList.value = list;
  showItemsModal.value = true;
};
</script> 