import createDomElement from '../../components/createElement/createElement';
import './home.css';
import HeaderChat from '../../components/headerChat/headerChat';
import BASE_URL from '../../components/varibles/variables';
import WebSocketManager from '../../components/webSocketManager/webSocketManager';
import { MessageSend } from '../../interfaces/messageSend';
import generateId from '../../components/generateId/generateId';
import Footer from '../../components/footer/footer';

class Home {
  main: HTMLElement;

  container: HTMLElement;

  headerBlock: HTMLElement;

  headerChat: HeaderChat;

  messageContainer: HTMLElement;

  sectionContent: HTMLElement;

  dialogHeader: HTMLElement;

  dialogContent: HTMLElement;

  dialogForm;

  dialogInput;

  dialogBtn;

  contactsBlock;

  contactsListOnline;

  contactsListOffline;

  footer;

  footerContent: Footer;

  private socket: WebSocket;

  constructor() {
    this.main = createDomElement({
      elemType: 'main',
      classNames: ['main'],
    });
    this.container = createDomElement({
      elemType: 'div',
      classNames: ['chat__container'],
    });
    this.headerBlock = createDomElement({
      elemType: 'div',
      classNames: ['header-block'],
    });
    this.messageContainer = createDomElement({
      elemType: 'div',
      classNames: ['message__container'],
    });
    this.sectionContent = createDomElement({
      elemType: 'div',
      classNames: ['section__container'],
    });
    this.dialogHeader = createDomElement({
      elemType: 'div',
      classNames: ['dialog_header'],
    });
    this.dialogContent = createDomElement({
      elemType: 'div',
      classNames: ['dialog_content'],
    });
    this.dialogForm = createDomElement({
      elemType: 'form',
      classNames: ['dialog_form'],
    });
    this.dialogInput = createDomElement({
      elemType: 'input',
      classNames: ['dialog_input'],
      atributes: {
        placeholder: 'Введите сообщение',
      },
    });
    this.dialogBtn = createDomElement({
      elemType: 'button',
      classNames: ['dialog_btn'],
      textContent: 'Отправить',
      atributes: {
        disabled: 'true',
      },
    });
    this.contactsBlock = createDomElement({
      elemType: 'div',
      classNames: ['contacts__block'],
    });
    this.contactsListOnline = createDomElement({
      elemType: 'ul',
      classNames: ['users_online'],
    });
    this.contactsListOffline = createDomElement({
      elemType: 'ul',
      classNames: ['users_offline'],
    });
    this.footer = createDomElement({
      elemType: 'div',
      classNames: ['footer'],
    });

    this.headerChat = new HeaderChat();
    this.footerContent = new Footer();
    this.dialogInput.addEventListener('input', () => this.checkInputAndUser());
    this.socket = WebSocketManager.getinstance().connect(BASE_URL);
    if (this.dialogBtn instanceof HTMLButtonElement) {
      this.dialogBtn.addEventListener('click', (e) => this.sendMessage(e));
    }
  }

  checkInputAndUser(): void {
    const userName = document.querySelector('.header_dialog_username');
    const inputMessage = document.querySelector('.dialog_input');

    if (
      inputMessage instanceof HTMLInputElement && this.dialogBtn instanceof HTMLButtonElement
    ) {
      if (userName && inputMessage.value) {
        this.dialogBtn.disabled = false;
      }
    }
  }

  sendMessage(event: MouseEvent): void {
    event.preventDefault();
    const userName = document.querySelector('.header_dialog_username');
    const inputMessage = document.querySelector('.dialog_input');

    if (userName) {
      if (inputMessage instanceof HTMLInputElement) {
        const loginData: MessageSend = {
          id: generateId(),
          type: 'MSG_SEND',
          payload: {
            message: {
              to: `${userName.textContent}`,
              text: inputMessage.value,
            },
          },
        };
        this.socket.send(JSON.stringify(loginData));
        inputMessage.value = '';
        if (this.dialogBtn instanceof HTMLButtonElement) {
          this.dialogBtn.disabled = true;
        }
      }
    }
  }

  render(): void {
    const wrapper = document.querySelector('.wrapper');

    if (wrapper) {
      wrapper.innerHTML = '';
      this.dialogForm.append(this.dialogInput, this.dialogBtn);
      this.messageContainer.append(
        this.dialogHeader,
        this.dialogContent,
        this.dialogForm,
      );
      this.contactsBlock.append(
        this.contactsListOnline,
        this.contactsListOffline,
      );
      this.sectionContent.append(this.messageContainer, this.contactsBlock);
      this.container.append(this.headerBlock, this.sectionContent, this.footer);
      this.main.append(this.container);
      wrapper.append(this.main);
    }
  }

  init() {
    this.render();
    this.headerChat.init();
    this.checkInputAndUser();
    this.footerContent.render();
  }
}

export default Home;
