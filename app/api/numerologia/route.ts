import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function reduceNumber(num: number): number {
  while (![11, 22, 33].includes(num) && num > 9) {
    num = num
      .toString()
      .split("")
      .reduce((a, b) => a + Number(b), 0);
  }
  return num;
}

function calculateLifePath(date: string) {
  if (!date) throw new Error("Brak daty");

  const parts = date.split(".");

  if (parts.length !== 3) {
    throw new Error(`Zły format daty: ${date}`);
  }

  const [day, month, year] = parts.map(Number);

  if (!day || !month || !year) {
    throw new Error(`Nieprawidłowe wartości daty: ${date}`);
  }

  const d = reduceNumber(day);
  const m = reduceNumber(month);
  const y = reduceNumber(
    year
      .toString()
      .split("")
      .reduce((a, b) => a + Number(b), 0)
  );

  const methodA = reduceNumber(d + m + y);

  const sumAll = (day.toString() + month.toString() + year.toString())
    .split("")
    .reduce((a, b) => a + Number(b), 0);

  const methodB = reduceNumber(sumAll);

  return {
    main: methodA,
    master: [11, 22, 33].includes(methodB) ? methodB : null,
  };
}

export async function POST(req: Request) {
  try {
    const { dateA, dateB } = await req.json();

    const numerologyA = calculateLifePath(dateA);
    const numerologyB = calculateLifePath(dateB);

    const prompt = `

Jesteś ekspertem w zakresie numerologii psychologicznej i partnerskiej.

Twoim zadaniem jest stworzenie pogłębionej, logicznej i spójnej analizy relacji dwóch osób na podstawie ich dat urodzenia.

Analiza NIE może być ogólna ani uniwersalna — musi wynikać bezpośrednio z konkretnych wartości liczbowych.

---

DANE NUMEROLOGICZNE (OBLICZONE – NIE PRZELICZAJ):

Osoba A:
- Data urodzenia: ${dateA}
- Droga życia: ${numerologyA.main}
- Potencjał mistrzowski: ${numerologyA.master ?? "brak"}

Osoba B:
- Data urodzenia: ${dateB}
- Droga życia: ${numerologyB.main}
- Potencjał mistrzowski: ${numerologyB.master ?? "brak"}

---

KROK 2: ANALIZA INDYWIDUALNA

Dla każdej osoby opisz:

- liczbę Drogi Życia (np. 1, 2, 3, ..., 9) i jej znaczenie
- potencjał mistrzowski (jeśli jest) i jego wpływ
- dominującą energię
- sposób podejmowania decyzji
- podejście do relacji
- cień tej liczby

Opis ma być konkretny i psychologiczny.

---

KROK 3: DYNAMIKA RELACJI

Przeanalizuj:

- dopasowanie Life Path vs Life Path
- różnice w emocjach, kontroli i komunikacji
- źródła napięć (konkretne)
- źródła przyciągania

---

KROK 4: CHEMIA RELACJI

Określ typ relacji:

- stabilizująca
- karmiczna
- dynamiczna
- transformująca

Wskaż:
- kto prowadzi
- kto stabilizuje
- kto destabilizuje

---

KROK 5: WZORZEC RELACJI

Opisz mechanizm relacji jako system:

(np. „jedna osoba potrzebuje kontroli, druga wolności → cykl napięcia i oddalenia”)

To musi dawać efekt „to dokładnie my”.

---

KROK 6: POTENCJAŁ DŁUGOTERMINOWY

Odpowiedz:

- czy relacja ma potencjał
- co ją wzmacnia
- co ją niszczy

---

KROK 8: ETYKIETA RELACJI (KRÓTKA)

Nadaj relacji jedną krótką etykietę (max 5 słów), np.:

- „Silne przyciąganie i napięcie”
- „Naturalna zgodność emocjonalna”
- „Relacja wymagająca dojrzałości”
- „Chaos i intensywność”
- „Stabilność z różnicami”

Ma być chwytliwe i trafne.

---

KROK 9: SYNTEZA

Krótka, mocna konkluzja:

- czym jest ta relacja
- dlaczego działa / nie działa
- jaki ma kierunek

---

STYL:

- konkretny, psychologiczny
- wypowiedź ma być w pełni w języku polskim
- Zaczynamy każdą sekcję z wielkeij litery.
- bez ogólników
- bez „możliwe że”
- język naturalny i trafny
- dla każdej sekcji ma być co najmniej kilka lijnijek tekstu
- buduj rozbudowane zdania, a nie krótkie frazy
- ale rozwiń maksymalnie swoje myśli, niech to będzie coś, za co użytkownik chce zapłacić pieniądze, a nie po 4-5 zdań.

MAPOWANIE:

- personA → analiza osoby A (KROK 2)
- personB → analiza osoby B (KROK 2)
- compatibility → dopasowanie (KROK 3)
- tension → napięcia (KROK 3)
- attraction → przyciąganie (KROK 3)
- relationship_pattern → wzorzec relacji (KROK 5)
- long_term → potencjał długoterminowy (KROK 6)
- summary → synteza (KROK 9)

---
ZWRÓĆ WYŁĄCZNIE JSON (bez żadnego tekstu poza JSON).

Najpierw wypełnij strukturę JSON wszystkimi polami.
Każde pole musi zawierać konkretną analizę (minimum kilka zdań).
Nie zwracaj pustych pól.
FORMAT ODPOWIEDZI (JSON):

{
  "label": "krótka etykieta",
  "personA": "opis osoby A",
  "personB": "opis osoby B",
  "compatibility": "opis dopasowania",
  "tension": "źródła napięć",
  "attraction": "źródła przyciągania",
  "relationship_pattern": "mechanizm relacji",
  "long_term": "potencjał długoterminowy",
  "summary": "mocne podsumowanie"
}
`;

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: "Zwracaj wyłącznie poprawny JSON. Bez tekstu poza JSON."
    },
    {
      role: "user",
      content: prompt
    }
  ],
  temperature: 0.7,
  max_tokens: 2000,
});

let raw = response.choices?.[0]?.message?.content;

if (!raw) {
  console.error("❌ EMPTY AI RESPONSE");
  return NextResponse.json(
    { error: "Empty AI response" },
    { status: 500 }
  );
}

// 🔥 CLEAN JSON
raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

console.log("RAW CLEAN:", raw);

let parsed;

try {
  parsed = JSON.parse(raw);
    
      parsed = {
  label: parsed.label || "Brak danych",
  personA: parsed.personA || "Brak analizy",
  personB: parsed.personB || "Brak analizy",
  compatibility: parsed.compatibility || "Brak danych",
  tension: parsed.tension || "Brak danych",
  attraction: parsed.attraction || "Brak danych",
  relationship_pattern: parsed.relationship_pattern || "Brak danych",
  long_term: parsed.long_term || "Brak danych",
  summary: parsed.summary || "Brak podsumowania",
  };
    
    } catch (e) {
      console.error("❌ JSON PARSE ERROR:", raw);

      return NextResponse.json(
        { error: "AI nie zwróciło poprawnego JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("❌ API ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}