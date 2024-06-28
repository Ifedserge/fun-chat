import createDomElement from '../createElement/createElement';
import { Message, MessageInfo } from '../../interfaces/messageSend';

class ReadMessage {
  render(message: Message): void {
    const container = document.querySelector('.dialog_content');

    const messageBlock = createDomElement({
      elemType: 'div',
      classNames: ['message'],
    });
    const headerMessage = createDomElement({
      elemType: 'div',
      classNames: ['header__message'],
    });
    const messageText = createDomElement({
      elemType: 'p',
      classNames: ['text'],
    });

    const date = new Date(message.datetime);
    const formattedDate = date.toLocaleDateString('ru-RU');
    const formattedTime = date.toLocaleTimeString('ru-RU');
    const statusText = `Delivered: ${message.status.isDelivered}, Read: ${message.status.isReaded}, Edited: ${message.status.isEdited}`;
    const fromUser = createDomElement({
      elemType: 'p',
      classNames: ['username'],
      textContent: `${message.from} (${formattedDate}, ${formattedTime})`,
    });
    const statusMessage = createDomElement({
      elemType: 'p',
      classNames: ['status'],
      textContent: statusText,
    });
    messageText.innerText = message.text;
    headerMessage.append(fromUser, statusMessage);
    messageBlock.append(headerMessage, messageText);
    if (container) {
      container.append(messageBlock);
    }
  }

  renderMessage(message: MessageInfo): void {
    const container = document.querySelector('.dialog_content');
    if (container) {
      const messageBlock = createDomElement({
        elemType: 'div',
        classNames: ['message'],
      });
      const headerMessage = createDomElement({
        elemType: 'div',
        classNames: ['header__message'],
      });
      const messageText = createDomElement({
        elemType: 'p',
        classNames: ['text'],
      });

      const dateFromServer = message.payload.message.datetime;
      const date = new Date(dateFromServer);
      const formattedDate = date.toLocaleDateString('ru-RU');
      const formattedTime = date.toLocaleTimeString('ru-RU');
      const fromUser = createDomElement({
        elemType: 'p',
        classNames: ['username'],
        textContent: `${message.payload.message.from}, (${formattedDate}, ${formattedTime})`,
      });
      const statusMessage = createDomElement({
        elemType: 'p',
        classNames: ['status'],
        textContent: `${message.payload.message.status.isDelivered}`,
      });
      messageText.innerText = `${message.payload.message.text}`;
      headerMessage.append(fromUser, statusMessage);
      messageBlock.append(headerMessage, messageText);
      container.append(messageBlock);
    }
  }
}

export default ReadMessage;
