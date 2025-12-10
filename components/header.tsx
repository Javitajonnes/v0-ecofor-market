'use client'

import { Search, ShoppingCart, User, Menu, Leaf, LogOut, LogIn } from 'lucide-react'
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
import { useRouter } from 'next/navigation'

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  retail: 'Cliente Minorista',
  wholesale: 'Cliente Mayorista',
  guest: 'Invitado'
}

export function Header() {
  const { userRole, setUserRole, cartItemsCount, user, isAuthenticated, logout } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      logout()
      router.push('/')
    } catch (error) {
      console.error('[v0] Logout error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-medium">{user?.name}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {user?.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                      Mi Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/orders')}>
                      Mis Pedidos
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem onClick={() => router.push('/admin')}>
                        Panel Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Usuario Invitado</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/login')}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/registro')}>
                      Crear Cuenta
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      Demo: Cambiar rol
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setUserRole('guest')}>
                      Invitado {userRole === 'guest' && '✓'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserRole('retail')}>
                      Minorista {userRole === 'retail' && '✓'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserRole('wholesale')}>
                      Mayorista {userRole === 'wholesale' && '✓'}
                    </DropdownMenuItem>
                  </>
                )}
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
            <span className="font-medium">
              {isAuthenticated ? `Hola, ${user?.name}` : `Usuario: ${roleLabels[userRole]}`}
            </span>
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
