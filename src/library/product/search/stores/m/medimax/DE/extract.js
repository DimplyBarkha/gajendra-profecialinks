const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.click('button.cookies-overlay-dialog__accept-all-btn');
  } catch (err) {
    console.log(err);
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'medimax',
    transform,
    domain: 'medimax.de',
    zipcode: '',
  },
  implementation,
};
