<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Perfil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="p-4">
        <ion-avatar class="w-24 h-24 mx-auto mb-4">
          <img v-if="user?.photoURL" :src="user.photoURL" alt="Profile photo" />
          <ion-icon v-else :icon="personCircle" class="w-full h-full" />
        </ion-avatar>

        <ion-item>
          <ion-label position="stacked">Nome</ion-label>
          <ion-input v-model="displayName" type="text"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input v-model="email" type="email" readonly></ion-input>
        </ion-item>

        <div class="mt-4">
          <ion-button expand="block" @click="updateProfile">
            Salvar Alterações
          </ion-button>

          <ion-button expand="block" color="danger" @click="logout" class="mt-4">
            Sair
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonAvatar, IonIcon
} from '@ionic/vue';
import { personCircle } from 'ionicons/icons';
import { auth } from '@/firebase';
import { useRouter } from 'vue-router';
import { signOut, updateProfile } from 'firebase/auth';

const router = useRouter();
const user = ref(auth.currentUser);
const displayName = ref(user.value?.displayName || '');
const email = ref(user.value?.email || '');

const updateProfile = async () => {
  if (user.value) {
    try {
      await updateProfile(user.value, {
        displayName: displayName.value
      });
      // Mostrar mensagem de sucesso
    } catch (error) {
      // Tratar erro
      console.error('Erro ao atualizar perfil:', error);
    }
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    router.push('/login');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};
</script> 