import { useCallback, useEffect, useState } from "react";
import { useToast } from "react-native-toast-notifications";
import { DiscoveredDevice, discoverDevices } from "../services/network";

// Этот хук инкапсулирует всю логику обнаружения устройств
export const useDeviceDiscovery = () => {
  const [devices, setDevices] = useState<DiscoveredDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // useCallback нужен, чтобы функция не создавалась заново при каждом рендере
  const scanNetwork = useCallback(async () => {
    console.log("Starting network scan...");
    setIsScanning(true);
    setError(null);
    setDevices([]); // Очищаем старые результаты перед новым сканированием
    try {
      const foundDevices = await discoverDevices();
      setDevices(foundDevices);
      if (foundDevices.length === 0) {
        toast.show("Устройства не найдены. Попробуйте еще раз.", {
          type: "warning",
          placement: "bottom",
          duration: 3000,
        });
      }
    } catch (err) {
      const message = "Ошибка при сканировании сети.";
      console.error(message, err);
      setError(message);
      toast.show(message, { type: "danger" });
    } finally {
      setIsScanning(false);
      console.log("Network scan finished.");
    }
  }, [toast]); // toast - зависимость, т.к. используется внутри

  // Запускаем сканирование один раз при первом монтировании компонента
  useEffect(() => {
    scanNetwork();
  }, [scanNetwork]);

  // Хук возвращает состояние и функцию для управления им
  return { devices, isScanning, error, scanNetwork };
};
