import { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Animated } from "react-native";
import { useRef } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../../lib/theme";
import { getAllQuizzes } from "../../lib/quizzes";
import { getCurrentUser, signOut } from "../../lib/auth";

export default function StudentDashboard() {
  const router = useRouter();
  const t = useTheme();
  const [quizCode, setQuizCode] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const appear = useRef(new Animated.Value(0)).current;

  const loadQuizzes = useCallback(async () => {
    setQuizzes(await getAllQuizzes());
  }, []);

  useEffect(() => {
    loadQuizzes();
    (async () => {
      const u = await getCurrentUser();
      setUserEmail(u?.email || "");
    })();
    Animated.timing(appear, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, [loadQuizzes]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQuizzes();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }] }>
      <Text style={[styles.title, { color: t.text }]}>Student Dashboard</Text>
      {!!userEmail && <Text style={{ color: t.subtext, marginBottom: 8 }}>Signed in as {userEmail}</Text>}

      <TextInput
        style={[styles.input, { backgroundColor: t.card, borderColor: t.border, color: t.text }]}
        placeholder="Enter Quiz Code"
        placeholderTextColor={t.subtext}
        value={quizCode}
        onChangeText={setQuizCode}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: t.primary, shadowOpacity: t.shadow }, !quizCode && { opacity: 0.6 }]}
        onPress={() => quizCode && router.push(`/student/quiz/${quizCode}`)}
        disabled={!quizCode}
      >
        <Text style={styles.buttonText}>Join Quiz</Text>
      </TouchableOpacity>

      <Text style={[styles.subtitle, { color: t.text }]}>Available / Ongoing Quizzes</Text>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View style={{ opacity: appear, transform: [{ translateY: Animated.multiply(Animated.subtract(1, appear), 8) }] }}>
            <TouchableOpacity
              style={[styles.quizCard, { backgroundColor: t.card, borderColor: t.border, shadowOpacity: t.shadow }]}
              onPress={() => router.push(`/student/quiz/${item.id}`)}
            >
              <Text style={[styles.quizTitle, { color: t.text }]}>{item.title}</Text>
              <Text style={[styles.quizCode, { color: t.subtext }]}>Code: {item.id}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: t.success, shadowOpacity: t.shadow, marginTop: 8 }]}
        onPress={() => router.push("/student/scores")}
      >
        <Text style={styles.buttonText}>My Scores</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: t.danger, shadowOpacity: t.shadow, marginTop: 8 }]} onPress={async () => { await signOut(); router.replace("/"); }}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 20 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 16, color: "#111827" },
  subtitle: { fontSize: 18, fontWeight: "700", marginVertical: 12, color: "#374151" },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", padding: 14, borderRadius: 12, marginBottom: 12 },
  button: { paddingVertical: 14, borderRadius: 12, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  primaryButton: { backgroundColor: "#2563eb" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  quizCard: { backgroundColor: "#fff", padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  quizTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  quizCode: { color: "#6b7280", marginTop: 4 },
});
