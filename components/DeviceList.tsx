import { DiscoveredDevice } from "@/services/network";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DeviceListItem } from "./DeviceListItem";

interface DeviceListProps {
  devices: DiscoveredDevice[];
  isLoading: boolean;
  onDevicePress: (device: DiscoveredDevice) => void;
}

export const DeviceList = ({
  devices,
  isLoading,
  onDevicePress,
}: DeviceListProps) => {
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Идет поиск устройств...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={devices}
      keyExtractor={(item) => item.ip}
      renderItem={({ item }) => (
        <DeviceListItem device={item} onPress={() => onDevicePress(item)} />
      )}
      ListEmptyComponent={
        <View style={styles.centeredContainer}>
          <Text>Устройства не найдены</Text>
        </View>
      }
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    flexGrow: 1,
  },
});
