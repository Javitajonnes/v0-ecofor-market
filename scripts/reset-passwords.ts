import bcrypt from "bcryptjs"

// Contraseñas simples para testing
const users = [
  { email: "admin@ecoformarket.com", password: "admin123" },
  { email: "cliente1@email.com", password: "cliente123" },
  { email: "cliente2@email.com", password: "cliente123" },
  { email: "empresa1@email.com", password: "empresa123" },
  { email: "empresa2@email.com", password: "empresa123" },
]

async function generateHashes() {
  console.log("Generando hashes para contraseñas de prueba...\n")

  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 12)
    console.log(`-- ${user.email}`)
    console.log(`-- Password: ${user.password}`)
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = '${user.email}';`)
    console.log("")
  }
}

generateHashes()
