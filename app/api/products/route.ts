import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, createProduct, getProductBySku } from '@/lib/db/products'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

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

// GET /api/products - Listar productos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const products = await getAllProducts(includeInactive)

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener productos',
        message: error.message
      },
      { status: 500 }
    )
  }
}

// POST /api/products - Crear producto
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
    const requiredFields = ['name', 'category', 'sku', 'price_retail', 'price_wholesale']
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

    // Verificar que el SKU no exista
    const existingProduct = await getProductBySku(body.sku)
    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'El SKU ya existe. Por favor usa un SKU único.'
        },
        { status: 400 }
      )
    }

    // Validar precios positivos
    if (body.price_retail <= 0 || body.price_wholesale <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Los precios deben ser mayores a 0'
        },
        { status: 400 }
      )
    }

    // Crear producto
    const product = await createProduct({
      name: body.name,
      description: body.description,
      category: body.category,
      brand: body.brand,
      sku: body.sku,
      price_retail: parseFloat(body.price_retail),
      price_wholesale: parseFloat(body.price_wholesale),
      min_wholesale_quantity: body.min_wholesale_quantity || 10,
      stock: body.stock || 0,
      image_url: body.image_url,
      is_featured: body.is_featured || false,
      is_active: body.is_active !== undefined ? body.is_active : true,
      weight_kg: body.weight_kg,
      dimensions: body.dimensions
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Producto creado exitosamente'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear producto',
        message: error.message
      },
      { status: 500 }
    )
  }
}

