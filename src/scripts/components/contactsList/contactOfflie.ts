import createDomElement from '../createElement/createElement';
import User from '../../interfaces/user';
import UserInfo from '../../interfaces/enumUserinfo';

class ContactOffline {
  createContact(user: User): void {
    const users = document.querySelector('.users_offline');
    const userContact = document.querySelector(`#${user.login}`);
    const messageContent = document.querySelector('.dialog_content');
    const currentUser = localStorage.getItem(UserInfo.username);

    userContact?.remove();

    if (messageContent instanceof HTMLElement) {
      messageContent.innerHTML = '';
    }
    if (users) {
      if (user.login !== currentUser) {
        const userElement = createDomElement({
          elemType: 'li',
          classNames: ['user'],
          textContent: `${user.login} offline`,
          atributes: {
            id: `${user.login}`,
          },
        });
        users.append(userElement);
        userElement.addEventListener('click', () => {
          if (messageContent instanceof HTMLElement) {
            messageContent.innerHTML = '';
          }
          const dialogHeader = document.querySelector('.dialog_header');

          if (dialogHeader instanceof HTMLElement) {
            const userName = createDomElement({
              elemType: 'p',
              classNames: ['header_dialog_username'],
            });
            const userNameStatus = createDomElement({
              elemType: 'p',
              classNames: ['header_dialog_username_status'],
            });
            dialogHeader.textContent = '';
            userName.innerText = user.login;
            userNameStatus.innerText = 'Offline';
            dialogHeader.append(userName, userNameStatus);
            dialogHeader.style.backgroundColor = 'rgba(73, 217, 57, 0.3)';
          }
        });
      }
    }
  }
}

export default ContactOffline;
