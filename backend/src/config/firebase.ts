import * as admin from 'firebase-admin'
import * as path from 'path'
import fs from 'fs'

const firebaseKeyPath =
  process.env.FIREBASE_KEY_PATH ||
  path.resolve(process.cwd(), 'firebase-key.json')

if (!fs.existsSync(firebaseKeyPath)) {
  throw new Error(`Firebase key not found: ${firebaseKeyPath}`)
}

const serviceAccount = require(firebaseKeyPath)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const db = admin.firestore()
db.settings({ ignoreUndefinedProperties: true })

export { db }
