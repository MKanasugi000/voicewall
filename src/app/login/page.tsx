"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (isSignUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
      } else if (data.session) {
        // メール確認が無効の場合、すぐにログイン状態になる
        window.location.href = "/dashboard";
        return;
      } else {
        // メール確認が有効の場合（フォールバック）
        setMessage("確認メールを送信しました。メールのリンクをクリックしてください。");
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError("メールアドレスまたはパスワードが正しくありません。");
      } else {
        window.location.href = "/dashboard";
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #60C4FF 0%, #2563EB 50%, #1A3FB5 100%)",
      padding: "20px",
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "40px",
        maxWidth: "420px",
        width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{
            fontSize: "28px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #2563EB, #1A3FB5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}>
            VoiceWall
          </h1>
          <p style={{ color: "#6B7280", marginTop: "8px", fontSize: "14px" }}>
            {isSignUp ? "アカウントを作成" : "ダッシュボードにログイン"}
          </p>
        </div>

        {error && (
          <div style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px",
            color: "#DC2626",
            fontSize: "14px",
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px",
            color: "#16A34A",
            fontSize: "14px",
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="6文字以上"
              minLength={6}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#93C5FD" : "linear-gradient(135deg, #2563EB, #1A3FB5)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "処理中..." : isSignUp ? "アカウント作成" : "ログイン"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); setMessage(""); }}
            style={{
              background: "none",
              border: "none",
              color: "#2563EB",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {isSignUp ? "すでにアカウントをお持ちの方はこちら" : "アカウントを新規作成"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <a href="/" style={{ color: "#9CA3AF", fontSize: "13px", textDecoration: "none" }}>
            ← トップページへ戻る
          </a>
        </div>
      </div>
    </div>
  );
}
