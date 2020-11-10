const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    const addProp = (selector, iterator, propName, value) => {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    };
    const allProducts = document.querySelectorAll('li[class~="salesperson-products-grid-item"]');
    for (let i = 0; i < allProducts.length; i++) {
      const rawData = allProducts[i].querySelector('script[type="text/javascript"]').innerText.trim();
      const cutOnS = rawData.indexOf('{', (rawData.indexOf('{') + 1));
      const cutOnF = rawData.indexOf('}', (rawData.indexOf('}') + 1));
      const rawJson = rawData.substr(cutOnS, cutOnF - cutOnS + 1);
      const data = JSON.parse(rawJson);
      addProp('h2.product-name', i, 'name', data.name);
      addProp('h2.product-name', i, 'id', data.id);
      addProp('h2.product-name', i, 'producturl', data.url);
      addProp('h2.product-name', i, 'manufacturer', data.brand);
      addProp('h2.product-name', i, 'rankorganic', `${i + 1}`);
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 750));

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'alkosto',
    transform: transform,
    domain: 'alkosto.com',
    zipcode: '',
  },
  implementation,
};
