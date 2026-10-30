// Eenvoudige lokale server voor de uitvoermap uit cursus.config.json
// (vandaag ../leerlingen): node build/serve.mjs [poort]
// Voor AI-wijs Start (../aiwijs-start, standaard op poort 4322, zodat beide
// tegelijk kunnen draaien): node build/serve.mjs --cursus start [poort]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { kiesCursus, losseArgumenten } from './cursus.mjs';

const { naam, DIST } = kiesCursus();
const PORT = parseInt(losseArgumenten()[0] || process.env.PORT || (naam === 'start' ? '4322' : '4321'), 10);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(DIST, p);
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('Niet gevonden'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Site: http://localhost:${PORT}/`));
