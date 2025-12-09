import { query } from './index'
import bcrypt from 'bcrypt'
import { User } from '../types'

// Mapear roles de la BD a roles del frontend
const mapRoleFromDB = (dbRole: string): User['role'] => {
  switch (dbRole) {
    case 'admin':
      return 'admin'
    case 'retail_client':
      return 'retail'
    case 'wholesale_client':
      return 'wholesale'
    default:
      return 'guest'
  }
}

// Mapear roles del frontend a roles de la BD
const mapRoleToDB = (role: User['role']): string => {
  switch (role) {
    case 'admin':
      return 'admin'
    case 'retail':
      return 'retail_client'
    case 'wholesale':
      return 'wholesale_client'
    default:
      return 'retail_client'
  }
}

export interface UserFromDB {
  id: string
  email: string
  password_hash: string
  user_type: 'person' | 'company'
  role: string
  name: string
  company_name: string | null
  rut: string
  phone: string | null
  address: string | null
  city: string | null
  region: string | null
  postal_code: string | null
  is_active: boolean
  email_verified: boolean
  created_at: Date
  updated_at: Date
}

/**
 * Buscar usuario por email
 */
export async function getUserByEmail(email: string): Promise<UserFromDB | null> {
  const result = await query(
    'SELECT * FROM users WHERE email = $1 AND is_active = true',
    [email]
  )
  return result.rows[0] || null
}

/**
 * Buscar usuario por ID
 */
export async function getUserById(id: string): Promise<UserFromDB | null> {
  const result = await query(
    'SELECT * FROM users WHERE id = $1 AND is_active = true',
    [id]
  )
  return result.rows[0] || null
}

/**
 * Verificar contraseña
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Hash de contraseña
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

/**
 * Crear nuevo usuario
 */
export async function createUser(data: {
  email: string
  password: string
  name: string
  role: 'retail' | 'wholesale'
  user_type: 'person' | 'company'
  rut: string
  phone?: string
  address?: string
  city?: string
  region?: string
  company_name?: string
}): Promise<UserFromDB> {
  const passwordHash = await hashPassword(data.password)
  const dbRole = mapRoleToDB(data.role)

  const result = await query(
    `INSERT INTO users (
      email, password_hash, name, role, user_type, rut, 
      phone, address, city, region, company_name
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      data.email,
      passwordHash,
      data.name,
      dbRole,
      data.user_type,
      data.rut,
      data.phone || null,
      data.address || null,
      data.city || null,
      data.region || null,
      data.company_name || null,
    ]
  )

  return result.rows[0]
}

/**
 * Convertir usuario de BD a formato del frontend
 */
export function formatUserForFrontend(user: UserFromDB): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: mapRoleFromDB(user.role),
  }
}


