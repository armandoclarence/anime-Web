const routes = {
    '/': {
        linkLabel: 'Home',
        html: `<main>
            <div class="search">
                <label for="search"></label>
                <input type="text" name="search" id="search">
            </div>
            <div class="container container-card">
            </div>
            <div class="page">
                <button class="prev" disabled>prev</button>
                <button class="next">next</button>
            </div>
            <dialog data-modal>
                <div class="container card-detail"></div>
            </dialog>
        </main>`
    },
    '/genres': {
        linkLabel: 'Genres',
        html: `
            <div class="container">
                <ul class="genres"></ul>
            </div>
        `
    },
};

const app = document.querySelector('.main');
const nav = document.querySelector('#nav');
console.log(app)

const renderNavlinks = () => {
    const navFragment = document.createDocumentFragment();
    Object.keys(routes).forEach(route => {
        console.log(route)
      const { linkLabel } = routes[route];
  
      const linkElement = document.createElement('a')
      linkElement.href = route;
      linkElement.textContent = linkLabel;
      linkElement.className = 'nav-link';
      navFragment.appendChild(linkElement);
    });
  
    nav.append(navFragment);
  };

  console.log(nav)

const registerNavLinks = () => {
    nav.addEventListener('click', (e) => {
      e.preventDefault();
      const { href } = e.target;
      history.pushState({}, "", href);
      navigate(e); // pending implementation
    });
  };

const renderContent = route => app.innerHTML = routes[route].html;
const navigate = e => {
    const route = e.target.pathname;
    history.pushState({}, "", route);
    console.log(route)
    renderContent(route);
};

const registerBrowserBackAndForth = () => {
    window.onpopstate = function (e) {
      const route = location.pathname;
      renderContent(route);
    };
  };
  
  const renderInitialPage = () => {
    const route = location.pathname;
    renderContent(route);
  };

  (function bootup() {
    renderNavlinks()
    registerNavLinks()
    registerBrowserBackAndForth();
    renderInitialPage();
  })();