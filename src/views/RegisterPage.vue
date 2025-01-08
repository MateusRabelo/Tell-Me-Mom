<template>
  <ion-page>
    <ion-content>
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <div class="flex flex-col items-center">
            <div class="w-24 h-20" v-html="logoSvg"></div>
            <h1 class="text-3xl font-bold text-primary">Tell Me Mom</h1>
          </div>
          <h2 class="mt-8 text-center text-2xl font-bold">
            Criar conta
          </h2>
        </div>

        <!-- Step 1: Nome e Email -->
        <div v-if="currentStep === 1" class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form class="space-y-6" @submit.prevent="nextStep">
            <ion-item>
              <ion-label position="stacked">Nome</ion-label>
              <ion-input 
                type="text" 
                v-model="displayName" 
                required
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input 
                type="email" 
                v-model="email" 
                required
              ></ion-input>
            </ion-item>

            <div>
              <button class="flex items-center justify-center w-full bg-blue-500 rounded-xl text-white py-3">
                Próximo
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2: Senhas -->
        <div v-else class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form class="space-y-6" @submit.prevent="handleRegister">
            <ion-item>
              <ion-label position="stacked">Senha</ion-label>
              <ion-input 
                type="password" 
                v-model="password" 
                required
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Confirmar Senha</ion-label>
              <ion-input 
                type="password" 
                v-model="confirmPassword" 
                required
              ></ion-input>
            </ion-item>

            <div class="space-y-3">
              <button 
                type="button"
                class="flex items-center justify-center w-full border border-blue-500 text-blue-500 rounded-xl py-3"
                @click="currentStep = 1"
              >
                Voltar
              </button>
              <button 
                type="submit"
                class="flex items-center justify-center w-full bg-blue-500 rounded-xl text-white py-3"
              >
                Registrar
              </button>
            </div>
          </form>
        </div>

        <p class="flex justify-center items-center mt-8 text-center text-sm text-gray-500">
          Já tem uma conta?
          <ion-button class="text-blue-500" fill="clear" @click="goToLogin">
            Entrar
          </ion-button>
        </p>

        <!-- Indicador de progresso -->
        <div class="flex justify-center mt-6 gap-2">
          <div 
            class="w-2 h-2 rounded-full"
            :class="currentStep === 1 ? 'bg-blue-500' : 'bg-gray-300'"
          ></div>
          <div 
            class="w-2 h-2 rounded-full"
            :class="currentStep === 2 ? 'bg-blue-500' : 'bg-gray-300'"
          ></div>
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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { logoSvg } from '@/assets/logo';

const router = useRouter();
const currentStep = ref(1);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const displayName = ref('');

const nextStep = () => {
  // Validar email
  if (!email.value || !displayName.value) {
    alert('Por favor, preencha todos os campos');
    return;
  }
  
  // Validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    alert('Por favor, insira um email válido');
    return;
  }

  currentStep.value = 2;
};

const handleRegister = async () => {
  try {
    if (password.value !== confirmPassword.value) {
      alert('As senhas não coincidem');
      return;
    }

    if (password.value.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email.value, 
      password.value
    );

    await updateProfile(userCredential.user, {
      displayName: displayName.value
    });

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      displayName: displayName.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photoURL: '',
      lists: []
    });

    router.push('/tabs/lists');
  } catch (error: any) {
    console.error('Erro no registro:', error.message);
    if (error.code === 'auth/email-already-in-use') {
      alert('Este email já está em uso');
      currentStep.value = 1; // Volta para o primeiro passo
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 