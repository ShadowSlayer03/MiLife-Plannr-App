import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: "MiLife-Purchase-Planner",
  slug: "MiLife-Purchase-Planner",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "milife-plannr",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.milife.plannr",
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#4c2889",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/icon.png",
  },
  assetBundlePatterns: ["**/*"],
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash.png",
        resizeMode: "cover",
        backgroundColor: "#4c2889",
      },
    ],
    "expo-font",
  ],
  experiments: {
    typedRoutes: true,
  },

  // <- This is how you add env vars to be accessible in your app
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    "eas": {
      "projectId": "210c5d68-2170-4198-b5b8-e3e2d59f092b"
    }
  },
});
