const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'farmaline',
    transform,
    domain: 'farmaline.be',
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
      };
      const searchUrl = window.location.href;
      addElementToDocument('searchUrl', searchUrl);

      document.querySelectorAll('ul#articleList > li img').forEach((img) => {
        img.setAttribute('src', img.getAttribute('src').replace('200x200', '800x800'));
      });
    });
    return await context.extract(productDetails, { transform });
  },
};
