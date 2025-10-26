import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TransactionEntry } from "../../../types";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/src/firebase";

type Params = { bookId: string };

export default function BookDetail() {
  const { bookId } = useLocalSearchParams<Params>();
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionEntry[] | null>(
    null,
  );
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) return;
    const q = query(
      collection(db, "books", bookId, "transactions"),
      orderBy("createdAt", "asc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      const list: TransactionEntry[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          amount: data.amount,
          type: data.type,
          paymentMode: data.paymentMode,
          category: data.category,
          party: data.party,
          remark: data.remark,
          createdAt: data.createdAt?.toMillis
            ? data.createdAt.toMillis()
            : Date.now(),
          createdBy: data.createdBy,
        };
      });
      setTransactions(list);
    });
    return () => unsub();
  }, [bookId]);

  const totals = useMemo(() => {
    if (!transactions) return { totalIn: 0, totalOut: 0, net: 0 };
    let inSum = 0,
      outSum = 0;
    transactions.forEach((t) => {
      if (t.type === "IN") {
        inSum += t.amount;
      } else if (t.type === "OUT") {
        outSum += t.amount;
      } else if (t.amount >= 0) {
        inSum += t.amount;
      } else {
        outSum += Math.abs(t.amount);
      }
    });
    return { totalIn: inSum, totalOut: outSum, net: inSum - outSum };
  }, [transactions]);

  const runningBalances = useMemo(() => {
    if (!transactions) return [];
    let bal = 0;
    return transactions.map((t) => {
      if (t.type === "IN") bal += t.amount;
      else if (t.type === "OUT") bal -= t.amount;
      else bal += t.amount;
      return { ...t, running: bal };
    });
  }, [transactions]);

  if (!transactions)
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );

  const filtered = filterType
    ? runningBalances.filter((r) => r.type === filterType)
    : runningBalances;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {" "}
      <View style={styles.summary}>
        {" "}
        <Text>Total In: {totals.totalIn.toFixed(2)}</Text>{" "}
        <Text>Total Out: {totals.totalOut.toFixed(2)}</Text>{" "}
        <Text style={{ color: totals.net >= 0 ? "green" : "red" }}>
          Net: {totals.net.toFixed(2)}
        </Text>{" "}
      </View>{" "}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 8,
        }}
      >
        <Button
          title="Add In"
          onPress={() => router.push(`/book/${bookId}/add?type=IN`)}
        />
        <Button
          title="Add Out"
          onPress={() => router.push(`/book/${bookId}/add?type=OUT`)}
        />
        <Button title="All" onPress={() => setFilterType(null)} />
        <Button title="IN" onPress={() => setFilterType("IN")} />
        <Button title="OUT" onPress={() => setFilterType("OUT")} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.txn}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontWeight: "600" }}>
                {item.remark || item.type}
              </Text>
              <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 6,
              }}
            >
              <Text>
                {item.paymentMode || "—"} • {item.party || ""}
              </Text>
              <Text
                style={{
                  color: item.type === "IN" ? "green" : "red",
                  fontWeight: "700",
                }}
              >
                {item.type === "OUT" ? "-" : "+"}
                {item.amount.toFixed(2)}
              </Text>
            </View>
            <Text style={{ marginTop: 6, color: "#555" }}>
              Running: {item.running.toFixed(2)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
  },
  txn: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginVertical: 6,
  },
});
