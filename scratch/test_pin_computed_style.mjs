import http from 'node:http';

async function fetchPage() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000/', (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const html = await fetchPage();
  console.log('HTML length:', html.length);
  const hasPerspective = html.includes('perspective');
  console.log('Contains perspective string in SSR/initial HTML:', hasPerspective);
}

run();
