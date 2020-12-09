const { transform } = require('../shared');
module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "GR",
    store: "e-fresh",
    transform: transform,
    domain: "e-fresh.gr",
    zipcode: "''",
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
