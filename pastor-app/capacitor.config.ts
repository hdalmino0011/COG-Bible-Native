import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.cog.tjrbible.pastor',
  appName: 'COG Minister Portal',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
