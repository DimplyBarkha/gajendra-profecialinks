const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'alloffice',
    transform,
    domain: 'alloffice.se',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    await context.evaluate(async () => {
      const url = window.location.href;
      async function getData (url = '') {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'x-requested-with': 'XMLHttpRequest',
          },
        });
        return response.json();
      };

      const productDetails = await getData(url);
      const divs = document.querySelectorAll('a[data-test-id="product-link"]');
      for (let i = 0; i < divs.length; i++) {
        divs[i].setAttribute('video-link', 'https://www.alloffice.se' + productDetails.products[i].images[0].url.split('?')[0]);
        divs[i].setAttribute('product-id', productDetails.products[i].variationCode);
        divs[i].setAttribute('price', productDetails.products[i].price.current.exclVat + ' kr');
        if (productDetails.products[i].price.current.exclVat !== productDetails.products[i].price.original.exclVat) { divs[i].setAttribute('list-price', productDetails.products[i].price.original.exclVat + ' kr'); }
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
