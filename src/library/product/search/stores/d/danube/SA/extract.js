const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // If cookie pop up appears then clicking on accept button
  let isButtonClicked = false;
  await context.evaluate(async function (isButtonClicked) {
    const storeButtonSelector = document.querySelector('button.d-store-selector__apply-btn.btn.btn-primary.btn-block');
    if (storeButtonSelector && storeButtonSelector.click()) isButtonClicked=true;
    return;
  }, isButtonClicked);

  if (isButtonClicked) await context.waitForNavigation({ timeout: 20000, waitUntil: 'load' });
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
