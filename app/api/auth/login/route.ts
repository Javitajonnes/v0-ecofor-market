import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

// Mock users database - In production, this would query PostgreSQL
const MOCK_USERS = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@ecofor.com',
    password: 'admin123', // In production, use bcrypt
    role: 'admin' as const
  },
  {
    id: '2',
    name: 'Cliente Minorista',
    email: 'retail@ecofor.com',
    password: 'retail123',
    role: 'retail' as const
  },
  {
    id: '3',
    name: 'Cliente Mayorista',
    email: 'wholesale@ecofor.com',
    password: 'wholesale123',
    role: 'wholesale' as const
  }
]

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ecofor-market-secret-key-change-in-production'
)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Find user - In production, query PostgreSQL with hashed password
    const user = MOCK_USERS.find(
      u => u.email === email && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Return user data (without password)
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
