// Run once: node api/generate-vapid.js
// Copy the output into Railway env vars and Vercel env vars.
const webpush = require('web-push');
const keys = webpush.generateVAPIDKeys();
console.log('VAPID_PUBLIC_KEY=' + keys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + keys.privateKey);
console.log('\nAlso add to Vercel:');
console.log('VITE_VAPID_PUBLIC_KEY=' + keys.publicKey);
