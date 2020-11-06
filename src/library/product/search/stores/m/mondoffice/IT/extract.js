const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;

  await context.waitForSelector('#ResultsSection');
  // Check if cookies pop-up appeared
  const doesPopupExist = await context.evaluate(function () {
    return Boolean(document.querySelector('.accept-all-cookies'));
  });
  if (doesPopupExist) {
    await context.click('.accept-all-cookies');
  }
  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    transform,
    domain: 'mondoffice.com',
    zipcode: '',
  },
  implementation,
};
