// const { transform } = require('./trasform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  await context.evaluate(async () => {
    if(document.querySelector('button#age-gate-confirmation')){
      document.querySelector('button#age-gate-confirmation').click();
      await new Promise(r => setTimeout(r, 1000));
    }
  });
  const extractvar = await context.extract(productReviews);
  return extractvar;
}
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'juul',
    transform: null,
    domain: 'juul.co.uk',
    zipcode: '',
  },
  implementation,
};
