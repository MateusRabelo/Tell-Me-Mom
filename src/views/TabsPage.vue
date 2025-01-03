<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="lists" href="/tabs/lists">
          <ion-icon :icon="listOutline" />
          <ion-label>Minhas Listas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="shared" href="/tabs/shared">
          <ion-icon :icon="peopleOutline" />
          <ion-label>Compartilhadas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon :icon="personOutline" />
          <ion-label>Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { listOutline, peopleOutline, personOutline } from 'ionicons/icons';
</script>
