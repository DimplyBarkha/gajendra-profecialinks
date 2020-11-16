
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    domain: 'bestbuy.com',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });

    const productLink = await context.evaluate(function () {
      let product = document.querySelector("div.country-selection > a.us-link")
      if(product){
        return product.href;
      }
    });

    if (productLink) {
      await context.goto(productLink, {
        timeout: 30000,
        waitUntil: 'load',
        checkBlocked: true,
        block_ads: false,
        load_all_resources: true,
        images_enabled: true,
        css_enabled: true,
      });
    }
  },
};
