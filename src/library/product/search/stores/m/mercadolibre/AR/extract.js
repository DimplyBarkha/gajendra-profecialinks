// @ts-nocheck
const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    // set id
    const idPrefix = 'MLA';

    const ids = document.querySelectorAll('form[action*="bookmarks"],div[class*="ui-search-result__content-columns"] a[class="ui-search-link"]');
    if (ids !== null) {
      ids.forEach(e => {
        if (e.getAttribute('action') !== null) e.setAttribute('productid', idPrefix.concat(e.getAttribute('action').split('MLA').pop()));

        if (e.getAttribute('href') !== null) e.setAttribute('productid', e.getAttribute('href').match(/MLA\d+/gm).pop());
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
    // reduce number of results

    const last = products.length;
    if (searchUrl.includes('O:pedidosfarma]') || searchUrl.includes('redirect'))sessionStorage.setItem('item1', last);
    if (searchUrl.includes('Desde_51') || searchUrl.includes('Desde_49'))sessionStorage.setItem('item2', last);
    if (searchUrl.includes('Desde_101') || searchUrl.includes('Desde_97'))sessionStorage.setItem('item3', last);
    if (searchUrl.includes('Desde_145'))sessionStorage.setItem('item4', last);
    if ((searchUrl.includes('Desde_101') || searchUrl.includes('Desde_97')) && sessionStorage.getItem('item4') === null) {
      const sum = 150 - parseInt(sessionStorage.getItem('item1')) - parseInt(sessionStorage.getItem('item2'));
      [...products].filter(e => e.getAttribute('rank') > sum)
        .forEach(e => e.setAttribute('trim', ''));
    }
    if (searchUrl.includes('Desde_145') && sessionStorage.getItem('item4') !== null) {
      const sum = 150 - parseInt(sessionStorage.getItem('item1')) - parseInt(sessionStorage.getItem('item2')) - parseInt(sessionStorage.getItem('item3'));
      [...products].filter(e => e.getAttribute('rank') > sum)
        .forEach(e => e.setAttribute('trim', ''));
    }
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
