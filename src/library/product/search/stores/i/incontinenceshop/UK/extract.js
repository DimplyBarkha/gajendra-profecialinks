const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'incontinenceshop',
    transform: transform,
    domain: 'incontinenceshop.com',
    zipcode: '',
  },
  implementation: async (inputs,
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
      let url = window.location.href;
      try {
        document.getElementById('pd_url').remove();
      } catch (error) {
      }
      addElementToDocument('pd_url', url);
    });
    return await context.extract(productDetails, { transform });
  },
};