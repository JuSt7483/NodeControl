import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { DeviceList } from "../components/DeviceList";
import { DiscoveredDevice, discoverDevices } from "../services/network";

export default function HomeScreen() {
  const [devices, setDevices] = useState<DiscoveredDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { theme, isDark } = useTheme();

  const handleDiscover = async () => {
    setIsLoading(true);
    setDevices([]);
    const foundDevices = await discoverDevices();
    setDevices(foundDevices);
    setIsLoading(false);
  };

  const handleDevicePress = (device: DiscoveredDevice) => {
    // TODO: Переход на экран устройства
    console.log("Переход на устройство:", device.ip);
    router.push({
      pathname: "/device/[ip]",
      params: {
        ip: device.ip,
        name: device.name,
      },
    });
  };

  useEffect(() => {
    handleDiscover();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Поиск устройств</Text>

      <DeviceList
        devices={devices}
        isLoading={isLoading}
        onDevicePress={handleDevicePress}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? "Идет поиск..." : "Искать снова"}
          onPress={handleDiscover}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
});
