const { transform } = require('./format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  const { transform } = parameters;
  await context.evaluate(async () => {
    try {
      if (document.querySelector('button#age-gate-confirmation')) {
        document.getElementById('age-gate-states').options[1].selected = true;
        document.querySelector('button#age-gate-confirmation').click();
      }
    } catch (e) {
      console.log('error is age verification');
    }
  });
  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'juul',
    transform: transform,
    domain: 'juul.com',
    zipcode: '',
  },
  implementation,
};
