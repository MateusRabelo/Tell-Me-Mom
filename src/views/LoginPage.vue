<template>
  <ion-page>
    <ion-content>
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <div class="flex flex-col items-center gap-4">
            <div class="w-24 h-24" v-html="logoSvg"></div>
            <h1 class="text-3xl font-bold text-primary">Tell Me Mom</h1>
          </div>
          
          <h2 class="mt-10 text-center text-2xl font-bold">
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

          <p class="flex justify-center items-center mt-10 text-center text-sm text-gray-500">
            Não tem uma conta?
            <ion-button class="text-blue-500" fill="clear" @click="goToRegister">
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
import { logoSvg } from '@/assets/logo';

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