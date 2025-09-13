import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: "MiLife-Purchase-Planner",
  slug: "mi-plannr-app",
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
  ios: {
    bundleIdentifier: "com.milife.plannr",
    supportsTablet: true,
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
      "projectId": "43381654-4a86-4b4b-9260-dd9216094fc3"
    }
  },
});
