import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import { getUserByEmail, createUser, formatUserForFrontend } from '@/lib/db/users'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ecofor-market-secret-key-change-in-production'
)

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      user_type = 'person',
      rut,
      phone,
      address,
      city,
      region,
      company_name
    } = await request.json()

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Nombre, email, contraseña y rol son requeridos' },
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
        { error: 'Tipo de cliente inválido. Debe ser "retail" o "wholesale"' },
        { status: 400 }
      )
    }

    // Validate RUT (required for Chilean users)
    if (!rut) {
      return NextResponse.json(
        { error: 'RUT es requerido' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      )
    }

    // Create user in PostgreSQL
    const userFromDB = await createUser({
      email,
      password,
      name,
      role: role as 'retail' | 'wholesale',
      user_type: user_type as 'person' | 'company',
      rut,
      phone,
      address,
      city,
      region,
      company_name: user_type === 'company' ? company_name : undefined,
    })

    // Format user for frontend
    const user = formatUserForFrontend(userFromDB)

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
      maxAge: 60 * 60 * 24 * 7
    })

    return NextResponse.json({
      user
    })
  } catch (error: any) {
    console.error('[Auth] Registration error:', error)
    
    // Handle unique constraint violations
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'El email o RUT ya está registrado' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
