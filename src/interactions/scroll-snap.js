import { attr, checkBreakpoints } from '../utilities';

export const scrollSnap = function (isMobile) {
  const WRAP = '[data-ix-scrollsnap="wrap"]';
  const SECTION = '[data-ix-scrollsnap="item"]';
  const TEXT = '[data-ix-scrollsnap="text"]';
  const IMAGE = '[data-ix-scrollsnap="image"]';

  const wraps = [...document.querySelectorAll(WRAP)];
  const body = document.querySelector('body');

  if (wraps.length === 0) return;

  function stopScroll() {
    body.classList.add('no-scroll');
    // lenis.stop();
  }
  function startScroll() {
    body.classList.remove('no-scroll');
    // lenis.start()
  }

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

    function setScroll() {
      function goToTop() {
        window.scrollTo(0, wrap.offset().top);
        stopScroll();
      }

      function checkUnlock() {
        if (step === total && direction === 1) {
          startScroll();
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
            checkUnlock();
          },
        });
        // tl.fromTo(prev, { opacity: 1 }, { opacity: 0, duration: 0.3 });
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
        // tl.fromTo(active.find(IMAGE), { y: '-10%' }, { y: '0%', duration: 0.3 }, '<');
        //hide previous
        tl.set(prev, { visibility: 'hidden', zIndex: 0 });
        tl.to({}, { duration: 0.4 });
      }

      ScrollTrigger.observe({
        target: window,
        type: 'wheel,touch',
        wheelSpeed: -0.5,
        tolerance: 8,
        onUp: (self) => {
          //   console.log('up');
          direction = 1;
          if (animating === false && step < total && atTop) {
            animate(step + 1);
            // console.log('animate up');
          }
          if (animating === false && atTop) {
            checkUnlock();
            // console.log('check unloack');
          }
        },
        onDown: (self) => {
          //   console.log('down');
          direction = -1;
          if (animating === false && step > 0 && atTop) {
            animate(step - 1);
            // console.log('animate down');
          }
          if (animating === false && step === 0 && atTop) {
            startScroll();
            // console.log('start scroll');
          }
        },
      });

      ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: '4px top',
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
};

/*
Vanilla JS Version (not working)

export const scrollSnap = function () {
  const WRAP = '[data-ix-scrollsnap="wrap"]';
  const SECTION = '[data-ix-scrollsnap="item"]';
  const TEXT = '[data-ix-scrollsnap="text"]';
  const IMAGE = '[data-ix-scrollsnap="image"]';

  const wraps = [...document.querySelectorAll(WRAP)];

  if (wraps.length === 0) return;

  function stopScroll() {
    body.classList.add('no-scroll');
    // lenis.stop();
  }
  function startScroll() {
    body.classList.remove('no-scroll');
    // lenis.start();
  }

  wraps.forEach((wrap) => {
    const sections = [...wrap.querySelectorAll(SECTION)];
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

    function setScroll() {
      function goToTop() {
        window.scrollTo(0, wrap.offset().top);
        stopScroll();
      }

      function checkUnlock() {
        if (step === total && direction === 1) {
          startScroll();
        }
      }

      function animate(number) {
        animating = true;
        let prev = sections[step];
        let active = sections[number];
        let tl = gsap.timeline({
          onComplete: () => {
            step = number;
            animating = false;
            checkUnlock();
          },
        });
        tl.fromTo(prev, { opacity: 1 }, { opacity: 0, duration: 0.3 });
        tl.set(prev, { visibility: 'hidden' });
        tl.set(active, { visibility: 'visible', opacity: 1 });
        // tl.fromTo(
        //   active.querySelectorAll('.char'),
        //   { opacity: 0, y: '1rem' },
        //   { opacity: 1, y: '0em', duration: 0.3, stagger: { amount: 0.3 } }
        // );
        tl.fromTo(
          active.querySelectorAll(TEXT),
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
          '<60%'
        );
        tl.to({}, { duration: 1 });
      }

      ScrollTrigger.observe({
        target: window,
        type: 'wheel,touch',
        wheelSpeed: -1,
        tolerance: 10,
        onUp: (self) => {
          direction = 1;
          if (animating === false && step < total && atTop) {
            animate(step + 1);
          }
          if (animating === false && atTop) {
            checkUnlock();
          }
        },
        onDown: (self) => {
          direction = -1;
          if (animating === false && step > 0 && atTop) {
            animate(step - 1);
          }
          if (animating === false && step === 0 && atTop) {
            startScroll();
          }
        },
      });

      ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: '4px top',
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
        onEnter: () => {
          goToTop();
          atTop = true;
        },
        onLeaveBack: () => {
          atTop = false;
        },
      });

      const links = wrap.querySelectorAll('a');
      links.forEach((link) => {
        link.addEventListener('click', () => {
          //do somethign on hover in
          if (atTop) stopScroll();
        });
      });
    }
  });
};
*/
