const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'exito',
    transform,
    domain: 'exito.com',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let failCount = 0;
        const recordSelector = 'div.vtex-search-result-3-x-gallery div.vtex-search-result-3-x-galleryItem';
        let count = document.querySelectorAll(recordSelector).length;
        while (count < 150) {
          document.querySelector('div[role="presentation"]') && document.querySelector('div[role="presentation"]').parentNode.removeChild(document.querySelector('div[role="presentation"]'));
          document.querySelector('div.exito-geolocation-3-x-modalContainer') && document.querySelector('div.exito-geolocation-3-x-modalContainer').parentNode.removeChild(document.querySelector('div.exito-geolocation-3-x-modalContainer'));
          const oldCount = count;
          document.querySelector('button.bg-action-primary.min-h-small') && document.querySelector('button.bg-action-primary.min-h-small').click();
          await new Promise((resolve, reject) => setTimeout(resolve, 400));
          count = document.querySelectorAll(recordSelector).length;
          if (oldCount === count) {
            failCount++;
            window.scrollBy(0, 1000);
            if (failCount > 4) {
              break;
            }
          } else {
            failCount = 0;
          }
        }
      });
    };
    await applyScroll(context);

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
