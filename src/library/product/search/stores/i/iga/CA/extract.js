const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    transform,
    domain: 'iga.net',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, dependencies) => {
    async function addUrl () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url);
    }
    await context.evaluate(addUrl);
    return await context.extract(dependencies.productDetails, { transform: transformParam });
  },
};
