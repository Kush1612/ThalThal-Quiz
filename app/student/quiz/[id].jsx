import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated } from "react-native";
import { useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getQuizById, saveResponses, loadResponses, isSubmitted, markSubmitted } from "../../../lib/quizzes";

export default function QuizAttempt() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const scaleRefs = useRef({});

  useEffect(() => {
    const load = async () => {
      const q = await getQuizById(id);
      setQuiz(q);
      const saved = await loadResponses(id);
      setAnswers(saved || {});
      const wasSubmitted = await isSubmitted(id);
      setSubmitted(wasSubmitted);
    };
    load();
  }, [id]);

  const selectAnswer = async (qIndex, optIndex) => {
    if (submitted) return;
    const updated = { ...answers, [qIndex]: optIndex };
    setAnswers(updated);
    await saveResponses(id, updated); // auto-save, will not save if already submitted
  };

  if (!quiz) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{quiz.title}</Text>
      <FlatList
        data={quiz.questions}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.questionBox}>
            <Text style={styles.question}>{item.question}</Text>
            {item.options.map((opt, i) => {
              const key = `${index}-${i}`;
              if (!scaleRefs.current[key]) scaleRefs.current[key] = new Animated.Value(1);
              const onPressIn = () => Animated.spring(scaleRefs.current[key], { toValue: 0.97, useNativeDriver: true, friction: 6, tension: 120 }).start();
              const onPressOut = () => Animated.spring(scaleRefs.current[key], { toValue: 1, useNativeDriver: true, friction: 6, tension: 120 }).start();
              return (
                <Animated.View key={i} style={{ transform: [{ scale: scaleRefs.current[key] }] }}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      answers[index] === i && styles.optionSelected,
                    ]}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    onPress={() => selectAnswer(index, i)}
                  >
                    <Text style={[styles.optionText, answers[index] === i && styles.optionTextSelected]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.button, styles.successButton, submitted && { opacity: 0.6 }]}
        onPress={async () => {
          if (submitted) {
            router.push(`/student/result/${id}`);
            return;
          }
          // Save final answers and mark as submitted
          await saveResponses(id, answers);
          setSubmitted(true);
          router.push(`/student/result/${id}`);
        }}
        disabled={submitted}
      >
        <Text style={styles.buttonText}>{submitted ? "Already Submitted" : "Submit Quiz"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 12, color: "#111827" },
  questionBox: { marginBottom: 20 },
  question: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#111827" },
  option: { backgroundColor: "#fff", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 8 },
  optionSelected: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  optionText: { fontSize: 15, color: "#111827" },
  optionTextSelected: { color: "#fff", fontWeight: "700" },
  button: { paddingVertical: 16, borderRadius: 12, marginTop: 20, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  successButton: { backgroundColor: "#16a34a" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
