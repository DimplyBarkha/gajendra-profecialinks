const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    const searchUrl = window.location.href;
    document.querySelectorAll('li[class*="layout__item"]').forEach(e => e.setAttribute('searchurl', searchUrl));
    // set rank
    const products = document.querySelectorAll('li[class*="layout__item"]');
    products.forEach((product, index) => product.setAttribute('rank', `${index + 1}`));
    // set soldBy
    const soldBy = document.querySelectorAll('p[class*="store-label"]');

    // @ts-ignore
    if (soldBy !== null) soldBy.forEach(e => e.setAttribute('soldBy', e.innerText.split('por').pop()));
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
