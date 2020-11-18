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

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));

    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);

    const allProducts = document.querySelectorAll('li.shelf-item');
    const productUrls = document.querySelectorAll('a[class*="shelf-product-title"]');

    for (let i = 0; i < allProducts.length; i++) {
      allProducts[i].scrollIntoView();
      addProp('li.shelf-item', i, 'rankOrganic', `${i + 1}`);
      addProp('li.shelf-item', i, 'productUrl', 'https://www.jumbo.cl' + productUrls[i].getAttribute('href'));
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CL',
    store: 'jumbo',
    transform: cleanUp,
    domain: 'jumbo.cl',
    zipcode: '',
  },
  implementation,
};
