import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getQuizById, loadResponses } from "../../../lib/quizzes";

export default function Results() {
  const { id } = useLocalSearchParams();
  const [score, setScore] = useState(null);

  useEffect(() => {
    const load = async () => {
      const quiz = await getQuizById(id);
      const attempts = await loadResponses(id); // array of {answers, timestamp}
      if (!quiz || !attempts.length) return setScore(null);
      const attempt = attempts[0];
      let sc = 0;
      quiz.questions.forEach((q, i) => {
        if (attempt.answers[i] === q.correct) sc++;
      });
      setScore({
        score: `${sc} / ${quiz.questions.length}`,
        timestamp: attempt.timestamp,
      });
    };
    load();
  }, [id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>
      {score ? (
        <View style={styles.card}>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <Text style={styles.score}>{score.score}</Text>
          <Text style={styles.attemptTime}>{new Date(score.timestamp).toLocaleString()}</Text>
        </View>
      ) : (
        <Text style={styles.loading}>No attempt yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6", padding: 24 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 24, color: "#111827" },
  card: { backgroundColor: "#fff", padding: 24, borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3, alignItems: "center", minWidth: 240 },
  scoreLabel: { fontSize: 14, color: "#6b7280", marginBottom: 6 },
  score: { fontSize: 28, color: "#16a34a", fontWeight: "800" },
  loading: { color: "#6b7280" },
  attemptTime: { fontSize: 12, color: "#6b7280", marginTop: 4 },
});
