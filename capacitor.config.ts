import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tellmemom.app',
  appName: 'Tell Me Mom',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    path: 'android'
  }
};

export default config;
