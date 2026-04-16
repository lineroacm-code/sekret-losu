"use client";
import { useState, useEffect } from "react";

export default function Numerologia() {
  const [paid, setPaid] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 80 }, (_, i) => 2025 - i); // 2025 → 1945
  const [day1, setDay1] = useState("");
  const [month1, setMonth1] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [year1, setYear1] = useState("");
  const [day2, setDay2] = useState("");
  const [month2, setMonth2] = useState("");
  const [year2, setYear2] = useState("");
  const fullDateA = `${day1}.${month1}.${year1}`;
  const fullDateB = `${day2}.${month2}.${year2}`;
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectStyle = {
    padding: "10px 12px",
    borderRadius: 8,
    background: "rgba(20,20,30,0.9)",
    color: "#fff",
    border: "1px solid rgba(255,215,0,0.3)",
    outline: "none",
    fontSize: 14,
    cursor: "pointer",
  };
const calculate = async () => {
  setShowResult(false); // reset animacji

  if (!day1 || !month1 || !year1 || !day2 || !month2 || !year2) {
    alert("Uzupełnij obie daty");
    return;
  }

  try {
    setIsLoading(true);

    const res = await fetch("/api/numerologia", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateA: fullDateA,
        dateB: fullDateB,
      }),
    });

    const data = await res.json();

    setResult(data);
    setPaid(false);

    setTimeout(() => {
      setShowResult(true);
    }, 100);

  } catch (e) {
    console.error("ERROR:", e);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");

if (sessionId) {
  setPaid(true);
  setResult(null); // 🔥 KLUCZ


  window.history.replaceState({}, "", "/numerologia");
}
}, []);

  useEffect(() => {
  setTimeout(() => setHeroVisible(true), 100);
}, []);
   
  return (
    <>
    <main
    style={{
      position: "relative",
      minHeight: "100vh",
      background: "radial-gradient(circle at center, #1a1a2e, #0f0f1a)",
      color: "#fff",
      fontFamily: "'Playfair Display', serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 20px",
      letterSpacing: "0.3px",
    }}
  >
<div
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 70,
    display: "flex",
    alignItems: "center",
    padding: "0 30px",
    background: "linear-gradient(to bottom, rgba(10,10,20,0.9), rgba(10,10,20,0.2))",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,215,0,0.15)",
    zIndex: 100,
  }}
>
  <button
    onClick={() => (window.location.href = "/")}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 16px",
      fontSize: 14,
      background: "transparent",
      color: "#fff",
      border: "1px solid rgba(255,215,0,0.3)",
      borderRadius: 999,
      cursor: "pointer",
      transition: "all 0.25s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.border = "1px solid gold";
      e.currentTarget.style.boxShadow = "0 0 20px rgba(255,215,0,0.3)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.border = "1px solid rgba(255,215,0,0.3)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    Strona główna
  </button>
</div>


<div
  style={{
    width: "100vw", // 🔥 zmiana
    height: "420px",
    position: "relative",

    marginLeft: "calc(50% - 50vw)", // 🔥 KLUCZ
    marginRight: "calc(50% - 50vw)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    overflow: "hidden",
  }}
>
  {/* TŁO */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: "url('/banner2.png')", // 👈 użyj tego co wygenerowałem
      backgroundSize: "cover",
      backgroundPosition: "center",

      transform: heroVisible ? "scale(1)" : "scale(1.1)",
      opacity: heroVisible ? 1 : 0,

      transition: "all 1.5s ease",
    }}
  />

  {/* GRADIENT */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(10,10,20,0.95))",
    }}
  />

  {/* TEKST */}
  <div style={{ position: "relative", zIndex: 2 }}>
    <h1
      style={{
        fontSize: 64,
        fontWeight: 600,
        letterSpacing: "2px",
        textTransform: "uppercase",
        color: "#fff",
        textShadow: "0 0 30px rgba(255,215,0,0.3)",

        transform: heroVisible ? "translateY(0px)" : "translateY(30px)",
        opacity: heroVisible ? 1 : 0,

        transition: "all 0.8s ease",
      }}
    >
      Numerologia
    </h1>
    <p
  style={{
    fontSize: 20,
    opacity: 0.9,
    marginTop: 10,
  }}
>
  Czy to ma sens? Czy to działa? Czy to ma przyszłość?
</p>
  </div>
</div>

      {/* CTA */}
<div style={{ marginTop: 40 }}>
  <div style={{ textAlign: "center", marginBottom: 20 }}>
  <div style={{ fontSize: 18, marginBottom: 5 }}>
    Wprowadź daty urodzenia
  </div>
  <div style={{ opacity: 0.6, fontSize: 14 }}>
    To zajmie kilka sekund
  </div>
</div>
  {!paid && !result ? (
    // 🔥 PIERWSZA PŁATNOŚĆ
    <div
      style={{
        maxWidth: 700,
        textAlign: "center",
        margin: "0 auto 30px auto",
      }}
    >
<div style={{ lineHeight: 1.8, fontSize: 17, opacity: 0.85 }}>

  <div style={{ marginBottom: 15, fontSize: 20, color: "gold" }}>
    To nie jest przypadek, że na siebie trafiliście
  </div>

  <div style={{ marginBottom: 20 }}>
    Twoja data urodzenia to zapis schematów,
    które wpływają na sposób, w jaki kochasz,
    reagujesz i budujesz relacje.
  </div>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      marginBottom: 20,
    }}
  >
    <div>• czy tworzycie harmonię</div>
    <div>• czy między Wami jest napięcie</div>
    <div>• dlaczego czujesz to, co czujesz</div>
  </div>

  <div style={{ fontWeight: 500, color: "#fff" }}>
    Nie ogólnie. Konkretnie.
  </div>

</div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 25 }}>
        <button
          onClick={async () => {
            const res = await fetch("/api/checkout-numerologia", {
              method: "POST",
            });

            const data = await res.json();
            window.location.href = data.url;
          }}
          style={{
            padding: "14px 28px",
            fontSize: 18,
            background: "linear-gradient(135deg, gold, #ffd700)",
            color: "#000",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          Rozpocznij analizę – 10 PLN
        </button>
        <div style={{ marginTop: 10, opacity: 0.6, fontSize: 14 }}>
  Większość osób jest zaskoczona, jak trafne to jest
</div>
      </div>
    </div>
  ) : paid && !result ? (
    // 🔥 FORMULARZ
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          gap: 40,
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        {/* OSOBA 1 */}
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 10, fontSize: 14, opacity: 0.6 }}>
            OSOBA 1
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <select value={day1} onChange={(e) => setDay1(e.target.value)} style={selectStyle}>
              <option value="">Dzień</option>
              {days.map((d) => <option key={d}>{d}</option>)}
            </select>

            <select value={month1} onChange={(e) => setMonth1(e.target.value)} style={selectStyle}>
              <option value="">Miesiąc</option>
              {months.map((m) => <option key={m}>{m}</option>)}
            </select>

            <select value={year1} onChange={(e) => setYear1(e.target.value)} style={selectStyle}>
              <option value="">Rok</option>
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* OSOBA 2 */}
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 10, fontSize: 14, opacity: 0.6 }}>
            OSOBA 2
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <select value={day2} onChange={(e) => setDay2(e.target.value)} style={selectStyle}>
              <option value="">Dzień</option>
              {days.map((d) => <option key={d}>{d}</option>)}
            </select>

            <select value={month2} onChange={(e) => setMonth2(e.target.value)} style={selectStyle}>
              <option value="">Miesiąc</option>
              {months.map((m) => <option key={m}>{m}</option>)}
            </select>

            <select value={year2} onChange={(e) => setYear2(e.target.value)} style={selectStyle}>
              <option value="">Rok</option>
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 25 }}>
        <button
          onClick={calculate}
style={{
  padding: "14px 28px",
  fontSize: 18,
  background: "linear-gradient(135deg, gold, #ffd700)",
  color: "#000",
  border: "none",
  borderRadius: 12,
  cursor: "pointer",
  transition: "all 0.25s ease",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.transform = "scale(1.05)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "scale(1)";
}}
        >
          Zobacz, co Was łączy
        </button>
      </div>
    </div>
  ) : null}
</div>

      {/* LOADING */}
{isLoading && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "radial-gradient(circle, rgba(0,0,0,0.6), rgba(0,0,0,0.95))",
      backdropFilter: "blur(8px)",
      zIndex: 999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontSize: 22,
        marginBottom: 20,
        letterSpacing: 1,
        animation: "pulse 2s infinite",
      }}
    >
      🔮 Analiza energii...
    </div>

    <div style={{ fontSize: 14, opacity: 0.6 }}>
      Łączenie wzorców numerologicznych...
    </div>

    <div
      style={{
        marginTop: 30,
        width: 40,
        height: 40,
        border: "3px solid rgba(255,215,0,0.2)",
        borderTop: "3px solid gold",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  </div>
)}

{/* WYNIK */}
{result && (
  
  <div
    style={{
      opacity: showResult ? 1 : 0,
      transform: showResult ? "translateY(0px)" : "translateY(30px)",
      transition: "all 0.8s ease",
    }}
  >
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <div style={{ fontSize: 18, color: "gold" }}>
        Wynik może Cię zaskoczyć
      </div>
    </div>

    <div style={{ marginTop: 30, textAlign: "center" }}>
      <button
        onClick={async () => {
          const res = await fetch("/api/checkout-numerologia", {
            method: "POST",
          });

          const data = await res.json();
          window.location.href = data.url;
        }}
        style={{
          padding: "14px 28px",
          fontSize: 16,
          background: "linear-gradient(135deg, gold, #ffd700)",
          color: "#000",
          border: "none",
          borderRadius: 12,
          cursor: "pointer",
        }}
      >
        Sprawdź kolejną kompatybilność – 10 PLN
      </button>
    </div>

    <div
      style={{
        marginTop: 60,
        maxWidth: 700,
        width: "100%",
        background: "linear-gradient(145deg, rgba(10,10,20,0.9), rgba(20,20,40,0.9))",
        padding: 40,
        borderRadius: 20,
        border: "1px solid rgba(255,215,0,0.4)",
        boxShadow: "0 0 40px rgba(255,215,0,0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      {[
        ["Osoba A", result.personA],
        ["Osoba B", result.personB],
        ["Dopasowanie", result.compatibility],
        ["Napięcia", result.tension],
        ["Przyciąganie", result.attraction],
        ["Wzorzec relacji", result.relationship_pattern],
        ["Potencjał", result.long_term],
      ].map(([title, text], i) => (
        <div key={i} style={{ marginBottom: 25 }}>
          <div
            style={{
              color: "gold",
              fontSize: 13,
              letterSpacing: 1.5,
              marginBottom: 8,
            }}
          >
            {title.toUpperCase()}
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#ddd" }}>
            {text}
          </p>
        </div>
      ))}

      <div
        style={{
          marginTop: 20,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            color: "gold",
            fontSize: 13,
            letterSpacing: 1.5,
            marginBottom: 8,
          }}
        >
          PODSUMOWANIE
        </div>

        <p style={{ fontSize: 17, lineHeight: 1.9, color: "#fff" }}>
          {result.summary}
        </p>
      </div>
    </div>
  </div>
)}
</main>

<style jsx global>{`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`}</style>
</>
  );
}