const DB_NAME = 'mealsDB'
const DB_VERSION = 1
const STORE_NAME = 'meals'

const openDb = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result as IDBDatabase
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result)
    }

    request.onerror = (event) => {
      reject(event)
    }
  })
}

const addMeal = async (meal: any) => {
  const db = await openDb()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)
  store.put(meal)

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(meal)
    transaction.onerror = () => reject('Failed to add meal')
  })
}

const getMeals = async () => {
  const db = await openDb()
  const transaction = db.transaction(STORE_NAME, 'readonly')
  const store = transaction.objectStore(STORE_NAME)
  const request = store.getAll()

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject('Failed to get meals')
  })
}

const deleteMeal = async (id: string) => {
  const db = await openDb()
  const transaction = db.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)
  store.delete(id)

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(true)
    transaction.onerror = () => reject('Failed to delete meal')
  })
}

export { addMeal, getMeals, deleteMeal }
