const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'bueroshop24',
    transform: transform,
    domain: 'bueroshop24.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    const doesPopupExist = await context.evaluate(function () {
      return Boolean(document.querySelector('button[id="uc-btn-accept-banner"]'));
    });

    if (doesPopupExist) {
      await context.click('button[id="uc-btn-accept-banner"]');
    }
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
