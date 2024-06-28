import createDomElement from '../../components/createElement/createElement';
import './login.css';
import BASE_URL from '../../components/varibles/variables';
import WebSocketManager from '../../components/webSocketManager/webSocketManager';
import { UserLoginRequest } from '../../interfaces/UserLoginRequsetAndresponse';
import generateId from '../../components/generateId/generateId';
import UserInfo from '../../interfaces/enumUserinfo';
import TypeReq from '../../interfaces/enumTypeReq';
import InputAttributes from '../../interfaces/enumInputAtributes';

class Login {
  loginContainer: HTMLElement;

  form: HTMLElement;

  legend: HTMLElement;

  fieldset: HTMLElement;

  loginBtn;

  private socket: WebSocket;

  constructor() {
    this.loginContainer = createDomElement({
      elemType: 'div',
      classNames: ['login'],
    });
    this.form = createDomElement({
      elemType: 'form',
      classNames: ['form'],
    });
    this.fieldset = createDomElement({
      elemType: 'fieldset',
      classNames: ['fieldset'],
    });
    this.legend = createDomElement({
      elemType: 'legend',
      classNames: ['legend'],
      textContent: 'Авторизация',
    });
    this.loginBtn = createDomElement({
      elemType: 'button',
      classNames: ['login__button'],
      textContent: 'Войти',
    });
    this.socket = WebSocketManager.getinstance().connect(BASE_URL);

    if (this.loginBtn instanceof HTMLButtonElement) {
      this.loginBtn.addEventListener('click', (e) => this.handleLogin(e));
    }
  }

  private handleLogin(event: MouseEvent): void {
    event.preventDefault();
    const inputNameElem = document.getElementById('input_name');
    const inputPassElem = document.getElementById('input_pass');

    if (
      inputNameElem instanceof HTMLInputElement && inputPassElem instanceof HTMLInputElement
    ) {
      const loginData: UserLoginRequest = {
        id: generateId(),
        type: TypeReq.USER_LOGIN,
        payload: {
          user: {
            login: inputNameElem.value,
            password: inputPassElem.value,
          },
        },
      };
      localStorage.setItem(UserInfo.password, inputPassElem.value);
      localStorage.setItem(UserInfo.username, inputNameElem.value);
      this.socket.send(JSON.stringify(loginData));
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  validateName(name: string): boolean {
    const namePattern = /^[А-ЯA-Z][а-яa-zА-ЯA-Z]{1,}$/;
    return namePattern.test(name) && name.length >= 2;
  }

  validatePass(name: string): boolean {
    const passPattern = /^(?=(.*[A-Z]){3,})(?=.*[a-zA-Z0-9]).{6,}$/;
    return passPattern.test(name);
  }

  updateInputStyle(inputElement: HTMLInputElement, isValid: boolean): void {
    if (isValid) {
      inputElement.classList.add('valid-input');
      inputElement.classList.remove('invalid-input');
    } else {
      inputElement.classList.add('invalid-input');
      inputElement.classList.remove('valid-input');
    }
  }

  checkForm(): void {
    const inputNameElem = document.getElementById('input_name');
    const inputPassElem = document.getElementById('input_pass');

    let isValidName = false;
    let isValidPass = false;

    if (inputNameElem instanceof HTMLInputElement) {
      isValidName = this.validateName(inputNameElem.value);
      this.updateInputStyle(inputNameElem, isValidName);
    }
    if (inputPassElem instanceof HTMLInputElement) {
      isValidPass = this.validatePass(inputPassElem.value);
      this.updateInputStyle(inputPassElem, isValidPass);
    }

    if (this.loginBtn instanceof HTMLButtonElement) {
      this.loginBtn.disabled = !(isValidName && isValidPass);
    }
  }

  render(): void {
    const wrapper = document.querySelector('.wrapper');

    const inputName = createDomElement({
      elemType: 'input',
      classNames: ['input__name'],
      atributes: {
        id: InputAttributes.NameId,
        type: InputAttributes.NameType,
        placeholder: InputAttributes.NamePlaceholder,
        title: InputAttributes.NameTitle,
      },
    });

    const inputPass = createDomElement({
      elemType: 'input',
      classNames: ['input__pass'],
      atributes: {
        id: InputAttributes.PassId,
        type: InputAttributes.PassType,
        placeholder: InputAttributes.PassPlaceholder,
        title: InputAttributes.PassTitle,
      },
    });

    inputName.addEventListener('input', () => this.checkForm());
    inputPass.addEventListener('input', () => this.checkForm());

    if (this.loginBtn instanceof HTMLButtonElement) {
      this.loginBtn.disabled = true;
    }

    if (wrapper) {
      wrapper.innerHTML = '';
      this.fieldset.innerHTML = '';
      this.fieldset.append(this.legend, inputName, inputPass);
      this.form.append(this.fieldset, this.loginBtn);
      this.loginContainer.append(this.form);
      wrapper.append(this.loginContainer);
    }
  }

  init(): void {
    this.render();
  }
}

export default Login;
