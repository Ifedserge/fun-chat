import createDomElement from '../createElement/createElement';

class Footer {
  logo;

  year;

  git;

  constructor() {
    this.logo = createDomElement({
      elemType: 'img',
      classNames: ['logo'],
      atributes: {
        src: 'https://app.rs.school/static/images/logo-rsschool3.png',
        alt: 'logo',
      },
    });
    this.year = createDomElement({
      elemType: 'p',
      classNames: ['year'],
      textContent: '2024',
    });
    this.git = createDomElement({
      elemType: 'a',
      classNames: ['git'],
      textContent: 'GitHub',
      atributes: {
        href: 'https://github.com/Ifedserge',
      },
    });
  }

  render(): void {
    const footer = document.querySelector('.footer');

    if (footer) {
      footer.append(this.logo, this.year, this.git);
    }
  }
}

export default Footer;
