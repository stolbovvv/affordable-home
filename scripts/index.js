"use strict";

/* global tns */

document.addEventListener('DOMContentLoaded', () => {
  const pageHeader = document.querySelector('body > .wrapper > header');
  const pageWrapper = document.querySelector('body > .wrapper');
  const menuPrimary = document.querySelector('.menu-primary');
  const buttonScrollTop = document.querySelector('button[data-scroll-to="top"]');
  const filter = document.querySelector('.filter');
  const filterOpen = document.querySelector('[data-filter="open"]');
  const filterClose = document.querySelector('[data-filter="close"]');
  const sliderBase = document.querySelectorAll('.slider[data-slider="base"]');
  const sliderMobile = document.querySelectorAll('.slider[data-slider="mobile"]');

  // Header
  let lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  pageWrapper.style.padding = "".concat(pageHeader.offsetHeight, "px 0 0 0");
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
  if (buttonScrollTop) buttonScrollTop.addEventListener('click', () => window.scrollTo({
    top: 0,
    behavior: 'smooth'
  }));

  // Open & toggle hero filter
  if (filterOpen) filterOpen.addEventListener('click', () => filter.classList.toggle('filter--show'));
  if (filterClose) filterClose.addEventListener('click', () => filter.classList.remove('filter--show'));

  // Toggle menu primary
  if (menuPrimary) {
    const buttonOpen = document.querySelector("[data-open-menu=".concat(menuPrimary.id, "]"));
    const buttonClose = menuPrimary.querySelector(".menu-primary__button-close");
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

  // filter
  if (filter) {
    const buttons = filter.querySelectorAll('.filter__button');
    const dropdowns = filter.querySelectorAll('.filter__dropdaown');
    filter.addEventListener('click', e => {
      if (e.target && e.target.classList.contains('filter__button')) {
        dropdowns.forEach(dropdown => {
          if (dropdown === e.target.nextElementSibling && !e.target.classList.contains('filter__button--active')) {
            dropdown.classList.add('filter__dropdaown--active');
          } else {
            dropdown.classList.remove('filter__dropdaown--active');
          }
        });
        buttons.forEach(button => {
          if (button === e.target && !e.target.classList.contains('filter__button--active')) {
            button.classList.add('filter__button--active');
          } else {
            button.classList.remove('filter__button--active');
          }
        });
      }
    });
  } else {
    console.warn('Warning: filter not found on the page...');
  }

  // Sliders
  function updateSliderValue(slider, elem) {
    const count = slider.getInfo().slideCount - 1;
    const index = slider.getInfo().displayIndex - 1;
    const value = elem.querySelector('span');
    value.style.width = index / count * 100 + '%';
  }
  if (sliderBase.length > 0) {
    sliderBase.forEach(item => {
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
            items: 2
          },
          1200: {
            items: 3
          }
        }
      });
      slider.events.on('indexChanged', () => updateSliderValue(slider, progressBar));
    });
  } else {
    console.warn('Warning: slider "base" not found on the page...');
  }
  if (sliderMobile.length > 0) {
    sliderMobile.forEach(item => {
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
            disable: true
          }
        }
      });
      slider.events.on('indexChanged', () => updateSliderValue(slider, progressBar));
    });
  } else {
    console.warn('Warning: slider "mobile" not found on the page...');
  }
});