import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { signUpTeacher } from "../../lib/auth";

export default function TeacherSignup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await signUpTeacher({ email, password, displayName: name });
      router.replace("/teacher/tdashboard");
    } catch (e) {
      setError(e?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Sign Up</Text>
      <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#9ca3af" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#9ca3af" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#9ca3af" secureTextEntry value={password} onChangeText={setPassword} />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={[styles.button, styles.primaryButton, (!email || !password || !name) && { opacity: 0.6 }]} disabled={!email || !password || !name || loading} onPress={submit}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Sign Up"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/teacher/login.email")}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
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


