
import { supabase } from "./supabase";
import { getCurrentUser } from "./auth";

// Get all quizzes (for all users or filter by owner in dashboard)
export async function getAllQuizzes() {
  const { data, error } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Add a new quiz
export async function addQuiz(quiz) {
  const { data, error } = await supabase.from("quizzes").insert([quiz]).select();
  if (error) throw error;
  return data[0];
}

// Get a quiz by id
export async function getQuizById(id) {
  const { data, error } = await supabase.from("quizzes").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

// Update or insert a quiz (by id)
export async function upsertQuiz(quiz) {
  const { error } = await supabase.from("quizzes").upsert([quiz]);
  if (error) throw error;
}

// Save a response only if not already submitted; only one attempt per quiz per user
export async function saveResponses(quizId, answers) {
  const user = await getCurrentUser();
  const email = user?.email || "guest";
  const name = user?.user_metadata?.displayName || user?.user_metadata?.display_name || email;
  // Check if already submitted
  const { data: existing, error: err1 } = await supabase
    .from("responses")
    .select("id")
    .eq("quiz_id", quizId)
    .eq("student_email", email)
    .maybeSingle();
  if (err1) throw err1;
  if (existing) return false;
  // Calculate score (client-side)
  const quiz = await getQuizById(quizId);
  let score = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.correct) score++;
  });
  const { error } = await supabase.from("responses").insert([
    {
      quiz_id: quizId,
      student_email: email,
      student_name: name,
      answers,
      score,
    },
  ]);
  if (error) throw error;
  return true;
}

// Load the single attempt for a quiz for the current user (returns array of {answers, score, submitted_at, name})
export async function loadResponses(quizId) {
  const user = await getCurrentUser();
  const email = user?.email || "guest";
  const { data, error } = await supabase
    .from("responses")
    .select("answers, score, submitted_at, student_name")
    .eq("quiz_id", quizId)
    .eq("student_email", email)
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// Get the only attempt for a quiz (for backward compatibility)
export async function loadLatestResponse(quizId) {
  const all = await loadResponses(quizId);
  return all.length > 0 ? all[0].answers : {};
}

// Get all responses for a quiz (across all users)
export async function getAllResponsesForQuiz(quizId) {
  const { data, error } = await supabase
    .from("responses")
    .select("student_email, student_name, answers, score, submitted_at")
    .eq("quiz_id", quizId)
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  // For compatibility with previous code, wrap each as { email, attempts: [attempt] }
  return (data || []).map(r => ({
    email: r.student_email,
    attempts: [{
      answers: r.answers,
      score: r.score,
      timestamp: r.submitted_at,
      name: r.student_name,
    }],
  }));
}

// Check if a quiz is submitted by the current user
export async function isSubmitted(quizId) {
  const user = await getCurrentUser();
  const email = user?.email || "guest";
  const { data, error } = await supabase
    .from("responses")
    .select("id")
    .eq("quiz_id", quizId)
    .eq("student_email", email)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

// No need for markSubmitted; submission is tracked by response row
