import createDomElement from '../createElement/createElement';

class PopUp {
  container: HTMLElement;

  message: HTMLElement;

  btn: HTMLElement;

  constructor() {
    this.container = createDomElement({
      elemType: 'div',
      classNames: ['window_error'],
    });
    this.message = createDomElement({
      elemType: 'p',
      classNames: ['message'],
    });
    this.btn = createDomElement({
      elemType: 'button',
      classNames: ['button'],
      textContent: 'OK',
    });
  }

  render(): void {
    const wrapper = document.querySelector('.wrapper');

    this.btn.addEventListener('click', () => {
      this.container.classList.remove('active');
    });

    if (wrapper) {
      this.container.append(this.message, this.btn);
      wrapper.append(this.container);
    }
  }

  init(): void {
    this.render();
  }
}

export default PopUp;
