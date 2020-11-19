const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  function addManufacturer () {
    try {
      const manufacturer = __INITIAL_STATE__.product.card.meta.owner.contacts.pop().name;
      document.body.setAttribute('manufacturer', manufacturer);
    } catch (err) {
      console.log('Could not add manufacturer');
    }
  }

  await context.evaluate(addManufacturer);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'albertheijn',
    transform,
    domain: 'ah.nl',
  },implementation
};
