import createDomElement from '../createElement/createElement';
import BASE_URL from '../varibles/variables';
import WebSocketManager from '../webSocketManager/webSocketManager';
import UserInfo from '../../interfaces/enumUserinfo';

class HeaderChat {
  userName: HTMLElement;

  btnLogOut;

  nameApp;

  private socket: WebSocket;

  constructor() {
    this.userName = createDomElement({
      elemType: 'p',
      classNames: ['user-name'],
    });
    this.btnLogOut = createDomElement({
      elemType: 'button',
      classNames: ['logout'],
      textContent: 'exit',
    });
    this.nameApp = createDomElement({
      elemType: 'h1',
      classNames: ['h1'],
      textContent: 'Fun-Chat',
    });
    this.socket = WebSocketManager.getinstance().connect(BASE_URL);
  }

  private logout(): void {
    const logoutData = {
      id: localStorage.getItem(UserInfo.id),
      type: 'USER_LOGOUT',
      payload: {
        user: {
          login: localStorage.getItem(UserInfo.username),
          password: localStorage.getItem(UserInfo.password),
        },
      },
    };
    localStorage.removeItem(UserInfo.username);
    localStorage.removeItem(UserInfo.password);
    localStorage.removeItem(UserInfo.id);
    localStorage.removeItem(UserInfo.isLogined);
    this.socket.send(JSON.stringify(logoutData));
    window.location.href = '';
  }

  render(): void {
    const headerBlock = document.querySelector('.header-block');
    const username = localStorage.getItem(UserInfo.username);

    this.userName.innerText = `Пользователь: ${username}`;

    if (headerBlock) {
      headerBlock.append(this.userName, this.nameApp, this.btnLogOut);
      this.btnLogOut.addEventListener('click', () => this.logout());
    }
  }

  init(): void {
    this.render();
  }
}

export default HeaderChat;
