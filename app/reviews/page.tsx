"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { API_URL } from "../lib/config";

type Review = {
  id: string;
  rating: number;
  body: string;
  createdAt: string;
  attestationId: string;
};

function ReviewsContent() {
  const params      = useSearchParams();
  const router      = useRouter();
  const merchantDid = params.get("merchantDid") ?? "";
  const product     = params.get("product") ?? "ce produit";

  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [body, setBody]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [done, setDone]       = useState(false);

  const [reviews, setReviews]   = useState<Review[]>([]);
  const [average, setAverage]   = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);



  // Charge les avis existants
  const loadReviews = async () => {
  // Essaie d'abord le merchantDid de l'attestation stockée
  const stored = localStorage.getItem("sigil_attestation");
  const attestationMerchantDid = stored
    ? JSON.parse(stored).merchantDid
    : null;

  const did = attestationMerchantDid || merchantDid;
  if (!did) return;

  const url = `${API_URL}/reviews?merchantDid=${encodeURIComponent(did)}`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    if (data.ok) {
      setReviews(data.reviews);
      setAverage(data.average);
      setTotalReviews(data.total);
    }
  } catch (e) {
    console.error("❌ Error:", e);
  }
};
  useEffect(() => {
    loadReviews();
  }, [merchantDid, done]);

  const submit = async () => {
  if (!rating) return setError("Sélectionnez une note");
  if (body.trim().length < 10) return setError("Avis trop court (min 10 caractères)");

  setLoading(true);
  setError("");

  try {
    const stored = localStorage.getItem("sigil_attestation");
    if (!stored) throw new Error("Aucune attestation trouvée. Certifiez votre expérience d'abord.");

    const { attestationId, merchantDid: attestationMerchantDid } = JSON.parse(stored);

    // On utilise le merchantDid de l'attestation (pas celui de l'URL)
    // pour éviter le ATTESTATION_MERCHANT_MISMATCH
    const res = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        attestationId,
        merchantDid: attestationMerchantDid,
        rating,
        body,
      }),
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.error ?? "Erreur lors de la publication");

    setDone(true);
  } catch (e: any) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
};

  if (done) return (
    <main style={{ fontFamily: "'Syne', sans-serif", background: "#fafaf8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16, color: "#a8832a" }}>✦</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: "#1a1814", marginBottom: 12 }}>Avis publié</h2>
        <p style={{ fontSize: 13, color: "rgba(26,24,20,0.45)", marginBottom: 24 }}>Votre avis a été certifié et publié avec succès.</p>
        <button onClick={() => router.push("/")} style={{ background: "#1a1814", color: "#fafaf8", border: "none", padding: "12px 32px", fontFamily: "'Syne', sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>
          Retour à la boutique
        </button>
      </div>
    </main>
  );

  return (
    <main style={{ fontFamily: "'Syne', sans-serif", background: "#fafaf8", minHeight: "100vh", padding: "48px 24px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Syne:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* Formulaire */}
        <div style={{ background: "#fff", border: "1px solid rgba(26,24,20,0.08)", padding: "48px 40px", marginBottom: 40 }}>
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #a8832a, transparent)", marginBottom: 36 }} />

          <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a8832a", marginBottom: 8 }}>Avis certifié</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: "#1a1814", marginBottom: 4 }}>
            Votre expérience
          </h1>
          <p style={{ fontSize: 13, color: "rgba(26,24,20,0.45)", marginBottom: 32 }}>avec <strong>{product}</strong></p>

          {/* Étoiles */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(26,24,20,0.4)", display: "block", marginBottom: 10 }}>Note</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", color: s <= (hover || rating) ? "#a8832a" : "rgba(26,24,20,0.15)", transition: "color 0.15s" }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Texte */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(26,24,20,0.4)", display: "block", marginBottom: 6 }}>Votre avis</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Décrivez votre expérience..."
              rows={5}
              style={{ width: "100%", background: "#f4f3ef", border: "1px solid rgba(26,24,20,0.07)", padding: "12px", fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#1a1814", outline: "none", resize: "vertical", lineHeight: 1.6 }}
            />
            <p style={{ fontSize: 10, color: "rgba(26,24,20,0.3)", marginTop: 4 }}>{body.length} caractères</p>
          </div>

          {error && (
            <div style={{ background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)", padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#c0392b" }}>
              {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            style={{ width: "100%", background: "#1a1814", color: "#fafaf8", border: "none", padding: "14px", fontFamily: "'Syne', sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Publication…" : "Publier mon avis certifié →"}
          </button>
        </div>

        {/* Section avis existants */}
        {totalReviews > 0 && (
          <div>
            {/* Header avis */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: "#1a1814" }}>
                Avis certifiés
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20, color: "#a8832a" }}>★</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: "#1a1814" }}>{average}</span>
                <span style={{ fontSize: 11, color: "rgba(26,24,20,0.4)" }}>({totalReviews} avis)</span>
              </div>
            </div>

            {/* Liste avis */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ background: "#fff", border: "1px solid rgba(26,24,20,0.08)", padding: "20px 24px", position: "relative" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: "#a8832a" }} />

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ color: s <= r.rating ? "#a8832a" : "rgba(26,24,20,0.15)", fontSize: 16 }}>★</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 9, color: "#2d7a58", letterSpacing: "0.12em", textTransform: "uppercase", background: "rgba(45,122,88,0.08)", border: "1px solid rgba(45,122,88,0.2)", padding: "2px 8px" }}>
                        ✦ Certifié
                      </span>
                      <span style={{ fontSize: 10, color: "rgba(26,24,20,0.3)" }}>
                        {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: "rgba(26,24,20,0.7)", lineHeight: 1.7, marginBottom: 10 }}>{r.body}</p>

                  <p style={{ fontSize: 9, color: "rgba(26,24,20,0.2)", fontFamily: "monospace", letterSpacing: "0.05em" }}>
                    #{r.attestationId.substring(0, 20).toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalReviews === 0 && (
          <div style={{ textAlign: "center", padding: "32px", color: "rgba(26,24,20,0.3)" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>Aucun avis pour le moment</p>
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          style={{ display: "block", margin: "24px auto 0", background: "none", border: "none", fontSize: 11, color: "rgba(26,24,20,0.3)", cursor: "pointer", letterSpacing: "0.08em" }}
        >
          ← Retour à la boutique
        </button>
      </div>
    </main>
  );
}

export default function ReviewsPage() {
  return <Suspense><ReviewsContent /></Suspense>;
}