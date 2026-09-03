const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const REQUEST_TIMEOUT_MS = 30000;

function isInsideRoot(root, target) {
  const rel = path.relative(root, target);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

function createStaticServer(rootDir, port, host) {
  const root = path.resolve(rootDir);

  const server = http.createServer((req, res) => {
    res.setTimeout(REQUEST_TIMEOUT_MS, () => {
      if (!res.headersSent) {
        res.writeHead(408, { 'Content-Type': 'text/plain; charset=utf-8' });
      }
      res.end('Request Timeout');
    });

    let urlPath = '/';
    try {
      urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Bad Request');
      return;
    }

    let filePath = path.resolve(root, '.' + urlPath);
    if (!isInsideRoot(root, filePath)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (statErr, stat) => {
      if (!statErr && stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
        if (!isInsideRoot(root, filePath)) {
          res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Forbidden');
          return;
        }
      }

      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME[ext] || 'application/octet-stream';

      fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
      });
    });
  });

  server.timeout = REQUEST_TIMEOUT_MS;
  server.requestTimeout = REQUEST_TIMEOUT_MS;

  return new Promise((resolve, reject) => {
    const onError = (err) => reject(err);
    server.once('error', onError);
    server.listen(port || 0, host, () => {
      server.removeListener('error', onError);
      const addr = server.address();
      resolve({
        server,
        port: addr.port,
        close() {
          return new Promise((closeResolve, closeReject) => {
            server.close((err) => (err ? closeReject(err) : closeResolve()));
          });
        },
      });
    });
  });
}

module.exports = { createStaticServer };

if (require.main === module) {
  const root = process.argv[2] || 'build';
  const port = Number(process.argv[3]) || 5050;
  createStaticServer(root, port, '0.0.0.0')
    .then(({ port: bound }) => {
      console.log(`Static server listening on http://0.0.0.0:${bound}`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
