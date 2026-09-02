// Frontend view model'leri. Alanlar, gerçek backend'in döndürdüğü verinin
// (bkz. src/lib/api.ts satır tipleri) mevcut bileşenlerin render ettiği şekle
// çevrilmiş halidir; backend'in hiç döndürmediği alanlar (tip başına notlara
// bakınız) sahte veri yerine nullable/optional olarak tiplenmiştir.

export interface OutputItem {
  id: string;
  name: string;
  class: string;
  quantity: number;
  stock: number;
  composition: string;
  date: string;
  // GET /materials/outputs ilişkili MaterialPassport satırını içermez, bu yüzden bu
  // yalnızca mevcut oturumda oluşturulan çıktılar için bilinir (createOutput'un
  // yanıtından). list ile çekilen geçmiş kayıtlarda dppId/qrCode/pdfUrl === null olur.
  dppId: string | null;
  qrCode: string | null;
  pdfUrl: string | null;
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
  // GET /matches veya GET /matches/:id'de bulunmuyor (yalnızca aday üretim
  // endpoint'i GET /matches/find/:outputId, burada kullanılan "eşleşmelerim"
  // anlamında bir Match oluşmadan önce distanceKm döndürüyor) -- bilinmediğinde null.
  distanceKm: number | null;
  co2: number;
  savings: number; // CBAM karbon vergisi tasarrufu (EUR) -- matches.cbamImpact
  status: "pending" | "accepted" | "completed" | "rejected" | "expired";
  date: string;
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
  status: "pending" | "approved" | "rejected";
}

export interface AppNotification {
  // Backend bildirim "type" alanı, çağrı yerine göre serbest metin bir string
  // (örn. "review_required", "classification_approved", "classification_rejected",
  // "match_expired") -- mock arayüzün varsaydığı sabit 4 değerli union değil.
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  // Gerçek UserRole enum'u: USER | FACILITY_ADMIN | EXPERT | OSB_MANAGER | ADMIN
  role: string;
  // GET /admin/users yalnızca facilityId (bir uuid) döndürür, tesis adı değil --
  // çözümleyecek bir facility ilişkisi dahil edilmediğinden olduğu gibi gösterilir.
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
