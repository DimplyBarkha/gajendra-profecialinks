const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    transform: transform,
    domain: 'jpg.fr',
    zipcode: '',
  }, 
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    
    await context.evaluate(async () => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const URL = window.location.href;
      addElementToDocument('pd_url', URL);
    });

    return await context.extract(productDetails, { transform });
  },
};