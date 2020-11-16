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

    window.scrollTo({ top: 0, behavior: 'smooth' });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));

    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);

    const allProducts = document.querySelectorAll('div[class*=\'products__list-item\']');
    const productUrls = document.querySelectorAll('div[class*=\'products__list-item\'] a[class*=\'preview-product__title\']');
    let productImage;
    for (let i = 0; i < allProducts.length; i++) {
      // eslint-disable-next-line no-undef
      productImage = __SD__.catalogProductsRaw.data[i].img;
      addProp('div[class*=\'products__list-item\']', i, 'productimg', productImage);
      addProp('div[class*=\'products__list-item\']', i, 'rankOrganic', `${i + 1}`);
      addProp('div[class*=\'products__list-item\'] a[class*=\'preview-product__title\']', i, 'productUrl',
        'https://santehnika-online.ru' + productUrls[i].getAttribute('href'));
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
