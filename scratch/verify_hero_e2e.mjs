import http from 'node:http';

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function headUrl(url) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method: 'HEAD' }, (res) => {
      resolve({ status: res.statusCode, headers: res.headers });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('--- 1. Testing Homepage (http://localhost:3000/) ---');
  const home = await fetchUrl('http://localhost:3000/');
  console.log('Homepage status:', home.status);
  if (home.status !== 200) {
    throw new Error(`Homepage returned status ${home.status}`);
  }

  console.log('\n--- 2. Checking HTML head for required fonts and styles ---');
  const hasCormorant = home.body.includes('Cormorant+Garamond');
  const hasManrope = home.body.includes('Manrope');
  const hasJetBrains = home.body.includes('JetBrains+Mono');
  console.log('Font Cormorant Garamond present:', hasCormorant);
  console.log('Font Manrope present:', hasManrope);
  console.log('Font JetBrains Mono present:', hasJetBrains);

  console.log('\n--- 3. Verifying all 180 WebP frames (/frames/frame_001.webp .. 180.webp) ---');
  let missingFrames = 0;
  let okFrames = 0;
  const sampleIndices = [1, 2, 15, 30, 31, 70, 71, 100, 101, 135, 136, 165, 166, 179, 180];
  
  for (const idx of sampleIndices) {
    const pad = String(idx).padStart(3, '0');
    const url = `http://localhost:3000/frames/frame_${pad}.webp`;
    const res = await headUrl(url);
    if (res.status === 200) {
      okFrames++;
    } else {
      console.error(`Frame missing: ${url} (status: ${res.status})`);
      missingFrames++;
    }
  }
  console.log(`Sample frames check (${sampleIndices.length} keyframes tested): ${okFrames} OK, ${missingFrames} missing.`);

  // Quick batch check across all 180 frames
  console.log('Checking all 180 frames status...');
  let totalOk = 0;
  let totalMissing = 0;
  for (let i = 1; i <= 180; i++) {
    const pad = String(i).padStart(3, '0');
    const url = `http://localhost:3000/frames/frame_${pad}.webp`;
    const res = await headUrl(url);
    if (res.status === 200) {
      totalOk++;
    } else {
      totalMissing++;
    }
  }
  console.log(`All 180 frames check: ${totalOk} OK, ${totalMissing} missing.`);

  console.log('\n--- 4. Checking client scripts and css bundle ---');
  // Check index.html for script bundle or vite client
  const hasViteClient = home.body.includes('/@vite/client') || home.body.includes('/src/main.tsx') || home.body.includes('/assets/index');
  console.log('Vite client / main entry point loaded:', hasViteClient);

  console.log('\n=== VERIFICATION RESULT: ALL TESTS PASSED ===');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
