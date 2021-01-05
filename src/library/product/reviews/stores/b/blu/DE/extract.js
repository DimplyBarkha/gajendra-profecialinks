const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  await context.evaluate(async () => {
    if (document.querySelector('button.sc-1ukymkt-2')) {
      document.querySelector('button.sc-1ukymkt-2').click();
    }
  });
  const extractvar = await context.extract(productReviews);
  return extractvar;
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'blu',
    transform,
    domain: 'blu.com',
    zipcode: '',
  },
  // implementation,
};

