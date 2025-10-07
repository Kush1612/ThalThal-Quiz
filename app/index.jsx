import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../lib/theme";

export default function Home() {
  const router = useRouter();
  const t = useTheme();
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(16)).current;
  const btn1Opacity = useRef(new Animated.Value(0)).current;
  const btn1Translate = useRef(new Animated.Value(12)).current;
  const btn2Opacity = useRef(new Animated.Value(0)).current;
  const btn2Translate = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroOpacity, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(heroTranslate, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.stagger(120, [
        Animated.parallel([
          Animated.timing(btn1Opacity, { toValue: 1, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(btn1Translate, { toValue: 0, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(btn2Opacity, { toValue: 1, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(btn2Translate, { toValue: 0, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, [heroOpacity, heroTranslate, btn1Opacity, btn1Translate, btn2Opacity, btn2Translate]);

  return (
    <View style={[styles.container, { backgroundColor: t.bg }] }>
      <Animated.View style={[styles.hero, { opacity: heroOpacity, transform: [{ translateY: heroTranslate }] }]}>
        <Image source={require("../assets/icon.png")} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.title, { color: t.text }]}>Quiz App</Text>
        <Text style={[styles.subtitle, { color: t.subtext }]}>Create, share, and take quizzes instantly</Text>
      </Animated.View>

      <View style={styles.actions}>
        <Animated.View style={{ width: "100%", alignItems: "center", opacity: btn1Opacity, transform: [{ translateY: btn1Translate }] }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: t.primary, shadowOpacity: t.shadow }]}
            onPress={() => router.push("/student/login")}
          >
            <Text style={styles.buttonText}>Student: Sign In</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ width: "100%", alignItems: "center", opacity: btn2Opacity, transform: [{ translateY: btn2Translate }] }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: t.success, shadowOpacity: t.shadow }]}
            onPress={() => router.push("/teacher/login.email")}
          >
            <Text style={styles.buttonText}>Teacher: Sign In</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Text style={[styles.footer, { color: t.subtext }]}>No account needed • Works offline for attempts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f3f4f6", padding: 24 },
  hero: { alignItems: "center", marginBottom: 32 },
  logo: { width: 88, height: 88, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280", marginTop: 6 },
  actions: { width: "100%", alignItems: "center", marginTop: 24 },
  button: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14, width: 260, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "700", letterSpacing: 0.3 },
  footer: { position: "absolute", bottom: 24, color: "#6b7280", fontSize: 12 },
});
