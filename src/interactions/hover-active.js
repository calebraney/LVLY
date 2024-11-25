import { checkBreakpoints } from '../utilities';

export const hoverActive = function (gsapContext) {
  //animation ID
  const ANIMATION_ID = 'hoveractive';
  //elements
  const HOVER_WRAP = '[data-ix-hoveractive="wrap"]';
  //option for active class and default class
  const HOVER_ACTIVE_CLASS = 'data-ix-hoveractive-class';
  const ACTIVE_CLASS = 'is-active';
  // get all links without a no-hover attribute and any other elements with a hover attribute into an array
  const hoverElements = gsap.utils.toArray(HOVER_WRAP);
  hoverElements.forEach((item) => {
    if (!item) return;
    let activeClass = attr(ACTIVE_CLASS, item.getAttribute(HOVER_ACTIVE_CLASS));
    //check breakpoints and quit function if set on specific breakpoints
    let runOnBreakpoint = checkBreakpoints(item, ANIMATION_ID, gsapContext);
    if (runOnBreakpoint === false) return;
    //add event listener to item
    item.addEventListener('mouseover', function (e) {
      item.classList.add(activeClass);
    });
    item.addEventListener('mouseleave', function (e) {
      item.classList.remove(activeClass);
    });
  });
};
