import BASE_URL from '../varibles/variables';
import WebSocketManager from '../webSocketManager/webSocketManager';
import GetMessageArhiveInterface from '../../interfaces/getMessageArhive';
import generateId from '../generateId/generateId';

class GetMessageArhive {
  socket: WebSocket;

  constructor() {
    this.socket = WebSocketManager.getinstance().connect(BASE_URL);
  }

  getMessage(user: string): void {
    const messageArhive: GetMessageArhiveInterface = {
      id: generateId(),
      type: 'MSG_FROM_USER',
      payload: {
        user: {
          login: user,
        },
      },
    };
    this.socket.send(JSON.stringify(messageArhive));
  }
}

export default GetMessageArhive;
