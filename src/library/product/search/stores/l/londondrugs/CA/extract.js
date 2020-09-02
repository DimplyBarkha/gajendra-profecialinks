const { transform } = require("../../../../shared");

module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "CA",
    store: "londondrugs",
    transform,
    domain: "londondrugs.com",
    zipcode: "",
  },
};
