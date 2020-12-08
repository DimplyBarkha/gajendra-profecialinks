const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    transform,
    domain: 'mondoffice.com',
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
      try {
        const text = location.search;
        const start = text.indexOf('&SearchTerm=');
        addElementToDocument('url', location.href);
        addElementToDocument('input', text.slice(start, 100).replace('&SearchTerm=', ''));
      } catch (e) {
        console.log(e);
      };
    });
    return await context.extract(productDetails, { transform });
  },
};
