const { transform } = require("../shared");
module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "FR",
    store: "backmarket",
    transform,
    domain: "backmarket.fr",
    zipcode: "",
  },
  implementation: async (
    { inputString },
    { country, domain },
    context,
    { productDetails }
  ) => {
    return await context.extract(productDetails);
  },
};
