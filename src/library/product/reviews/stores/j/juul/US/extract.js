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
      document.querySelector('select#age-gate-states').click();
      await new Promise(r => setTimeout(r, 1000));
      document.querySelector('option[title="Alabama"]').click();
      await new Promise(r => setTimeout(r, 1000));
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
    country: 'US',
    store: 'juul',
    transform: null,
    domain: 'juul.com',
    zipcode: '',
  },
  implementation,
};
