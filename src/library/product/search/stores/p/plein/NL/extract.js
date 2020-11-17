const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('div.modal-footer')
    await context.click('div.modal-footer>a.btn-success')
    //await context.click('div.modal-footer > button')
  } catch (error) {
    console.log('cookie pop up not loded', error);
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    transform: transform,
    domain: 'plein.nl',
    zipcode: "''",
  },
  implementation,
};
