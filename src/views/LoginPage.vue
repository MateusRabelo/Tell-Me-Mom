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
            Entre na sua conta
          </h2>
        </div>
        <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
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
              <div class="flex items-center justify-start gap-1 pt-[-10px] pb-10">
                <ion-checkbox v-model="rememberMe"></ion-checkbox>
                <span>Manter Conectado</span>
              </div>
              <button class="flex items-center justify-center w-full bg-blue-500 rounded-xl text-white py-3">Entrar</button> <!-- Removido pt-10 para centralizar o texto -->
            </div>
          </form>
 
          <p class="flex justify-center items-center mt-8 text-center text-sm text-gray-500">
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
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IonPage, IonContent, IonItem, IonLabel, 
  IonInput, IonButton, IonCheckbox
} from '@ionic/vue';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '@/firebase';
import { logoSvg } from '@/assets/logo';
import { onAuthStateChanged } from 'firebase/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);

const handleLogin = async () => {
  try {
    console.log('Estado inicial do rememberMe:', rememberMe.value);
    console.log('Preferência salva anteriormente:', localStorage.getItem('rememberMe'));

    // Define a persistência com base na escolha do usuário
    const persistenceType = rememberMe.value ? browserLocalPersistence : browserSessionPersistence;
    console.log('Tipo de persistência escolhido:', rememberMe.value ? 'LOCAL' : 'SESSION');
    
    await setPersistence(auth, persistenceType);
    console.log('Persistência definida com sucesso');
    
    // Faz o login
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log('Login realizado com sucesso para:', userCredential.user.email);
    
    // Salva a preferência do usuário
    localStorage.setItem('rememberMe', rememberMe.value.toString());
    console.log('Preferência salva no localStorage:', {
      rememberMe: localStorage.getItem('rememberMe'),
      authUser: auth.currentUser?.email,
      persistenceType: rememberMe.value ? 'LOCAL' : 'SESSION'
    });
    
    router.push('/tabs/lists');
  } catch (error: any) {
    console.error('Erro no login:', {
      code: error.code,
      message: error.message,
      rememberMe: rememberMe.value,
      persistenceType: rememberMe.value ? 'LOCAL' : 'SESSION'
    });

    if (error.code === 'auth/invalid-credential') {
      alert('Email ou senha inválidos');
    } else {
      alert('Erro ao fazer login. Por favor, tente novamente.');
    }
  }
};

// Recupera a preferência salva ao carregar o componente
const initRememberMe = () => {
  const savedPreference = localStorage.getItem('rememberMe');
  console.log('Inicializando rememberMe:', {
    savedPreference,
    currentAuthState: auth.currentUser?.email
  });
  
  if (savedPreference !== null) {
    rememberMe.value = savedPreference === 'true';
    console.log('Preferência carregada:', rememberMe.value);
  }
};

// Adicionar um watcher para monitorar mudanças no rememberMe
watch(rememberMe, (newValue) => {
  console.log('rememberMe alterado para:', newValue);
});

// Monitorar mudanças no estado de autenticação
onMounted(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log('Estado de autenticação alterado:', {
      isLoggedIn: !!user,
      userEmail: user?.email,
      rememberMe: localStorage.getItem('rememberMe')
    });
  });

  // Limpar o listener quando o componente for desmontado
  onUnmounted(() => {
    unsubscribe();
  });
});

// Chama a função de inicialização
initRememberMe();

const goToRegister = () => {
  router.push('/register');
};
</script> 