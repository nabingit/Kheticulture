import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kheticulture.app',
  appName: 'Kheticulture',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#22C55E",
      showSpinner: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: "#22C55E"
    }
  }
};

export default config;