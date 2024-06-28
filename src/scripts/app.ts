import createDomElement from './components/createElement/createElement';
import PopUp from './components/popUp/popUp';
import Login from './page/login/login';
import Home from './page/home/home';
import Router from './components/router/router';
import UserInfo from './interfaces/enumUserinfo';

class App {
  wrapper: HTMLElement;

  login: Login;

  popUp: PopUp;

  home: Home;

  private router: Router;

  btnInfo;

  constructor() {
    this.wrapper = createDomElement({
      elemType: 'div',
      classNames: ['wrapper'],
    });
    this.btnInfo = createDomElement({
      elemType: 'button',
      classNames: ['btn_info'],
      textContent: 'инфо',
    });
    this.popUp = new PopUp();
    this.login = new Login();
    this.home = new Home();
    this.router = new Router();
  }

  conigurateRouter(): void {
    this.router.addRoute('home', () => {
      if (localStorage.getItem(UserInfo.isLogined) === 'true') {
        this.home.init();
      } else {
        window.location.hash = 'login';
      }
    });
    this.router.addRoute('', () => {
      window.location.hash = 'login';
    });
    this.router.addRoute('login', () => {
      this.login.init();
      this.popUp.init();
    });
  }

  userАuthorizationCheck(): boolean {
    const username = localStorage.getItem(UserInfo.username);

    return Boolean(username);
  }

  render(): void {
    const body = document.querySelector('body');

    this.btnInfo.addEventListener('click', () => {
      const windowInfo = createDomElement({
        elemType: 'div',
        classNames: ['info', 'active'],
        textContent: 'Для стабильной работы после входа крайне рекомендую перезагрузить страницу',
      });
      const btnOk = createDomElement({
        elemType: 'button',
        classNames: ['btn__ok'],
        textContent: 'OK',
      });
      btnOk.addEventListener('click', () => {
        windowInfo.classList.remove('active');
      });
      windowInfo.append(btnOk);
      body?.append(windowInfo);
    });
    body?.append(this.wrapper, this.btnInfo);
  }

  init(): void {
    this.render();
    this.popUp.init();
    this.conigurateRouter();
    this.router.init();
  }
}

export default App;
