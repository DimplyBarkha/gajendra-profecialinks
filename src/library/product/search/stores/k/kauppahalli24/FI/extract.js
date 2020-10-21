const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const response = await context.evaluate(async function () {
    const searchTerm = document.querySelector('div[id*="pd_search_term"]');
    if (searchTerm && searchTerm.innerText) {
      return await fetch(`https://kauppahalli24_fi_api.frosmo.com/?queries=%5B%22${searchTerm.innerText}%22%5D&size=10&from=0&method=productSearch_100`)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    }
  });
  if (response && response.data[0] && response.data[0].products && response.data[0].products[0]) {
    console.log('Products Found!!!!');
    const products = response.data[0].products;
    await context.evaluate(async function (products) {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addDataToDocument (key, value, mainNode) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.getElementById(mainNode).appendChild(catElement);
      }
      const l = products.length;
      for (let index = 0; index < l; index++) {
        const rowId = `pd_div_${index}`;
        const element = products[index];
        if (!document.querySelector(rowId)) {
          addElementToDocument(`pd_div_${index}`, index);
        }
        const searchTerm = document.querySelector('div[id*="pd_search_term"]');
        if (searchTerm && searchTerm.innerText) {
          const searchUrl = `https://kauppahalli24_fi_api.frosmo.com/?queries=%5B%22${searchTerm.innerText}%22%5D&size=10&from=0&method=productSearch_100`;
          !document.querySelector('div[id*="search-url"]') && addElementToDocument('search-url', searchUrl);
        }
        addDataToDocument('id', element.sku, rowId);
        addDataToDocument('pd_url', element.id, rowId);
        element.price && addDataToDocument('pd_price', String(element.price).replace('.', ','), rowId);
        addDataToDocument('pd_name', element.name, rowId);
        addDataToDocument('pd_thumbnail', element.thumbnail, rowId);
      }
    }, products);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'kauppahalli24',
    transform,
    domain: 'kauppahalli24.fi',
    zipcode: '',
  },
  implementation,
};
