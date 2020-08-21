const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function paginate () {
    try {
      const hasNextLink = await context.evaluate((selector) => !!document.querySelector('div[style*="block"]>a.search-results-grid__load-more-results__link'));
      if (hasNextLink) {
        await Promise.all([
          context.click('div[style*="block"]>a.search-results-grid__load-more-results__link'),
          // possible race condition if the data returned too fast, but unlikely
          context.waitForMutuation('div[data-component="SearchResultsGrid"]', { timeout: 20000 }),
        ]);
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.log(error);
    }
  }
  try {
    await context.waitForXPath('//div[@class="bv-off-screen"]');
  } catch (error) {
    console.log('could not load ratings', error);
  }
  let length = await context.evaluate(async function () {
    return document.querySelectorAll('div[data-component="ProductTileSrp"]').length;
  });
  let oldLength = 0;
  while (length && length !== oldLength && length <= 150) {
    oldLength = length;
    await paginate();
    try {
      await context.waitForXPath('//div[@class="bv-off-screen"]');
    } catch (error) {
      console.log('could not load ratings', error);
    }
    length = await context.evaluate(async function () {
      return document.querySelectorAll('div[data-component="ProductTileSrp"]').length;
    });
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'canadiantire',
    transform,
    domain: 'canadiantire.ca',
    zipcode: '',
  },
  implementation,
};
