"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/admin";
      } else {
        const data = await res.json();
        setError(data.error || "Giriş başarısız.");
      }
    } catch (err) {
      setError("Bağlantı hatası!");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-anthracite-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-anthracite-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
            <Lock size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-anthracite-900 mb-2">Yönetici Girişi</h1>
        <p className="text-center text-anthracite-500 mb-8">Devam etmek için şifrenizi girin.</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="w-full px-5 py-4 bg-anthracite-50 border border-anthracite-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm font-medium px-1">{error}</p>}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition duration-200 mt-2 disabled:opacity-50"
          >
            {isLoading ? "Kontrol ediliyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center text-xs text-anthracite-400 mt-8">Sisteme sadece yetkili personeller girebilir.</p>
      </div>
    </div>
  );
}
