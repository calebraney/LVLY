//Setup
import Lenis from '@studio-freight/lenis';
export const initLenis = function () {
  let homepage = false;
  if (window.location.pathname === '/') {
    homepage = true;
  }
  if (homepage) {
    // document.body.scrollTop = document.documentElement.scrollTop = 0;
    // Prevents back button bug on safari
  }
  const lenis = new Lenis({
    duration: 1,
    // easing: (x) => 1 - Math.cos((x * Math.PI) / 2), // https://easings.net

    //kinda working og ease
    touchMultiplier: 1.5,
    wheelMultiplier: 0.7,
    smoothWheel: true,
    // easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // https://easings.net
    //TRICKS settings
    // lerp: 0.1,
    // gestureOrientation: 'vertical',
    // smoothTouch: false,
    //OTHER IDEAS
    // prevent: (node) => node.classList.contains('work_home_wrap'),
  });
  // lenis request animation from
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Keep lenis and scrolltrigger in sync
  lenis.on('scroll', () => {
    if (!ScrollTrigger) return;
    ScrollTrigger.update();
  });
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  ////////////////////////////
  //Control Scrolling

  // anchor links
  function anchorLinks() {
    const anchorLinks = document.querySelectorAll('[scroll-to]');
    if (anchorLinks == null) {
      return;
    }
    anchorLinks.forEach((item) => {
      const targetID = item.getAttribute('scroll-to');
      const target = document.getElementById(targetID);
      if (!target) return;
      item.addEventListener('click', (event) => {
        lenis.scrollTo(target, {
          duration: 1.85,
          easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        });
      });
    });
  }
  anchorLinks();

  // stop page scrolling
  function stopScroll() {
    const stopScrollLinks = document.querySelectorAll('[scroll="stop"]');
    if (stopScrollLinks == null) {
      return;
    }
    stopScrollLinks.forEach((item) => {
      item.addEventListener('click', (event) => {
        lenis.stop();
      });
    });
  }
  stopScroll();

  // start page scrolling
  function startScroll() {
    const startScrollLinks = document.querySelectorAll('[scroll="start"]');
    if (startScrollLinks == null) {
      return;
    }
    startScrollLinks.forEach((item) => {
      item.addEventListener('click', (event) => {
        lenis.start();
      });
    });
  }
  startScroll();

  // toggle page scrolling
  function toggleScroll() {
    const toggleScrollLinks = document.querySelectorAll('[scroll="toggle"]');
    if (toggleScrollLinks == null) {
      return;
    }
    toggleScrollLinks.forEach((item) => {
      let stopScroll = false;
      item.addEventListener('click', (event) => {
        stopScroll = !stopScroll;
        if (stopScroll) lenis.stop();
        else lenis.start();
      });
    });
  }
  toggleScroll();
  //retun lenis so it can be accessed elsewhere
  return lenis;
};
