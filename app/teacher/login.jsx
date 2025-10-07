import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { loginTeacher } from "../../lib/auth";

export default function TeacherLogin() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const ok = await loginTeacher(code);
      if (!ok) {
        setError("Invalid passcode");
      } else {
        router.replace("/teacher/tdashboard");
      }
    } catch (e) {
      setError(e?.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Login</Text>
      <TextInput
        placeholder="Enter Passcode"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={code}
        onChangeText={setCode}
        style={styles.input}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={[styles.button, styles.primaryButton, !code && { opacity: 0.6 }]} disabled={!code || loading} onPress={submit}>
        <Text style={styles.buttonText}>{loading ? "Signing in..." : "Sign In"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 24, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 16, color: "#111827", textAlign: "center" },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", padding: 14, borderRadius: 12, marginBottom: 12 },
  error: { color: "#dc2626", marginBottom: 8, textAlign: "center" },
  button: { paddingVertical: 14, borderRadius: 12, marginTop: 8 },
  primaryButton: { backgroundColor: "#2563eb" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});


