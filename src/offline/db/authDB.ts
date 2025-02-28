import { openDB, IDBPDatabase, DBSchema } from 'idb'

// Check if it's running on the client-side
const isBrowser = typeof window !== 'undefined'

// Define the schema for IndexedDB
interface AuthDBSchema extends DBSchema {
  users: {
    key: string // email
    value: { email: string; password: string }
  }
}

let dbPromise: Promise<IDBPDatabase<AuthDBSchema>> | undefined

if (isBrowser) {
  // Open IndexedDB only in the browser
  dbPromise = openDB<AuthDBSchema>('auth-store', 1, {
    upgrade(db) {
      db.createObjectStore('users', { keyPath: 'email' })
    }
  })
}

// Save user with plain password temporarily
export async function saveUser(email: string, password: string) {
  if (!isBrowser || !dbPromise) return // Prevent running if not in the browser

  try {
    if (!email || !password) {
      throw new Error('Email or password cannot be empty')
    }

    // Log email and password to check if they're being passed correctly
    console.log('Saving user:', email)
    console.log('Password:', password)

    const db = await dbPromise
    // Store the plain password temporarily
    await db.put('users', { email, password }) // Store the password as-is
    console.log('User saved successfully')
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

// Validate user with plain password temporarily
export async function validateUser(email: string, password: string) {
  if (!isBrowser || !dbPromise) return false // Prevent running if not in the browser

  try {
    if (!email || !password) {
      throw new Error('Email or password cannot be empty')
    }

    const db = await dbPromise
    const user = await db.get('users', email)
    if (!user) {
      console.log('User not found')
      return false
    }

    // Direct password comparison
    const isValid = password === user.password
    if (!isValid) {
      console.log('Invalid password')
    }
    return isValid
  } catch (error) {
    console.error('Error validating user:', error)
    return false
  }
}
