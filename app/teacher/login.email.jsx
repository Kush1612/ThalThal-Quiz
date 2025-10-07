import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { signInTeacher } from "../../lib/auth";

export default function TeacherLoginEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await signInTeacher({ email, password });
      // Ensure teacher role in metadata for guard usage
      router.replace("/teacher/tdashboard");
    } catch (e) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Sign In</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#9ca3af" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#9ca3af" secureTextEntry value={password} onChangeText={setPassword} />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={[styles.button, styles.primaryButton, (!email || !password) && { opacity: 0.6 }]} disabled={!email || !password || loading} onPress={submit}>
        <Text style={styles.buttonText}>{loading ? "Signing in..." : "Sign In"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/teacher/signup")}>
        <Text style={styles.link}>Create an account</Text>
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
  link: { color: "#2563eb", textAlign: "center", marginTop: 12, fontWeight: "700" },
});


