import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

import { useTheme } from "../../contexts/ThemeContext";

interface ToggleControlProps {
  label: string;
  initialValue: boolean;
  endpoint: string;
  deviceIp: string;
}

export const ToggleControl = ({
  label,
  initialValue,
  endpoint,
  deviceIp,
}: ToggleControlProps) => {
  // 1. Получаем текущую тему из контекста
  const { theme } = useTheme();

  const [isEnabled, setIsEnabled] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleValueChange = async (newValue: boolean) => {
    // Оптимистичное обновление UI
    setIsEnabled(newValue);
    setIsLoading(true);
    try {
      const response = await fetch(`http://${deviceIp}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue }),
      });
      if (!response.ok) {
        throw new Error("Server responded with an error");
      }
      // Успех, ничего не делаем
    } catch (error) {
      // В случае ошибки - откатываем UI и показываем уведомление
      setIsEnabled(!newValue);
      toast.show("Ошибка: не удалось изменить состояние", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Стили теперь создаются внутри компонента, чтобы иметь доступ к 'theme'
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.card, // Используем цвет карточки из темы
      borderRadius: 12,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border, // Используем цвет границы из темы
    },
    label: {
      fontSize: 18,
      fontWeight: "500",
      color: theme.text, // Используем цвет текста из темы
      flex: 1,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    activityIndicator: {
      marginRight: 10,
    },
    // 4. Увеличиваем переключатель для лучшей видимости
    switch: {
      transform:
        Platform.OS === "ios" ? [] : [{ scaleX: 1.3 }, { scaleY: 1.3 }],
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.switchContainer}>
        {isLoading && <ActivityIndicator style={styles.activityIndicator} />}
        <Switch
          style={styles.switch}
          trackColor={{ false: "#767577", true: theme.primary }} // 3. Используем основной цвет темы
          thumbColor={"#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleValueChange}
          value={isEnabled}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};
