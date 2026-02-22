export interface Cardstore {
  id: number;
  name: string;
  description_ar: string;
  description_en: string;
  platforms: string[];
  category: string;
  tags: string[];
  level: "beginner" | "intermediate" | "advanced";
  badges: string[];
  npm: string;
  stars: number;
  useCase_ar: string;
  useCase_en: string;
  imageUrl: string;
}