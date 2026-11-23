import http from 'node:http';

const ROUTES = ['/', '/about', '/services', '/franchise', '/gallery', '/blog'];

async function checkRoute(route) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${route}`, (res) => {
      resolve({ route, status: res.statusCode });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Testing HTTP response for all 6 routes on http://localhost:3000...');
  for (const r of ROUTES) {
    const res = await checkRoute(r);
    console.log(`  Route '${res.route}': HTTP ${res.status}`);
    if (res.status !== 200) {
      throw new Error(`Route ${res.route} returned status ${res.status}`);
    }
  }
  console.log('All 6 routes return HTTP 200 OK!');
}

main().catch((err) => {
  console.error('HTTP route check failed:', err);
  process.exit(1);
});
