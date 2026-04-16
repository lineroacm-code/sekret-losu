"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [website, setWebsite] = useState("");
const [message, setMessage] = useState("");
const handleSubmit = async (e: any) => {
  e.preventDefault();

  // 🔒 honeypot
  if (website) {
    console.log("Bot detected");
    return;
  }

  await fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify({
      email,
      message,
      website, // 🔥 dodaj
    }),
  });

  alert("Wiadomość wysłana ✨");
};
  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at center, #1a1a2e, #0f0f1a)",
        color: "#fff",
        fontFamily: "'Playfair Display', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 🔥 HERO */}
      <div
        style={{
          width: "100%",
          height: "420px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
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

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(10,10,20,0.95))",
          }}
        />

<div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
  <h1
    style={{
      fontSize: 64,
      fontWeight: 600,
      letterSpacing: "2px",
      textTransform: "uppercase",
      textShadow: "0 0 30px rgba(255,215,0,0.3)",
      marginBottom: 10,
    }}
  >
    Sekret Losu
  </h1>

  <p style={{ fontSize: 20, opacity: 0.9, marginBottom: 30 }}>
    Sprawdź, co naprawdę się dzieje
  </p>

  <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
    <button
      onClick={() => (window.location.href = "/tarot")}
      style={{
        padding: "12px 24px",
        background: "linear-gradient(135deg, gold, #ffd700)",
        border: "none",
        borderRadius: 10,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Tarot
    </button>

    <button
      onClick={() => (window.location.href = "/numerologia")}
      style={{
        padding: "12px 24px",
        background: "rgba(255,255,255,0.1)",
        border: "1px solid gold",
        borderRadius: 10,
        color: "#fff",
        cursor: "pointer",
      }}
    >
      Numerologia
    </button>
  </div>
</div>
      </div>

      {/* 🔥 OPIS + ZAKRES */}
      <section
        style={{
          maxWidth: 900,
          textAlign: "center",
          marginTop: 60,
          padding: "0 20px",
        }}
      >
        <h2 style={{ fontSize: 28, marginBottom: 20 }}>
          Zakres usług
        </h2>

        <p
          style={{
            lineHeight: 1.8,
            opacity: 0.8,
            fontSize: 18,
          }}
        >
          Wybierz, czego chcesz się dowiedzieć
        </p>
      </section>

      {/* 🔥 KAFELKI */}
      <section
        style={{
          marginTop: 60,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 40,
          width: "100%",
          maxWidth: 1000,
          padding: "0 20px",
        }}
      >
        {[
{
    title: "Tarot",
    desc: "Co się dzieje? Co było wcześniej? Dokąd to zmierza?",
    img: "/cards/tarot.png",
    link: "/tarot",
    active: true,
  },
  {
    title: "Numerologia",
    desc: "Sprawdź, czy naprawdę do siebie pasujecie.",
    img: "/cards/numerologia.png",
    link: "/numerologia",
    active: true,
  },
  {
    title: "Horoskop - WKRÓTCE DOSTĘPNE",
    desc: "Już niedługo dostępne.",
    img: "/cards/Horoskop.png",
    active: false,
  },
  {
    title: "Energia - WKRÓTCE DOSTĘPNE",
    desc: "Już niedługo dostępne.",
    img: "/cards/energia.png",
    active: false,
  },
].map((item, i) => (
          <div
  key={i}
onClick={() => {
  if (item.active && item.link) {
    window.location.href = item.link;
  }
}}
title={item.active ? "Kliknij, aby sprawdzić" : ""}
  style={{
    display: "flex",
    gap: 30,
    alignItems: "center",
    background: "rgba(10,10,20,0.6)",
    padding: 20,
    borderRadius: 16,
    border: "1px solid rgba(255,215,0,0.2)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    cursor: item.active ? "pointer" : "default",
    opacity: item.active ? 1 : 0.5, // 🔥 przygaszone jak niedostępne
  }}
  onMouseEnter={(e) => {
    if (!item.active) return;
    e.currentTarget.style.transform = "scale(1.02)";
    e.currentTarget.style.boxShadow =
      "0 0 30px rgba(255,215,0,0.2)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
  }}
>
            <img
              src={item.img}
              style={{
                width: 120,
                height: 180,
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid gold",
              }}
            />

<div>
  <h3 style={{ marginBottom: 10 }}>{item.title}</h3>

  <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
    {item.desc}
  </p>

  {item.active && (
    <button
      style={{
        marginTop: 10,
        padding: "8px 16px",
        background: "gold",
        border: "none",
        borderRadius: 8,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      Sprawdź teraz
    </button>
  )}
</div>
          </div>
        ))}
      </section>

{/* 🔥 FORMULARZ */}
<section
  style={{
    marginTop: 100,
    width: "100%",
    maxWidth: 600,
    textAlign: "center",
    padding: "0 20px 80px",
  }}
>
  <h2 style={{ fontSize: 32, marginBottom: 10 }}>
    Napisz do nas
  </h2>

  <p style={{ opacity: 0.7, marginBottom: 40 }}>
    W razie jakichkolwiek wątpliwości zapraszamy do kontaktu.
  </p>

  <form
    onSubmit={handleSubmit}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      background: "rgba(10,10,20,0.7)",
      padding: 30,
      borderRadius: 20,
      border: "1px solid rgba(255,215,0,0.2)",
      backdropFilter: "blur(12px)",
      boxShadow: "0 0 40px rgba(255,215,0,0.05)",
    }}
  >
    <input
  type="text"
  name="website"
  value={website}
  onChange={(e) => setWebsite(e.target.value)}
  style={{ display: "none" }}
/>
    {/* EMAIL */}
    <input
      placeholder="Twój email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      style={{
        padding: "14px 16px",
        borderRadius: 12,
        border: "1px solid rgba(255,215,0,0.15)",
        background: "rgba(0,0,0,0.4)",
        color: "#fff",
        outline: "none",
        transition: "all 0.2s ease",
      }}
      onFocus={(e) =>
        (e.currentTarget.style.border = "1px solid gold")
      }
      onBlur={(e) =>
        (e.currentTarget.style.border =
          "1px solid rgba(255,215,0,0.15)")
      }
    />

    {/* WIADOMOŚĆ */}
    <textarea
      placeholder="Wiadomość"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      rows={5}
      style={{
        padding: "14px 16px",
        borderRadius: 12,
        border: "1px solid rgba(255,215,0,0.15)",
        background: "rgba(0,0,0,0.4)",
        color: "#fff",
        outline: "none",
        resize: "none",
        transition: "all 0.2s ease",
      }}
      onFocus={(e) =>
        (e.currentTarget.style.border = "1px solid gold")
      }
      onBlur={(e) =>
        (e.currentTarget.style.border =
          "1px solid rgba(255,215,0,0.15)")
      }
    />

    {/* BUTTON */}
    <button
      type="submit"
      style={{
        marginTop: 10,
        padding: "14px",
        fontSize: 16,
        background: "linear-gradient(135deg, gold, #ffd700)",
        color: "#000",
        border: "none",
        borderRadius: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: "0 5px 20px rgba(255,215,0,0.2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(255,215,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow =
          "0 5px 20px rgba(255,215,0,0.2)";
      }}
    >
      Wyślij wiadomość
    </button>
  </form>
</section>

<div
  style={{
    width: "100%",
    padding: "20px 0 30px",
    display: "flex",
    justifyContent: "center",
    gap: 30,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    marginTop: 40,
  }}
>
  {/* REGULAMIN */}
  <button
    onClick={() => (window.location.href = "/regulamin")}
    style={{
      background: "transparent",
      color: "#fff",
      border: "none",
      fontSize: 14,
      cursor: "pointer",
      opacity: 0.7,
      transition: "all 0.25s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.opacity = "1";
      e.currentTarget.style.textShadow = "0 0 10px rgba(255,215,0,0.6)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.opacity = "0.7";
      e.currentTarget.style.textShadow = "none";
    }}
  >
    Regulamin
  </button>

  {/* POLITYKA */}
  <button
    onClick={() => (window.location.href = "/polityka-prywatnosci")}
    style={{
      background: "transparent",
      color: "#fff",
      border: "none",
      fontSize: 14,
      cursor: "pointer",
      opacity: 0.7,
      transition: "all 0.25s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.opacity = "1";
      e.currentTarget.style.textShadow = "0 0 10px rgba(255,215,0,0.6)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.opacity = "0.7";
      e.currentTarget.style.textShadow = "none";
    }}
  >
    Polityka prywatności
  </button>
</div>

    </main>
  );
}