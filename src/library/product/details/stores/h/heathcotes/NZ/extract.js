const { transform } = require('../format');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    function fetchBrandText () {
      const brandTextSelector = document.querySelector('div[class*="product-detail-container"] a[href*="brands/"] img');
      const brandText = brandTextSelector ? brandTextSelector.alt : '';
      addHiddenDiv('added-brandText', brandText);
    }
    fetchBrandText();
  });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'heathcotes',
    transform,
    domain: 'heathcotes.co.nz',
    zipcode: '',
  },
  implementation,
};
