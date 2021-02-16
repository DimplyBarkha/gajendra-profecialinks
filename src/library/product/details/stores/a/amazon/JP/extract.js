const { transform } = require('../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try {
    await context.waitForXPath("//a[contains(text(), '[Yes]')]", { timeout: 5000 });
  }
  catch (e) {
    console.log('age verification not loaded');
  }
  await context.evaluate(async function () {
    const ageVerification = document.evaluate("//a[contains(text(), '[Yes]')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (ageVerification) {
      ageVerification.click();
    }
  });
  await context.waitForNavigation({ timeout: 5000, waitUntil: 'load' });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'JP',
    store: 'amazon',
    transform,
    domain: 'amazon.co.jp',
    zipcode: '',
  },
  implementation,
};
