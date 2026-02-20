import { getIpAddressAsync } from "expo-network";

export interface DiscoveredDevice {
  ip: string;
  name: string;
}

export const discoverDevices = async (): Promise<DiscoveredDevice[]> => {
  console.log("Начинаем сканирование сети...");

  const ipAddress = await getIpAddressAsync();
  console.log("IP-адрес устройства:", ipAddress);

  if (!ipAddress) {
    console.log("Не удалось получить IP-адрес устройства.");
    return [];
  }
  const subnet = ipAddress.substring(0, ipAddress.lastIndexOf("."));
  const promises: Promise<DiscoveredDevice | null>[] = [];

  for (let i = 1; i <= 254; i++) {
    const currentIp = `${subnet}.${i}`;
    if (currentIp === ipAddress) {
      continue;
    }

    promises.push(
      (async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 500);

          const response = await fetch(`http://${currentIp}/discovery`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            if (data && data.type === "NodeControlDevice") {
              console.log(`Найдено устройство: ${currentIp}`);
              return { ip: currentIp, name: data.name || "Arduino Device" };
            }
          }
          return null;
        } catch (error) {
          return null;
        }
      })(),
    );
  }

  const results = await Promise.all(promises);
  const foundDevices = results.filter(
    (device): device is DiscoveredDevice => device !== null,
  );

  console.log(
    `Сканирование завершено. Найдено ${foundDevices.length} устройств.`,
  );
  return foundDevices;
};
