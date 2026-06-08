"use client";

import { useRouter } from "next/navigation";

const PRODUCTS = [
  { id: "prod_001", name: "Café de spécialité",  price: 24.99, currency: "EUR", emoji: "☕", description: "Origine Éthiopie, torréfaction artisanale" },
  { id: "prod_002", name: "Carnet en cuir",       price: 39.90, currency: "EUR", emoji: "📓", description: "Fait main, papier recyclé 200g" },
  { id: "prod_003", name: "Bougie de soja",       price: 18.50, currency: "EUR", emoji: "🕯️", description: "Parfum figue & cèdre, 60h de combustion" },
  { id: "prod_004", name: "Thé grand cru",        price: 32.00, currency: "EUR", emoji: "🍵", description: "Darjeeling first flush, récolte 2025" },
];

const MERCHANT_DID    = "did:sigil:0xMERCHANT";
const REPUT_DID       = "did:sigil:0x0448871916fae371d9c93ae48956bdaada1e4784";
const REPUT_API       = "https://api.appchap.fr:4000";
const REPUT_FRONT     = "https://sigil-front.vercel.app";

export default function Home() {
  const router = useRouter();

  return (
    <main style={{ fontFamily: "'Syne', sans-serif", background: "#fafaf8", minHeight: "100vh", padding: "48px 24px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Syne:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ maxWidth: 960, margin: "0 auto 16px", textAlign: "center" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a8832a", marginBottom: 8 }}>
          Boutique de démonstration
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: "#1a1814" }}>
          Maison <em style={{ fontStyle: "italic", color: "#a8832a" }}>Sigil</em>
        </h1>
        <p style={{ fontSize: 13, color: "rgba(26,24,20,0.45)", marginTop: 8 }}>
          Chaque achat génère une preuve cryptographique vérifiable
        </p>
      </div>

      {/* ── Badge REPUT ── */}
      <div style={{ maxWidth: 960, margin: "0 auto 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <a
          href={`${REPUT_FRONT}/profile/${encodeURIComponent(REPUT_DID)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Vérifier l'identité certifiée REPUT"
          style={{ display: "inline-block", transition: "opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <img
            src={`${REPUT_API}/identity/badge/${encodeURIComponent(REPUT_DID)}/svg`}
            alt="Identité certifiée REPUT"
            height="52"
            style={{ display: "block" }}
          />
        </a>
        <p style={{ fontSize: 10, color: "rgba(26,24,20,0.35)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Présence certifiée · Cliquez pour vérifier
        </p>
      </div>

      {/* Grille produits */}
      <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
        {PRODUCTS.map((p) => (
          <div
            key={p.id}
            style={{ background: "#fff", border: "1px solid rgba(26,24,20,0.08)", padding: "32px 24px 24px", transition: "box-shadow 0.2s", position: "relative" }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(26,24,20,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>{p.emoji}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: "#1a1814", marginBottom: 8 }}>
              {p.name}
            </h2>
            <p style={{ fontSize: 12, color: "rgba(26,24,20,0.45)", marginBottom: 16, lineHeight: 1.6 }}>
              {p.description}
            </p>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#a8832a", marginBottom: 20 }}>
              {p.price.toFixed(2)} {p.currency}
            </p>

            {/* Boutons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => router.push(`/checkout?id=${p.id}&name=${encodeURIComponent(p.name)}&price=${p.price}&currency=${p.currency}`)}
                style={{ flex: 2, background: "#1a1814", color: "#fafaf8", border: "none", padding: "10px 8px", fontFamily: "'Syne', sans-serif", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Acheter →
              </button>
              <button
                onClick={() => router.push(`/reviews?merchantDid=${encodeURIComponent(MERCHANT_DID)}&product=${encodeURIComponent(p.name)}`)}
                style={{ flex: 1, background: "none", border: "1px solid rgba(26,24,20,0.1)", padding: "10px 8px", fontFamily: "'Syne', sans-serif", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", color: "rgba(26,24,20,0.5)", transition: "border-color 0.2s, color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(168,131,42,0.4)"; e.currentTarget.style.color = "#a8832a"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(26,24,20,0.1)"; e.currentTarget.style.color = "rgba(26,24,20,0.5)"; }}
              >
                Avis
              </button>
            </div>

            {/* Barre dorée bas */}
            <div style={{ position: "absolute", bottom: 0, left: 24, right: 24, height: 1, background: "linear-gradient(90deg, transparent, rgba(168,131,42,0.3), transparent)" }} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 960, margin: "48px auto 0", textAlign: "center", paddingTop: 24, borderTop: "1px solid rgba(26,24,20,0.06)" }}>
        <p style={{ fontSize: 10, color: "rgba(26,24,20,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Site de démonstration REPUT · Avis certifiés par preuve de transaction
        </p>
      </div>
    </main>
  );
}