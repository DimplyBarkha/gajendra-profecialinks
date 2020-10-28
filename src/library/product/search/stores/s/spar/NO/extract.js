const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'spar',
    transform,
    domain: 'spar.no',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const numberOfProductsVisible = document.querySelectorAll('li.ws-product-list-vertical__item') ? document.querySelectorAll('li.ws-product-list-vertical__item').length : 1;
      const allResults = document.querySelector('p.ws-search-result__sum') ? parseInt(document.querySelector('p.ws-search-result__sum').innerText.replace(/\D/g, '')) : 1;
      const maxResults = allResults >= 150 ? 150 : allResults;
      const pageCount = Math.floor(maxResults / numberOfProductsVisible);
      await stall(3000);

      for (let i = 0; i <= pageCount; i++) {
        const moreResultsBtn = document.querySelector('div.ws-search-result-full__footer button');
        if (moreResultsBtn) {
          document.querySelector('div.ws-search-result-full__footer button').scrollIntoView();
          document.querySelector('div.ws-search-result-full__footer button').click();
          await stall(3000);
        }
      }
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    return await context.extract(productDetails, { transform });
  },
};
