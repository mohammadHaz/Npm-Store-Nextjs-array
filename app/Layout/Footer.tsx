import { useState, useMemo } from 'react'


import { useAppContext } from '@/context/AppContext';

export default function Footer() {
  const {language}=useAppContext();
    
    return (

        <footer className="py-12 mt-20 pointer-events-none" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
            <div className="container mx-auto px-4 text-center">
            <p style={{ color: 'var(--text-muted)' }}>
                {language === 'ar' ? 'مكتبات NPM مختارة بعناية للمطورين' : 'Curated NPM libraries for developers'}
            </p>
            </div>
        </footer>

    );
}