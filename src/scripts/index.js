/* global tns */

document.addEventListener('DOMContentLoaded', () => {
  const pageHeader = document.querySelector('body > .wrapper > header');
  const pageWrapper = document.querySelector('body > .wrapper');
  const menuPrimary = document.querySelector('.menu-primary');
  const buttonScrollTop = document.querySelector('button[data-scroll-to="top"]');
  const buttonFilterHeroBody = document.querySelector('.banner-hero__filter-body');
  const buttonFilterHeroOpen = document.querySelector('.banner-hero__filter-open');
  const buttonFilterHeroClose = document.querySelector('.banner-hero__filter-close');
  const filterHero = document.querySelector('.filter-hero');
  const sliderBase = document.querySelectorAll('.slider[data-slider="base"]');
  const sliderMobile = document.querySelectorAll('.slider[data-slider="mobile"]');

  // Header
  let lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  pageWrapper.style.padding = `${pageHeader.offsetHeight}px 0 0 0`;

  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollPosition > lastScrollPosition && scrollPosition > pageHeader.offsetHeight) {
      pageHeader.classList.add('header--hide');
      pageHeader.classList.remove('header--show');
    }

    if (scrollPosition < lastScrollPosition && scrollPosition > pageHeader.offsetHeight) {
      pageHeader.classList.add('header--show');
      pageHeader.classList.remove('header--hide');
    }

    lastScrollPosition = scrollPosition;
  });

  // Scroll top
  if (buttonScrollTop) buttonScrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Open hero filter
  if (buttonFilterHeroOpen) {
    buttonFilterHeroOpen.addEventListener('click', () =>
      buttonFilterHeroBody.classList.add('banner-hero__filter-body--active'),
    );
  }

  // close hero filter
  if (buttonFilterHeroClose) {
    buttonFilterHeroClose.addEventListener('click', () => {
      buttonFilterHeroBody.classList.remove('banner-hero__filter-body--active');
    });
  }

  // Toggle menu primary
  if (menuPrimary) {
    const buttonOpen = document.querySelector(`[data-open-menu=${menuPrimary.id}]`);
    const buttonClose = menuPrimary.querySelector(`.menu-primary__button-close`);

    buttonOpen.addEventListener('click', () => {
      menuPrimary.classList.add('menu-primary--show');
      document.body.style.overflow = 'hidden';
    });

    buttonClose.addEventListener('click', () => {
      menuPrimary.classList.remove('menu-primary--show');
      document.body.style.overflow = 'auto';
    });
  } else {
    console.warn('Warning: menu "primary" not found on the page...');
  }

  // filter hero
  if (filterHero) {
    const buttons = filterHero.querySelectorAll('.filter-hero__button');
    const dropdowns = filterHero.querySelectorAll('.filter-hero__dropdaown');

    filterHero.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('filter-hero__button')) {
        dropdowns.forEach((dropdown) => {
          if (dropdown === e.target.nextElementSibling && !e.target.classList.contains('filter-hero__button--active')) {
            dropdown.classList.add('filter-hero__dropdaown--active');
          } else {
            dropdown.classList.remove('filter-hero__dropdaown--active');
          }
        });

        buttons.forEach((button) => {
          if (button === e.target && !e.target.classList.contains('filter-hero__button--active')) {
            button.classList.add('filter-hero__button--active');
          } else {
            button.classList.remove('filter-hero__button--active');
          }
        });
      }
    });
  } else {
    console.warn('Warning: filter "hero" not found on the page...');
  }

  // Sliders
  function updateSliderValue(slider, elem) {
    const count = slider.getInfo().slideCount - 1;
    const index = slider.getInfo().displayIndex - 1;
    const value = elem.querySelector('span');

    value.style.width = (index / count) * 100 + '%';
  }

  if (sliderBase.length > 0) {
    sliderBase.forEach((item) => {
      const container = item.querySelector('.slider__container');
      const buttonPrev = item.querySelector('.slider__button-prev');
      const buttonNext = item.querySelector('.slider__button-next');
      const progressBar = item.querySelector('.slider__progress');

      const slider = tns({
        container: container,
        prevButton: buttonPrev,
        nextButton: buttonNext,
        gutter: 30,
        items: 1,
        loop: true,
        nav: false,

        responsive: {
          768: {
            items: 2,
          },
          1200: {
            items: 3,
          },
        },
      });

      slider.events.on('indexChanged', () => updateSliderValue(slider, progressBar));
    });
  } else {
    console.warn('Warning: slider "base" not found on the page...');
  }

  if (sliderMobile.length > 0) {
    sliderMobile.forEach((item) => {
      const container = item.querySelector('.slider__container');
      const buttonPrev = item.querySelector('.slider__button-prev');
      const buttonNext = item.querySelector('.slider__button-next');
      const progressBar = item.querySelector('.slider__progress');

      const slider = tns({
        container: container,
        prevButton: buttonPrev,
        nextButton: buttonNext,
        gutter: 30,
        items: 1,
        loop: true,
        nav: false,

        responsive: {
          768: {
            disable: true,
          },
        },
      });

      slider.events.on('indexChanged', () => updateSliderValue(slider, progressBar));
    });
  } else {
    console.warn('Warning: slider "mobile" not found on the page...');
  }
});
