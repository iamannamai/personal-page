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

const coll = document.getElementsByClassName('collapsible');

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener('click', function() {
    this.classList.toggle('active');

    // Change expand/collapse icon
    const icon = this.querySelector('i');
    icon.className =
      icon.className === 'fas fa-chevron-down'
        ? 'fas fa-chevron-up'
        : 'fas fa-chevron-down';
    const mainContent = this.previousElementSibling;
    const collapsedContent = this.nextElementSibling;

    // Show/hide main content, slide collapsible content in and out
    mainContent.classList.toggle('hide');
    if (collapsedContent.style.maxHeight) {
      collapsedContent.style.maxHeight = null;
    } else {
      collapsedContent.style.maxHeight =
        collapsedContent.scrollHeight * 2 + 'px';
    }
  });
}

const timeline = document.getElementsByClassName('timeline')[0];
const timelines = document.getElementsByClassName('timeline-container');

timeline.style.setProperty(
  'grid-template-columns',
  `repeat(${timelines.length}, 1fr)`
);

for (let i = 0; i < timelines.length; i++) {
  timelines[i].style.setProperty('grid-column', i + 1);
}
