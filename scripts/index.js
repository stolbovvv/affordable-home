"use strict";

/* global tns */

document.addEventListener('DOMContentLoaded', () => {
  const buttonScrollTop = document.querySelector('button[data-scroll-to="top"]');
  const sliderBase = document.querySelectorAll('.slider[data-slider="base"]');
  const sliderMobile = document.querySelectorAll('.slider[data-slider="mobile"]');
  const sliderReview = document.querySelectorAll('.slider[data-slider="review"]');

  // Scroll top
  if (buttonScrollTop) buttonScrollTop.addEventListener('click', () => window.scrollTo({
    top: 0,
    behavior: 'smooth'
  }));

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
    wrapper.style.padding = "".concat(header.offsetHeight, "px 0 0 0");
    window.addEventListener('resize', () => wrapper.style.padding = "".concat(header.offsetHeight, "px 0 0 0"));
  }

  // menu: init
  function initMenu(menuClass) {
    const body = document.body;
    const menu = document.querySelector(".".concat(menuClass));
    const open = document.querySelector("[data-open-menu=".concat(menu.id, "]"));
    const close = document.querySelector("[data-close-menu=".concat(menu.id, "]"));
    open.addEventListener('click', () => {
      menu.classList.toggle("".concat(menuClass, "--show"));
      body.classList.toggle('--lock');
    });
    close.addEventListener('click', () => {
      menu.classList.remove("".concat(menuClass, "--show"));
      body.classList.remove('--lock');
    });
  }

  // filter init
  function initFilter(filterClass) {
    const filter = document.querySelector(".".concat(filterClass));
    const buttons = filter.querySelectorAll(".".concat(filterClass, "__button"));
    const dropdowns = filter.querySelectorAll(".".concat(filterClass, "__dropdown"));
    buttons.forEach(button => {
      const dropdown = button.nextElementSibling;
      button.addEventListener('click', () => {
        buttons.forEach(item => item.classList.remove('filter__button--active'));
        dropdowns.forEach(item => item.classList.remove('filter__dropdown--active'));
        if (button.classList.contains("".concat(filterClass, "__button--active"))) {
          dropdown.classList.remove('filter__dropdown--active');
          button.classList.remove('filter__button--active');
        } else {
          dropdown.classList.add('filter__dropdown--active');
          button.classList.add('filter__button--active');
        }
      });
    });
  }

  // sliders: init progress
  function updateSliderValue(slider, elem) {
    const count = slider.getInfo().slideCount - 1;
    const index = slider.getInfo().displayIndex - 1;
    const value = elem.querySelector('span');
    value.style.width = index / count * 100 + '%';
  }

  // sliders: init
  function initSilders(sliders, props) {
    if (sliders.length === 0) return;
    sliders.forEach(item => {
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
        ...props
      });
      if (progressBar) slider.events.on('indexChanged', () => updateSliderValue(slider, progressBar));
    });
  }
  initHeader();
  initMenu('filter');
  initMenu('menu-primary');
  initFilter('filter');
  initSilders(sliderBase, {
    responsive: {
      768: {
        items: 2
      },
      1200: {
        items: 3
      }
    }
  });
  initSilders(sliderMobile, {
    responsive: {
      768: {
        disable: true
      }
    }
  });
  initSilders(sliderReview);
});