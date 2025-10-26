import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  DocumentData,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { Book, NewBook, TransactionEntry } from "../../types";
import { useBookShelves } from "./BookShelfContext";

const bookConverter: FirestoreDataConverter<Book | NewBook> = {
  toFirestore(book: NewBook): DocumentData {
    // Do not include the 'id' when writing back to Firestore
    // The 'id' property might not exist on a NewBook, so we handle that
    return book;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Book {
    const data = snapshot.data(options);
    // Convert Firestore Timestamps to numbers
    return {
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt?.toMillis() || 0,
      lastUpdated: data.lastUpdated?.toMillis() || 0,
    } as Book;
  },
};

type BooksContextType = {
  books: Book[];
  createBook: (name: string, bookshelfId: string) => Promise<void>;
  addEntry: (
    bookId: string,
    entry: Omit<TransactionEntry, "id" | "createdAt" | "createdBy">,
  ) => Promise<void>;
  subscribeToBooksForShelf: (shelfId: string) => () => void; // Returns an unsubscribe function
};

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { bookShelves } = useBookShelves();
  const [books, setBooks] = useState<Book[]>([]);

  const subscribeToBooksForShelf = useCallback((shelfId: string) => {
    const q = query(
      collection(db, "books").withConverter(bookConverter),
      where("bookshelfId", "==", shelfId),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const serverBooks = snapshot.docs.map((doc) => doc.data() as Book);
      setBooks(serverBooks);
    });
    return unsubscribe; // Return the unsubscribe function for cleanup
  }, []);

  const createBook = async (name: string, bookshelfId: string) => {
    if (!user) throw new Error("Not authenticated");

    // Find the parent bookshelf to get its memberIds
    const parentShelf = bookShelves.find((shelf) => shelf.id === bookshelfId);
    if (!parentShelf) throw new Error("Bookshelf not found");

    await addDoc(collection(db, "books").withConverter(bookConverter), {
      name,
      memberIds: [user.uid],
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      createdBy: user.uid,
      bookshelfId,
    });
  };

  const addEntry = async (
    bookId: string,
    entry: Omit<TransactionEntry, "id" | "createdAt" | "createdBy">,
  ) => {
    if (!user) throw new Error("Not authenticated");
    const colRef = collection(db, "books", bookId, "transactions");
    await addDoc(colRef, {
      ...entry,
      createdAt: serverTimestamp(),
      createdBy: user.uid,
    });
    const bRef = doc(db, "books", bookId);
    await updateDoc(bRef, { lastUpdated: serverTimestamp() });
  };

  return (
    <BooksContext.Provider
      value={{ books, createBook, addEntry, subscribeToBooksForShelf }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export function useBooks() {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used within BooksProvider");
  return ctx;
}
