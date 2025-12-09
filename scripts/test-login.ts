#!/usr/bin/env ts-node
/**
 * Script para probar el login directamente
 * 
 * Uso: npm run test:login
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Cargar variables de entorno
config({ path: resolve(process.cwd(), '.env.local') })

import { getUserByEmail, verifyPassword, formatUserForFrontend } from '../lib/db/users'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ecofor-market-secret-key-change-in-production'
)

async function testLogin(email: string, password: string) {
  console.log(`\n🔐 Probando login con:`)
  console.log(`   Email: ${email}`)
  console.log(`   Password: ${password}\n`)

  try {
    // Buscar usuario
    console.log('📊 Buscando usuario en la base de datos...')
    const userFromDB = await getUserByEmail(email)

    if (!userFromDB) {
      console.error('❌ Usuario no encontrado')
      return false
    }

    console.log(`✅ Usuario encontrado: ${userFromDB.name} (${userFromDB.role})`)

    // Verificar contraseña
    console.log('🔒 Verificando contraseña...')
    const isPasswordValid = await verifyPassword(password, userFromDB.password_hash)

    if (!isPasswordValid) {
      console.error('❌ Contraseña incorrecta')
      return false
    }

    console.log('✅ Contraseña válida')

    // Formatear usuario para frontend
    const user = formatUserForFrontend(userFromDB)
    console.log(`\n👤 Usuario formateado:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Nombre: ${user.name}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Rol: ${user.role}`)

    // Crear JWT token
    console.log('\n🎫 Generando JWT token...')
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    console.log(`✅ Token generado (${token.length} caracteres)`)
    console.log(`\n📋 Token (primeros 50 caracteres): ${token.substring(0, 50)}...`)

    console.log('\n✅ Login exitoso!')
    return true
  } catch (error: any) {
    console.error('❌ Error durante el login:', error.message)
    console.error(error)
    return false
  }
}

async function main() {
  console.log('🧪 Test de Login - EcoforMarket\n')
  console.log('=' .repeat(50))

  // Test 1: Admin
  const test1 = await testLogin('admin@ecoformarket.com', 'Admin123!')
  
  console.log('\n' + '='.repeat(50))
  
  // Test 2: Retail Client
  const test2 = await testLogin('cliente1@email.com', 'Admin123!')
  
  console.log('\n' + '='.repeat(50))
  
  // Test 3: Wholesale Client
  const test3 = await testLogin('empresa1@email.com', 'Admin123!')
  
  console.log('\n' + '='.repeat(50))
  
  // Test 4: Contraseña incorrecta
  console.log('\n🧪 Test 4: Contraseña incorrecta')
  const test4 = await testLogin('admin@ecoformarket.com', 'password-incorrecta')
  
  console.log('\n' + '='.repeat(50))
  
  // Test 5: Usuario no existe
  console.log('\n🧪 Test 5: Usuario no existe')
  const test5 = await testLogin('noexiste@email.com', 'Admin123!')

  console.log('\n' + '='.repeat(50))
  console.log('\n📊 Resumen de Tests:')
  console.log(`   ✅ Test 1 (Admin): ${test1 ? 'PASÓ' : 'FALLÓ'}`)
  console.log(`   ✅ Test 2 (Retail): ${test2 ? 'PASÓ' : 'FALLÓ'}`)
  console.log(`   ✅ Test 3 (Wholesale): ${test3 ? 'PASÓ' : 'FALLÓ'}`)
  console.log(`   ❌ Test 4 (Password incorrecta): ${!test4 ? 'PASÓ (rechazó correctamente)' : 'FALLÓ'}`)
  console.log(`   ❌ Test 5 (Usuario no existe): ${!test5 ? 'PASÓ (rechazó correctamente)' : 'FALLÓ'}`)

  const allPassed = test1 && test2 && test3 && !test4 && !test5
  console.log(`\n${allPassed ? '✅' : '❌'} Todos los tests: ${allPassed ? 'PASARON' : 'FALLARON'}`)
  
  process.exit(allPassed ? 0 : 1)
}

main().catch((error) => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
