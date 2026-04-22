import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const cards = body.cards;
    const type = body.type || "general";
    const question = body.question || "";

    if (type === "question" && (!question || question.length < 3)) {
      return NextResponse.json(
        { error: "Brak pytania" },
        { status: 400 }
      );
    }

    // 🔥 KONTEKST POD TYP
    let extraContext = "";

    if (type === "love") {
  extraContext = `
KONTEKST: ROZKŁAD MIŁOSNY

Skup się WYŁĄCZNIE na relacji między dwiema osobami.

Analizuj:
- uczucia (jawne i ukryte)
- intencje
- dynamikę relacji
- kto się wycofuje / kto się angażuje
- napięcie emocjonalne

Nie interpretuj ogólnie – wszystko ma dotyczyć tej relacji.

Pokaż coś, czego użytkownik nie mówi wprost, ale czuje.

---

DODATKOWE ZASADY (BARDZO WAŻNE):

1. Pisz tak, jakbyś mówił do jednej osoby – bez ogólników.

2. Nie używaj „duchowego żargonu” – mów normalnie, po ludzku.

3. W SYNTEZIE dodaj krótkie, emocjonalne podsumowanie relacji:
- jasno: co tu się naprawdę dzieje
- bez lania wody
- bez symboliki

4. OSTATNIE 2–3 ZDANIA SYNTEZY:
mają być bardzo ludzkie i bezpośrednie, np.:
- „on/ona nie jest tu w pełni”
- „ta relacja ma potencjał, ale tylko jeśli…”
- „to bardziej trzyma się siłą przyzwyczajenia niż uczuć”

5. To ma brzmieć jak szczera rozmowa, nie jak opis kart.
`;
}

if (type === "question") {
  extraContext = `
KONTEKST: KONKRETNE PYTANIE

Pytanie użytkownika:
"${question}"

---

NAJWAŻNIEJSZE:

To nie jest ogólny rozkład.
To jest odpowiedź na KONKRETNE pytanie.

Każde zdanie ma być podporządkowane temu pytaniu.

---

ZASADY:

1. ODPOWIADAJ NA PYTANIE, NIE OPISUJ KART
Nie pisz ogólnych znaczeń.
Nie analizuj „dla wszystkich”.

Każda część ma wnosić coś do odpowiedzi.

---

2. KONKRET ZAMIAST OGÓLNIKÓW
Zamiast:
- „to zależy”
- „może być różnie”

mów:
- co tu naprawdę się dzieje
- jaka jest dynamika sytuacji
- co z tego wynika

---

3. CZYTAJ MIĘDZY WIERSZAMI
Zastanów się:
- dlaczego ktoś zadaje to pytanie?
- czego się boi?
- czego nie mówi wprost?

Uwzględnij to w interpretacji.

---

4. SYNTEZA = ODPOWIEDŹ

Sekcja "synthesis" ma być:
👉 bezpośrednią odpowiedzią na pytanie

Nie podsumowaniem kart — tylko odpowiedzią.

---

5. ZAKOŃCZENIE (BARDZO WAŻNE)

Ostatnie 2–3 zdania:
- konkretna konkluzja
- jasno: tak / nie / jeśli / pod warunkiem
- bez symboliki
- bez ezoterycznego języka

Przykłady stylu:
- „to się nie wydarzy, jeśli nic nie zmienisz”
- „to ma sens, ale tylko jeśli druga strona też się zaangażuje”
- „to nie jest stabilne, nawet jeśli teraz tak wygląda”

---

6. JĘZYK

- pisz jak do jednej osoby
- naturalnie
- bez „energetycznego bełkotu”
- bez lania wody

---

To ma brzmieć jak trafna odpowiedź, nie interpretacja kart.
`;
}

    const prompt = `
Jesteś ekspertem od tarota pracującym na poziomie psychologicznym, archetypowym i symbolicznym.

Specjalizujesz się w Wielkich Arkanach, które przedstawiają drogę Głupca – proces rozwoju człowieka od nieświadomości do pełni.

Twoim zadaniem jest stworzenie głębokiej, spójnej i realistycznej interpretacji rozkładu 3 kart:
- przeszłość
- teraźniejszość
- przyszłość

Karty:
Przeszłość: ${cards[0]}
Teraźniejszość: ${cards[1]}
Przyszłość: ${cards[2]}

${extraContext}

---

NAJWAŻNIEJSZE ZASADY:

1. TRAKTUJ KARTY JAK PROCES, NIE POJEDYNCZE ZNACZENIA  
Karty tworzą historię i ciąg transformacji.

2. DROGA GŁUPCA  
Każda karta to etap rozwoju psychicznego, emocjonalnego i wewnętrznego.

3. RELACJE MIĘDZY KARTAMI (KLUCZOWE)  
Najpierw analizuj zależności między kartami:
- przejście
- kontrast
- wzmocnienie
- blokada
- transformacja

Znaczenie powstaje między kartami, nie w kartach.

4. DYNAMIKA ROZKŁADU  
Określ:
- kierunek zmian
- napięcie
- moment przełomu

5. PSYCHOLOGIA + SYMBOLIKA  
Uwzględnij:
- emocje
- mechanizmy wewnętrzne
- konflikty
- motywacje

6. ZERO OGÓLNIKÓW  
Nie używaj:
- „może”
- „prawdopodobnie”
- „być może”

Mów konkretnie i pewnie.

7. NARRACJA  
To ma być historia:
- przeszłość → źródło
- teraźniejszość → napięcie
- przyszłość → kierunek

---

ZWROT (JSON):

{
  "past": "minimum 120-180 słów, spójna i głęboka analiza procesu",
  "present": "minimum 120-180 słów, najbardziej intensywna część",
  "future": "minimum 120-180 słów, kierunek zmian i konsekwencje",
  "synthesis": "minimum 150-220 słów, pełna analiza całości i główne wnioski"
}

---

WAŻNE:

- Każda sekcja musi być ciągłym tekstem (nie punktami)
- Nie skracaj odpowiedzi
- Każde zdanie musi wnosić wartość
- Buduj narrację i napięcie

---

DODATKOWO:

Na początku interpretacji (pierwsze zdanie w "past") napisz jedno zdanie,
które brzmi jak trafne rozpoznanie sytuacji użytkownika.

---

Interpretacja nie jest przepowiednią.
Jest wglądem w proces i kierunek zmian.

Twoim celem jest stworzenie odpowiedzi, która brzmi jak coś bardzo trafnego i osobistego.
`;

const model =
  type === "question"
    ? "gpt-4.1"
    : "gpt-4.1-mini";

const response = await openai.chat.completions.create({
  model,
  messages: [{ role: "user", content: prompt }],
  response_format: { type: "json_object" },
});

    const text = response.choices[0].message.content || "";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("PARSE ERROR:", cleaned);

      parsed = {
        past: cleaned,
        present: "",
        future: "",
        synthesis: "",
      };
    }

    return NextResponse.json(parsed);

  } catch (err: any) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}