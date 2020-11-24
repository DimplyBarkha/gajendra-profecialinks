const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'brake',
    transform,
    domain: 'brake.co.uk',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
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
      const searchUrl = window.location.href;
      addElementToDocument('searchUrl', searchUrl);
    });
    // Href attribute contains invalid url, in order to work with openSearchDefinition in paginate.js invalid link element have to be removed on each page
    await context.evaluate(async function () {
      const nextPageElement = document.querySelector('link[rel="next"]');
      if (nextPageElement) {
        nextPageElement.parentNode.removeChild(nextPageElement);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
