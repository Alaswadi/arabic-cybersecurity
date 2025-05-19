const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');
const next = require('next');

// Make sure we're running in production mode
process.env.NODE_ENV = 'production';

// Get the port from the environment or use 3000 as default
const port = process.env.PORT || 3000;

// Create the Next.js app
const app = next({
  dev: false,
  dir: __dirname,
  conf: {
    distDir: path.join(__dirname, 'build'),
  }
});

// Get the request handler
const handle = app.getRequestHandler();

// Prepare the app
app.prepare()
  .then(() => {
    // Create the server
    const server = createServer(async (req, res) => {
      try {
        // Parse the URL
        const parsedUrl = parse(req.url, true);
        
        // Let Next.js handle the request
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });
    
    // Start the server
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on port ${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
