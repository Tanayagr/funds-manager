import React, { useMemo, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBookShelves } from "@/src/context/BookShelfContext";

const Library = () => {
  const { bookShelves, createBookShelf, deleteBookShelf } = useBookShelves();
  const { user, logOut } = useAuth();
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"lastUpdated" | "name" | "createdAt">(
    "lastUpdated",
  );

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    let list = bookShelves.filter((b) => b.name.toLowerCase().includes(s));
    if (sortBy === "name")
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "lastUpdated")
      list = list.sort((a, b) => b.lastUpdated - a.lastUpdated);
    else if (sortBy === "createdAt")
      list = list.sort((a, b) => b.createdAt - a.createdAt);
    return list;
  }, [bookShelves, search, sortBy]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.row}>
          <TextInput
            placeholder="Search books..."
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
          <Button title="Logout" onPress={logOut} />
        </View>
        <View style={styles.createRow}>
          <TextInput
            placeholder="New Bookshelf name"
            value={newName}
            onChangeText={setNewName}
            // The input style already has flex: 1
            style={styles.input}
          />
          <Button
            title="Create"
            onPress={async () => {
              if (newName.trim()) {
                await createBookShelf(newName.trim());
                setNewName("");
              }
            }}
          />
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Sort by:</Text>
          <Picker
            selectedValue={sortBy}
            style={styles.picker}
            onValueChange={(itemValue) => setSortBy(itemValue)}
          >
            <Picker.Item label="Last Updated" value="lastUpdated" />
            <Picker.Item label="Name" value="name" />
            <Picker.Item label="Date Created" value="createdAt" />
          </Picker>
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isOwner = item.ownerId === user?.uid;

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/bookshelf/${item.id}`)}
              >
                <View style={styles.cardRow}>
                  <Text style={styles.bookName}>{item.name}</Text>
                  <Text style={styles.dateText}>
                    {new Date(item.lastUpdated).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text>{item.memberIds?.length || 0} members</Text>
                  {isOwner ? (
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "Delete Shelf",
                          `Are you sure you want to delete "${item.name}"? This cannot be undone.`,
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => deleteBookShelf(item.id),
                            },
                          ],
                        );
                      }}
                    >
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.balanceText}>Shelf</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  createRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  pickerLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  picker: {
    flex: 1,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginVertical: 6,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  bookName: { fontSize: 16, fontWeight: "600" },
  dateText: {
    color: "#666",
  },
  balanceText: {
    color: "#007bff",
    fontWeight: "500",
  },
  deleteText: {
    color: "red",
    fontWeight: "500",
  },
});

export default Library;
