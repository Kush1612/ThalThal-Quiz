import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { addQuiz } from "../../lib/quizzes";
import { getCurrentUser } from "../../lib/auth";

export default function CreateQuiz() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(null);

  const addQuestion = () => {
    if (!currentQ || options.some((opt) => !opt) || correct === null) return;
    setQuestions([...questions, { question: currentQ, options, correct }]);
    setCurrentQ("");
    setOptions(["", "", "", ""]);
    setCorrect(null);
  };

  const saveQuiz = async () => {
    const user = await getCurrentUser();
    const email = user?.email || "unknown";
    const newQuiz = { id: Date.now().toString(), title, questions, owner: email };
    await addQuiz(newQuiz);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Quiz</Text>

      <TextInput
        placeholder="Quiz Title"
        placeholderTextColor="#9ca3af"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter Question"
        placeholderTextColor="#9ca3af"
        value={currentQ}
        onChangeText={setCurrentQ}
        style={styles.input}
      />

      {options.map((opt, i) => (
        <TextInput
          key={i}
          placeholder={`Option ${i + 1}`}
          placeholderTextColor="#9ca3af"
          value={opt}
          onChangeText={(txt) =>
            setOptions(options.map((o, idx) => (idx === i ? txt : o)))
          }
          style={styles.input}
        />
      ))}

      <View style={styles.correctRow}>
        {options.map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.correctButton,
              correct === i && { backgroundColor: "#16a34a" },
            ]}
            onPress={() => setCorrect(i)}
          >
            <Text style={correct === i ? { color: "#fff" } : {}}>Correct {i + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={addQuestion}>
        <Text style={styles.buttonText}>+ Add Question</Text>
      </TouchableOpacity>

      <FlatList
        data={questions}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.quizCard}>
            <Text style={styles.quizTitle}>{item.question}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={[styles.button, styles.successButton]} onPress={saveQuiz}>
        <Text style={styles.buttonText}>Save Quiz</Text>
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
  correctRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  correctButton: { padding: 10, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, backgroundColor: "#f3f4f6" },
  quizCard: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#e5e7eb" },
  quizTitle: { fontWeight: "700", color: "#111827" },
});
