import { attr } from './utilities';
import { hoverActive } from './interactions/hover-active';
import { scrollIn } from './interactions/scroll-in';
import { load } from './interactions/load';
import { initLenis } from './interactions/lenis';
import { parallax } from './interactions/parallax';
import Swiper from 'swiper';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  // console.log('Local Script');
  // register gsap plugins if available
  if (gsap.ScrollTrigger !== undefined) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (gsap.Flip !== undefined) {
    gsap.registerPlugin(Flip);
  }
  //init lenis library
  const lenis = initLenis();
  //////////////////////////////
  //custom interactions
  //selectors

  //scroll timeline interactions
  const homeLoad = function () {
    const SECTION = '[data-ix-homeload="wrap"]';
    const LOGO = '[data-ix-homeload="logo"]';
    const LOGO_PATHS = '[data-ix-homeload="path"]';
    const LINKS = '[data-ix-homeload="link"]';

    //elements
    const section = document.querySelector(SECTION);
    const logo = document.querySelector(LOGO);
    const links = [...document.querySelectorAll(LINKS)];
    const logoPaths = [...document.querySelectorAll(LOGO_PATHS)];
    const body = document.querySelector('body');

    //guard clause
    if (!logo || links.length === 0) return;

    let tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: 'power2.out',
      },
      // onStart: () => {
      //   window.scrollTo({ top: 0 });
      //   body.style.overflow = 'hidden';
      // },
      onComplete: () => {
        // body.style.overflow = 'clip';
        // homeLogoScroll();
      },
    });
    tl.fromTo(
      logoPaths,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        ease: 'power1.out',
        stagger: { each: 0.1, from: 'start' },
      }
    );
    tl.fromTo(
      logo,
      {
        x: '26em',
      },
      {
        x: '0em',
      }
    );
    tl.fromTo(
      links,
      {
        x: '-10em',
        opacity: 0,
      },
      {
        x: '0em',
        opacity: 1,
        stagger: { each: 0.1, from: 'start' },
      },
      '<.2'
    );
  };

  const homeLogoScroll = function () {
    const logo = document.querySelector('.hero_home_logo');
    // const logoChildren = logo.querySelectorAll('*');
    const heroLogoWrap = document.querySelector('.hero_home_logo_wrap');
    const navLogoWrap = document.querySelector('.nav_logo');
    const heroSection = document.querySelector('.hero_home_wrap');
    //guard clause
    if (!logo || !heroLogoWrap || !navLogoWrap) return;
    const updateLogo = function (moveToHero = false) {
      // if (Flip.isFlipping(logo)) {
      //   // do stuff
      //   Flip.killFlipsOf(logo);
      // }
      let state = Flip.getState(logo, { nested: true });
      //move element
      if (moveToHero) {
        heroLogoWrap.insertAdjacentElement('beforeend', logo);
      } else {
        navLogoWrap.insertAdjacentElement('beforeend', logo);
      }
      // animate element
      Flip.from(state, {
        absolute: true,
        // scale: true,
        duration: 0.6,
        ease: 'power1.inOut',
      });
    };
    // updateLogo(true);
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'center 45%',
        end: 'bottom 100%',
        markers: true,
        onEnter: () => {
          // console.log('enter');
          updateLogo(false);
        },
        onEnterBack: () => {
          // console.log('enter back');
          updateLogo(true);
        },
      },
    });
    //kill flips on browser resize
    let windowWidth = window.innerWidth;
    window.addEventListener('resize', function () {
      if (window.innerWidth !== windowWidth) {
        windowWidth = window.innerWidth;
        //input code you want run after the browser width is changed
        Flip.killFlipsOf(logo);
      }
    });
  };

  // const homeLogoScroll = function () {
  //   const heroLogo = document.querySelector('.hero_home_logo');
  //   const navLogo = document.querySelector('.nav_logo_svg');

  //   const otherLogo = navLogo;
  //   const logo = heroLogo;
  //   otherLogo.style.display = 'none';
  //   // const logoChildren = logo.querySelectorAll('*');
  //   const heroLogoWrap = document.querySelector('.hero_home_logo_wrap');
  //   const navLogoWrap = document.querySelector('.nav_logo');
  //   const heroSection = document.querySelector('.hero_home_wrap');
  //   //guard clause
  //   if (!logo || !heroLogoWrap || !navLogoWrap) return;
  //   const updateLogo = function () {
  //     //move logo
  //     heroLogoWrap.insertAdjacentElement('beforeend', logo);
  //     //get state
  //     let state = Flip.getState([logo, heroLogoWrap, navLogoWrap], { nested: true });
  //     //move logo back
  //     navLogoWrap.insertAdjacentElement('beforeend', logo);

  //     // animate element
  //     Flip.from(state, {
  //       ease: 'none',
  //       absolute: false,
  //       scale: false,
  //       scrollTrigger: {
  //         markers: true,
  //         trigger: heroSection,
  //         start: 'bottom bottom',
  //         end: 'bottom 75%',
  //         scrub: true,
  //       },
  //     });
  //   };
  //   updateLogo();
  // };

  /*
  non-scrolltrigger version
    // const homeLogoScroll = function () {
    const logo = document.querySelector('.hero_home_logo');
    // const logoChildren = logo.querySelectorAll('*');
    const heroLogoWrap = document.querySelector('.hero_home_logo_wrap');
    const navLogoWrap = document.querySelector('.nav_logo');
    const heroSection = document.querySelector('.hero_home_wrap');
    //guard clause
    if (!logo || !heroLogoWrap || !navLogoWrap) return;
    const updateLogo = function (moveToHero = false) {
      if (Flip.isFlipping(logo)) {
        // do stuff
        Flip.killFlipsOf(logo);
      }
      let state = Flip.getState(logo, {});
      //move element
      if (moveToHero) {
        heroLogoWrap.insertAdjacentElement('beforeend', logo);
      } else {
        navLogoWrap.insertAdjacentElement('beforeend', logo);
      }
      // animate element
      Flip.from(state, {
        absolute: true,
        // scale: true,
        duration: 0.6,
        ease: 'power1.inOut',
      });
    };
    updateLogo(true);
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'center 45%',
        end: 'bottom 100%',
        // end: '50% 30%',
        scrub: true,
        markers: true,
        onEnter: () => {
          // console.log('onEnter');
          updateLogo(false);
        },
        onEnterBack: () => {
          // console.log('onEnterBack');
          updateLogo(true);
        },
      },
    });
  };
  */

  /*
  scrolltrigger version?
    // const homeLogoScroll = function () {
    const logo = document.querySelector('.hero_home_logo');
    // const logoChildren = logo.querySelectorAll('*');
    const heroLogoWrap = document.querySelector('.hero_home_logo_wrap');
    const navLogoWrap = document.querySelector('.nav_logo');
    const heroSection = document.querySelector('.hero_home_wrap');
    //guard clause
    if (!logo || !heroLogoWrap || !navLogoWrap) return;
    console.log('hi');
    const updateLogo = function (moveToHero = false) {
      //get state
      let state = Flip.getState(logo);
      //move element
      // if (moveToHero) {
      //   heroLogoWrap.insertAdjacentElement('beforeend', logo);
      // } else {
      // }
      navLogoWrap.insertAdjacentElement('beforeend', logo);
      // animate element
      Flip.from(state, {
        ease: 'none',
        absolute: true,
        scale: true,
        scrollTrigger: {
          trigger: heroSection,
          start: 'bottom 95%',
          end: 'bottom center',
          scrub: 1,
        },
      });
    };
    updateLogo(true);
    // let tl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: heroSection,
    //     start: 'bottom 95%',
    //     end: 'bottom 96%',
    //     scrub: true,
    //     markers: true,
    //     onEnter: () => {
    //       console.log('onEnter');
    //       updateLogo(false);
    //     },
    //     onEnterBack: () => {
    //       console.log('onEnterBack');
    //       // updateLogo(true);
    //     },
    //   },
    // });
  };
  */

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

  // ============================================
  // Project Template Page
  // ============================================
  function pageProjectTemplate() {
    // Project video interaction
    const projectVideos = $('.project_hero_video_wrap');
    //return if items aren't found
    if (projectVideos.length === 0) return;
    projectVideos.on('click', function () {
      const video = $(this).find('video')[0];

      // Add the 'active' class only if it's not already present
      if (!$(this).hasClass('active')) {
        $(this).addClass('active');
      }

      // Play the video
      if (video) {
        video.play();
      }
    });

    // Credits toggle
    const creditsWrapper = $('.project_hero_credits_wrap');
    const creditsContent = $('.project_credits_wrap');
    $('.project_toggle_wrap').on('click', function () {
      creditsWrapper.toggleClass('active');

      if (creditsWrapper.hasClass('active')) {
        const scrollHeight = creditsContent.prop('scrollHeight');
        creditsContent.css('max-height', `${scrollHeight}px`);
      } else {
        creditsContent.css('max-height', '7.5em');
      }
    });
  }

  // ============================================
  // Editor Template Page
  // ============================================
  function pageEditorTemplate() {
    // Lightbox animation
    const lightboxWrap = $('.editor_lightbox_wrap');
    const workLinks = $('.work_link');
    //check if elements are there
    if (lightboxWrap.length === 0) return;

    workLinks.on('click', function () {
      // Toggle the lightbox active state
      lightboxWrap.toggleClass('active');

      if (lightboxWrap.hasClass('active')) {
        lenis.stop(); // Stop Lenis scrolling when lightbox is active

        // Get the data-editor-id of the clicked item
        const editorId = $(this).attr('data-editor-id');

        // Find the corresponding slide with the same data-editor-id
        const correspondingSlide = $('.swiper-slide[data-editor-id="' + editorId + '"]');

        // Get the index of the corresponding slide
        const slideIndex = correspondingSlide.index();

        // Use Swiper's slideTo method to move to the corresponding slide
        lightboxSwiper.slideTo(slideIndex);
      } else {
        lenis.start(); // Start Lenis scrolling when lightbox is inactive
      }
    });

    // Close the overlay when clicking the close icon
    $('[data-close-icon="overlay"]').on('click', function () {
      lightboxWrap.removeClass('active');
      lenis.start(); // Start Lenis when overlay is closed
    });

    // Close the overlay on pressing the Escape key
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        lightboxWrap.removeClass('active');
        lenis.start(); // Start Lenis when Escape key is pressed
      }
    });

    // Editor Lightbox Swiper
    const lightboxSwiper = new Swiper('.swiper.is-editor', {
      modules: [Navigation, EffectCoverflow],
      slidesPerView: 'auto',
      loopedSlides: 3,
      speed: 500,
      loop: true,
      keyboard: true,
      allowTouchMove: false,
      grabCursor: false,
      navigation: {
        nextEl: '.swiper-next',
      },
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 0,
        scale: 0.9,
        slideShadows: false,
      },
    });

    // Play the video of the active slide and show controls
    const videos = $('.lightbox_visual_video video');
    const activeVideo = $('.swiper-slide-active .lightbox_visual_video video');

    // Check if there are any videos on the page
    if (videos.length && activeVideo.length) {
      // Play the video of the active slide and show controls
      activeVideo[0].setAttribute('controls', 'true');
      activeVideo[0].play();

      // Listen for slide change to control video playback
      lightboxSwiper.on('slideChangeTransitionEnd', function () {
        const activeVideo = $('.swiper-slide-active .lightbox_visual_video video');

        // Ensure activeVideo exists before attempting to manipulate it
        if (activeVideo.length) {
          $(videos).each(function () {
            this.pause(); // Pause the video
            this.currentTime = 0; // Reset to the start
            $(this).removeAttr('controls'); // Optionally remove controls
          });

          activeVideo[0].setAttribute('controls', 'true');
          activeVideo[0].play();
        }
      });
    }
  }

  //////////////////////////////
  //Unique page-level functions

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
        homeLoad();
        homeLogoScroll();
        //OG Interactions
        globalNavbar();
        pageProjectTemplate();
        pageEditorTemplate();
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
