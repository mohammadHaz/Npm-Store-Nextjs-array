import { Button } from '@/components/ui/button'
import { useState, useMemo, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  translations,
  platforms,
  categories,
  libraries
} from "@/data/data";
import { Badge } from '@/components/ui/badge'
import { useAppContext } from '@/context/AppContext';
import {  ExternalLink, Star } from 'lucide-react';
import { Cardstore } from '@/lib/request';
// type Props = {
//   cards: Cardstore[];
//   clear: () => void;
// };

export default function MainLayout(props: {search:string}) {
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  const {language,addCards,cards}=useAppContext();
  console.log('cards in main layout',cards);
  const t = translations[language]
     

 const filteredLibraries = useMemo(() => {
  return libraries.filter(lib => {
    const matchesSearch = 
      lib.name.toLowerCase().includes(props.search.toLowerCase()) ||
      lib.description_ar.toLowerCase().includes(props.search.toLowerCase()) ||
      lib.description_en.toLowerCase().includes(props.search.toLowerCase()) ||
      lib.tags.some(tag => tag.toLowerCase().includes(props.search.toLowerCase()))
    
      const matchesPlatform = selectedPlatform === 'all' || lib.platforms?.includes(selectedPlatform)
      const matchesCategory = selectedCategory === 'all' || lib.category === selectedCategory
      
      return matchesSearch && matchesPlatform && matchesCategory
  })
}, [props.search, libraries,selectedCategory,selectedPlatform]) 


  return (
    <>
    {/* Filters */}
<div className="sticky top-0 z-40 backdrop-blur-lg" style={{ background: 'rgba(2, 6, 23, 0.9)', borderBottom: '1px solid var(--border)' }}>
  <div className="container mx-auto px-4 py-6">
    {/* Platform Filter */}
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
        {t.platform}
      </h3>
      <div className="flex flex-wrap gap-2">
        {platforms.map(platform => (
          <Button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            variant={selectedPlatform === platform.id ? 'default' : 'outline'}
            className={`rounded-full transition-all hover:bg-none  ${selectedPlatform === platform.id ? platform.color: ''}
            ${selectedPlatform === platform.id ? `hover:${platform.color} ` : ''}`}
            style={selectedPlatform !== platform.id ? {
              background: 'transparent',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
              
              
            } : {}}
          >
            {platform.name}
          </Button>
        ))}
      </div>
    </div>

    {/* Category Filter */}
    <div>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
        {t.category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const Icon = cat.icon
          return (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              className="rounded-full gap-2 transition-all"
              style={selectedCategory === cat.id ? {
                background: 'var(--gradient-1)',
                borderColor: 'transparent'
              } : {
                background: 'transparent',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)'
              }}
            >
              <Icon className="w-4 h-4" />
              {language === 'ar' ? cat.name_ar : cat.name_en}
            </Button>
          )
        })}
      </div>
    </div>

  </div>
</div>


{/* Results */}
<div className="container mx-auto px-4 py-12">
  <div className="mb-8 text-center">
    <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
      {filteredLibraries.length} {t.results}
    </p>
  </div>

  {/* Library Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredLibraries.map((card,index) => (
      <Card 
        key={index}
        className="card-hover overflow-hidden cursor-pointer"
        style={{ 
          background: 'var(--bg-card)', 
          borderColor: 'var(--border)'
        }}
      >
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2 " style={{ color: 'var(--text-primary)' }}>
                {card.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm " style={{ color: 'var(--text-muted)' }}>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 " />
                {card.stars?.toLocaleString()} {t.stars}
              </div>
            </div>
         <img
          alt=""
          src={card.imageUrl || './no-image.png'}
          className=" size-12 rounded-full     ring-2 "/>
            <a 
              href={`https://www.npmjs.com/package/${card.npm}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110  p-3 transition-transform"
            >
              <ExternalLink className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </a>
          </div>
          
          <CardDescription className="text-base leading-relaxed " style={{ color: 'var(--text-secondary)' }}>
            {language === 'ar' ? card.description_ar : card.description_en}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Platforms */}
          <div className="flex flex-wrap gap-2 mb-4 pointer-events-none">
            {card.platforms?.map(platform => {
              const platformData = platforms.find(p => p.id === platform)
              return (
                <Badge 
                  key={platform}
                  className={`${platformData?.color} text-xs`}
                >
                  {platformData?.name.split(' / ')[0]}
                </Badge>
              )
            })}
          </div>

          {/* Use Case */}
          <div className="mb-4 p-3 rounded-lg " style={{ background: 'var(--bg-dark)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
              {t.useCase}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {language === 'ar' ? card.useCase_ar : card.useCase_en}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {card.badges?.map(badge => (
              <Badge 
                key={badge}
                // variant="outline"
                className="text-xs"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                {badge === 'production-ready' && '🔥'}
                {badge === 'lightweight' && '⚡'}
                {badge === 'beginner-friendly' && '🧠'}
                {badge === 'powerful' && '💪'}
                {badge === 'type-safe' && '🛡️'}
                {badge === 'essential' && '⭐'}
                {badge === 'widely-used' && '🌍'}
                {badge === 'fast' && '🚀'}
                {' '}
                {badge.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>

          {/* Level */}
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.level}:</span>
            <Badge 
              className="text-xs"
              style={{ 
                background: card.level === 'beginner' ? 'var(--green)' : 
                            card.level === 'intermediate' ? 'var(--accent)' : 
                            'var(--primary)',
                color: '#000'
              }}
            >
              {[card.level]}
            </Badge>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>

  {libraries.length === 0 && (
    <div className="text-center py-20">
      <p className="text-xl" style={{ color: 'var(--text-muted)' }}>
        {t.noResults}
      </p>
    </div>
  )}
</div>

</>
  );
}
