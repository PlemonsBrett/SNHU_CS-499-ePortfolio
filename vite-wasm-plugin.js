export default function wasmMimePlugin() {
  return {
    name: 'wasm-mime-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.endsWith('.wasm')) {
          res.setHeader('Content-Type', 'application/wasm');
        } else if (req.url?.endsWith('.js') && req.url.includes('/wasm/')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
        next();
      });
    },
  };
} 