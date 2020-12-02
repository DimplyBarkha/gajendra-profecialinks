
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'rossmann',
    domain: 'rossmann.de',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const searchUrl = `https://www.rossmann.de/de/search/?text=${inputs.id}`;
    await context.goto(searchUrl, {
      timeout: 30000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    const productDetailsLink = await context.evaluate(async function (inputs) {
      const productList = document.querySelectorAll('div.rm-tile-product a.rm-tile-product__image');
      for (let i = 0; i < productList.length; i++) {
        const productRpc = productList[i].getAttribute('data-product-id');
        if (productRpc.includes(inputs.id) || productList.length === 1) {
          return productList[i].getAttribute('href');
        }
      }
      return null;
    }, inputs);
    console.log('product details link');
    console.log(productDetailsLink);
    if (productDetailsLink) {
      const url = `https://www.rossmann.de${productDetailsLink}`;
      await context.goto(url, {
        timeout: 30000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
    } else {
      const noProductsFound = await context.evaluate(function (inputs) {
        const noResults = document.querySelector('div.rm-alert--empty-search');
        return noResults;
      });
      if (noProductsFound || noProductsFound === undefined) {
        try {
          throw new Error('Product not found for the given input');
        } catch (e) {
          console.log('Error while throwing custom error');
        }
      }
    }
  },
};
