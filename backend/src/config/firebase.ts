import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(path.resolve('firebase-key.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

export { db };