<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted, onUnmounted } from 'vue';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // Verificar estado de autenticação quando o app iniciar
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (user && rememberMe) {
      // Só redireciona se estiver em uma rota pública
      const publicRoutes = ['/', '/login', '/register'];
      if (publicRoutes.includes(router.currentRoute.value.path)) {
        router.push('/tabs/lists');
      }
    }
  });

  // Limpar listener quando o componente for desmontado
  onUnmounted(() => {
    unsubscribe();
  });
});
</script>
