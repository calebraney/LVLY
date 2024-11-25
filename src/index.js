import { attr } from './utilities';
import { hoverActive } from './interactions/hover-active';
import { scrollIn } from './interactions/scroll-in';
import { load } from './interactions/load';
import { initLenis } from './interactions/lenis';
import { parallax } from './interactions/parallax';

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  console.log('Local Script');
  // register gsap plugins if available
  if (gsap.ScrollTrigger !== undefined) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (gsap.Flip !== undefined) {
    gsap.registerPlugin(Flip);
  }
  //init lenis library
  const lenis = initLenis();
  console.log(lenis);

  //////////////////////////////
  //Functions from Original JS
  // Navbar
  // ============================================
  function globalNavbar() {
    let lastScrollTop = 0;
    const scrollThreshold = 50;
    let isNavbarHidden = false;

    // Check if the current URL is not the homepage
    if (window.location.pathname !== '/') {
      lenis.on('scroll', ({ scroll }) => {
        const nowScrollTop = scroll;

        if (nowScrollTop > lastScrollTop) {
          // Scrolling down
          if (nowScrollTop > scrollThreshold && !isNavbarHidden) {
            // Scroll down past threshold: hide navbar
            $('.nav_contain').addClass('active');
            isNavbarHidden = true;
          }
        } else {
          // Scrolling up
          if (isNavbarHidden) {
            // Scroll up: show navbar instantly
            $('.nav_contain').removeClass('active');
            isNavbarHidden = false;
          }
        }

        lastScrollTop = nowScrollTop;
      });
    }

    // Hamburger toggle
    const hamburger = $('.nav_hamburger'); // Open & close target
    const navWrap = $('.nav_wrap'); // Active class target
    const menuLinks = $('.nav_menu_upper_link'); // Menu links that should close the menu on click

    // Toggle the 'active' class on the hamburger
    hamburger.on('click', function () {
      navWrap.toggleClass('active');

      if (navWrap.hasClass('active')) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    // Close the menu when clicking on any .nav_menu_upper_link if navWrap is active
    menuLinks.on('click', function () {
      if (navWrap.hasClass('active')) {
        navWrap.removeClass('active');
        lenis.start();
      }
    });

    // Escape key listener (added once, checks if menu is active)
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && navWrap.hasClass('active')) {
        navWrap.removeClass('active');
        lenis.start();
      }
    });
  }

  //////////////////////////////
  //Control Functions on page load
  const gsapInit = function () {
    let mm = gsap.matchMedia();
    mm.add(
      {
        //This is the conditions object
        isMobile: '(max-width: 767px)',
        isTablet: '(min-width: 768px)  and (max-width: 991px)',
        isDesktop: '(min-width: 992px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (gsapContext) => {
        let { isMobile, isTablet, isDesktop, reduceMotion } = gsapContext.conditions;
        //functional interactions
        load(gsapContext);
        hoverActive(gsapContext);
        globalNavbar();
        //conditional interactions
        if (!reduceMotion) {
          scrollIn(gsapContext);
          parallax(gsapContext);
        }
      }
    );
  };
  gsapInit();

  //reset gsap on click of reset triggers
  const scrollReset = function () {
    //selector
    const RESET_EL = '[data-ix-reset]';
    //time option
    const RESET_TIME = 'data-ix-reset-time';
    const resetScrollTriggers = document.querySelectorAll(RESET_EL);
    resetScrollTriggers.forEach(function (item) {
      item.addEventListener('click', function (e) {
        //reset scrolltrigger
        ScrollTrigger.refresh();
        //if item has reset timer reset scrolltriggers after timer as well.
        if (item.hasAttribute(RESET_TIME)) {
          let time = attr(1000, item.getAttribute(RESET_TIME));
          //get potential timer reset
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, time);
        }
      });
    });
  };
  scrollReset();
});
