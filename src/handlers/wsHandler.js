import { ACTIONS } from '../constants/actions';

let clientsConnected = [];

export function updateAdminClientCount() {
  const clientCount = Array.from(clientsConnected).filter(
    (client) => !client?.isAdmin
  ).length;

  Array.from(clientsConnected).forEach((client) => {
    if (client.isAdmin && client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          action: ACTIONS.CLIENT_COUNT_UPDATE,
          count: clientCount,
        })
      );
    }
  });
}

export function handleDraw(confirmationCode) {
  const participants = Array.from(clientsConnected).filter(
    (client) => !client.isAdmin
  );

  const winner = participants[Math.floor(Math.random() * participants.length)];

  participants.forEach((client) => {
    let result = JSON.stringify({
      status: 'youlose',
    });

    if (client === winner) {
      result = JSON.stringify({
        status: 'youwin',
        code: confirmationCode,
      });
    }

    client.send(result);
  });
}

export function openHandler(ws) {
  clientsConnected.push(ws);
  updateAdminClientCount();
}

export function closeHandler(ws) {
  clientsConnected = clientsConnected.filter((client) => client !== ws);
  updateAdminClientCount();
}

export function messageHandler(ws, message) {
  const data = JSON.parse(message);
  const { action } = data;

  switch (action) {
    case ACTIONS.ADMIN:
      ws.isAdmin = true;
      break;
    case ACTIONS.DRAW:
      handleDraw(data.code);
      break;
    default:
      console.warn('Ação desconhecida: ', action);
  }
}
