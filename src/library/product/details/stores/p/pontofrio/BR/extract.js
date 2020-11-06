const { transform } = require('../format.js');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    document.querySelectorAll('.container section.accordion .accordion-trigger').forEach(button => button.click());
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'pontofrio',
    transform: transform,
    domain: 'pontofrio.com.br',
    zipcode: '',
  },
  implementation,
};