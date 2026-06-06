import { createReadStream, existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { createServer } from 'node:http';

const root = resolve('.');
const port = Number(process.env.PORT || 3000);

const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function resolveRequestPath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const requestedPath = normalize(pathname).replace(/^([/\\])+/, '');
  const filePath = resolve(join(root, requestedPath || 'index.html'));

  if (!filePath.startsWith(root)) {
    return null;
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  return resolve(join(root, 'index.html'));
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405);
    response.end();
    return;
  }

  const filePath = resolveRequestPath(request.url || '/');

  if (!filePath) {
    response.writeHead(403);
    response.end();
    return;
  }

  const contentType = contentTypes[extname(filePath)] || 'application/octet-stream';
  response.writeHead(200, { 'Content-Type': contentType });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  if (filePath.endsWith('index.html')) {
    const html = await readFile(filePath, 'utf8');
    response.end(html);
    return;
  }

  createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Static server listening on http://127.0.0.1:${port}`);
});
