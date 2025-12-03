import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getSql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const sql = getSql()

    // Contraseñas simples para testing
    const testUsers = [
      { email: "admin@ecoformarket.com", password: "admin123" },
      { email: "cliente1@email.com", password: "cliente123" },
      { email: "cliente2@email.com", password: "cliente123" },
      { email: "empresa1@email.com", password: "empresa123" },
      { email: "empresa2@email.com", password: "empresa123" },
    ]

    console.log("[v0] Resetting test user passwords...")

    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 12)

      await sql`
        UPDATE users 
        SET password_hash = ${hashedPassword}
        WHERE email = ${user.email}
      `

      console.log(`[v0] Updated password for ${user.email}`)
    }

    return NextResponse.json({
      success: true,
      message: "Test user passwords reset successfully",
      users: testUsers.map((u) => ({ email: u.email, password: u.password })),
    })
  } catch (error) {
    console.error("[v0] Error resetting passwords:", error)
    return NextResponse.json({ success: false, error: "Error al resetear contraseñas" }, { status: 500 })
  }
}
