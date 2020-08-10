
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
    loadedSelector: '.sc-product-header-title-container',
    noResultsXPath: '//div[@class="sc-error-page-title"]',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    let { url, id, zipcode, storeId } = inputs;
    if (!url) {
      if (!id) {
        throw new Error('no id provided');
      }
      if (storeId) {
        url = `https://www.samsclub.com/?clubId=${storeId}`;
      } else {
        url = await dependencies.createUrl({ id });
      }
    }

    await dependencies.goto({ url, zipcode, storeId });

    if (storeId) {
      await context.waitForSelector('div.club-name');
      await context.setInputValue('#Search', id);
      await context.clickAndWaitForNavigation('button.sc-search-field-icon');
      await context.waitForSelector('a.sc-product-card-pdp-link');
      await context.clickAndWaitForNavigation('a.sc-product-card-pdp-link');

      await context.evaluate(async function ({ zipcode, storeId }) {
        const productId = document.querySelector('#sc-bv-summary-container') ? document.querySelector('#sc-bv-summary-container').getAttribute('data-bv-product-id') : '';
        const productUrl = `https://www.samsclub.com/api/soa/services/v1/catalog/product/${productId}?response_group=LARGE&clubId=${storeId}`;
        const response = await fetch(productUrl).then(res => res.json());
        if (response) {
          const aggregateRating = response.payload.reviewRating;
          const ratingCount = response.payload.reviewCount;
          document.body.setAttribute('aggregateRating', aggregateRating);
          document.body.setAttribute('ratingCount', ratingCount);
          document.body.setAttribute('variantId', zipcode);
          document.body.setAttribute('driveId', storeId);
        }
      }, { zipcode, storeId });
    }

    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
  },
};
