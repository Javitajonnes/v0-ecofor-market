import { NextRequest, NextResponse } from 'next/server'
import { getProductById, updateProduct, deleteProduct } from '@/lib/db/products'
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

// GET /api/products/[id] - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id)

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producto no encontrado'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener producto',
        message: error.message
      },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Actualizar producto
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

    // Verificar que el producto existe
    const existingProduct = await getProductById(params.id)
    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producto no encontrado'
        },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Validar precios si se proporcionan
    if (body.price_retail !== undefined && body.price_retail <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El precio retail debe ser mayor a 0'
        },
        { status: 400 }
      )
    }

    if (body.price_wholesale !== undefined && body.price_wholesale <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El precio mayorista debe ser mayor a 0'
        },
        { status: 400 }
      )
    }

    // Preparar datos para actualizar
    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.category !== undefined) updateData.category = body.category
    if (body.brand !== undefined) updateData.brand = body.brand
    if (body.sku !== undefined) updateData.sku = body.sku
    if (body.price_retail !== undefined) updateData.price_retail = parseFloat(body.price_retail)
    if (body.price_wholesale !== undefined) updateData.price_wholesale = parseFloat(body.price_wholesale)
    if (body.min_wholesale_quantity !== undefined) updateData.min_wholesale_quantity = parseInt(body.min_wholesale_quantity)
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock)
    if (body.image_url !== undefined) updateData.image_url = body.image_url
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured
    if (body.is_active !== undefined) updateData.is_active = body.is_active
    if (body.weight_kg !== undefined) updateData.weight_kg = body.weight_kg ? parseFloat(body.weight_kg) : null
    if (body.dimensions !== undefined) updateData.dimensions = body.dimensions

    // Actualizar producto
    const updatedProduct = await updateProduct(params.id, updateData)

    if (!updatedProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error al actualizar producto'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Producto actualizado exitosamente'
    })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar producto',
        message: error.message
      },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Eliminar producto (soft delete)
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

    // Verificar que el producto existe
    const existingProduct = await getProductById(params.id)
    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producto no encontrado'
        },
        { status: 404 }
      )
    }

    // Eliminar producto (soft delete)
    const deleted = await deleteProduct(params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error al eliminar producto'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar producto',
        message: error.message
      },
      { status: 500 }
    )
  }
}

