import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getQuizById, upsertQuiz } from "../../../lib/quizzes";

export default function EditQuiz() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const q = await getQuizById(id);
      if (q) {
        setTitle(q.title || "");
        setQuestions(q.questions || []);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const updateQuestionText = (index, text) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, question: text } : q)));
  };

  const updateOptionText = (qIndex, optIndex, text) => {
    setQuestions((prev) => prev.map((q, i) => (
      i === qIndex ? { ...q, options: q.options.map((o, oi) => (oi === optIndex ? text : o)) } : q
    )));
  };

  const setCorrectIndex = (qIndex, correctIndex) => {
    setQuestions((prev) => prev.map((q, i) => (i === qIndex ? { ...q, correct: correctIndex } : q)));
  };

  const addBlankQuestion = () => {
    setQuestions((prev) => [...prev, { question: "", options: ["", "", "", ""], correct: 0 }]);
  };

  const save = async () => {
    const updated = { id: String(id), title, questions };
    await upsertQuiz(updated);
    router.back();
  };

  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Quiz</Text>

      <TextInput
        placeholder="Quiz Title"
        placeholderTextColor="#9ca3af"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={addBlankQuestion}>
        <Text style={styles.buttonText}>+ Add Question</Text>
      </TouchableOpacity>

      <FlatList
        data={questions}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.qCard}>
            <Text style={styles.qLabel}>Question {index + 1}</Text>
            <TextInput
              placeholder="Enter Question"
              placeholderTextColor="#9ca3af"
              value={item.question}
              onChangeText={(t) => updateQuestionText(index, t)}
              style={styles.input}
            />
            {item.options.map((opt, oi) => (
              <TextInput
                key={oi}
                placeholder={`Option ${oi + 1}`}
                placeholderTextColor="#9ca3af"
                value={opt}
                onChangeText={(t) => updateOptionText(index, oi, t)}
                style={styles.input}
              />
            ))}

            <View style={styles.correctRow}>
              {item.options.map((_, oi) => (
                <TouchableOpacity
                  key={oi}
                  style={[styles.correctButton, item.correct === oi && { backgroundColor: "#16a34a" }]}
                  onPress={() => setCorrectIndex(index, oi)}
                >
                  <Text style={item.correct === oi ? { color: "#fff" } : {}}>Correct {oi + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={[styles.button, styles.successButton]} onPress={save}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 16, color: "#111827" },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", padding: 14, borderRadius: 12, marginBottom: 12 },
  button: { paddingVertical: 14, borderRadius: 12, marginVertical: 10, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  primaryButton: { backgroundColor: "#2563eb" },
  successButton: { backgroundColor: "#16a34a" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  qCard: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#e5e7eb" },
  qLabel: { fontWeight: "700", marginBottom: 6, color: "#111827" },
  correctRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  correctButton: { padding: 10, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, backgroundColor: "#f3f4f6" },
});


