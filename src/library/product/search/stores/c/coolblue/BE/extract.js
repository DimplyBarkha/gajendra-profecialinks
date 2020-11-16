const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    transform: transform,
    domain: 'coolblue.be',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
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
    return await context.extract(productDetails, { transform: transformParam });
  },
};
