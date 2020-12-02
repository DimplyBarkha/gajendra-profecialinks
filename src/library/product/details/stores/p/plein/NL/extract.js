const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('div.owl-item.active img.owl-lazy')
    //await context.click('div.modal-footer>a.btn-success')
    //await context.click('div.modal-footer > button')
  } catch (error) {
    console.log('cookie pop up not loded', error);
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    transform,
    domain: 'plein.nl',
    zipcode: '',
  },
  implementation,
};
