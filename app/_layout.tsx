import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { BooksProvider } from "@/src/context/BooksContext";
import { BookShelfProvider } from "@/src/context/BookShelfContext";

const InitialLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const onLoginPage = segments[0] === "login";

    if (user && onLoginPage) {
      router.replace("/(tabs)/library");
    } else if (!user && !onLoginPage) {
      router.replace("/login");
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <BookShelfProvider>
        <BooksProvider>
          <InitialLayout />
        </BooksProvider>
      </BookShelfProvider>
    </AuthProvider>
  );
}
