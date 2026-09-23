export interface QAItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "services" | "prayer" | "giving" | "salvation";
  locale: "fr" | "en";
}
