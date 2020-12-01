const { transform } = require("./format");

module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "RU",
    store: "planetazdorovo",
    transform: transform,
    domain: "planetazdorovo.ru",
    zipcode: "",
  },
};
