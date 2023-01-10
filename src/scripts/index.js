/* global tns */

document.addEventListener('DOMContentLoaded', () => {
  const buttonScrollTop = document.querySelector('button[data-scroll-to="top"]');
  const gallery = document.querySelectorAll('.gallery');
  const sliderBase = document.querySelectorAll('.slider[data-slider="base"]');
  const sliderDocs = document.querySelectorAll('.slider[data-slider="docs"]');
  const sliderMobile = document.querySelectorAll('.slider[data-slider="mobile"]');
  const sliderReview = document.querySelectorAll('.slider[data-slider="review"]');

  // custom range
  for (let e of document.querySelectorAll('input[type="range"].range-progress')) {
    e.style.setProperty('--value', e.value);
    e.style.setProperty('--min', e.min == '' ? '0' : e.min);
    e.style.setProperty('--max', e.max == '' ? '100' : e.max);
    e.addEventListener('input', () => e.style.setProperty('--value', e.value));
  }

  // Scroll top
  if (buttonScrollTop) buttonScrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // header init
  function initHeader() {
    const header = document.querySelector('#page-header');
    const wrapper = document.querySelector('#page-wrapper');

    let lastPosititon = 0;

    window.addEventListener('scroll', () => {
      const currentPosititon = window.pageYOffset || document.documentElement.scrollTop;

      if (currentPosititon > lastPosititon && currentPosititon > header.offsetHeight) {
        header.classList.add('header--hide');
        header.classList.remove('header--show');
      }
      if (currentPosititon < lastPosititon && currentPosititon > header.offsetHeight) {
        header.classList.add('header--show');
        header.classList.remove('header--hide');
      }

      lastPosititon = currentPosititon;
    });

    wrapper.style.padding = `${header.offsetHeight}px 0 0 0`;

    window.addEventListener('resize', () => (wrapper.style.padding = `${header.offsetHeight}px 0 0 0`));
  }

  // menu: init
  function initMenu(menuClass) {
    const body = document.body;
    const menu = document.querySelector(`.${menuClass}`);

    if (!menu) return;

    const open = document.querySelector(`[data-open-menu=${menu.id}]`);
    const close = document.querySelector(`[data-close-menu=${menu.id}]`);

    open.addEventListener('click', () => {
      menu.classList.toggle(`${menuClass}--show`);
      body.classList.toggle('--lock');
    });

    close.addEventListener('click', () => {
      menu.classList.remove(`${menuClass}--show`);
      body.classList.remove('--lock');
    });
  }

  // filter: init
  function initFilter(filterClass) {
    const filter = document.querySelector(`.${filterClass}`);

    if (!filter) return;

    const buttons = filter.querySelectorAll(`.${filterClass}__button`);
    const dropdowns = filter.querySelectorAll(`.${filterClass}__dropdown`);

    buttons.forEach((button) => {
      const dropdown = button.nextElementSibling;

      button.addEventListener('click', () => {
        buttons.forEach((item) => {
          if (button !== item) item.classList.remove('filter__button--active');
        });

        dropdowns.forEach((item) => {
          if (dropdown !== item) item.classList.remove('filter__dropdown--active');
        });

        if (button.classList.contains(`${filterClass}__button--active`)) {
          dropdown.classList.remove('filter__dropdown--active');
          button.classList.remove('filter__button--active');
        } else {
          dropdown.classList.add('filter__dropdown--active');
          button.classList.add('filter__button--active');
        }
      });
    });
  }

  // gallery: change Gallery Content
  function changeGalleryContent(currnet, images, thumbs, info) {
    if (images) {
      images.forEach((item) => (item.style['opacity'] = 0));
      images[currnet].style['opacity'] = 1;
    }

    if (thumbs) {
      thumbs.forEach((item) => item.classList.remove('--active'));
      thumbs[currnet].classList.add('--active');
    }

    if (info) {
      info.forEach((item) => (item.style['display'] = 'none'));
      info[currnet].style['display'] = 'block';
    }
  }

  // gallery: init
  function initGallery(galleryClass) {
    const gallery = document.querySelectorAll(`.${galleryClass}`);

    if (!gallery || gallery.length === 0) return;

    gallery.forEach((item) => {
      const descr = item.querySelector(`.${galleryClass}__descr-wrapper`);
      const viewer = item.querySelector(`.${galleryClass}__photo-viewer`);
      const thumbs = item.querySelectorAll(`.${galleryClass}__thumbnails a`);
      const progress = item.querySelector(`.${galleryClass}__progress`);
      const prev = document.querySelector(`.${galleryClass}__button-prev`);
      const next = document.querySelector(`.${galleryClass}__button-next`);
      const value = item.querySelector('span');
      const images = [];
      const info = [];

      let currnet = 0;

      thumbs.forEach((item, index) => {
        const img = document.createElement('img');
        const inf = document.querySelector(`.${galleryClass}-descr`);

        img.src = item.href;
        img.style['opacity'] = 0;

        images.push(img);
        viewer.append(img);

        if (inf) {
          inf.style['display'] = 'none';

          info.push(inf);
          descr.append(inf);
        }

        item.addEventListener('click', (e) => {
          e.preventDefault();

          currnet = index;

          images.forEach((item) => (item.style['opacity'] = 0));
          thumbs.forEach((item) => item.classList.remove('--active'));
          images[index].style['opacity'] = 1;
          item.classList.add('--active');

          if (inf) {
            info.forEach((item) => (item.style['display'] = 'none'));
            info[index].style['display'] = 'block';
          }

          value.style.width = (currnet / (images.length - 1)) * 100 + '%';
        });
      });

      images.forEach((item) => (item.style['opacity'] = 0));
      thumbs[0].classList.add('--active');
      images[0].style['opacity'] = 1;

      if (info.length > 0) {
        info.forEach((item) => (item.style['display'] = 'none'));
        info[0].style['display'] = 'block';
      }

      if (progress) {
        value.style.width = (currnet / (images.length - 1)) * 100 + '%';

        prev.addEventListener('click', () => {
          if (currnet === 0) {
            currnet = images.length - 1;
          } else {
            currnet = currnet - 1;
          }

          changeGalleryContent(currnet, images, thumbs, info);
          value.style.width = (currnet / (images.length - 1)) * 100 + '%';
        });

        next.addEventListener('click', () => {
          if (currnet === images.length - 1) {
            currnet = 0;
          } else {
            currnet = currnet + 1;
          }

          changeGalleryContent(currnet, images, thumbs, info);
          value.style.width = (currnet / (images.length - 1)) * 100 + '%';
        });
      }
    });
  }

  // sliders: init
  function initSilders(sliders, props) {
    if (sliders.length === 0) return;

    sliders.forEach((item) => {
      const progress = item.querySelector('.slider__progress');
      const container = item.querySelector('.slider__container');
      const buttonPrev = item.querySelector('.slider__button-prev');
      const buttonNext = item.querySelector('.slider__button-next');

      const slider = tns({
        container: container,
        prevButton: buttonPrev,
        nextButton: buttonNext,
        gutter: 30,
        items: 1,
        loop: true,
        nav: false,
        ...props,
      });

      if (progress) {
        slider.events.on('indexChanged', () => {
          const count = slider.getInfo().slideCount - 1;
          const index = slider.getInfo().displayIndex - 1;
          const value = progress.querySelector('span');

          value.style.width = (index / count) * 100 + '%';
        });
      }
    });
  }

  if (gallery.length > 0) {
    gallery.forEach((item) => {
      const container = item.querySelector('.gallery__container');
      const buttonPrev = item.querySelector('.gallery__button-prev');
      const buttonNext = item.querySelector('.gallery__button-next');

      const props = {
        container: container,
        prevButton: buttonPrev,
        nextButton: buttonNext,
        gutter: 20,
        items: 3,
        loop: false,
        nav: false,
        responsive: {
          768: { gutter: 30 },
        },
      };

      const direction = document.documentElement.clientWidth >= 768 ? 'vertical' : 'horizontal';

      tns({ ...props, axis: direction });
    });
  }

  initHeader();
  initMenu('filter');
  initMenu('menu-primary');
  initFilter('filter');
  initGallery('gallery');
  initGallery('building');
  initSilders(sliderBase, { responsive: { 768: { items: 2 }, 1200: { items: 3 } } });
  initSilders(sliderDocs, { items: 2, responsive: { 768: { items: 3 }, 1200: { items: 4 } } });
  initSilders(sliderMobile, { responsive: { 768: { disable: true } } });
  initSilders(sliderReview);

  function initTabs(tabsClass) {
    const buttons = document.querySelectorAll(`.${tabsClass}__buttons`);
    const content = document.querySelectorAll(`.${tabsClass}__content`);

    const tabs = {};

    buttons.forEach((btn) => {
      tabs[btn.getAttribute('data-tabs-type')];

      btn.addEventListener('click', () => {
        buttons.classList.remove('--active');
        btn.classList.add('--active');
      });
    });
  }
});
