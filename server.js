const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const ROOT_DIR = path.resolve(__dirname);

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname);
  } catch (e) {
    urlPath = '/';
  }
  if (urlPath === '/') urlPath = '/index.html';
  const relativePath = urlPath.replace(/^\//, '') || 'index.html';

  const filePath = path.join(ROOT_DIR, relativePath);
  const resolvedPath = path.resolve(filePath);

  // Prevent path traversal - ensure resolved path is within project root
  if (!resolvedPath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 - Forbidden</h1>', 'utf-8');
    return;
  }

  const extname = String(path.extname(resolvedPath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  const isBinary = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg'].includes(extname);

  fs.readFile(resolvedPath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Server Error</h1>', 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, isBinary ? undefined : 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🌳 Family Tree Website Server');
  console.log('='.repeat(60));
  console.log(`\n✅ Server started successfully!`);
  console.log(`\n🌐 Open your browser and visit:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`\n📁 Serving files from: ${__dirname}`);
  console.log(`\n⏹️  Press Ctrl+C to stop the server\n`);
  console.log('='.repeat(60) + '\n');
  
  // Try to open browser (Windows)
  const { exec } = require('child_process');
  exec(`start http://localhost:${PORT}`, (error) => {
    if (error) {
      console.log('⚠️  Could not open browser automatically.');
      console.log(`   Please manually open: http://localhost:${PORT}\n`);
    }
  });
});

