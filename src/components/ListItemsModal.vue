<template>
  <ion-modal :is-open="isOpen" @didDismiss="$emit('update:isOpen', false)">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ list?.name }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('update:isOpen', false)">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Form para adicionar novo item -->
      <form @submit.prevent="addItem" class="mb-4">
        <ion-item>
          <ion-input
            v-model="newItemText"
            placeholder="Adicionar novo item"
            required
            clear-input
            @keyup.enter="addItem"
          ></ion-input>
          <ion-button type="submit" slot="end" :disabled="!newItemText.trim()">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-item>
      </form>

      <!-- Lista de items -->
      <ion-list>
        <ion-item-sliding v-for="item in sortedItems" :key="item.id">
          <ion-item>
            <ion-checkbox
              :checked="item.completed"
              @ionChange="toggleItem(item.id)"
              slot="start"
            ></ion-checkbox>
            <ion-label :class="{ 'line-through': item.completed }">
              {{ item.text }}
            </ion-label>
            <ion-note slot="end" class="item-date">
              {{ formatDate(item.createdAt) }}
            </ion-note>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="primary" @click="editItem(item)">
              <ion-icon :icon="pencil" slot="icon-only"></ion-icon>
            </ion-item-option>
            <ion-item-option color="danger" @click="confirmDelete(item)">
              <ion-icon :icon="trash" slot="icon-only"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonItem, IonInput, IonList,
  IonLabel, IonCheckbox, IonItemSliding, IonItemOptions,
  IonItemOption, IonIcon, alertController
} from '@ionic/vue';
import { close, add, pencil, trash } from 'ionicons/icons';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface ShoppingList {
  id: string;
  name: string;
  items: ListItem[];
}

const props = defineProps<{
  isOpen: boolean;
  list: ShoppingList | null;
}>();

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void;
  (e: 'listUpdated'): void;
}>();

const newItemText = ref('');
const localItems = ref<ListItem[]>([]);

// Sincronizar items locais quando a lista mudar
watch(() => props.list?.items, (newItems) => {
  if (newItems) {
    localItems.value = [...newItems];
  }
}, { immediate: true });

const logFirestore = (operation: string, data: any) => {
  console.log(`[Firestore ${operation}]`, data);
};

const addItem = async () => {
  if (!props.list || !newItemText.value.trim()) return;

  const newItem: ListItem = {
    id: Date.now().toString(),
    text: newItemText.value.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  try {
    logFirestore('Adding item', newItem);
    // Atualizar estado local primeiro
    localItems.value = [...localItems.value, newItem];
    
    // Limpar input
    newItemText.value = '';

    // Atualizar Firestore
    const listRef = doc(db, 'lists', props.list.id);
    await updateDoc(listRef, {
      items: localItems.value
    });
    logFirestore('Item added successfully', newItem);
    
    emit('listUpdated');
  } catch (error) {
    logFirestore('Error adding item', error);
    localItems.value = localItems.value.filter(item => item.id !== newItem.id);
  }
};

const toggleItem = async (itemId: string) => {
  if (!props.list) return;

  try {
    const listRef = doc(db, 'lists', props.list.id);
    const listDoc = await getDoc(listRef);
    
    if (!listDoc.exists()) {
      console.error('Lista não encontrada');
      return;
    }

    const items = [...props.list.items];
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      console.error('Item não encontrado');
      return;
    }

    // Criar uma cópia do item e atualizar o status
    const updatedItem = {
      ...items[itemIndex],
      completed: !items[itemIndex].completed
    };
    
    // Atualizar o array de items
    items[itemIndex] = updatedItem;

    // Atualizar apenas o campo items
    await updateDoc(listRef, {
      items: items
    });

    // Emitir evento de atualização
    emit('list-updated');
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    // Não mostrar alerta para não interromper a experiência do usuário
    // já que a operação pode ter funcionado mesmo com o erro
  }
};

const editItem = async (item: ListItem) => {
  const alert = await alertController.create({
    header: 'Editar Item',
    inputs: [
      {
        name: 'text',
        type: 'text',
        value: item.text,
        placeholder: 'Nome do item'
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Salvar',
        handler: async (data) => {
          if (!data.text.trim() || !props.list) return;

          try {
            // Atualizar estado local
            localItems.value = localItems.value.map(i => 
              i.id === item.id ? { ...i, text: data.text.trim() } : i
            );

            // Atualizar Firestore
            const listRef = doc(db, 'lists', props.list.id);
            await updateDoc(listRef, {
              items: localItems.value
            });
            
            emit('listUpdated');
          } catch (error) {
            console.error('Erro ao editar item:', error);
            // Reverter em caso de erro
            localItems.value = localItems.value.map(i => 
              i.id === item.id ? item : i
            );
          }
        }
      }
    ]
  });

  await alert.present();
};

const confirmDelete = async (item: ListItem) => {
  const alert = await alertController.create({
    header: 'Confirmar exclusão',
    message: 'Deseja realmente excluir este item?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: () => deleteItem(item)
      }
    ]
  });

  await alert.present();
};

const deleteItem = async (item: ListItem) => {
  if (!props.list) return;

  try {
    localItems.value = localItems.value.filter(i => i.id !== item.id);

    const listRef = doc(db, 'lists', props.list.id);
    await updateDoc(listRef, {
      items: localItems.value
    });
    
    emit('listUpdated');
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    // Reverter em caso de erro
    localItems.value = [...props.list.items];
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
};

const sortedItems = computed(() => {
  return [...localItems.value].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
  color: var(--ion-color-medium);
}

.item-date {
  font-size: 0.8em;
  color: var(--ion-color-medium);
}

.ion-item-sliding {
  transition: all 0.3s ease;
}

.completed {
  opacity: 0.7;
}
</style> 