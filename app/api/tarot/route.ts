import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getStructure = (type: string) => {
  if (type === "thinking") {
    return `
ZWROT (JSON):

{
  "past": "co uruchomiło te myśli",
  "present": "jak wygląda jego/jej aktualny proces myślowy",
  "future": "czy te myśli będą wracać czy znikną",
  "synthesis": "czy jesteś w jego/jej głowie i jak bardzo"
}
`;
  }

  if (type === "feelings") {
    return `
ZWROT (JSON):

{
  "past": "skąd wzięły się te emocje",
  "present": "co naprawdę czuje teraz",
  "future": "czy uczucia rosną czy słabną",
  "synthesis": "co naprawdę do Ciebie czuje"
}
`;
  }

  if (type === "return") {
    return `
ZWROT (JSON):

{
  "past": "co doprowadziło do rozstania lub dystansu",
  "present": "dlaczego teraz nie wraca",
  "future": "czy proces prowadzi do powrotu",
  "synthesis": "jednoznaczna odpowiedź: wróci / nie wróci / tylko jeśli"
}
`;
  }

  if (type === "distance") {
    return `
ZWROT (JSON):

{
  "past": "co zaczęło się psuć",
  "present": "co dokładnie powoduje dystans teraz",
  "future": "czy to się pogłębi czy odwróci",
  "synthesis": "prawdziwy powód oddalenia"
}
`;
  }

  if (type === "action") {
    return `
ZWROT (JSON):

{
  "past": "co doprowadziło do tej sytuacji",
  "present": "co się stanie jeśli nic nie zrobisz",
  "future": "co się stanie jeśli zrobisz pierwszy krok",
  "synthesis": "czy powinieneś działać (tak / nie / warunek)"
}
`;
  }

  if (type === "week") {
    return `
ZWROT (JSON):

{
  "past": "co właśnie się kończy",
  "present": "co się zaczyna dziać teraz",
  "future": "co wydarzy się w najbliższych dniach",
  "synthesis": "najważniejsze wydarzenie lub zmiana"
}
`;
  }

  return `
ZWROT (JSON):

{
  "past": "",
  "present": "",
  "future": "",
  "synthesis": ""
}
`;
};

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

Skup się na sferze uczuciowej użytkownika, ale NIE zakładaj, że jest w konkretnej relacji.

Analizuj:
- aktualną energię miłosną wokół użytkownika
- uczucia (świadome i ukryte)
- możliwe intencje innych osób (jeśli się pojawiają)
- dynamikę: otwieranie się vs wycofanie
- napięcie emocjonalne
- potencjalne nowe znajomości lub powroty z przeszłości

Jeśli pojawia się druga osoba, opisuj ją ogólnie (np. „ktoś”, „pewna osoba”), bez zakładania konkretnej relacji.

---

DODATKOWE ZASADY (BARDZO WAŻNE):

1. Pisz tak, jakbyś mówił do jednej osoby – bez ogólników.

2. Nie używaj „duchowego żargonu” – mów normalnie, po ludzku.

3. Jeśli to pasuje, używaj warunków:
- „jeśli jesteś w relacji…”
- „jeśli jesteś singlem…”
ALE tylko naturalnie, nie na siłę.

4. Pokazuj rzeczy, których użytkownik nie mówi wprost, ale może czuć.

5. W SYNTEZIE dodaj krótkie, emocjonalne podsumowanie:
- jasno: co się naprawdę dzieje w jego sferze uczuciowej
- bez lania wody
- bez symboliki

6. OSTATNIE 2–3 ZDANIA SYNTEZY:
mają być bardzo ludzkie i bezpośrednie, np.:
- „coś tu się zaczyna zmieniać”
- „trzymasz się czegoś, co już nie daje tyle co kiedyś”
- „ktoś może się pojawić, ale wszystko zależy od Twojej decyzji”

7. To ma brzmieć jak szczera rozmowa, nie jak opis kart.
`;
    }

    if (type === "thinking") {
      extraContext = `
KONTEKST: CZY ON/ONA O MNIE MYŚLI

To jest analiza procesu myślowego drugiej osoby.

Nie analizujesz „relacji”.
Analizujesz stan mentalny.

---

CO MASZ OKREŚLIĆ:

- czy użytkownik pojawia się w jego/jej myślach
- jak często (epizodycznie vs stale)
- czy są to myśli neutralne, emocjonalne czy napięciowe
- czy ta osoba próbuje te myśli wypierać lub kontrolować
- czy coś je uruchamia (np. wspomnienia, brak kontaktu, tęsknota, poczucie winy)

---

NAJWAŻNIEJSZE:

To nie jest romantyczna interpretacja.

To jest:
👉 analiza tego, co dzieje się w jego/jej głowie

---

ZASADY:

1. Oddziel MYŚLI od EMOCJI  
   (może myśleć, ale nic nie czuć — i odwrotnie)

2. Szukaj mechanizmu:
   - powracające myśli
   - wypieranie
   - analizowanie
   - zamykanie tematu

3. Nie zakładaj relacji — opisuj proces

4. Zero ogólników — każda teza musi wynikać z dynamiki kart

---

SYNTEZA:

👉 jednoznaczna odpowiedź:
- jesteś w jego/jej głowie czy nie
- czy to rośnie czy wygasa

---

OSTATNIE ZDANIA:

bardzo konkretne, np:
- „to wraca, nawet jeśli próbuje to ignorować”
- „to już nie zajmuje jego/jej myśli tak jak wcześniej”
- „to nie znika, tylko jest tłumione”
`;
}

    if (type === "feelings") {
      extraContext = `
KONTEKST: CO ON/ONA CZUJE NAPRAWDĘ

To jest analiza emocjonalna, nie deklaratywna.

Nie interesuje Cię to, co ktoś pokazuje.
Interesuje Cię to, co faktycznie czuje.

---

CO MASZ OKREŚLIĆ:

- realne uczucia (nawet jeśli są sprzeczne)
- poziom zaangażowania emocjonalnego
- czy uczucia są stabilne czy zmienne
- czy są blokady (lęk, kontrola, dystans)
- czy emocje się rozwijają czy wygaszają

---

NAJWAŻNIEJSZE:

Nie romantyzuj.

To ma być:
👉 psychologicznie prawdziwe, nie „ładne”

---

ZASADY:

1. Pokazuj sprzeczności:
   - chce vs wycofuje się
   - czuje vs blokuje

2. Nazwij poziom emocji:
   - powierzchowne / głębokie / niejasne

3. Jeśli uczucia słabną — powiedz to wprost

4. Zero „może” — decyzja musi być jasna

---

SYNTEZA:

👉 co naprawdę czuje + w jakim to idzie kierunku

---

OSTATNIE ZDANIA:

bez symboliki, np:
- „to nie jest stabilne, nawet jeśli tak wygląda”
- „uczucia są, ale nie idzie za nimi działanie”
- „to się rozwija, ale powoli i z oporem”
`;
}

    if (type === "return") {
      extraContext = `
KONTEKST: CZY WRÓCI DO MNIE

To jest analiza kierunku i prawdopodobieństwa powrotu.

Nie opisujesz emocji — tylko:
👉 czy ten proces prowadzi do powrotu

---

CO MASZ OKREŚLIĆ:

- czy powrót jest realny
- czy jest blokowany (ego, lęk, zamknięcie)
- czy emocje nadal istnieją
- czy sytuacja się zamyka czy otwiera

---

NAJWAŻNIEJSZE:

To NIE jest pocieszenie.

To jest:
👉 realistyczna ocena kierunku

---

ZASADY:

1. Jeśli nie wróci — powiedz to jasno  
2. Jeśli wróci tylko warunkowo — nazwij warunek  
3. Nie dawaj fałszywej nadziei  
4. Analizuj proces między kartami (czy jest powrót czy odcięcie)

---

ABSOLUTNY PRIORYTET:

Masisz odpowiedzieć jednoznacznie:
👉 TAK / NIE / TYLKO JEŚLI

Unikaj analizy bez konkluzji.

---

OSTATNIE ZDANIA:

bardzo konkretne:
- „to się nie wydarzy bez zmiany”
- „to może wrócić, ale nie w tej formie”
- „ten etap się kończy, nie wraca”
`;
}

    if (type === "distance") {
      extraContext = `
KONTEKST: DLACZEGO SIĘ ODDALIŁ(A)

To jest analiza przyczyny oddalenia.

Nie interesuje Cię objaw.
Interesuje Cię mechanizm.

---

CO MASZ OKREŚLIĆ:

- co się zmieniło w tej osobie
- jaki mechanizm uruchomił dystans:
  - lęk
  - utrata emocji
  - przeciążenie
  - unikanie
- czy to było stopniowe czy nagłe

---

NAJWAŻNIEJSZE:

Masz znaleźć:
👉 prawdziwy powód, nie wygodny powód

---

ZASADY:

1. Nazwij mechanizm wprost  
2. Nie rozmywaj odpowiedzi  
3. Nie usprawiedliwiaj tej osoby  
4. Szukaj momentu przełomu w kartach  

---

SYNTEZA:

👉 prawdziwy powód oddalenia + czy to jest odwracalne

---

OSTATNIE ZDANIA:

jak szczera rozmowa:
- „to nie wydarzyło się nagle, tylko narastało”
- „to jest ucieczka, nie decyzja”
- „to zamknięcie, nie dystans chwilowy”
`;
}

    if (type === "week") {
      extraContext = `
KONTEKST: NAJBLIŻSZE 7 DNI

To jest krótkoterminowa dynamika wydarzeń.

Nie analizujesz głębokiego procesu życiowego.
Analizujesz:
👉 co się wydarzy teraz

---

CO MASZ OKREŚLIĆ:

- co się zmieni w najbliższym czasie
- czy coś ruszy / zatrzyma się / zakończy
- gdzie pojawi się napięcie lub decyzja

---

NAJWAŻNIEJSZE:

To ma być konkret, nie filozofia.

---

ZASADY:

1. Skup się na zdarzeniach i ruchu  
2. Zero ogólników  
3. Zero „może”  
4. Krótsze, bardziej dynamiczne zdania  

---

SYNTEZA:

👉 co realnie się wydarzy w najbliższym czasie

---

OSTATNIE ZDANIA:

krótkie, konkretne:
- „to się zacznie ruszać”
- „to się zatrzyma”
- „tu pojawi się decyzja”
`;
}

    if (type === "action") {
      extraContext = `
KONTEKST: CZY ZROBIĆ PIERWSZY KROK

To jest decyzja działania.

Nie analizujesz tylko sytuacji.
Masz pomóc podjąć decyzję.

---

CO MASZ OKREŚLIĆ:

- czy działanie ma sens
- jakie będą konsekwencje działania
- jakie będą konsekwencje braku działania
- czy druga strona jest gotowa

---

NAJWAŻNIEJSZE:

To ma prowadzić do:
👉 decyzji

---

ZASADY:

1. Porównuj: działanie vs brak działania  
2. Pokaż ryzyko i efekt  
3. Nie unikaj jednoznacznej konkluzji  
4. Zero „może”  

---

SYNTEZA:

👉 TAK / NIE / TYLKO JEŚLI

---

OSTATNIE ZDANIA:

bardzo konkretne:
- „to ma sens tylko jeśli…”
- „to nic nie zmieni”
- „to może otworzyć coś, ale nie od razu”
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
2. KONKRET ZAMIAST OGÓLNIKÓW
3. CZYTAJ MIĘDZY WIERSZAMI

---

SYNTEZA = ODPOWIEDŹ

👉 bezpośrednia odpowiedź

---

ZAKOŃCZENIE:

👉 jasno: tak / nie / warunek

Bez symboliki.
`;
    }

    const prompt = `
Jesteś ekspertem od tarota, ale mówisz normalnie, jak człowiek.

Nie używasz ezoterycznego języka.
Nie opisujesz znaczeń kart.
Nie tłumaczysz symboliki.

Twoim celem jest:
👉 trafna, konkretna odpowiedź dopasowana do sytuacji użytkownika.

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


RELACJE MIĘDZY KARTAMI (KLUCZ):

Nie analizuj kart osobno.

Najpierw określ:
- co wynika z połączenia kart
- jaka jest zmiana między nimi
- czy jest progres, blokada, cofnięcie czy transformacja

Znaczenie powstaje między kartami, nie w kartach.

NAJWAŻNIEJSZE ZASADY:

1. TRAKTUJ KARTY JAK PROCES, NIE POJEDYNCZE ZNACZENIA  
Karty tworzą historię i ciąg transformacji.

2. DROGA GŁUPCA  
Każda karta to etap rozwoju psychicznego, emocjonalnego i wewnętrznego.

3. RELACJE MIĘDZY KARTAMI (KLUCZOWE)  
Najpierw analizuj zależności między kartami.

4. ZERO OGÓLNIKÓW  
Mów konkretnie i pewnie.

5. ZERO "MOŻE", "BYĆ MOŻE"

6. KAŻDE ZDANIE MA WNOSIĆ WARTOŚĆ

---

${getStructure(type)}

DŁUGOŚĆ (OBOWIĄZKOWE):

- past: minimum 120–180 słów
- present: minimum 120–180 słów
- future: minimum 120–180 słów
- synthesis: minimum 150–220 słów

Nie skracaj odpowiedzi.
Każda sekcja musi być rozwinięta i konkretna.

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
      parsed = {
        past: cleaned,
        present: "",
        future: "",
        synthesis: "",
      };
    }

    return NextResponse.json(parsed);

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}