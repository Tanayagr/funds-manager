import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useBooks } from "@/src/context/BooksContext";
import { Picker } from "@react-native-picker/picker";

type Params = { bookId: string; type?: string };

export default function AddEntry() {
  const { bookId, type } = useLocalSearchParams<Params>();
  const { addEntry } = useBooks();
  const router = useRouter();
  const [entryType, setEntryType] = useState<string>(type || "IN");
  const [amount, setAmount] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<string>("Cash");
  const [remark, setRemark] = useState<string>("");

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {" "}
      <View style={{ marginBottom: 8 }}>
        {" "}
        <Text>Type</Text>{" "}
        {Platform.OS === "web" ? (
          <TextInput
            value={entryType}
            onChangeText={setEntryType}
            style={styles.input}
          />
        ) : (
          <Picker
            selectedValue={entryType}
            onValueChange={(v) => setEntryType(v as string)}
          >
            {" "}
            <Picker.Item label="Cash In (IN)" value="IN" />{" "}
            <Picker.Item label="Cash Out (OUT)" value="OUT" />{" "}
            <Picker.Item label="Custom" value="OTHER" />{" "}
          </Picker>
        )}{" "}
      </View>{" "}
      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />
      <TextInput
        placeholder="Payment Mode (Cash/Online)"
        value={paymentMode}
        onChangeText={setPaymentMode}
        style={styles.input}
      />
      <TextInput
        placeholder="Remark / Label"
        value={remark}
        onChangeText={setRemark}
        style={styles.input}
      />
      <Button
        title="Add Entry"
        onPress={async () => {
          const amt = parseFloat(amount || "0");
          if (!amt || !bookId) return;
          const finalType =
            entryType === "OTHER" ? remark || "OTHER" : entryType;
          await addEntry(bookId, {
            amount: amt,
            type: finalType,
            paymentMode,
            category: undefined,
            party: undefined,
            remark,
          });
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
});
