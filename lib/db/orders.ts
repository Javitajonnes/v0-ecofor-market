import { getSql } from './index'

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderFromDB {
  id: string
  user_id: string
  order_number: string
  status: OrderStatus
  total_amount: number
  payment_method: string | null
  shipping_address: string
  shipping_city: string | null
  shipping_region: string | null
  shipping_postal_code: string | null
  notes: string | null
  created_at: Date
  updated_at: Date
  confirmed_at: Date | null
  shipped_at: Date | null
  delivered_at: Date | null
}

export interface OrderItemFromDB {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number
  created_at: Date
}

export interface OrderWithItems extends OrderFromDB {
  user_name: string
  user_email: string
  items: (OrderItemFromDB & {
    product_name: string
    product_sku: string
    product_image: string | null
  })[]
}

/**
 * Obtener todos los pedidos
 */
export async function getAllOrders(includeCancelled = false): Promise<OrderWithItems[]> {
  const sql = getSql()
  
  let ordersQuery
  if (includeCancelled) {
    ordersQuery = sql`
      SELECT 
        o.*,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `
  } else {
    ordersQuery = sql`
      SELECT 
        o.*,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.status != 'cancelled'
      ORDER BY o.created_at DESC
    `
  }
  
  const orders = await ordersQuery
  
  // Obtener items para cada pedido
  const ordersWithItems: OrderWithItems[] = []
  
  for (const order of orders) {
    const itemsQuery = sql`
      SELECT 
        oi.*,
        p.name as product_name,
        p.sku as product_sku,
        p.image_url as product_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${order.id}
      ORDER BY oi.created_at
    `
    
    const items = await itemsQuery
    
    ordersWithItems.push({
      ...order,
      items: items.map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        subtotal: Number(item.subtotal),
        created_at: item.created_at,
        product_name: item.product_name,
        product_sku: item.product_sku,
        product_image: item.product_image
      }))
    })
  }
  
  return ordersWithItems
}

/**
 * Obtener pedido por ID
 */
export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const sql = getSql()
  
  const orderResult = await sql`
    SELECT 
      o.*,
      u.name as user_name,
      u.email as user_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ${id}
  `
  
  if (!orderResult[0]) {
    return null
  }
  
  const order = orderResult[0]
  
  const itemsResult = await sql`
    SELECT 
      oi.*,
      p.name as product_name,
      p.sku as product_sku,
      p.image_url as product_image
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ${id}
    ORDER BY oi.created_at
  `
  
  return {
    ...order,
    items: itemsResult.map((item: any) => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      subtotal: Number(item.subtotal),
      created_at: item.created_at,
      product_name: item.product_name,
      product_sku: item.product_sku,
      product_image: item.product_image
    }))
  }
}

/**
 * Obtener estadísticas de pedidos
 */
export async function getOrderStats() {
  const sql = getSql()
  
  // Total de pedidos
  const totalOrders = await sql`
    SELECT COUNT(*) as count FROM orders
  `
  
  // Pedidos por estado
  const ordersByStatus = await sql`
    SELECT status, COUNT(*) as count
    FROM orders
    GROUP BY status
  `
  
  // Total de ventas
  const totalSales = await sql`
    SELECT COALESCE(SUM(total_amount), 0) as total
    FROM orders
    WHERE status != 'cancelled'
  `
  
  // Ventas del mes actual
  const currentMonthSales = await sql`
    SELECT COALESCE(SUM(total_amount), 0) as total
    FROM orders
    WHERE status != 'cancelled'
    AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
  `
  
  // Pedidos del mes actual
  const currentMonthOrders = await sql`
    SELECT COUNT(*) as count
    FROM orders
    WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
  `
  
  // Pedidos recientes (últimos 7 días)
  const recentOrders = await sql`
    SELECT COUNT(*) as count
    FROM orders
    WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
  `
  
  // Ventas de los últimos 7 días
  const recentSales = await sql`
    SELECT COALESCE(SUM(total_amount), 0) as total
    FROM orders
    WHERE status != 'cancelled'
    AND created_at >= CURRENT_DATE - INTERVAL '7 days'
  `
  
  // Top productos vendidos (últimos 30 días)
  const topProducts = await sql`
    SELECT 
      p.name,
      p.sku,
      SUM(oi.quantity) as total_quantity,
      SUM(oi.subtotal) as total_revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE o.status != 'cancelled'
    AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY p.id, p.name, p.sku
    ORDER BY total_quantity DESC
    LIMIT 10
  `
  
  return {
    totalOrders: Number(totalOrders[0].count),
    ordersByStatus: ordersByStatus.map((row: any) => ({
      status: row.status,
      count: Number(row.count)
    })),
    totalSales: Number(totalSales[0].total),
    currentMonthSales: Number(currentMonthSales[0].total),
    currentMonthOrders: Number(currentMonthOrders[0].count),
    recentOrders: Number(recentOrders[0].count),
    recentSales: Number(recentSales[0].total),
    topProducts: topProducts.map((row: any) => ({
      name: row.name,
      sku: row.sku,
      totalQuantity: Number(row.total_quantity),
      totalRevenue: Number(row.total_revenue)
    }))
  }
}

/**
 * Obtener pedidos de un usuario específico
 */
export async function getUserOrders(userId: string, includeCancelled = false): Promise<OrderWithItems[]> {
  const sql = getSql()
  
  let ordersQuery
  if (includeCancelled) {
    ordersQuery = sql`
      SELECT 
        o.*,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.user_id = ${userId}
      ORDER BY o.created_at DESC
    `
  } else {
    ordersQuery = sql`
      SELECT 
        o.*,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.user_id = ${userId}
      AND o.status != 'cancelled'
      ORDER BY o.created_at DESC
    `
  }
  
  const orders = await ordersQuery
  
  // Obtener items para cada pedido
  const ordersWithItems: OrderWithItems[] = []
  
  for (const order of orders) {
    const itemsQuery = sql`
      SELECT 
        oi.*,
        p.name as product_name,
        p.sku as product_sku,
        p.image_url as product_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${order.id}
      ORDER BY oi.created_at
    `
    
    const items = await itemsQuery
    
    ordersWithItems.push({
      ...order,
      items: items.map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        subtotal: Number(item.subtotal),
        created_at: item.created_at,
        product_name: item.product_name,
        product_sku: item.product_sku,
        product_image: item.product_image
      }))
    })
  }
  
  return ordersWithItems
}

/**
 * Actualizar estado de pedido
 */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<OrderFromDB | null> {
  const sql = getSql()
  
  const updateData: any = {
    status,
    updated_at: new Date()
  }
  
  // Actualizar timestamps según el estado
  if (status === 'confirmed' && !updateData.confirmed_at) {
    updateData.confirmed_at = new Date()
  }
  if (status === 'shipped' && !updateData.shipped_at) {
    updateData.shipped_at = new Date()
  }
  if (status === 'delivered' && !updateData.delivered_at) {
    updateData.delivered_at = new Date()
  }
  
  const result = await sql`
    UPDATE orders 
    SET 
      status = ${status},
      updated_at = CURRENT_TIMESTAMP,
      confirmed_at = CASE 
        WHEN ${status} = 'confirmed' AND confirmed_at IS NULL 
        THEN CURRENT_TIMESTAMP 
        ELSE confirmed_at 
      END,
      shipped_at = CASE 
        WHEN ${status} = 'shipped' AND shipped_at IS NULL 
        THEN CURRENT_TIMESTAMP 
        ELSE shipped_at 
      END,
      delivered_at = CASE 
        WHEN ${status} = 'delivered' AND delivered_at IS NULL 
        THEN CURRENT_TIMESTAMP 
        ELSE delivered_at 
      END
    WHERE id = ${id}
    RETURNING *
  `
  
  return result[0] || null
}

