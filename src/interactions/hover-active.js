import { attr, checkBreakpoints } from '../utilities';

export const hoverActive = function (gsapContext) {
  //animation ID
  const ANIMATION_ID = 'hoveractive';
  //elements
  const WRAP = '[data-ix-hoveractive="wrap"]';
  const ITEM = '[data-ix-hoveractive="item"]';
  //options
  const OPTION_ACTIVE_CLASS = 'data-ix-hoveractive-class';
  const OPTION_KEEP_ACTIVE = 'data-ix-hoveractive-keep-active';
  const ACTIVE_CLASS = 'is-active';

  //select all the wrap elements
  const wraps = gsap.utils.toArray(WRAP);

  const activateOnHover = function (parent) {
    const children = parent.querySelectorAll(ITEM);

    let activeClass = attr(ACTIVE_CLASS, parent.getAttribute(OPTION_ACTIVE_CLASS));
    let keepActive = attr(false, parent.getAttribute(OPTION_KEEP_ACTIVE));

    //on each child
    children.forEach((currentItem) => {
      //when hovered in
      currentItem.addEventListener('mouseover', function (e) {
        //go through each child and activate the current item

        children.forEach((child) => {
          if (child === currentItem) {
            child.classList.add(activeClass);
          } else {
            child.classList.remove(activeClass);
          }
        });
      });
      currentItem.addEventListener('mouseleave', function (e) {
        //only remove the active class if keep active is false, otherwise active class will get removed when another item is hovered in
        if (!keepActive) {
          currentItem.classList.remove(activeClass);
        }
      });
    });
  };

  //if wraps exist run on each wrap, otherwise run on the body
  if (wraps.length >= 0) {
    wraps.forEach((wrap) => {
      let runOnBreakpoint = checkBreakpoints(wrap, ANIMATION_ID, gsapContext);
      if (runOnBreakpoint === false) return;
      activateOnHover(wrap);
    });
  } else {
    const body = document.querySelector(body);
    activateOnHover(body);
  }
};
