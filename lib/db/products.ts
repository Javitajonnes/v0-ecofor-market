import { getSql } from "./index"

export interface ProductFromDB {
  id: string
  name: string
  description: string | null
  category: string
  brand: string | null
  sku: string
  price_retail: number
  price_wholesale: number
  min_wholesale_quantity: number
  stock: number
  image_url: string | null
  is_featured: boolean
  is_active: boolean
  weight_kg: number | null
  dimensions: string | null
  created_at: Date
  updated_at: Date
}

export interface CreateProductData {
  name: string
  description?: string
  category: string
  brand?: string
  sku: string
  price_retail: number
  price_wholesale: number
  min_wholesale_quantity?: number
  stock?: number
  image_url?: string
  is_featured?: boolean
  is_active?: boolean
  weight_kg?: number
  dimensions?: string
}

/**
 * Obtener todos los productos
 */
export async function getAllProducts(includeInactive = false): Promise<ProductFromDB[]> {
  const sql = getSql()
  
  if (includeInactive) {
    const result = await sql`SELECT * FROM products ORDER BY created_at DESC`
    return result
  } else {
    const result = await sql`SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC`
    return result
  }
}

/**
 * Obtener producto por ID
 */
export async function getProductById(id: string): Promise<ProductFromDB | null> {
  const sql = getSql()
  const result = await sql`SELECT * FROM products WHERE id = ${id}`
  return result[0] || null
}

/**
 * Obtener producto por SKU
 */
export async function getProductBySku(sku: string): Promise<ProductFromDB | null> {
  const sql = getSql()
  const result = await sql`SELECT * FROM products WHERE sku = ${sku}`
  return result[0] || null
}

/**
 * Crear nuevo producto
 */
export async function createProduct(data: CreateProductData): Promise<ProductFromDB> {
  const sql = getSql()
  
  const result = await sql`
    INSERT INTO products (
      name, description, category, brand, sku,
      price_retail, price_wholesale, min_wholesale_quantity,
      stock, image_url, is_featured, is_active,
      weight_kg, dimensions
    ) VALUES (
      ${data.name},
      ${data.description || null},
      ${data.category},
      ${data.brand || null},
      ${data.sku},
      ${data.price_retail},
      ${data.price_wholesale},
      ${data.min_wholesale_quantity ?? 10},
      ${data.stock ?? 0},
      ${data.image_url || null},
      ${data.is_featured ?? false},
      ${data.is_active ?? true},
      ${data.weight_kg || null},
      ${data.dimensions || null}
    )
    RETURNING *
  `
  
  return result[0]
}

/**
 * Actualizar producto
 */
export async function updateProduct(
  id: string,
  data: Partial<CreateProductData>
): Promise<ProductFromDB | null> {
  const sql = getSql()
  
  // Obtener producto actual
  const current = await getProductById(id)
  if (!current) return null
  
  // Combinar datos actuales con los nuevos
  const updated = {
    name: data.name ?? current.name,
    description: data.description !== undefined ? data.description : current.description,
    category: data.category ?? current.category,
    brand: data.brand !== undefined ? data.brand : current.brand,
    sku: data.sku ?? current.sku,
    price_retail: data.price_retail ?? current.price_retail,
    price_wholesale: data.price_wholesale ?? current.price_wholesale,
    min_wholesale_quantity: data.min_wholesale_quantity ?? current.min_wholesale_quantity,
    stock: data.stock ?? current.stock,
    image_url: data.image_url !== undefined ? data.image_url : current.image_url,
    is_featured: data.is_featured ?? current.is_featured,
    is_active: data.is_active ?? current.is_active,
    weight_kg: data.weight_kg !== undefined ? data.weight_kg : current.weight_kg,
    dimensions: data.dimensions !== undefined ? data.dimensions : current.dimensions,
  }
  
  const result = await sql`
    UPDATE products SET
      name = ${updated.name},
      description = ${updated.description},
      category = ${updated.category},
      brand = ${updated.brand},
      sku = ${updated.sku},
      price_retail = ${updated.price_retail},
      price_wholesale = ${updated.price_wholesale},
      min_wholesale_quantity = ${updated.min_wholesale_quantity},
      stock = ${updated.stock},
      image_url = ${updated.image_url},
      is_featured = ${updated.is_featured},
      is_active = ${updated.is_active},
      weight_kg = ${updated.weight_kg},
      dimensions = ${updated.dimensions},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `
  
  return result[0] || null
}

/**
 * Eliminar producto (soft delete - marca como inactivo)
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const sql = getSql()
  const result = await sql`
    UPDATE products 
    SET is_active = false, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `
  return result.count > 0
}

/**
 * Convertir producto de BD a formato del frontend
 */
import type { Product } from "../types"

export function formatProductForFrontend(product: ProductFromDB): Product {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand || '',
    description: product.description || '',
    image: product.image_url || '/placeholder.jpg',
    retailPrice: Number(product.price_retail),
    wholesalePrice: Number(product.price_wholesale),
    minWholesaleQty: product.min_wholesale_quantity,
    stock: product.stock,
    category: product.category,
    unit: product.dimensions || 'Un',
    featured: product.is_featured,
  }
}

