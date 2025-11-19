'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { brands, categories } from '@/lib/mock-data'

interface FiltersSidebarProps {
  selectedCategories: string[]
  selectedBrands: string[]
  priceRange: [number, number]
  onCategoryChange: (category: string) => void
  onBrandChange: (brand: string) => void
  onPriceChange: (range: [number, number]) => void
  onReset: () => void
}

export function FiltersSidebar({
  selectedCategories,
  selectedBrands,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onReset,
}: FiltersSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Limpiar
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['price', 'category', 'brand']} className="w-full">
        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>Precio</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                value={priceRange}
                onValueChange={(value) => onPriceChange(value as [number, number])}
                min={0}
                max={20000}
                step={1000}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span>${priceRange[0].toLocaleString('es-CL')}</span>
                <span>${priceRange[1].toLocaleString('es-CL')}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Category Filter */}
        <AccordionItem value="category">
          <AccordionTrigger>Categoría</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categories.filter(c => c !== 'Todos').map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => onCategoryChange(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand Filter */}
        <AccordionItem value="brand">
          <AccordionTrigger>Marca</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {brands.filter(b => b !== 'Todas').map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => onBrandChange(brand)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
