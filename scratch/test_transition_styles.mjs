import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const configPath = path.resolve(process.cwd(), 'src/transitions/transitionConfig.ts');
const originalConfig = fs.readFileSync(configPath, 'utf-8');

const STYLES = ['depth-push', 'door-swing', 'cube', 'flip', 'curtain'];

console.log('Testing all 5 transition styles for build and type integrity...');

for (const style of STYLES) {
  console.log(`\nTesting style: '${style}'...`);
  const updatedConfig = originalConfig.replace(
    /style:\s*['"][^'"]+['"]/,
    `style: '${style}'`
  );
  fs.writeFileSync(configPath, updatedConfig, 'utf-8');

  try {
    execSync('npm run lint', { stdio: 'pipe' });
    console.log(`  ✓ Lint passed for '${style}'`);
  } catch (err) {
    console.error(`  ✗ Lint failed for '${style}':`, err.stdout?.toString() || err.message);
    fs.writeFileSync(configPath, originalConfig, 'utf-8');
    process.exit(1);
  }
}

// Restore original config (depth-push)
fs.writeFileSync(configPath, originalConfig, 'utf-8');
console.log('\nAll 5 transition styles validated successfully and config restored to default depth-push!');
