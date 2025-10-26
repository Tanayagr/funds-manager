import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../src/context/AuthContext";

export default function LoginScreen() {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const handleAction = async () => {
    if (isSigningUp && !name.trim()) {
      Alert.alert("Validation Error", "Please enter your name.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }
    if (!password) {
      Alert.alert("Validation Error", "Please enter your password.");
      return;
    }
    if (isSigningUp && password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      if (isSigningUp) await signUp(email.trim(), password, name.trim());
      else await signIn(email.trim(), password);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Forgot Password",
        "Please enter your email address to receive a password reset link.",
      );
      return;
    }
    try {
      await resetPassword(email.trim());
      Alert.alert(
        "Password Reset",
        "A password reset link has been sent to your email address if it exists in our system.",
      );
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>FundsBook</Text>
        {isSigningUp && (
          <TextInput
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
          />
        )}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          textContentType="password"
          autoComplete="password"
        />
        {isSigningUp && (
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            textContentType="password"
            autoComplete="password"
          />
        )}
        {!isSigningUp && (
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.toggleText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}
        <View style={{ marginTop: 10 }}>
          <Button
            title={isSigningUp ? "Sign Up" : "Sign In"}
            onPress={handleAction}
            disabled={loading}
          />
        </View>
        <View style={styles.footer}>
          <Text>
            {isSigningUp
              ? "Already have an account?"
              : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setIsSigningUp(!isSigningUp)}>
            <Text style={styles.toggleText}>
              {isSigningUp ? "Sign In" : "Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
  },
  title: { fontSize: 28, textAlign: "center", marginBottom: 20 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  toggleText: {
    color: "#007bff",
    marginLeft: 5,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginVertical: 6,
  },
});
