"use client";

import { useEffect, useState } from "react";

export default function PolitykaPrywatnosci() {
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
      {/* NAVBAR */}
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

      {/* HERO */}
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
          Polityka prywatności
        </h1>
      </div>

      {/* CONTENT */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          padding: "80px 20px 100px",
          fontSize: 15,
          opacity: 0.9,
        }}
      >
        {[
          {
            title: "Administrator danych",
            content: (
              <>
                <p>
                  Administratorem danych osobowych jest:
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
            title: "Zakres przetwarzanych danych",
            content: (
              <>
                <p>
                  Serwis przetwarza dane podane dobrowolnie przez użytkownika,
                  w szczególności adres e-mail oraz treść wiadomości.
                </p>
                <p>
                  W przypadku korzystania z usług płatnych mogą być przetwarzane
                  dane niezbędne do realizacji płatności przez operatora płatności.
                </p>
              </>
            ),
          },
          {
            title: "Cel przetwarzania danych",
            content: (
              <>
                <p>
                  Dane przetwarzane są w celu:
                </p>
                <p>
                  – realizacji usług oferowanych w serwisie  
                  <br />
                  – obsługi płatności  
                  <br />
                  – kontaktu z użytkownikiem  
                  <br />
                  – poprawy działania serwisu
                </p>
              </>
            ),
          },
          {
            title: "Podstawa prawna",
            content: (
              <>
                <p>
                  Dane przetwarzane są zgodnie z RODO na podstawie:
                </p>
                <p>
                  – zgody użytkownika  
                  <br />
                  – niezbędności do wykonania usługi  
                  <br />
                  – uzasadnionego interesu administratora
                </p>
              </>
            ),
          },
          {
            title: "Udostępnianie danych",
            content: (
              <>
                <p>
                  Dane mogą być przekazywane podmiotom trzecim wyłącznie w zakresie
                  niezbędnym do realizacji usług.
                </p>
                <p>
                  Dotyczy to w szczególności operatorów płatności oraz dostawców
                  usług technologicznych.
                </p>
              </>
            ),
          },
          {
            title: "Automatyczne przetwarzanie i AI",
            content: (
              <>
                <p>
                  Serwis wykorzystuje systemy automatycznego przetwarzania danych,
                  w tym narzędzia oparte na sztucznej inteligencji, w celu generowania
                  treści i analiz.
                </p>
                <p>
                  Dane nie są wykorzystywane do podejmowania zautomatyzowanych decyzji
                  wywołujących skutki prawne wobec użytkownika.
                </p>
              </>
            ),
          },
          {
            title: "Okres przechowywania danych",
            content: (
              <>
                <p>
                  Dane przechowywane są przez okres niezbędny do realizacji usług
                  lub do momentu cofnięcia zgody przez użytkownika.
                </p>
              </>
            ),
          },
          {
            title: "Prawa użytkownika",
            content: (
              <>
                <p>
                  Użytkownik ma prawo do:
                </p>
                <p>
                  – dostępu do danych  
                  <br />
                  – ich poprawiania  
                  <br />
                  – usunięcia  
                  <br />
                  – ograniczenia przetwarzania  
                  <br />
                  – wniesienia sprzeciwu
                </p>
              </>
            ),
          },
          {
            title: "Pliki cookies",
            content: (
              <>
                <p>
                  Serwis może wykorzystywać pliki cookies w celu poprawy działania
                  oraz analizy ruchu.
                </p>
              </>
            ),
          },
          {
            title: "Postanowienia końcowe",
            content: (
              <>
                <p>
                  Polityka prywatności może ulec zmianie.
                </p>
                <p>
                  W sprawach nieuregulowanych obowiązują przepisy prawa polskiego.
                </p>
              </>
            ),
          },
        ].map((section, i) => (
          <div
            key={i}
            style={{
              marginBottom: 40,
            }}
          >
            <h3
              style={{
                color: "gold",
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