const { transform } = require("./format");

module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "RU",
    store: "planetazdorovo",
    transform: transform,
    domain: "planetazdorovo.ru",
    zipcode: "",
  },
};
