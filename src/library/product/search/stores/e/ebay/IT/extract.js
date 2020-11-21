const { transform } = require("../shared");

module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "IT",
    store: "ebay",
    transform: transform,
    domain: "ebay.it",
    zipcode: "",
  },
};
