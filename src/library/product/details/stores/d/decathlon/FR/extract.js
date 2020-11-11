const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('.sizes__wrapper.sizes__wrapper--visible .sizes__list .sizes__size')) ? document.querySelectorAll('.sizes__wrapper.sizes__wrapper--visible .sizes__list .sizes__size').length : 0;
  });
  if (variantLength > 1) {
    for (let j = 0; j < variantLength; j++) {
      await context.evaluate(async (j) => {
        return document.querySelectorAll('.sizes__wrapper.sizes__wrapper--visible .sizes__list .sizes__size')[j].click();
      }, j);
      console.log('Inside variants', j);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
    }
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'decathlon',
    transform: transform,
    domain: 'decathlon.fr',
    zipcode: '',
  },
  implementation,
};
