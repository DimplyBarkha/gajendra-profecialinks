const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.nl',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails, Helpers, SharedHelpers }) => {
    const sharedhelpers = new SharedHelpers(context);

    async function closeModal () {
      const modal = await sharedhelpers.selectorAvailable('gdpr-cookie-layer--show');
      if (modal) {
        console.log('modal!');
        const modalCloseButton = await sharedhelpers.selectorAvailable('button.gdpr-cookie-layer__btn--submit');
        if (modalCloseButton) {
          await context.click('button.gdpr-cookie-layer__btn--submit');
        }
        if (modalCloseButton) {
          await context.evaluate(async function () {
            document.querySelector('button.gdpr-cookie-layer__btn--submit').click();
          });
        }
      }
    }

    closeModal();

    const videos = await context.evaluate(async function () {
      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return text;
      }
      const videos = [];

      if (document.querySelectorAll('li.thumb--play-video-btn').length) {
        const videosTiles = document.querySelectorAll('li.thumb--play-video-btn');
        [...videosTiles].forEach((element) => {
          const videoButton = element.querySelector('a');
          videoButton.click();
          const vidLink = getEleByXpath('//iframe[contains(@src,"youtube")]/@src');
          videos.push(vidLink);
          document.querySelector('.overlay-bg').click();
        });
      }
      return videos;
    });

    await sharedhelpers.addHiddenInfo('ii_videos', videos.join(' || '));

    const availText = await context.evaluate(async function () {
      return document.querySelector('meta[itemprop="availability"') ? (document.querySelector('meta[itemprop="availability"').getAttribute('content') === 'InStock' ? 'In Stock' : 'Out of Stock') : 'Out of Stock';
    });

    await sharedhelpers.addHiddenInfo('ii_avail', availText);

    closeModal();
    await context.extract(productDetails, { transform: transformParam });
  },
};
