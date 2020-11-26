const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    // set id
    const idPrefix = 'MLA-';
    const prefixUrl = 'https://articulo.mercadolibre.com.ar/';
    const ids = document.querySelectorAll('form[action*="bookmarks"]');
    if (ids !== null) {
      ids.forEach(e => {
        e.setAttribute('productid', idPrefix.concat(e.getAttribute('action').split('MLA').pop()));
        e.setAttribute('producturl', prefixUrl.concat(idPrefix.concat(e.getAttribute('action').split('MLA').pop())));
      });
    };

    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);
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
