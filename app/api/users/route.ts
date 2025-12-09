import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, createUser, getUserByEmail } from '@/lib/db/users'
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

// GET /api/users - Listar usuarios
export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const users = await getAllUsers(includeInactive)

    // No retornar password_hash por seguridad
    const safeUsers = users.map(({ password_hash, ...user }) => user)

    return NextResponse.json({
      success: true,
      data: safeUsers,
      count: safeUsers.length
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener usuarios',
        message: error.message
      },
      { status: 500 }
    )
  }
}

// POST /api/users - Crear usuario
export async function POST(request: NextRequest) {
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

    const body = await request.json()

    // Validar campos requeridos
    const requiredFields = ['email', 'password', 'name', 'role', 'user_type', 'rut']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Campo requerido faltante: ${field}`
          },
          { status: 400 }
        )
      }
    }

    // Validar email único
    const existingUser = await getUserByEmail(body.email)
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'El email ya está registrado. Por favor usa otro email.'
        },
        { status: 400 }
      )
    }

    // Validar rol
    if (!['admin', 'retail', 'wholesale'].includes(body.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rol inválido. Debe ser: admin, retail o wholesale'
        },
        { status: 400 }
      )
    }

    // Validar user_type
    if (!['person', 'company'].includes(body.user_type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tipo de usuario inválido. Debe ser: person o company'
        },
        { status: 400 }
      )
    }

    // Validar contraseña
    if (body.password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'La contraseña debe tener al menos 6 caracteres'
        },
        { status: 400 }
      )
    }

    // Crear usuario
    const user = await createUser({
      email: body.email,
      password: body.password,
      name: body.name,
      role: body.role,
      user_type: body.user_type,
      rut: body.rut,
      phone: body.phone,
      address: body.address,
      city: body.city,
      region: body.region,
      company_name: body.company_name
    })

    // No retornar password_hash
    const { password_hash, ...safeUser } = user

    return NextResponse.json({
      success: true,
      data: safeUser,
      message: 'Usuario creado exitosamente'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear usuario',
        message: error.message
      },
      { status: 500 }
    )
  }
}

