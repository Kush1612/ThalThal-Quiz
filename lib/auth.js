import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { supabase } from "./supabase";

const AUTH_KEY = "auth/teacher";

export async function loginTeacher(passcode) {
  const expected = Constants.expoConfig?.extra?.TEACHER_PASSCODE;
  if (!expected) throw new Error("Missing TEACHER_PASSCODE in app.json extra");
  if (String(passcode) !== String(expected)) return false;
  await AsyncStorage.setItem(AUTH_KEY, "true");
  return true;
}

export async function logoutTeacher() {
  await AsyncStorage.removeItem(AUTH_KEY);
}

export async function isTeacherAuthed() {
  const v = await AsyncStorage.getItem(AUTH_KEY);
  return v === "true";
}

// Student auth via Supabase
export async function signUpStudent({ email, password, displayName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { displayName } },
  });
  if (error) throw error;
  return data;
}

export async function signInStudent({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutStudent() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function getCurrentStudent() {
  return supabase.auth.getUser();
}

// Generic helpers
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export async function signInTeacher({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpTeacher({ email, password, displayName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { displayName, role: "teacher" } },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function isTeacherSession() {
  const user = await getCurrentUser();
  return !!user && user.user_metadata?.role === "teacher";
}


