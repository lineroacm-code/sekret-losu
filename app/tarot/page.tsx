"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import {
  saveCurrentReading,
  getCurrentReading,
  clearCurrentReading,
} from '../../storage/tarotStorage'

const DEV_MODE = true;

const cardsData = [
  { id: 0, name: "Głupiec", meaning: "nowy początek", image: "/cards/0.png" },
  { id: 1, name: "Mag", meaning: "sprawczość", image: "/cards/1.png" },
  { id: 2, name: "Papieżyca", meaning: "intuicja", image: "/cards/2.png" },
  { id: 3, name: "Cesarzowa", meaning: "kreatywność", image: "/cards/3.png" },
  { id: 4, name: "Cesarz", meaning: "kontrola", image: "/cards/4.png" },
  { id: 5, name: "Hierofant", meaning: "tradycja", image: "/cards/5.png" },
  { id: 6, name: "Kochankowie", meaning: "wybory", image: "/cards/6.png" },
  { id: 7, name: "Rydwan", meaning: "determinacja", image: "/cards/7.png" },
  { id: 8, name: "Sprawiedliwość", meaning: "równowaga", image: "/cards/8.png" },
  { id: 9, name: "Eremita", meaning: "refleksja", image: "/cards/9.png" },
  { id: 10, name: "Koło Fortuny", meaning: "zmiany", image: "/cards/10.png" },
  { id: 11, name: "Moc", meaning: "siła", image: "/cards/11.png" },
  { id: 12, name: "Wisielec", meaning: "perspektywa", image: "/cards/12.png" },
  { id: 13, name: "Śmierć", meaning: "transformacja", image: "/cards/13.png" },
  { id: 14, name: "Umiarkowanie", meaning: "harmonia", image: "/cards/14.png" },
  { id: 15, name: "Diabeł", meaning: "ograniczenia", image: "/cards/15.png" },
  { id: 16, name: "Wieża", meaning: "zmiana", image: "/cards/16.png" },
  { id: 17, name: "Gwiazda", meaning: "nadzieja", image: "/cards/17.png" },
  { id: 18, name: "Księżyc", meaning: "iluzja", image: "/cards/18.png" },
  { id: 19, name: "Słońce", meaning: "radość", image: "/cards/19.png" },
  { id: 20, name: "Sąd Ostateczny", meaning: "przebudzenie", image: "/cards/20.png" },
  { id: 21, name: "Świat", meaning: "spełnienie", image: "/cards/21.png" },
];

export default function Home() {
  const [drawn, setDrawn] = useState<any[]>([]);
  const [interpretation, setInterpretation] = useState<any>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [paid, setPaid] = useState(false);
  const [justPaid, setJustPaid] = useState(false);
  const [cards, setCards] = useState<string[]>([]);
  const [isHydrating, setIsHydrating] = useState(true);
  const [fade, setFade] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [revealed, setRevealed] = useState([false, false, false]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [readingType, setReadingType] = useState<"general" | "love" | "question" | null>(null);
  const [userQuestion, setUserQuestion] = useState("");
  const getDeviceId = () => {
      let id = localStorage.getItem("deviceId");
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("deviceId", id);
      }
      return id;
    };

  const startReadingFlow = async () => {
  try {
    setIsLoading(true);

    // 🎴 1. losowanie kart (Twoja funkcja)
    const drawnCards = await drawCards(); // ← jeśli masz inaczej nazwane, podmień

    setDrawn(drawnCards);

    // jeśli cards = np. nazwy kart:
    const cardNames = drawnCards.map((c: any) => c.name);
    setCards(cardNames);

    setHasDrawn(true);

    // 🤖 2. request do API
    const response = await fetch('/api/tarot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
  cards: cardNames,
  type: readingType,
  question: userQuestion,
}),
    });

    const data = await response.json();

    setInterpretation(data);
    setPaid(false);
    localStorage.removeItem("paid");
    

    // 💾 3. zapis do AsyncStorage
    await saveCurrentReading({
      id: Date.now().toString(),
      cards: cardNames,
      interpretation: data,
      createdAt: Date.now(),
    });

    // 🎬 4. reveal animacja (jeśli masz)
    setIsRevealing(true);

    setTimeout(() => setRevealed([true, false, false]), 300);
    setTimeout(() => setRevealed([true, true, false]), 900);
    setTimeout(() => setRevealed([true, true, true]), 1500);
    setTimeout(() => setIsRevealing(false), 1800);

  } catch (e) {
    console.log('Reading error:', e);
  } finally {
    setIsLoading(false);
  }
};

useLayoutEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");

  console.log("👉 URL:", window.location.href);
  console.log("👉 SESSION ID:", sessionId);

if (sessionId) {
  setPaid(true);
  setJustPaid(true); // 🔥 NOWE

  localStorage.setItem("paid", "true");

  setInterpretation(null);
  setDrawn([]);
  setRevealed([false, false, false]);

  window.history.replaceState({}, "", "/");
}
}, []);

useEffect(() => {
  const paid = localStorage.getItem("paid");
  if (paid === "true") {
    setPaid(true);
  }
}, []);

useEffect(() => {
  const type = localStorage.getItem("readingType");
  if (type) setReadingType(type as any);
}, []);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");

  if (sessionId) return; // 🔥 KLUCZ

  const loadReading = async () => {
    try {
      const saved = await getCurrentReading();

      if (saved) {
        setCards(saved.cards);
        setInterpretation(saved.interpretation);
        setHasDrawn(true);
        setRevealed([true, true, true]);

        const restoredCards = saved.cards
          .map((name: string) =>
            cardsData.find((c) => c.name === name)
          )
          .filter(Boolean);

        setDrawn(restoredCards);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsHydrating(false);
    }
  };

  loadReading();
}, []);

  useEffect(() => {
  setTimeout(() => setHeroVisible(true), 100);
}, []);

useEffect(() => {
  if (!isLoading) return;

  setLoadingTextIndex(0);
  setFade(true);

  const interval = setInterval(() => {
    setFade(false); // 🔻 zaczyna znikać

    setTimeout(() => {
      setLoadingTextIndex((prev: number) =>
        prev < loadingTexts.length - 1 ? prev + 1 : prev
      );
      setFade(true); // 🔺 pojawia się nowy
    }, 400); // czas fade-out
  }, 2000);

  return () => clearInterval(interval);
}, [isLoading]);

const drawCards = () => {
  const shuffled = [...cardsData].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  return selected; // 🔥 KLUCZ
};

  const loadingTexts = [
  "Tasowanie kart...",
  "Łączenie energii...",
  "To może być ważne...",
  "Interpretacja układu...",
];

return (
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
    

       {/* 🔥 LOADING OVERLAY */}
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
        <div
          style={{
            fontSize: 22,
            marginBottom: 20,
            letterSpacing: 1,
            opacity: fade ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          🔮 {loadingTexts[loadingTextIndex]}
        </div>
        </div>

        <div style={{ fontSize: 14, opacity: 0.6 }}>
          Tworzenie interpretacji...
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
        backgroundImage: "url('/banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",

        transform: heroVisible ? "scale(1)" : "scale(1.1)",
        opacity: heroVisible ? 1 : 0,

        transition: "all 1.5s ease",
      }}
    />

  {/* GRADIENT OVERLAY */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(10,10,20,0.95))",
    }}
  />

  {/* CONTENT */}
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
  Tarot
</h1>
<p
  style={{
    fontSize: 20,
    opacity: 0.9,
    marginTop: 10,
  }}
>
  Co się dzieje? Co było? Co dalej?
</p>
  </div>
</div>

<div
  style={{
    width: "100%",
    maxWidth: 900,
    margin: "60px auto 40px auto",
    textAlign: "center",
  }}
>

<div
  style={{
    marginBottom: 15,
    fontSize: 22,
    fontWeight: 500,
    color: "gold",
    textShadow: "0 0 20px rgba(255,215,0,0.3)",
  }}
>
  To nie jest przypadek, że tu jesteś
</div>

<div
  style={{
    marginBottom: 25,
    opacity: 0.6,
    fontSize: 14,
    letterSpacing: 0.5,
  }}
>
  Odpowiedź zajmie mniej niż 30 sekund
</div>

<div style={{ lineHeight: 1.8, fontSize: 17, opacity: 0.85 }}>

  <div style={{ marginBottom: 15 }}>
    To może dotyczyć dokładnie Twojej sytuacji:
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
    <div>• co doprowadziło Cię do tego momentu</div>
    <div>• co dzieje się teraz</div>
    <div>• dokąd to zmierza</div>
  </div>

  <div
    style={{
      fontWeight: 500,
      color: "#fff",
      marginTop: 10,
    }}
  >
    Nie ogólnie. Konkretnie.
  </div>

</div>

</div>

<div style={{ height: 40 }} />

      {isRevealing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "radial-gradient(circle, rgba(0,0,0,0.4), rgba(0,0,0,0.9))",
            backdropFilter: "blur(6px)",
            zIndex: 10,
          }}
        />
      )}

      {/* 🔥 WRAPPER */}
      <div style={{ width: "100%", maxWidth: 1000, textAlign: "center" }}>
        
<div style={{ marginBottom: 20 }}>

{/* 💳 PŁATNOŚĆ */}
{!paid && !interpretation && (
  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>

    {/* OGÓLNY */}
    <div
      onClick={async () => {
        setReadingType("general");
        localStorage.setItem("readingType", "general");

        const deviceId = getDeviceId();

        const res = await fetch("/api/checkout", {
          method: "POST",
          body: JSON.stringify({
            deviceId,
            type: "general",
            priceId: "https://buy.stripe.com/28EfZi6ze5Y26pS2GCaZi04",
          }),
        });

        const data = await res.json();
        window.location.href = data.url;
      }}
      style={{
        width: 260,
        background: "#111",
        padding: 20,
        borderRadius: 16,
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translateY(-5px)";
  e.currentTarget.style.boxShadow = "0 0 30px rgba(255,215,0,0.2)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "none";
}}
      
    >
      <h3>Rozkład ogólny</h3>
      <p style={{ opacity: 0.7 }}>Ogólna energia i kierunek</p>
      <div style={{ marginTop: 10, color: "gold" }}>Sprawdź – 10 PLN</div>
    </div>

    {/* MIŁOSNY (highlight) */}
    <div
      onClick={async () => {
        setReadingType("love");
        localStorage.setItem("readingType", "love");

        const deviceId = getDeviceId();

        const res = await fetch("/api/checkout", {
          method: "POST",
          body: JSON.stringify({
            deviceId,
            type: "love",
            priceId: "https://buy.stripe.com/5kQ3cw7Di86a4hKa94aZi05",
          }),
        });

        const data = await res.json();
        window.location.href = data.url;
      }}
      style={{
        width: 260,
        background: "#111",
        padding: 20,
        borderRadius: 16,
        cursor: "pointer",
        transition: "all 0.25s ease",
        border: "1px solid rgba(255,215,0,0.2)", // 🔥 tylko tutaj
      }}
onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translateY(-5px)";
  e.currentTarget.style.boxShadow = "0 0 30px rgba(255,215,0,0.2)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "none";
}}
    >
      <h3>Rozkład miłosny</h3>
      <p style={{ opacity: 0.7 }}>Ukryte emocje i intencje</p>
      <div style={{ marginTop: 10, color: "gold" }}>Sprawdź – 10 PLN</div>
    </div>

    {/* PYTANIE */}
    <div
      onClick={async () => {
        setReadingType("question");
        localStorage.setItem("readingType", "question");

        const deviceId = getDeviceId();

        const res = await fetch("/api/checkout", {
          method: "POST",
          body: JSON.stringify({
            deviceId,
            type: "question",
            priceId: "https://buy.stripe.com/eVq3cw6ze4TY7tW4OKaZi06",
          }),
        });

        const data = await res.json();
        window.location.href = data.url;
      }}
      style={{
        width: 260,
        background: "#111",
        padding: 20,
        borderRadius: 16,
        cursor: "pointer",
        transition: "all 0.25s ease",
      }}
onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translateY(-5px)";
  e.currentTarget.style.boxShadow = "0 0 30px rgba(255,215,0,0.2)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "none";
}}
    >
      <h3>Własne pytanie</h3>
      <p style={{ opacity: 0.7 }}>Pełna personalizacja</p>
      <div style={{ marginTop: 10, color: "gold" }}>Zadaj pytanie – 20 PLN</div>
    </div>

  </div>
)}

  {/* 🔮 ROZŁÓŻ KARTY (po płatności) */}
{paid && (justPaid || !interpretation) && (
  <div>
    {readingType === "question" && (
      <textarea
        placeholder="Wpisz swoje pytanie..."
        value={userQuestion}
        onChange={(e) => setUserQuestion(e.target.value.slice(0, 300))}
        style={{
          width: "100%",
          maxWidth: 500,
          height: 100,
          marginBottom: 15,
          padding: 10,
          borderRadius: 10,
        }}
      />
    )}

    <button
      onClick={startReadingFlow}
      style={{
        padding: "12px 20px",
        fontSize: 16,
        background: "#fff",
        color: "#000",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
      }}
    >
      Rozpocznij interpretację
    </button>

    <div style={{ marginTop: 10, opacity: 0.6 }}>
      Kliknij, aby rozpocząć interpretację
    </div>
  </div>
)}

  {/* 🔁 KOLEJNA PŁATNOŚĆ */}
  {interpretation && (
    <button
      onClick={async () => {
        const deviceId = getDeviceId();

        const res = await fetch("/api/checkout", {
          method: "POST",
          body: JSON.stringify({ deviceId }),
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
      Rozłóż ponownie – 10 PLN
    </button>
  )}
</div>


     <div style={{ marginTop: 40 }}></div>       
            {/* KARTY */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 40,
                flexWrap: "wrap",
              }}
            >
              {drawn.map((card, i) => (
                <div
                  key={i}
                  style={{
                    width: 280,
                    height: 440,
                    perspective: 1200,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.8s",
                      transform: revealed[i]
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                    }}
                  >
                    {/* TYŁ */}
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        borderRadius: 16,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src="/cards/back.png"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 16,
                        }}
                      />
                    </div>

                    {/* PRZÓD */}
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <img
                        src={card.image}
                        alt={card.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 16,
                          border: "2px solid gold",
                          boxShadow: isRevealing
                          ? "0 0 50px rgba(255,215,0,0.35)"
                          : revealed[i]
                          ? "0 0 30px rgba(255,215,0,0.5)"
                          : "0 10px 30px rgba(0,0,0,0.6)",
                        transition: "box-shadow 0.5s",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 10, opacity: 0.7 }}>
                    {["Przeszłość", "Teraźniejszość", "Przyszłość"][i]}
                  </div>
                </div>
              ))}
            </div>

            {/* INTERPRETACJA */}
{interpretation && (
  <div
    style={{
      marginTop: 80,
      width: "100%",
      maxWidth: 1000,
      background: "rgba(10,10,20,0.85)",
      padding: "40px 35px",
      borderRadius: 20,
      border: "1px solid rgba(255,215,0,0.25)",
      backdropFilter: "blur(12px)",
      boxShadow: "0 0 80px rgba(255,215,0,0.08)",
        }}
  >
    {/* HEADER */}
    <div style={{ textAlign: "center", marginBottom: 30 }}>
      <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.5 }}>
        TWOJA ANALIZA
      </div>
      <h2 style={{ fontSize: 28, marginTop: 10 }}>
        🔮 Interpretacja kart
      </h2>
    </div>

    {/* SEKCJE */}
    {[
      ["Przeszłość", interpretation.past],
      ["Teraźniejszość", interpretation.present],
      ["Przyszłość", interpretation.future],
    ].map(([title, text], i) => (
      <div key={i} style={{ marginBottom: 20 }}>
        <div
          style={{
            color: "gold",
            fontSize: 13,
            letterSpacing: 1.5,
            marginBottom: 10,
            opacity: 0.8,
          }}
        >
          {title.toUpperCase()}
        </div>

        <p
          style={{
            fontSize: 17,
            lineHeight: 1.9,
            color: "#ddd",
          }}
        >
          {text}
        </p>
      </div>
    ))}

    {/* SYNTEZA */}
    <div
      style={{
        marginTop: 20,
        paddingTop: 25,
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          color: "gold",
          fontSize: 13,
          letterSpacing: 1.5,
          marginBottom: 10,
        }}
      >
        POŁĄCZENIE ENERGII
      </div>

      <p
        style={{
          fontSize: 17,
          lineHeight: 1.9,
          color: "#fff",
        }}
      >
        {interpretation.synthesis}
      </p>
    </div>
  </div>
)}
      </div>
    </main>
  );
}