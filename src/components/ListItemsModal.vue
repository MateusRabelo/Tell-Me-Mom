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
          <ion-item :class="{ 'completed': item.completed }">
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
watch(
  () => props.list?.items,
  (newItems) => {
    if (newItems) {
      localItems.value = [...newItems];
    }
  },
  { deep: true, immediate: true }
);

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
    // Atualizar estado local primeiro para feedback imediato
    localItems.value = [...localItems.value, newItem];
    
    // Limpar input
    newItemText.value = '';

    // Atualizar Firestore
    const listRef = doc(db, 'lists', props.list.id);
    await updateDoc(listRef, {
      items: localItems.value
    });
    
    emit('listUpdated');
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    // Reverter em caso de erro
    localItems.value = localItems.value.filter(item => item.id !== newItem.id);
  }
};

const toggleItem = async (itemId: string) => {
  if (!props.list) return;

  try {
    // Encontrar o item no array local
    const itemIndex = localItems.value.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    // Criar uma cópia atualizada do item
    const updatedItem = {
      ...localItems.value[itemIndex],
      completed: !localItems.value[itemIndex].completed
    };

    // Atualizar o array local imediatamente para feedback instantâneo
    localItems.value = localItems.value.map(item => 
      item.id === itemId ? updatedItem : item
    );

    // Atualizar no Firestore
    const listRef = doc(db, 'lists', props.list.id);
    await updateDoc(listRef, {
      items: localItems.value
    });

    // Emitir evento de atualização
    emit('listUpdated');
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    // Reverter em caso de erro
    if (props.list) {
      localItems.value = [...props.list.items];
    }
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
    // Atualizar estado local primeiro
    localItems.value = localItems.value.filter(i => i.id !== item.id);

    // Atualizar Firestore
    const listRef = doc(db, 'lists', props.list.id);
    await updateDoc(listRef, {
      items: localItems.value
    });
    
    emit('listUpdated');
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    // Reverter em caso de erro
    if (props.list) {
      localItems.value = [...props.list.items];
    }
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
    // Primeiro critério: itens completados vão para o final
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Segundo critério: ordenar por data de criação (mais recentes primeiro)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
  color: var(--ion-color-medium);
  font-style: italic;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.item-date {
  font-size: 0.8em;
  color: var(--ion-color-medium);
}

ion-item-sliding {
  transition: all 0.3s ease;
}

/* Adicionar animação suave para a transição */
ion-item {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Estilo para itens completados */
ion-item.completed {
  --ion-item-background: var(--ion-color-light);
}

/* Estilo para o texto do item completado */
ion-item.completed ion-label {
  text-decoration: line-through;
  color: var(--ion-color-medium);
  font-style: italic;
  opacity: 0.7;
}

/* Animação para quando o item é marcado como completado */
@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

.item-sliding-animated {
  animation: slideDown 0.3s ease;
}
</style> 