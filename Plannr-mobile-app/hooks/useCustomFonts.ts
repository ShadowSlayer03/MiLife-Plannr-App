// hooks/useCustomFonts.ts
import { useState, useEffect } from "react";
import * as Font from "expo-font";

export default function useCustomFonts() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      "kanit": require("../assets/fonts/Kanit/Kanit-Regular.ttf"),
      "kanit-bold": require("../assets/fonts/Kanit/Kanit-Bold.ttf"),
      "kanit-semibold": require("../assets/fonts/Kanit/Kanit-SemiBold.ttf"),
      "bricolage": require("../assets/fonts/Bricolage/BricolageGrotesque-Regular.ttf"),
      "bricolage-bold": require("../assets/fonts/Bricolage/BricolageGrotesque-Bold.ttf"),
      "bricolage-semibold": require("../assets/fonts/Bricolage/BricolageGrotesque-SemiBold.ttf"),
    }).then(() => setLoaded(true));
  }, []);

  return loaded;
}
