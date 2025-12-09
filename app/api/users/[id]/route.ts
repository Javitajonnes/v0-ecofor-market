import { NextRequest, NextResponse } from 'next/server'
import { getUserById, updateUser, deleteUser, updateUserPassword, getUserByEmail } from '@/lib/db/users'
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

// GET /api/users/[id] - Obtener usuario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación y rol admin
    const auth = await verifyAuth(request)
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'No autorizado. Se requiere rol de administrador.'
        },
        { status: 401 }
      )
    }

    // Obtener usuario incluyendo inactivos
    const { getSql } = await import('@/lib/db')
    const sql = getSql()
    const result = await sql`SELECT * FROM users WHERE id = ${params.id}`
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
    console.error('Error fetching user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener usuario',
        message: error.message
      },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación y rol admin
    const auth = await verifyAuth(request)
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'No autorizado. Se requiere rol de administrador.'
        },
        { status: 401 }
      )
    }

    // Verificar que el usuario existe y obtener datos actuales
    const { getSql } = await import('@/lib/db')
    const sql = getSql()
    const existingResult = await sql`SELECT * FROM users WHERE id = ${params.id}`
    if (!existingResult[0]) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado'
        },
        { status: 404 }
      )
    }

    const currentUser = existingResult[0]
    const body = await request.json()

    // Si se está cambiando el email, verificar que no exista
    if (body.email && body.email !== currentUser.email) {
      const emailExists = await getUserByEmail(body.email)
      if (emailExists && emailExists.id !== params.id) {
        return NextResponse.json(
          {
            success: false,
            error: 'El email ya está registrado. Por favor usa otro email.'
          },
          { status: 400 }
        )
      }
    }

    // Preparar datos para actualizar
    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.email !== undefined) updateData.email = body.email
    if (body.role !== undefined) {
      if (!['admin', 'retail', 'wholesale'].includes(body.role)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Rol inválido. Debe ser: admin, retail o wholesale'
          },
          { status: 400 }
        )
      }
      updateData.role = body.role
    }
    if (body.user_type !== undefined) {
      if (!['person', 'company'].includes(body.user_type)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Tipo de usuario inválido. Debe ser: person o company'
          },
          { status: 400 }
        )
      }
      updateData.user_type = body.user_type
    }
    if (body.rut !== undefined) updateData.rut = body.rut
    if (body.phone !== undefined) updateData.phone = body.phone || null
    if (body.address !== undefined) updateData.address = body.address || null
    if (body.city !== undefined) updateData.city = body.city || null
    if (body.region !== undefined) updateData.region = body.region || null
    if (body.company_name !== undefined) updateData.company_name = body.company_name || null
    if (body.is_active !== undefined) updateData.is_active = body.is_active
    if (body.email_verified !== undefined) updateData.email_verified = body.email_verified

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
      await updateUserPassword(params.id, body.password)
    }

    // Actualizar usuario
    const updatedUser = await updateUser(params.id, updateData)

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error al actualizar usuario'
        },
        { status: 500 }
      )
    }

    // No retornar password_hash
    const { password_hash, ...safeUser } = updatedUser

    return NextResponse.json({
      success: true,
      data: safeUser,
      message: 'Usuario actualizado exitosamente'
    })
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar usuario',
        message: error.message
      },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Eliminar usuario (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación y rol admin
    const auth = await verifyAuth(request)
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'No autorizado. Se requiere rol de administrador.'
        },
        { status: 401 }
      )
    }

    // Verificar que el usuario existe
    const { getSql } = await import('@/lib/db')
    const sql = getSql()
    const existingResult = await sql`SELECT * FROM users WHERE id = ${params.id}`
    if (!existingResult[0]) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado'
        },
        { status: 404 }
      )
    }

    // No permitir auto-eliminación
    if (params.id === auth.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'No puedes eliminar tu propio usuario'
        },
        { status: 400 }
      )
    }

    // Eliminar usuario (soft delete)
    const deleted = await deleteUser(params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error al eliminar usuario'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar usuario',
        message: error.message
      },
      { status: 500 }
    )
  }
}

