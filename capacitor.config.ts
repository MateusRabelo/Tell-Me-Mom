import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tellmemom.app',
  appName: 'Tell Me Mom',
  webDir: 'public',
  server: {
    androidScheme: 'https'
  }
};

export default config;
