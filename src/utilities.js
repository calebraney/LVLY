import SplitType from 'split-type';

// attribute value checker
export const attr = function (defaultVal, attrVal) {
  const defaultValType = typeof defaultVal;
  if (typeof attrVal !== 'string' || attrVal.trim() === '') return defaultVal;
  if (attrVal === 'true' && defaultValType === 'boolean') return true;
  if (attrVal === 'false' && defaultValType === 'boolean') return false;
  if (isNaN(attrVal) && defaultValType === 'string') return attrVal;
  if (!isNaN(attrVal) && defaultValType === 'number') return +attrVal;
  return defaultVal;
};

//split text utility
export const runSplit = function (text, types = 'lines, words') {
  if (!text) return;
  typeSplit = new SplitType(text, {
    types: types,
  });
  return typeSplit;
};

//check for attributes to stop animation on specific breakpoints
export const checkBreakpoints = function (item, animationID, gsapContext) {
  //exit if items aren't found
  if (!item || !animationID || !gsapContext) {
    console.error(`GSAP checkBreakpoints Error in ${animationID}`);
    // if you want this error to stop the interaction return false
    return;
  }
  //create variables from GSAP context
  let { isMobile, isTablet, isDesktop, reduceMotion } = gsapContext.conditions;

  //check to see if GSAP context is working
  if (isMobile === undefined || isTablet === undefined || isDesktop === undefined) {
    console.error(`GSAP Match Media Conditions Not Defined`);
    // if you want this error to stop the interaction return false
    return;
  }
  //breakpoint options
  const RUN_DESKTOP = `data-ix-${animationID}-desktop`;
  const RUN_TABLET = `data-ix-${animationID}-tablet`;
  const RUN_MOBILE = `data-ix-${animationID}-mobile`;
  const RUN_ALL = `data-ix-${animationID}-run`;
  //check breakpoints and quit function if set on specific breakpoints
  runAll = attr(true, item.getAttribute(RUN_ALL));
  runMobile = attr(true, item.getAttribute(RUN_MOBILE));
  runTablet = attr(true, item.getAttribute(RUN_TABLET));
  runDesktop = attr(true, item.getAttribute(RUN_DESKTOP));
  if (runAll === false) return false;
  if (runMobile === false && isMobile) return false;
  if (runTablet === false && isTablet) return false;
  if (runDesktop === false && isDesktop) return false;
  // if no conditions match
  return true;
};