import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ecofor-market-secret-key-change-in-production'
)

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    if (!['retail', 'wholesale'].includes(role)) {
      return NextResponse.json(
        { error: 'Tipo de cliente inválido' },
        { status: 400 }
      )
    }

    // In production, check if email exists in PostgreSQL and hash password with bcrypt
    // For now, simulate successful registration
    const newUser = {
      id: Math.random().toString(36).substring(7),
      name,
      email,
      role
    }

    // Create JWT token
    const token = await new SignJWT({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
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
      maxAge: 60 * 60 * 24 * 7
    })

    return NextResponse.json({
      user: newUser
    })
  } catch (error) {
    console.error('[v0] Registration error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
