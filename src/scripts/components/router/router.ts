class Router {
  private routes: { [key: string]: () => void } = {};

  constructor() {
    window.addEventListener('hashchange', this.handleRouterChange.bind(this));
  }

  public init() {
    this.handleRouterChange();
  }

  private handleRouterChange() {
    const hash = window.location.hash.slice(1) || 'login';

    const routeAction = this.routes[hash];
    if (routeAction) {
      routeAction();
    }
  }

  public addRoute(path: string, action: () => void) {
    this.routes[path] = action;
  }
}

export default Router;
