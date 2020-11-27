const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'n11',
    transform,
    domain: 'n11.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const text = location.search.replace('?q=', '');
      const end = text.indexOf('&pg');
      addElementToDocument('search_terms', text.slice(0, end));
      addElementToDocument('url', location.href);
    });
    return await context.extract(productDetails, { transform });
  },
};
