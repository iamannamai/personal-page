const travel = require('./travel');

const sidebarMenu = document.querySelector('#sidebar .menu');

sidebarMenu.addEventListener('click', ({ target }) => {
  const { tagName } = target;
  if (tagName === 'A') {
    const currentActive = document.querySelector('.menu a.active');
    if (currentActive !== target) {
      target.classList.add('active');
      currentActive && currentActive.classList.remove('active');
    }
  }
});
