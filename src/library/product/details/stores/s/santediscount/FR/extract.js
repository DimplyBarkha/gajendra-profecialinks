const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'santediscount',
    transform,
    domain: 'santediscount.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { productDetails } = dependencies;
    const { transform } = parameters;

    if (inputs.id) {
      const optionalWait = async (sel) => {
        try {
          await context.waitForSelector(sel, { timeout: 60000 });
        } catch (err) {
          console.log(`Couldn't load selector => ${sel}`);
        }
      };
      await context.evaluate(async function () {
        const isSearchPage = document.querySelector('body[class*="catalogsearch"]') ? document.querySelector('body[class*="catalogsearch"]') : null;
        const noResultsSelector = document.querySelector('div.catalogsearch_no_result--content');
        if (noResultsSelector) {
          throw new Error('No results for this RPC');
        }
        const isSelector = isSearchPage ? document.querySelector('h3.mini-product-name a') : null;
        if (isSelector) {
          try {
            isSelector.click();
            optionalWait('section.product-view-essential');
          } catch (err) {
            console.log('Not clicked' + err);
          }
        }
      });
    }

    await context.evaluate(async function (inputs) {
      const optionalWait = async (sel) => {
        try {
          await context.waitForSelector(sel, { timeout: 60000 });
        } catch (err) {
          console.log(`Couldn't load selector => ${sel}`);
        }
      };
      const response = await fetch(`https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey=ca4sDXq7iXS9YMdnATzw4Opq9kFefC7YimHDEI3WkMLgE&productid=${inputs.id}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=fr_FR`);
      console.log(`https://api.bazaarvoice.com/data/display/0.2alpha/product/summary?PassKey=ca4sDXq7iXS9YMdnATzw4Opq9kFefC7YimHDEI3WkMLgE&productid=${inputs.id}&contentType=reviews,questions&reviewDistribution=primaryRating,recommended&rev=0&contentlocale=fr_FR`);
      if (response.status !== 404) {
        var json = await response.json();
        console.log(`Resultant --> ${JSON.stringify(json)}`);
        document.querySelector('section.product-view-essential').setAttribute('review-total', json.reviewSummary.numReviews);
        document.querySelector('section.product-view-essential').setAttribute('review-average', json.reviewSummary.primaryRating.average);
      } else {
        console.log('404');
      }
      optionalWait('section.product-view-essential');
    }, inputs);
    await context.extract(productDetails, { transform });
  },
};
