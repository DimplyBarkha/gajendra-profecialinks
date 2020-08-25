const { transform } = require("./format");

module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "IE",
    store: "did",
    transform,
    domain: "did.ie",
    zipcode: "",
  },
};
