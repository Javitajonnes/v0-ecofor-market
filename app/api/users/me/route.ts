import { NextRequest, NextResponse } from 'next/server'
import { getUserById, updateUser, updateUserPassword } from '@/lib/db/users'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ecofor-market-secret-key-change-in-production'
)

async function verifyAuth(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string; email: string; role: string }
  } catch (error) {
    return null
  }
}

// GET /api/users/me - Obtener datos completos del usuario actual
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          error: 'No autenticado'
        },
        { status: 401 }
      )
    }

    // Obtener usuario completo incluyendo inactivos (para que pueda ver su propio perfil)
    const { getSql } = await import('@/lib/db')
    const sql = getSql()
    const result = await sql`SELECT * FROM users WHERE id = ${auth.userId}`
    const user = result[0]

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado'
        },
        { status: 404 }
      )
    }

    // No retornar password_hash
    const { password_hash, ...safeUser } = user

    return NextResponse.json({
      success: true,
      data: safeUser
    })
  } catch (error: any) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener perfil',
        message: error.message
      },
      { status: 500 }
    )
  }
}

// PUT /api/users/me - Actualizar perfil del usuario actual
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          error: 'No autenticado'
        },
        { status: 401 }
      )
    }

    // Obtener usuario actual
    const { getSql } = await import('@/lib/db')
    const sql = getSql()
    const currentResult = await sql`SELECT * FROM users WHERE id = ${auth.userId}`
    if (!currentResult[0]) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado'
        },
        { status: 404 }
      )
    }

    const currentUser = currentResult[0]
    const body = await request.json()

    // Si se está cambiando el email, verificar que no exista
    if (body.email && body.email !== currentUser.email) {
      const { getUserByEmail } = await import('@/lib/db/users')
      const emailExists = await getUserByEmail(body.email)
      if (emailExists && emailExists.id !== auth.userId) {
        return NextResponse.json(
          {
            success: false,
            error: 'El email ya está registrado. Por favor usa otro email.'
          },
          { status: 400 }
        )
      }
    }

    // Preparar datos para actualizar (solo campos permitidos para auto-edición)
    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.email !== undefined) updateData.email = body.email
    if (body.phone !== undefined) updateData.phone = body.phone || null
    if (body.address !== undefined) updateData.address = body.address || null
    if (body.city !== undefined) updateData.city = body.city || null
    if (body.region !== undefined) updateData.region = body.region || null
    if (body.company_name !== undefined) updateData.company_name = body.company_name || null

    // Los usuarios NO pueden cambiar su propio rol, tipo de usuario, RUT, o estado
    // Esos cambios solo los puede hacer un admin

    // Si se proporciona nueva contraseña, actualizarla
    if (body.password) {
      if (body.password.length < 6) {
        return NextResponse.json(
          {
            success: false,
            error: 'La contraseña debe tener al menos 6 caracteres'
          },
          { status: 400 }
        )
      }
      await updateUserPassword(auth.userId, body.password)
    }

    // Actualizar usuario
    const updatedUser = await updateUser(auth.userId, updateData)

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error al actualizar perfil'
        },
        { status: 500 }
      )
    }

    // No retornar password_hash
    const { password_hash, ...safeUser } = updatedUser

    return NextResponse.json({
      success: true,
      data: safeUser,
      message: 'Perfil actualizado exitosamente'
    })
  } catch (error: any) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar perfil',
        message: error.message
      },
      { status: 500 }
    )
  }
}

