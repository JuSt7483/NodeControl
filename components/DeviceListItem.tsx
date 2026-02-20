import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext"; // 1. Импортируем хук темы
import { DiscoveredDevice } from "../services/network";

interface DeviceListItemProps {
  device: DiscoveredDevice;
  onPress: () => void;
}

export const DeviceListItem = ({ device, onPress }: DeviceListItemProps) => {
  // 2. Получаем объект темы
  const { theme } = useTheme();

  // 3. Стили теперь создаются внутри, чтобы использовать тему
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.card, // Используем цвет карточки из темы
      padding: 20,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: theme.border, // Используем цвет границы из темы
    },
    deviceInfo: {
      flex: 1,
    },
    deviceName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text, // Используем цвет текста из темы
    },
    deviceIp: {
      fontSize: 14,
      color: theme.textSecondary, // Используем вторичный цвет текста
      marginTop: 4,
    },
    icon: {
      marginLeft: 15,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceIp}>{device.ip}</Text>
      </View>
      <Ionicons
        name="chevron-forward-outline"
        size={24}
        color={theme.textSecondary} // Иконка тоже использует цвет из темы
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};
