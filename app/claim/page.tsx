"use client";

import { useState } from "react";
import { API_URL } from "../lib/config"; // Importez la config

export default function Claim() {
  const [status, setStatus] = useState("");

  const handleClaim = async () => {
    const stored = localStorage.getItem("sigil_last_experience");
    if (!stored) {
      setStatus("Aucune expérience trouvée");
      return;
    }

    const exp = JSON.parse(stored);

    const res = await fetch(`${API_URL}/api/experience/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pendingExperienceId: exp.pendingExperienceId,
      }),
    });

    const data = await res.json();

    if (data.ok) {
      setStatus("🎉 Claim réussi !");
    } else {
      setStatus("Erreur : " + data.error);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Claim expérience</h1>
      <button onClick={handleClaim}>Claim</button>

      <p>{status}</p>
    </div>
  );
}