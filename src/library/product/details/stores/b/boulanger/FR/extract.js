
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    transform: cleanUp,
    domain: 'boulanger.com',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // Get brand link
      const brandSelector = document.querySelector("span[itemprop='brand']");
      if (brandSelector) {
        const linkBrand = brandSelector.closest('a').getAttribute('href');
        if (linkBrand) {
          document.body.setAttribute('brandhref', `https://www.boulanger.com${linkBrand}`);
        }
      }
      // Click video selector to load video itself
      const videoClick = document.querySelector('td#H5V_Video');
      if (videoClick) {
        // @ts-ignore
        videoClick.click();
      }

      // Create videos duration
      const videosSelector = document.querySelectorAll('video.s7Video, video#jp_video_0');
      videosSelector.forEach(element => {
        // @ts-ignore
        const videoLenght = element.duration;
        element.setAttribute('duration', videoLenght);
      });
      // Create PDF information
      const pdfSelector = document.querySelector('li.notice-pdf-a');
      if (pdfSelector) {
        pdfSelector.setAttribute('pdfpresent', 'Yes');
      }
      // "Click" next images button to load url of images
      let nextImagesSelector = document.querySelector('div.s7button.s7scrollrightbutton');
      if (nextImagesSelector) {
        do {
          nextImagesSelector.dispatchEvent(new Event('mouseup'));
          await new Promise((resolve) => setTimeout(resolve, 1000));
          nextImagesSelector = document.querySelector('div.s7button.s7scrollrightbutton');
        } while (nextImagesSelector.getAttribute('state') !== 'disabled');
      }
      // Is "button for specification" then click
      const specificationButton = document.querySelector('p.endtable-btn.activated > button');
      if (specificationButton) {
        // @ts-ignore
        specificationButton.click();
      }
      // add double pipes to additionalDescBulletInfo
      const additionalDescBulletInfoSelector = document.querySelector('ul.bestpoints-list');
      if (additionalDescBulletInfoSelector) {
        const bullets = additionalDescBulletInfoSelector.querySelectorAll('li');
        bullets.forEach(element => {
          const text = element.innerText;
          const fixedText = `||${text}||`;
          element.innerText = fixedText;
        });
      }
    });
    await context.extract(productDetails, { transform });
  },
};
