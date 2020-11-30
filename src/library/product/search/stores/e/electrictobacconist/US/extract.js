
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    try {
    // start scrolling until all items are loaded on the page:
      const expectedItems = document.querySelector('div#js-product-listings__top__view-all').textContent;
      const numsOnly = /\d+/gm;
      const expectedItemCount = Number(expectedItems.match(numsOnly)[0]);

      let currentItemsOnPage = document.querySelectorAll('div.product__details__holder').length;

      while (currentItemsOnPage < expectedItemCount) {
        window.scrollTo(0, document.body.scrollHeight);
        // add better waitForSelector instead =>
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const loadMore = document.querySelector('li[class*=infinitescroll-load-more] span.button');
        if (loadMore) loadMore.click();

        currentItemsOnPage = document.querySelectorAll('div.product__details__holder').length;
      }
    } catch (exception) {
      console.log(`There was an error in scrolling: ${exception}`);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'electrictobacconist',
    transform,
    domain: 'electrictobacconist.com',
    zipcode: '',
  },
  implementation,
};
