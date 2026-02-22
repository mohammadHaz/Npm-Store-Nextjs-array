"use client";
import { useState, useMemo, useEffect } from 'react'

import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import MainLayout from './Layout/MainLayout';
import { useAppContext } from './context/AppContext';
import Papa from "papaparse";
import { Cardstore } from './lib/request';

export default function Home() {
 const { cards, addCards} = useAppContext()
const [search,setsearch]=useState<string>('');
const [globalLoading, setGlobalLoading] = useState<boolean>(true)  
const [layoutLoading, setLayoutLoading] = useState<boolean>(true) 


  const fetchLibraries = async () => {
    try {
  //   const response = await fetch('./data/Cardstore.csv');
  //   const csvText = await response.text();

  //    const parsed = Papa.parse<Cardstore>(csvText, {
  //     header: true,        // أول سطر أسماء الأعمدة
  //     skipEmptyLines: true
  //   });
  //  console.log(parsed.data)
  //   addCards(parsed.data);
    } catch (error) {
      console.error('Error fetching libraries:', error)
    } finally {
      setGlobalLoading(false)
      setLayoutLoading(false)
    }
  }

useEffect(() => {
  if (cards.length === 0) {
    fetchLibraries();
  }else{
    setGlobalLoading(false)
  }
}, []);




  return (
      <div className="min-h-screen" style={{ background: 'var(--bg-darker)' }}>
      {globalLoading && (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )}
       <Navbar  search={search} setSearch={setsearch} setGlobalLoading={setGlobalLoading}/>

    {/* Loading خاص بالMainLayout */}
    {layoutLoading ? (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    ) : (
      <MainLayout search={search} />
    )}

       <Footer/>
    </div>
  );
}
