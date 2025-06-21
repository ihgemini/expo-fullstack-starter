import { useColorScheme as useNativewindColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";

const THEME_STORAGE_KEY = "user-theme-preference";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from storage on app start
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (
          storedTheme &&
          (storedTheme === "light" || storedTheme === "dark")
        ) {
          setColorScheme(storedTheme);
        } else {
          // If no preference stored, use system preference
          const systemTheme = Appearance.getColorScheme() ?? "light";
          setColorScheme(systemTheme);
          await AsyncStorage.setItem(THEME_STORAGE_KEY, systemTheme);
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
        // Fallback to light theme
        setColorScheme("light");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeTheme();
  }, [setColorScheme]);

  // Custom setColorScheme that persists to storage
  const setAndPersistColorScheme = async (theme: "light" | "dark") => {
    try {
      setColorScheme(theme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Custom toggle that persists to storage
  const toggleAndPersistColorScheme = async () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    await setAndPersistColorScheme(newTheme);
  };

  return {
    colorScheme: colorScheme ?? "light",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme: setAndPersistColorScheme,
    toggleColorScheme: toggleAndPersistColorScheme,
    isInitialized, // Can be used to show loading state while theme is being loaded
  };
}
