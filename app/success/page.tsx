"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function SuccessContent() {
  const params    = useSearchParams();
  const router    = useRouter();
  const orderRef  = params.get("orderRef") ?? "";
  const amount    = params.get("amount") ?? "";
  const currency  = params.get("currency") ?? "EUR";
  const product   = params.get("product") ?? "Produit";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  return (
    <main style={{ fontFamily: "'Syne', sans-serif", background: "#fafaf8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Syne:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Data-attributes pour le content script */}
      <div
        id="sigil-order-data"
        data-order-ref={orderRef}
        data-amount={amount}
        data-currency={currency}
        data-product={product}
        style={{ display: "none" }}
      />

      <div style={{
        width: "100%", maxWidth: 480, background: "#fff",
        border: "1px solid rgba(26,24,20,0.08)", padding: "48px 40px",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease"
      }}>
        <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #a8832a, transparent)", marginBottom: 36 }} />

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", border: "1.5px solid rgba(168,131,42,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", background: "rgba(168,131,42,0.05)", fontSize: 24, color: "#a8832a" }}>✦</div>
          <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a8832a", marginBottom: 12 }}>Achat confirmé</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: "#1a1814", lineHeight: 1.2, marginBottom: 12 }}>
            Votre achat<br /><em>a bien été effectué</em>
          </h1>
          <p style={{ fontSize: 13, color: "rgba(26,24,20,0.45)", lineHeight: 1.7 }}>
            Votre transaction a été traitée avec succès.
          </p>
        </div>

        {/* Récapitulatif commande */}
        <div style={{ background: "#f4f3ef", border: "1px solid rgba(26,24,20,0.06)", padding: "16px 20px", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "rgba(26,24,20,0.45)", letterSpacing: "0.08em" }}>Produit</span>
            <span style={{ fontSize: 12, color: "#1a1814", fontWeight: 500 }}>{product}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "rgba(26,24,20,0.45)", letterSpacing: "0.08em" }}>Référence</span>
            <span style={{ fontSize: 11, color: "#1a1814", fontFamily: "monospace" }}>{orderRef}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(26,24,20,0.07)", paddingTop: 8, marginTop: 8 }}>
            <span style={{ fontSize: 11, color: "rgba(26,24,20,0.45)", letterSpacing: "0.08em" }}>Montant</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#a8832a" }}>{parseFloat(amount).toFixed(2)} {currency}</span>
          </div>
        </div>

        {/* Message Sigil */}
        <div style={{ border: "1px solid rgba(168,131,42,0.2)", background: "rgba(168,131,42,0.04)", padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#a8832a", fontSize: 16 }}>✦</span>
          <p style={{ fontSize: 12, color: "rgba(26,24,20,0.6)", lineHeight: 1.6 }}>
            L'extension Sigil a détecté cet achat. Certifiez-le depuis le popup pour pouvoir laisser un avis vérifié.
          </p>
        </div>

        {/* Boutons d'action */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => router.push("/")}
            style={{ 
              flex: 1, 
              background: "none", 
              border: "1px solid rgba(26,24,20,0.1)", 
              padding: "12px", 
              fontFamily: "'Syne', sans-serif", 
              fontSize: 10, 
              letterSpacing: "0.14em", 
              textTransform: "uppercase", 
              cursor: "pointer", 
              color: "rgba(26,24,20,0.5)",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(26,24,20,0.3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(26,24,20,0.1)"}
          >
            ← Boutique
          </button>
          <button
            onClick={() => router.push(`/reviews?merchantDid=did:sigil:0xMERCHANT&product=${encodeURIComponent(product)}`)}
            style={{ 
              flex: 2, 
              background: "#1a1814", 
              color: "#fafaf8", 
              border: "none", 
              padding: "12px", 
              fontFamily: "'Syne', sans-serif", 
              fontSize: 10, 
              letterSpacing: "0.14em", 
              textTransform: "uppercase", 
              cursor: "pointer",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Laisser un avis →
          </button>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}