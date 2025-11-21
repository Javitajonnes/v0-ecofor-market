import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { getUserById, formatUserForFrontend } from '@/lib/db/users'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ecofor-market-secret-key-change-in-production'
)

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Verify JWT
    const { payload } = await jwtVerify(token.value, JWT_SECRET)

    // Get fresh user data from database
    const userFromDB = await getUserById(payload.userId as string)

    if (!userFromDB) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Format user for frontend
    const user = formatUserForFrontend(userFromDB)

    return NextResponse.json({
      user
    })
  } catch (error) {
    console.error('[Auth] Verification error:', error)
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    )
  }
}
