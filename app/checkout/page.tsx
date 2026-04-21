"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const name     = params.get("name") ?? "Produit";
  const price    = parseFloat(params.get("price") ?? "0");
  const currency = params.get("currency") ?? "EUR";
  const id       = params.get("id") ?? "prod_000";

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", card: "4242 4242 4242 4242", expiry: "12/26", cvv: "123" });

  const pay = () => {
    setLoading(true);
    // Simule un paiement
    setTimeout(() => {
      const orderRef = `CMD-${Date.now().toString(36).toUpperCase()}`;
      router.push(`/success?orderRef=${orderRef}&amount=${price}&currency=${currency}&product=${encodeURIComponent(name)}&productId=${id}`);
    }, 1500);
  };

  return (
    <main style={{ fontFamily: "'Syne', sans-serif", background: "#fafaf8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Syne:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 440, background: "#fff", border: "1px solid rgba(26,24,20,0.08)", padding: "48px 40px" }}>
        {/* Accent */}
        <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #a8832a, transparent)", margin: "0 0 32px" }} />

        <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a8832a", marginBottom: 8 }}>Finaliser la commande</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: "#1a1814", marginBottom: 4 }}>{name}</h1>
        <p style={{ fontSize: 22, fontWeight: 600, color: "#1a1814", marginBottom: 32 }}>{price.toFixed(2)} {currency}</p>

        {/* Formulaire fictif */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Email", key: "email", placeholder: "jean@exemple.com", type: "email" },
            { label: "Numéro de carte", key: "card", placeholder: "4242 4242 4242 4242", type: "text" },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(26,24,20,0.4)", display: "block", marginBottom: 6 }}>{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ width: "100%", background: "#f4f3ef", border: "1px solid rgba(26,24,20,0.07)", padding: "10px 12px", fontFamily: "'Syne', sans-serif", fontSize: 13, outline: "none", color: "#1a1814" }}
              />
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Expiration", key: "expiry", placeholder: "MM/AA" },
              { label: "CVV", key: "cvv", placeholder: "123" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(26,24,20,0.4)", display: "block", marginBottom: 6 }}>{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: "100%", background: "#f4f3ef", border: "1px solid rgba(26,24,20,0.07)", padding: "10px 12px", fontFamily: "'Syne', sans-serif", fontSize: 13, outline: "none", color: "#1a1814" }}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={pay}
          disabled={loading}
          style={{ width: "100%", background: "#1a1814", color: "#fafaf8", border: "none", padding: "14px", fontFamily: "'Syne', sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1, transition: "opacity 0.2s" }}
        >
          {loading ? "Traitement en cours…" : `Payer ${price.toFixed(2)} ${currency} →`}
        </button>

        <button
          onClick={() => router.push("/")}
          style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", fontSize: 11, color: "rgba(26,24,20,0.3)", cursor: "pointer", letterSpacing: "0.08em" }}
        >
          ← Retour
        </button>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return <Suspense><CheckoutContent /></Suspense>;
}