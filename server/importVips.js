const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

// Load Service Account Key
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin App
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Load VIP data (handles both vip.json and vips.json)
const jsonFile = fs.existsSync('./vip.json') ? './vip.json' : './vips.json';
const vips = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

async function uploadVips() {
  console.log(`Starting import of ${vips.length} VIP users...`);

  const chunkSize = 400; // Batch limit per write
  for (let i = 0; i < vips.length; i += chunkSize) {
    const chunk = vips.slice(i, i + chunkSize);
    const batch = db.batch();

    chunk.forEach((vip) => {
      const userRef = db.collection('users').doc(vip.studentId);
      batch.set(userRef, {
        studentId: vip.studentId,
        fullName: vip.fullName,
        email: vip.email,
        phone: vip.phone || '',
        passcode: String(vip.passcode),
        paymentStatus: 'approved',
        ticketPrice: '6.90',
        checkedIn: false,
        slipUrl: '',
        votedFemaleId: null,
        votedMaleId: null,
        createdAt: new Date().toISOString()
      });
    });

    await batch.commit();
    console.log(`Uploaded batch ${Math.floor(i / chunkSize) + 1} (${chunk.length} items)...`);
  }

  console.log(`✅ Successfully imported all ${vips.length} VIP accounts into Firestore!`);
}

uploadVips().catch(console.error);