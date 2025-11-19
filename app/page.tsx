'use client'

import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { FiltersSidebar } from '@/components/filters-sidebar'
import { products } from '@/lib/mock-data'
import { useStore } from '@/lib/store'
import { useState, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Toaster } from '@/components/ui/toaster'

export default function Home() {
  const { userRole } = useStore()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000])
  const [sortBy, setSortBy] = useState('relevant')

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const handleReset = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, 20000])
  }

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const price = userRole === 'wholesale' ? product.wholesalePrice : product.retailPrice
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category)
      
      const matchesBrand = selectedBrands.length === 0 || 
        selectedBrands.includes(product.brand)
      
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1]
      
      return matchesCategory && matchesBrand && matchesPrice
    })

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => {
          const priceA = userRole === 'wholesale' ? a.wholesalePrice : a.retailPrice
          const priceB = userRole === 'wholesale' ? b.wholesalePrice : b.retailPrice
          return priceA - priceB
        })
        break
      case 'price-desc':
        filtered.sort((a, b) => {
          const priceA = userRole === 'wholesale' ? a.wholesalePrice : a.retailPrice
          const priceB = userRole === 'wholesale' ? b.wholesalePrice : b.retailPrice
          return priceB - priceA
        })
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order (featured first)
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return filtered
  }, [products, selectedCategories, selectedBrands, priceRange, sortBy, userRole])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-20">
                <FiltersSidebar
                  selectedCategories={selectedCategories}
                  selectedBrands={selectedBrands}
                  priceRange={priceRange}
                  onCategoryChange={handleCategoryChange}
                  onBrandChange={handleBrandChange}
                  onPriceChange={setPriceRange}
                  onReset={handleReset}
                />
              </div>
            </aside>

            {/* Products Section */}
            <div className="flex-1">
              {/* Header with Sort and Mobile Filters */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Resultados para productos ecológicos
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    ({filteredProducts.length} productos)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile Filters Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filtros
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Filtros</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FiltersSidebar
                          selectedCategories={selectedCategories}
                          selectedBrands={selectedBrands}
                          priceRange={priceRange}
                          onCategoryChange={handleCategoryChange}
                          onBrandChange={handleBrandChange}
                          onPriceChange={setPriceRange}
                          onReset={handleReset}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort Dropdown */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevant">Más relevantes</SelectItem>
                      <SelectItem value="price-asc">Menor precio</SelectItem>
                      <SelectItem value="price-desc">Mayor precio</SelectItem>
                      <SelectItem value="name">Nombre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No se encontraron productos con los filtros seleccionados
                  </p>
                  <Button onClick={handleReset} variant="outline" className="mt-4">
                    Limpiar filtros
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      userRole={userRole}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </>
  )
}
