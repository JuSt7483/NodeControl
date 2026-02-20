import React, { ReactNode, createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { Theme, darkTheme, lightTheme } from "../constants/theme";

// 1. Определяем, что будет храниться в нашем контексте
interface ThemeContextData {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

// 2. Создаем сам контекст с начальными "пустыми" значениями
const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

// 3. Создаем компонент-поставщик (Provider)
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Получаем системную тему пользователя (light/dark)
  const colorScheme = useColorScheme();

  // Храним текущую тему в состоянии. Начальное значение - системное.
  const [isDark, setIsDark] = useState(colorScheme === "dark");

  // Функция для переключения темы
  const toggleTheme = () => {
    setIsDark((previousState) => !previousState);
  };

  // Выбираем правильный объект с цветами в зависимости от состояния
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. Создаем кастомный хук для удобного использования
export const useTheme = () => {
  return useContext(ThemeContext);
};
