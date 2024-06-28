import ContactOffline from './contactOfflie';
import User from '../../interfaces/user';
import UserInfo from '../../interfaces/enumUserinfo';

class ContactListInActive {
  contactOffline: ContactOffline;

  constructor() {
    this.contactOffline = new ContactOffline();
  }

  updateContactList(users: User[]): void {
    const currentUser = localStorage.getItem(UserInfo.username);
    users.forEach((user) => {
      if (user.login !== currentUser) {
        this.contactOffline.createContact(user);
      }
    });
  }
}

export default ContactListInActive;
