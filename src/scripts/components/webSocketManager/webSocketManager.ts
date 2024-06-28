import generateId from '../generateId/generateId';
import { UserLoginRequest } from '../../interfaces/UserLoginRequsetAndresponse';
import ContactListActive from '../contactsList/contactListOnline';
import ContactListInActive from '../contactsList/contactListOfline';
import ContactOnline from '../contactsList/contactOnline';
import ContactOffline from '../contactsList/contactOfflie';
import ReadMessage from '../readMessage/readMessage';
import User from '../../interfaces/user';
import GetMessageArhiveInterface from '../../interfaces/getMessageArhive';
import { Message } from '../../interfaces/messageSend';
import UserInfo from '../../interfaces/enumUserinfo';
import TypeResp from '../../interfaces/enumTypeRes';
import TypeReq from '../../interfaces/enumTypeReq';

class WebSocketManager {
  private static instance: WebSocketManager;

  private socket: WebSocket | null = null;

  private messageQueue: string[] = [];

  contactListActive: ContactListActive;

  contactOnline: ContactOnline;

  contactOffline: ContactOffline;

  contactListInActive: ContactListInActive;

  readMessage: ReadMessage;

  constructor() {
    this.contactListActive = new ContactListActive();
    this.contactOnline = new ContactOnline();
    this.contactOffline = new ContactOffline();
    this.contactListInActive = new ContactListInActive();
    this.readMessage = new ReadMessage();
  }

  static getinstance(): WebSocketManager {
    if (!this.instance) {
      this.instance = new WebSocketManager();
    }
    return this.instance;
  }

  handleAutoLogin() {
    const userLogin = localStorage.getItem(UserInfo.username);
    const userPass = localStorage.getItem(UserInfo.password);
    if (userLogin && userPass) {
      const loginData: UserLoginRequest = {
        id: generateId(),
        type: TypeReq.USER_LOGIN,
        payload: {
          user: {
            login: userLogin,
            password: userPass,
          },
        },
      };
      this.sendMessage(JSON.stringify(loginData));
    }
  }

  getActiveUsers() {
    const loginData = {
      id: generateId(),
      type: TypeReq.USER_ACTIVE,
      payload: null,
    };
    this.sendMessage(JSON.stringify(loginData));
  }

  getInActiveUsers() {
    const loginData = {
      id: generateId(),
      type: TypeReq.USER_INACTIVE,
      payload: null,
    };
    this.sendMessage(JSON.stringify(loginData));
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  connect(url: string): WebSocket {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(url);
      this.setupSocketHandlers();
    }
    return this.socket;
  }

  getMessage(user: string): void {
    const messageArhive: GetMessageArhiveInterface = {
      id: generateId(),
      type: TypeReq.MSG_FROM_USER,
      payload: {
        user: {
          login: user,
        },
      },
    };
    this.sendMessage(JSON.stringify(messageArhive));
  }

  private setupSocketHandlers(): void {
    if (!this.socket) return;
    this.socket.onopen = () => {
      if (localStorage.getItem(UserInfo.isLogined)) {
        this.handleAutoLogin();
        this.getActiveUsers();
        this.getInActiveUsers();
      }
    };

    this.socket.onmessage = (event) => {
      const windowError = document.querySelector('.window_error');
      const messageWindowError = document.querySelector('.message');
      const container = document.querySelector('.dialog_content');

      const data = JSON.parse(event.data);
      switch (data.type) {
        case TypeResp.USER_LOGIN:
          if (data.payload.user.isLogined) {
            localStorage.setItem(UserInfo.isLogined, 'true');
            window.location.hash = 'home';
            this.getActiveUsers();
            this.getInActiveUsers();
          }
          break;

        case TypeResp.USER_EXTERNAL_LOGIN:
          this.contactOnline.createContact(data.payload.user);
          break;

        case TypeResp.USER_EXTERNAL_LOGOUT:
          this.contactOffline.createContact(data.payload.user);
          break;

        case TypeResp.USER_ACTIVE:
          this.contactListActive.updateContactList(data.payload.users);

          [data.payload.users].forEach((user) => {
            user.forEach((elem: User) => {
              const userElem = document.getElementById(elem.login);
              userElem?.addEventListener('click', () => {
                if (container) container.innerHTML = '';
                this.getMessage(elem.login);
              });
            });
          });
          break;

        case (data.type === TypeResp.USER_INACTIVE):
          this.contactListInActive.updateContactList(data.payload.users);
          [data.payload.users].forEach((user) => {
            user.forEach((elem: User) => {
              const userElem = document.getElementById(elem.login);
              userElem?.addEventListener('click', () => {
                if (container) container.innerHTML = '';
                this.getMessage(elem.login);
              });
            });
          });
          break;

        case (data.type === TypeResp.MSG_SEND):
          this.readMessage.renderMessage(data);
          break;

        case (data.type === TypeResp.MSG_FROM_USER):
          if (data.payload && Array.isArray(data.payload.messages)) {
            data.payload.messages.forEach((message: Message) => {
              this.readMessage.render(message);
            });
          }
          break;
        default:
          windowError?.classList.add('active');
          if (messageWindowError) {
            messageWindowError.textContent = `Error, ${data.payload.error}`;
          }
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
    };
  }

  close(): void {
    this.socket?.close();
  }
}

export default WebSocketManager;
