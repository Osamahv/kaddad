"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://nanbjdtzawynwubieikr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmJqZHR6YXd5bnd1YmllaWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDkyNDQsImV4cCI6MjA5MTQ4NTI0NH0.15GJSu1ZYTUeCu2P8nLP83f2bcPV3t_p9NNf0RuUCN0"
);

export default function TestPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testInsert = async () => {
    setLoading(true);
    setResult("جاري الإرسال...");
    
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        name: "تجربة من الموقع",
        phone: "05" + Math.floor(Math.random() * 100000000).toString().padStart(8, "0"),
        email: "test@test.com",
        age: "25",
        city: "الرياض",
        role: "sender",
      })
      .select()
      .single();

    if (error) {
      setResult("خطأ: " + error.message);
      console.error("ERROR:", error);
    } else {
      setResult("نجح! الاسم: " + data.name + " - ID: " + data.id);
      console.log("SUCCESS:", data);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 40, textAlign: "center", fontFamily: "Tajawal, sans-serif", direction: "rtl" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>اختبار Supabase</h1>
      <button
        onClick={testInsert}
        disabled={loading}
        style={{
          padding: "16px 40px",
          background: "#0E8A7D",
          color: "#fff",
          border: "none",
          borderRadius: 14,
          fontSize: 18,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {loading ? "جاري..." : "اضغط هنا للتجربة"}
      </button>
      <div style={{
        marginTop: 20,
        padding: 16,
        background: result.includes("خطأ") ? "#FEF2F2" : result.includes("نجح") ? "#D1FAE5" : "#F3F4F6",
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 600,
        color: result.includes("خطأ") ? "#EF4444" : result.includes("نجح") ? "#065F46" : "#666",
      }}>
        {result || "اضغط الزر عشان نجرب"}
      </div>
    </div>
  );
}