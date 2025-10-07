import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getCurrentUser, signOut } from "../../lib/auth";
import { useTheme } from "../../lib/theme";

export default function TeacherProfile() {
  const router = useRouter();
  const t = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => setUser(await getCurrentUser());
    load();
  }, []);

  if (!user) return <View style={[styles.container, { backgroundColor: t.bg }]}><Text style={{ color: t.text }}>Loading...</Text></View>;

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
        <Text style={[styles.name, { color: t.text }]}>{user.user_metadata?.displayName || user.email}</Text>
        <Text style={[styles.email, { color: t.subtext }]}>{user.email}</Text>
        <Text style={[styles.role, { color: t.subtext }]}>Role: {user.user_metadata?.role || "teacher"}</Text>
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: t.danger }]} onPress={async () => { await signOut(); router.replace("/"); }}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  card: { padding: 20, borderRadius: 14, borderWidth: 1, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: "800", marginBottom: 6 },
  email: { fontSize: 14 },
  role: { fontSize: 12, marginTop: 4 },
  button: { paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});


