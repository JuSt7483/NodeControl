import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Switch, Text, View } from "react-native";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

function HeaderLogo({ isDark }: { isDark: boolean }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8, // Современный способ задать отступ между элементами
      }}
    >
      <Ionicons
        name="share-social" // Или "git-network", "layers", "stats-chart"
        size={24}
        color={isDark ? "#58A6FF" : "#007AFF"}
      />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: isDark ? "#FFFFFF" : "#000000",
          letterSpacing: -0.5,
        }}
      >
        NodeControl
      </Text>
    </View>
  );
}
// Этот компонент нужен, чтобы использовать хук useTheme() ВНУТРИ ThemeProvider.
function AppContent() {
  // Получаем все необходимое из нашего контекста
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <>
      {/* Управляем цветом системной строки состояния (время, батарея) */}
      <StatusBar style={isDark ? "light" : "dark"} />
      {/* Настраиваем глобальный вид для всех экранов в навигаторе */}
      <Stack
        screenOptions={{
          headerBackButtonDisplayMode: "minimal",
          headerTitle: () => <HeaderLogo isDark={isDark} />,

          // Фон шапки
          headerStyle: { backgroundColor: theme.card },
          // Цвет текста и иконок в шапке
          headerTintColor: theme.text,
          // Фон основного контента приложения
          contentStyle: { backgroundColor: theme.background },
          // Добавляем кнопку справа в шапку
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={18}
                color={isDark ? "white" : "orange"}
                style={{ marginLeft: 10 }}
              />
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDark ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                style={{ marginLeft: 8 }}
              />
            </View>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ title: "Поиск устройств" }} />
      </Stack>
    </>
  );
}

// Корневой компонент макета
export default function RootLayout() {
  // Оборачиваем все приложение в ThemeProvider, чтобы он мог "раздавать" тему
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
