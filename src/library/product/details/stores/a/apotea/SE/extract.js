const { transform } = require("../shared");

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'apotea',
    transform,
    domain: 'apotea.se',
    zipcode: '',
  },
};
