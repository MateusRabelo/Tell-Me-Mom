<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Minhas Listas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="debugFirestore">
            <ion-icon :icon="bug"></ion-icon>
          </ion-button>
          <ion-button @click="openCreateModal">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="loading" class="flex justify-center items-center h-full">
        <ion-spinner></ion-spinner>
      </div>
      
      <div v-else-if="shoppingLists.length === 0" class="p-4 text-center">
        <p>Nenhuma lista encontrada</p>
        <p class="text-sm text-gray-500">Clique no + para criar uma nova lista</p>
      </div>
      
      <ion-list v-else>
        <ion-item-sliding v-for="list in shoppingLists" :key="list.id">
          <ion-item @click="openListItems(list)">
            <ion-label>
              <div class="flex items-center">
                <h2>{{ list.name }}</h2>
                <ion-badge v-if="!list.isOwner" color="tertiary" class="ml-2">Compartilhada</ion-badge>
              </div>
              <p>{{ list.items?.length || 0 }} items</p>
            </ion-label>
          </ion-item>
          
          <ion-item-options>
            <ion-item-option color="warning" @click="openEditModal(list)">
              <ion-icon :icon="pencil" slot="icon-only"></ion-icon>
            </ion-item-option>
            <ion-item-option color="primary" @click="shareList(list.id)">
              <ion-icon :icon="share" slot="icon-only"></ion-icon>
            </ion-item-option>
            <ion-item-option color="danger" @click="deleteList(list.id)">
              <ion-icon :icon="trash" slot="icon-only"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div v-if="showDebug" class="debug-overlay">
        <div class="debug-content">
          <ion-button fill="clear" @click="showDebug = false" class="close-button">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
          <pre class="debug-text">
Auth: {{ auth.currentUser?.uid }}
Lists: {{ JSON.stringify(shoppingLists, null, 2) }}
          </pre>
        </div>
      </div>
    </ion-content>

    <list-edit-modal
      v-model:is-open="showModal"
      :initial-name="selectedList?.name"
      :initial-public="selectedList?.isPublic"
      :mode="modalMode"
      @save="handleListSave"
    />

    <list-items-modal
      v-model:is-open="showItemsModal"
      :list="selectedList"
      @list-updated="loadLists"
    />
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButtons, IonButton,
  IonIcon, IonItemSliding, IonItemOptions, IonItemOption,
  IonSpinner
} from '@ionic/vue';
import { add, share, trash, bug, close, pencil } from 'ionicons/icons';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, arrayUnion, getDocs, getDoc, limit } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import ListEditModal from '@/components/ListEditModal.vue';
import { onAuthStateChanged } from 'firebase/auth';
import ListItemsModal from '@/components/ListItemsModal.vue';
import { useRouter } from 'vue-router';

interface ShoppingList {
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

const shoppingLists = ref<ShoppingList[]>([]);
const loading = ref(true);
const unsubscribe = ref<(() => void) | null>(null);
const initialized = ref(false);
const router = useRouter();

const loadLists = async () => {
  if (!auth.currentUser) return;

  try {
    loading.value = true;
    
    if (unsubscribe.value) {
      unsubscribe.value();
    }

    const q = query(
      collection(db, 'lists'),
      where('ownerId', '==', auth.currentUser.uid)
    );
    
    const unsubscribeSnapshot = onSnapshot(q, 
      (snapshot) => {
        shoppingLists.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ShoppingList[];
        loading.value = false;
      }, 
      (error) => {
        console.error('Erro ao carregar listas:', error);
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
      loadLists();
    }
  });

  onUnmounted(() => {
    unsubscribeAuth();
    if (unsubscribe.value) {
      unsubscribe.value();
    }
  });
});

const shareList = async (listId: string) => {
  try {
    const shareEmail = prompt('Digite o email para compartilhar:');
    if (!shareEmail) return;

    // Buscar o usuário pelo email primeiro
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', shareEmail), limit(1));
    const targetUserSnapshot = await getDocs(q);

    if (targetUserSnapshot.empty) {
      alert('Usuário não encontrado');
      return;
    }

    const targetUser = targetUserSnapshot.docs[0];
    const targetUserId = targetUser.id;

    // Verificar e atualizar a lista
    const listRef = doc(db, 'lists', listId);
    const listDoc = await getDoc(listRef);
    
    if (!listDoc.exists()) {
      alert('Lista não encontrada');
      return;
    }

    const listData = listDoc.data();
    
    // Verificar se o usuário atual é o dono
    if (listData.ownerId !== auth.currentUser?.uid) {
      alert('Você não tem permissão para compartilhar esta lista');
      return;
    }

    // Verificar se já está compartilhada
    const sharedWith = listData.sharedWith || [];
    if (sharedWith.includes(targetUserId)) {
      alert('Lista já compartilhada com este usuário');
      return;
    }

    // Atualizar a lista e o usuário em uma transação
    await updateDoc(listRef, {
      sharedWith: arrayUnion(targetUserId)
    });

    alert('Lista compartilhada com sucesso!');
  } catch (error) {
    console.error('Erro ao compartilhar lista:', error);
    alert('Erro ao compartilhar lista. Por favor, tente novamente.');
  }
};

const deleteList = async (listId: string) => {
  try {
    await deleteDoc(doc(db, 'lists', listId));
    shoppingLists.value = shoppingLists.value.filter(list => list.id !== listId);
  } catch (error) {
    console.error('Erro ao deletar lista:', error);
  }
};

const showModal = ref(false);
const selectedList = ref<ShoppingList | null>(null);
const modalMode = ref<'create' | 'edit'>('create');

const openCreateModal = () => {
  selectedList.value = null;
  modalMode.value = 'create';
  showModal.value = true;
};

const openEditModal = (list: ShoppingList) => {
  selectedList.value = list;
  modalMode.value = 'edit';
  showModal.value = true;
};

const handleListSave = async (data: { name: string; isPublic: boolean }) => {
  if (!auth.currentUser) {
    console.error('Usuário não autenticado');
    alert('Você precisa estar autenticado para criar listas');
    return;
  }

  try {
    if (modalMode.value === 'create') {
      const newList = {
        name: data.name,
        isPublic: data.isPublic,
        ownerId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: []
      };

      await addDoc(collection(db, 'lists'), newList);
      showModal.value = false;
    } else {
      // Editar lista existente
      if (!selectedList.value) {
        throw new Error('Nenhuma lista selecionada para edição');
      }

      const updates = {
        name: data.name,
        isPublic: data.isPublic,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'lists', selectedList.value.id), updates);
      showModal.value = false;
    }
  } catch (error) {
    console.error('Erro ao salvar lista:', error);
    alert('Erro ao salvar lista. Por favor, tente novamente.');
  }
};

const showDebug = ref(false);

const debugFirestore = async () => {
  showDebug.value = !showDebug.value;
  
  if (!auth.currentUser) {
    console.log('Usuário não autenticado');
    return;
  }

  console.log('Auth state:', {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email
  });

  try {
    const listsRef = collection(db, 'lists');
    const q = query(listsRef, where('ownerId', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    
    console.log('Lists:', snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  } catch (error) {
    console.error('Erro ao carregar listas:', error);
  }
};

const isDevelopment = import.meta.env.MODE === 'development';

const showItemsModal = ref(false);

const openListItems = (list: ShoppingList) => {
  selectedList.value = list;
  showItemsModal.value = true;
};
</script>

<style scoped>
.debug-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.debug-content {
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.debug-text {
  font-family: monospace;
  font-size: 12px;
  color: #fff;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style> 