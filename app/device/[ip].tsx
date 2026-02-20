import { ToggleControl } from "@/components/controls/ToggleControl";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface Capability {
  id: string;
  type: string;
  label: string;
  endpoint: string;
  value?: any;
  min?: number;
  max?: number;
}

export default function DeviceControlScreen() {
  const { ip, name } = useLocalSearchParams<{ ip: string; name: string }>();

  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { theme } = useTheme();

  useEffect(() => {
    if (!ip) return;

    const fetchCapabilities = async () => {
      try {
        console.log(`Запрашиваем возможности у ${ip}...`);
        const response = await fetch(`http://${ip}/capabilities`);
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.statusText}`);
        }
        const data = await response.json();
        setCapabilities(data);
      } catch (e: any) {
        console.error(`Ошибка при получении возможностей: ${e.message}`);
        setError(
          "Не удалось загрузить данные об устройстве. Убедитесь, что оно в сети.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCapabilities();
  }, [ip]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Загрузка возможностей устройства...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{name}</Text>
      <Text style={[styles.textIp, { color: theme.text }]}>{ip}</Text>
      {capabilities.map((cap) => {
        switch (cap.type) {
          case "toggle":
            return (
              <ToggleControl
                key={cap.id}
                label={cap.label}
                initialValue={cap.value as boolean}
                endpoint={cap.endpoint}
                deviceIp={ip!} // Мы уверены, что ip здесь есть
              />
            );
          default:
            // Для будущих типов элементов управления
            return (
              <View key={cap.id} style={styles.capabilityItem}>
                <Text>Неизвестный тип управления: {cap.type}</Text>
              </View>
            );
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  capabilityItem: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  textIp: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
