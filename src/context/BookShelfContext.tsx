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
  serverTimestamp,
  getDocs,
  limit,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  DocumentData,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { BookShelf, NewBookShelf } from "../../types";

const bookShelfConverter: FirestoreDataConverter<BookShelf | NewBookShelf> = {
  toFirestore(shelf: NewBookShelf): DocumentData {
    return shelf;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): BookShelf {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt?.toMillis() || 0,
      lastUpdated: data.lastUpdated?.toMillis() || 0,
    } as BookShelf;
  },
};

type BookShelfContextType = {
  bookShelves: BookShelf[];
  createBookShelf: (name: string) => void;
  deleteBookShelf: (shelfId: string) => Promise<void>;
};

const BookShelfContext = createContext<BookShelfContextType | undefined>(
  undefined,
);

export const BookShelfProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [bookShelves, setBookShelves] = useState<BookShelf[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const createBookShelf = useCallback(
    (name: string) => {
      if (!user) throw new Error("Not authenticated");
      addDoc(collection(db, "bookshelves").withConverter(bookShelfConverter), {
        name,
        memberIds: [user.uid],
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        createdBy: user.uid,
        ownerId: user.uid,
      } as NewBookShelf);
    },
    [user],
  );

  useEffect(() => {
    if (!user) {
      setBookShelves([]);
      return;
    }
    const q = query(
      collection(db, "bookshelves").withConverter(bookShelfConverter),
      where("memberIds", "array-contains", user.uid),
    );

    // Logic to create a default bookshelf for a new user
    const checkForDefaultShelf = async () => {
      const initialCheck = await getDocs(query(q, limit(1)));
      if (initialCheck.empty) {
        // Heuristic to check if this is a brand new user session
        const creationTime = user.metadata.creationTime
          ? new Date(user.metadata.creationTime).getTime()
          : 0;
        const lastSignInTime = user.metadata.lastSignInTime
          ? new Date(user.metadata.lastSignInTime).getTime()
          : 0;

        if (Math.abs(creationTime - lastSignInTime) < 2000) {
          // Within 2 seconds
          const shelfName = user.displayName
            ? `${user.displayName}'s Shelf`
            : "My First Shelf";
          createBookShelf(shelfName);
        }
      }
    };
    checkForDefaultShelf();

    const unsub = onSnapshot(q, (snapshot) => {
      const shelves = snapshot.docs.map((doc) => doc.data() as BookShelf);
      setBookShelves(shelves);
      setIsLoading(false);
    });
    return () => unsub();
  }, [user, createBookShelf]);

  const deleteBookShelf = async (shelfId: string) => {
    if (!user) throw new Error("Not authenticated");
    const shelfRef = doc(db, "bookshelves", shelfId);
    await deleteDoc(shelfRef);
  };

  return (
    <BookShelfContext.Provider
      value={{ bookShelves, createBookShelf, deleteBookShelf }}
    >
      {children}
    </BookShelfContext.Provider>
  );
};

export function useBookShelves() {
  const ctx = useContext(BookShelfContext);
  if (!ctx)
    throw new Error("useBookShelves must be used within BookShelfProvider");
  return ctx;
}
