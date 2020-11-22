// const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('div.btn-container.nav-first-step');
    await context.click('div.btn-container.nav-first-step i.iconf-modal-close.close-btn');
  } catch (error) {
    console.log('cookie pop up not loded', error);
  }
  const timeout = parameters.timeout ? parameters.timeout : 30000;
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'rappi',
    transform: null,
    domain: 'rappi.com.mx',
    zipcode: '',
  },
  // implementation,
};
