import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBookShelves } from "@/src/context/BookShelfContext";
import { useBooks } from "@/src/context/BooksContext";

type Params = { bookshelfId: string };

export default function BookShelfDetailScreen() {
  const { bookshelfId } = useLocalSearchParams<Params>();
  const router = useRouter();
  const { bookShelves } = useBookShelves();
  const { books, createBook, subscribeToBooksForShelf } = useBooks();
  const [newBookName, setNewBookName] = useState("");

  useEffect(() => {
    if (!bookshelfId) return;
    // Subscribe to books for this shelf and get the unsubscribe function
    const unsubscribe = subscribeToBooksForShelf(bookshelfId);
    // Unsubscribe when the component unmounts or the bookshelfId changes
    return () => unsubscribe();
  }, [bookshelfId, subscribeToBooksForShelf]);

  const shelf = useMemo(
    () => bookShelves.find((s) => s.id === bookshelfId),
    [bookShelves, bookshelfId],
  );

  const handleCreateBook = async () => {
    if (!newBookName.trim() || !bookshelfId) return;
    try {
      await createBook(newBookName.trim(), bookshelfId);
      setNewBookName("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (!shelf) {
    return (
      <View style={styles.container}>
        <Text>Bookshelf not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerTitle: shelf.name,
          headerRight: () => (
            <Button
              onPress={() => Alert.alert("Add Member", "Feature coming soon!")}
              title="Add Member"
            />
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.createRow}>
          <TextInput
            placeholder="New Book Name"
            value={newBookName}
            onChangeText={setNewBookName}
            style={styles.input}
          />
          <Button title="Create Book" onPress={handleCreateBook} />
        </View>

        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/book/${item.id}`)}
            >
              <Text style={styles.bookName}>{item.name}</Text>
              <Text style={styles.dateText}>
                Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={<Text style={styles.headerTitle}>Books</Text>}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No books in this shelf yet.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 12 },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginVertical: 6,
  },
  bookName: { fontSize: 16, fontWeight: "600" },
  dateText: { color: "#666", marginTop: 4 },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  emptyText: { textAlign: "center", marginTop: 20, color: "#888" },
});
