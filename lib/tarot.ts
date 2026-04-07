export type TarotCard = {
  id: number
  name: string
  light: string
  shadow: string
  advice: string
}

export const cards: TarotCard[] = [
  {
    id: 0,
    name: "Głupiec",
    light: "Nowy początek i otwartość na doświadczenia.",
    shadow: "Naiwność lub brak planu.",
    advice: "Zaufaj sobie, ale nie działaj bezmyślnie."
  },
  {
    id: 15,
    name: "Diabeł",
    light: "Silne emocje i pragnienia.",
    shadow: "Uzależnienia lub ograniczenia.",
    advice: "Zobacz, co Cię blokuje."
  },
  {
    id: 4,
    name: "Cesarz",
    light: "Stabilność i kontrola.",
    shadow: "Sztywność lub nadmierna kontrola.",
    advice: "Buduj strukturę, ale nie tłum emocji."
  }
]

type Position = "past" | "present" | "future"

function interpretCard(card: TarotCard, position: Position): string {
  const intro = {
    past: "To, co było, nadal wpływa na Twoją drogę.",
    present: "Obecna sytuacja jest kluczowa.",
    future: "To, co nadchodzi, dopiero się kształtuje."
  }

  return `
${intro[position]}

🔮 ${card.name}
${card.light}

🧠 Co to może oznaczać:
${card.shadow}

💡 Wskazówka:
${card.advice}
`
}

function synthesize(cards: TarotCard[]): string {
  const [past, present, future] = cards

  return `
✨ Twoja historia układa się w ciąg zdarzeń.

${past.name} → ${present.name} → ${future.name}

To, co zaczęło się wcześniej, prowadzi do obecnej sytuacji i wpływa na przyszłość.

💡 Masz wpływ na to, jak to się zakończy.
`
}

export function generateReading(drawn: TarotCard[]) {
  return {
    past: interpretCard(drawn[0], "past"),
    present: interpretCard(drawn[1], "present"),
    future: interpretCard(drawn[2], "future"),
    synthesis: synthesize(drawn)
  }
}