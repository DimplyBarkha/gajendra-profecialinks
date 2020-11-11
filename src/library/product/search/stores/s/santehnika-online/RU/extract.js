const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    }

    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);

    const allProducts = document.querySelectorAll('div[class*=\'products__list-item\']');
    const productUrls = document.querySelectorAll('div[class*=\'products__list-item\'] a[class*=\'preview-product__title\']');
    const productsPrice = document.querySelectorAll('div[class*=\'products__list-item\'] meta[itemprop=\'price\']');
    const productsPriceCurrency = document.querySelectorAll('div[class*=\'products__list-item\'] meta[itemprop=\'priceCurrency\']');

    for (let i = 0; i < allProducts.length; i++) {
      allProducts[i].focus();
      await new Promise((resolve, reject) => setTimeout(resolve, 200));
      addProp('div[class*=\'products__list-item\']', i, 'rankOrganic', `${i + 1}`);
      addProp('div[class*=\'products__list-item\'] a[class*=\'preview-product__title\']', i, 'productUrl',
        'https://santehnika-online.ru/' + productUrls[i].getAttribute('href'));
      addProp('div[class*=\'products__list-item\']', i, 'productPrice',
        productsPrice[i].getAttribute('content') + ' ' + productsPriceCurrency[i].getAttribute('content'));
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'santehnika-online',
    transform: cleanUp,
    domain: 'santehnika-online.ru',
    zipcode: '',
  },
  implementation,
};
