import { attr, checkBreakpoints } from '../utilities';

export const scrollSnap = function (lenis) {
  const WRAP = '[data-ix-scrollsnap="wrap"]';
  const HERO = '[data-ix-scrollsnap="hero-video"]';
  const HERO_WRAP = '[data-ix-scrollsnap="hero-wrap"]';

  const SECTION = '[data-ix-scrollsnap="item"]';
  const SPACER = '[data-ix-scrollsnap="spacer"]';
  const TEXT = '[data-ix-scrollsnap="text"]';
  const IMAGE = '[data-ix-scrollsnap="image"]';

  const sections = [...document.querySelectorAll(SECTION)];
  const spacers = [...document.querySelectorAll(SPACER)];
  const hero = document.querySelector(HERO);
  const heroWrap = document.querySelector(HERO_WRAP);

  //hero section
  let heroTL = gsap.timeline({
    scrollTrigger: {
      trigger: heroWrap,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      markers: false,
    },
    defaults: {
      duration: 1,
      ease: 'none',
    },
  });
  heroTL.fromTo(
    hero,
    {
      yPercent: 0,
    },
    {
      yPercent: 20,
    }
  );

  //work sections

  sections.forEach(function (section, index) {
    const spacer = spacers[index];
    const image = section.querySelector(IMAGE);
    const text = [...section.querySelectorAll(TEXT)];
    const nextSection = sections[index + 1];
    //reverse the order so the first item is on top
    section.style.zIndex = 100 - index;
    section.style.visibility = 'visible';
    // if (index !== 0) {
    let tlIn = gsap.timeline({
      scrollTrigger: {
        trigger: spacer,
        start: 'top bottom',
        end: 'top 0%',
        scrub: true,
        markers: false,
      },
      defaults: {
        duration: 1,
        ease: 'none',
      },
    });
    tlIn.fromTo(
      section,
      {
        yPercent: 20,
      },
      {
        yPercent: 0,
      }
    );
    if (text !== undefined && index !== 0) {
      tlIn.fromTo(
        text,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.5,
        },
        '<.25'
      );
    }
    // }
    // if (index !== sections.length - 1) {
    // console.log(section, index);
    let tlOut = gsap.timeline({
      scrollTrigger: {
        trigger: spacer,
        start: 'bottom 99%',
        end: 'bottom top',
        scrub: true,
        markers: false,
      },
      defaults: {
        duration: 1,
        ease: 'none',
      },
    });
    tlOut.to(section, {
      yPercent: -100,
    });
    // }
  });
};
/*
Scroll Snap code (too buggy)
  $(WRAP).each(function () {
    let wrap = $(this);
    let sections = $(this).find(SECTION);
    let total = sections.length - 1;
    let step = 0;
    let active;
    let animating = false;
    let atTop = false;
    let direction = 1;
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
      setScroll();
    }, 500);

    //function to setup the scroll snap
    function setScroll() {
      //utility functions

      function stopScroll() {
        body.classList.add('no-scroll');
        // console.log('stop scroll');
        lenis.stop();
      }
      function startScroll() {
        body.classList.remove('no-scroll');
        // console.log('start scroll');
        lenis.start();
      }
      function goToTop() {
        // console.log('go to top');
        window.scrollTo(0, wrap.offset().top);
        stopScroll();
      }
      function checkUnlockAtBottom() {
        if (step === total && direction === 1) {
          startScroll();
          // console.log('unlock scroll');
        }
      }

      function animate(number) {
        animating = true;
        let prev = sections.eq(step);
        let active = sections.eq(number);
        let moveDown = step < number;
        let tl = gsap.timeline({
          defaults: {
            ease: 'power2.inOut',
            duration: 0.8,
          },
          onComplete: () => {
            step = number;
            animating = false;
            checkUnlockAtBottom();
          },
        });
        //set active to visible and underneath previous
        tl.set(prev, { zIndex: 3 });
        tl.set(active, { zIndex: 2, visibility: 'visible', opacity: 1 });
        //animate in images
        tl.fromTo(prev.find(IMAGE), { yPercent: 0 }, { yPercent: moveDown ? -100 : 100 }, '<');
        tl.fromTo(active.find(IMAGE), { yPercent: moveDown ? 20 : -20 }, { yPercent: 0 }, '<');
        tl.fromTo(
          prev.find(TEXT),
          { opacity: 1, y: '0rem' },
          {
            opacity: 0,
            y: moveDown ? '-2rem' : '2rem',
            duration: 0.4,
            stagger: 0.2,
            ease: 'power2.in',
          },
          '<.2'
        );
        tl.fromTo(
          active.find(TEXT),
          { opacity: 0, y: moveDown ? '2rem' : '-2rem' },
          { opacity: 1, y: '0rem', duration: 0.4, stagger: 0.2, ease: 'power2.out' },
          '<.4'
        );
        //hide previous
        tl.set(prev, { visibility: 'hidden', zIndex: 0 });
        tl.to({}, { duration: 0.4 });
      }

      function upCallback(self) {
        direction = 1;
        if (animating === false && step < total && atTop) {
          animate(step + 1);
        }
        if (animating === false && atTop) {
          checkUnlockAtBottom();
        }
      }
      function downCallback(self) {
        direction = -1;
        if (animating === false && step > 0 && atTop) {
          animate(step - 1);
        }
        if (animating === false && step === 0 && atTop) {
          startScroll();
        }
      }
      //handle wheel events
      ScrollTrigger.observe({
        target: window,
        type: 'wheel,touch',
        wheelSpeed: -0.3,
        tolerance: 10,
        onUp: (self) => {
          upCallback(self);
          // console.log('up');
        },
        onDown: (self) => {
          // console.log('down');
          downCallback(self);
        },
      });

      ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: '4px top',
        markers: false,
        onLeave: () => {
          atTop = false;
        },
        onEnterBack: () => {
          goToTop();
          atTop = true;
        },
      });

      ScrollTrigger.create({
        trigger: wrap,
        start: 'top 4px',
        end: 'top top',
        markers: false,
        onEnter: () => {
          goToTop();
          atTop = true;
        },
        onLeaveBack: () => {
          atTop = false;
        },
      });

      wrap.find('a').on('click', function () {
        if (atTop) stopScroll();
      });
    }
  });


*/
