'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { Cardstore } from '@/lib/request'
import { useAppContext } from '@/context/AppContext'
import { Input } from '@/components/ui/input'
import { badgeOptions, categoryOptions, levelOptions, platformOptions , libraries } from '@/data/data'

export default function AdminPage() {

  const {cards,clearCards,addCards,updateCard,removeCard}=useAppContext();
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number>(0)
  const [showForm, setShowForm] = useState(false)
const [imageFile, setImageFile] = useState<File | null>(null)
const [loadingAdmin, setLoadingAdmin] = useState(false)

const fetchLibraries = async () => {
  setLoadingAdmin(true);
  try {
    // const response = await fetch('/api',{ method: 'GET' });
  // if (!response.ok) throw new Error("Failed to fetch transactions");
  //   const result = await response.json()
  //   console.log('Fetched libraries:', result.cards)
  //     addCards(result.cards)
  } catch (error) {
    console.error('Error fetching libraries:', error)
  } finally {
    setLoadingAdmin(false);
  }
}
useEffect(() => {
  if (cards.length === 0) {
    fetchLibraries();
  }
}, []);
  const [formData, setFormData] = useState({
        name: '',
        description_ar: '',
        description_en: '',
        platforms: [] as string[],
        category: 'ui',
        tags: '',
        level: 'beginner',
        badges: [] as string[],
        npm: '',
        stars: 0,
        useCase_ar: '',
        useCase_en: '',
        imageUrl: ''
      })
   const resetForm = () => {
    setFormData({
      name: '',
      description_ar: '',
      description_en: '',
      platforms: [],
      category: 'ui',
      tags: '',
      level: 'beginner',
      badges: [],
      npm: '',
      stars: 0,
      useCase_ar: '',
      useCase_en: '',
      imageUrl: ''
    })
  setEditingId(0)
   setShowForm(false)
  }

//  const pathJoin = (args: string[]): string => {
//   return args.join('/').replace(/^.*[\\/]/, '/'); // إزالة المسارات المزدوجة
// };

 const handleSubmit = async (e:any) => {
    e.preventDefault()
    // console.log('Submitting form data:', formData)
    const dataToSend = {
      ...formData,
      imageUrl: await uploadImage(),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      stars: formData.stars || 0
    }

    try {
      console.log('Data to send:', dataToSend)
      const url = editingId ? '/api/admin' : '/api/admin'
      const method = editingId ? 'PUT' :'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...dataToSend, id:editingId } : dataToSend)
      })

      const result = await response.json()
      console.log('Save response:', result)
      if(editingId){
        updateCard(result.card)
        setEditingId(0)
      }else{
        addCards(result.cards)
      }
      if (response.status == 201 ) {
        resetForm()
        
      } else {
        alert('Error: ' + response.statusText)
      }
    } catch (error) {
      console.error('Error saving library:', error)
      alert('Error saving library')
    }
  }

const uploadImage = async (): Promise<string> => {
  if (!imageFile) return formData.imageUrl

  const body = new FormData()
  body.append("image", imageFile)

  const res = await fetch("/api/upload", {
    method: "POST",
    body
  })

  const data = await res.json()
  return data.url // ← URL الصورة
}

const togglePlatform = (platform :any) => {
    setFormData(prev => ({
    ...prev,
    platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
}

const toggleBadge = (badge :any) => {
    setFormData(prev => ({
    ...prev,
    badges: prev.badges.includes(badge)
        ? prev.badges.filter(b => b !== badge)
        : [...prev.badges, badge]
    }))
}


  const handleEdit = (library :Cardstore) => {
    setEditingId(library.id)
    setFormData({
      name: library.name,
      description_ar: library.description_ar,
      description_en: library.description_en,
      platforms: library.platforms,
      category: library.category,
      tags: library.tags.join(', '),
      level: library.level,
      badges: library.badges,
      npm: library.npm,
      stars: library.stars,
      useCase_ar: library.useCase_ar,
      useCase_en: library.useCase_en,
      imageUrl: library.imageUrl
    })
    setShowForm(true)
    
  }





  const handleDelete = async (id :number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المكتبة؟ / Are you sure you want to delete this library?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin?id=${id}`, {
        method: 'DELETE'
      })

      console.log('Delete response status:', response)
      if (response.status == 200 ) {
        removeCard(id)
      } else {
        alert('Error: ' + response.statusText);
        
      }
    } catch (error) {
      console.error('Error deleting library:', error)
      alert('Error deleting library')
    }
  }


  const BacktoHome = () => {
    clearCards();                       // مسح الكروت من السياق
    router.push("/");           // التوجيه إلى صفحة تسجيل الدخول
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-darker)' }}>
        <p style={{ color: 'var(--text-primary)' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-darker)' }}> 
          {loadingAdmin && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          )}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={BacktoHome}
              variant="outline"
              className="gap-2"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card)',color:'var(--text-primary)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-black text-gradient">
              Admin Panel / لوحة التحكم
            </h1>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2 gradient-1"
          >
            <Plus className="w-5 h-5" />
            Add Library / أضف مكتبة
          </Button>
        </div>

        {/* Form Modal */}
        <>
 
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <Card className="w-full max-w-5xl my-8 mx-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', maxHeight: '90vh', overflowY: 'auto' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle style={{ color: 'var(--text-primary)' }}>
                    {editingId ? 'Edit Library / تعديل المكتبة' : 'Add New Library / إضافة مكتبة جديدة'}
                  </CardTitle>
                  <Button
                    onClick={resetForm}
                    variant="ghost"
                    style={{ borderColor: 'var(--border)' }}
                    className=" hover:bg-transparent "
                  >
                    <X className="w-20 h-20" style={{ color: 'var(--text-secondary)', borderRadius: '50%', backgroundColor: 'var(--bg-dark)' }} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}  className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Library Name / اسم المكتبة *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., react-native-paper"
                        style={{ background: 'var(--bg-dark)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        NPM Package Name *
                      </label>
                      <Input
                        required
                        value={formData.npm}
                        onChange={(e) => setFormData({ ...formData, npm: e.target.value })}
                        placeholder="e.g., react-native-paper"
                        style={{ background: 'var(--bg-dark)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Description (Arabic) / الوصف *
                      </label>
                      <Input
                        required
                        value={formData.description_ar}
                        onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                        style={{ background: 'var(--bg-dark)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Description (English) *
                      </label>
                      <Input
                        required
                        value={formData.description_en}
                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                        style={{ background: 'var(--bg-dark)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>

                  {/* Use Cases */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Use Case (Arabic) / متى تستخدم *
                      </label>
                      <Input
                        required
                        value={formData.useCase_ar}
                        onChange={(e) => setFormData({ ...formData, useCase_ar: e.target.value })}
                        style={{ background: 'var(--bg-dark)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Use Case (English) *
                      </label>
                      <Input
                        required
                        value={formData.useCase_en}
                        onChange={(e) => setFormData({ ...formData, useCase_en: e.target.value })}
                        style={{ background: 'var(--bg-dark)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />

                    </div>
                        <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          File (Image) *
                        </label>
                        <Input
                          type="file"
                          accept="image/*"
                          className='file:text-white '
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) setImageFile(file)
                          }}
                          style={{
                            background: 'var(--bg-dark)', borderColor: 'var(--border)', color: 'var(--text-primary)',
                          
                            
                          }}
                        />
                      </div>
                  </div>

                  {/* Platforms */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Platforms / المنصات *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {platformOptions.map(platform => (
                        <Button
                          key={platform.id}
                          type="button"
                          onClick={() => togglePlatform(platform.id)}
                          variant={formData.platforms.includes(platform.id) ? 'default' : 'outline'}
                          className="rounded-full"
                          style={formData.platforms.includes(platform.id) ? {
                            background: 'var(--gradient-1)'
                          } : {
                            borderColor: 'var(--border)',
                            background: 'var(--bg-dark)',
                            color: 'var(--text-primary)'

                          }}
                        >
                          {platform.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Category & Level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Category / التصنيف *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-md"
                        style={{ background: 'var(--bg-dark)', borderColor: 'var(--border)', color: 'var(--text-primary)', border: '1px solid' }}
                      >
                        {categoryOptions.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Level / المستوى *
                      </label>
                      <select
                        required
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-3 py-2 rounded-md"
                        style={{ background: 'var(--bg-dark)', borderColor: 'var(--border)', color: 'var(--text-primary)', border: '1px solid' }}
                      >
                        {levelOptions.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags & Stars */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Tags (comma separated) *
                      </label>
                      <Input
                        required
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="storage, offline, local"
                        style={{ background: 'var(--bg-dark)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        GitHub Stars (Number)*
                      </label>
                      <Input
                        required
                        type="number"
                        value={formData.stars}
                        onChange={(e) => setFormData({ ...formData,  stars: Number(e.target.value) })}
                        style={{ background: 'var(--bg-dark)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>

                  {/* Badges */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Badges / الشارات
                    </label>
                    <div className="flex flex-wrap gap-5 ">
                      {badgeOptions.map(badge => (
                        <Button
                          key={badge.id}
                          type="button"
                          onClick={() => toggleBadge(badge.id)}
                          variant={formData.badges.includes(badge.id) ? 'default' : 'outline'}
                          size="sm"
                          style={formData.badges.includes(badge.id) ? {
                            background: 'var(--primary)',
                          
                          } : {
                            borderColor: 'var(--border)',
                            background: 'var(--bg-dark)',
                            color: 'var(--text-primary)'
                          }}
                        >
                          { badge.icon} {badge.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      type="button"
                      onClick={resetForm}
                      variant="outline"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      Cancel / إلغاء
                    </Button>
                    <Button
                      type="submit"
                      className="gap-2 gradient-1"
                    >
                      <Save className="w-4 h-4" />
                      {editingId ? 'Update / تحديث' : 'Save / حفظ'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        </>
        {/* Libraries List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {libraries.map(lib => (
            <Card
              key={lib.id}
              className="overflow-hidden cursor-pointer "
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle style={{ color: 'var(--text-primary)' }}>{lib.name}</CardTitle>
                  <div className="flex gap-2 ">   
                  <img
                      alt=""  
                      src={lib.imageUrl || './no-image.png'}
                      className="inline-block size-12 rounded-full   ring-2 "/>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(lib as Cardstore)}
                      className="hover:bg-blue-500/20"
                    >
                      <Edit className="w-4 h-4" style={{ color: 'var(--cyan)' }} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(lib.id)}
                      className="hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" style={{ color: '#ef4444' }} />
                    </Button>   
  
                  </div>
                </div>
              </CardHeader>          
              <CardContent>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {lib.description_en}
                </p>
                <div className="flex flex-wrap gap-2 mb-2 pointer-events-none">
                  {lib.platforms.map(platform => (
                    <Badge key={platform} className="text-xs bg-purple-500">
                      {platform}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  ⭐ {lib.stars.toLocaleString()} stars
                </p>     

              </CardContent>

            </Card>
          ))}
        </div>

        {libraries.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl mb-4" style={{ color: 'var(--text-muted)' }}>
              No libraries yet / لا توجد مكتبات بعد
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="gap-2 gradient-1"
            >
              <Plus className="w-5 h-5" />
              Add First Library / أضف أول مكتبة
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}