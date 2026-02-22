"use client";

import { Cardstore } from "@/lib/request";
import React, { createContext, useState, useContext, useCallback } from "react";
type Props = {
  children: React.ReactNode;
};

/* ===================== Types ===================== */
type AppContextType = {
  language: "ar" | "en";
  // setLanguage: (language: "ar" | "en") => void;
    toggleLanguage: () => void; // بدل setLanguage مباشر
  cards: Cardstore[];
  addCards: (cards: Cardstore | Cardstore[]) => void;
  updateCard: ( updatedCard: Cardstore) => void;
  removeCard: (id: number) => void;
  clearCards: () => void;
};

/* ===================== Context ===================== */
const AppContext = createContext<AppContextType>({
  language: 'ar',
  toggleLanguage: () => {},
  cards: [],
  addCards: () => {},
  updateCard: () => {},
  removeCard: () => {},
  clearCards: () => {},
});

/* ===================== Provider ===================== */
export const AppProvider = ({ children }: Props) => {
  const [cards, setCards] = useState<Cardstore[]>([]);
  const [language, setLanguage] = useState<"ar" | "en">('ar')


   const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const newLang = prev === "ar" ? "en" : "ar";
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
      return newLang;
    });
  }, []);
  // إضافة كارد أو عدة كروت
  const addCards = (data: Cardstore | Cardstore[]) => {
    setCards((prev) => [
      ...prev,
      ...(Array.isArray(data) ? data : [data]),
    ]);
  };

  // تحديث كارد حسب id الرقمي
  const updateCard = ( updatedCard: Cardstore) => {
    setCards((prev) =>
      prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
    );
  }

    // حذف كارد حسب id الرقمي
    const removeCard = (id: number) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  // مسح الكل
  const clearCards = () => {
    setCards([]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        toggleLanguage,
        cards,
        addCards,
        updateCard,
        removeCard,
        clearCards,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/* ===================== Hook ===================== */
export const useAppContext = () => useContext(AppContext);
