'use client'

import { Search, ShoppingCart, User, Menu, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { UserRole } from '@/lib/types'
import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CartSheet } from './cart-sheet'

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  retail: 'Cliente Minorista',
  wholesale: 'Cliente Mayorista',
  guest: 'Invitado'
}

export function Header() {
  const { userRole, setUserRole, cartItemsCount } = useStore()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-none">EcoforMarket</span>
              <span className="text-xs opacity-90">Productos Sostenibles</span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Buscar productos ecológicos..."
                className="w-full pl-4 pr-10 bg-white text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                size="icon" 
                className="absolute right-0 top-0 h-full rounded-l-none bg-accent hover:bg-accent/90"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {/* Role Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tipo de Usuario</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setUserRole('guest')}>
                  <div className="flex flex-col">
                    <span>Invitado</span>
                    <span className="text-xs text-muted-foreground">Sin cuenta</span>
                  </div>
                  {userRole === 'guest' && <Badge className="ml-auto">Actual</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole('retail')}>
                  <div className="flex flex-col">
                    <span>Cliente Minorista</span>
                    <span className="text-xs text-muted-foreground">Precios regulares</span>
                  </div>
                  {userRole === 'retail' && <Badge className="ml-auto">Actual</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole('wholesale')}>
                  <div className="flex flex-col">
                    <span>Cliente Mayorista</span>
                    <span className="text-xs text-muted-foreground">Precios especiales</span>
                  </div>
                  {userRole === 'wholesale' && <Badge className="ml-auto">Actual</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole('admin')}>
                  <div className="flex flex-col">
                    <span>Administrador</span>
                    <span className="text-xs text-muted-foreground">Gestión completa</span>
                  </div>
                  {userRole === 'admin' && <Badge className="ml-auto">Actual</Badge>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <CartSheet>
              <Button variant="ghost" size="icon" className="relative hover:bg-primary-foreground/10">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                    {cartItemsCount()}
                  </Badge>
                )}
              </Button>
            </CartSheet>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary-foreground/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menú</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    className="w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="hidden md:flex h-10 items-center justify-between text-sm border-t border-primary-foreground/10">
          <div className="flex items-center gap-6">
            <span className="font-medium">Usuario: {roleLabels[userRole]}</span>
          </div>
          {userRole === 'wholesale' && (
            <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
              Descuentos mayoristas aplicados
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
