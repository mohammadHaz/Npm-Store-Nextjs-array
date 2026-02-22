import { Button } from '@/components/ui/button'
import { Search, Globe,Lock} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'
import {translations} from "@/data/data";
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation'

export default function Navbar(props: {search:string,setSearch:(value:string)=>void,setGlobalLoading:(value:boolean)=>void}) {
const {language, toggleLanguage ,cards}=useAppContext();
const [searchQuery, setSearchQuery] = useState<string>('');

const router = useRouter()

const t = translations[language]


  return (
  <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-1 opacity-10"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex justify-between items-center mb-8">
             <Button 
              onClick={() =>{  router.push('/admin');}}
              variant="outline"
              className="gap-2"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card)',color:'var(--text-primary)' }}
            >
              <Lock className="w-4 h-4" />
              {t.admin}
            </Button>
            <Button 
            onClick={async () => {
             props.setGlobalLoading(true)
              await toggleLanguage()  // إذا async
              props.setGlobalLoading(false)}}
              variant="outline"
              className="gap-2"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card) ',color:'var(--text-primary)' }}
            >
              <Globe className="w-4 h-4" />
              {language === 'ar' ? 'English' : 'عربي'}
            </Button>
          </div>
          
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl mb-12" style={{ color: 'var(--text-secondary)' }}>
              {t.subtitle}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <Input
                type="text"
                placeholder={t.search}
                value={props.search}
                onChange={(e) => props.setSearch(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-xl shadow-glow"
                style={{ 
                  background: 'var(--bg-card)', 
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
        </div>
      </div>


  );
}  
    
    
    
    
    
    
  