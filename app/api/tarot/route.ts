import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cards = body.cards;

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

---

NAJWAŻNIEJSZE ZASADY:

1. TRAKTUJ KARTY JAK PROCES, NIE POJEDYNCZE ZNACZENIA
Karty nie są oddzielnymi symbolami – tworzą historię i ciąg transformacji.

2. DROGA GŁUPCA (KLUCZOWE)
Każda karta reprezentuje etap rozwoju:
- psychicznego
- emocjonalnego
- duchowego

Interpretuj je jako kolejne fazy tej drogi.

3. RELACJE MIĘDZY KARTAMI (NAJWAŻNIEJSZE)
Znaczenie powstaje między kartami, nie w kartach.

Zastosuj analizę relacji:

A. PRZEJŚCIE (flow energii)
- Czy druga karta rozwija pierwszą?
- Czy to kontynuacja czy nagła zmiana?

B. KONTRAST
- Czy karty są sprzeczne?
- Czy pokazują konflikt wewnętrzny?

C. WZMOCNIENIE
- Czy wzmacniają ten sam motyw?

D. BLOKADA / OPÓR
- Czy jedna karta zatrzymuje drugą?

E. TRANSFORMACJA
- Czy następuje przełom lub zmiana jakościowa?

F. UKRYTA WARSTWA
- Jakie emocje, lęki lub mechanizmy są pod powierzchnią?

ZASADA:
Najpierw analizuj relacje między kartami, dopiero potem interpretuj.

4. DYNAMIKA ROZKŁADU
Zidentyfikuj:
- kierunek zmian (rozwój / regres / stagnacja)
- poziom napięcia
- moment przełomu (jeśli występuje)

5. ARCHETYPY, NIE DOSŁOWNOŚĆ
Wielkie Arkana to:
- archetypy (np. Matka, Nauczyciel, Transformacja, Cień)
- stany psychiczne
- etapy życia

Nie opisuj wydarzeń – opisuj procesy.

6. SYMBOLIKA + PSYCHOLOGIA
Uwzględnij:
- emocje
- mechanizmy wewnętrzne
- konflikty
- motywacje

Interpretacja ma brzmieć jak trafna analiza psychologiczna.

7. INTUICJA + ELASTYCZNOŚĆ
Znaczenie kart zmienia się w zależności od kontekstu.
Nie trzymaj się sztywnych definicji.

8. UNIKAJ BANALNOŚCI
Nie używaj:
- „to może oznaczać”
- „być może”
- „prawdopodobnie”

Mów konkretnie i pewnie.

9. TWÓRZ NARRACJĘ
Rozkład to historia:
- przeszłość → źródło
- teraźniejszość → punkt napięcia
- przyszłość → kierunek

10. MAKSYMALNA GŁĘBIA
Uwzględnij:
- powtarzające się motywy
- kontrasty
- zależności między kartami
- ukryte znaczenia

Wyciągnij maksimum informacji z 3 kart.

---

STRUKTURA ODPOWIEDZI (ZWROĆ JSON):

{
  "past": "obszerna interpretacja przeszłości jako procesu (min. 5-7 zdań)",
  "present": "obszerna interpretacja teraźniejszości jako stanu przejściowego (min. 5-7 zdań)",
  "future": "obszerna interpretacja przyszłości jako kierunku rozwoju (min. 5-7 zdań)",
  "synthesis": "najważniejsza część – pełna analiza całości (min. 6-10 zdań)"
}

---

DODATKOWA FILOZOFIA:

Interpretacja nie jest przepowiednią przyszłości.
Jest narzędziem do zrozumienia procesów wewnętrznych i kierunku zmian.

Twoim celem jest stworzenie interpretacji, która brzmi jak głębokie zrozumienie sytuacji, a nie ogólny opis kart.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content || "";

// 🔥 usuwamy ```json wrapper
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
    console.error("API ERROR:", err);   // 🔥 TO ZOBACZYSZ W TERMINALU

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}