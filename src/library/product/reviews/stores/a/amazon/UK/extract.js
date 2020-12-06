const { transform } = require('./trasform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;
  const { transform } = parameters;
  
  const extractvar = await context.extract(productReviews, { transform });
  try {
    await context.click('a[data-hook="see-all-reviews-link-foot"]');
    await new Promise(r=>setTimeout(r,5000));
  } catch (error) {
    console.log(error);
  }
 return extractvar;
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    transform,
    domain: 'amazon.co.uk',
    zipcode: '',
  },
  implementation,
};
