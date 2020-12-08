async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  return await context.extract(productReviews, { transform });
}
const { transform } = require('./shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.es',
    zipcode: "",
  },
  implementation,
};
