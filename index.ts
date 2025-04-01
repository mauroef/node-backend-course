import { createServer } from 'http';

import cors from 'cors';

import config from './config';
import { authRouter, characterRouter } from './routes';

const corsMiddleware = cors();

const server = createServer(async (req, res) => {
  corsMiddleware(req, res, async () => {
    res.setHeader('Content-Type', 'application/json');

    try {
      if (req.url?.startsWith('/auth')) {
        await authRouter(req, res);
      } else if (req.url?.startsWith('/characters')) {
        await characterRouter(req, res);
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Endpoint Not Found' }));
      }
    } catch (_err) {
      console.log(_err);
      req.statusCode = 500;
      res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
  });
});

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
})