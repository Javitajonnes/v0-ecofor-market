import { NextRequest, NextResponse } from 'next/server'
import { getUserOrders } from '@/lib/db/orders'
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

// GET /api/orders/my-orders - Obtener pedidos del usuario actual
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
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

    // Solo usuarios minoristas y mayoristas pueden ver sus pedidos
    // Los admins deben usar /api/orders
    if (auth.role === 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Los administradores deben usar el panel de administración para ver pedidos'
        },
        { status: 403 }
      )
    }

    // Obtener parámetros de query
    const { searchParams } = new URL(request.url)
    const includeCancelled = searchParams.get('includeCancelled') === 'true'

    // Obtener pedidos del usuario
    const orders = await getUserOrders(auth.userId, includeCancelled)

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length
    })
  } catch (error: any) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener pedidos',
        message: error.message
      },
      { status: 500 }
    )
  }
}

