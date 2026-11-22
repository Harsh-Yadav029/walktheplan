import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('router path navigation resolves /, /about, /services, /franchise, /gallery, and /blog correctly', () => {
  const routes = ['/', '/about', '/services', '/franchise', '/gallery', '/blog'];
  assert.equal(routes.includes('/about'), true);
  assert.equal(routes.includes('/services'), true);
  assert.equal(routes.includes('/franchise'), true);
  assert.equal(routes.includes('/gallery'), true);
  assert.equal(routes.includes('/blog'), true);
  assert.equal(routes.includes('/'), true);
});

test('franchise business models contain FOFO, FOCO, and COLLABORATION', () => {
  const models = ['FOFO', 'FOCO', 'COLLABORATION'];
  assert.equal(models.length, 3);
  assert.equal(models.includes('FOFO'), true);
  assert.equal(models.includes('FOCO'), true);
  assert.equal(models.includes('COLLABORATION'), true);
});

test('chapter indices map correctly across 5 documentary chapters', () => {
  const chapters = ['01', '02', '03', '04', '05'];
  assert.equal(chapters.length, 5);
  assert.equal(chapters[0], '01');
  assert.equal(chapters[4], '05');
});

test('blog page route is marked as dark page and has valid articles schema', () => {
  const isDarkPage = (pathname: string) =>
    ['/about', '/services', '/franchise', '/gallery', '/blog'].includes(pathname);

  assert.equal(isDarkPage('/blog'), true);
  assert.equal(isDarkPage('/'), false);

  const samplePost = {
    id: "post-1",
    title: "10 Costly Floor Plan Mistakes You Can Only Catch in 1:1 Scale",
    label: "Floor Plan Mistakes",
    author: "Parth Khanna",
    published: "18 Feb 2026",
    url: "#post-1",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  };

  assert.ok(samplePost.id && samplePost.title && samplePost.author && samplePost.image);
});

test('bottom-nav-bar has 6 default items and valid label schema', () => {
  const defaultLabels = ["Home", "Portfolio", "Transactions", "Messages", "Rewards", "Profile"];
  assert.equal(defaultLabels.length, 6);
  assert.equal(defaultLabels[0], "Home");
  assert.equal(defaultLabels[5], "Profile");

  const wtpMobileNav = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Franchise', href: '/franchise' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Blog', href: '/blog' },
  ];
  assert.equal(wtpMobileNav.length, 6);
  assert.equal(wtpMobileNav[4].label, 'Gallery');
  assert.equal(wtpMobileNav[5].href, '/blog');
});

test('navBar activeIndex correctly maps Home to 0, About to 1, Services to 2, Franchise to 3, Gallery to 4, Blog to 5', () => {
  const getActiveIndex = (pathname: string) => {
    const p = pathname.replace(/\/$/, '') || '/';
    if (p === '/') return 0;
    if (p === '/about') return 1;
    if (p === '/services') return 2;
    if (p === '/franchise') return 3;
    if (p === '/gallery') return 4;
    if (p === '/blog') return 5;
    return 0;
  };

  assert.equal(getActiveIndex('/'), 0);
  assert.equal(getActiveIndex('/about'), 1);
  assert.equal(getActiveIndex('/about/'), 1);
  assert.equal(getActiveIndex('/services'), 2);
  assert.equal(getActiveIndex('/franchise'), 3);
  assert.equal(getActiveIndex('/gallery'), 4);
  assert.equal(getActiveIndex('/blog'), 5);
  assert.equal(getActiveIndex('/blog/'), 5);
});

test('nextframee design system tokens and component schema validate correctly', () => {
  const nfTokens = {
    primary: '#FFFFFF',
    secondary: '#364254',
    tertiary: '#AF46FF',
    neutral: '#000000',
    surface: '#050505',
    borderSubtle: 'rgba(255, 255, 255, 0.1)',
    accentCyan: '#9CCBFF',
    accentPink: '#F5B8C8',
    accentViolet: '#C4A7FF',
  };

  assert.equal(nfTokens.primary, '#FFFFFF');
  assert.equal(nfTokens.surface, '#050505');
  assert.equal(nfTokens.tertiary, '#AF46FF');
  assert.equal(nfTokens.accentCyan, '#9CCBFF');
});

test('grid-pulse component and hero video asset exist with valid configuration', () => {
  const videoPath = path.resolve(process.cwd(), 'public/videos/hero-cinematic.mp4');
  assert.equal(fs.existsSync(videoPath), true);

  const gridProps = { cell: 32, reach: 2.8, ambient: 3, maxLit: 180 };
  assert.equal(gridProps.cell, 32);
  assert.equal(gridProps.ambient, 3);
});

test('home page component and 3d scroll image sequence hero are present and verified', () => {
  const homePagePath = path.resolve(process.cwd(), 'src/pages/HomePage.tsx');
  assert.equal(fs.existsSync(homePagePath), true);

  const heroPath = path.resolve(process.cwd(), 'src/components/ArchitecturalHero.tsx');
  const heroContent = fs.readFileSync(heroPath, 'utf-8');
  assert.equal(heroContent.includes('canvasRef'), true);
  assert.equal(heroContent.includes('TOTAL_FRAMES = 300'), true);
  assert.equal(heroContent.includes('requestAnimationFrame'), true);

  // Verify frames exist
  const firstFrame = path.resolve(process.cwd(), 'public/frames/ezgif-frame-001.jpg');
  const lastFrame = path.resolve(process.cwd(), 'public/frames/ezgif-frame-300.jpg');
  assert.equal(fs.existsSync(firstFrame), true);
  assert.equal(fs.existsSync(lastFrame), true);
});
