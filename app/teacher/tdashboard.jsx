import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getAllQuizzes } from "../../lib/quizzes";
import { getCurrentUser } from "../../lib/auth";
import { useTheme } from "../../lib/theme";
import { isTeacherAuthed, logoutTeacher } from "../../lib/auth";

export default function TeacherDashboard() {
  const router = useRouter();
  const t = useTheme();
  const [quizzes, setQuizzes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadQuizzes = useCallback(async () => {
    const ok = await isTeacherAuthed();
    if (!ok) {
      router.replace("/teacher/login");
      return;
    }
    const user = await getCurrentUser();
    const email = user?.email || "unknown";
    const all = await getAllQuizzes();
    setQuizzes(all.filter(q => q.owner === email));
  }, [router]);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  useFocusEffect(
    useCallback(() => {
      loadQuizzes();
    }, [loadQuizzes])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQuizzes();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }] }>
      <Text style={[styles.title, { color: t.text }]}>Teacher Dashboard</Text>


      <TouchableOpacity
        style={[styles.button, { backgroundColor: t.success, shadowOpacity: t.shadow }]}
        onPress={() => router.push("/teacher/scores")}
      >
        <Text style={styles.buttonText}>View Student Scores</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: t.primary, shadowOpacity: t.shadow }]}
        onPress={() => router.push("/teacher/create")}
      >
        <Text style={styles.buttonText}>+ Create New Quiz</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: t.danger, shadowOpacity: t.shadow }]}
        onPress={async () => { await logoutTeacher(); router.replace("/teacher/login"); }}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={[styles.subtitle, { color: t.text }]}>Your Quizzes</Text>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.quizCard, { backgroundColor: t.card, borderColor: t.border, shadowOpacity: t.shadow }]}> 
            <View style={{ flex: 1 }}>
              <Text style={[styles.quizTitle, { color: t.text }]}>{item.title}</Text>
              <Text style={[styles.quizCode, { color: t.subtext }]}>Code: {item.id}</Text>
            </View>
            <TouchableOpacity
              style={[styles.smallBtn, { backgroundColor: t.primary }]}
              onPress={() => router.push(`/teacher/edit/${item.id}`)}
            >
              <Text style={styles.smallBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 20 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 16, color: "#111827" },
  subtitle: { fontSize: 18, fontWeight: "700", marginVertical: 12, color: "#374151" },
  button: { paddingVertical: 14, borderRadius: 12, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  primaryButton: { backgroundColor: "#2563eb" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  quizCard: { backgroundColor: "#fff", padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1, flexDirection: "row", alignItems: "center" },
  quizTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  quizCode: { color: "#6b7280", marginTop: 4 },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  editBtn: { backgroundColor: "#2563eb" },
  smallBtnText: { color: "#fff", fontWeight: "700" },
});
