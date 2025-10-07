import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getAllQuizzes, loadResponses } from "../../lib/quizzes";
import { useTheme } from "../../lib/theme";

export default function StudentScores() {
  const t = useTheme();
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const quizzes = await getAllQuizzes();
      const results = [];
      for (const quiz of quizzes) {
        const attempts = await loadResponses(quiz.id);
        if (Array.isArray(attempts) && attempts.length > 0) {
          const attempt = attempts[0];
          let sc = 0;
          quiz.questions.forEach((q, i) => {
            if (attempt.answers[i] === q.correct) sc++;
          });
          results.push({
            quizTitle: quiz.title,
            score: `${sc} / ${quiz.questions.length}`,
            timestamp: attempt.timestamp,
          });
        }
      }
      // Sort by latest attempt first
      setData(results.sort((a, b) => b.timestamp - a.timestamp));
    };
    load();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: t.bg }] }>
      <Text style={[styles.title, { color: t.text }]}>My Scores</Text>
      {data.length === 0 ? (
        <Text style={[styles.empty, { color: t.subtext }]}>No quiz attempts yet.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border, shadowOpacity: t.shadow }] }>
              <Text style={[styles.quizTitle, { color: t.text }]}>{item.quizTitle}</Text>
              <Text style={styles.score}>Score: {item.score}</Text>
              <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 16, color: "#111827" },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  quizTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  score: { fontSize: 16, color: "#16a34a", fontWeight: "700", marginTop: 4 },
  time: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  empty: { color: "#6b7280", fontSize: 16, marginTop: 32, textAlign: "center" },
});