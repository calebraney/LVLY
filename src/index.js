import { attr } from './utilities';
import { hoverActive } from './interactions/hover-active';
import { scrollIn } from './interactions/scroll-in';
import { scrollSnap } from './interactions/scroll-snap';
import { createSlider } from './interactions/slider';
import { load } from './interactions/load';
import { initLenis } from './interactions/lenis';
import { parallax } from './interactions/parallax';
import { setLightboxCookie, clickLightBox } from './interactions/lightbox-cookie';
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
  //global variables
  let lenis;
  let clickedLink = false;
  const body = document.querySelector('body');

  //////////////////////////////
  //Slider instances
  const aboutSlider = function () {
    const COMPONENT = '.slider_wrap.is-about';
    const components = [...document.querySelectorAll(COMPONENT)];
    const options = {
      slidesPerView: 'auto',
      loop: true,
    };
    //apply a module with defaults settings (canc override them using the options object above)
    const modules = {
      navigation: false,
      pagination: false,
      scrollbar: false,
      autoplay: false,
    };
    const sliders = createSlider(components, options, modules);
  };

  const caseSlider = function () {
    const COMPONENT = '.section_slider.is-case-study';
    const components = [...document.querySelectorAll(COMPONENT)];

    const options = {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      loop: false,
      centeredSlides: false,
      spaceBetween: 20,
      grabCursor: true,
    };
    const modules = {
      navigation: false,
      pagination: true,
      scrollbar: false,
      autoplay: false,
    };
    const sliders = createSlider(components, options, modules);
  };

  //////////////////////////////
  //custom interactions

  //scroll timeline interactions

  const homeLoad = function (isDesktop) {
    const SECTION = '[data-ix-homeload="wrap"]';
    const MAIN_VIDEO = '[data-ix-homeload="video"]';
    const LOGO = '[data-ix-homeload="logo"]';
    const LOGO_PATHS = '[data-ix-homeload="path"]';
    const LINKS = '[data-ix-homeload="link"]';

    //elements
    const section = document.querySelector(SECTION);
    const video = document.querySelector(MAIN_VIDEO);
    const logo = document.querySelector(LOGO);
    const links = [...document.querySelectorAll(LINKS)];
    const logoPaths = [...document.querySelectorAll(LOGO_PATHS)];

    //guard clause
    if (!logo || links.length === 0) return;

    let tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: 'power2.out',
      },
      onStart: () => {
        // document.body.scrollTop = document.documentElement.scrollTop = 0;
        // lenis.stop();
        // links.forEach((link) => {
        //   link.classList.add('u-pointer-events-none');
        // });
      },
      onComplete: () => {
        // lenis.start();
        // homeLogoScroll();
        // links.forEach((link) => {
        //   link.classList.remove('u-pointer-events-none');
        // });
      },
    });
    tl.fromTo(
      video,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        ease: 'power2.out',
        duration: 1.2,
      },
      '<'
    );
    tl.fromTo(
      video,
      {
        yPercent: 5,
        scaleY: 1.05,
      },
      {
        yPercent: 0,
        scaleY: 1,
        duration: 0.8,
        ease: 'power1.inOut',
      },
      '<'
    );
    tl.fromTo(
      logoPaths,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        ease: 'power2.inOut',
        duration: 1.2,
        stagger: { each: 0.2, from: 'start' },
      },
      '<'
    );
    tl.fromTo(
      logo,
      {
        x: isDesktop ? '26em' : '30%',
      },
      {
        x: isDesktop ? '0em' : '0%',
        ease: 'power1.inOut',
      },
      '-=.4'
    );
    tl.fromTo(
      links,
      {
        x: isDesktop ? '-10em' : '-2em;',
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
    const heroLogo = document.querySelector('.hero_home_logo');
    const navLogo = document.querySelector('.nav_logo_svg');
    const otherLogo = navLogo;
    const logo = heroLogo;
    let flipCtx;
    // otherLogo.style.display = 'none';
    // const logoChildren = logo.querySelectorAll('*');
    const heroLogoWrap = document.querySelector('.hero_home_logo_wrap');
    const navLogoWrap = document.querySelector('.nav_logo');
    const heroSection = document.querySelector('.hero_home_wrap');
    //guard clause
    if (!logo || !heroLogoWrap || !navLogoWrap) return;

    const updateLogo = function () {
      flipCtx && flipCtx.revert();

      flipCtx = gsap.context(() => {
        //get state
        let stateHero = Flip.getState([heroLogoWrap, navLogoWrap, logo], { nested: true });
        //modify logo position
        navLogoWrap.insertAdjacentElement('beforeend', logo);

        const flipConfig = {
          ease: 'none',
          absolute: false,
          scale: false,
        };
        const flip = Flip.from(stateHero, flipConfig);

        ScrollTrigger.create({
          trigger: heroSection,
          start: 'bottom 95%',
          end: 'bottom 75%',
          scrub: true,
          animation: flip,
          // onComplete: () => {
          //   logo.style.zIndex = 502;
          // },
          // onStart: () => {
          //   logo.style.zIndex = 0;
          // },
        });
      });
    };
    updateLogo();

    //force page to reload on resize
    let windowWidth = window.innerWidth;
    window.addEventListener('resize', function () {
      if (window.innerWidth !== windowWidth) {
        location.reload();
      }
    });

    const links = document.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        clickedLink = true;
      });
    });

    //force page to top on reaload
    window.onbeforeunload = function () {
      if (!clickedLink) {
        // lenis.scrollTo(heroSection, { duration: 0 });
        body.classList.remove('no-scroll');
        // document.body.scrollTop = document.documentElement.scrollTop = 0;
        window.scrollTo(0, 0);
      }
    };
  };

  /*
  non-scrolltrigger version
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
        markers: false,
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
    if (window.location.pathname !== '/' && lenis !== undefined) {
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
      //get logo container
      // const homeLogo = document.querySelector('.nav_logo');

      //on open and close of nav
      if (navWrap.hasClass('active')) {
        //if homepage hide the logo element
        // if (window.location.pathname === '/') {
        //   gsap.fromTo(homeLogo, { opacity: 1 }, { opacity: 0, duration: 0.4, ease: 'power1.out' });
        // }
        //stop scrolling
        if (lenis !== undefined) {
          lenis.stop();
        } else {
          body.classList.add('no-scroll');
        }
      } else {
        //if homepage show the logo element
        // if (window.location.pathname === '/') {
        //   gsap.fromTo(homeLogo, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.in' });
        // }
        //start scrolling
        if (lenis !== undefined) {
          lenis.start();
        } else {
          body.classList.remove('no-scroll');
        }
      }
    });

    // Close the menu when clicking on any .nav_menu_upper_link if navWrap is active
    menuLinks.on('click', function () {
      if (navWrap.hasClass('active')) {
        navWrap.removeClass('active');
        if (lenis !== undefined) {
          lenis.start();
        } else {
          body.classList.remove('no-scroll');
        }
      }
    });

    // Escape key listener (added once, checks if menu is active)
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && navWrap.hasClass('active')) {
        navWrap.removeClass('active');
        if (lenis !== undefined) {
          lenis.start();
        } else {
          body.classList.remove('no-scroll');
        }
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
      // effect: 'coverflow',
      // coverflowEffect: {
      //   rotate: 0,
      //   scale: 1,
      //   slideShadows: false,
      // },
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

    // Close the overlay when clicking the close icon
    $('[data-close-icon="overlay"]').on('click', function () {
      lightboxWrap.removeClass('active');
      lenis.start(); // Start Lenis when overlay is closed
      $(videos).each(function () {
        this.pause(); // Pause the video
        this.currentTime = 0; // Reset to the start
        $(this).removeAttr('controls'); // Optionally remove controls
      });
    });

    // Close the overlay on pressing the Escape key
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        lightboxWrap.removeClass('active');
        lenis.start(); // Start Lenis when Escape key is pressed
        $(videos).each(function () {
          this.pause(); // Pause the video
          this.currentTime = 0; // Reset to the start
          $(this).removeAttr('controls'); // Optionally remove controls
        });
      }
    });
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
        isDesktopXL: '(min-width: 1920px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (gsapContext) => {
        let { isMobile, isTablet, isDesktop, reduceMotion } = gsapContext.conditions;
        // if not homepage
        if (window.location.pathname !== '/') {
        }
        lenis = initLenis();
        //functional interactions
        load(gsapContext);
        homeLoad(isDesktop);
        hoverActive(gsapContext);
        scrollSnap(lenis);
        aboutSlider();
        caseSlider();

        //OG Interactions
        globalNavbar();
        pageEditorTemplate();
        pageProjectTemplate();

        //lightbox click interactions
        setLightboxCookie();
        clickLightBox();
        //conditional interactions
        if (!reduceMotion) {
          scrollIn(gsapContext);
          if (!isMobile) {
            parallax(gsapContext);
          }
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
