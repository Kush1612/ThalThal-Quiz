
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Switch } from "react-native";
import { getAllQuizzes, getAllResponsesForQuiz } from "../../lib/quizzes";
import { useTheme } from "../../lib/theme";


export default function TeacherScores() {
  const [dark, setDark] = useState(false);
  const t = useTheme();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    getAllQuizzes().then(setQuizzes);
  }, []);

  const loadScores = async (quiz) => {
    setSelectedQuiz(quiz);
    const all = await getAllResponsesForQuiz(quiz.id);
    setResponses(all);
  };

  const bg = dark ? "#18181b" : t.bg;
  const card = dark ? "#27272a" : t.card;
  const border = dark ? "#3f3f46" : t.border;
  const text = dark ? "#fff" : t.text;
  return (
    <View style={[styles.container, { backgroundColor: bg }] }>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginBottom: 8 }}>
        <Text style={{ color: text, marginRight: 8 }}>Dark Mode</Text>
        <Switch value={dark} onValueChange={setDark} />
      </View>
      <Text style={[styles.title, { color: text }]}>Student Scores</Text>
      {!selectedQuiz ? (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: card, borderColor: border, shadowOpacity: t.shadow }] }>
              <Text style={[styles.quizTitle, { color: text }]}>{item.title}</Text>
              <Text style={[styles.quizCode, { color: text }]}>{"Code: " + item.id}</Text>
              <Text style={styles.link} onPress={() => loadScores(item)}>
                View Scores
              </Text>
            </View>
          )}
        />
      ) : (
        <View style={{flex:1, width:'100%'}}>
          <Text style={[styles.quizTitle, { color: text, fontSize:18 }]}>Quiz: {selectedQuiz.title}</Text>
          <Text style={[styles.quizCode, { color: text }]}>Code: {selectedQuiz.id}</Text>
          <FlatList
            data={responses}
            keyExtractor={(item) => item.email}
            renderItem={({ item }) => {
              const attempt = item.attempts[0];
              let sc = 0;
              selectedQuiz.questions.forEach((q, i) => {
                if (attempt && attempt.answers[i] === q.correct) sc++;
              });
              return (
                <View style={styles.scoreRow}>
                  <Text style={[styles.email, { color: "#fff" }]}>{attempt?.name || item.email}</Text>
                  <Text style={styles.score}>{attempt ? `${sc} / ${selectedQuiz.questions.length}` : "No attempt"}</Text>
                  {attempt && <Text style={styles.time}>{new Date(attempt.timestamp).toLocaleString()}</Text>}
                </View>
              );
            }}
            ListEmptyComponent={<Text style={styles.empty}>No student attempts yet.</Text>}
          />
          <Text style={styles.link} onPress={() => { setSelectedQuiz(null); setResponses([]); }}>
            ← Back to Quizzes
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 16, color: "#111827" },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  quizTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  quizCode: { color: "#6b7280", marginTop: 4, marginBottom: 8 },
  link: { color: "#2563eb", marginTop: 8, fontWeight: "700", fontSize: 15 },
  scoreRow: { flexDirection: "column", borderBottomWidth: 1, borderColor: "#e5e7eb", paddingVertical: 10 },
  email: { fontWeight: "700" },
  score: { color: "#16a34a", fontWeight: "700", marginTop: 2 },
  time: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  empty: { color: "#6b7280", fontSize: 16, marginTop: 32, textAlign: "center" },
});
