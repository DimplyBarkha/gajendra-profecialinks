const { transform } = require("../format");
module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "AU",
    store: "joycemayne",
    transform,
    domain: "joycemayne.com.au",
    zipcode: "",
  },
};
