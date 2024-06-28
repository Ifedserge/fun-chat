import ContactOnline from './contactOnline';
import User from '../../interfaces/user';
import UserInfo from '../../interfaces/enumUserinfo';

class ContactListActive {
  contatctActive: ContactOnline;

  constructor() {
    this.contatctActive = new ContactOnline();
  }

  updateContactList(users: User[]): void {
    const currentUser = localStorage.getItem(UserInfo.username);
    users.forEach((user) => {
      if (user.login !== currentUser) {
        this.contatctActive.createContact(user);
      }
    });
  }
}

export default ContactListActive;
