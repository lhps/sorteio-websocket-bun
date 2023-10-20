import { APP_PORT } from './config';
import { fetchHandler } from './handlers/httpHandlers';
import {
  openHandler,
  closeHandler,
  messageHandler,
} from './handlers/wsHandler';

const server = Bun.serve({
  port: APP_PORT,
  fetch: fetchHandler,
  websocket: {
    open: openHandler,
    close: closeHandler,
    message: messageHandler,
  },
});

console.log(`Servidor BUN ovuindo a porta ${APP_PORT}`);
