const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'tingstad',
    transform,
    domain: 'tingstad.se',
    zipcode: "''",
  },
};
