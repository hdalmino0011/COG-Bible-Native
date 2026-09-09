import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.cog.tjrbible',
  appName: 'COG (T.J.R) Bible',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
