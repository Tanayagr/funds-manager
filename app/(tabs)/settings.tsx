import { StyleSheet, Button, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/src/context/AuthContext";

export default function HomeScreen() {
  const { user, logOut } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to FundsBook</ThemedText>
      </ThemedView>
      <ThemedText>You are logged in as:</ThemedText>
      <ThemedText type="defaultSemiBold">{user?.email}</ThemedText>
      <View style={{ marginTop: 20 }}>
        <Button title="Log Out" onPress={logOut} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
});
