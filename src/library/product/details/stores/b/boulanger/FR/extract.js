
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
      // Create videos duration
      const videosSelector = document.querySelectorAll('video.s7Video');
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
    });
    await context.extract(productDetails, { transform });
  },
};
