<template>
  <ion-page>
    <ion-content>
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <div class="flex flex-col items-center gap-4">
            <!-- SVG Logo -->
            <div class="w-24 h-24" v-html="logoSvg"></div>
            <h1 class="text-3xl font-bold text-primary">Tell Me Mom</h1>
          </div>
          
          <h2 class="mt-10 text-center text-2xl font-bold leading-9">
            Criar conta
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form class="space-y-6" @submit.prevent="handleRegister">
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input type="email" v-model="email" required></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Senha</ion-label>
              <ion-input type="password" v-model="password" required></ion-input>
            </ion-item>

            <div>
              <ion-button expand="block" type="submit">Registrar</ion-button>
            </div>
          </form>

          <p class="flex justify-center items-center mt-10 text-center text-sm text-gray-500">
            Já tem uma conta?
            <ion-button fill="clear" @click="goToLogin">
              Entrar
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
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { logoSvg } from '@/assets/logo';

const router = useRouter();
const email = ref('');
const password = ref('');

const handleRegister = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email.value, 
      password.value
    );

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      displayName: '',
      photoURL: '',
      lists: []
    });

    router.push('/tabs/lists');
  } catch (error: any) {
    console.error('Erro no registro:', error.message);
    if (error.code === 'auth/email-already-in-use') {
      alert('Este email já está em uso');
    } else if (error.code === 'auth/weak-password') {
      alert('A senha deve ter pelo menos 6 caracteres');
    } else {
      alert('Erro ao criar conta. Por favor, tente novamente.');
    }
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script> 