import { FieldValue } from "firebase/firestore";

export interface BookShelf {
    id: string;
    name: string;
    createdAt: number;
    lastUpdated: number;
    memberIds: string[];
    createdBy: string;
    ownerId: string;
}

export interface Book {
    id: string;
    name: string;
    createdAt: number;
    lastUpdated: number;
    memberIds: string[];
    createdBy: string;
    bookshelfId: string;
}

export type NewBook = Omit<Book, "id" | "createdAt" | "lastUpdated"> & { createdAt: FieldValue; lastUpdated: FieldValue; };

export type NewBookShelf = Omit<BookShelf, "id" | "createdAt" | "lastUpdated"> & {
    createdAt: FieldValue;
    lastUpdated: FieldValue;
};

export type EntryType = "IN" | "OUT";

export interface TransactionEntry {
    id: string;
    amount: number;
    type: EntryType;
    paymentMode?: string;
    category?: string;
    party?: string;
    remark?: string;
    createdAt: number;
    createdBy: string;
}
