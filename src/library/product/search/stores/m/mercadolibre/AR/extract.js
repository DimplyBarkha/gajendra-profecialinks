const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    const searchUrl = window.location.href;
    document.querySelectorAll('li[class*="layout__item"]').forEach(e => e.setAttribute('searchurl', searchUrl));
    const products = document.querySelectorAll('li[class*="layout__item"]');
    products.forEach((product, index) => {
      // set product id
      const allAcriptTags = document.querySelectorAll('head script:not([type]):not([src])');
      // @ts-ignore
      const scriptWithId = [...allAcriptTags].filter(e => e.textContent.includes('dimension49"'));
      const productIdArr = scriptWithId[0].textContent.match(/dimension49", "(.*)"\)/)[1].split(',');
      // @ts-ignore
      product.setAttribute('id', productIdArr[index]);

      // set rank
      product.setAttribute('rank', (index + 1).toString());
      // set soldBy
      // @ts-ignore
      const soldBy = product.querySelector('p[class*="store-label"]')
        // @ts-ignore
        ? product.querySelector('p[class*="store-label"]').innerText.split('por') : null;
      if (soldBy !== null) {
        product.setAttribute('soldBy', soldBy.pop());
      }
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
