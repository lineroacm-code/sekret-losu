"use client";

import { useEffect, useState } from "react";

export default function Regulamin() {
  const [heroVisible, setHeroVisible] = useState(false);

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
      {/* 🔝 NAVBAR */}
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
          background:
            "linear-gradient(to bottom, rgba(10,10,20,0.9), rgba(10,10,20,0.2))",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,215,0,0.15)",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "8px 16px",
            fontSize: 14,
            background: "transparent",
            color: "#fff",
            border: "1px solid rgba(255,215,0,0.3)",
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          Strona główna
        </button>
      </div>

      {/* 🔥 HERO */}
      <div
        style={{
          width: "100vw",
          height: "300px",
          position: "relative",
          marginLeft: "calc(50% - 50vw)",
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

        <h1
          style={{
            position: "relative",
            fontSize: 48,
            letterSpacing: "2px",
            textTransform: "uppercase",
            textShadow: "0 0 20px rgba(255,215,0,0.3)",
          }}
        >
          Regulamin
        </h1>
      </div>

<div
  style={{
    width: "100%",
    maxWidth: 900,
    padding: "80px 20px 100px", // 🔥 KLUCZ
    fontSize: 15,
    opacity: 0.9,
  }}
>
  
  {[
    {
      title: "Informacje ogólne",
      content: (
        <>
          <p>
            Niniejszy regulamin określa zasady korzystania z serwisu „Sekret Losu”.
            Korzystanie z serwisu oznacza akceptację wszystkich poniższych warunków.
          </p>
          <p>
            Usługodawcą jest:
            <br />
            Kacper Krawczyk
            <br />
            Zaciszna 12, 44-336 Jastrzębie-Zdrój
            <br />
            lineroacm@gmail.com
          </p>
        </>
      ),
    },
    {
      title: "Charakter usług",
      content: (
        <>
          <p>
            Serwis oferuje analizy oparte na symbolice, interpretacji oraz systemach takich jak tarot i numerologia.
          </p>
          <p>
            Wszystkie treści mają charakter refleksyjny i rozrywkowy.
          </p>
          <p>
            Usługi nie stanowią porady medycznej, prawnej ani finansowej.
          </p>
        </>
      ),
    },
    {
      title: "Warunki korzystania",
      content: (
        <>
          <p>
            Z serwisu mogą korzystać wyłącznie osoby, które ukończyły 18 lat.
          </p>
          <p>
            Użytkownik zobowiązuje się do korzystania z serwisu zgodnie z prawem.
          </p>
        </>
      ),
    },
    {
      title: "Płatności i realizacja usług",
      content: (
        <>
          <p>
            Usługi mają charakter cyfrowy i są realizowane po dokonaniu płatności.
          </p>
          <p>
            Dostęp przyznawany jest natychmiast po opłaceniu usługi.
          </p>
        </>
      ),
    },
    {
      title: "Brak prawa do odstąpienia",
      content: (
        <>
          <p>
            Po rozpoczęciu świadczenia usługi cyfrowej użytkownik traci prawo do odstąpienia od umowy.
          </p>
        </>
      ),
    },
    {
      title: "Zwroty i reklamacje",
      content: (
        <>
          <p>
            Ze względu na cyfrowy charakter usług nie przysługuje zwrot środków po wykonaniu usługi.
          </p>
        </>
      ),
    },
    {
      title: "Odpowiedzialność",
      content: (
        <>
          <p>
            Użytkownik korzysta z serwisu na własną odpowiedzialność.
          </p>
          <p>
            Usługodawca nie odpowiada za decyzje podejmowane na podstawie treści.
          </p>
        </>
      ),
    },
    {
      title: "Dane i prywatność",
      content: (
        <>
          <p>
            Dane użytkowników przetwarzane są zgodnie z polityką prywatności.
          </p>
        </>
      ),
    },
    {
      title: "Postanowienia końcowe",
      content: (
        <>
          <p>
            Regulamin może ulec zmianie.
          </p>
          <p>
            Obowiązuje prawo polskie.
          </p>
        </>
      ),
    },
  ].map((section, i) => (
    <div
      key={i}
      style={{
        marginBottom: 35, // 🔥 spacing między sekcjami
      }}
    >
      <h3
        style={{
          color: "gold", // 🔥 kolor nagłówka
          marginBottom: 12,
          fontSize: 16,
          letterSpacing: "1px",
        }}
      >
        {i + 1}. {section.title.toUpperCase()}
      </h3>

      <div
        style={{
          lineHeight: 1.9,
          opacity: 0.85,
        }}
      >
        {section.content}
      </div>
    </div>
  ))}

</div>
          </main>
  );
}