export interface OutputItem {
  id: string;
  name: string;
  class: string;
  quantity: number;
  stock: number;
  composition: string;
  date: string;
  dppId: string;
}

export interface InputItem {
  id: string;
  name: string;
  class: string;
  quantity: number;
  frequency: string;
  specs: string;
  date: string;
}

export interface MatchCandidate {
  id: string;
  name: string;
  score: number;
  distance: number;
  co2: number;
  savings: number;
  status: "pending" | "accepted" | "rejected";
  details: {
    material: number;
    quality: number;
    env: number;
    logistics: number;
    economic: number;
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface OSBVerification {
  id: string;
  name: string;
  sector: string;
  status: "pending" | "approved";
}
