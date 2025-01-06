<template>
  <ion-page>
    <ion-content>
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 class="mt-10 text-center text-2xl font-bold leading-9">
            Entre na sua conta
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form class="space-y-6" @submit.prevent="handleLogin">
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input 
                type="email" 
                v-model="email" 
                required
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Senha</ion-label>
              <ion-input 
                type="password" 
                v-model="password" 
                required
              ></ion-input>
            </ion-item>

            <div>
              <ion-button expand="block" type="submit">Entrar</ion-button>
            </div>
          </form>

          <p class="mt-10 text-center text-sm text-gray-500">
            Não tem uma conta?
            <ion-button fill="clear" @click="goToRegister">
              Registre-se
            </ion-button>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, IonContent, IonItem, IonLabel, 
  IonInput, IonButton 
} from '@ionic/vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

const router = useRouter();
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/tabs/lists');
  } catch (error: any) {
    console.error('Erro no login:', error.message);
    // Adicionar tratamento de erro aqui
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script> 