
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    domain: 'debijenkorf.nl',
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
    const searchUrl = `https://www.debijenkorf.nl/product-lister-page.html?SearchTerm=${inputs.id}`;
    await context.goto(searchUrl, {
      timeout: 30000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    const productDetailsLink = await context.evaluate(async function (inputs) {
      const productList = document.querySelectorAll('ul.productlist__list > li a');
      for (let i = 0; i < productList.length; i++) {
        const productRpc = productList[i].getAttribute('name');
        if (productRpc.includes(inputs.id) || productList.length === 1) {
          return productList[i].getAttribute('href');
        }
      }
      return null;
    }, inputs);
    console.log('product details link');
    console.log(productDetailsLink);
    if (productDetailsLink) {
      const url = productDetailsLink;
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
        const noResults = document.querySelector('div.dbk-search-empty');
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
