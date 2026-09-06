export interface AIAnalysis {
  price_estimate: number;
  condition: string;
  investment_score: number;
  market_trend: string;
  risk_factors: string[];
  investment_reasoning: string;
}

export async function analyzeProperty(property: {
  title: string;
  description: string;
  category: string;
  sqm: number;
  location: string;
  price?: number;
}): Promise<AIAnalysis> {
  try {
    const response = await fetch('/api/gemini/analyze-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Client side analyzeProperty failed, falling back to simulation data:", error);
    return {
      price_estimate: property.price ? Math.round(property.price * 1.05) : 320000,
      condition: "Excellent",
      investment_score: 8.5,
      market_trend: "Tendance haussière soutenue (+6% par an).",
      risk_factors: [
        "Fluctuations des taux de change locaux.",
        "Délais d'approvisionnement des matériaux hauts de gamme.",
        "Raccordement définitif aux réseaux d'eau/électricité."
      ],
      investment_reasoning: "Localisation stratégique à fort potentiel de valorisation à moyen terme. Demande locative haut de gamme dynamique."
    };
  }
}

export async function getLocationAdvice(city: string, lang: string = 'fr'): Promise<string> {
  try {
    const response = await fetch('/api/gemini/location-advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, lang })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.text || "No insights found.";
  } catch (error) {
    console.error("Client side getLocationAdvice failed:", error);
    return lang === 'fr' 
      ? `Analyse de ${city} (Mode Simulation) : Quartier résidentiel d'élite bénéficiant d'une croissance urbaine résiliente.`
      : `Analysis for ${city} (Simulation Mode): Premium urban location experiencing high population demand.`;
  }
}

export async function askAi(query: string, lang: string = 'fr'): Promise<string> {
  try {
    const response = await fetch('/api/gemini/ask-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, lang })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.text || "No reply.";
  } catch (error) {
    console.error("Client side askAi failed:", error);
    return lang === 'fr'
      ? "Désolé, je ne peux pas me connecter à l'intelligence de calcul pour le moment. Vérifiez votre clé API Gemini dans Settings > Secrets."
      : "Sorry, I cannot connect to the strategic engine. Please check your Gemini API key in Settings > Secrets.";
  }
}

// Client side chat assistant helper
export async function chatWithAiAgent(messages: any[], properties: any[], lang: string = 'fr'): Promise<string> {
  try {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, properties, lang })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("Client side chatWithAiAgent failed:", error);
    return lang === 'fr'
      ? "Désolé, l'agent intelligent a des difficultés à se connecter au serveur."
      : "Sorry, the intelligent agent is having difficulties connecting to the server.";
  }
}
