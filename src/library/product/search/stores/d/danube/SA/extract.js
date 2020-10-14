const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // If cookie pop up appears then clicking on accept button
  await context.evaluate(async function () {
    const storeButtonSelector = document.querySelector('button.d-store-selector__apply-btn.btn.btn-primary.btn-block');
    storeButtonSelector && storeButtonSelector.click();
    return;
  });

  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SA',
    store: 'danube',
    transform,
    domain: 'danube.sa',
    zipcode: '',
  },
  implementation
};
