import { attr, checkBreakpoints } from '../utilities';

export const setLightboxCookie = function () {
  const COOKIE = 'editor-lightbox';
  const LINK = 'data-editor-lightbox';

  const links = [...document.querySelectorAll(`[${LINK}]`)];
  if (links.length === 0) return;

  links.forEach(function (link, index) {
    const id = link.getAttribute(LINK);
    const linkURL = link.getAttribute('href');
    link.addEventListener('click', function (e) {
      e.preventDefault();
      //set cookie
      sessionStorage.setItem(COOKIE, id);
      //redirect to to new page
      window.location.href = linkURL;
    });
  });
};

//click on element if it is set
export const clickLightBox = function () {
  const COOKIE = 'editor-lightbox';
  const id = sessionStorage.getItem(COOKIE);
  // Check if item has been set
  if (id !== null) {
    const item = document.getElementById(id);
    if (!item) return;
    item.click();
    const video = document.querySelector('.swiper-slide-active .lightbox_visual_video video');
    if (video) {
      video.play();
    }
    sessionStorage.removeItem(COOKIE);
  }
};
