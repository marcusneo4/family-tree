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
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Decode URL-encoded characters so files with spaces (e.g., "Family pics/Name Last.jpg") resolve correctly
  let filePath = '.' + decodeURIComponent(req.url);
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
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

