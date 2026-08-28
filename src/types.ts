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
  status: "pending" | "accepted" | "rejected" | "completed";
  date: string;
  confidence: number;
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

export interface AppNotification {
  id: string;
  type: "match_accepted" | "match_rejected" | "review_required" | "facility_verified";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "osb_manager";
  facility: string;
}

export interface ReviewQueueItem {
  id: string;
  matchName: string;
  confidence: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

export interface WeightsConfig {
  material: number;
  quality: number;
  environmental: number;
  logistics: number;
  economic: number;
}
