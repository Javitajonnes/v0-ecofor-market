import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders } from '@/lib/db/orders'
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

// GET /api/orders - Listar todos los pedidos
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

    // Obtener parámetros de query
    const { searchParams } = new URL(request.url)
    const includeCancelled = searchParams.get('includeCancelled') === 'true'

    // Obtener pedidos
    const orders = await getAllOrders(includeCancelled)

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length
    })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
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

