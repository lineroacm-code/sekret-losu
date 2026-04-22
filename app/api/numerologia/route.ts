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
    const { type, dateA, dateB } = await req.json();

    // ✅ NAJPIERW TYPE
    if (type !== "compatibility" && type !== "individual") {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // ✅ POTEM DATY
    if (!dateA) {
      return NextResponse.json({ error: "Brak daty A" }, { status: 400 });
    }

    if (type === "compatibility" && !dateB) {
      return NextResponse.json({ error: "Brak daty B" }, { status: 400 });
    }

    const numerologyA = calculateLifePath(dateA);

    const numerologyB =
      type === "compatibility"
        ? calculateLifePath(dateB)
        : { main: 0, master: null };

    let prompt = "";

    if (type === "compatibility") {
      prompt = `

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
    }

    if (type === "individual") {
      prompt = `

Jesteś ekspertem w zakresie numerologii psychologicznej i analizy osobowości.

Twoim zadaniem jest stworzenie pogłębionej, logicznej i bardzo trafnej analizy jednej osoby na podstawie jej daty urodzenia.

Analiza NIE może być ogólna ani uniwersalna — musi wynikać bezpośrednio z konkretnych wartości liczbowych.

---

DANE NUMEROLOGICZNE (OBLICZONE – NIE PRZELICZAJ):

Osoba:
- Data urodzenia: ${dateA}
- Droga życia: ${numerologyA.main}
- Potencjał mistrzowski: ${numerologyA.master ?? "brak"}

---

KROK 1: TOŻSAMOŚĆ I RDZEŃ OSOBOWOŚCI

Opisz:

- kim jest ta osoba na głębokim poziomie
- jaka energia ją definiuje
- jak jest odbierana przez innych
- co ją wyróżnia

To ma dawać efekt „to dokładnie ja”.

---

KROK 2: PSYCHOLOGIA I SPOSÓB MYŚLENIA

Przeanalizuj:

- sposób podejmowania decyzji
- relację z emocjami
- sposób reagowania na stres
- czy działa impulsywnie czy strategicznie

---

KROK 3: RELACJE I WIĘZI

Opisz:

- jak funkcjonuje w relacjach
- czego potrzebuje od innych
- jak buduje więź
- co najczęściej psuje jej relacje

---

KROK 4: CIEŃ I SABOTAŻ

Przeanalizuj:

- słabe strony tej liczby
- schematy, które ją ograniczają
- momenty, w których sama sobie szkodzi
- destrukcyjne wzorce

To ma być trafne i konkretne.

---

KROK 5: POTENCJAŁ I KIERUNEK ŻYCIA

Odpowiedz:

- do czego ta osoba jest naturalnie predysponowana
- gdzie może osiągnąć najwięcej
- co powinna rozwijać
- co ignoruje, a jest kluczowe

---

KROK 6: WEWNĘTRZNY KONFLIKT

Opisz:

- sprzeczności w tej osobie
- napięcia wewnętrzne
- czego chce vs czego się boi

---

KROK 7: SYNTEZA

Krótka, mocna konkluzja:

- kim naprawdę jest ta osoba
- jaki jest jej główny wzorzec
- jaki ma kierunek

---

STYL:

- konkretny, psychologiczny
- wypowiedź ma być w pełni w języku polskim
- bez ogólników
- bez „możliwe że”
- język naturalny i trafny
- każda sekcja ma być rozwinięta (minimum kilka zdań)
- buduj rozbudowane zdania, a nie krótkie frazy
- tekst ma mieć wartość, za którą ktoś realnie płaci

---

ZWRÓĆ WYŁĄCZNIE JSON (bez żadnego tekstu poza JSON).

FORMAT:

{
  "identity": "tożsamość i rdzeń osobowości",
  "psychology": "sposób myślenia i emocje",
  "relationships": "relacje i więzi",
  "shadow": "cień i sabotaż",
  "potential": "potencjał i kierunek życia",
  "conflict": "wewnętrzne napięcia",
  "summary": "mocne podsumowanie"
}

`;
    }

    // ✅ KLUCZOWE — GLOBALNIE
    if (!prompt) {
      return NextResponse.json({ error: "Brak promptu" }, { status: 400 });
    }

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
      response_format: { type: "json_object" },
    });

    let raw = response.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(raw);

      if (type === "compatibility") {
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
      }

if (type === "individual") {
  parsed = {
    identity: parsed.identity || "Brak danych",
    psychology: parsed.psychology || "Brak danych",
    relationships: parsed.relationships || "Brak danych",
    shadow: parsed.shadow || "Brak danych",
    conflict: parsed.conflict || "Brak danych",
    potential: parsed.potential || "Brak danych",
    summary: parsed.summary || "Brak podsumowania",
  };
}

    } catch (e) {
      return NextResponse.json(
        { error: "AI nie zwróciło poprawnego JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);

  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}