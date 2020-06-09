
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    transform: null,
    domain: 'waitrose.com',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    // @TODO - Get totalResults from DOM
    const totalResults = 89
    const resultPerLoad = 48;
    let maxClicks = Math.round(89 / 48) - 1;
    while (maxClicks > 0) {
      console.log('Clicked');
      // @TODO - Add a check for load more selector also i.e click only exists
      await context.click('div.loadMoreWrapper___UneG1 > button');
      await timeout(30000);
      maxClicks--;
    }
    async function timeout (ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    return await context.extract(productDetails, { transform });

  }
};
