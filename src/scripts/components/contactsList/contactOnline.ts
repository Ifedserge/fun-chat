import createDomElement from '../createElement/createElement';
import User from '../../interfaces/user';
import UserInfo from '../../interfaces/enumUserinfo';

class ContactOnline {
  createContact(user: User): void {
    const users = document.querySelector('.users_online');
    const userContact = document.querySelector(`#${user.login}`);
    const messageContent = document.querySelector('.dialog_content');

    userContact?.remove();
    if (messageContent) {
      messageContent.innerHTML = '';
    }

    if (users) {
      if (user.login !== localStorage.getItem(UserInfo.username)) {
        const userElement = createDomElement({
          elemType: 'li',
          classNames: ['user'],
          textContent: `${user.login} online`,
          atributes: {
            id: `${user.login}`,
          },
        });
        users.append(userElement);
        userElement.addEventListener('click', () => {
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
            userNameStatus.innerText = 'Online';
            dialogHeader.append(userName, userNameStatus);
            dialogHeader.style.backgroundColor = 'rgba(73, 217, 57, 0.3)';
          }
        });
      }
    }
  }
}

export default ContactOnline;
