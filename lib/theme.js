import { useColorScheme } from "react-native";

const light = {
  bg: "#f3f4f6",
  card: "#ffffff",
  border: "#e5e7eb",
  text: "#111827",
  subtext: "#6b7280",
  primary: "#2563eb",
  success: "#16a34a",
  danger: "#ef4444",
  shadow: 0.08,
};

const dark = {
  bg: "#0b1220",
  card: "#111827",
  border: "#1f2937",
  text: "#f9fafb",
  subtext: "#9ca3af",
  primary: "#3b82f6",
  success: "#22c55e",
  danger: "#f43f5e",
  shadow: 0.2,
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === "dark" ? dark : light;
}


