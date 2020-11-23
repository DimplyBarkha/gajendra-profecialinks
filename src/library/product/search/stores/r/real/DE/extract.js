const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'real',
    transform: transform,
    domain: 'real.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="img-wrapper rd-product__image-container"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const URL = window.location.href;
      const products = document.querySelectorAll('div[class="img-wrapper rd-product__image-container"]');
      for (let i = 0; i < products.length; i++) {
        addHiddenDiv('pd_url', URL, i);
      }

    });
    return await context.extract(productDetails, { transform });
  },
};
