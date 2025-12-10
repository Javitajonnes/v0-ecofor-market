import { NextRequest, NextResponse } from 'next/server'
import { getOrderStats } from '@/lib/db/orders'
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

// GET /api/orders/stats - Obtener estadísticas de pedidos
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

    // Obtener estadísticas
    const stats = await getOrderStats()

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error: any) {
    console.error('Error fetching order stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas',
        message: error.message
      },
      { status: 500 }
    )
  }
}

