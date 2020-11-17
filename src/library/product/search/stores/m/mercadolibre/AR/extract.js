const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    const products = document.querySelectorAll('li[class*="layout__item"]');
    products.forEach((product, index) => {
      // set product url
      const productIdArr = document.querySelector('head script:not([type]):not([src])').textContent.match(/dimension49",(.*)\)/)[1].split(',');

      // @ts-ignore
      product.setAttribute('id', productIdArr[index]);

      // set rank
      product.setAttribute('rank', (index + 1).toString());
      // set soldBys
      // @ts-ignore
      const soldBy = product.querySelector('p[class*="store-label"]')
        // @ts-ignore
        ? product.querySelector('p[class*="store-label"]').innerText.split(' ') : null;
      if (soldBy !== null) soldBy.splice(0, 2).join(' ');
      product.setAttribute('soldBy', soldBy);
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AR',
    store: 'mercadolibre',
    transform: transform,
    domain: 'mercadolibre.com.ar',
    zipcode: '',
  },
  implementation,
};
